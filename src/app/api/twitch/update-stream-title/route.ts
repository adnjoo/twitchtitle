import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/src/utils/supabase/server';

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { broadcaster_id, access_token, title } = await request.json();

  if (!broadcaster_id || !access_token || !title) {
    return new NextResponse(
      JSON.stringify({
        error: 'Missing broadcaster_id, access_token, or title parameter',
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const response = await fetch(
      `https://api.twitch.tv/helix/channels?broadcaster_id=${broadcaster_id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Client-Id': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update stream title: ${response.statusText}`);
    }

    // Check for duplicates before inserting into Supabase
    const { data: existingTitles, error: fetchError } = await supabase
      .from('stream_titles')
      .select('title')
      .eq('user_id', broadcaster_id)
      .eq('title', title)
      .limit(1);

    if (fetchError) {
      throw new Error('Error checking for duplicates in Supabase');
    }

    if (existingTitles && existingTitles.length > 0) {
      return new NextResponse(
        JSON.stringify({ message: 'Title already exists. No duplicates allowed.' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Save to Supabase if no duplicates
    const { error: insertError } = await supabase.from('stream_titles').insert([
      {
        user_id: broadcaster_id,
        title,
      },
    ]);

    if (insertError) {
      throw new Error('Error saving title to Supabase');
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: 'Stream title successfully updated',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in PATCH request:', error.message || error);
    return new NextResponse(
      JSON.stringify({ error: error.message || 'An unknown error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
