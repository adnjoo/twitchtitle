import Image from "next/image";
import { Github, Twitch } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { LogoutButton } from "../components/LogoutButton";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          {/* Logo */}
          <Image
            className=""
            src="/wordmark.png"
            alt="TwitchTitle logo"
            width={180}
            height={38}
            priority
          />

          {/* Introduction */}
          <h1 className="text-2xl font-bold text-center sm:text-left">
            Automate Your Twitch Stream Titles with{" "}
            <span className="text-purple-600">TwitchTitle</span>
          </h1>
          <p className="text-center sm:text-left text-sm text-gray-600 dark:text-gray-400">
            TwitchTitle helps streamers seamlessly update their Twitch stream
            titles programmatically. Whether you want to keep your titles fresh
            or integrate with your workflow, we’ve got you covered.
          </p>

          {/* Instructions */}
          <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
            <li className="mb-2">
              Start by connecting your Twitch account and authorizing{" "}
              <strong>TwitchTitle</strong>.
            </li>
            <li>
              Use the app to save and update your stream
              title.
            </li>
          </ol>

          {/* Actions */}
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <a
              className="rounded-full border border-solid border-gray-300 dark:border-gray-700 transition-colors flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
              href="/login"
            >
              Login with Twitch
            </a>
          </div>
        </main>

        {/* Footer */}
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://github.com/adnjoo/twitch-title"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={16} />
            View on GitHub
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://twitch.tv"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitch size={16} />
            Go to Twitch
          </a>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      <h1 className="text-2xl font-semibold">
        Welcome, <span className="text-purple-600">{user.email}</span>!
      </h1>
      <div className="mt-12">
        <LogoutButton />
      </div>
    </div>
  );
}
