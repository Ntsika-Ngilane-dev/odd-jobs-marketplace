"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation } from "lucide-react"

interface JobLocation {
  id: string
  title: string
  address: string
  lat: number
  lng: number
  category: string
  budget: number
  urgency: "low" | "medium" | "high"
}

interface JobMapProps {
  jobs: JobLocation[]
  selectedJob?: string
  onJobSelect?: (jobId: string) => void
  className?: string
}

export function JobMap({ jobs, selectedJob, onJobSelect, className }: JobMapProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: -26.2041, lng: 28.0473 }) // Johannesburg default

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(location)
          setMapCenter(location)
        },
        (error) => {
          console.log("[v0] Geolocation error:", error)
        },
      )
    }
  }, [])

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      default:
        return "bg-green-500"
    }
  }

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Job Locations</h3>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Navigation className="w-4 h-4" />
          My Location
        </Button>
      </div>

      {/* Map Container - Simulated map interface */}
      <div className="relative bg-muted rounded-lg h-64 mb-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
          {/* Simulated map markers */}
          {jobs.map((job, index) => (
            <div
              key={job.id}
              className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer transition-all duration-200 hover:scale-110 ${
                selectedJob === job.id ? "ring-2 ring-primary" : ""
              } ${getUrgencyColor(job.urgency)}`}
              style={{
                left: `${20 + ((index * 15) % 60)}%`,
                top: `${30 + ((index * 20) % 40)}%`,
              }}
              onClick={() => onJobSelect?.(job.id)}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                R{job.budget}
              </div>
            </div>
          ))}

          {/* User location marker */}
          {userLocation && (
            <div
              className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"
              style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
            ></div>
          )}
        </div>

        {/* Map controls */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
            +
          </Button>
          <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
            -
          </Button>
        </div>
      </div>

      {/* Job list */}
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {jobs.map((job) => (
          <div
            key={job.id}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
              selectedJob === job.id ? "bg-primary/10" : "hover:bg-muted"
            }`}
            onClick={() => onJobSelect?.(job.id)}
          >
            <div className={`w-3 h-3 rounded-full ${getUrgencyColor(job.urgency)}`} />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{job.title}</p>
              <p className="text-sm text-muted-foreground truncate">{job.address}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">R{job.budget}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                2.1km
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
