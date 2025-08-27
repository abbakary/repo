import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const performanceData = [
  { name: "Mon", carServices: 1800, tyreSales: 1200 },
  { name: "Tue", carServices: 2100, tyreSales: 1400 },
  { name: "Wed", carServices: 2000, tyreSales: 1600 },
  { name: "Thu", carServices: 2800, tyreSales: 1300 },
  { name: "Fri", carServices: 2100, tyreSales: 1800 },
  { name: "Sat", carServices: 2300, tyreSales: 1500 },
  { name: "Sun", carServices: 2200, tyreSales: 1400 },
]

const customerTypeData = [
  { name: "Government", value: 35, color: "#3b82f6" },
  { name: "Private", value: 30, color: "#84cc16" },
  { name: "Personal", value: 22, color: "#15803d" },
  { name: "Bodaboda", value: 13, color: "#06b6d4" },
]

const chartConfig = {
  carServices: {
    label: "Car Services",
    color: "#15803d",
  },
  tyreSales: {
    label: "Tyre Sales",
    color: "#f59e0b",
  },
}

export default function ChartComponents() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Service Performance Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Service Performance</CardTitle>
            <CardDescription>Weekly Performance</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#15803d" }}></div>
              Car Services
            </Badge>
            <Badge variant="outline" className="gap-1">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#f59e0b" }}></div>
              Tyre Sales
            </Badge>
            <Button variant="ghost" size="sm">
              This Week
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="carServices"
                  stroke="var(--color-carServices)"
                  strokeWidth={3}
                  dot={{ fill: "var(--color-carServices)", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="tyreSales"
                  stroke="var(--color-tyreSales)"
                  strokeWidth={3}
                  dot={{ fill: "var(--color-tyreSales)", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Customer Types Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Customer Types</CardTitle>
            <CardDescription>This Month</CardDescription>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {customerTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">{data.name}</span>
                              <span className="font-bold text-muted-foreground">{data.value}%</span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {customerTypeData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-muted-foreground">{item.name}</span>
                <span className="text-sm font-medium ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
