import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { UserProvider } from '@/context/user-context';
import Header from '@/components/header/header';
import { getOptionalServerUserRole } from '@/lib/supabase/user';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
  adjustFontFallback: false,
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: 'Calendario UPC',
  description: 'By Simón Villalón',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getOptionalServerUserRole();

  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} `}
    >
      <head />
      <body className='h-full min-h-screen font-sans antialiased'>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider initialUserData={user}>
            <Header />
            {children}
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
