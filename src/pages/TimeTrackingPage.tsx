"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Timer, Clock, TrendingUp, TrendingDown, User, CalendarIcon, BarChart3, Search } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { TimeTrackingWidget } from "@/components/time-tracking-widget"
import { ProductivityChart } from "@/components/productivity-chart"

// Mock data for time tracking
const mockTechnicians = [
  {
    id: 1,
    name: "Peter Mwangi",
    specialization: "Engine",
    status: "working",
    current_job: "JC001",
    hours_today: 6.5,
    efficiency: 92,
  },
  {
    id: 2,
    name: "James Kimani",
    specialization: "Transmission",
    status: "break",
    current_job: "JC002",
    hours_today: 4.2,
    efficiency: 88,
  },
  {
    id: 3,
    name: "Samuel Ochieng",
    specialization: "Tyres",
    status: "idle",
    current_job: null,
    hours_today: 7.8,
    efficiency: 95,
  },
]

const mockTimeEntries = [
  {
    id: 1,
    technician: "Peter Mwangi",
    job_card: "JC001",
    customer: "John Mwalimu",
    activity: "work",
    start_time: "2024-01-20T08:30:00",
    end_time: "2024-01-20T10:00:00",
    duration: 90,
    estimated_duration: 120,
    efficiency: 133,
    notes: "Oil change completed ahead of schedule",
  },
  {
    id: 2,
    technician: "James Kimani",
    job_card: "JC002",
    customer: "Tanzania Revenue Authority",
    activity: "work",
    start_time: "2024-01-20T09:00:00",
    end_time: "2024-01-20T11:30:00",
    duration: 150,
    estimated_duration: 180,
    efficiency: 120,
    notes: "Transmission service progressing well",
  },
  {
    id: 3,
    technician: "Samuel Ochieng",
    job_card: "JC003",
    customer: "Mama Fatuma",
    activity: "work",
    start_time: "2024-01-20T10:00:00",
    end_time: "2024-01-20T11:00:00",
    duration: 60,
    estimated_duration: 90,
    efficiency: 150,
    notes: "Tyre replacement completed efficiently",
  },
]

const statusColors = {
  working: "bg-blue-100 text-blue-800",
  break: "bg-yellow-100 text-yellow-800",
  idle: "bg-gray-100 text-gray-800",
  offline: "bg-red-100 text-red-800",
}

const activityColors = {
  work: "bg-blue-100 text-blue-800",
  break: "bg-gray-100 text-gray-800",
  waiting: "bg-yellow-100 text-yellow-800",
  quality_check: "bg-green-100 text-green-800",
}

export default function TimeTrackingPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTechnician, setSelectedTechnician] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTimeEntries = mockTimeEntries.filter((entry) => {
    const matchesSearch =
      entry.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.job_card.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTechnician = selectedTechnician === "all" || entry.technician === selectedTechnician
    return matchesSearch && matchesTechnician
  })

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 100) return "text-green-600"
    if (efficiency >= 80) return "text-yellow-600"
    return "text-red-600"
  }

  const getTotalHoursToday = () => {
    return mockTechnicians.reduce((total, tech) => total + tech.hours_today, 0)
  }

  const getAverageEfficiency = () => {
    const totalEfficiency = mockTechnicians.reduce((total, tech) => total + tech.efficiency, 0)
    return Math.round(totalEfficiency / mockTechnicians.length)
  }

  const getActiveTechnicians = () => {
    return mockTechnicians.filter((tech) => tech.status === "working").length
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
              <span className="text-foreground">Time Tracking</span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Time Tracking Dashboard</h1>
                <p className="text-muted-foreground">Monitor productivity and work hours</p>
              </div>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("justify-start text-left font-normal")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(selectedDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{getTotalHoursToday().toFixed(1)}h</div>
                      <p className="text-sm text-muted-foreground">Total Hours Today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold text-green-600">{getActiveTechnicians()}</div>
                      <p className="text-sm text-muted-foreground">Active Technicians</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="text-2xl font-bold text-orange-600">{getAverageEfficiency()}%</div>
                      <p className="text-sm text-muted-foreground">Average Efficiency</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{mockTimeEntries.length}</div>
                      <p className="text-sm text-muted-foreground">Time Entries Today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="technicians">Technicians</TabsTrigger>
                <TabsTrigger value="entries">Time Entries</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Live Time Tracking Widget */}
                  <TimeTrackingWidget />

                  {/* Productivity Chart */}
                  <ProductivityChart />
                </div>

                {/* Active Jobs */}
                <Card>
                  <CardHeader>
                    <CardTitle>Active Jobs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job Card</TableHead>
                          <TableHead>Technician</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Progress</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockTechnicians
                          .filter((tech) => tech.current_job)
                          .map((tech) => (
                            <TableRow key={tech.id}>
                              <TableCell>{tech.current_job}</TableCell>
                              <TableCell>{tech.name}</TableCell>
                              <TableCell>Customer Name</TableCell>
                              <TableCell>
                                <Badge className={statusColors[tech.status as keyof typeof statusColors]}>
                                  {tech.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatDuration(tech.hours_today * 60)}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress value={tech.efficiency} className="w-16" />
                                  <span className="text-sm">{tech.efficiency}%</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="technicians" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Technician Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {mockTechnicians.map((tech) => (
                        <Card key={tech.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h3 className="font-medium">{tech.name}</h3>
                                <p className="text-sm text-muted-foreground">{tech.specialization}</p>
                              </div>
                              <Badge className={statusColors[tech.status as keyof typeof statusColors]}>
                                {tech.status}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Hours Today:</span>
                                <span className="font-medium">{tech.hours_today}h</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Efficiency:</span>
                                <span className={`font-medium ${getEfficiencyColor(tech.efficiency)}`}>
                                  {tech.efficiency}%
                                  {tech.efficiency >= 100 ? (
                                    <TrendingUp className="h-3 w-3 inline ml-1" />
                                  ) : (
                                    <TrendingDown className="h-3 w-3 inline ml-1" />
                                  )}
                                </span>
                              </div>
                              {tech.current_job && (
                                <div className="flex justify-between text-sm">
                                  <span>Current Job:</span>
                                  <span className="font-medium">{tech.current_job}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="entries" className="space-y-6">
                {/* Search and Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle>Filter Time Entries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search by technician, job card, or customer..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Technician" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Technicians</SelectItem>
                          {mockTechnicians.map((tech) => (
                            <SelectItem key={tech.id} value={tech.name}>
                              {tech.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Time Entries Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Time Entries ({filteredTimeEntries.length} entries)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Technician</TableHead>
                          <TableHead>Job Card</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Activity</TableHead>
                          <TableHead>Start Time</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Estimated</TableHead>
                          <TableHead>Efficiency</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTimeEntries.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell>{entry.technician}</TableCell>
                            <TableCell>
                              <Button variant="link" className="p-0 h-auto">
                                {entry.job_card}
                              </Button>
                            </TableCell>
                            <TableCell>{entry.customer}</TableCell>
                            <TableCell>
                              <Badge className={activityColors[entry.activity as keyof typeof activityColors]}>
                                {entry.activity}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(entry.start_time).toLocaleTimeString()}</TableCell>
                            <TableCell>{formatDuration(entry.duration)}</TableCell>
                            <TableCell>{formatDuration(entry.estimated_duration)}</TableCell>
                            <TableCell>
                              <span className={getEfficiencyColor(entry.efficiency)}>
                                {entry.efficiency}%
                                {entry.efficiency >= 100 ? (
                                  <TrendingUp className="h-3 w-3 inline ml-1" />
                                ) : (
                                  <TrendingDown className="h-3 w-3 inline ml-1" />
                                )}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs truncate" title={entry.notes}>
                                {entry.notes}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Efficiency Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockTechnicians.map((tech) => (
                          <div key={tech.id} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{tech.name}</span>
                              <span className={getEfficiencyColor(tech.efficiency)}>{tech.efficiency}%</span>
                            </div>
                            <Progress value={tech.efficiency} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Daily Hours Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockTechnicians.map((tech) => (
                          <div key={tech.id} className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{tech.name}</div>
                              <div className="text-sm text-muted-foreground">{tech.specialization}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{tech.hours_today}h</div>
                              <div className="text-sm text-muted-foreground">
                                {((tech.hours_today / 8) * 100).toFixed(0)}% of 8h
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
