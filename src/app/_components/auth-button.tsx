'use client';

import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function WorldCoinAuthButton() {
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