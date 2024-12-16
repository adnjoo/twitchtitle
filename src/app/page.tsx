import Image from "next/image";
import { Github, Twitch, Webhook } from "lucide-react";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* Logo */}
        <Image
          className=""
          src="/logo.png"
          alt="TwitchTitle logo"
          width={180}
          height={38}
          priority
        />

        {/* Introduction */}
        <h1 className="text-2xl font-bold text-center sm:text-left">
          Automate Your Twitch Stream Titles with <span className="text-purple-600">TwitchTitle</span>
        </h1>
        <p className="text-center sm:text-left text-sm text-gray-600 dark:text-gray-400">
          TwitchTitle helps streamers seamlessly update their Twitch stream titles programmatically. Whether you want to
          keep your titles fresh or integrate with your workflow, we’ve got you covered.
        </p>

        {/* Instructions */}
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Start by connecting your Twitch account and authorizing <strong>TwitchTitle</strong>.
          </li>
          <li>
            Use our API or Chrome extension to dynamically update your stream title.
          </li>
        </ol>

        {/* Actions */}
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-purple-600 text-white gap-2 hover:bg-purple-700 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/api-docs"
          >
            <Webhook size={16} />
            Explore API Docs
          </a>
          <a
            className="rounded-full border border-solid border-gray-300 dark:border-gray-700 transition-colors flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="/get-started"
          >
            Get Started
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/twitchtitle"
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
