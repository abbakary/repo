"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Square, Timer } from "lucide-react"

export function TimeTrackingWidget() {
  const [isTracking, setIsTracking] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [selectedJob, setSelectedJob] = useState("")
  const [selectedActivity, setSelectedActivity] = useState("work")
  const [startTime, setStartTime] = useState<Date | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTracking && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTracking, startTime])

  const handleStart = () => {
    if (!selectedJob) return
    setIsTracking(true)
    setStartTime(new Date())
    setElapsedTime(0)
  }

  const handlePause = () => {
    setIsTracking(false)
  }

  const handleStop = () => {
    setIsTracking(false)
    setStartTime(null)
    setElapsedTime(0)
    setSelectedJob("")
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`
  }

  const mockJobs = [
    { id: "JC001", customer: "John Mwalimu", description: "Oil Change" },
    { id: "JC002", customer: "Tanzania Revenue Authority", description: "Engine Diagnostic" },
    { id: "JC003", customer: "Mama Fatuma", description: "Tyre Replacement" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Live Time Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-4xl font-mono font-bold text-primary mb-2">{formatTime(elapsedTime)}</div>
          <div className="text-sm text-muted-foreground">
            {isTracking ? (
              <Badge className="bg-green-100 text-green-800">
                Tracking: {selectedActivity} on {selectedJob}
              </Badge>
            ) : (
              <Badge className="bg-gray-100 text-gray-800">Timer Stopped</Badge>
            )}
          </div>
        </div>

        {/* Job Selection */}
        <div className="space-y-2">
          <Select value={selectedJob} onValueChange={setSelectedJob} disabled={isTracking}>
            <SelectTrigger>
              <SelectValue placeholder="Select job card" />
            </SelectTrigger>
            <SelectContent>
              {mockJobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>
                  {job.id} - {job.customer}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedActivity} onValueChange={setSelectedActivity} disabled={isTracking}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="break">Break</SelectItem>
              <SelectItem value="waiting">Waiting</SelectItem>
              <SelectItem value="quality_check">Quality Check</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2 justify-center">
          {!isTracking ? (
            <Button onClick={handleStart} disabled={!selectedJob} className="bg-green-600 hover:bg-green-700">
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          ) : (
            <>
              <Button onClick={handlePause} variant="outline">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button onClick={handleStop} variant="destructive">
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            </>
          )}
        </div>

        {/* Current Session Info */}
        {isTracking && startTime && (
          <div className="text-center text-sm text-muted-foreground">Started at {startTime.toLocaleTimeString()}</div>
        )}
      </CardContent>
    </Card>
  )
}
