'use client';

import { createClient } from '@/src/utils/supabase/client';

export default function LoginPage() {
  // Function to sign in using Twitch OAuth
  async function signInWithTwitch() {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'twitch',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Error signing in with Twitch:', error.message);
      alert('Failed to log in. Please try again.');
    } else {
      console.log('Logged in successfully:', data);
    }
  }

  return (
    <div className='flex min-h-[80vh] flex-col items-center justify-center'>
      <div className='rounded-lg p-6 text-center shadow-lg'>
        <h1 className='mb-4 text-3xl font-bold'>Welcome to TwitchTitle</h1>
        <p className='mb-6 text-gray-400'>
          Log in with your Twitch account to get started.
        </p>
        <button
          onClick={signInWithTwitch}
          className='rounded bg-purple-600 px-4 py-2 text-white transition duration-300 hover:bg-purple-700'
        >
          Log in with Twitch
        </button>
      </div>
    </div>
  );
}
