// src/components/LinkControllerToFactory.tsx

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getPublicClient, getWalletClient, getWalletAddress, DPMA_FACTORY_ADDRESS, CONTROLLER_ADDRESS } from '@/lib/viemClient';
import DPMAFactoryABI from '@/lib/abis/DPMAFactory.json';

export function LinkControllerToFactory() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLinkController = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const publicClient = getPublicClient();
      const walletClient = await getWalletClient();
      const address = await getWalletAddress();

      const { request } = await publicClient.simulateContract({
        account: address,
        address: DPMA_FACTORY_ADDRESS,
        abi: DPMAFactoryABI.abi,
        functionName: 'addController',
        args: [CONTROLLER_ADDRESS],
      });

      const hash = await walletClient.writeContract(request);

      await publicClient.waitForTransactionReceipt({ hash });

      setSuccess(`Controller linked to Factory. Transaction hash: ${hash}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleLinkController} disabled={isLoading}>
        {isLoading ? 'Linking...' : 'Link Controller to Factory'}
      </Button>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}