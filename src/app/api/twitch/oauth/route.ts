import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/src/utils/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code') as string;
  const userId = searchParams.get('userId') as string;

  if (!code) {
    throw new Error('Missing code parameter');
  }

  try {
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID as string, // Replace with your client ID
        client_secret: process.env.TWITCH_CLIENT_SECRET as string, // Replace with your client secret
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI as string, // Replace with your redirect URI
      }),
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    const data = await response.json();

    const { access_token, refresh_token, expires_in } = data;

    // Convert Unix timestamp to ISO string
    const expires_at = new Date(Date.now() + expires_in * 1000).toISOString();

    console.log('Token exchange response:', data);

    // Save tokens to Supabase
    const { error } = await supabase.from('user_tokens').upsert(
      {
        user_id: userId,
        access_token,
        refresh_token,
        expires_at, // Store expiry as a timestamp
      },
      { onConflict: 'user_id' }
    );

    if (error) {
      console.error('Failed to save tokens in Supabase:', error);
      return new NextResponse('Failed to save tokens', { status: 500 });
    }

    // Set access token as a secure HTTP-only cookie
    const res = new NextResponse(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });

    res.cookies.set('twitch_access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expires_in,
    });

    return res;
  } catch (error) {
    console.error('Token exchange error:', error);
    return new Response('Token exchange error', {
      status: 500,
    });
  }
}
