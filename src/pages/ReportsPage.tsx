"use client"

import { useState, Suspense, lazy } from "react"
import { AuthWrapper } from "@/components/auth-wrapper"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown, Users, Car, DollarSign, Clock, Download, Calendar } from "lucide-react"

// Lazy load heavy chart components
const BarChart = lazy(() => import("recharts").then(m => ({ default: m.BarChart })))
const Bar = lazy(() => import("recharts").then(m => ({ default: m.Bar })))
const XAxis = lazy(() => import("recharts").then(m => ({ default: m.XAxis })))
const YAxis = lazy(() => import("recharts").then(m => ({ default: m.YAxis })))
const CartesianGrid = lazy(() => import("recharts").then(m => ({ default: m.CartesianGrid })))
const Tooltip = lazy(() => import("recharts").then(m => ({ default: m.Tooltip })))
const ResponsiveContainer = lazy(() => import("recharts").then(m => ({ default: m.ResponsiveContainer })))
const LineChart = lazy(() => import("recharts").then(m => ({ default: m.LineChart })))
const Line = lazy(() => import("recharts").then(m => ({ default: m.Line })))
const PieChart = lazy(() => import("recharts").then(m => ({ default: m.PieChart })))
const Pie = lazy(() => import("recharts").then(m => ({ default: m.Pie })))
const Cell = lazy(() => import("recharts").then(m => ({ default: m.Cell })))
const AreaChart = lazy(() => import("recharts").then(m => ({ default: m.AreaChart })))
const Area = lazy(() => import("recharts").then(m => ({ default: m.Area })))

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("30")
  const [reportType, setReportType] = useState("overview")

  // Mock data - in real app, this would come from your database
  const revenueData = [
    { month: "Jan", revenue: 2450000, orders: 45, customers: 32 },
    { month: "Feb", revenue: 2890000, orders: 52, customers: 38 },
    { month: "Mar", revenue: 3200000, orders: 58, customers: 42 },
    { month: "Apr", revenue: 2750000, orders: 48, customers: 35 },
    { month: "May", revenue: 3450000, orders: 62, customers: 48 },
    { month: "Jun", revenue: 3890000, orders: 68, customers: 52 },
  ]

  const serviceTypeData = [
    { name: "Car Service", value: 65, color: "#0ea5e9" },
    { name: "Tire Sales", value: 25, color: "#10b981" },
    { name: "Consultations", value: 10, color: "#f59e0b" },
  ]

  const customerTypeData = [
    { type: "Personal", count: 145, percentage: 45 },
    { type: "Government", count: 89, percentage: 28 },
    { type: "Private", count: 56, percentage: 17 },
    { type: "Bodaboda", count: 23, percentage: 7 },
    { type: "NGO", count: 10, percentage: 3 },
  ]

  const performanceMetrics = [
    { metric: "Average Service Time", value: "2.5 hours", change: "-15%", trend: "down" },
    { metric: "Customer Satisfaction", value: "4.7/5", change: "+8%", trend: "up" },
    { metric: "Job Completion Rate", value: "94%", change: "+3%", trend: "up" },
    { metric: "Revenue per Customer", value: "TSH 67,500", change: "+12%", trend: "up" },
  ]

  const topServices = [
    { service: "Oil Change", count: 156, revenue: 780000 },
    { service: "Brake Service", count: 89, revenue: 1245000 },
    { service: "Engine Diagnostic", count: 67, revenue: 890000 },
    { service: "Tire Replacement", count: 45, revenue: 1350000 },
    { service: "AC Service", count: 34, revenue: 510000 },
  ]

  const exportReport = (type: string) => {
    console.log(`[v0] Exporting ${type} report for date range: ${dateRange} days`)
    // In real app, this would generate and download the report
  }

  return (
    <AuthWrapper>
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 3 months</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.metric}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <div className={`flex items-center ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-sm font-medium">{metric.change}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Reports Tabs */}
      <Tabs defaultValue="financial" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Financial Reports */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue performance in TSH</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value) => [`TSH ${Number(value).toLocaleString()}`, "Revenue"]} />
                    <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Service Type</CardTitle>
                <CardDescription>Distribution of revenue across service categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={serviceTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {serviceTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
              <CardDescription>Key financial metrics for the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">TSH 18.6M</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">TSH 12.4M</p>
                  <p className="text-sm text-muted-foreground">Net Profit</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">TSH 6.2M</p>
                  <p className="text-sm text-muted-foreground">Operating Costs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Operations Reports */}
        <TabsContent value="operations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Card Status Distribution</CardTitle>
                <CardDescription>Current status of all job cards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { status: "Pending", count: 12, color: "bg-yellow-500" },
                    { status: "In Progress", count: 8, color: "bg-blue-500" },
                    { status: "Quality Check", count: 3, color: "bg-orange-500" },
                    { status: "Completed", count: 45, color: "bg-green-500" },
                  ].map((item) => (
                    <div key={item.status} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="font-medium">{item.status}</span>
                      </div>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Service Times</CardTitle>
                <CardDescription>Time efficiency by service type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={[
                      { service: "Oil Change", estimated: 60, actual: 45 },
                      { service: "Brake Service", estimated: 120, actual: 135 },
                      { service: "Engine Diagnostic", estimated: 90, actual: 85 },
                      { service: "AC Service", estimated: 150, actual: 140 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="service" />
                    <YAxis label={{ value: "Minutes", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Bar dataKey="estimated" fill="#94a3b8" name="Estimated" />
                    <Bar dataKey="actual" fill="#0ea5e9" name="Actual" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Technician Performance</CardTitle>
              <CardDescription>Individual technician productivity metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "John Mwangi", jobs: 23, efficiency: 95, rating: 4.8 },
                  { name: "Peter Kimani", jobs: 19, efficiency: 88, rating: 4.6 },
                  { name: "David Ochieng", jobs: 17, efficiency: 92, rating: 4.7 },
                  { name: "Samuel Njoroge", jobs: 15, efficiency: 85, rating: 4.5 },
                ].map((tech) => (
                  <div key={tech.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{tech.name}</p>
                      <p className="text-sm text-muted-foreground">{tech.jobs} jobs completed</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm font-medium">{tech.efficiency}%</p>
                        <p className="text-xs text-muted-foreground">Efficiency</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">{tech.rating}/5</p>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Reports */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Distribution</CardTitle>
                <CardDescription>Breakdown by customer type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerTypeData.map((customer) => (
                    <div key={customer.type} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="font-medium">{customer.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{customer.count}</span>
                        <Badge variant="secondary">{customer.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
                <CardDescription>New customers acquired over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="customers" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
              <CardDescription>Highest value customers by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Tanzania Government Fleet", type: "Government", revenue: 2450000, visits: 12 },
                  { name: "Precision Air Services", type: "Private", revenue: 1890000, visits: 8 },
                  { name: "UNICEF Tanzania", type: "NGO", revenue: 1560000, visits: 6 },
                  { name: "John Mwalimu", type: "Personal", revenue: 890000, visits: 15 },
                  { name: "Dar es Salaam Taxi Association", type: "Bodaboda", revenue: 670000, visits: 23 },
                ].map((customer, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {customer.type} • {customer.visits} visits
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">TSH {customer.revenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Reports */}
        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Services by Revenue</CardTitle>
              <CardDescription>Most profitable services in the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{service.service}</p>
                        <p className="text-sm text-muted-foreground">{service.count} services</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">TSH {service.revenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        TSH {Math.round(service.revenue / service.count).toLocaleString()} avg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Demand Trends</CardTitle>
              <CardDescription>Popular services over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { month: "Jan", "Oil Change": 25, "Brake Service": 15, "Engine Diagnostic": 12 },
                    { month: "Feb", "Oil Change": 28, "Brake Service": 18, "Engine Diagnostic": 14 },
                    { month: "Mar", "Oil Change": 32, "Brake Service": 22, "Engine Diagnostic": 16 },
                    { month: "Apr", "Oil Change": 29, "Brake Service": 19, "Engine Diagnostic": 13 },
                    { month: "May", "Oil Change": 35, "Brake Service": 25, "Engine Diagnostic": 18 },
                    { month: "Jun", "Oil Change": 38, "Brake Service": 28, "Engine Diagnostic": 20 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Oil Change" fill="#0ea5e9" />
                  <Bar dataKey="Brake Service" fill="#10b981" />
                  <Bar dataKey="Engine Diagnostic" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Reports */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Satisfaction Trends</CardTitle>
                <CardDescription>Average ratings over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart
                    data={[
                      { month: "Jan", satisfaction: 4.2, complaints: 8 },
                      { month: "Feb", satisfaction: 4.4, complaints: 6 },
                      { month: "Mar", satisfaction: 4.6, complaints: 4 },
                      { month: "Apr", satisfaction: 4.5, complaints: 5 },
                      { month: "May", satisfaction: 4.7, complaints: 3 },
                      { month: "Jun", satisfaction: 4.8, complaints: 2 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[4, 5]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="satisfaction" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
                <CardDescription>Service quality indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { metric: "First-time Fix Rate", value: 87, target: 90 },
                    { metric: "On-time Completion", value: 94, target: 95 },
                    { metric: "Customer Return Rate", value: 78, target: 80 },
                    { metric: "Quality Check Pass", value: 96, target: 98 },
                  ].map((item) => (
                    <div key={item.metric} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.metric}</span>
                        <span>
                          {item.value}% / {item.target}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${item.value >= item.target ? "bg-green-500" : "bg-yellow-500"}`}
                          style={{ width: `${(item.value / item.target) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Operational Efficiency</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold">2.3h</p>
                  <p className="text-sm text-muted-foreground">Avg Service Time</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-green-100 flex items-center justify-center">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold">247</p>
                  <p className="text-sm text-muted-foreground">Active Customers</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-orange-100 flex items-center justify-center">
                    <Car className="h-8 w-8 text-orange-600" />
                  </div>
                  <p className="text-2xl font-bold">68</p>
                  <p className="text-sm text-muted-foreground">Jobs This Month</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-purple-100 flex items-center justify-center">
                    <DollarSign className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold">TSH 3.9M</p>
                  <p className="text-sm text-muted-foreground">Monthly Revenue</p>
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
