import { useState, useEffect } from "react"
import { AuthWrapper } from "../components/auth-wrapper"
import { DashboardSidebar } from "../components/dashboard-sidebar"
import { DashboardHeader } from "../components/dashboard-header"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Search, Clock, CheckCircle, Car, Wrench, User, Calendar } from "lucide-react"
import type { Customer, Order } from "../lib/types"

// Mock data with time tracking
const mockCustomersWithTracking: (Customer & { current_orders?: Order[] })[] = [
  {
    id: 1,
    customer_code: "CUST001",
    name: "John Mwalimu",
    customer_type: "personal",
    phone: "+255 712 345 678",
    email: "john.mwalimu@gmail.com",
    registration_date: "2024-01-15",
    total_visits: 5,
    total_spent: 0,
    is_active: true,
    created_by: 1,
    created_at: "2024-01-20T08:30:00Z",
    updated_at: "2024-01-20T08:30:00Z",
    arrival_time: "2024-01-20T08:30:00Z",
    current_visit_status: "in_service",
    current_orders: [
      {
        id: 1,
        order_number: "ORD-001",
        customer_id: 1,
        order_type: "service",
        status: "in_progress",
        priority: "normal",
        description: "Car Service: Oil Change, Brake Repair",
        service_start_time: "2024-01-20T09:00:00Z",
        service_details: {
          service_type: "car_service",
          items: ["Oil Change", "Brake Repair"],
          vehicle_info: {
            plate_number: "T123ABC",
            make: "Toyota",
            model: "Corolla"
          }
        },
        created_by: 1,
        created_at: "2024-01-20T08:30:00Z",
        updated_at: "2024-01-20T09:00:00Z"
      }
    ]
  },
  {
    id: 2,
    customer_code: "CUST002",
    name: "Mama Fatuma",
    customer_type: "bodaboda",
    phone: "+255 754 987 654",
    registration_date: "2024-01-20",
    total_visits: 2,
    total_spent: 0,
    is_active: true,
    created_by: 1,
    created_at: "2024-01-20T10:15:00Z",
    updated_at: "2024-01-20T10:15:00Z",
    arrival_time: "2024-01-20T10:15:00Z",
    current_visit_status: "arrived",
    current_orders: [
      {
        id: 2,
        order_number: "ORD-002",
        customer_id: 2,
        order_type: "sales",
        status: "created",
        priority: "normal",
        description: "Tire Sales: All-Season Tire x2",
        service_start_time: "2024-01-20T10:15:00Z",
        service_details: {
          service_type: "tire_sales",
          items: ["All-Season Tire"],
          brand: "Michelin",
          quantity: 2
        },
        created_by: 1,
        created_at: "2024-01-20T10:15:00Z",
        updated_at: "2024-01-20T10:15:00Z"
      }
    ]
  },
  {
    id: 3,
    customer_code: "CUST003",
    name: "Tanzania Revenue Authority",
    customer_type: "government",
    phone: "+255 22 211 1111",
    email: "fleet@tra.go.tz",
    registration_date: "2024-01-18",
    total_visits: 12,
    total_spent: 0,
    is_active: true,
    created_by: 1,
    created_at: "2024-01-20T11:00:00Z",
    updated_at: "2024-01-20T11:00:00Z",
    arrival_time: "2024-01-20T11:00:00Z",
    departure_time: "2024-01-20T13:30:00Z",
    current_visit_status: "departed",
    current_orders: [
      {
        id: 3,
        order_number: "ORD-003",
        customer_id: 3,
        order_type: "service",
        status: "completed",
        priority: "high",
        description: "Car Service: Engine Diagnostics, Brake Repair",
        service_start_time: "2024-01-20T11:30:00Z",
        service_end_time: "2024-01-20T13:00:00Z",
        service_details: {
          service_type: "car_service",
          items: ["Engine Diagnostics", "Brake Repair"],
          vehicle_info: {
            plate_number: "GVT001",
            make: "Toyota",
            model: "Land Cruiser"
          }
        },
        created_by: 1,
        created_at: "2024-01-20T11:00:00Z",
        updated_at: "2024-01-20T13:00:00Z"
      }
    ]
  }
]

const statusColors = {
  arrived: "bg-blue-100 text-blue-800",
  in_service: "bg-yellow-100 text-yellow-800", 
  completed: "bg-green-100 text-green-800",
  departed: "bg-gray-100 text-gray-800"
}

const formatTime = (timeString?: string) => {
  if (!timeString) return "N/A"
  return new Date(timeString).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatDuration = (start?: string, end?: string) => {
  if (!start) return "N/A"
  const startTime = new Date(start)
  const endTime = end ? new Date(end) : new Date()
  const diffMs = endTime.getTime() - startTime.getTime()
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}h ${minutes}m`
}

export default function CustomerTrackingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all")
  const [customers, setCustomers] = useState(mockCustomersWithTracking)

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.customer_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm)
    
    const matchesStatus = statusFilter === "all" || customer.current_visit_status === statusFilter
    
    const matchesServiceType = serviceTypeFilter === "all" || 
                              customer.current_orders?.some(order => 
                                order.service_details?.service_type === serviceTypeFilter
                              )
    
    return matchesSearch && matchesStatus && matchesServiceType
  })

  const handleUpdateStatus = (customerId: number, newStatus: Customer["current_visit_status"]) => {
    setCustomers(prev => prev.map(customer => {
      if (customer.id === customerId) {
        const updates: Partial<Customer> = {
          current_visit_status: newStatus,
          updated_at: new Date().toISOString()
        }
        
        if (newStatus === "departed" && !customer.departure_time) {
          updates.departure_time = new Date().toISOString()
        }
        
        return { ...customer, ...updates }
      }
      return customer
    }))
  }

  // Separate customers by service type
  const tireCustomers = filteredCustomers.filter(customer => 
    customer.current_orders?.some(order => order.service_details?.service_type === "tire_sales")
  )
  
  const carServiceCustomers = filteredCustomers.filter(customer => 
    customer.current_orders?.some(order => order.service_details?.service_type === "car_service")
  )

  const renderCustomerTable = (customers: typeof filteredCustomers, serviceType: string) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {serviceType === "tire" ? <Car className="h-5 w-5" /> : <Wrench className="h-5 w-5" />}
          {serviceType === "tire" ? "Tire Sales Customers" : "Car Service Customers"} 
          ({customers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Service Details</TableHead>
                <TableHead>Arrival Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => {
                const currentOrder = customer.current_orders?.[0]
                return (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {customer.customer_code} • {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {currentOrder?.service_details && (
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            {currentOrder.service_details.items?.join(", ")}
                          </div>
                          {currentOrder.service_details.brand && (
                            <div className="text-xs text-muted-foreground">
                              Brand: {currentOrder.service_details.brand}
                            </div>
                          )}
                          {currentOrder.service_details.vehicle_info && (
                            <div className="text-xs text-muted-foreground">
                              {currentOrder.service_details.vehicle_info.plate_number} - 
                              {currentOrder.service_details.vehicle_info.make} {currentOrder.service_details.vehicle_info.model}
                            </div>
                          )}
                          {currentOrder.service_details.quantity && (
                            <div className="text-xs text-muted-foreground">
                              Qty: {currentOrder.service_details.quantity}
                            </div>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {formatTime(customer.arrival_time)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDuration(customer.arrival_time, customer.departure_time)}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[customer.current_visit_status || "arrived"]}>
                        {customer.current_visit_status?.replace("_", " ") || "arrived"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {customer.current_visit_status === "arrived" && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(customer.id, "in_service")}
                          >
                            Start Service
                          </Button>
                        )}
                        {customer.current_visit_status === "in_service" && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(customer.id, "completed")}
                          >
                            Complete Service
                          </Button>
                        )}
                        {customer.current_visit_status === "completed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(customer.id, "departed")}
                          >
                            Mark Departed
                          </Button>
                        )}
                        {customer.current_visit_status === "departed" && (
                          <div className="text-sm text-muted-foreground">
                            Left at {formatTime(customer.departure_time)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <AuthWrapper>
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-2xl font-bold text-foreground">Customer Time Tracking</h1>
                <p className="text-muted-foreground">Monitor customer arrivals, service progress, and departures</p>
              </div>

              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Search & Filter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, code, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="arrived">Arrived</SelectItem>
                        <SelectItem value="in_service">In Service</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="departed">Departed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Service Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Services</SelectItem>
                        <SelectItem value="tire_sales">Tire Sales</SelectItem>
                        <SelectItem value="car_service">Car Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Service Type Tabs */}
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all">All Customers ({filteredCustomers.length})</TabsTrigger>
                  <TabsTrigger value="tire">Tire Sales ({tireCustomers.length})</TabsTrigger>
                  <TabsTrigger value="car">Car Service ({carServiceCustomers.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <Card>
                    <CardHeader>
                      <CardTitle>All Current Customers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Customer</TableHead>
                              <TableHead>Service Type</TableHead>
                              <TableHead>Arrival Time</TableHead>
                              <TableHead>Duration</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredCustomers.map((customer) => {
                              const currentOrder = customer.current_orders?.[0]
                              return (
                                <TableRow key={customer.id}>
                                  <TableCell>
                                    <div>
                                      <div className="font-medium">{customer.name}</div>
                                      <div className="text-sm text-muted-foreground">
                                        {customer.customer_code} • {customer.phone}
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {currentOrder?.service_details && (
                                      <Badge variant="secondary">
                                        {currentOrder.service_details.service_type === "tire_sales" ? "Tire Sales" : "Car Service"}
                                      </Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4 text-muted-foreground" />
                                      {formatTime(customer.arrival_time)}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {formatDuration(customer.arrival_time, customer.departure_time)}
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={statusColors[customer.current_visit_status || "arrived"]}>
                                      {customer.current_visit_status?.replace("_", " ") || "arrived"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                      {customer.current_visit_status === "arrived" && (
                                        <Button
                                          size="sm"
                                          onClick={() => handleUpdateStatus(customer.id, "in_service")}
                                        >
                                          Start Service
                                        </Button>
                                      )}
                                      {customer.current_visit_status === "in_service" && (
                                        <Button
                                          size="sm"
                                          onClick={() => handleUpdateStatus(customer.id, "completed")}
                                        >
                                          Complete Service
                                        </Button>
                                      )}
                                      {customer.current_visit_status === "completed" && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleUpdateStatus(customer.id, "departed")}
                                        >
                                          Mark Departed
                                        </Button>
                                      )}
                                      {customer.current_visit_status === "departed" && (
                                        <div className="text-sm text-muted-foreground">
                                          Left at {formatTime(customer.departure_time)}
                                        </div>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tire">
                  {renderCustomerTable(tireCustomers, "tire")}
                </TabsContent>

                <TabsContent value="car">
                  {renderCustomerTable(carServiceCustomers, "car")}
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </AuthWrapper>
  )
}
