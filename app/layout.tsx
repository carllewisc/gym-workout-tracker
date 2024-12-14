import { auth } from '@/auth';
import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata, Viewport } from 'next';
import { Lato } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gym Dashboard',
  description: 'Gym Dashboard'
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap'
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang="en" className={`${lato.className}`} suppressHydrationWarning={true}>
      <body className={'overflow-hidden'}>
        <NextTopLoader showSpinner={false} />
        <Providers session={session}>
          <Toaster position="top-right" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
