import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { getPublicClient, getWalletClient, getWalletAddress } from '@/lib/viemClient'
import { parseEther, formatEther, Abi, Address } from 'viem'
import PropertyABI from '@/lib/abis/PropertyX.json'

interface ResidentDashboardProps {
  propertyAddress: string
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
]

export function ResidentDashboard({ propertyAddress }: ResidentDashboardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [paymentStatus, setPaymentStatus] = useState<boolean>(false)
  const [feeAmount, setFeeAmount] = useState<string>("0")
  const [residentAddress, setResidentAddress] = useState<string | null>(null)
  const [isActiveMember, setIsActiveMember] = useState<boolean>(false)
  const [propertyName, setPropertyName] = useState<string>("")
  const [propertyBalance, setPropertyBalance] = useState<string>("0")
  const [totalExpenses, setTotalExpenses] = useState<string>("0")
  const [totalFeePaid, setTotalFeePaid] = useState<string>("0")

  // Fetch property details like balance, expenses, and total fees paid
  const fetchPropertyDetails = useCallback(async () => {
    if (!propertyAddress) return
    try {
      const publicClient = getPublicClient()
      const [name, balance, expenses, feePaid] = await Promise.all([
        publicClient.readContract({
          address: propertyAddress as Address,
          abi: PropertyABI.abi as Abi,
          functionName: 'name',
        }),
        publicClient.readContract({
          address: propertyAddress as Address,
          abi: PropertyABI.abi as Abi,
          functionName: 'getBalance',
        }),
        publicClient.readContract({
          address: propertyAddress as Address,
          abi: PropertyABI.abi as Abi,
          functionName: 'totalExpenses',
        }),
        publicClient.readContract({
          address: propertyAddress as Address,
          abi: PropertyABI.abi as Abi,
          functionName: 'totalFeePaid',
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

  // Check if the resident is an active member and their payment status
  const checkMemberStatus = useCallback(async () => {
    if (!propertyAddress || !residentAddress) return
    setError(null)
    try {
      const publicClient = getPublicClient()
      const status = await publicClient.readContract({
        address: propertyAddress as Address,
        abi: PropertyABI.abi as Abi,
        functionName: 'getMemberStatus',
        args: [residentAddress as Address, BigInt(currentMonth + 1)],
      }) as [boolean, boolean, bigint, bigint, bigint]

      const [isActive, isPaid, fee] = status
      setIsActiveMember(isActive)
      setPaymentStatus(isPaid)
      setFeeAmount(formatEther(fee))
    } catch (err) {
      console.error('Error checking member status:', err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setIsActiveMember(false)
      setPaymentStatus(false)
      setFeeAmount("0")
    }
  }, [propertyAddress, residentAddress, currentMonth])

  // Fetch wallet address and set resident address
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

  // Fetch property details when component is mounted
  useEffect(() => {
    if (propertyAddress) {
      fetchPropertyDetails()
    }
  }, [propertyAddress, fetchPropertyDetails])

  // Check member status when resident address or month changes
  useEffect(() => {
    if (residentAddress && propertyAddress) {
      checkMemberStatus()
    }
  }, [residentAddress, propertyAddress, currentMonth, checkMemberStatus])

  // Handle fee payment
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
      const { request } = await publicClient.simulateContract({
        account: residentAddress as Address,
        address: propertyAddress as Address,
        abi: PropertyABI.abi as Abi,
        functionName: 'payFee',
        args: [BigInt(currentMonth + 1)],
      })

      const hash = await walletClient.writeContract(request)
      await publicClient.waitForTransactionReceipt({ hash })

      setSuccess(`Fee paid for ${MONTHS[currentMonth]}. Transaction hash: ${hash}`)
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
    <Card className="app-card">
      <CardHeader className="app-card-header">
        <CardTitle className="app-card-title">{propertyName || 'Resident Dashboard'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-sm text-gray-700 bg-blue-50 p-4 rounded-md">Welcome to your Resident Dashboard. Here you can view and manage your payments for the property. Ensure your wallet is connected.</p>

          <div>
            <p><strong>Property Address:</strong> {propertyAddress}</p>
            <p><strong>Resident Address:</strong> {residentAddress || 'Loading...'}</p>
            <p><strong>Property Balance:</strong> {propertyBalance} ETH</p>
            <p><strong>Total Expenses:</strong> {totalExpenses} ETH</p>
            <p><strong>Total Fees Paid:</strong> {totalFeePaid} ETH</p>
          </div>

          <div>
            <Label htmlFor="currentMonth">Select Month for Payment</Label>
            <select
            title="currentMonth"
              id="currentMonth"
              value={currentMonth}
              onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
              className="app-select mt-2"
            >
              {MONTHS.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
          </div>

          <div>
            <p><strong>Status:</strong> {isActiveMember ? "Active Member" : "Not a Member"}</p>
            <p><strong>Monthly Fee:</strong> {feeAmount} ETH</p>
            <p><strong>Payment Status:</strong> {paymentStatus ? "Paid" : "Not Paid"}</p>
          </div>

          <Button onClick={payFee} disabled={loading || paymentStatus || !isActiveMember}>
            {loading ? <Spinner /> : null}
            {paymentStatus ? 'Fee Already Paid' : isActiveMember ? 'Pay Monthly Fee' : 'Not Eligible to Pay Fee'}
          </Button>

          {error && (
            <Alert>
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
      </CardContent>
    </Card>
  )
}
