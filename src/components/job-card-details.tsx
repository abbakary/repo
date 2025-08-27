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
import { Clock, User, Car, Wrench, Star, Save, X, FileText, CheckCircle } from "lucide-react"
import type { JobCard } from "@/lib/types"

interface JobCardDetailsProps {
  jobCard: JobCard
  onClose: () => void
  onUpdate: (jobCard: JobCard) => void
}

const mockCustomers = [
  { id: 1, name: "John Mwalimu", customer_code: "CUST001", phone: "+255 712 345 678" },
  { id: 2, name: "Tanzania Revenue Authority", customer_code: "CUST002", phone: "+255 22 211 1111" },
  { id: 3, name: "Mama Fatuma", customer_code: "CUST003", phone: "+255 754 987 654" },
]

const mockVehicles = [
  { id: 1, plate_number: "T123ABC", make: "Toyota", model: "Corolla" },
  { id: 2, plate_number: "MC456DEF", make: "Bajaj", model: "Boxer" },
]

const mockTechnicians = [
  { id: 2, name: "Peter Mwangi" },
  { id: 3, name: "James Kimani" },
  { id: 4, name: "Samuel Ochieng" },
]

export function JobCardDetails({ jobCard, onClose, onUpdate }: JobCardDetailsProps) {
  const [status, setStatus] = useState(jobCard.status)
  const [workDescription, setWorkDescription] = useState(jobCard.work_description)
  const [technicianNotes, setTechnicianNotes] = useState(jobCard.technician_notes || "")
  const [qualityCheckNotes, setQualityCheckNotes] = useState(jobCard.quality_check_notes || "")
  const [customerComplaints, setCustomerComplaints] = useState(jobCard.customer_complaints || "")
  const [workCompleted, setWorkCompleted] = useState(jobCard.work_completed || "")
  const [assignedTechnician, setAssignedTechnician] = useState(jobCard.assigned_technician?.toString() || "")
  const [actualDuration, setActualDuration] = useState(jobCard.actual_duration?.toString() || "")
  const [customerSatisfaction, setCustomerSatisfaction] = useState(jobCard.customer_satisfaction?.toString() || "")
  const [completionReason, setCompletionReason] = useState(jobCard.completion_reason || "")

  const customer = mockCustomers.find(c => c.id === jobCard.customer_id)
  const vehicle = mockVehicles.find(v => v.id === jobCard.vehicle_id)
  const technician = mockTechnicians.find(t => t.id === jobCard.assigned_technician)

  const handleSave = () => {
    const updatedJobCard: JobCard = {
      ...jobCard,
      status: status as JobCard["status"],
      work_description: workDescription,
      technician_notes: technicianNotes,
      quality_check_notes: qualityCheckNotes,
      customer_complaints: customerComplaints,
      work_completed: workCompleted,
      assigned_technician: assignedTechnician ? parseInt(assignedTechnician) : undefined,
      actual_duration: actualDuration ? parseInt(actualDuration) : undefined,
      customer_satisfaction: customerSatisfaction ? parseInt(customerSatisfaction) : undefined,
      completion_reason: completionReason as JobCard["completion_reason"],
      time_out: status === "completed" ? new Date().toISOString() : jobCard.time_out,
      updated_at: new Date().toISOString(),
    }

    onUpdate(updatedJobCard)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-gray-100 text-gray-800"
      case "in_progress": return "bg-blue-100 text-blue-800"
      case "quality_check": return "bg-yellow-100 text-yellow-800"
      case "completed": return "bg-green-100 text-green-800"
      case "on_hold": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "N/A"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const calculateTimeDifference = () => {
    if (!jobCard.time_in) return "N/A"
    const startTime = new Date(jobCard.time_in)
    const endTime = jobCard.time_out ? new Date(jobCard.time_out) : new Date()
    const diffMs = endTime.getTime() - startTime.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    return formatDuration(diffMins)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Job Card Details - {jobCard.job_card_number}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Job Card Information */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Job Card Information</CardTitle>
                <CardDescription>Basic job card details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Job Card Number</Label>
                    <Input value={jobCard.job_card_number} disabled />
                  </div>
                  <div>
                    <Label>Order ID</Label>
                    <Input value={jobCard.order_id} disabled />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Current Status</Label>
                    <div className="mt-2">
                      <Badge className={getStatusColor(jobCard.status)}>
                        {jobCard.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label>Update Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="quality_check">Quality Check</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on_hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Work Description</Label>
                  <Textarea
                    value={workDescription}
                    onChange={(e) => setWorkDescription(e.target.value)}
                    placeholder="Describe the work to be performed..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Customer & Vehicle Info */}
            <Card>
              <CardHeader>
                <CardTitle>Customer & Vehicle</CardTitle>
                <CardDescription>Customer and vehicle information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Customer</Label>
                  <div className="p-3 bg-muted rounded-md">
                    <div className="font-medium">{customer?.name || "Unknown Customer"}</div>
                    <div className="text-sm text-muted-foreground">{customer?.customer_code}</div>
                    <div className="text-sm text-muted-foreground">{customer?.phone}</div>
                  </div>
                </div>

                {vehicle && (
                  <div>
                    <Label>Vehicle</Label>
                    <div className="p-3 bg-muted rounded-md">
                      <div className="font-medium">{vehicle.plate_number}</div>
                      <div className="text-sm text-muted-foreground">{vehicle.make} {vehicle.model}</div>
                    </div>
                  </div>
                )}

                <div>
                  <Label>Customer Complaints</Label>
                  <Textarea
                    value={customerComplaints}
                    onChange={(e) => setCustomerComplaints(e.target.value)}
                    placeholder="Customer reported issues..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Time Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>Time Tracking</CardTitle>
                <CardDescription>Work duration and timing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Time In</Label>
                    <Input 
                      value={jobCard.time_in ? new Date(jobCard.time_in).toLocaleString() : "N/A"} 
                      disabled 
                    />
                  </div>
                  <div>
                    <Label>Time Out</Label>
                    <Input 
                      value={jobCard.time_out ? new Date(jobCard.time_out).toLocaleString() : "In Progress"} 
                      disabled 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Estimated Duration</Label>
                    <Input value={formatDuration(jobCard.estimated_duration)} disabled />
                  </div>
                  <div>
                    <Label>Actual Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={actualDuration}
                      onChange={(e) => setActualDuration(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>Total Time</Label>
                    <Input value={calculateTimeDifference()} disabled />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Technical Details */}
          <div className="space-y-6">
            {/* Technical Work */}
            <Card>
              <CardHeader>
                <CardTitle>Technical Details</CardTitle>
                <CardDescription>Work performed and technical notes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Assigned Technician</Label>
                  <Select value={assignedTechnician} onValueChange={setAssignedTechnician}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select technician" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTechnicians.map((tech) => (
                        <SelectItem key={tech.id} value={tech.id.toString()}>
                          {tech.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Work Completed</Label>
                  <Textarea
                    value={workCompleted}
                    onChange={(e) => setWorkCompleted(e.target.value)}
                    placeholder="Describe completed work..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Technician Notes</Label>
                  <Textarea
                    value={technicianNotes}
                    onChange={(e) => setTechnicianNotes(e.target.value)}
                    placeholder="Technical observations and notes..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Quality Check Notes</Label>
                  <Textarea
                    value={qualityCheckNotes}
                    onChange={(e) => setQualityCheckNotes(e.target.value)}
                    placeholder="Quality inspection results..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Completion Details */}
            {(status === "completed" || jobCard.status === "completed") && (
              <Card>
                <CardHeader>
                  <CardTitle>Completion Details</CardTitle>
                  <CardDescription>Customer satisfaction and completion information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Completion Reason</Label>
                    <Select value={completionReason} onValueChange={setCompletionReason}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed">Work Completed Successfully</SelectItem>
                        <SelectItem value="customer_cancelled">Customer Cancelled</SelectItem>
                        <SelectItem value="parts_unavailable">Parts Unavailable</SelectItem>
                        <SelectItem value="technical_issue">Technical Issue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Customer Satisfaction (1-10)</Label>
                    <Select value={customerSatisfaction} onValueChange={setCustomerSatisfaction}>
                      <SelectTrigger>
                        <SelectValue placeholder="Rate satisfaction" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1} {i + 1 <= 3 ? "⭐" : i + 1 <= 6 ? "⭐⭐" : i + 1 <= 8 ? "⭐⭐⭐" : "⭐⭐⭐⭐"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {customerSatisfaction && (
                    <div className="p-3 bg-muted rounded-md">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">
                          Customer Rating: {customerSatisfaction}/10
                          {parseInt(customerSatisfaction) >= 8 ? " (Excellent)" : 
                           parseInt(customerSatisfaction) >= 6 ? " (Good)" : 
                           parseInt(customerSatisfaction) >= 4 ? " (Fair)" : " (Poor)"}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Status Alerts */}
            {status === "completed" && jobCard.status !== "completed" && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-5 w-5" />
                    <div>
                      <h4 className="font-medium">Job Card Completion</h4>
                      <p className="text-sm">
                        Completing this job card will record the finish time and trigger invoice generation.
                        Completion time: {new Date().toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle>Record Information</CardTitle>
                <CardDescription>Creation and update history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(jobCard.created_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>{new Date(jobCard.updated_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created By:</span>
                  <span>User ID: {jobCard.created_by}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            <Save className="h-4 w-4 mr-2" />
            Update Job Card
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
