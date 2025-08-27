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
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, User, Car, FileText, CheckCircle, AlertTriangle, Save, X, Upload, Shield } from "lucide-react"
import { CustomerAttachments } from "@/components/customer-attachments"
import type { Order } from "@/lib/types"

interface OrderUpdateFormProps {
  order: Order
  onClose: () => void
  onUpdate: (order: Order) => void
  userRole?: "admin" | "manager" | "user" // Add user role for attachment permissions
}

interface TechnicalUpdate {
  work_performed: string
  parts_used: string
  technician_notes: string
  quality_check_notes: string
  customer_feedback: string
  additional_work_needed: string
}

export function OrderUpdateForm({ order, onClose, onUpdate, userRole = "user" }: OrderUpdateFormProps) {
  const [status, setStatus] = useState(order.status)
  const [priority, setPriority] = useState(order.priority)
  const [assignedTo, setAssignedTo] = useState(order.assigned_to?.toString() || "")
  const [description, setDescription] = useState(order.description || "")
  const [managerNotes, setManagerNotes] = useState("")
  const [activeTab, setActiveTab] = useState("order_details")
  const [showAttachments, setShowAttachments] = useState(false)

  // Check if user has manager permissions for attachments
  const canManageAttachments = userRole === "admin" || userRole === "manager"
  
  // Technical update fields for car service
  const [technicalUpdate, setTechnicalUpdate] = useState<TechnicalUpdate>({
    work_performed: "",
    parts_used: "",
    technician_notes: "",
    quality_check_notes: "",
    customer_feedback: "",
    additional_work_needed: "",
  })

  // Tire sales specific fields
  const [tiresInstalled, setTiresInstalled] = useState("")
  const [installationNotes, setInstallationNotes] = useState("")

  const handleTechnicalChange = (field: keyof TechnicalUpdate, value: string) => {
    setTechnicalUpdate(prev => ({ ...prev, [field]: value }))
  }


  const handleSave = () => {
    const updatedOrder: Order = {
      ...order,
      status: status as Order["status"],
      priority: priority as Order["priority"],
      assigned_to: assignedTo ? parseInt(assignedTo) : undefined,
      description,
      updated_at: new Date().toISOString(),
      // Set completion time if status is completed
      actual_completion: status === "completed" ? new Date().toISOString() : order.actual_completion,
    }

    // Log technical updates for audit trail
    if (order.order_type === "service" && Object.values(technicalUpdate).some(v => v.trim())) {
      console.log("Technical update for order:", order.order_number, technicalUpdate)
    }

    if (order.order_type === "sales" && (tiresInstalled || installationNotes)) {
      console.log("Tire installation update for order:", order.order_number, {
        tiresInstalled,
        installationNotes
      })
    }

    onUpdate(updatedOrder)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "created": return "bg-yellow-100 text-yellow-800"
      case "assigned": return "bg-blue-100 text-blue-800"
      case "in_progress": return "bg-purple-100 text-purple-800"
      case "completed": return "bg-green-100 text-green-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTechnicians = () => [
    { id: "1", name: "Peter Mwangi" },
    { id: "2", name: "James Kimani" },
    { id: "3", name: "Samuel Ochieng" },
    { id: "4", name: "Grace Wanjiku" },
  ]

  // Mock customers data to get customer name
  const mockCustomers = [
    { id: 1, name: "John Mwalimu" },
    { id: 2, name: "Tanzania Revenue Authority" },
    { id: 3, name: "Mama Fatuma" },
    { id: 4, name: "Sarah Hassan" },
  ]

  const getCustomerName = () => {
    const customer = mockCustomers.find(c => c.id === order.customer_id)
    return customer?.name || `Customer ID: ${order.customer_id}`
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto w-[95vw] lg:w-[90vw] xl:w-[85vw] 2xl:w-[80vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Update Order - {order.order_number}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="order_details">Order Details</TabsTrigger>
            <TabsTrigger value="attachments" className="relative">
              Customer Attachments
              {canManageAttachments && (
                <Shield className="h-3 w-3 ml-1 text-primary" title="Manager Access" />
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="order_details" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column - Order Details */}
          <div className="space-y-6">
            {/* Order Info */}
            <Card>
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
                <CardDescription>Basic order details and current status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Order Number</Label>
                    <Input value={order.order_number} disabled />
                  </div>
                  <div>
                    <Label>Order Type</Label>
                    <Input value={order.order_type} disabled className="capitalize" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Current Status</Label>
                    <div className="mt-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label>New Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="created">Created</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div>
                    <Label>Assigned Technician</Label>
                    <Select value={assignedTo} onValueChange={setAssignedTo}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select technician" />
                      </SelectTrigger>
                      <SelectContent>
                        {getTechnicians().map((tech) => (
                          <SelectItem key={tech.id} value={tech.id}>
                            {tech.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Order description..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Column - Service Specific Updates */}
          <div className="space-y-6">
            {/* Service Type Specific Forms */}
            {order.order_type === "service" && (
              <Card>
                <CardHeader>
                  <CardTitle>Car Service Updates</CardTitle>
                  <CardDescription>Technical details from technician</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Work Performed</Label>
                    <Textarea
                      value={technicalUpdate.work_performed}
                      onChange={(e) => handleTechnicalChange("work_performed", e.target.value)}
                      placeholder="Describe work completed..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label>Parts Used</Label>
                    <Textarea
                      value={technicalUpdate.parts_used}
                      onChange={(e) => handleTechnicalChange("parts_used", e.target.value)}
                      placeholder="List parts used..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label>Technician Notes</Label>
                    <Textarea
                      value={technicalUpdate.technician_notes}
                      onChange={(e) => handleTechnicalChange("technician_notes", e.target.value)}
                      placeholder="Technical observations..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label>Quality Check Notes</Label>
                    <Textarea
                      value={technicalUpdate.quality_check_notes}
                      onChange={(e) => handleTechnicalChange("quality_check_notes", e.target.value)}
                      placeholder="Quality inspection results..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label>Customer Feedback</Label>
                    <Textarea
                      value={technicalUpdate.customer_feedback}
                      onChange={(e) => handleTechnicalChange("customer_feedback", e.target.value)}
                      placeholder="Customer comments..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label>Additional Work Needed</Label>
                    <Textarea
                      value={technicalUpdate.additional_work_needed}
                      onChange={(e) => handleTechnicalChange("additional_work_needed", e.target.value)}
                      placeholder="Future recommendations..."
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {order.order_type === "sales" && (
              <Card>
                <CardHeader>
                  <CardTitle>Tire Sales Updates</CardTitle>
                  <CardDescription>Installation and sales details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Tires Installed</Label>
                    <Input
                      value={tiresInstalled}
                      onChange={(e) => setTiresInstalled(e.target.value)}
                      placeholder="e.g., 4x Michelin 205/55R16"
                    />
                  </div>

                  <div>
                    <Label>Installation Notes</Label>
                    <Textarea
                      value={installationNotes}
                      onChange={(e) => setInstallationNotes(e.target.value)}
                      placeholder="Installation details, balancing, alignment notes..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {order.order_type === "consultation" && (
              <Card>
                <CardHeader>
                  <CardTitle>Inquiry Follow-up</CardTitle>
                  <CardDescription>Customer inquiry resolution</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Information Provided</Label>
                    <Textarea
                      value={managerNotes}
                      onChange={(e) => setManagerNotes(e.target.value)}
                      placeholder="Information shared with customer..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Follow-up Action</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select follow-up action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quote_sent">Quote Sent</SelectItem>
                        <SelectItem value="appointment_scheduled">Appointment Scheduled</SelectItem>
                        <SelectItem value="no_action">No Further Action</SelectItem>
                        <SelectItem value="call_back">Call Back Required</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Completion Alert */}
            {status === "completed" && order.status !== "completed" && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-5 w-5" />
                    <div>
                      <h4 className="font-medium">Order Completion - Auto Generation</h4>
                      <p className="text-sm mb-2">
                        Completing this order will automatically generate:
                      </p>
                      <ul className="text-sm list-disc list-inside space-y-1">
                        <li><strong>Job Card:</strong> JC-{new Date().getFullYear()}-XXX for work tracking</li>
                        <li><strong>Invoice:</strong> INV-{new Date().getFullYear()}-XXX for TSH {calculateFinalAmount().toLocaleString()}</li>
                        <li><strong>Completion Time:</strong> {new Date().toLocaleString()}</li>
                      </ul>
                      <p className="text-sm mt-2 font-medium">
                        Both documents will be ready for immediate processing and customer delivery.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status Change Alert for In Progress */}
            {status === "in_progress" && order.status !== "in_progress" && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Clock className="h-5 w-5" />
                    <div>
                      <h4 className="font-medium">Work Started</h4>
                      <p className="text-sm">
                        Changing status to "In Progress" will start time tracking for this order.
                        Start time: {new Date().toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Manager Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Manager Notes</CardTitle>
                <CardDescription>Internal notes and observations</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={managerNotes}
                  onChange={(e) => setManagerNotes(e.target.value)}
                  placeholder="Manager observations, special instructions..."
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>
            </div>
          </TabsContent>

          <TabsContent value="attachments" className="space-y-4">
            {canManageAttachments ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Customer Documents & Attachments
                    <Badge variant="secondary" className="ml-auto">
                      Manager Access
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      As a manager updating this order, you can upload and manage documents for <strong>{getCustomerName()}</strong> including:
                      ID documents, vehicle papers, service records, photos, invoices, and more.
                    </p>

                    <Button
                      onClick={() => setShowAttachments(true)}
                      className="w-full sm:w-auto"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Manage Customer Attachments
                    </Button>

                    {/* Quick stats for existing attachments */}
                    <div className="grid gap-4 md:grid-cols-3 mt-6">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-primary">8</div>
                          <p className="text-sm text-muted-foreground">Total Files</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-green-600">5.2 MB</div>
                          <p className="text-sm text-muted-foreground">Total Size</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-blue-600">4</div>
                          <p className="text-sm text-muted-foreground">Categories</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recent attachments preview */}
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Recent Attachments for this Customer</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-muted rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm">vehicle_registration.pdf</span>
                            <Badge variant="outline" className="text-xs">Vehicle Documents</Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">3 days ago</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-muted rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm">service_history_2024.pdf</span>
                            <Badge variant="outline" className="text-xs">Service Records</Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">1 week ago</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-muted rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm">insurance_certificate.jpg</span>
                            <Badge variant="outline" className="text-xs">Insurance</Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">2 weeks ago</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">💡 Manager Tip</h4>
                      <p className="text-sm text-blue-800">
                        Upload customer documents here while processing their order. All files will be associated with this customer and accessible across all their future orders and service history.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Manager Access Required</h3>
                  <p className="text-sm text-muted-foreground">
                    Only managers and administrators can upload and manage customer attachments during order processing.
                    Please contact your supervisor if you need access to this feature.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            <Save className="h-4 w-4 mr-2" />
            Update Order
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Customer Attachments Modal */}
      {showAttachments && (
        <CustomerAttachments
          customerId={order.customer_id}
          customerName={getCustomerName()}
          onClose={() => setShowAttachments(false)}
        />
      )}
    </Dialog>
  )
}
