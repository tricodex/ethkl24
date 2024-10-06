// src/components/Dashboard.tsx
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FactoryAdminDashboard } from "./FactoryAdminDashboard"
import { PropertyAdminDashboard } from "./PropertyAdminDashboard"
import { ResidentDashboard } from "./ResidentDashboard"
import { getWalletAddress } from '@/lib/viemClient'

// const FACTORY_ADDRESS = "0xC579057f8b98D164098489f56170E8f4C27b12B6"
const FACTORY_ADDRESS = "0x9f74010DA23386AF9d3CBa9ee8ca2c37e66906ae"

export function Dashboard() {
  const [userAddress, setUserAddress] = useState<string | null>(null)
  const [propertyAddress, setPropertyAddress] = useState<string>("")

  useEffect(() => {
    const fetchAddress = async () => {
      const address = await getWalletAddress()
      setUserAddress(address)
    }
    fetchAddress()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>HEAD Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Connected Address: {userAddress}</p>
          <div className="mt-4">
            <Input
              placeholder="Enter Property Address"
              value={propertyAddress}
              onChange={(e) => setPropertyAddress(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="factory_admin">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="factory_admin">Factory Admin</TabsTrigger>
          <TabsTrigger value="property_admin">Property Admin</TabsTrigger>
          <TabsTrigger value="resident">Resident</TabsTrigger>
        </TabsList>
        <TabsContent value="factory_admin">
          <FactoryAdminDashboard factoryAddress={FACTORY_ADDRESS} />
        </TabsContent>
        <TabsContent value="property_admin">
          <PropertyAdminDashboard propertyAddress={propertyAddress} />
        </TabsContent>
        <TabsContent value="resident">
          <ResidentDashboard propertyAddress={propertyAddress} />
        </TabsContent>
      </Tabs>
    </div>
  )
}