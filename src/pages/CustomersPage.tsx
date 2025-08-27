import { useState } from "react"
import { AuthWrapper } from "../components/auth-wrapper"
import { DashboardSidebar } from "../components/dashboard-sidebar"
import { DashboardHeader } from "../components/dashboard-header"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Plus, Search, Filter, Eye, Edit, Phone, Mail, Car } from "lucide-react"
import { CustomerForm } from "../components/customer-form"
import { CustomerDetails } from "../components/customer-details"

// Mock data for demonstration
const mockCustomers = [
  {
    id: 1,
    customer_code: "CUST001",
    name: "John Mwalimu",
    customer_type: "personal",
    phone: "+255 712 345 678",
    email: "john.mwalimu@gmail.com",
    total_visits: 5,
    total_spent: 450000,
    last_visit: "2024-01-15",
    vehicles: [{ plate_number: "T123ABC", make: "Toyota", model: "Corolla" }],
    is_active: true,
  },
  {
    id: 2,
    customer_code: "CUST002",
    name: "Tanzania Revenue Authority",
    customer_type: "government",
    phone: "+255 22 211 1111",
    email: "fleet@tra.go.tz",
    total_visits: 12,
    total_spent: 2800000,
    last_visit: "2024-01-20",
    vehicles: [
      { plate_number: "GVT001", make: "Toyota", model: "Land Cruiser" },
      { plate_number: "GVT002", make: "Nissan", model: "Patrol" },
    ],
    is_active: true,
  },
  {
    id: 3,
    customer_code: "CUST003",
    name: "Mama Fatuma",
    customer_type: "bodaboda",
    phone: "+255 754 987 654",
    email: "",
    total_visits: 8,
    total_spent: 180000,
    last_visit: "2024-01-18",
    vehicles: [{ plate_number: "MC456DEF", make: "Bajaj", model: "Boxer" }],
    is_active: true,
  },
]

const customerTypeColors = {
  government: "bg-blue-100 text-blue-800",
  ngo: "bg-purple-100 text-purple-800",
  private: "bg-green-100 text-green-800",
  personal: "bg-orange-100 text-orange-800",
  bodaboda: "bg-cyan-100 text-cyan-800",
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showCustomerDetails, setShowCustomerDetails] = useState(false)
  const [customers, setCustomers] = useState(mockCustomers)

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customer_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    const matchesType = selectedType === "all" || customer.customer_type === selectedType
    return matchesSearch && matchesType
  })

  const handleViewCustomer = (customer: any) => {
    setSelectedCustomer(customer)
    setShowCustomerDetails(true)
  }

  const handleSaveCustomer = (formData: any) => {
    try {
      console.log("Received customer data:", formData)

      // Extract customer data from the form submission
      const newCustomer = {
        id: formData.customer.id || Date.now(),
        customer_code: formData.customer.customer_code || `CUST${String(Date.now()).slice(-6)}`,
        name: formData.customer.name,
        customer_type: formData.customer.customer_type || "personal",
        phone: formData.customer.phone,
        email: formData.customer.email || "",
        address: formData.customer.address || "",
        notes: formData.customer.notes || "",
        total_visits: formData.customer.total_visits || 0,
        total_spent: formData.customer.total_spent || 0,
        last_visit: formData.customer.last_visit || new Date().toISOString().split('T')[0],
        vehicles: formData.customer.vehicles || [],
        is_active: true,
        registration_date: formData.customer.registration_date || new Date().toISOString().split('T')[0],
        business_info: formData.customer.business_info || null,
      }

      // Add to customers list
      setCustomers(prev => [newCustomer, ...prev])

      // Close the form
      setShowCustomerForm(false)

      // Show success message
      alert(`Customer "${newCustomer.name}" has been successfully registered!`)

      // If there's also an order, log it
      if (formData.order) {
        console.log("Order created:", formData.order)
        // Here you would typically also save the order to orders state/database
      }

    } catch (error) {
      console.error("Error saving customer:", error)
      alert("Failed to save customer. Please try again.")
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
              <span>Customer Management</span>
              <span className="mx-2">/</span>
              <span className="text-foreground">Customers</span>
            </div>

            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Customer Management</h1>
                <p className="text-muted-foreground">Manage all customer information and history</p>
              </div>
              <Button onClick={() => setShowCustomerForm(true)} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add New Customer
              </Button>
            </div>

            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Search & Filter Customers</CardTitle>
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
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Customer Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="ngo">NGO</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="bodaboda">Bodaboda</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Customer Statistics */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">248</div>
                  <p className="text-sm text-muted-foreground">Total Customers</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">32</div>
                  <p className="text-sm text-muted-foreground">New This Month</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">156</div>
                  <p className="text-sm text-muted-foreground">Active Customers</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">TSH 12.5M</div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </CardContent>
              </Card>
            </div>

            {/* Customer List */}
            <Card>
              <CardHeader>
                <CardTitle>Customer List ({filteredCustomers.length} customers)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[12%] hidden md:table-cell">Vehicle</TableHead>
                        <TableHead className="w-[18%]">Customer</TableHead>
                        <TableHead className="w-[10%] hidden md:table-cell">Type</TableHead>
                        <TableHead className="w-[20%]">Contact</TableHead>
                        <TableHead className="w-[8%] hidden lg:table-cell">Vehicles</TableHead>
                        <TableHead className="w-[8%] hidden lg:table-cell">Visits</TableHead>
                        <TableHead className="w-[12%] hidden md:table-cell">Total Spent</TableHead>
                        <TableHead className="w-[8%] hidden md:table-cell">Last Visit</TableHead>
                        <TableHead className="w-[12%]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomers.map((customer, index) => {
                        // Vehicle images based on customer type
                        const getVehicleImage = (customerType: string) => {
                          const vehicleImages = {
                            government: "https://images.pexels.com/photos/9888685/pexels-photo-9888685.jpeg", // Official vehicle
                            ngo: "https://images.pexels.com/photos/7464392/pexels-photo-7464392.jpeg", // Van for humanitarian work
                            private: "https://images.pexels.com/photos/7464392/pexels-photo-7464392.jpeg", // Commercial van
                            personal: "https://images.pexels.com/photos/8766145/pexels-photo-8766145.jpeg", // Personal car
                            bodaboda: "https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg" // Motorcycle
                          };
                          return vehicleImages[customerType as keyof typeof vehicleImages] || vehicleImages.personal;
                        };
                        const imageUrl = getVehicleImage(customer.customer_type);

                        return (
                        <TableRow key={customer.id}>
                          <TableCell className="hidden md:table-cell">
                            <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={imageUrl}
                                alt={`${customer.customer_type} vehicle`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback to a text placeholder if image fails
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const vehicleType = customer.customer_type === 'bodaboda' ? 'Bike' : 'Car';
                                  target.parentElement!.innerHTML = `<div class="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">${vehicleType}</div>`;
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-sm text-muted-foreground">{customer.customer_code}</div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge
                              className={customerTypeColors[customer.customer_type as keyof typeof customerTypeColors]}
                            >
                              {customer.customer_type.charAt(0).toUpperCase() + customer.customer_type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{customer.phone}</span>
                              </div>
                              {customer.email && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Mail className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">{customer.email}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex items-center gap-1">
                              <Car className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{customer.vehicles.length}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">{customer.total_visits}</TableCell>
                          <TableCell className="hidden md:table-cell">TSH {customer.total_spent.toLocaleString()}</TableCell>
                          <TableCell className="hidden md:table-cell">{customer.last_visit}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleViewCustomer(customer)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Customer Form Modal */}
      {showCustomerForm && (
        <CustomerForm
          onClose={() => setShowCustomerForm(false)}
          onSave={handleSaveCustomer}
        />
      )}

      {/* Customer Details Modal */}
      {showCustomerDetails && selectedCustomer && (
        <CustomerDetails
          customer={selectedCustomer}
          onClose={() => {
            setShowCustomerDetails(false)
            setSelectedCustomer(null)
          }}
        />
      )}
      </div>
    </AuthWrapper>
  )
}
