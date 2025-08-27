"use client"

import { useState } from "react"
import { AuthWrapper } from "@/components/auth-wrapper"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Eye, 
  Search, 
  Filter, 
  Clock, 
  User, 
  Activity, 
  FileText, 
  Users, 
  Car,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react"
import { useUser } from "@/lib/user-context"

// Mock data for manager activities
const mockManagerActivities = [
  {
    id: 1,
    manager: "Manager User",
    action: "Created new customer",
    details: "Added John Doe (CUST001)",
    timestamp: "2024-01-20 14:30:00",
    type: "customer",
    status: "completed",
  },
  {
    id: 2,
    manager: "Manager User",
    action: "Updated job card",
    details: "Job Card JC-2024-001 marked as completed",
    timestamp: "2024-01-20 13:45:00",
    type: "job_card",
    status: "completed",
  },
  {
    id: 3,
    manager: "Manager User",
    action: "Generated invoice",
    details: "Invoice INV-2024-015 for TSH 450,000",
    timestamp: "2024-01-20 12:20:00",
    type: "invoice",
    status: "completed",
  },
  {
    id: 4,
    manager: "Manager User",
    action: "Attempted inventory access",
    details: "Access denied - Admin only feature",
    timestamp: "2024-01-20 11:15:00",
    type: "access_denied",
    status: "blocked",
  },
  {
    id: 5,
    manager: "Manager User",
    action: "Processed payment",
    details: "Payment received for Invoice INV-2024-014",
    timestamp: "2024-01-20 10:30:00",
    type: "payment",
    status: "completed",
  },
]

const mockManagerStats = {
  totalActions: 156,
  todayActions: 12,
  accessDenials: 3,
  activeManagers: 1,
  completedTasks: 89,
  pendingTasks: 7,
}

export default function ManagerActivitiesPage() {
  const { isAdmin } = useUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [timeRange, setTimeRange] = useState("today")

  // Redirect non-admin users
  if (!isAdmin) {
    return (
      <AuthWrapper>
        <div className="flex items-center justify-center min-h-screen bg-background">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                Access Denied
              </CardTitle>
              <CardDescription>
                This page is only accessible to Admin users.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </AuthWrapper>
    )
  }

  const filteredActivities = mockManagerActivities.filter((activity) => {
    const matchesSearch = activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.details.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || activity.type === filterType
    return matchesSearch && matchesType
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "blocked":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "customer":
        return "bg-blue-100 text-blue-800"
      case "job_card":
        return "bg-green-100 text-green-800"
      case "invoice":
        return "bg-purple-100 text-purple-800"
      case "payment":
        return "bg-emerald-100 text-emerald-800"
      case "access_denied":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <AuthWrapper>
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Breadcrumb */}
              <div className="flex items-center text-sm text-muted-foreground">
                <span>Admin Panel</span>
                <span className="mx-2">/</span>
                <span className="text-foreground">Manager Activities</span>
              </div>

              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Manager Activities</h1>
                  <p className="text-muted-foreground">Monitor and track all manager user activities and actions</p>
                </div>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  Admin Oversight
                </Badge>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Total Actions</p>
                        <p className="text-2xl font-bold">{mockManagerStats.totalActions}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Today</p>
                        <p className="text-2xl font-bold">{mockManagerStats.todayActions}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <div>
                        <p className="text-sm font-medium">Access Denials</p>
                        <p className="text-2xl font-bold">{mockManagerStats.accessDenials}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium">Active Managers</p>
                        <p className="text-2xl font-bold">{mockManagerStats.activeManagers}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <div>
                        <p className="text-sm font-medium">Completed</p>
                        <p className="text-2xl font-bold">{mockManagerStats.completedTasks}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium">Pending</p>
                        <p className="text-2xl font-bold">{mockManagerStats.pendingTasks}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <Tabs defaultValue="activities" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="activities">Recent Activities</TabsTrigger>
                  <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
                  <TabsTrigger value="access-logs">Access Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="activities" className="space-y-4">
                  {/* Filters */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Activity Monitor</CardTitle>
                      <CardDescription>Real-time tracking of manager user actions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4 mb-4">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search activities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        <Select value={filterType} onValueChange={setFilterType}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="customer">Customer</SelectItem>
                            <SelectItem value="job_card">Job Cards</SelectItem>
                            <SelectItem value="invoice">Invoices</SelectItem>
                            <SelectItem value="payment">Payments</SelectItem>
                            <SelectItem value="access_denied">Access Denied</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={timeRange} onValueChange={setTimeRange}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Activities Table */}
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Status</TableHead>
                              <TableHead>Manager</TableHead>
                              <TableHead>Action</TableHead>
                              <TableHead>Details</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Timestamp</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredActivities.map((activity) => (
                              <TableRow key={activity.id}>
                                <TableCell>
                                  {getStatusIcon(activity.status)}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {activity.manager}
                                </TableCell>
                                <TableCell>{activity.action}</TableCell>
                                <TableCell className="max-w-xs truncate">
                                  {activity.details}
                                </TableCell>
                                <TableCell>
                                  <Badge className={getTypeColor(activity.type)}>
                                    {activity.type.replace("_", " ").toUpperCase()}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {activity.timestamp}
                                </TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Manager Performance Metrics</CardTitle>
                      <CardDescription>Efficiency and productivity tracking</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 border rounded-lg">
                            <p className="text-2xl font-bold text-green-600">94%</p>
                            <p className="text-sm text-muted-foreground">Task Completion Rate</p>
                          </div>
                          <div className="text-center p-4 border rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">2.3 hrs</p>
                            <p className="text-sm text-muted-foreground">Avg Response Time</p>
                          </div>
                          <div className="text-center p-4 border rounded-lg">
                            <p className="text-2xl font-bold text-purple-600">87%</p>
                            <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="access-logs" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Access Control Logs</CardTitle>
                      <CardDescription>Monitor access attempts and security events</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <XCircle className="h-4 w-4 text-red-600" />
                            <div>
                              <p className="font-medium">Inventory Access Denied</p>
                              <p className="text-sm text-muted-foreground">Manager User attempted to access inventory</p>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">2024-01-20 11:15:00</span>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <div>
                              <p className="font-medium">Successful Login</p>
                              <p className="text-sm text-muted-foreground">Manager User logged in successfully</p>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">2024-01-20 08:30:00</span>
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
    </AuthWrapper>
  )
}
