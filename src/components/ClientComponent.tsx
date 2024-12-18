'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { PreviousTitles } from '@/src/components/PreviousTitles';
import { createClient } from '@/src/utils/supabase/client';

export type ClientComponentProps = {
  id: string;
  twitchAccessToken?: string;
};

export function ClientComponent({
  id,
  twitchAccessToken,
}: ClientComponentProps) {
  const searchParams = useSearchParams();
  const supabase = createClient();
  const router = useRouter();

  const [error, setError] = useState<any>(null);
  const [streamTitle, setStreamTitle] = useState<string>('');
  const [currentTitle, setCurrentTitle] = useState<string>('');
  const [updateMessage, setUpdateMessage] = useState<string>('');
  const [previousTitles, setPreviousTitles] = useState<string[]>([]);

  // Fetch previous titles from Supabase
  const fetchPreviousTitles = async () => {
    const { data, error } = await supabase
      .from('stream_titles')
      .select('title')
      .eq('user_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching previous titles:', error);
      setError('Failed to load previous titles');
    } else {
      setPreviousTitles(data.map((entry: any) => entry.title));
    }
  };

  // Fetch the current stream title from the API route
  const fetchStreamTitle = async () => {
    if (!twitchAccessToken) return;

    try {
      const response = await fetch(
        `/api/twitch/get-stream-title?broadcaster_id=${id}&access_token=${twitchAccessToken}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch stream title');
      }

      setCurrentTitle(data.title || 'No title found');
    } catch (error) {
      console.error('Error fetching stream title:', error);
      setError('Failed to fetch current stream title');
    }
  };

  useEffect(() => {
    if (twitchAccessToken) {
      fetchStreamTitle();
      fetchPreviousTitles();
    }
  }, [twitchAccessToken]);

  // Handle OAuth token retrieval
  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      fetch(`/api/twitch/oauth?code=${code}&userId=${id}`)
        .then((res) => res.json())
        .then((data) => {
          router.push('/'); // Redirect to home page
        })
        .catch(() => {
          setError('Failed to retrieve token');
        });
    }
  }, [searchParams]);

  const updateStreamTitle = () => {
    if (!twitchAccessToken || !streamTitle) {
      setUpdateMessage('Missing access token or stream title');
      return;
    }

    fetch(`https://api.twitch.tv/helix/channels?broadcaster_id=${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${twitchAccessToken}`,
        'Client-Id': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: streamTitle }),
    })
      .then(async () => {
        setUpdateMessage('Stream title successfully updated!');
        fetchStreamTitle(); // Refresh current title

        // Check for duplicates before inserting into Supabase
        const { data: existingTitles, error: fetchError } = await supabase
          .from('stream_titles')
          .select('title')
          .eq('user_id', id)
          .eq('title', streamTitle);

        if (fetchError) {
          console.error('Error checking for duplicates:', fetchError);
          setError('Failed to validate duplicate titles');
          return;
        }

        if (existingTitles && existingTitles.length > 0) {
          return;
        }

        // Save to Supabase if no duplicates
        const { error } = await supabase.from('stream_titles').insert([
          {
            user_id: id,
            title: streamTitle,
          },
        ]);

        if (!error) {
          fetchPreviousTitles(); // Refresh previous titles
        } else {
          console.error('Error saving to Supabase:', error);
          setError('Failed to save title');
        }
      })
      .catch(() => {
        setUpdateMessage('Failed to update stream title');
      });
  };

  const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize
      ?response_type=code
      &client_id=${process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID}
      &redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}
      &scope=channel%3Amanage%3Abroadcast`.replace(/\s+/g, '');

  return (
    <div className='p-4'>
      <h1 className='mb-4 text-2xl font-bold'>Twitch Stream Title Manager</h1>

      {error && <p className='text-red-500'>{error}</p>}

      {twitchAccessToken ? (
        <div className='rounded-lg bg-gray-100 p-4'>
          <p className='mt-2'>
            <strong>Current Stream Title:</strong>{' '}
            {currentTitle || 'Loading...'}
          </p>
          <div className='mt-4 flex flex-col gap-4'>
            <input
              type='text'
              placeholder='Enter new stream title'
              value={streamTitle}
              onChange={(e) => setStreamTitle(e.target.value)}
              className='mr-2 rounded-lg border border-gray-300 p-2'
            />
            <button
              onClick={updateStreamTitle}
              className='rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600'
            >
              Update Stream Title
            </button>
          </div>
          {updateMessage && (
            <p className='mt-2 text-green-600'>{updateMessage}</p>
          )}

          <PreviousTitles
            setStreamTitle={setStreamTitle}
            previousTitles={previousTitles}
            setPreviousTitles={setPreviousTitles}
            setUpdateMessage={setUpdateMessage}
            supabase={supabase}
            id={id}
            setError={setError}
          />
        </div>
      ) : (
        <a
          className='flex h-10 items-center justify-center rounded-full border border-solid border-gray-300 px-4 text-sm font-bold text-purple-600 transition-colors hover:border-transparent hover:bg-gray-100 sm:h-12 sm:min-w-44 sm:px-5 sm:text-base dark:border-gray-700 dark:hover:bg-gray-800'
          href={twitchAuthUrl}
        >
          Connect with Twitch
        </a>
      )}
    </div>
  );
}
