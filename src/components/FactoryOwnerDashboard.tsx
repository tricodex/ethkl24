// components/FactoryOwnerDashboard.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getPublicClient, getWalletClient, getWalletAddress, DPMA_FACTORY_ADDRESS, CONTROLLER_ADDRESS } from '@/lib/viemClient'
import { parseEther } from 'viem'
import DPMAFactoryABI from '@/lib/abis/DPMAFactory.json'

export function FactoryOwnerDashboard() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [propertyName, setPropertyName] = useState("")
  const [initialBalance, setInitialBalance] = useState("")

  const linkControllerToFactory = async () => { 
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const publicClient = getPublicClient()
      const walletClient = await getWalletClient()
      const address = await getWalletAddress()

      const { request } = await publicClient.simulateContract({
        account: address,
        address: DPMA_FACTORY_ADDRESS,
        abi: DPMAFactoryABI.abi,
        functionName: 'addController',
        args: [CONTROLLER_ADDRESS],
      })

      const hash = await walletClient.writeContract(request)

      await publicClient.waitForTransactionReceipt({ hash })

      setSuccess(`Controller linked to Factory. Transaction hash: ${hash}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

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
        address: DPMA_FACTORY_ADDRESS,
        abi: DPMAFactoryABI.abi,
        functionName: 'deployProperty',
        args: [parseEther(initialBalance), address, propertyName],
      })

      const hash = await walletClient.writeContract(request)

      await publicClient.waitForTransactionReceipt({ hash })

      setSuccess(`Property deployed. Transaction hash: ${hash}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Link Controller to Factory</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={linkControllerToFactory} disabled={loading}>
            {loading ? 'Linking...' : 'Link Controller to Factory'}
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Deploy New Property</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Property Name"
            value={propertyName}
            onChange={(e) => setPropertyName(e.target.value)}
            className="mb-2"
          />
          <Input
            type="text"
            placeholder="Initial Balance (in ETH)"
            value={initialBalance}
            onChange={(e) => setInitialBalance(e.target.value)}
            className="mb-2"
          />
          <Button onClick={deployProperty} disabled={loading}>
            {loading ? 'Deploying...' : 'Deploy Property'}
          </Button>
        </CardContent>
      </Card>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  )
}