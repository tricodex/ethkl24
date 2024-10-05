"use client"

import { useState } from "react"
import { ChevronDown, CreditCard, FileText, Home, Menu, MessageSquare, Settings, Vote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PayHouseholdFee } from './household-functions'
import { PlanningAssistant } from './homy/PlanningAssistant'
import { ProposalWriter } from './homy/ProposalWriter'
import { ResidentChatbot } from './homy/ResidentChatbot'

// Mock data 
const RESIDENT = {
  name: "John Doe",
  unit: "A101",
  estateName: "Sunnyvale Residences",
  estateAddress: "0x1234567890123456789012345678901234567890" as `0x${string}`,
  balance: 500,
  payments: [
    { id: 1, amount: 500, status: "Paid", date: "2024-03-01" },
    { id: 2, amount: 500, status: "Paid", date: "2024-02-01" },
    { id: 3, amount: 500, status: "Paid", date: "2024-01-01" },
  ],
  proposals: [
    { id: 1, title: "Upgrade Lobby Furniture", status: "Open", dueDate: "2024-04-15" },
    { id: 2, title: "Install Solar Panels", status: "Closed", dueDate: "2024-03-30" },
  ]
}

export default function EstateResidentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-4">
            <span className="text-2xl font-semibold">Resident Portal</span>
          </div>
          <nav className="flex-1 space-y-2 px-2">
            {[
              { icon: Home, label: "Dashboard" },
              { icon: CreditCard, label: "Payments" },
              { icon: Vote, label: "Proposals" },
              { icon: MessageSquare, label: "Chat with Homy" },
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
                    {RESIDENT.name}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{RESIDENT.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{RESIDENT.unit}</p>
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
          <h1 className="mb-6 text-3xl font-bold">Welcome, {RESIDENT.name}</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Current Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">${RESIDENT.balance}</p>
                <PayHouseholdFee estateAddress={RESIDENT.estateAddress} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Next Payment Due</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">April 1, 2024</p>
                <p className="text-sm text-muted-foreground">Amount: $500</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Active Proposals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{RESIDENT.proposals.filter(p => p.status === "Open").length}</p>
                <Button className="mt-4">View Proposals</Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Tabs defaultValue="payments" className="space-y-4">
              <TabsList>
                <TabsTrigger value="payments">Payment History</TabsTrigger>
                <TabsTrigger value="proposals">Proposals</TabsTrigger>
                <TabsTrigger value="planning">AI Planning</TabsTrigger>
                <TabsTrigger value="proposal-writer">Proposal Writer</TabsTrigger>
                <TabsTrigger value="chat">Chat with Homy</TabsTrigger>
              </TabsList>
              <TabsContent value="payments">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {RESIDENT.payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>${payment.amount}</TableCell>
                            <TableCell>{payment.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="proposals">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Proposals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {RESIDENT.proposals.map((proposal) => (
                          <TableRow key={proposal.id}>
                            <TableCell>{proposal.title}</TableCell>
                            <TableCell>{proposal.status}</TableCell>
                            <TableCell>{proposal.dueDate}</TableCell>
                            <TableCell>
                              {proposal.status === "Open" && <Button size="sm">Vote</Button>}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="planning">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Planning Assistant</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PlanningAssistant />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="proposal-writer">
                <Card>
                  <CardHeader>
                    <CardTitle>Proposal Writer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProposalWriter />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="chat">
                <Card>
                  <CardHeader>
                    <CardTitle>Chat with Homy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResidentChatbot />
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