'use client';

import { LogIn, Menu } from 'lucide-react';
import { useState } from 'react';

import { useUser } from '@/src/utils/hooks/useUser';

import { LogoutButton } from './LogoutButton';

export const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const user = useUser();

  return (
    <div className='md:hidden'>
      <button
        className='text-gray-400 hover:text-white'
        onClick={() => setOpen(!open)}
      >
        <Menu size={24} />
      </button>
      {open && (
        <div className='top-100 absolute left-0 z-50 w-full p-4'>
          <div className='flex flex-col items-end'>
            {user ? (
              <LogoutButton />
            ) : (
              <a href='/login' className=''>
                <LogIn size={24} />
                Login
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
