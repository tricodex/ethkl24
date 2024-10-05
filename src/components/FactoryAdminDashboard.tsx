// src/components/FactoryAdminDashboard.tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getPublicClient, getWalletClient, getWalletAddress } from '@/lib/viemClient'
import { parseEther, Abi } from 'viem'
import DPMAFactoryABI from '@/lib/abis/DPMAFactory.json'

interface FactoryAdminDashboardProps {
  factoryAddress: string
}

export function FactoryAdminDashboard({ factoryAddress }: FactoryAdminDashboardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [propertyName, setPropertyName] = useState("")
  const [initialBalance, setInitialBalance] = useState("")

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

      setSuccess(`Property deployed. Transaction hash: ${hash}`)
    } catch (err) {
      console.error('Error deploying property:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Factory Admin Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Property Name"
            value={propertyName}
            onChange={(e) => setPropertyName(e.target.value)}
          />
          <Input
            placeholder="Initial Balance (ETH)"
            value={initialBalance}
            onChange={(e) => setInitialBalance(e.target.value)}
          />
          <Button onClick={deployProperty} disabled={loading}>
            {loading ? 'Deploying...' : 'Deploy Property'}
          </Button>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </div>
      </CardContent>
    </Card>
  )
}