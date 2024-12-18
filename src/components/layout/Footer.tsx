import { Github, Twitch } from 'lucide-react';

export default function Footer() {
  return (
    <footer className='row-start-3 flex flex-wrap items-center justify-center gap-6 border-t border-gray-300 bg-gray-100 p-4 text-gray-700'>
      <a
        className='flex items-center gap-2 hover:underline hover:underline-offset-4'
        href='https://github.com/adnjoo/twitchtitle'
        target='_blank'
        rel='noopener noreferrer'
      >
        <Github size={24} />
        GitHub
      </a>
      <a
        className='flex items-center gap-2 hover:underline hover:underline-offset-4'
        href='https://twitch.tv'
        target='_blank'
        rel='noopener noreferrer'
      >
        <Twitch size={24} />
        Twitch
      </a>
      <a
        className='flex items-center gap-2 hover:underline hover:underline-offset-4'
        href='/blog'
        rel='noopener noreferrer'
      >
        Blog
      </a>
      <p className='mt-2 w-full text-center text-sm'>
        © 2024 <span className='font-bold'>TwitchTitle</span>. All rights
        reserved.
      </p>
    </footer>
  );
}
