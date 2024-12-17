export const LogoutButton = () => {
  return (
    <form action="/auth/signout" method="post">
      <button className="button block" type="submit">
        Sign out
      </button>
    </form>
  );
};
