"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle, Eye, MessageCircle } from "lucide-react"
import type { User } from "@/lib/local-db"

interface JobApplication {
  id: string
  jobId: string
  jobTitle: string
  employerName: string
  location: string
  budget: { min: number; max: number; currency: string }
  appliedAt: Date
  status: "pending" | "accepted" | "rejected" | "withdrawn"
  message?: string
  employerResponse?: string
}

// Mock applications data
const mockApplications: JobApplication[] = [
  {
    id: "app1",
    jobId: "3",
    jobTitle: "Office Cleaning",
    employerName: "Sarah Business Solutions",
    location: "Braamfontein, Johannesburg",
    budget: { min: 400, max: 600, currency: "ZAR" },
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: "pending",
    message: "I have 3+ years of commercial cleaning experience and can start immediately.",
  },
  {
    id: "app2",
    jobId: "4",
    jobTitle: "Furniture Assembly",
    employerName: "Mike Thompson",
    location: "Melville, Johannesburg",
    budget: { min: 250, max: 400, currency: "ZAR" },
    appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    status: "accepted",
    message: "I specialize in IKEA furniture assembly and have all necessary tools.",
    employerResponse: "Great! Your experience looks perfect. When can you start?",
  },
  {
    id: "app3",
    jobId: "7",
    jobTitle: "Garden Landscaping",
    employerName: "Jennifer Wilson",
    location: "Sandton, Johannesburg",
    budget: { min: 1500, max: 2500, currency: "ZAR" },
    appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    status: "rejected",
    message: "I have extensive landscaping experience with irrigation systems.",
    employerResponse: "Thank you for your application. We've decided to go with someone else.",
  },
  {
    id: "app4",
    jobId: "8",
    jobTitle: "House Painting",
    employerName: "David Chen",
    location: "Rosebank, Johannesburg",
    budget: { min: 800, max: 1200, currency: "ZAR" },
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    status: "pending",
    message: "Professional painter with 5+ years experience. Can provide references.",
  },
]

function WorkerApplicationsContent() {
  const [applications] = useState<JobApplication[]>(mockApplications)
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [currentUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("currentUser")
      return userData ? JSON.parse(userData) : null
    }
    return null
  })

  const filteredApplications = applications.filter((app) => selectedStatus === "all" || app.status === selectedStatus)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "accepted":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      case "withdrawn":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "withdrawn":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleViewJob = (application: JobApplication) => {
    console.log("[v0] View job:", application.jobId)
    alert(`Viewing job: ${application.jobTitle}`)
  }

  const handleContactEmployer = (application: JobApplication) => {
    console.log("[v0] Contact employer for application:", application.id)
    alert(`Contacting ${application.employerName}`)
  }

  const handleWithdrawApplication = (application: JobApplication) => {
    if (confirm(`Are you sure you want to withdraw your application for "${application.jobTitle}"?`)) {
      console.log("[v0] Withdraw application:", application.id)
      alert("Application withdrawn")
    }
  }

  const stats = {
    total: applications.length,
    pending: applications.filter((app) => app.status === "pending").length,
    accepted: applications.filter((app) => app.status === "accepted").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
  }

  return (
    <DashboardLayout
      userRole="worker"
      userName={currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Worker"}
      notifications={2}
    >
      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">My Applications</h2>
            <p className="text-muted-foreground">Track your job applications and responses</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total Applications</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
              <p className="text-sm text-muted-foreground">Accepted</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* Status Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {["all", "pending", "accepted", "rejected", "withdrawn"].map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className="capitalize"
                >
                  {status === "all" ? "All Applications" : status}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle>Applications ({filteredApplications.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredApplications.map((application) => (
              <div key={application.id} className="border border-border rounded-lg p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{application.jobTitle}</h3>
                      <Badge className={getStatusColor(application.status)} variant="secondary">
                        <div className="flex items-center gap-1">
                          {getStatusIcon(application.status)}
                          <span className="capitalize">{application.status}</span>
                        </div>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>Employer:</strong> {application.employerName}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>Location:</strong> {application.location}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Budget:</strong> R{application.budget.min} - R{application.budget.max}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Applied {application.appliedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Application Message */}
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-sm font-medium text-foreground mb-1">Your Message:</p>
                  <p className="text-sm text-muted-foreground">{application.message}</p>
                </div>

                {/* Employer Response */}
                {application.employerResponse && (
                  <div className="bg-primary/5 rounded-lg p-3">
                    <p className="text-sm font-medium text-foreground mb-1">Employer Response:</p>
                    <p className="text-sm text-muted-foreground">{application.employerResponse}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                  <Button size="sm" variant="outline" onClick={() => handleViewJob(application)}>
                    <Eye className="w-4 h-4 mr-1" />
                    View Job
                  </Button>

                  {application.status === "accepted" && (
                    <Button size="sm" onClick={() => handleContactEmployer(application)}>
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Contact Employer
                    </Button>
                  )}

                  {application.status === "pending" && (
                    <Button size="sm" variant="destructive" onClick={() => handleWithdrawApplication(application)}>
                      Withdraw
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {filteredApplications.length === 0 && (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">No applications found</p>
                <p className="text-sm text-muted-foreground">
                  {selectedStatus === "all"
                    ? "Start applying to jobs to see them here"
                    : `No ${selectedStatus} applications`}
                </p>
                {selectedStatus === "all" && (
                  <Button className="mt-4" onClick={() => (window.location.href = "/worker/jobs")}>
                    Browse Jobs
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default function WorkerApplications() {
  return (
    <AuthGuard requiredRole="worker">
      <WorkerApplicationsContent />
    </AuthGuard>
  )
}
