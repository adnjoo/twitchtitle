import Image from "next/image";
import { LogoutButton } from "./LogoutButton";
import { createClient } from "@/src/utils/supabase/server";

export default async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo/Wordmark */}
        <div className="flex items-center">
          <a href="/">
            <Image
              src="/logo.png"
              alt="TwitchTitle logo"
              width={40}
              height={40}
              priority
              className="h-auto w-auto"
            />
          </a>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <div>
            {user ? (
              <LogoutButton />
            ) : (
              <a href="/login" className="">
                Login
              </a>
            )}
          </div>
        </div>

        {/* Mobile Menu (Optional) */}
        <div className="md:hidden">
          <button className="text-gray-400 hover:text-white">
            {/* Mobile Menu Icon */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
