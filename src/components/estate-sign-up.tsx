'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

async function deployProperty(initBalance: string, name: string): Promise<string> {
  // Simulate deploying property
  console.log('Simulating deployment of property:', name, 'with balance:', initBalance);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return '0x1234567890abcdef1234567890abcdef12345678';
}

export function EstateSignUp(): JSX.Element {
  const [name, setName] = useState<string>('');
  const [initBalance, setInitBalance] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState<number>(1);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [deployedAddress, setDeployedAddress] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      console.log('Deploying property with balance:', initBalance, 'and name:', name);
      const propertyAddress = await deployProperty(initBalance, name);
      console.log('Property deployed successfully at:', propertyAddress);
      setDeployedAddress(propertyAddress);
      setStep(3);
      setTimeout(() => router.push('/dashboard'), 3000);
    } catch (err) {
      console.error('Deployment error:', err);
      if (err instanceof Error) {
        setError(`Error: ${err.message}`);
      } else {
        setError('An unexpected error occurred. Please check the console for more details.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNextStep = () => {
    if (step === 1 && termsAccepted) {
      setStep(2);
    } else if (step === 2 && name && initBalance) {
      setStep(3);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>HEAD Estate Sign Up</CardTitle>
        <CardDescription>
          Deploy the Housing Estate Association on the blockchain for transparent and efficient management.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={(step / 3) * 100} className="mb-4" />
        <Tabs value={`step${step}`}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="step1" disabled={step < 1}>Terms &amp; Conditions</TabsTrigger>
            <TabsTrigger value="step2" disabled={step < 2}>Estate Details</TabsTrigger>
            <TabsTrigger value="step3" disabled={step < 3}>Confirmation</TabsTrigger>
          </TabsList>
          <TabsContent value="step1">
            <div className="space-y-4">
              <div className="text-sm">
                <h3 className="font-semibold mb-2">Terms and Conditions</h3>
                <p>By deploying the Housing Estate Association, you agree to the following:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>All financial transactions will be recorded on the blockchain for transparency.</li>
                  <li>Estate members will have voting rights on proposals through smart contracts.</li>
                  <li>The initial balance will be locked in the estate&apos;s treasury smart contract.</li>
                  <li>You are responsible for complying with local regulations regarding housing associations.</li>
                </ul>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  I accept the terms and conditions
                </label>
              </div>
              <Button onClick={handleNextStep} disabled={!termsAccepted}>
                Next: Estate Details
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="step2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Estate Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  required
                  placeholder="e.g., Greenview Residences"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  This name will be used to identify the estate on the blockchain.
                </p>
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
                  placeholder="e.g., 1.5"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  This amount will be used to initialize the estate&apos;s treasury on the blockchain.
                </p>
              </div>
              <Button type="submit" disabled={isLoading || !name || !initBalance}>
                {isLoading ? 'Deploying...' : 'Deploy Property'}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="step3">
            <div className="text-center space-y-4">
              <AlertTitle className="text-2xl font-bold text-green-600">Success!</AlertTitle>
              <AlertDescription>
                {name} Housing Estate Association has been successfully deployed on the blockchain.
                <br />
                Deployed Address: {deployedAddress}
                <br />
                You will be redirected to the dashboard shortly.
              </AlertDescription>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Need help? Contact our support team at support.head.home@gmail.com
        </p>
      </CardFooter>
    </Card>
  );
}