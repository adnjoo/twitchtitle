import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/src/utils/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { refresh_token } = await request.json();

  try {
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
        client_secret: process.env.TWITCH_CLIENT_SECRET!,
        refresh_token,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      return new NextResponse('Failed to refresh token', { status: 400 });
    }

    const {
      access_token,
      refresh_token: new_refresh_token,
      expires_in,
    } = await response.json();

    // Update Supabase
    await supabase.from('user_tokens').update({
      access_token,
      refresh_token: new_refresh_token,
      expires_at: Math.floor(Date.now() / 1000) + expires_in,
    });

    return new NextResponse(JSON.stringify({ access_token }), { status: 200 });
  } catch (error) {
    console.error('Error refreshing token:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
