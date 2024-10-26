import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { formatEther, Abi, Address } from 'viem'
import PropertyABI from '@/lib/abis/Property.json'

interface ResidentDashboardProps {
  propertyAddress: string
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
]

const FALLBACK_ADDRESSES = [
  "0x87f603924309889B39687AC0A1669b1E5a506E74",
  "0x98f1E5c7b34943eA5a6A395F6340d2Bb1234Ed9B",
  "0x1E9F7e0A94f836AB8D47a0DdD634e6545E781234"
]

export function ResidentDashboard({ propertyAddress }: ResidentDashboardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [paymentStatus, setPaymentStatus] = useState<boolean>(false)
  const [feeAmount, setFeeAmount] = useState<string>("0.1")
  const [residentAddress, setResidentAddress] = useState<string | null>(null)
  const [isActiveMember, setIsActiveMember] = useState<boolean>(true) // Set to true for demo
  const [propertyName, setPropertyName] = useState<string>("Demo Property")
  const [propertyBalance, setPropertyBalance] = useState<string>("10")
  const [totalExpenses, setTotalExpenses] = useState<string>("5")
  const [totalFeePaid, setTotalFeePaid] = useState<string>("15")
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false)

  const getFallbackAddress = () => {
    const randomIndex = Math.floor(Math.random() * FALLBACK_ADDRESSES.length)
    return FALLBACK_ADDRESSES[randomIndex]
  }

  const fetchPropertyDetails = useCallback(async () => {
    // Simulated property details fetch
    setPropertyName("Property HEAD")
    setPropertyBalance("10")
    setTotalExpenses("5")
    setTotalFeePaid("15")
  }, [])

  const checkMemberStatus = useCallback(async () => {
    // Simulated member status check
    setIsActiveMember(true)
    setPaymentStatus(false)
    setFeeAmount("0.1")
  }, [])

  useEffect(() => {
    const setup = async () => {
      setResidentAddress(getFallbackAddress())
    }
    setup()
  }, [])

  useEffect(() => {
    fetchPropertyDetails()
  }, [fetchPropertyDetails])

  useEffect(() => {
    checkMemberStatus()
  }, [checkMemberStatus])

  const payFee = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (!residentAddress || !/^0x[a-fA-F0-9]{40}$/.test(residentAddress)) {
        throw new Error("Invalid resident address provided.")
      }

      // Assuming validation passed, open the wallet dialog
      setIsWalletDialogOpen(true)
    } catch (err) {
      console.error('Error preparing payment:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred while preparing the payment.')
      }
    } finally {
      setLoading(false)
    }
  }

  const confirmPayment = () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    // Simulate transaction process
    setTimeout(() => {
      const fakeTransactionHash = "0x" + Array(64).fill(0).map(() => Math.random().toString(16)[2]).join('')
      setSuccess(`Fee paid for ${MONTHS[currentMonth]}. Transaction hash: ${fakeTransactionHash}`)
      setPaymentStatus(true)
      setTotalFeePaid((prev) => (parseFloat(prev) + parseFloat(feeAmount)).toString())
      setPropertyBalance((prev) => (parseFloat(prev) + parseFloat(feeAmount)).toString())
      setLoading(false)
      setIsWalletDialogOpen(false)
    }, 2000)
  }

  return (
    <Card className="app-card">
      <CardHeader className="app-card-header">
        <CardTitle className="app-card-title">{propertyName || 'Resident Dashboard'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-sm text-gray-700 bg-blue-50 p-4 rounded-md app-font-kanit">Welcome to your Resident Dashboard. Here you can view and manage your payments for the property. If you&apos;re new to Web3, don&apos;t worry—just follow the instructions, and ensure your wallet is connected.</p>

          <div className="app-property-details">
            <p className="app-section-header">Property Details:</p>
            <p><strong>Property Address:</strong> {propertyAddress || getFallbackAddress()}</p>
            <p><strong>Resident Address:</strong> {residentAddress || 'Loading...'}</p>
            <p><strong>Property Balance:</strong> {propertyBalance} ETH (Funds available for property maintenance and expenses)</p>
            <p><strong>Total Expenses:</strong> {totalExpenses} ETH (Expenses paid by the property)</p>
            <p><strong>Total Fees Paid:</strong> {totalFeePaid} ETH (Total amount of fees collected from residents)</p>
          </div>

          <div className="app-property-details">
            <Label htmlFor="currentMonth" className="app-label">Select Month for Payment</Label>
            <select
              title='month'
              id="currentMonth"
              value={currentMonth}
              onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
              className="app-select mt-2"
            >
              {MONTHS.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
            <p className="text-sm text-gray-600 mt-2">Make sure you select the correct month for which you want to pay the fee. This helps us keep track of the payments efficiently.</p>
          </div>

          <div className="app-property-details">
            <p className="app-section-header">Membership Status:</p>
            <p><strong>Status:</strong> {isActiveMember ? "Active Member" : "Not a Member"}</p>
            <p><strong>Monthly Fee:</strong> {feeAmount} ETH</p>
            <p><strong>Payment Status:</strong> {paymentStatus ? "Paid for this Month" : "Not Paid"}</p>
            {!isActiveMember && <p className="text-sm text-red-600">It seems like you are not an active member yet. Please contact the property administrator for more information.</p>}
          </div>

          <Button
            onClick={payFee}
            disabled={loading || paymentStatus || !isActiveMember}
            className="app-button"
          >
            {loading ? <Spinner className="app-spinner" /> : null}
            {paymentStatus ? 'Fee Already Paid' : isActiveMember ? 'Pay Monthly Fee' : 'Not Eligible to Pay Fee'}
          </Button>

          {error && (
            <Alert className="app-alert-error">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="app-alert-success">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>

      <Dialog open={isWalletDialogOpen} onOpenChange={setIsWalletDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>You are about to pay {feeAmount} ETH for {MONTHS[currentMonth]}.</p>
            <p>Please confirm this transaction in your wallet.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWalletDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmPayment} className="app-button">Confirm Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}