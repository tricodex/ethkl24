import { useState, useEffect } from 'react';
import { useSDK } from '@metamask/sdk-react';
import { useSession } from 'next-auth/react';
import { MetaMaskButton } from "@metamask/sdk-react-ui";
import { Alert, AlertDescription } from '@/components/ui/alert';

export function WalletConnect() {
  const { connected, account } = useSDK();
  const { data: session, update } = useSession();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateSession = async () => {
      if (connected && account) {
        try {
          await update({
            ...session,
            user: {
              ...session?.user,
              address: account,
            },
          });
        } catch (err) {
          console.error('Failed to update session', err);
          setError('Failed to update session. Please try again.');
        }
      }
    };

    updateSession();
  }, [connected, account, session, update]);

  if (connected && account) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm">Connected: {account.slice(0, 6)}...{account.slice(-4)}</span>
        <MetaMaskButton theme="light" color="white" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <MetaMaskButton theme="light" color="white" />
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}