'use client';

import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function SimpleAuthButton() {
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
    <div className="container mx-auto p-4">
      <div className="w-full max-w-md mx-auto text-center p-4 border rounded-lg shadow">
        {session ? (
          <div>
            <p>You are signed in as {session.user.id}</p>
            <Button onClick={handleSignOut} disabled={isLoading}>
              {isLoading ? 'Signing out...' : 'Sign out'}
            </Button>
          </div>
        ) : (
          <div>
            <p>You are not signed in.</p>
            <Button onClick={handleSignIn} disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in with World ID'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
