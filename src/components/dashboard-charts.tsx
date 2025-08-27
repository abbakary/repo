"use client"

import { Suspense, lazy, useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ChartSkeleton } from "@/components/chart-skeleton"

// Lazy load the entire recharts components
const LazyCharts = lazy(() => import("@/components/chart-components"))

export function DashboardCharts() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Delay loading charts until after initial page render
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) {
    return <ChartSkeleton />
  }

  return (
    <Suspense fallback={<ChartSkeleton />}>
      <LazyCharts />
    </Suspense>
  )
}
