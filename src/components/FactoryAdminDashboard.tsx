import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Label } from "@/components/ui/label"
import { getPublicClient, getWalletClient, getWalletAddress } from '@/lib/viemClient'
import { parseEther, Abi } from 'viem'
import DPMAFactoryABI from '@/lib/abis/DPMAFactory.json'
import Image from 'next/image'


interface FactoryAdminDashboardProps {
  factoryAddress: string
}

export function FactoryAdminDashboard({ factoryAddress }: FactoryAdminDashboardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [propertyName, setPropertyName] = useState("")
  const [initialBalance, setInitialBalance] = useState("")
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  const deployProperty = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const publicClient = getPublicClient()
      const walletClient = await getWalletClient()
      const address = await getWalletAddress()

      const { request } = await publicClient.simulateContract({
        account: address,
        address: factoryAddress as `0x${string}`,
        abi: DPMAFactoryABI.abi as Abi,
        functionName: 'deployProperty',
        args: [parseEther(initialBalance), address, propertyName],
      })

      const hash = await walletClient.writeContract(request)

      await publicClient.waitForTransactionReceipt({ hash })

      setSuccess(`Property deployed successfully. Transaction hash: ${hash}`)
      setPropertyName("")
      setInitialBalance("")
    } catch (err) {
      console.error('Error deploying property:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while deploying the property.')
    } finally {
      setLoading(false)
      setIsConfirmDialogOpen(false)
    }
  }

  return (
    <Card className="app-card w-full max-w-2xl mx-auto">
      <CardHeader className="app-card-header">
        <CardTitle className="app-card-title">Factory Admin Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="app-dashboard-intro">
          <Image src='/residental.jpeg' width={512} height={512} alt="Property View" className="app-property-image self-center items-center" />
          <p className="app-dashboard-text">Welcome to the Factory Admin Dashboard. Here, you can deploy new properties and manage the settings for each property. Please ensure your wallet is properly connected to proceed with deploying new contracts.</p>
        </div>
        <Separator className="app-separator" />
        <div className="space-y-6">
          <form onSubmit={(e) => { e.preventDefault(); setIsConfirmDialogOpen(true); }} className="app-property-form space-y-4">
            <h3 className="app-form-title text-lg font-semibold">Deploy New Property</h3>
            <div className="space-y-2">
              <Label htmlFor="propertyName" className="app-label">Property Name</Label>
              <Input
                id="propertyName"
                placeholder="Enter Property Name"
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                required
                className="app-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="initialBalance" className="app-label">Initial Balance (ETH)</Label>
              <Input
                id="initialBalance"
                type="number"
                step="0.01"
                placeholder="Initial Balance in ETH"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                required
                className="app-input"
              />
            </div>
            <Button type="submit" disabled={loading} className="app-button w-full">
              {loading ? <Spinner className="app-spinner mr-2" /> : null}
              Deploy Property
            </Button>
          </form>

          <Separator className="app-separator" />

          {error && (
            <Alert variant="destructive" className="app-alert-error">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert variant="default" className="app-alert-success">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader className="app-dialog-header">
            <DialogTitle>Confirm Property Deployment</DialogTitle>
            <DialogDescription>
              Are you sure you want to deploy the following property?
            </DialogDescription>
          </DialogHeader>
          <div className="app-dialog-content py-4">
            <p><strong>Property Name:</strong> {propertyName}</p>
            <p><strong>Initial Balance:</strong> {initialBalance} ETH</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)} className="app-button-outline">Cancel</Button>
            <Button onClick={deployProperty} className="app-button">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

