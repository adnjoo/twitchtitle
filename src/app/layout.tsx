import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/src/components/Nav";
import Footer from "@/src/components/Footer";
import Providers from "@/src/utils/rq/queryClient";

export const metadata: Metadata = {
  title: "TwitchTitle",
  description: "Automate Your Twitch Stream Titles with TwitchTitle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
