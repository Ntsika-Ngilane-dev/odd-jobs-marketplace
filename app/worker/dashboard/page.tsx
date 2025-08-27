"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { JobCard } from "@/components/job-card"
import { JobMap } from "@/components/job-map"
import { Search, DollarSign, Clock, CheckCircle, Star, MapPin, Briefcase, Calendar } from "lucide-react"
import type { Job } from "@/lib/types"
import type { User } from "@/lib/local-db"

// Mock data
const mockAvailableJobs: Job[] = [
  {
    id: "3",
    title: "Office Cleaning",
    description: "Daily office cleaning for small business, 5 days a week",
    category: "cleaning",
    location: { address: "Braamfontein, Johannesburg" },
    budget: { min: 400, max: 600, currency: "ZAR" },
    duration: { estimated: 2, flexible: true },
    requirements: ["Commercial cleaning experience", "Reliable transport"],
    status: "posted",
    employerId: "emp2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    title: "Furniture Assembly",
    description: "Assemble IKEA furniture for new apartment",
    category: "handyman",
    location: { address: "Melville, Johannesburg" },
    budget: { min: 250, max: 400, currency: "ZAR" },
    duration: { estimated: 3, flexible: false },
    requirements: ["Furniture assembly experience", "Own tools"],
    status: "posted",
    employerId: "emp3",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const mockMyJobs: Job[] = [
  {
    id: "5",
    title: "Garden Maintenance",
    description: "Weekly garden maintenance including lawn mowing and plant care",
    category: "gardening",
    location: { address: "Rosebank, Johannesburg" },
    budget: { min: 200, max: 300, currency: "ZAR" },
    duration: { estimated: 3, flexible: false },
    requirements: ["Gardening experience", "Own tools"],
    status: "in-progress",
    employerId: "emp1",
    workerId: "worker1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

function WorkerDashboardContent() {
  const [availableJobs] = useState<Job[]>(mockAvailableJobs)
  const [myJobs] = useState<Job[]>(mockMyJobs)
  const [selectedJobId, setSelectedJobId] = useState<string>()
  const [currentUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("currentUser")
      return userData ? JSON.parse(userData) : null
    }
    return null
  })

  const mapJobs = availableJobs.map((job) => ({
    id: job.id,
    title: job.title,
    address: job.location.address,
    lat: -26.2041 + (Math.random() - 0.5) * 0.1, // Mock coordinates around Johannesburg
    lng: 28.0473 + (Math.random() - 0.5) * 0.1,
    category: job.category,
    budget: job.budget.max,
    urgency: job.duration.flexible ? "low" : ("medium" as "low" | "medium" | "high"),
  }))

  const stats = {
    completedJobs: 12,
    activeJobs: myJobs.filter((j) => j.status === "assigned" || j.status === "in-progress").length,
    totalEarnings: 3450,
    rating: 4.8,
  }

  const handleViewJob = (job: Job) => {
    console.log("[v0] View job:", job.id)
    // TODO: Navigate to job details
  }

  const handleApplyJob = (job: Job) => {
    console.log("[v0] Apply to job:", job.id)
    // TODO: Apply to job
  }

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId)
    const selectedJob = availableJobs.find((job) => job.id === jobId)
    if (selectedJob) {
      handleViewJob(selectedJob)
    }
  }

  return (
    <DashboardLayout
      userRole="worker"
      userName={currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Worker"}
      notifications={2}
    >
      <div className="space-y-6 animate-fade-in-up">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Welcome back, {currentUser?.firstName || "Worker"}!</h2>
            <p className="text-muted-foreground">Find your next job opportunity</p>
          </div>
          <Button onClick={() => (window.location.href = "/worker/jobs")} className="sm:w-auto">
            <Search className="w-4 h-4 mr-2" />
            Browse Jobs
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="animate-slide-in-right">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedJobs}</div>
              <p className="text-xs text-muted-foreground">Successfully completed</p>
            </CardContent>
          </Card>

          <Card className="animate-slide-in-right" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeJobs}</div>
              <p className="text-xs text-muted-foreground">Currently working</p>
            </CardContent>
          </Card>

          <Card className="animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R{stats.totalEarnings}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card className="animate-slide-in-right" style={{ animationDelay: "0.3s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rating}</div>
              <p className="text-xs text-muted-foreground">Average rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Available Jobs */}
          <div className="lg:col-span-2 space-y-6">
            <JobMap
              jobs={mapJobs}
              selectedJob={selectedJobId}
              onJobSelect={handleJobSelect}
              className="animate-slide-in-left"
            />

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Available Jobs Near You</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => (window.location.href = "/worker/jobs")}>
                    <Search className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </div>
                <CardDescription>Jobs matching your skills and location</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {availableJobs.slice(0, 3).map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    userRole="worker"
                    onViewDetails={handleViewJob}
                    onApply={handleApplyJob}
                  />
                ))}
                {availableJobs.length === 0 && (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No jobs available right now</p>
                    <p className="text-sm text-muted-foreground">Check back later for new opportunities</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Jobs */}
            <Card>
              <CardHeader>
                <CardTitle>Current Jobs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {myJobs.map((job) => (
                  <div key={job.id} className="border border-border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{job.title}</h4>
                      <Badge variant="secondary">{job.status.replace("-", " ")}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{job.location.address}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium text-primary">
                        R{job.budget.min} - R{job.budget.max}
                      </span>
                      <Button size="sm" variant="outline" onClick={() => handleViewJob(job)}>
                        View
                      </Button>
                    </div>
                  </div>
                ))}
                {myJobs.length === 0 && (
                  <div className="text-center py-4">
                    <Briefcase className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No active jobs</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>This Week</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Jobs Applied</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Jobs Completed</span>
                  <span className="font-medium">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Earnings</span>
                  <span className="font-medium text-primary">R850</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Hours Worked</span>
                  <span className="font-medium">12h</span>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Garden Maintenance</p>
                    <p className="text-xs text-muted-foreground">Tomorrow at 9:00 AM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function WorkerDashboard() {
  return (
    <AuthGuard requiredRole="worker">
      <WorkerDashboardContent />
    </AuthGuard>
  )
}
