'use client';

import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  // Function to sign in using Twitch OAuth
  async function signInWithTwitch() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "twitch",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });

    if (error) {
      console.error("Error signing in with Twitch:", error.message);
      alert("Failed to log in. Please try again.");
    } else {
      console.log("Logged in successfully:", data);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to TwitchTitle</h1>
        <p className="text-gray-400 mb-6">
          Log in with your Twitch account to get started.
        </p>
        <button
          onClick={signInWithTwitch}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition duration-300"
        >
          Log in with Twitch
        </button>
      </div>
    </div>
  );
}
