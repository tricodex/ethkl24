"use client"

import { useState } from "react"
import { Bell, Building, Calendar, DollarSign, FileText, Home, Menu, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function PropertyManagementDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-6">
            <span className="text-2xl font-semibold">PropManage</span>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 space-y-2 px-2">
            {[
              { icon: Home, label: "Dashboard" },
              { icon: Building, label: "Properties" },
              { icon: Users, label: "Tenants" },
              { icon: DollarSign, label: "Finances" },
              { icon: FileText, label: "Documents" },
              { icon: Calendar, label: "Calendar" },
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
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    ID
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">John Doe</p>
                      <p className="text-xs leading-none text-muted-foreground">john@example.com</p>
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
          <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Total Properties", value: "24", description: "4 new this month" },
              { title: "Occupied Units", value: "142", description: "86% occupancy rate" },
              { title: "Pending Maintenance", value: "8", description: "3 urgent requests" },
              { title: "Monthly Revenue", value: "$52,450", description: "12% increase from last month" },
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
            <Tabs defaultValue="properties" className="space-y-4">
              <TabsList>
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="tenants">Tenants</TabsTrigger>
                <TabsTrigger value="finances">Finances</TabsTrigger>
              </TabsList>
              <TabsContent value="properties" className="space-y-4">
                <div className="flex justify-between">
                  <h2 className="text-xl font-semibold">Property List</h2>
                  <Button>Add Property</Button>
                </div>
                <Table>
                  <TableCaption>A list of your properties.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Address</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Occupancy</TableHead>
                      <TableHead className="text-right">Monthly Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* placeholder */}
                    {[
                      { address: "123 Main St", units: 12, occupancy: "92%", revenue: "$14,400" },
                      { address: "456 Elm St", units: 8, occupancy: "75%", revenue: "$7,200" },
                      { address: "789 Oak Ave", units: 20, occupancy: "95%", revenue: "$22,800" },
                    ].map((property, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{property.address}</TableCell>
                        <TableCell>{property.units}</TableCell>
                        <TableCell>{property.occupancy}</TableCell>
                        <TableCell className="text-right">{property.revenue}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="tenants" className="space-y-4">
                <div className="flex justify-between">
                  <h2 className="text-xl font-semibold">Tenant List</h2>
                  <Button>Add Tenant</Button>
                </div>
                <Table>
                  <TableCaption>A list of your tenants.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Lease End</TableHead>
                      <TableHead className="text-right">Rent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { name: "Alice Johnson", unit: "Apt 101", leaseEnd: "12/31/2023", rent: "$1,200" },
                      { name: "Bob Smith", unit: "Apt 202", leaseEnd: "06/30/2024", rent: "$1,400" },
                      { name: "Carol Williams", unit: "Apt 303", leaseEnd: "03/31/2024", rent: "$1,300" },
                    ].map((tenant, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{tenant.name}</TableCell>
                        <TableCell>{tenant.unit}</TableCell>
                        <TableCell>{tenant.leaseEnd}</TableCell>
                        <TableCell className="text-right">{tenant.rent}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="finances" className="space-y-4">
                <div className="flex justify-between">
                  <h2 className="text-xl font-semibold">Financial Overview</h2>
                  <Button>Generate Report</Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$54,231</div>
                      <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$12,345</div>
                      <p className="text-xs text-muted-foreground">+4.75% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Net Income</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$41,886</div>
                      <p className="text-xs text-muted-foreground">+14.2% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">92%</div>
                      <p className="text-xs text-muted-foreground">+2.5% from last month</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}