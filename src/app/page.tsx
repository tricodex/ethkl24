"use client"

import { useState } from "react"
import { Building, ChevronDown, CreditCard, FileText, Home, Menu, MessageSquare, Settings, Users, Vote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { Progress } from "@/components/ui/progress"

export default function HousingAssociationDashboard() {
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
            <span className="text-2xl font-semibold">HEAD Homes</span>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 space-y-2 px-2">
            {[
              { icon: Home, label: "Dashboard" },
              { icon: Building, label: "Properties" },
              { icon: Users, label: "Residents" },
              { icon: CreditCard, label: "Payments" },
              { icon: Vote, label: "Proposals" },
              { icon: MessageSquare, label: "HEAD Buddy" },
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
                    John Doe
                    <ChevronDown className="ml-2 h-4 w-4" />
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
          <h1 className="mb-6 text-3xl font-bold">Housing Association Dashboard</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Total Properties", value: "5", description: "1 new this month" },
              { title: "Total Residents", value: "120", description: "98% occupancy rate" },
              { title: "Active Proposals", value: "3", description: "1 pending approval" },
              { title: "Monthly Service Payments", value: "$24,000", description: "95% collection rate" },
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
            <Tabs defaultValue="payments" className="space-y-4">
              <TabsList>
                <TabsTrigger value="payments">Service Payments</TabsTrigger>
                <TabsTrigger value="proposals">Proposals</TabsTrigger>
                <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
              </TabsList>
              <TabsContent value="payments" className="space-y-4">
                <div className="flex justify-between">
                  <h2 className="text-xl font-semibold">Monthly Service Payments</h2>
                  <Button>View All</Button>
                </div>
                <Table>
                  <TableCaption>Recent service payments tracked on the blockchain.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resident</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Transaction Hash</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { resident: "Alice Johnson", unit: "A101", amount: "$200", status: "Paid", hash: "0x1234...5678" },
                      { resident: "Bob Smith", unit: "B205", amount: "$200", status: "Pending", hash: "0xabcd...efgh" },
                      { resident: "Carol Williams", unit: "C310", amount: "$200", status: "Paid", hash: "0x9876...5432" },
                    ].map((payment, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{payment.resident}</TableCell>
                        <TableCell>{payment.unit}</TableCell>
                        <TableCell>{payment.amount}</TableCell>
                        <TableCell>{payment.status}</TableCell>
                        <TableCell className="font-mono text-xs">{payment.hash}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="proposals" className="space-y-4">
                <div className="flex justify-between">
                  <h2 className="text-xl font-semibold">Active Proposals</h2>
                  <Button>Create New Proposal</Button>
                </div>
                <div className="grid gap-4">
                  {[
                    { title: "Upgrade Lobby Furniture", votes: 45, threshold: 60, description: "Replace old furniture in the main lobby with modern, comfortable seating." },
                    { title: "Install Solar Panels", votes: 72, threshold: 70, description: "Install solar panels on the roof to reduce electricity costs and improve sustainability." },
                    { title: "Hire New Security Staff", votes: 30, threshold: 65, description: "Hire additional security personnel to improve safety in the complex." },
                  ].map((proposal, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{proposal.title}</CardTitle>
                        <CardDescription>{proposal.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span>Votes: {proposal.votes}/{proposal.threshold}</span>
                          <span>{Math.round((proposal.votes / proposal.threshold) * 100)}%</span>
                        </div>
                        <Progress value={(proposal.votes / proposal.threshold) * 100} className="mt-2" />
                        <Button className="mt-4 w-full">Vote</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="ai-assistant" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Assistant</CardTitle>
                    <CardDescription>Get help with proposals or ask questions about your property.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded p-4 bg-muted">
                        <p className="font-semibold">AI:</p>
                        <p>Hello! How can I assist you today? Would you like help drafting a proposal or do you have any questions about your property?</p>
                      </div>
                      <div className="flex space-x-2">
                        <Input placeholder="Type your message here..." />
                        <Button>Send</Button>
                      </div>
                    </div>
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