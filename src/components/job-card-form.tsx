"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Save, X, Search, User, Car } from "lucide-react"

interface JobCardFormProps {
  onClose: () => void
  onSave: (jobCard: any) => void
}

// Mock data
const mockOrders = [
  { id: 1, order_number: "ORD-2024-001", customer_name: "John Mwalimu", status: "completed" },
  { id: 2, order_number: "ORD-2024-002", customer_name: "Tanzania Revenue Authority", status: "completed" },
  { id: 3, order_number: "ORD-2024-004", customer_name: "Sarah Hassan", status: "completed" },
]

const mockCustomers = [
  { id: 1, name: "John Mwalimu", customer_code: "CUST001", phone: "+255 712 345 678" },
  { id: 2, name: "Tanzania Revenue Authority", customer_code: "CUST002", phone: "+255 22 211 1111" },
  { id: 3, name: "Mama Fatuma", customer_code: "CUST003", phone: "+255 754 987 654" },
  { id: 4, name: "Sarah Hassan", customer_code: "CUST004", phone: "+255 755 123 456" },
]

const mockVehicles = [
  { id: 1, customer_id: 1, plate_number: "T123ABC", make: "Toyota", model: "Corolla" },
  { id: 2, customer_id: 3, plate_number: "MC456DEF", make: "Bajaj", model: "Boxer" },
  { id: 3, customer_id: 2, plate_number: "GVT001", make: "Toyota", model: "Land Cruiser" },
  { id: 4, customer_id: 4, plate_number: "T789XYZ", make: "Honda", model: "Civic" },
]

const mockTechnicians = [
  { id: 2, name: "Peter Mwangi", specialty: "Engine & Transmission" },
  { id: 3, name: "James Kimani", specialty: "Electrical & AC" },
  { id: 4, name: "Samuel Ochieng", specialty: "Brakes & Tires" },
  { id: 5, name: "Grace Wanjiku", specialty: "General Maintenance" },
]

export function JobCardForm({ onClose, onSave }: JobCardFormProps) {
  const [formType, setFormType] = useState<"from_order" | "manual">("from_order")
  const [selectedOrder, setSelectedOrder] = useState("")
  const [customerId, setCustomerId] = useState("")
  const [vehicleId, setVehicleId] = useState("")
  const [workDescription, setWorkDescription] = useState("")
  const [customerComplaints, setCustomerComplaints] = useState("")
  const [assignedTechnician, setAssignedTechnician] = useState("")
  const [estimatedDuration, setEstimatedDuration] = useState("60")
  const [priority, setPriority] = useState("normal")
  const [searchCustomer, setSearchCustomer] = useState("")

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
    customer.customer_code.toLowerCase().includes(searchCustomer.toLowerCase())
  )

  const selectedCustomer = mockCustomers.find(c => c.id.toString() === customerId)
  const customerVehicles = mockVehicles.filter(v => v.customer_id.toString() === customerId)
  const selectedOrderData = mockOrders.find(o => o.id.toString() === selectedOrder)

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrder(orderId)
    const order = mockOrders.find(o => o.id.toString() === orderId)
    if (order) {
      // Auto-populate based on order
      const customer = mockCustomers.find(c => c.name === order.customer_name)
      if (customer) {
        setCustomerId(customer.id.toString())
        const vehicles = mockVehicles.filter(v => v.customer_id === customer.id)
        if (vehicles.length === 1) {
          setVehicleId(vehicles[0].id.toString())
        }
      }
    }
  }

  const generateJobCardNumber = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const time = String(date.getHours()).padStart(2, '0') + String(date.getMinutes()).padStart(2, '0')
    return `JC-${year}${month}${day}-${time}`
  }

  const handleSave = () => {
    const jobCardData = {
      job_card_number: generateJobCardNumber(),
      order_id: formType === "from_order" ? parseInt(selectedOrder) : null,
      customer_id: parseInt(customerId),
      vehicle_id: vehicleId ? parseInt(vehicleId) : null,
      status: "pending",
      time_in: new Date().toISOString(),
      estimated_duration: parseInt(estimatedDuration),
      work_description: workDescription,
      customer_complaints: customerComplaints,
      assigned_technician: assignedTechnician ? parseInt(assignedTechnician) : null,
      created_by: 1, // Current user ID
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    onSave(jobCardData)
  }

  const isFormValid = () => {
    if (formType === "from_order") {
      return selectedOrder && customerId && workDescription.trim() && assignedTechnician
    } else {
      return customerId && workDescription.trim() && assignedTechnician
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto w-[95vw] lg:w-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Job Card
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Form Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Job Card Type</CardTitle>
              <CardDescription>Choose how to create the job card</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={formType === "from_order" ? "default" : "outline"}
                  onClick={() => setFormType("from_order")}
                  className="h-20 flex flex-col gap-2"
                >
                  <Car className="h-6 w-6" />
                  <span>From Completed Order</span>
                  <span className="text-xs opacity-70">Generate from existing order</span>
                </Button>
                <Button
                  type="button"
                  variant={formType === "manual" ? "default" : "outline"}
                  onClick={() => setFormType("manual")}
                  className="h-20 flex flex-col gap-2"
                >
                  <User className="h-6 w-6" />
                  <span>Manual Creation</span>
                  <span className="text-xs opacity-70">Create from scratch</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Order/Customer Selection */}
            <div className="space-y-6">
              {formType === "from_order" ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Select Order</CardTitle>
                    <CardDescription>Choose from completed orders</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Completed Orders</Label>
                      <Select value={selectedOrder} onValueChange={handleOrderSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an order" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockOrders.map((order) => (
                            <SelectItem key={order.id} value={order.id.toString()}>
                              <div className="flex items-center justify-between w-full">
                                <span>{order.order_number}</span>
                                <span className="text-sm text-muted-foreground ml-2">
                                  {order.customer_name}
                                </span>
                                <Badge variant="secondary" className="ml-2">
                                  {order.status}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedOrderData && (
                      <div className="p-3 bg-muted rounded-md">
                        <h4 className="font-medium">Selected Order</h4>
                        <p className="text-sm text-muted-foreground">
                          Order: {selectedOrderData?.order_number}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Customer: {selectedOrderData?.customer_name}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Selection</CardTitle>
                    <CardDescription>Search and select customer</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Search Customer</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search by name or code..."
                          value={searchCustomer}
                          onChange={(e) => setSearchCustomer(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {searchCustomer && (
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {filteredCustomers.map((customer) => (
                          <div
                            key={customer.id}
                            className={`p-3 border rounded cursor-pointer hover:bg-muted ${
                              customerId === customer.id.toString() ? "border-primary bg-primary/5" : ""
                            }`}
                            onClick={() => {
                              setCustomerId(customer.id.toString())
                              setSearchCustomer(customer.name)
                            }}
                          >
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">{customer.customer_code}</div>
                            <div className="text-sm text-muted-foreground">{customer.phone}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Vehicle Selection */}
              {selectedCustomer && (
                <Card>
                  <CardHeader>
                    <CardTitle>Vehicle Selection</CardTitle>
                    <CardDescription>Select customer vehicle</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Customer Vehicles</Label>
                      <Select value={vehicleId} onValueChange={setVehicleId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {customerVehicles.map((vehicle) => (
                            <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                              {vehicle.plate_number} - {vehicle.make} {vehicle.model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {customerVehicles.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No vehicles registered for this customer
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Job Details */}
            <div className="space-y-6">
              {/* Work Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Work Details</CardTitle>
                  <CardDescription>Describe the work to be performed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Work Description *</Label>
                    <Textarea
                      value={workDescription}
                      onChange={(e) => setWorkDescription(e.target.value)}
                      placeholder="Describe the work to be performed..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label>Customer Complaints</Label>
                    <Textarea
                      value={customerComplaints}
                      onChange={(e) => setCustomerComplaints(e.target.value)}
                      placeholder="Customer reported issues or complaints..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Estimated Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={estimatedDuration}
                        onChange={(e) => setEstimatedDuration(e.target.value)}
                        placeholder="60"
                        min="15"
                        max="480"
                      />
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Select value={priority} onValueChange={setPriority}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technician Assignment */}
              <Card>
                <CardHeader>
                  <CardTitle>Technician Assignment</CardTitle>
                  <CardDescription>Assign a technician for this job</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Assigned Technician *</Label>
                    <Select value={assignedTechnician} onValueChange={setAssignedTechnician}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select technician" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockTechnicians.map((tech) => (
                          <SelectItem key={tech.id} value={tech.id.toString()}>
                            <div className="flex flex-col">
                              <span>{tech.name}</span>
                              <span className="text-xs text-muted-foreground">{tech.specialty}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {assignedTechnician && (
                    <div className="p-3 bg-muted rounded-md">
                      <h4 className="font-medium">Assigned Technician</h4>
                      <p className="text-sm text-muted-foreground">
                        {mockTechnicians.find(t => t.id.toString() === assignedTechnician)?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Specialty: {mockTechnicians.find(t => t.id.toString() === assignedTechnician)?.specialty}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Summary */}
              {isFormValid() && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-800">Job Card Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-green-700 space-y-2">
                    <div><strong>Job Card:</strong> {generateJobCardNumber()}</div>
                    <div><strong>Customer:</strong> {selectedCustomer?.name}</div>
                    {vehicleId && (
                      <div><strong>Vehicle:</strong> {customerVehicles.find(v => v.id.toString() === vehicleId)?.plate_number}</div>
                    )}
                    <div><strong>Technician:</strong> {mockTechnicians.find(t => t.id.toString() === assignedTechnician)?.name}</div>
                    <div><strong>Estimated Time:</strong> {estimatedDuration} minutes</div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!isFormValid()}
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="h-4 w-4 mr-2" />
            Create Job Card
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
