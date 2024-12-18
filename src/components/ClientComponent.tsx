'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { createClient } from '@/src/utils/supabase/client';

export function ClientComponent({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [tokenData, setTokenData] = useState<any>(null);
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

  // Handle OAuth token retrieval
  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      fetch(`/api/twitch/oauth?code=${code}&user_id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('Token data:', data);
          fetchStreamTitle();
        })
        .catch(() => {
          setError('Failed to retrieve token');
        });
    }
    fetchPreviousTitles(); // Fetch titles on component load
  }, [searchParams]);

  // Function to fetch the current stream title
  const fetchStreamTitle = async () => {
    const cookie = await fetch('/api/twitch/qwe').then((res) => res.json())
    console.log(cookie.value)
    fetch(`https://api.twitch.tv/helix/channels?broadcaster_id=${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookie.value}`,
        'Client-Id': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID || '',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const title = data?.data?.[0]?.title || 'No title found';
        setCurrentTitle(title);
      })
      .catch(() => {
        setError('Failed to fetch current stream title');
      });
  };

  const updateStreamTitle = () => {
    if (!tokenData?.access_token || !streamTitle) {
      setUpdateMessage('Missing access token or stream title');
      return;
    }

    fetch(`https://api.twitch.tv/helix/channels?broadcaster_id=${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'Client-Id': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: streamTitle }),
    })
      .then(async () => {
        setUpdateMessage('Stream title successfully updated!');
        fetchStreamTitle(tokenData.access_token); // Refresh current title

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
          // setUpdateMessage("Title already exists. No duplicates allowed.");
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

  // Function to delete a title
  const deleteTitle = async (titleToDelete: string) => {
    setUpdateMessage(''); // Clear previous messages
    const { error } = await supabase
      .from('stream_titles')
      .delete()
      .match({ user_id: id, title: titleToDelete });

    if (error) {
      console.error('Error deleting title:', error);
      setError('Failed to delete title');
    } else {
      setPreviousTitles((prev) =>
        prev.filter((title) => title !== titleToDelete)
      );
      setUpdateMessage('Title successfully deleted!');
    }
  };

  // Twitch OAuth URL
  const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize
      ?response_type=code
      &client_id=${process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID}
      &redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}
      &scope=channel%3Amanage%3Abroadcast`.replace(/\s+/g, '');

  return (
    <div className='p-4'>
      <h1 className='mb-4 text-2xl font-bold'>Twitch Stream Title Manager</h1>

      {error && <p className='text-red-500'>{error}</p>}

      {tokenData ? (
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

          {/* Display Previous Titles */}
          <div className='mt-6'>
            <h2 className='mb-2 text-xl font-semibold'>Previous Titles</h2>
            <ul className='list-inside list-disc rounded-lg border bg-white p-4'>
              {previousTitles.length > 0 ? (
                previousTitles.map((title, index) => (
                  <li
                    key={index}
                    className='mb-2 flex items-center justify-between'
                  >
                    <span
                      className='cursor-pointer text-blue-600 hover:underline'
                      onClick={() => setStreamTitle(title)}
                    >
                      {title}
                    </span>
                    <button
                      onClick={() => deleteTitle(title)}
                      className='ml-4 rounded bg-red-500 p-1 text-white hover:bg-red-600'
                    >
                      Delete
                    </button>
                  </li>
                ))
              ) : (
                <p>No previous titles found.</p>
              )}
            </ul>
          </div>
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
