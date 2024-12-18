import Image from 'next/image';

import { createClient } from '@/src/utils/supabase/server';

import { LogoutButton } from '../LogoutButton';
import { MobileNav } from './MobileNav';

export default async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className=''>
      <div className='container mx-auto flex items-center justify-between px-4 py-3'>
        {/* Logo/Wordmark */}
        <div className='flex items-center'>
          <a href='/'>
            <Image
              src='/logo.png'
              alt='TwitchTitle logo'
              width={40}
              height={40}
              priority
              className='h-auto w-auto'
            />
          </a>
        </div>

        {/* Navigation Links */}
        <div className='hidden space-x-6 md:flex'>
          <div>
            {user ? (
              <LogoutButton />
            ) : (
              <a href='/login' className=''>
                Login
              </a>
            )}
          </div>
        </div>

        <MobileNav />
      </div>
    </nav>
  );
}
