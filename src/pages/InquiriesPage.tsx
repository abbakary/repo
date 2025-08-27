import { useState } from "react"
import { AuthWrapper } from "../components/auth-wrapper"
import { DashboardSidebar } from "../components/dashboard-sidebar"
import { DashboardHeader } from "../components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { useUser } from "../lib/user-context"
import { 
  Search, 
  Filter, 
  Eye, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Phone, 
  Mail,
  Calendar,
  User,
  AlertTriangle,
  MessageCircle
} from "lucide-react"

interface Inquiry {
  id: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  inquiry_type: "pricing" | "services" | "appointment" | "general" | "complaint"
  status: "new" | "in_progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  subject: string
  message: string
  created_at: string
  updated_at: string
  assigned_to?: string
  response?: string
  follow_up_date?: string
}

export default function InquiriesPage() {
  const { isAdmin } = useUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)

  // Mock data for inquiries
  const mockInquiries: Inquiry[] = [
    {
      id: "INQ-001",
      customer_name: "John Doe",
      customer_phone: "+255 123 456 789",
      customer_email: "john@example.com",
      inquiry_type: "pricing",
      status: "new",
      priority: "medium",
      subject: "Tire replacement pricing",
      message: "I need to replace all 4 tires on my Toyota Corolla. Can you provide pricing for different tire brands?",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z"
    },
    {
      id: "INQ-002",
      customer_name: "Mary Smith",
      customer_phone: "+255 987 654 321",
      customer_email: "mary@company.com",
      inquiry_type: "services",
      status: "in_progress",
      priority: "high",
      subject: "Engine diagnostic services",
      message: "My car is making strange noises. Do you provide engine diagnostic services? What equipment do you use?",
      created_at: "2024-01-14T14:15:00Z",
      updated_at: "2024-01-15T09:20:00Z",
      assigned_to: "Tech Team",
      response: "Yes, we have modern diagnostic equipment. Please schedule an appointment for detailed inspection."
    },
    {
      id: "INQ-003",
      customer_name: "David Wilson",
      customer_phone: "+255 555 777 888",
      inquiry_type: "appointment",
      status: "resolved",
      priority: "low",
      subject: "Schedule oil change appointment",
      message: "When is your next available slot for an oil change service?",
      created_at: "2024-01-13T16:45:00Z",
      updated_at: "2024-01-14T11:30:00Z",
      assigned_to: "Reception",
      response: "Appointment scheduled for January 16th at 2:00 PM."
    },
    {
      id: "INQ-004",
      customer_name: "Sarah Johnson",
      customer_phone: "+255 444 333 222",
      customer_email: "sarah.j@email.com",
      inquiry_type: "complaint",
      status: "new",
      priority: "urgent",
      subject: "Poor service quality",
      message: "I'm not satisfied with the brake service I received last week. The brakes are still making noise.",
      created_at: "2024-01-15T08:00:00Z",
      updated_at: "2024-01-15T08:00:00Z"
    }
  ]

  const filteredInquiries = mockInquiries.filter(inquiry => {
    const matchesSearch = inquiry.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter
    const matchesPriority = priorityFilter === "all" || inquiry.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { variant: "secondary" as const, color: "bg-blue-100 text-blue-800" },
      in_progress: { variant: "default" as const, color: "bg-yellow-100 text-yellow-800" },
      resolved: { variant: "outline" as const, color: "bg-green-100 text-green-800" },
      closed: { variant: "outline" as const, color: "bg-gray-100 text-gray-800" }
    }
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.new
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { color: "bg-gray-100 text-gray-800" },
      medium: { color: "bg-yellow-100 text-yellow-800" },
      high: { color: "bg-orange-100 text-orange-800" },
      urgent: { color: "bg-red-100 text-red-800" }
    }
    return priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.low
  }

  const getInquiryTypeIcon = (type: string) => {
    const icons = {
      pricing: <MessageSquare className="h-4 w-4" />,
      services: <MessageCircle className="h-4 w-4" />,
      appointment: <Calendar className="h-4 w-4" />,
      general: <MessageSquare className="h-4 w-4" />,
      complaint: <AlertTriangle className="h-4 w-4" />
    }
    return icons[type as keyof typeof icons] || icons.general
  }

  const stats = {
    total: mockInquiries.length,
    new: mockInquiries.filter(i => i.status === "new").length,
    in_progress: mockInquiries.filter(i => i.status === "in_progress").length,
    resolved: mockInquiries.filter(i => i.status === "resolved").length,
    urgent: mockInquiries.filter(i => i.priority === "urgent").length
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
                <span>Dashboard</span>
                <span className="mx-2">/</span>
                <span className="text-foreground">Customer Inquiries</span>
              </div>

              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Customer Inquiries</h1>
                  <p className="text-muted-foreground">Manage and respond to customer questions</p>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-2xl font-bold">{stats.total}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold">{stats.new}</p>
                        <p className="text-xs text-muted-foreground">New</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="text-2xl font-bold">{stats.in_progress}</p>
                        <p className="text-xs text-muted-foreground">In Progress</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold">{stats.resolved}</p>
                        <p className="text-xs text-muted-foreground">Resolved</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="text-2xl font-bold">{stats.urgent}</p>
                        <p className="text-xs text-muted-foreground">Urgent</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search inquiries by customer, subject, or ID..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Inquiries List */}
              <Card>
                <CardHeader>
                  <CardTitle>Inquiries ({filteredInquiries.length})</CardTitle>
                  <CardDescription>All customer inquiries and their current status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredInquiries.map((inquiry) => (
                      <div
                        key={inquiry.id}
                        className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => setSelectedInquiry(inquiry)}
                      >
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            {getInquiryTypeIcon(inquiry.inquiry_type)}
                            <span className="font-medium">{inquiry.subject}</span>
                            <Badge className={getStatusBadge(inquiry.status).color}>
                              {inquiry.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={getPriorityBadge(inquiry.priority).color}>
                              {inquiry.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {inquiry.customer_name}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {inquiry.customer_phone}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(inquiry.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {inquiry.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </AuthWrapper>
  )
}
