import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { ClientComponent } from "../components/ClientComponent";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(user?.user_metadata.sub);

  // Twitch OAuth URL
  const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize
    ?response_type=code
    &client_id=${process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID}
    &redirect_uri=http://localhost:3000
    &scope=channel%3Amanage%3Abroadcast`.replace(/\s+/g, "");

  return (
    <div className="flex flex-col items-center justify-items-center min-h-[80vh] p-8 pb-20 gap-16 sm:p-10">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {!user ? (
          <>
            {/* Logo */}
            <Image
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
              titles programmatically. Whether you want to keep your titles
              fresh or integrate with your workflow, we’ve got you covered.
            </p>

            {/* Instructions */}
            <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
              <li className="mb-2">
                Start by connecting your Twitch account and authorizing{" "}
                <strong>TwitchTitle</strong>.
              </li>
              <li>Use the app to save and update your stream title.</li>
            </ol>

            {/* Actions */}
            <div className="flex gap-4 items-center flex-col sm:flex-row">
              {/* Twitch OAuth Button */}
              <a
                className="rounded-full border border-solid border-gray-300 dark:border-gray-700 transition-colors flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 text-purple-600 font-bold"
                href="/login"
              >
                Connect with Twitch
              </a>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold">
              Welcome, <span className="text-purple-600">{user.email}</span>!
            </h1>
            <a
              className="rounded-full border border-solid border-gray-300 dark:border-gray-700 transition-colors flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 text-purple-600 font-bold"
              href={twitchAuthUrl}
            >
              Connect with Twitch
            </a>
          </>
        )}
      </main>
      <ClientComponent id={user?.user_metadata.sub} />
    </div>
  );
}
