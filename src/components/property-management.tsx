import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { payPropertyFee, addPropertyMembers } from '@/lib/contractFunctions';
import { Address } from 'viem';

interface PropertyManagementProps {
  propertyAddress: Address;
}

export function PropertyManagement({ propertyAddress }: PropertyManagementProps): JSX.Element {
  const [month, setMonth] = useState<number>(1);
  const [feeAmount, setFeeAmount] = useState<string>('');
  const [newMembers, setNewMembers] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handlePayFee = async (): Promise<void> => {
    setIsLoading(true);
    setError('');
    try {
      const hash = await payPropertyFee(propertyAddress, month);
      console.log('Transaction hash:', hash);
      // Handle success (e.g., show a success message)

    } catch (err) {
      setError('Failed to pay fee. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMembers = async (): Promise<void> => {
    setIsLoading(true);
    setError('');
    try {
      const membersArray = newMembers.split(',').map(m => m.trim() as Address);
      const hash = await addPropertyMembers(propertyAddress, membersArray, month, feeAmount);
      console.log('Transaction hash:', hash);
      // Handle success (e.g., show a success message)
    } catch (err) {
      setError('Failed to add members. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Pay Fee</h2>
        <div className="flex items-center space-x-2">
          <Label htmlFor="month">Month</Label>
          <Input
            id="month"
            type="number"
            min="1"
            max="12"
            value={month}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMonth(Number(e.target.value))}
          />
          <Button onClick={handlePayFee} disabled={isLoading}>
            Pay Fee
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Add Members</h2>
        <div className="space-y-2">
          <div>
            <Label htmlFor="newMembers">New Member Addresses (comma-separated)</Label>
            <Input
              id="newMembers"
              value={newMembers}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMembers(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="feeAmount">Fee Amount (in ETH)</Label>
            <Input
              id="feeAmount"
              type="number"
              step="0.01"
              value={feeAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFeeAmount(e.target.value)}
            />
          </div>
          <Button onClick={handleAddMembers} disabled={isLoading}>
            Add Members
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}