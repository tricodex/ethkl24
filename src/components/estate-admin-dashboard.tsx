// components/EstateAdminDashboard.tsx
"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FactoryOwnerDashboard } from "./FactoryOwnerDashboard"
import { PropertyManagerDashboard } from "./PropertyManagerDashboard"

export default function EstateAdminDashboard() {
  const [propertyAddress] = useState("0xd064B0148b78fda71908718b3BF13099E210fC16")

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <h1 className="mb-6 text-3xl font-bold">Estate Admin Dashboard</h1>
          
          <Tabs defaultValue="factory" className="space-y-4">
            <TabsList>
              <TabsTrigger value="factory">Admin</TabsTrigger>
              <TabsTrigger value="property">Property Manager</TabsTrigger>
            </TabsList>
            <TabsContent value="factory">
              <FactoryOwnerDashboard />
            </TabsContent>
            <TabsContent value="property">
              <PropertyManagerDashboard propertyAddress={propertyAddress} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}