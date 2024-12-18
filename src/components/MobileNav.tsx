"use client";

import { useState } from "react";
import { useUser } from "../utils/hooks/useUser";
import { LogoutButton } from "./LogoutButton";
import { Menu, LogIn } from "lucide-react";

export const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const user = useUser();

  return (
    <div className="md:hidden">
      <button
        className="text-gray-400 hover:text-white"
        onClick={() => setOpen(!open)}
      >
        <Menu size={24} />
      </button>
      {open && (
        <div className="absolute top-100 left-0 w-full z-50 p-4">
          <div className="flex flex-col items-end">
            {user ? (
              <LogoutButton />
            ) : (
              <a href="/login" className="">
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
