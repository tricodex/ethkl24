import React, { useState } from 'react';
import { parseEther } from 'viem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getPublicClient, getWalletClient, getWalletAddress, DPMA_FACTORY_ADDRESS, CONTROLLER_ADDRESS } from '@/lib/viemClient';
import DPMAFactoryABI from '@/lib/abis/DPMAFactory.json';
import ControllerABI from '@/lib/abis/Controller.json';

export function PropertySetup() {
  const [propertyName, setPropertyName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSetupProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const publicClient = getPublicClient();
      const walletClient = await getWalletClient();
      const address = await getWalletAddress();

      // Deploy property
      const { request } = await publicClient.simulateContract({
        account: address,
        address: DPMA_FACTORY_ADDRESS,
        abi: DPMAFactoryABI.abi,
        functionName: 'deployProperty',
        args: [parseEther(initialBalance), address, propertyName],
      });

      const hash = await walletClient.writeContract(request);

      // Wait for transaction to be mined
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      // Extract property address from logs (adjust based on actual event structure)
      const propertyAddress = receipt.logs[0].address;

      // Add property to controller
      const { request: controllerRequest } = await publicClient.simulateContract({
        account: address,
        address: CONTROLLER_ADDRESS,
        abi: ControllerABI.abi,
        functionName: 'addPropertySet',
        args: [propertyAddress],
      });

      const controllerHash = await walletClient.writeContract(controllerRequest);

      await publicClient.waitForTransactionReceipt({ hash: controllerHash });

      setSuccess(`Property deployed at ${propertyAddress} and added to controller`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Setup New Property</CardTitle>
        <CardDescription>Deploy a new property and add it to the controller</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSetupProperty} className="space-y-4">
          <div>
            <Label htmlFor="propertyName">Property Name</Label>
            <Input
              id="propertyName"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="initialBalance">Initial Balance (ETH)</Label>
            <Input
              id="initialBalance"
              type="number"
              step="0.01"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Setting up...' : 'Setup Property'}
          </Button>
        </form>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert variant="default" className="mt-4 bg-green-50 border-green-200 text-green-800">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}