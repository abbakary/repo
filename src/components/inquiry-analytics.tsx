"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts"
import { MessageCircle, Users, TrendingUp, Clock, CheckCircle, ArrowRight, Phone, Mail } from "lucide-react"
import type { Order } from "@/lib/types"

interface InquiryAnalyticsProps {
  orders: Order[]
}

interface InquiryInsight {
  category: string
  count: number
  conversionRate: number
  avgResponseTime: number
  color: string
}

export function InquiryAnalytics({ orders }: InquiryAnalyticsProps) {
  const analytics = useMemo(() => {
    const totalInquiries = orders.length
    const completedInquiries = orders.filter(o => o.status === "completed").length
    const pendingInquiries = orders.filter(o => o.status === "created" || o.status === "assigned").length
    
    // Mock inquiry categories based on descriptions
    const inquiryCategories: InquiryInsight[] = [
      {
        category: "Pricing Information",
        count: Math.floor(totalInquiries * 0.35),
        conversionRate: 65,
        avgResponseTime: 15,
        color: "#3B82F6"
      },
      {
        category: "Service Availability", 
        count: Math.floor(totalInquiries * 0.25),
        conversionRate: 45,
        avgResponseTime: 20,
        color: "#10B981"
      },
      {
        category: "Technical Questions",
        count: Math.floor(totalInquiries * 0.20),
        conversionRate: 55,
        avgResponseTime: 30,
        color: "#F59E0B"
      },
      {
        category: "Appointment Booking",
        count: Math.floor(totalInquiries * 0.15),
        conversionRate: 85,
        avgResponseTime: 10,
        color: "#8B5CF6"
      },
      {
        category: "General Questions",
        count: Math.floor(totalInquiries * 0.05),
        conversionRate: 25,
        avgResponseTime: 25,
        color: "#6B7280"
      }
    ]

    // Daily inquiry trends (last 7 days)
    const dailyInquiries = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        inquiries: Math.floor(Math.random() * 8) + 2,
        converted: Math.floor(Math.random() * 4) + 1,
        responseTime: Math.floor(Math.random() * 30) + 10,
        satisfaction: Math.floor(Math.random() * 2) + 8 // 8-10 rating
      }
    })

    // Response time analysis
    const responseTimeData = [
      { timeRange: "0-15 min", count: Math.floor(totalInquiries * 0.4), target: "Excellent" },
      { timeRange: "15-30 min", count: Math.floor(totalInquiries * 0.35), target: "Good" },
      { timeRange: "30-60 min", count: Math.floor(totalInquiries * 0.15), target: "Fair" },
      { timeRange: "60+ min", count: Math.floor(totalInquiries * 0.1), target: "Poor" }
    ]

    // Source tracking
    const inquirySources = [
      { source: "Walk-in", count: Math.floor(totalInquiries * 0.45), color: "#3B82F6" },
      { source: "Phone Call", count: Math.floor(totalInquiries * 0.30), color: "#10B981" },
      { source: "Online Form", count: Math.floor(totalInquiries * 0.15), color: "#F59E0B" },
      { source: "Social Media", count: Math.floor(totalInquiries * 0.05), color: "#8B5CF6" },
      { source: "Referral", count: Math.floor(totalInquiries * 0.05), color: "#EF4444" }
    ]

    // Conversion funnel
    const conversionFunnel = [
      { stage: "Initial Inquiry", count: totalInquiries, percentage: 100 },
      { stage: "Information Provided", count: Math.floor(totalInquiries * 0.8), percentage: 80 },
      { stage: "Quote Requested", count: Math.floor(totalInquiries * 0.6), percentage: 60 },
      { stage: "Appointment Scheduled", count: Math.floor(totalInquiries * 0.45), percentage: 45 },
      { stage: "Service Completed", count: Math.floor(totalInquiries * 0.35), percentage: 35 }
    ]

    const overallConversionRate = totalInquiries > 0 ? (conversionFunnel[4].count / totalInquiries) * 100 : 0
    const avgResponseTime = responseTimeData.reduce((sum, item, index) => {
      const midTime = index === 0 ? 7.5 : index === 1 ? 22.5 : index === 2 ? 45 : 75
      return sum + (item.count * midTime)
    }, 0) / totalInquiries

    return {
      totalInquiries,
      completedInquiries,
      pendingInquiries,
      overallConversionRate,
      avgResponseTime,
      inquiryCategories,
      dailyInquiries,
      responseTimeData,
      inquirySources,
      conversionFunnel
    }
  }, [orders])

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}m`
    return `${Math.round(minutes / 60 * 10) / 10}h`
  }

  return (
    <div className="space-y-6">
      {/* Key Inquiry Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Inquiries</p>
                <p className="text-2xl font-bold">{analytics.totalInquiries}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="secondary" className="text-xs">
                {analytics.pendingInquiries} pending
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{Math.round(analytics.overallConversionRate)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2">
              <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-xs text-green-600">
                {analytics.completedInquiries} converted
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">{formatTime(analytics.avgResponseTime)}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="secondary" className="text-xs">
                Target: 15m
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customer Satisfaction</p>
                <p className="text-2xl font-bold">8.7/10</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-xs text-green-600">
                +0.3 this week
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Inquiry Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Inquiry Categories</CardTitle>
            <CardDescription>Types of customer inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.inquiryCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, count, percentage = 0 }) => `${category}: ${count} (${percentage.toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.inquiryCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, "Inquiries"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Response Time Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Response Time Performance</CardTitle>
            <CardDescription>How quickly we respond to inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timeRange" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Inquiry Trends */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Inquiry Trends (Last 7 Days)</CardTitle>
            <CardDescription>Daily inquiry volume and conversion</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={analytics.dailyInquiries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    value,
                    name === "inquiries" ? "Inquiries" : 
                    name === "converted" ? "Converted" :
                    name === "responseTime" ? "Response Time (min)" : "Satisfaction"
                  ]}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="inquiries"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                  name="Total Inquiries"
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="converted"
                  stackId="2"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.6}
                  name="Converted"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="responseTime"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  name="Response Time (min)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inquiry Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Inquiry Sources</CardTitle>
            <CardDescription>Where inquiries are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.inquirySources.map((source) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: source.color }}
                    />
                    <span className="font-medium">{source.source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{source.count}</span>
                    <Badge variant="secondary">
                      {Math.round((source.count / analytics.totalInquiries) * 100)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>Customer journey from inquiry to service</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.conversionFunnel.map((stage, index) => (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{stage.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{stage.count}</span>
                      <Badge variant="secondary">{stage.percentage}%</Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                  {index < analytics.conversionFunnel.length - 1 && (
                    <div className="flex justify-center">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance Details */}
      <Card>
        <CardHeader>
          <CardTitle>Category Performance Analysis</CardTitle>
          <CardDescription>Detailed breakdown by inquiry type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {analytics.inquiryCategories.map((category) => (
              <div key={category.category} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{category.category}</h4>
                  <Badge style={{ backgroundColor: category.color, color: "white" }}>
                    {category.count}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Conversion Rate:</span>
                    <span className="font-medium">{category.conversionRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg Response:</span>
                    <span className="font-medium">{formatTime(category.avgResponseTime)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${category.conversionRate}%`,
                        backgroundColor: category.color 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle>Action Items & Recommendations</CardTitle>
          <CardDescription>Areas for improvement based on inquiry data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Response Time Improvement</h4>
              <p className="text-sm text-yellow-700">
                {analytics.responseTimeData[2].count + analytics.responseTimeData[3].count} inquiries took over 30 minutes to respond. 
                Consider implementing automated acknowledgment messages.
              </p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">High Conversion Opportunities</h4>
              <p className="text-sm text-blue-700">
                Appointment booking inquiries have 85% conversion rate. Consider promoting online booking 
                to convert more general inquiries.
              </p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Content Gap Analysis</h4>
              <p className="text-sm text-green-700">
                Technical questions have lower conversion. Consider creating FAQ content or 
                technical guides to better address common questions.
              </p>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Follow-up Strategy</h4>
              <p className="text-sm text-purple-700">
                Only 35% of inquiries convert to services. Implement a systematic follow-up 
                process for pricing and service availability inquiries.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
