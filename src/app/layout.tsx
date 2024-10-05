import type { Metadata } from 'next';
import NextAuthSessionProvider from '@/components/auth-provider';
import './globals.css';
import TopNav from './_components/top-nav';
import { MetaMaskProvider } from '@/components/MetaMaskProvider';
import ClientOnly from '@/components/ClientOnly';
import { NextAuthProvider } from "@/components/providers/session-provider";

export const metadata: Metadata = {
  title: "HEAD",
  description: "Housing Estate Association Decentralized",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <NextAuthProvider>
          <ClientOnly>
            <MetaMaskProvider>
              <NextAuthSessionProvider>
                <TopNav />
                <main>
                  {children}
                </main>
              </NextAuthSessionProvider>
            </MetaMaskProvider>
          </ClientOnly>
        </NextAuthProvider>
      </body>
    </html>
  );
}