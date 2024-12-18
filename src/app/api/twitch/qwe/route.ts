import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('twitch_access_token');
  return new Response(JSON.stringify(accessToken));
}
