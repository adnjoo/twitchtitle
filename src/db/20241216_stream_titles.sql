create table if not exists stream_titles (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  title text not null,
  created_at timestamp default timezone('utc', now())
);
