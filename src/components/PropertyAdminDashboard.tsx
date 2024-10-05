// src/components/PropertyAdminDashboard.tsx
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getPublicClient, getWalletClient, getWalletAddress } from '@/lib/viemClient'
import { parseEther, formatEther, Abi, Address } from 'viem'
import PropertyABI from '@/lib/abis/Property.json'

interface PropertyAdminDashboardProps {
  propertyAddress: string
}

export function PropertyAdminDashboard({ propertyAddress }: PropertyAdminDashboardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [newMemberAddress, setNewMemberAddress] = useState("")
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
  const [feeAmount, setFeeAmount] = useState("0.1")
  const [balance, setBalance] = useState<string>("0")

  const fetchBalance = useCallback(async () => {
    if (!propertyAddress) {
      setError("Please enter a valid property address")
      return
    }
    setError(null)
    try {
      const publicClient = getPublicClient()
      const balance = await publicClient.readContract({
        address: propertyAddress as Address,
        abi: PropertyABI.abi as Abi,
        functionName: 'getBalance',
      })
      setBalance(formatEther(balance as bigint))
    } catch (err) {
      console.error('Error fetching balance:', err)
      setError("Failed to fetch balance. Please check the property address.")
    }
  }, [propertyAddress])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  const addMember = async () => {
    if (!propertyAddress) {
      setError("Please enter a valid property address")
      return
    }
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const publicClient = getPublicClient()
      const walletClient = await getWalletClient()
      const address = await getWalletAddress()

      console.log('Adding/Updating member:', newMemberAddress, 'for month:', currentMonth, 'with fee:', feeAmount)

      const { request } = await publicClient.simulateContract({
        account: address,
        address: propertyAddress as Address,
        abi: PropertyABI.abi as Abi,
        functionName: 'addMembers',
        args: [[newMemberAddress], BigInt(currentMonth), parseEther(feeAmount)],
      })

      const hash = await walletClient.writeContract(request)

      await publicClient.waitForTransactionReceipt({ hash })

      setSuccess(`Member added/updated. Transaction hash: ${hash}`)
      fetchBalance()
      
      // Verify member was added/updated
      const memberStatus = await publicClient.readContract({
        address: propertyAddress as Address,
        abi: PropertyABI.abi as Abi,
        functionName: 'getMemberStatus',
        args: [newMemberAddress as Address, BigInt(currentMonth)],
      })
      console.log('Member status after addition/update:', memberStatus)

    } catch (err) {
      console.error('Error adding/updating member:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Admin Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>Property Address: {propertyAddress}</p>
          <p>Property Balance: {balance} ETH</p>
          <Input
            placeholder="Member Address"
            value={newMemberAddress}
            onChange={(e) => setNewMemberAddress(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Current Month (1-12)"
            value={currentMonth}
            onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
            min={1}
            max={12}
          />
          <Input
            placeholder="Fee Amount (ETH)"
            value={feeAmount}
            onChange={(e) => setFeeAmount(e.target.value)}
          />
          <Button onClick={addMember} disabled={loading}>
            {loading ? 'Processing...' : 'Add/Update Member'}
          </Button>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </div>
      </CardContent>
    </Card>
  )
}