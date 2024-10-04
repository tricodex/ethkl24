'use client';

import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

function WorldCoinAuthButton() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    await signIn('worldcoin', { callbackUrl: '/' });
    setIsLoading(false);
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: '/' });
    setIsLoading(false);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {session ? (
        <Button onClick={handleSignOut} disabled={isLoading}>
          {isLoading ? 'Signing out...' : 'Sign out'}
          <Image src="/wldcoin.svg" alt="World Coin Logo" width={16} height={16} className="worldcoin-logo-login" />

        </Button>
      ) : (
        <Button onClick={handleSignIn} disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in with World ID'}
          <Image src="/wldcoin.svg" alt="World Coin Logo" width={16} height={16} className="worldcoin-logo-login" />
        </Button>
      )}
    </div>
  );
}

function TopNav() {
    return (
        <nav className="flex justify-between items-center px-4 py-1 bg-gradient-to-r from-[#767676] to-[#15162c] text-white">
            <div className="flex space-x-4">
            <Link href="/" className="text-xl font-bold flex items-center gap-1">
            <span>HEAD</span>
                    <span><Image src="/head.svg" alt="HEAD logo" width={24} height={16} /></span></Link>
                <Link href="/about" className="mr-4">About</Link>
                <Link href="/contact">Contact</Link>
            </div>
            <div className="flex items-center">
                <WorldCoinAuthButton />
            </div>
        </nav>
    );
}

export default TopNav;
