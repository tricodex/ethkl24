"use client"

import { useState } from "react"
import { Building, ChevronDown, CreditCard, FileText, Home, Menu, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data - replace with actual data fetching in production
const ESTATES = [
  { id: 1, name: "Sunnyvale Residences", totalHouseholds: 50, totalResidents: 120, monthlyRevenue: 24000 },
  { id: 2, name: "Greenwood Heights", totalHouseholds: 30, totalResidents: 85, monthlyRevenue: 18000 },
  { id: 3, name: "Oakridge Community", totalHouseholds: 40, totalResidents: 110, monthlyRevenue: 22000 },
]

export default function HEADDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-4">
            <span className="text-2xl font-semibold">HEAD Owner</span>
          </div>
          <nav className="flex-1 space-y-2 px-2">
            {[
              { icon: Home, label: "Dashboard" },
              { icon: Building, label: "Estates" },
              { icon: Users, label: "Admins" },
              { icon: CreditCard, label: "Finances" },
              { icon: FileText, label: "Reports" },
              { icon: Settings, label: "Settings" },
            ].map((item) => (
              <Button key={item.label} variant="ghost" className="w-full justify-start">
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    Owner User
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Owner User</p>
                      <p className="text-xs leading-none text-muted-foreground">owner@head.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <h1 className="mb-6 text-3xl font-bold">HEAD Owner Dashboard</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Total Estates", value: ESTATES.length, description: "Managed estates" },
              { title: "Total Households", value: ESTATES.reduce((acc, estate) => acc + estate.totalHouseholds, 0), description: "Across all estates" },
              { title: "Total Residents", value: ESTATES.reduce((acc, estate) => acc + estate.totalResidents, 0), description: "Living in managed estates" },
              { title: "Monthly Revenue", value: `$${ESTATES.reduce((acc, estate) => acc + estate.monthlyRevenue, 0).toLocaleString()}`, description: "Total monthly fees" },
            ].map((item, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.value}</div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6">
            <Tabs defaultValue="estates" className="space-y-4">
              <TabsList>
                <TabsTrigger value="estates">Managed Estates</TabsTrigger>
                <TabsTrigger value="admins">Estate Admins</TabsTrigger>
                <TabsTrigger value="finances">Finances</TabsTrigger>
              </TabsList>
              <TabsContent value="estates">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle>Managed Estates</CardTitle>
                      <Button>Add New Estate</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Estate Name</TableHead>
                          <TableHead>Total Households</TableHead>
                          <TableHead>Total Residents</TableHead>
                          <TableHead>Monthly Revenue</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ESTATES.map((estate) => (
                          <TableRow key={estate.id}>
                            <TableCell className="font-medium">{estate.name}</TableCell>
                            <TableCell>{estate.totalHouseholds}</TableCell>
                            <TableCell>{estate.totalResidents}</TableCell>
                            <TableCell>${estate.monthlyRevenue.toLocaleString()}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">Manage</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="admins">
                {/* Content for managing estate admins */}
              </TabsContent>
              <TabsContent value="finances">
                {/* Content for financial overview and management */}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}