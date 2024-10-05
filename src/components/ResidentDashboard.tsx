import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getPublicClient, getWalletClient, getWalletAddress } from '@/lib/viemClient'
import { parseEther, formatEther, Abi, Address } from 'viem'
import PropertyABI from '@/lib/abis/Property.json'

interface ResidentDashboardProps {
  propertyAddress: string // Address of the property contract
}

export function ResidentDashboard({ propertyAddress }: ResidentDashboardProps) {
  // State hooks to manage various aspects of the resident dashboard
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1) // Current month (default to the current month)
  const [paymentStatus, setPaymentStatus] = useState<boolean>(false) // Tracks if the resident has paid for the month
  const [feeAmount, setFeeAmount] = useState<string>("0") // Monthly fee amount for the resident
  const [residentAddress, setResidentAddress] = useState<string | null>(null) // Resident's wallet address
  const [isActiveMember, setIsActiveMember] = useState<boolean>(false) // Tracks if the resident is an active member
  const [propertyName, setPropertyName] = useState<string>("") // Name of the property
  const [propertyBalance, setPropertyBalance] = useState<string>("0") // Property's balance in ETH
  const [totalExpenses, setTotalExpenses] = useState<string>("0") // Total expenses incurred by the property
  const [totalFeePaid, setTotalFeePaid] = useState<string>("0") // Total fees paid by residents

  // Fetch property details like name, balance, expenses, and total fees paid
  const fetchPropertyDetails = useCallback(async () => {
    if (!propertyAddress) return
    try {
      const publicClient = getPublicClient()
      
      // Fetch multiple contract data in parallel
      const [name, balance, expenses, feePaid] = await Promise.all([
        publicClient.readContract({
          address: propertyAddress as Address,
          abi: PropertyABI.abi as Abi,
          functionName: 'name', // Fetch property name
        }),
        publicClient.readContract({
          address: propertyAddress as Address,
          abi: PropertyABI.abi as Abi,
          functionName: 'getBalance', // Fetch property balance
        }),
        publicClient.readContract({
          address: propertyAddress as Address,
          abi: PropertyABI.abi as Abi,
          functionName: 'totalExpenses', // Fetch total expenses
        }),
        publicClient.readContract({
          address: propertyAddress as Address,
          abi: PropertyABI.abi as Abi,
          functionName: 'totalFeePaid', // Fetch total fees paid
        })
      ])
      setPropertyName(name as string)
      setPropertyBalance(formatEther(balance as bigint))
      setTotalExpenses(formatEther(expenses as bigint))
      setTotalFeePaid(formatEther(feePaid as bigint))
    } catch (err) {
      console.error('Error fetching property details:', err)
      setError('Failed to fetch property details')
    }
  }, [propertyAddress])

  // Check the resident's membership status
  const checkMemberStatus = useCallback(async () => {
    if (!propertyAddress || !residentAddress) return
    setError(null)
    try {
      const publicClient = getPublicClient()

      // Fetch membership status by calling the activeMember function on the contract
      const status = await publicClient.readContract({
        address: propertyAddress as Address,
        abi: PropertyABI.abi as Abi,
        functionName: 'activeMember',
        args: [residentAddress as Address, BigInt(currentMonth)], // Pass the resident address and current month as arguments
      }) as [boolean, boolean, bigint, bigint, bigint]

      // Destructure the returned values to update state
      const [isActive, isPaid, fee, totalPaid, memberSince] = status
      
      setIsActiveMember(isActive)
      setPaymentStatus(isPaid)
      setFeeAmount(formatEther(fee))

      console.log('Member status:', { isActive, isPaid, fee: formatEther(fee), totalPaid: formatEther(totalPaid), memberSince: new Date(Number(memberSince) * 1000).toLocaleString() })

    } catch (err) {
      console.error('Error checking member status:', err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setIsActiveMember(false)
      setPaymentStatus(false)
      setFeeAmount("0")
    }
  }, [propertyAddress, residentAddress, currentMonth])

  // Effect to fetch the resident's wallet address when the component mounts
  useEffect(() => {
    const setup = async () => {
      try {
        const address = await getWalletAddress()
        setResidentAddress(address)
      } catch (err) {
        console.error('Error fetching wallet address:', err)
        setError('Failed to get wallet address. Please connect your wallet.')
      }
    }
    setup()
  }, [])

  // Fetch property details when the propertyAddress changes
  useEffect(() => {
    if (propertyAddress) {
      fetchPropertyDetails()
    }
  }, [propertyAddress, fetchPropertyDetails])

  // Check membership status when residentAddress, propertyAddress, or currentMonth changes
  useEffect(() => {
    if (residentAddress && propertyAddress) {
      checkMemberStatus()
    }
  }, [residentAddress, propertyAddress, currentMonth, checkMemberStatus])

  // Function to handle the payment of monthly fees
  const payFee = async () => {
    if (!propertyAddress || !residentAddress) {
      setError("Invalid property or resident address")
      return
    }
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const publicClient = getPublicClient()
      const walletClient = await getWalletClient()

      // Simulate the contract call for paying the fee
      const { request } = await publicClient.simulateContract({
        account: residentAddress as Address,
        address: propertyAddress as Address,
        abi: PropertyABI.abi as Abi,
        functionName: 'payFee',
        args: [BigInt(currentMonth)], // Pass the current month as the argument
      })

      // Write the transaction and wait for the receipt
      const hash = await walletClient.writeContract(request)
      await publicClient.waitForTransactionReceipt({ hash })

      setSuccess(`Fee paid for month ${currentMonth}. Transaction hash: ${hash}`)
      
      // Refresh member status and property details after payment
      await checkMemberStatus()
      await fetchPropertyDetails()
    } catch (err) {
      console.error('Error paying fee:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{propertyName || 'Resident Dashboard'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Display various resident and property details */}
          <p>Property Address: {propertyAddress}</p>
          <p>Resident Address: {residentAddress || 'Loading...'}</p>
          <p>Property Balance: {propertyBalance} ETH</p>
          <p>Total Expenses: {totalExpenses} ETH</p>
          <p>Total Fees Paid: {totalFeePaid} ETH</p>
          
          {/* Input for selecting the current month */}
          <div>
            <Label htmlFor="currentMonth">Current Month (1-12)</Label>
            <Input
              id="currentMonth"
              type="number"
              min="1"
              max="12"
              value={currentMonth}
              onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
            />
          </div>

          {/* Display membership and payment status */}
          <p>Membership Status: {isActiveMember ? "Active" : "Inactive"}</p>
          <p>Monthly Fee: {feeAmount} ETH</p>
          <p>Payment Status: {paymentStatus ? "Paid" : "Not Paid"}</p>

          {/* Button to trigger fee payment */}
          <Button 
            onClick={payFee} 
            disabled={loading || paymentStatus || !isActiveMember}
          >
            {loading ? 'Processing...' : paymentStatus ? 'Paid' : isActiveMember ? 'Pay Monthly Fee' : 'Not a Member'}
          </Button>

          {/* Display error or success messages */}
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
