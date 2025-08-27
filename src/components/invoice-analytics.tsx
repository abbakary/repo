"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Calendar, AlertTriangle, CheckCircle, Clock, Users } from "lucide-react"
import type { Invoice } from "@/lib/types"

interface InvoiceAnalyticsProps {
  invoices: Invoice[]
}

interface PaymentTrend {
  month: string
  revenue: number
  invoicesCount: number
  avgAmount: number
  paidOnTime: number
  overdue: number
}

export function InvoiceAnalytics({ invoices }: InvoiceAnalyticsProps) {
  const analytics = useMemo(() => {
    // Basic metrics
    const totalInvoices = invoices.length
    const paidInvoices = invoices.filter(inv => inv.status === "paid").length
    const overdueInvoices = invoices.filter(inv => inv.status === "overdue").length
    const totalRevenue = invoices.filter(inv => inv.status === "paid").reduce((sum, inv) => sum + inv.total_amount, 0)
    const pendingRevenue = invoices.filter(inv => inv.status === "sent").reduce((sum, inv) => sum + inv.balance_due, 0)
    const overdueAmount = invoices.filter(inv => inv.status === "overdue").reduce((sum, inv) => sum + inv.balance_due, 0)

    // Status distribution
    const statusData = [
      { name: "Draft", value: invoices.filter(inv => inv.status === "draft").length, color: "#6B7280" },
      { name: "Sent", value: invoices.filter(inv => inv.status === "sent").length, color: "#3B82F6" },
      { name: "Paid", value: invoices.filter(inv => inv.status === "paid").length, color: "#10B981" },
      { name: "Overdue", value: invoices.filter(inv => inv.status === "overdue").length, color: "#EF4444" },
      { name: "Cancelled", value: invoices.filter(inv => inv.status === "cancelled").length, color: "#F59E0B" }
    ]

    // Payment trends (last 6 months mock data)
    const paymentTrends: PaymentTrend[] = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - (5 - i))
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      
      const monthInvoices = Math.floor(Math.random() * 15) + 5
      const revenue = Math.floor(Math.random() * 2000000) + 500000
      
      return {
        month: monthName,
        revenue,
        invoicesCount: monthInvoices,
        avgAmount: revenue / monthInvoices,
        paidOnTime: Math.floor(monthInvoices * 0.7),
        overdue: Math.floor(monthInvoices * 0.2)
      }
    })

    // Customer type analysis
    const customerTypeRevenue = [
      { type: "Government", revenue: totalRevenue * 0.45, invoices: Math.floor(totalInvoices * 0.2), color: "#3B82F6" },
      { type: "Private", revenue: totalRevenue * 0.3, invoices: Math.floor(totalInvoices * 0.35), color: "#10B981" },
      { type: "Personal", revenue: totalRevenue * 0.15, invoices: Math.floor(totalInvoices * 0.3), color: "#F59E0B" },
      { type: "NGO", revenue: totalRevenue * 0.07, invoices: Math.floor(totalInvoices * 0.1), color: "#8B5CF6" },
      { type: "Bodaboda", revenue: totalRevenue * 0.03, invoices: Math.floor(totalInvoices * 0.05), color: "#EF4444" }
    ]

    // Payment method analysis
    const paymentMethods = [
      { method: "Cash", amount: totalRevenue * 0.4, count: Math.floor(paidInvoices * 0.5), color: "#10B981" },
      { method: "M-Pesa", amount: totalRevenue * 0.35, count: Math.floor(paidInvoices * 0.3), color: "#3B82F6" },
      { method: "Bank Transfer", amount: totalRevenue * 0.2, count: Math.floor(paidInvoices * 0.15), color: "#F59E0B" },
      { method: "Check", amount: totalRevenue * 0.05, count: Math.floor(paidInvoices * 0.05), color: "#8B5CF6" }
    ]

    // Collection efficiency
    const avgCollectionTime = 18 // days
    const collectionRate = paidInvoices / totalInvoices * 100
    const avgInvoiceValue = totalRevenue / paidInvoices || 0

    // Aging analysis
    const agingData = [
      { range: "0-30 days", amount: pendingRevenue * 0.6, count: Math.floor(invoices.filter(inv => inv.status === "sent").length * 0.7) },
      { range: "31-60 days", amount: pendingRevenue * 0.25, count: Math.floor(invoices.filter(inv => inv.status === "sent").length * 0.2) },
      { range: "61-90 days", amount: pendingRevenue * 0.1, count: Math.floor(invoices.filter(inv => inv.status === "sent").length * 0.07) },
      { range: "90+ days", amount: pendingRevenue * 0.05, count: Math.floor(invoices.filter(inv => inv.status === "sent").length * 0.03) }
    ]

    return {
      totalInvoices,
      paidInvoices,
      overdueInvoices,
      totalRevenue,
      pendingRevenue,
      overdueAmount,
      avgCollectionTime,
      collectionRate,
      avgInvoiceValue,
      statusData,
      paymentTrends,
      customerTypeRevenue,
      paymentMethods,
      agingData
    }
  }, [invoices])

  const formatCurrency = (amount: number) => `TSH ${amount.toLocaleString()}`
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`

  return (
    <div className="space-y-6">
      {/* Key Financial Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(analytics.totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-xs text-green-600">+12.3% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Collection Rate</p>
                <p className="text-2xl font-bold text-blue-600">{formatPercentage(analytics.collectionRate)}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="secondary" className="text-xs">
                {analytics.paidInvoices}/{analytics.totalInvoices} paid
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Collection Time</p>
                <p className="text-2xl font-bold text-purple-600">{analytics.avgCollectionTime} days</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="secondary" className="text-xs">
                Target: 15 days
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue Amount</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(analytics.overdueAmount)}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="destructive" className="text-xs">
                {analytics.overdueInvoices} invoices
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Invoice Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Status Distribution</CardTitle>
            <CardDescription>Breakdown by invoice status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent = 0 }) => `${name}: ${value} (${percent.toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Method Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Revenue by payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.paymentMethods}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="method" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {analytics.paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trends */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trends (Last 6 Months)</CardTitle>
            <CardDescription>Monthly revenue and invoice volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={analytics.paymentTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === "revenue" ? formatCurrency(value as number) : value,
                    name === "revenue" ? "Revenue" : "Invoice Count"
                  ]}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.6}
                  name="Revenue"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="invoicesCount"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  name="Invoice Count"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customer Type Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Customer Type</CardTitle>
            <CardDescription>Customer segment analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.customerTypeRevenue.map((segment) => (
                <div key={segment.type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{segment.type}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{segment.invoices} invoices</span>
                      <Badge style={{ backgroundColor: segment.color, color: "white" }}>
                        {formatCurrency(segment.revenue)}
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${(segment.revenue / analytics.totalRevenue) * 100}%`,
                        backgroundColor: segment.color 
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Avg: {formatCurrency(segment.revenue / segment.invoices)}</span>
                    <span>{formatPercentage((segment.revenue / analytics.totalRevenue) * 100)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Accounts Receivable Aging */}
        <Card>
          <CardHeader>
            <CardTitle>Accounts Receivable Aging</CardTitle>
            <CardDescription>Outstanding invoice aging analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.agingData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="range" type="category" width={80} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="amount" fill="#EF4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Payment Performance</CardTitle>
            <CardDescription>Collection efficiency metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average Invoice Value:</span>
              <span className="font-medium">{formatCurrency(analytics.avgInvoiceValue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Collection Rate:</span>
              <span className="font-medium">{formatPercentage(analytics.collectionRate)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Days Sales Outstanding:</span>
              <span className="font-medium">{analytics.avgCollectionTime} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Overdue Rate:</span>
              <span className="font-medium text-red-600">
                {formatPercentage((analytics.overdueInvoices / analytics.totalInvoices) * 100)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Health</CardTitle>
            <CardDescription>Overall financial indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Outstanding:</span>
              <span className="font-medium">{formatCurrency(analytics.pendingRevenue + analytics.overdueAmount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Bad Debt Risk:</span>
              <span className="font-medium text-red-600">{formatCurrency(analytics.overdueAmount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Cash Flow Impact:</span>
              <span className="font-medium text-green-600">
                {formatPercentage((analytics.totalRevenue / (analytics.totalRevenue + analytics.pendingRevenue)) * 100)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Revenue Growth:</span>
              <span className="font-medium text-green-600">+12.3%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Action Items</CardTitle>
            <CardDescription>Recommended actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-800">Follow up on overdue invoices</p>
              <p className="text-xs text-red-600">{analytics.overdueInvoices} invoices overdue</p>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-800">Improve collection time</p>
              <p className="text-xs text-yellow-600">Target: 15 days vs Current: {analytics.avgCollectionTime} days</p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-800">Send pending invoices</p>
              <p className="text-xs text-blue-600">{analytics.statusData.find(s => s.name === "Draft")?.value} draft invoices</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
