import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // refreshing the auth token

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Set the user in cookies (minimal, no sensitive data)
    supabaseResponse.cookies.set(
      "user",
      JSON.stringify({ id: user.id, email: user.email }),
      {
        httpOnly: true, // Prevent client-side JS access
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        maxAge: 60 * 60 * 24 * 7, // 7 days expiry
        path: "/", // Accessible across the app
      }
    );
  } else {
    // Clear the user cookie if no user
    supabaseResponse.cookies.delete("user");
  }

  return supabaseResponse;
}
