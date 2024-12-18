import { LogOut } from "lucide-react";

export const LogoutButton = () => {
  return (
    <form action="/auth/signout" method="post" className="flex gap-2">
      <LogOut size={24} />
      <button className="button block" type="submit">
        Sign out
      </button>
    </form>
  );
};
