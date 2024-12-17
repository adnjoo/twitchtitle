"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function ClientComponent({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const [tokenData, setTokenData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [streamTitle, setStreamTitle] = useState<string>(""); // Stream title input state
  const [currentTitle, setCurrentTitle] = useState<string>(""); // Current stream title state
  const [updateMessage, setUpdateMessage] = useState<string>("");

  // Handle OAuth token retrieval
  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      fetch(`/api/twitch/oauth?code=${code}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Token response:", data);
          setTokenData(data);
          fetchStreamTitle(data.access_token); // Fetch current title after getting the token
        })
        .catch((err) => {
          console.error("Error exchanging token:", err);
          setError("Failed to retrieve token");
        });
    }
  }, [searchParams]);

  // Function to fetch the current stream title
  const fetchStreamTitle = (accessToken: string) => {
    fetch(`https://api.twitch.tv/helix/channels?broadcaster_id=${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Client-Id": process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID || "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const title = data?.data?.[0]?.title || "No title found";
        console.log("Current stream title:", title);
        setCurrentTitle(title);
      })
      .catch((err) => {
        console.error("Error fetching stream title:", err);
        setError("Failed to fetch current stream title");
      });
  };

  // Function to update the Twitch stream title
  const updateStreamTitle = () => {
    if (!tokenData?.access_token || !streamTitle) {
      setUpdateMessage("Missing access token or stream title");
      return;
    }

    fetch(`https://api.twitch.tv/helix/channels?broadcaster_id=${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Client-Id": process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: streamTitle }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Stream title updated:", data);
        setUpdateMessage("Stream title successfully updated!");
        fetchStreamTitle(tokenData.access_token); // Refresh current title after update
      })
      .catch((err) => {
        console.error("Error updating stream title:", err);
        setUpdateMessage("Failed to update stream title");
      });
  };

  // Twitch OAuth URL
  const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize
      ?response_type=code
      &client_id=${process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID}
      &redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}
      &scope=channel%3Amanage%3Abroadcast`.replace(/\s+/g, "");

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Twitch Stream Title Manager</h1>

      {error && <p className="text-red-500">{error}</p>}

      {tokenData ? (
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="mt-2">
            <strong>Current Stream Title:</strong>{" "}
            {currentTitle || "Loading..."}
          </p>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Enter new stream title"
              value={streamTitle}
              onChange={(e) => setStreamTitle(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg mr-2"
            />
            <button
              onClick={updateStreamTitle}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
            >
              Update Stream Title
            </button>
          </div>
          {updateMessage && (
            <p className="mt-2 text-green-600">{updateMessage}</p>
          )}
        </div>
      ) : (
        <a
          className="rounded-full border border-solid border-gray-300 dark:border-gray-700 transition-colors flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 text-purple-600 font-bold"
          href={twitchAuthUrl}
        >
          Connect with Twitch
        </a>
      )}
    </div>
  );
}
