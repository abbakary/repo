"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Play, Pause, Square, Timer } from "lucide-react"

interface TimeTrackerProps {
  jobCard: any
  onUpdate: (jobCard: any) => void
}

interface TimeLog {
  id: number
  activity_type: string
  start_time: string
  end_time?: string
  duration_minutes?: number
  notes?: string
}

export function TimeTracker({ jobCard, onUpdate }: TimeTrackerProps) {
  const [isTracking, setIsTracking] = useState(false)
  const [currentActivity, setCurrentActivity] = useState("work")
  const [elapsedTime, setElapsedTime] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)

  // Mock time logs
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([
    {
      id: 1,
      activity_type: "work",
      start_time: "2024-01-20T08:30:00",
      end_time: "2024-01-20T10:00:00",
      duration_minutes: 90,
      notes: "Initial diagnostic and oil change",
    },
    {
      id: 2,
      activity_type: "break",
      start_time: "2024-01-20T10:00:00",
      end_time: "2024-01-20T10:15:00",
      duration_minutes: 15,
      notes: "Coffee break",
    },
    {
      id: 3,
      activity_type: "work",
      start_time: "2024-01-20T10:15:00",
      end_time: "2024-01-20T11:30:00",
      duration_minutes: 75,
      notes: "Brake inspection and adjustment",
    },
  ])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTracking && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTracking, startTime])

  const handleStartTracking = () => {
    setIsTracking(true)
    setStartTime(new Date())
    setElapsedTime(0)
  }

  const handlePauseTracking = () => {
    if (isTracking && startTime) {
      const endTime = new Date()
      const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 60000) // minutes

      const newLog: TimeLog = {
        id: timeLogs.length + 1,
        activity_type: currentActivity,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        duration_minutes: duration,
        notes: `${currentActivity} session`,
      }

      setTimeLogs((prev) => [...prev, newLog])
      setIsTracking(false)
      setStartTime(null)
      setElapsedTime(0)
    }
  }

  const handleStopTracking = () => {
    handlePauseTracking()
    // Update job card with time out
    const updatedJobCard = {
      ...jobCard,
      time_out: new Date().toISOString(),
      actual_duration: getTotalWorkTime() + elapsedTime / 60,
    }
    onUpdate(updatedJobCard)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getTotalWorkTime = () => {
    return timeLogs
      .filter((log) => log.activity_type === "work" && log.duration_minutes)
      .reduce((total, log) => total + (log.duration_minutes || 0), 0)
  }

  const getTotalBreakTime = () => {
    return timeLogs
      .filter((log) => log.activity_type === "break" && log.duration_minutes)
      .reduce((total, log) => total + (log.duration_minutes || 0), 0)
  }

  const activityColors = {
    work: "bg-blue-100 text-blue-800",
    break: "bg-gray-100 text-gray-800",
    waiting: "bg-yellow-100 text-yellow-800",
    quality_check: "bg-green-100 text-green-800",
  }

  return (
    <div className="space-y-6">
      {/* Current Timer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Time Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-mono font-bold text-primary mb-2">{formatTime(elapsedTime)}</div>
            <div className="text-sm text-muted-foreground">
              {isTracking ? `Tracking: ${currentActivity}` : "Timer stopped"}
            </div>
          </div>

          <div className="flex items-center gap-2 justify-center">
            <select
              value={currentActivity}
              onChange={(e) => setCurrentActivity(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
              disabled={isTracking}
            >
              <option value="work">Work</option>
              <option value="break">Break</option>
              <option value="waiting">Waiting</option>
              <option value="quality_check">Quality Check</option>
            </select>
          </div>

          <div className="flex gap-2 justify-center">
            {!isTracking ? (
              <Button onClick={handleStartTracking} className="bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
            ) : (
              <>
                <Button onClick={handlePauseTracking} variant="outline">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
                <Button onClick={handleStopTracking} variant="destructive">
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Time Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{formatDuration(getTotalWorkTime())}</div>
            <p className="text-sm text-muted-foreground">Total Work Time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{formatDuration(getTotalBreakTime())}</div>
            <p className="text-sm text-muted-foreground">Total Break Time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {formatDuration(getTotalWorkTime() + getTotalBreakTime())}
            </div>
            <p className="text-sm text-muted-foreground">Total Time</p>
          </CardContent>
        </Card>
      </div>

      {/* Time Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Time Log History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Badge className={activityColors[log.activity_type as keyof typeof activityColors]}>
                      {log.activity_type.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(log.start_time).toLocaleTimeString()}</TableCell>
                  <TableCell>{log.end_time ? new Date(log.end_time).toLocaleTimeString() : "In progress"}</TableCell>
                  <TableCell>{log.duration_minutes ? formatDuration(log.duration_minutes) : "-"}</TableCell>
                  <TableCell>{log.notes || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
