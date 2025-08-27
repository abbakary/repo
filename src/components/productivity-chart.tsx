"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const productivityData = [
  { name: "Peter", estimated: 480, actual: 420, efficiency: 114 },
  { name: "James", estimated: 360, actual: 320, efficiency: 113 },
  { name: "Samuel", estimated: 300, actual: 280, efficiency: 107 },
]

const chartConfig = {
  estimated: {
    label: "Estimated Time",
    color: "#3b82f6",
  },
  actual: {
    label: "Actual Time",
    color: "#15803d",
  },
}

export function ProductivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Technician Productivity</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Technician</span>
                            <span className="font-bold">{label}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Efficiency</span>
                            <span className="font-bold text-green-600">{data.efficiency}%</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Estimated</span>
                            <span className="font-bold">
                              {Math.floor(data.estimated / 60)}h {data.estimated % 60}m
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Actual</span>
                            <span className="font-bold">
                              {Math.floor(data.actual / 60)}h {data.actual % 60}m
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="estimated" fill="var(--color-estimated)" name="Estimated Time" />
              <Bar dataKey="actual" fill="var(--color-actual)" name="Actual Time" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
