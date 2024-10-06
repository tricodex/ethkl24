import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { getPublicClient, getWalletClient, getWalletAddress } from '@/lib/viemClient'
import { parseEther, formatEther, Abi, Address } from 'viem'
import PropertyABI from '@/lib/abis/PropertyX.json'

interface PropertyAdminDashboardProps {
  propertyAddress: string
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
]

export function PropertyAdminDashboard({ propertyAddress }: PropertyAdminDashboardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [newMemberAddress, setNewMemberAddress] = useState("")
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [feeAmount, setFeeAmount] = useState("0.1")
  const [balance, setBalance] = useState<string>("0")
  const [totalExpenses, setTotalExpenses] = useState<string>("0")
  const [totalFeePaid, setTotalFeePaid] = useState<string>("0")
  const [showCurrentMembers, setShowCurrentMembers] = useState(false)
  const [currentMembers, setCurrentMembers] = useState<string[]>([])
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  const fetchPropertyDetails = useCallback(async () => {
    if (!propertyAddress) return
    setLoading(true)
    try {
      const publicClient = getPublicClient()
      const [balance, expenses, feePaid] = await Promise.all([
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
          functionName: 'totaFeePaid', // Updated function name based on ABI
        })
      ])
      setBalance(formatEther(balance as bigint))
      setTotalExpenses(formatEther(expenses as bigint))
      setTotalFeePaid(formatEther(feePaid as bigint))
    } catch (err) {
      console.error('Error fetching property details:', err)
      setError("Failed to fetch property details.")
    } finally {
      setLoading(false)
    }
  }, [propertyAddress])

  useEffect(() => {
    fetchPropertyDetails()
  }, [fetchPropertyDetails])

  const addMember = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const publicClient = getPublicClient()
      const walletClient = await getWalletClient()
      const address = await getWalletAddress()

      const { request } = await publicClient.simulateContract({
        account: address,
        address: propertyAddress as Address,
        abi: PropertyABI.abi as Abi,
        functionName: 'addMembers', // Compliant with ABI
        args: [[newMemberAddress], BigInt(currentMonth + 1), parseEther(feeAmount)],
      })

      const hash = await walletClient.writeContract(request)

      await publicClient.waitForTransactionReceipt({ hash })

      setSuccess(`Member added/updated successfully. Transaction hash: ${hash}`)
      fetchPropertyDetails()
      setNewMemberAddress("")
      setFeeAmount("0.1")
    } catch (err) {
      console.error('Error adding/updating member:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while adding/updating the member.')
    } finally {
      setLoading(false)
      setIsConfirmDialogOpen(false)
    }
  }

  const fetchCurrentMembers = useCallback(async () => {
    if (!propertyAddress) return
    try {
      // This is a placeholder. You'll need to implement a way to fetch current members,
      // which might require adding a new function to your smart contract.
      const members = ["0x1234...", "0x5678...", "0x9ABC..."]
      setCurrentMembers(members)
    } catch (err) {
      console.error('Error fetching current members:', err)
    }
  }, [propertyAddress])

  useEffect(() => {
    if (showCurrentMembers) {
      fetchCurrentMembers()
    }
  }, [showCurrentMembers, fetchCurrentMembers])

  return (
    <Card className="app-card">
      <CardHeader className="app-card-header">
        <CardTitle className="app-card-title">Property Admin Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-sm text-gray-700 bg-blue-50 p-4 rounded-md app-font-kanit">Welcome to the Property Admin Dashboard. Here you can manage property details, add new members, and view financial summaries. If you are new to Web3, don't worry—just follow the instructions, and ensure your wallet is connected.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard title="Property Balance" value={`${balance} ETH`} />
            <InfoCard title="Total Expenses" value={`${totalExpenses} ETH`} />
            <InfoCard title="Total Fees Paid" value={`${totalFeePaid} ETH`} />
          </div>

          <Separator />

          <form onSubmit={(e) => { e.preventDefault(); setIsConfirmDialogOpen(true); }} className="space-y-4 app-property-details">
            <h3 className="text-xl font-semibold text-blue-700">Add/Update Member</h3>
            <p className="text-sm text-gray-600">Use this form to add or update a member. Ensure you provide the correct wallet address and set the appropriate fee amount for the selected month.</p>
            <div className="space-y-2">
              <Label htmlFor="memberAddress" className="app-label">Member Address</Label>
              <Input
                id="memberAddress"
                placeholder="0x..."
                value={newMemberAddress}
                onChange={(e) => setNewMemberAddress(e.target.value)}
                required
                className="app-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentMonth" className="app-label">Select Month</Label>
              <select
              title="month"
                id="currentMonth"
                value={currentMonth}
                onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                className="app-select"
              >
                {MONTHS.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
              <p className="text-sm text-gray-600 mt-2">Select the correct month for which you want to pay the fee. This helps us keep track of the payments efficiently.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feeAmount" className="app-label">Fee Amount (ETH)</Label>
              <Input
                id="feeAmount"
                type="number"
                step="0.01"
                value={feeAmount}
                onChange={(e) => setFeeAmount(e.target.value)}
                required
                className="app-input"
              />
            </div>
            <Button type="submit" disabled={loading} className="app-button">
              {loading ? <Spinner className="app-spinner" /> : null}
              Add/Update Member
            </Button>
          </form>

          <Separator />

          <div className="flex items-center space-x-2">
            <Switch
              id="show-members"
              checked={showCurrentMembers}
              onCheckedChange={setShowCurrentMembers}
              className="focus:ring-blue-500"
            />
            <Label htmlFor="show-members">Show Current Members</Label>
          </div>
          {showCurrentMembers && (
            <div className="mt-4 app-property-details">
              <h3 className="text-lg font-semibold mb-2 text-blue-700">Current Members</h3>
              <p className="text-sm text-gray-600 mb-2">Below is the list of current members associated with this property. If you need to update a member, use the form above.</p>
              <ul className="list-disc list-inside text-gray-800">
                {currentMembers.map((member, index) => (
                  <li key={index}>{member}</li>
                ))}
              </ul>
            </div>
          )}

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

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Member Addition/Update</DialogTitle>
            <DialogDescription>
              Are you sure you want to add/update the following member?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p><strong>Address:</strong> {newMemberAddress}</p>
            <p><strong>Month:</strong> {MONTHS[currentMonth]}</p>
            <p><strong>Fee Amount:</strong> {feeAmount} ETH</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>Cancel</Button>
            <Button onClick={addMember} className="app-button">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

function InfoCard({ title, value }: { title: string, value: string }) {
  return (
    <Card className="app-info-card">
      <CardHeader className="app-info-card-header">
        <CardTitle className="app-info-card-title">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="app-info-card-value">{value}</div>
      </CardContent>
    </Card>
  )
}
