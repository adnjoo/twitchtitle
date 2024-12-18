CREATE TABLE user_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY, -- Unique identifier for the record
    user_id TEXT NOT NULL UNIQUE,                -- Unique Twitch user ID
    access_token TEXT NOT NULL,                  -- Short-lived Twitch access token
    refresh_token TEXT NOT NULL,                 -- Long-lived Twitch refresh token
    expires_at TIMESTAMP NOT NULL,               -- Expiry time for the access token
    created_at TIMESTAMP DEFAULT NOW(),          -- Timestamp when the record was created
    updated_at TIMESTAMP DEFAULT NOW()           -- Manually updated timestamp
);
