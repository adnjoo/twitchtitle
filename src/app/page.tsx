import { cookies } from 'next/headers';

import { ClientComponent } from '@/src/components/ClientComponent';
import { createClient } from '@/src/utils/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const cookieStore = await cookies();
  const twitch_access_token = cookieStore.get('twitch_access_token') as any;
  // console.log('twitch_access_token:', twitch_access_token.value);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className='flex min-h-[80vh] flex-col items-center justify-items-center gap-16 p-8 pb-20 sm:p-10'>
      <main className='row-start-2 flex flex-col items-center gap-8 sm:items-start'>
        {!user ? (
          <>
            {/* Introduction */}
            <h1 className='text-center text-2xl font-bold sm:text-left'>
              Automate Your Twitch Stream Titles with{' '}
              <span className='text-purple-600'>TwitchTitle</span>
            </h1>
            <p className='text-center text-sm text-gray-600 sm:text-left dark:text-gray-400'>
              TwitchTitle helps streamers seamlessly update their Twitch stream
              titles programmatically. Whether you want to keep your titles
              fresh or integrate with your workflow, we’ve got you covered.
            </p>

            {/* Instructions */}
            <ol className='list-inside list-decimal text-center font-[family-name:var(--font-geist-mono)] text-sm sm:text-left'>
              <li className='mb-2'>
                Start by connecting your Twitch account and authorizing{' '}
                <strong>TwitchTitle</strong>.
              </li>
              <li>Use the app to save and update your stream title.</li>
            </ol>

            {/* Actions */}
            <div className='flex flex-col items-center gap-4 sm:flex-row'>
              {/* Twitch OAuth Button */}
              <a
                className='flex h-10 items-center justify-center rounded-full border border-solid border-gray-300 px-4 text-sm font-bold text-purple-600 transition-colors hover:border-transparent hover:bg-gray-100 sm:h-12 sm:min-w-44 sm:px-5 sm:text-base dark:border-gray-700 dark:hover:bg-gray-800'
                href='/login'
              >
                Connect with Twitch
              </a>
            </div>
          </>
        ) : (
          <>
            <h1 className='text-2xl font-semibold'>
              Welcome,{' '}
              <span className='text-purple-600'>{user.user_metadata.name}</span>
              !
            </h1>
            <ClientComponent id={user?.user_metadata.sub} twitchAccessToken={twitch_access_token.value} />
          </>
        )}
      </main>
    </div>
  );
}
