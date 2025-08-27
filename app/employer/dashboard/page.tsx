"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { JobCard } from "@/components/job-card"
import { Briefcase, Users, DollarSign, Plus, Eye, Clock, CheckCircle, AlertCircle } from "lucide-react"
import type { Job } from "@/lib/types"
import type { User } from "@/lib/local-db"

// Mock data
const mockJobs: Job[] = [
  {
    id: "1",
    title: "House Cleaning Service",
    description: "Need thorough cleaning of 3-bedroom house including bathrooms and kitchen",
    category: "cleaning",
    location: { address: "Sandton, Johannesburg" },
    budget: { min: 300, max: 500, currency: "ZAR" },
    duration: { estimated: 4, flexible: true },
    requirements: ["Experience with deep cleaning", "Own cleaning supplies"],
    status: "posted",
    employerId: "emp1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Garden Maintenance",
    description: "Weekly garden maintenance including lawn mowing and plant care",
    category: "gardening",
    location: { address: "Rosebank, Johannesburg" },
    budget: { min: 200, max: 300, currency: "ZAR" },
    duration: { estimated: 3, flexible: false },
    requirements: ["Gardening experience", "Own tools"],
    status: "assigned",
    employerId: "emp1",
    workerId: "worker1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

function EmployerDashboardContent() {
  const [jobs] = useState<Job[]>(mockJobs)
  const [currentUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("currentUser")
      return userData ? JSON.parse(userData) : null
    }
    return null
  })

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter((j) => j.status === "posted" || j.status === "assigned").length,
    completedJobs: jobs.filter((j) => j.status === "completed").length,
    totalSpent: 1250,
  }

  const handleViewJob = (job: Job) => {
    console.log("[v0] View job:", job.id)
    // TODO: Navigate to job details
  }

  const handleEditJob = (job: Job) => {
    console.log("[v0] Edit job:", job.id)
    // TODO: Navigate to edit job
  }

  return (
    <DashboardLayout
      userRole="employer"
      userName={currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Employer"}
      notifications={3}
    >
      <div className="space-y-6 animate-fade-in-up">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              Welcome back, {currentUser?.firstName || "Employer"}!
            </h2>
            <p className="text-muted-foreground">Manage your jobs and find the right workers</p>
          </div>
          <Button onClick={() => (window.location.href = "/employer/post-job")} className="sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="animate-slide-in-right">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalJobs}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card className="animate-slide-in-right" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeJobs}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card className="animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedJobs}</div>
              <p className="text-xs text-muted-foreground">Successfully completed</p>
            </CardContent>
          </Card>

          <Card className="animate-slide-in-right" style={{ animationDelay: "0.3s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R{stats.totalSpent}</div>
              <p className="text-xs text-muted-foreground">Including 15% service fee</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Jobs */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Jobs</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => (window.location.href = "/employer/jobs")}>
                    <Eye className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {jobs.slice(0, 3).map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    userRole="employer"
                    onViewDetails={handleViewJob}
                    onEdit={handleEditJob}
                  />
                ))}
                {jobs.length === 0 && (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No jobs posted yet</p>
                    <Button className="mt-4" onClick={() => (window.location.href = "/employer/post-job")}>
                      Post Your First Job
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Notifications */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => (window.location.href = "/employer/post-job")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Post New Job
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => (window.location.href = "/employer/workers")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Browse Workers
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => (window.location.href = "/employer/messages")}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  View Messages
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm">New application received</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm">Job completed successfully</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm">Payment processed</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
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

export default function EmployerDashboard() {
  return (
    <AuthGuard requiredRole="employer">
      <EmployerDashboardContent />
    </AuthGuard>
  )
}
