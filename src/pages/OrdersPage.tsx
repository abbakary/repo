"use client"

import { useState, useEffect } from "react"
import { AuthWrapper } from "@/components/auth-wrapper"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Search, Filter, Eye, Edit, Clock, User, Car, Wrench, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { OrderUpdateForm } from "@/components/order-update-form"
import { OrderAnalytics } from "@/components/order-analytics"
import { InquiryAnalytics } from "@/components/inquiry-analytics"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Order } from "@/lib/types"

// Mock data for orders - in real app, this would come from database
const mockOrders: Order[] = [
  {
    id: 1,
    order_number: "ORD-2024-001",
    customer_id: 1,
    vehicle_id: 1,
    order_type: "service",
    status: "in_progress",
    priority: "normal",
    description: "Car service - Oil change and brake inspection",
    estimated_completion: "2024-01-20T16:00:00",
    total_amount: 85000,
    discount_amount: 0,
    tax_amount: 15300,
    final_amount: 100300,
    created_by: 1,
    assigned_to: 2,
    created_at: "2024-01-20T08:30:00",
    updated_at: "2024-01-20T08:30:00",
  },
  {
    id: 2,
    order_number: "ORD-2024-002",
    customer_id: 2,
    order_type: "sales",
    status: "created",
    priority: "high",
    description: "Tire sales - 4 Michelin tires 205/55R16",
    estimated_completion: "2024-01-20T14:00:00",
    total_amount: 320000,
    discount_amount: 20000,
    tax_amount: 54000,
    final_amount: 354000,
    created_by: 1,
    created_at: "2024-01-20T09:00:00",
    updated_at: "2024-01-20T09:00:00",
  },
  {
    id: 3,
    order_number: "ORD-2024-003", 
    customer_id: 3,
    order_type: "consultation",
    status: "completed",
    priority: "low",
    description: "Inquiry about transmission service pricing",
    actual_completion: "2024-01-19T15:30:00",
    total_amount: 0,
    discount_amount: 0,
    tax_amount: 0,
    final_amount: 0,
    created_by: 1,
    created_at: "2024-01-19T14:00:00",
    updated_at: "2024-01-19T15:30:00",
  },
]

// Mock data for customers and related info
const mockCustomers = [
  { id: 1, name: "John Mwalimu", customer_code: "CUST001", phone: "+255 712 345 678" },
  { id: 2, name: "Tanzania Revenue Authority", customer_code: "CUST002", phone: "+255 22 211 1111" },
  { id: 3, name: "Mama Fatuma", customer_code: "CUST003", phone: "+255 754 987 654" },
]

const mockVehicles = [
  { id: 1, plate_number: "T123ABC", make: "Toyota", model: "Corolla" },
  { id: 2, plate_number: "GVT001", make: "Toyota", model: "Land Cruiser" },
]

const statusColors = {
  created: "bg-yellow-100 text-yellow-800",
  assigned: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

const orderTypeColors = {
  service: "bg-blue-100 text-blue-800",
  sales: "bg-green-100 text-green-800", 
  consultation: "bg-gray-100 text-gray-800",
}

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  normal: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderUpdate, setShowOrderUpdate] = useState(false)
  const [activeTab, setActiveTab] = useState("orders")
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [timeTracking, setTimeTracking] = useState<{[key: number]: { start: string, current: number }}>({})

  useEffect(() => {
    // Start time tracking for in-progress orders
    const interval = setInterval(() => {
      setTimeTracking(prev => {
        const newTracking = { ...prev }
        orders.forEach(order => {
          if (order.status === "in_progress" && !newTracking[order.id]) {
            newTracking[order.id] = {
              start: new Date().toISOString(),
              current: 0
            }
          }
          if (order.status === "in_progress" && newTracking[order.id]) {
            const startTime = new Date(newTracking[order.id].start).getTime()
            const currentTime = new Date().getTime()
            newTracking[order.id].current = Math.floor((currentTime - startTime) / 1000 / 60) // minutes
          }
        })
        return newTracking
      })
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [orders])

  const filteredOrders = orders.filter((order) => {
    const customer = mockCustomers.find(c => c.id === order.customer_id)
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus
    const matchesType = selectedType === "all" || order.order_type === selectedType
    return matchesSearch && matchesStatus && matchesType
  })

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowOrderUpdate(true)
  }

  const handleOrderUpdate = (updatedOrder: Order) => {
    setOrders(prev => prev.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ))
    
    // If order is completed, trigger job card and invoice generation
    if (updatedOrder.status === "completed" && selectedOrder?.status !== "completed") {
      generateJobCardAndInvoice(updatedOrder)
    }
    
    setShowOrderUpdate(false)
    setSelectedOrder(null)
  }

  const generateJobCardAndInvoice = async (order: Order) => {
    try {
      const timestamp = Date.now()
      const jobCardNumber = `JC-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(timestamp).slice(-3)}`
      const invoiceNumber = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(timestamp + 1).slice(-3)}`

      // Generate Job Card with enhanced details
      const jobCard = {
        id: timestamp,
        job_card_number: jobCardNumber,
        order_id: order.id,
        customer_id: order.customer_id,
        vehicle_id: order.vehicle_id,
        status: "pending",
        priority: order.priority,
        time_in: new Date().toISOString(),
        estimated_duration: order.order_type === "sales" ? 60 : order.order_type === "service" ? 120 : 30,
        work_description: order.description || "",
        customer_complaints: order.order_type === "service" ? "As per service order requirements" : "",
        assigned_technician: order.assigned_to,
        created_by: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Generate Invoice with enhanced details
      const invoice = {
        id: timestamp + 1,
        invoice_number: invoiceNumber,
        job_card_id: jobCard.id,
        order_id: order.id,
        customer_id: order.customer_id,
        status: "draft",
        invoice_type: order.order_type,
        subtotal: order.total_amount,
        tax_rate: 18.0,
        tax_amount: order.tax_amount,
        discount_amount: order.discount_amount,
        total_amount: order.final_amount,
        paid_amount: 0,
        balance_due: order.final_amount,
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        payment_terms: "Net 15 days",
        payment_method: null,
        payment_reference: null,
        notes: `Generated from Order: ${order.order_number}`,
        generated_by: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Store in localStorage for demo purposes (in real app, this would be API calls)
      const existingJobCards = JSON.parse(localStorage.getItem('jobCards') || '[]')
      const existingInvoices = JSON.parse(localStorage.getItem('invoices') || '[]')

      localStorage.setItem('jobCards', JSON.stringify([...existingJobCards, jobCard]))
      localStorage.setItem('invoices', JSON.stringify([...existingInvoices, invoice]))

      console.log("Generated Job Card:", jobCard)
      console.log("Generated Invoice:", invoice)

      // Enhanced success notification
      const customerName = mockCustomers.find(c => c.id === order.customer_id)?.name || "Unknown Customer"

      alert(`✅ AUTOMATIC GENERATION SUCCESSFUL!

📋 Job Card Generated:
• Number: ${jobCard.job_card_number}
• Customer: ${customerName}
• Priority: ${order.priority.toUpperCase()}
• Estimated Duration: ${jobCard.estimated_duration} minutes

🧾 Invoice Generated:
• Number: ${invoice.invoice_number}
• Total Amount: TSH ${order.final_amount.toLocaleString()}
• Due Date: ${invoice.due_date}
• Payment Terms: Net 15 days

🚀 Next Steps:
• Job card is ready for technician assignment
• Invoice is in draft status - ready for customer delivery
• Both documents are now available in their respective sections

The system has automatically processed your order completion!`)

      // Return generated items for potential further processing
      return { jobCard, invoice }

    } catch (error) {
      console.error("Error generating job card/invoice:", error)
      alert(`❌ GENERATION ERROR

Failed to generate job card and invoice for order ${order.order_number}.

Please try again or contact system administrator if the problem persists.

Error details: ${error instanceof Error ? error.message : 'Unknown error'}`)

      throw error
    }
  }

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      created: orders.filter(o => o.status === "created").length,
      assigned: orders.filter(o => o.status === "assigned").length,
      in_progress: orders.filter(o => o.status === "in_progress").length,
      completed: orders.filter(o => o.status === "completed").length,
      services: orders.filter(o => o.order_type === "service").length,
      sales: orders.filter(o => o.order_type === "sales").length,
      consultations: orders.filter(o => o.order_type === "consultation").length,
    }
    return stats
  }

  const orderStats = getOrderStats()

  const getCustomerName = (customerId: number) => {
    const customer = mockCustomers.find(c => c.id === customerId)
    return customer?.name || "Unknown Customer"
  }

  const getVehicleInfo = (vehicleId?: number) => {
    if (!vehicleId) return "N/A"
    const vehicle = mockVehicles.find(v => v.id === vehicleId)
    return vehicle ? `${vehicle.plate_number} - ${vehicle.make} ${vehicle.model}` : "Unknown Vehicle"
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
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
              <span>Service Operations</span>
              <span className="mx-2">/</span>
              <span className="text-foreground">Order Management</span>
            </div>

            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Order Management Dashboard</h1>
                <p className="text-muted-foreground">Track orders and generate job cards</p>
              </div>
            </div>

            {/* Tabs for different views */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="orders">Order Management</TabsTrigger>
                <TabsTrigger value="analytics">Order Analytics</TabsTrigger>
                <TabsTrigger value="inquiries">Inquiry Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="space-y-6">
                {/* Order Statistics */}
                <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-primary">{orderStats.total}</div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-yellow-600">{orderStats.created}</div>
                      <p className="text-sm text-muted-foreground">Created</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-blue-600">{orderStats.assigned}</div>
                      <p className="text-sm text-muted-foreground">Assigned</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-purple-600">{orderStats.in_progress}</div>
                      <p className="text-sm text-muted-foreground">In Progress</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-green-600">{orderStats.completed}</div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-blue-500">{orderStats.services}</div>
                      <p className="text-sm text-muted-foreground">Services</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-green-500">{orderStats.sales}</div>
                      <p className="text-sm text-muted-foreground">Sales</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-gray-500">{orderStats.consultations}</div>
                      <p className="text-sm text-muted-foreground">Inquiries</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Search and Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle>Search & Filter Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search by order number, customer, or description..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="created">Created</SelectItem>
                          <SelectItem value="assigned">Assigned</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="service">Car Service</SelectItem>
                          <SelectItem value="sales">Tire Sales</SelectItem>
                          <SelectItem value="consultation">Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Orders List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Orders ({filteredOrders.length} orders)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[12%]">Order #</TableHead>
                            <TableHead className="w-[18%]">Customer</TableHead>
                            <TableHead className="w-[10%] hidden md:table-cell">Type</TableHead>
                            <TableHead className="w-[15%] hidden lg:table-cell">Vehicle</TableHead>
                            <TableHead className="w-[20%] hidden md:table-cell">Description</TableHead>
                            <TableHead className="w-[10%]">Status</TableHead>
                            <TableHead className="w-[8%] hidden lg:table-cell">Priority</TableHead>
                            <TableHead className="w-[10%] hidden md:table-cell">Time</TableHead>
                            <TableHead className="w-[12%] hidden lg:table-cell">Amount</TableHead>
                            <TableHead className="w-[15%]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredOrders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{order.order_number}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {new Date(order.created_at).toLocaleDateString()}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">{getCustomerName(order.customer_id)}</div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <Badge className={orderTypeColors[order.order_type]}>
                                  {order.order_type}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">{getVehicleInfo(order.vehicle_id)}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                <div className="max-w-xs truncate" title={order.description}>
                                  {order.description}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={statusColors[order.status]}>
                                  {order.status.replace("_", " ")}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
                                <Badge className={priorityColors[order.priority]}>
                                  {order.priority}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {order.status === "in_progress" && timeTracking[order.id]
                                      ? formatDuration(timeTracking[order.id].current)
                                      : order.status === "completed"
                                        ? "Completed"
                                        : "Pending"
                                    }
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
                                <div className="text-sm">TSH {order.final_amount.toLocaleString()}</div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  {order.status === "completed" && (
                                    <Button variant="ghost" size="sm" className="text-green-600">
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <OrderAnalytics orders={orders} />
              </TabsContent>

              <TabsContent value="inquiries">
                <InquiryAnalytics orders={orders.filter(o => o.order_type === "consultation")} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Order Update Modal */}
      {showOrderUpdate && selectedOrder && (
        <OrderUpdateForm
          order={selectedOrder}
          userRole="manager" // In real app, this would come from authentication context
          onClose={() => {
            setShowOrderUpdate(false)
            setSelectedOrder(null)
          }}
          onUpdate={handleOrderUpdate}
        />
      )}
      </div>
    </AuthWrapper>
  )
}
