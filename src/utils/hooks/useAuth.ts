import { useEffect, useState } from 'react';

import { createClient } from '../supabase/client';

export function useAuth(userId: string) {
  const supabase = createClient();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const { data, error } = await supabase
        .from('user_tokens')
        .select('access_token, refresh_token, expires_at')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Failed to fetch tokens:', error);
        return;
      }

      const { access_token, refresh_token, expires_at } = data;

      // Check if token is expired
      if (Date.now() / 1000 >= expires_at) {
        // Refresh the token
        const response = await fetch('/api/refresh-token', {
          method: 'POST',
          body: JSON.stringify({ refresh_token }),
          headers: { 'Content-Type': 'application/json' },
        });

        const refreshedData = await response.json();
        if (refreshedData.access_token) {
          setAccessToken(refreshedData.access_token);
        } else {
          console.error('Failed to refresh token');
        }
      } else {
        setAccessToken(access_token);
      }
    };

    fetchToken();
  }, [userId]);

  return accessToken;
}
