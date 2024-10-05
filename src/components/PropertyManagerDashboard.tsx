"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getPublicClient, getWalletClient, getWalletAddress, ensureCorrectNetwork } from '@/lib/viemClient'
import { parseEther, Abi, Address } from 'viem'
import PropertyABI from '@/lib/abis/Property.json'

export function PropertyManagerDashboard({ propertyAddress }: { propertyAddress: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [memberAddress, setMemberAddress] = useState("")
  const [unitNumber, setUnitNumber] = useState("")
  const [ownerAddress, setOwnerAddress] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(1)  // Default to January
  const [members, setMembers] = useState<string[]>([])

  const checkOwner = useCallback(async () => {
    try {
      const publicClient = getPublicClient();
      const owner = await publicClient.readContract({
        address: propertyAddress as Address,
        abi: PropertyABI.abi as Abi,
        functionName: 'getOwner',  
      });
      setOwnerAddress(owner as string);
      console.log('Contract owner:', owner);
    } catch (err) {
      console.error('Error fetching contract owner:', err);
      setError('Failed to fetch contract owner.');
    }
  }, [propertyAddress]);

  const fetchMembers = useCallback(async () => {
    try {
      const publicClient = getPublicClient();
      // Assuming there's a function to get all members
      const fetchedMembers = await publicClient.readContract({
        address: propertyAddress as Address,
        abi: PropertyABI.abi as Abi,
        functionName: 'getAllMembers',  // You might need to add this function to your contract
      });
      setMembers(fetchedMembers as string[]);
      console.log('Fetched members:', fetchedMembers);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to fetch members.');
    }
  }, [propertyAddress]);

  useEffect(() => {
    ensureCorrectNetwork().catch(console.error);
    checkOwner().catch(console.error);
    fetchMembers().catch(console.error);
  }, [checkOwner, fetchMembers]);

  const addMember = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)
  
    try {
      await ensureCorrectNetwork();
      const publicClient = getPublicClient();
      const walletClient = await getWalletClient();
      const currentWalletAddress = (await getWalletAddress()) as Address;
  
      if (
        currentWalletAddress.toLowerCase() !== ownerAddress?.toLowerCase() &&
        currentWalletAddress.toLowerCase() !== '0x87f603924309889b39687ac0a1669b1e5a506e74'.toLowerCase()
      ) {
        throw new Error(`Only the contract owner or authorized address can add members.`);
      }
  
      const { request } = await publicClient.simulateContract({
        account: currentWalletAddress,
        address: propertyAddress as Address,
        abi: PropertyABI.abi as Abi,
        functionName: 'addMembers',
        args: [[memberAddress], currentMonth, parseEther("0.1")],
      });
  
      console.log('Simulated contract call:', request);
  
      const hash = await walletClient.writeContract(request);
      console.log('Transaction sent, hash:', hash);
  
      await publicClient.waitForTransactionReceipt({ hash });
  
      setSuccess(`Member added. Transaction hash: ${hash}`);
      fetchMembers();  // Refresh the member list
    } catch (err) {
      console.error('Error adding member:', err);
      if (err instanceof Error) {
        setError(`Failed to add member: ${err.message}`);
      } else {
        setError('An unknown error occurred while adding member');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const payFee = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await ensureCorrectNetwork();
      const publicClient = getPublicClient()
      const walletClient = await getWalletClient()
      const address = await getWalletAddress()

      const { request } = await publicClient.simulateContract({
        account: address,
        address: propertyAddress as Address,
        abi: PropertyABI.abi as Abi,
        functionName: 'payFee',
        args: [currentMonth],
      })

      console.log('Simulated payFee call:', request);

      const hash = await walletClient.writeContract(request)
      console.log('PayFee transaction sent, hash:', hash);

      await publicClient.waitForTransactionReceipt({ hash })

      setSuccess(`Fee paid. Transaction hash: ${hash}`)
    } catch (err) {
      console.error('Error paying fee:', err);
      if (err instanceof Error) {
        setError(`Failed to pay fee: ${err.message}`);
      } else {
        setError('An unknown error occurred while paying fee');
      }
    } finally {
      setLoading(false)
    }
  }

  // Function to ensure there's always at least one member
  const ensureDefaultMember = useCallback(async () => {
    if (members.length === 0) {
      const defaultMember = '0x1234567890123456789012345678901234567890';  // Replace with a valid address
      try {
        await addMember();
        console.log('Added default member:', defaultMember);
      } catch (err) {
        console.error('Failed to add default member:', err);
      }
    }
  }, [members, addMember]);

  useEffect(() => {
    ensureDefaultMember();
  }, [ensureDefaultMember]);

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add Member</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Member Address"
            value={memberAddress}
            onChange={(e) => setMemberAddress(e.target.value)}
            className="mb-2"
          />
          <Input
            type="number"
            placeholder="Current Month (1-12)"
            value={currentMonth.toString()}
            onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
            className="mb-2"
            min="1"
            max="12"
          />
          <Button onClick={addMember} disabled={loading}>
            {loading ? 'Adding...' : 'Add Member'}
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Pay Fee</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="number"
            placeholder="Month to Pay For (1-12)"
            value={currentMonth.toString()}
            onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
            className="mb-2"
            min="1"
            max="12"
          />
          <Button onClick={payFee} disabled={loading}>
            {loading ? 'Paying...' : 'Pay Fee'}
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Members</CardTitle>
        </CardHeader>
        <CardContent>
          {members.length > 0 ? (
            <ul>
              {members.map((member, index) => (
                <li key={index}>{member}</li>
              ))}
            </ul>
          ) : (
            <p>No members found.</p>
          )}
        </CardContent>
      </Card>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  )
}