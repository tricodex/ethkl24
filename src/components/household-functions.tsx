'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { deployProperty, payPropertyFee } from '@/lib/contractFunctions';
import { Address } from 'viem';

interface HouseholdFunctionsProps {
  estateAddress: Address;
}

export function AddHousehold({ estateAddress }: HouseholdFunctionsProps): JSX.Element {
  const [ownerAddress, setOwnerAddress] = useState<string>('');
  const [householdName, setHouseholdName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleAddHousehold = async (): Promise<void> => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const hash = await deployProperty('0', ownerAddress as Address, householdName);
      console.log('Transaction hash:', hash);
      setSuccess(`Household added successfully. Transaction hash: ${hash}`);
    } catch (err) {
      setError('Failed to add household. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Household</CardTitle>
        <CardDescription>Add a new household to the estate</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="ownerAddress">Owner Address</Label>
            <Input
              id="ownerAddress"
              value={ownerAddress}
              onChange={(e) => setOwnerAddress(e.target.value)}
              placeholder="0x..."
            />
          </div>
          <div>
            <Label htmlFor="householdName">Household Name</Label>
            <Input
              id="householdName"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              placeholder="Enter household name"
            />
          </div>
          <Button onClick={handleAddHousehold} disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Household'}
          </Button>
        </div>
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

export function PayHouseholdFee({ estateAddress }: HouseholdFunctionsProps): JSX.Element {
  const [month, setMonth] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handlePayFee = async (): Promise<void> => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const hash = await payPropertyFee(estateAddress, month);
      console.log('Transaction hash:', hash);
      setSuccess(`Fee payment successful. Transaction hash: ${hash}`);
    } catch (err) {
      setError('Failed to pay fee. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pay Household Fee</CardTitle>
        <CardDescription>Pay your monthly household fee</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="month">Month</Label>
            <Input
              id="month"
              type="number"
              min="1"
              max="12"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            />
          </div>
          <Button onClick={handlePayFee} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Pay Fee'}
          </Button>
        </div>
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