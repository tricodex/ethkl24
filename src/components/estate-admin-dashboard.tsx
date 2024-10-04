"use client"

import { useState } from "react"
import { Building, ChevronDown, CreditCard, FileText, Home, Menu, MessageSquare, Settings, Users, Vote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { AddHousehold } from './household-functions'

// Mock data - replace with actual data fetching in production
const ESTATE = {
  name: "Sunnyvale Residences",
  address: "0x1234567890123456789012345678901234567890" as `0x${string}`,
  totalHouseholds: 50,
  totalResidents: 120,
  monthlyRevenue: 24000,
  households: [
    { id: 1, unit: "A101", owner: "Alice Johnson", status: "Occupied" },
    { id: 2, unit: "B205", owner: "Bob Smith", status: "Occupied" },
    { id: 3, unit: "C310", owner: "Carol Williams", status: "Vacant" },
  ],
  payments: [
    { id: 1, unit: "A101", amount: 500, status: "Paid", date: "2024-03-01" },
    { id: 2, unit: "B205", amount: 500, status: "Pending", date: "2024-03-05" },
    { id: 3, unit: "C310", amount: 500, status: "Overdue", date: "2024-02-28" },
  ]
}

export default function EstateAdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-4">
            <span className="text-2xl font-semibold">{ESTATE.name}</span>
          </div>
          <nav className="flex-1 space-y-2 px-2">
            {[
              { icon: Home, label: "Dashboard" },
              { icon: Building, label: "Households" },
              { icon: Users, label: "Residents" },
              { icon: CreditCard, label: "Payments" },
              { icon: Vote, label: "Proposals" },
              { icon: MessageSquare, label: "Support" },
              { icon: FileText, label: "Documents" },
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
                    Admin User
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Admin User</p>
                      <p className="text-xs leading-none text-muted-foreground">admin@example.com</p>
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
          <h1 className="mb-6 text-3xl font-bold">{ESTATE.name} Admin Dashboard</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Total Households", value: ESTATE.totalHouseholds, description: "Managed households" },
              { title: "Total Residents", value: ESTATE.totalResidents, description: "Current occupancy" },
              { title: "Occupancy Rate", value: `${Math.round((ESTATE.totalResidents / (ESTATE.totalHouseholds * 2)) * 100)}%`, description: "Based on max capacity" },
              { title: "Monthly Revenue", value: `$${ESTATE.monthlyRevenue.toLocaleString()}`, description: "Total monthly fees" },
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
            <Tabs defaultValue="households" className="space-y-4">
              <TabsList>
                <TabsTrigger value="households">Households</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="residents">Residents</TabsTrigger>
              </TabsList>
              <TabsContent value="households">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Households</CardTitle>
                      <AddHousehold estateAddress={ESTATE.address} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Unit</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ESTATE.households.map((household) => (
                          <TableRow key={household.id}>
                            <TableCell>{household.unit}</TableCell>
                            <TableCell>{household.owner}</TableCell>
                            <TableCell>{household.status}</TableCell>
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
              <TabsContent value="payments">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Recent Payments</CardTitle>
                      <Input type="month" className="w-40" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Unit</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ESTATE.payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{payment.unit}</TableCell>
                            <TableCell>${payment.amount}</TableCell>
                            <TableCell>{payment.status}</TableCell>
                            <TableCell>{payment.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="residents">
                <Card>
                  <CardHeader>
                    <CardTitle>Residents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Resident management features will be implemented here.</p>
                    {/* Add resident management content here */}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}