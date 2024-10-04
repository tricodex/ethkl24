// src/app/layout.tsx
import NextAuthSessionProvider from '@/components/auth-provider';
import './globals.css';
import type { Metadata } from 'next';
import TopNav from './_components/top-nav';

export const metadata: Metadata = {
  title: "PMDA",
  description: "Authentication-enabled app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">

        <NextAuthSessionProvider>
        <TopNav />

          <main>
            {children}
          </main>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
