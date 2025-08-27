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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Filter, Eye, Edit, Clock, User, Car, Wrench, AlertTriangle, CheckCircle, Play, Pause, Square } from "lucide-react"
import { JobCardDetails } from "@/components/job-card-details"
import { JobCardForm } from "@/components/job-card-form"
import { TimeTracker } from "@/components/time-tracker"
import type { JobCard } from "@/lib/types"

// Mock data for job cards - in real app, this would come from orders that are completed
const mockJobCards: JobCard[] = [
  {
    id: 1,
    job_card_number: "JC-2024-001",
    order_id: 1,
    customer_id: 1,
    vehicle_id: 1,
    status: "in_progress",
    time_in: "2024-01-20T08:30:00",
    estimated_duration: 120,
    actual_duration: 95,
    work_description: "Car service - Oil change and brake inspection",
    technician_notes: "Oil change completed. Brake pads need replacement soon.",
    customer_complaints: "Squeaking sound when braking",
    work_completed: "Oil change, brake inspection",
    assigned_technician: 2,
    created_by: 1,
    created_at: "2024-01-20T08:30:00",
    updated_at: "2024-01-20T08:30:00",
  },
  {
    id: 2,
    job_card_number: "JC-2024-002",
    order_id: 2,
    customer_id: 2,
    status: "quality_check",
    time_in: "2024-01-19T09:00:00",
    estimated_duration: 60,
    actual_duration: 55,
    work_description: "Tire sales - 4 Michelin tires 205/55R16 installation",
    technician_notes: "All 4 tires installed and balanced successfully",
    quality_check_notes: "Alignment checked and adjusted",
    customer_complaints: "None",
    work_completed: "Tire installation, wheel balancing, alignment",
    assigned_technician: 3,
    quality_checker: 1,
    created_by: 1,
    created_at: "2024-01-19T09:00:00",
    updated_at: "2024-01-19T10:00:00",
  },
  {
    id: 3,
    job_card_number: "JC-2024-003",
    order_id: 3,
    customer_id: 3,
    vehicle_id: 2,
    status: "completed",
    time_in: "2024-01-18T10:00:00",
    time_out: "2024-01-18T11:30:00",
    estimated_duration: 90,
    actual_duration: 90,
    work_description: "Engine diagnostic and minor repair",
    technician_notes: "Faulty spark plugs replaced, air filter cleaned",
    quality_check_notes: "Engine running smoothly, all systems normal",
    customer_complaints: "Engine misfiring and poor performance",
    work_completed: "Spark plug replacement, air filter cleaning, engine diagnostic",
    assigned_technician: 2,
    quality_checker: 1,
    completion_reason: "completed",
    customer_satisfaction: 9,
    created_by: 1,
    created_at: "2024-01-18T10:00:00",
    updated_at: "2024-01-18T11:30:00",
  },
]

// Mock data for related entities
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
  { id: 1, name: "Admin User" },
  { id: 2, name: "Peter Mwangi" },
  { id: 3, name: "James Kimani" },
  { id: 4, name: "Samuel Ochieng" },
]

const statusColors = {
  pending: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  quality_check: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  on_hold: "bg-red-100 text-red-800",
}

export default function JobCardsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedTechnician, setSelectedTechnician] = useState("all")
  const [selectedJobCard, setSelectedJobCard] = useState<JobCard | null>(null)
  const [showJobCardDetails, setShowJobCardDetails] = useState(false)
  const [showJobCardForm, setShowJobCardForm] = useState(false)
  const [activeTab, setActiveTab] = useState("active")
  const [jobCards, setJobCards] = useState<JobCard[]>(mockJobCards)
  const [timeTracking, setTimeTracking] = useState<{[key: number]: { current: number, isActive: boolean }}>({})

  useEffect(() => {
    // Initialize time tracking for in-progress job cards
    const interval = setInterval(() => {
      setTimeTracking(prev => {
        const newTracking = { ...prev }
        jobCards.forEach(jobCard => {
          if (jobCard.status === "in_progress") {
            if (!newTracking[jobCard.id]) {
              newTracking[jobCard.id] = { current: jobCard.actual_duration || 0, isActive: true }
            }
            if (newTracking[jobCard.id]?.isActive) {
              newTracking[jobCard.id].current += 1 // Add 1 minute
            }
          }
        })
        return newTracking
      })
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [jobCards])

  const filteredJobCards = jobCards.filter((jobCard) => {
    const customer = mockCustomers.find(c => c.id === jobCard.customer_id)
    const vehicle = mockVehicles.find(v => v.id === jobCard.vehicle_id)
    const technician = mockTechnicians.find(t => t.id === jobCard.assigned_technician)
    
    const matchesSearch = 
      jobCard.job_card_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle?.plate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobCard.work_description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === "all" || jobCard.status === selectedStatus
    const matchesTechnician = selectedTechnician === "all" || jobCard.assigned_technician?.toString() === selectedTechnician
    
    const matchesTab = activeTab === "all" || 
      (activeTab === "active" && ["pending", "in_progress", "quality_check"].includes(jobCard.status)) ||
      (activeTab === "completed" && jobCard.status === "completed") ||
      (activeTab === "on_hold" && jobCard.status === "on_hold")
    
    return matchesSearch && matchesStatus && matchesTechnician && matchesTab
  })

  const handleViewJobCard = (jobCard: JobCard) => {
    setSelectedJobCard(jobCard)
    setShowJobCardDetails(true)
  }

  const handleJobCardUpdate = (updatedJobCard: JobCard) => {
    setJobCards(prev => prev.map(jc => 
      jc.id === updatedJobCard.id ? updatedJobCard : jc
    ))
    setShowJobCardDetails(false)
    setSelectedJobCard(null)
  }

  const handleTimeControl = (jobCardId: number, action: "start" | "pause" | "stop") => {
    setTimeTracking(prev => ({
      ...prev,
      [jobCardId]: {
        ...prev[jobCardId],
        isActive: action === "start" ? true : false
      }
    }))

    // Update job card status if needed
    if (action === "start") {
      setJobCards(prev => prev.map(jc => 
        jc.id === jobCardId ? { ...jc, status: "in_progress" } : jc
      ))
    }
  }

  const getJobCardStats = () => {
    return {
      total: jobCards.length,
      pending: jobCards.filter(jc => jc.status === "pending").length,
      in_progress: jobCards.filter(jc => jc.status === "in_progress").length,
      quality_check: jobCards.filter(jc => jc.status === "quality_check").length,
      completed: jobCards.filter(jc => jc.status === "completed").length,
      on_hold: jobCards.filter(jc => jc.status === "on_hold").length,
    }
  }

  const jobCardStats = getJobCardStats()

  const getCustomerName = (customerId: number) => {
    const customer = mockCustomers.find(c => c.id === customerId)
    return customer?.name || "Unknown Customer"
  }

  const getVehicleInfo = (vehicleId?: number) => {
    if (!vehicleId) return "N/A"
    const vehicle = mockVehicles.find(v => v.id === vehicleId)
    return vehicle ? `${vehicle.plate_number} - ${vehicle.make} ${vehicle.model}` : "Unknown Vehicle"
  }

  const getTechnicianName = (technicianId?: number) => {
    if (!technicianId) return "Unassigned"
    const technician = mockTechnicians.find(t => t.id === technicianId)
    return technician?.name || "Unknown Technician"
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const calculateEfficiency = (estimated: number, actual: number) => {
    if (!estimated || estimated === 0) return 100
    return Math.round((estimated / actual) * 100)
  }

  return (
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
              <span className="text-foreground">Job Cards & Tracking</span>
            </div>

            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Job Card Management & Time Tracking</h1>
                <p className="text-muted-foreground">Track service progress and monitor technician performance</p>
              </div>
              <Button onClick={() => setShowJobCardForm(true)} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Create Job Card
              </Button>
            </div>

            {/* Job Card Statistics */}
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">{jobCardStats.total}</div>
                  <p className="text-sm text-muted-foreground">Total Job Cards</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-gray-600">{jobCardStats.pending}</div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{jobCardStats.in_progress}</div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">{jobCardStats.quality_check}</div>
                  <p className="text-sm text-muted-foreground">Quality Check</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{jobCardStats.completed}</div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-600">{jobCardStats.on_hold}</div>
                  <p className="text-sm text-muted-foreground">On Hold</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs for different views */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="active">Active Jobs</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="on_hold">On Hold</TabsTrigger>
                <TabsTrigger value="all">All Job Cards</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-6">
                {/* Search and Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle>Search & Filter Job Cards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search by job card, customer, vehicle, or work description..."
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
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="quality_check">Quality Check</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="on_hold">On Hold</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Technician" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Technicians</SelectItem>
                          {mockTechnicians.filter(t => t.id > 1).map((tech) => (
                            <SelectItem key={tech.id} value={tech.id.toString()}>
                              {tech.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Job Cards List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Job Cards ({filteredJobCards.length} cards)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[12%]">Job Card</TableHead>
                            <TableHead className="w-[18%]">Customer</TableHead>
                            <TableHead className="w-[15%] hidden lg:table-cell">Vehicle</TableHead>
                            <TableHead className="w-[20%] hidden md:table-cell">Work Description</TableHead>
                            <TableHead className="w-[15%] hidden lg:table-cell">Technician</TableHead>
                            <TableHead className="w-[10%]">Status</TableHead>
                            <TableHead className="w-[12%] hidden md:table-cell">Time</TableHead>
                            <TableHead className="w-[10%] hidden lg:table-cell">Efficiency</TableHead>
                            <TableHead className="w-[15%]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredJobCards.map((jobCard) => (
                            <TableRow key={jobCard.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{jobCard.job_card_number}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {new Date(jobCard.created_at).toLocaleDateString()}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">{getCustomerName(jobCard.customer_id)}</div>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">{getVehicleInfo(jobCard.vehicle_id)}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                <div className="max-w-xs truncate" title={jobCard.work_description}>
                                  {jobCard.work_description}
                                </div>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{getTechnicianName(jobCard.assigned_technician)}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={statusColors[jobCard.status]}>
                                  {jobCard.status.replace("_", " ")}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {jobCard.status === "in_progress" && timeTracking[jobCard.id]
                                      ? formatDuration(timeTracking[jobCard.id].current)
                                      : jobCard.actual_duration
                                        ? formatDuration(jobCard.actual_duration)
                                        : formatDuration(jobCard.estimated_duration || 0)
                                    }
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
                                {jobCard.estimated_duration && jobCard.actual_duration && (
                                  <div className="flex items-center gap-1">
                                    <span className={`text-sm font-medium ${
                                      calculateEfficiency(jobCard.estimated_duration, jobCard.actual_duration) >= 90
                                        ? "text-green-600"
                                        : calculateEfficiency(jobCard.estimated_duration, jobCard.actual_duration) >= 70
                                          ? "text-yellow-600"
                                          : "text-red-600"
                                    }`}>
                                      {calculateEfficiency(jobCard.estimated_duration, jobCard.actual_duration)}%
                                    </span>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="sm" onClick={() => handleViewJobCard(jobCard)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  {jobCard.status === "in_progress" && (
                                    <>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => handleTimeControl(jobCard.id, timeTracking[jobCard.id]?.isActive ? "pause" : "start")}
                                        className={timeTracking[jobCard.id]?.isActive ? "text-orange-600" : "text-green-600"}
                                      >
                                        {timeTracking[jobCard.id]?.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => handleTimeControl(jobCard.id, "stop")}
                                        className="text-red-600"
                                      >
                                        <Square className="h-4 w-4" />
                                      </Button>
                                    </>
                                  )}
                                  {jobCard.status === "completed" && (
                                    <Button variant="ghost" size="sm" className="text-green-600">
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                  )}
                                  {jobCard.status === "on_hold" && (
                                    <Button variant="ghost" size="sm" className="text-red-600">
                                      <AlertTriangle className="h-4 w-4" />
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
            </Tabs>
          </div>
        </main>
      </div>

      {/* Job Card Details Modal */}
      {showJobCardDetails && selectedJobCard && (
        <JobCardDetails
          jobCard={selectedJobCard}
          onClose={() => {
            setShowJobCardDetails(false)
            setSelectedJobCard(null)
          }}
          onUpdate={handleJobCardUpdate}
        />
      )}

      {/* Job Card Form Modal */}
      {showJobCardForm && (
        <JobCardForm
          onClose={() => setShowJobCardForm(false)}
          onSave={(jobCard) => {
            console.log("Creating job card:", jobCard)
            setShowJobCardForm(false)
          }}
        />
      )}
    </div>
  )
}
