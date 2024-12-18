import type { Metadata } from 'next';

import Footer from '@/src/components/layout/Footer';
import Navbar from '@/src/components/layout/Nav';
import Providers from '@/src/utils/rq/queryClient';

import './globals.css';

export const metadata: Metadata = {
  title: 'TwitchTitle',
  description: 'Automate Your Twitch Stream Titles with TwitchTitle',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='antialiased'>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
