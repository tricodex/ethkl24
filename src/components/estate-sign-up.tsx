import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { deployProperty } from '@/lib/contractFunctions';

export function EstateSignUp(): JSX.Element {
  const [name, setName] = useState<string>('');
  const [initBalance, setInitBalance] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const hash = await deployProperty(initBalance, name);
      console.log('Transaction hash:', hash);
      await router.push('/dashboard');
    } catch (err) {
      setError('Failed to deploy property. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Estate Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="initBalance">Initial Balance (in ETH)</Label>
        <Input
          id="initBalance"
          type="number"
          step="0.01"
          value={initBalance}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInitBalance(e.target.value)}
          required
        />
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Deploying...' : 'Deploy Property'}
      </Button>
    </form>
  );
}