import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code") as string;

  if (!code) {
    throw new Error("Missing code parameter");
  }

  try {
    const response = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: "s94lkd5spxykxqn88ti3dzwih2v1h1", // Replace with your client ID
        client_secret: "e0weyws1zvrualqjx0lnw3ey0wntwy", // Replace with your client secret
        code: code,
        grant_type: "authorization_code",
        redirect_uri: "http://localhost:3000", // Replace with your redirect URI
      }),
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    const data = await response.json();

    console.log("Token exchange response:", data);
    // Respond with the access token data
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Token exchange error:", error);
    return new Response("Token exchange error", {
      status: 500,
    });
  }
}
