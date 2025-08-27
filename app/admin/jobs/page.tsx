"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, Eye, Flag, CheckCircle, XCircle, Clock } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Job } from "@/lib/types"
import type { User } from "@/lib/local-db"

// Extended job interface for admin view
interface AdminJob extends Job {
  employerName: string
  workerName?: string
  flagged: boolean
  flagReason?: string
  platformFee: number
}

// Mock jobs data for admin view
const mockJobs: AdminJob[] = [
  {
    id: "1",
    title: "House Cleaning Service",
    description: "Need thorough cleaning of 3-bedroom house including bathrooms and kitchen",
    category: "cleaning",
    location: { address: "Sandton, Johannesburg" },
    budget: { min: 300, max: 500, currency: "ZAR" },
    duration: { estimated: 4, flexible: true },
    requirements: ["Experience with deep cleaning", "Own cleaning supplies"],
    status: "completed",
    employerId: "emp1",
    workerId: "worker1",
    employerName: "Sarah Johnson",
    workerName: "John Smith",
    flagged: false,
    platformFee: 75,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
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
    status: "in-progress",
    employerId: "emp1",
    workerId: "worker2",
    employerName: "Sarah Johnson",
    workerName: "Mike Williams",
    flagged: false,
    platformFee: 45,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
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
    employerName: "David Chen",
    flagged: true,
    flagReason: "Unrealistic budget expectations",
    platformFee: 90,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
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
    status: "assigned",
    employerId: "emp3",
    workerId: "worker3",
    employerName: "Jennifer Wilson",
    workerName: "Alex Brown",
    flagged: false,
    platformFee: 60,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
]

function AdminJobsContent() {
  const [jobs, setJobs] = useState<AdminJob[]>(mockJobs)
  const [filteredJobs, setFilteredJobs] = useState<AdminJob[]>(mockJobs)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false)
  const [currentUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("currentUser")
      return userData ? JSON.parse(userData) : null
    }
    return null
  })

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterJobs(term, selectedStatus, selectedCategory, showFlaggedOnly)
  }

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status)
    filterJobs(searchTerm, status, selectedCategory, showFlaggedOnly)
  }

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
    filterJobs(searchTerm, selectedStatus, category, showFlaggedOnly)
  }

  const handleFlaggedFilter = (flaggedOnly: boolean) => {
    setShowFlaggedOnly(flaggedOnly)
    filterJobs(searchTerm, selectedStatus, selectedCategory, flaggedOnly)
  }

  const filterJobs = (search: string, status: string, category: string, flaggedOnly: boolean) => {
    let filtered = jobs

    if (search) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.description.toLowerCase().includes(search.toLowerCase()) ||
          job.employerName.toLowerCase().includes(search.toLowerCase()) ||
          job.workerName?.toLowerCase().includes(search.toLowerCase()) ||
          job.location.address.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (status !== "all") {
      filtered = filtered.filter((job) => job.status === status)
    }

    if (category !== "all") {
      filtered = filtered.filter((job) => job.category === category)
    }

    if (flaggedOnly) {
      filtered = filtered.filter((job) => job.flagged)
    }

    setFilteredJobs(filtered)
  }

  const handleJobAction = (jobId: string, action: string) => {
    const job = jobs.find((j) => j.id === jobId)
    if (!job) return

    switch (action) {
      case "view":
        console.log("[v0] View job details:", jobId)
        alert(`Viewing job: ${job.title}`)
        break
      case "flag":
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, flagged: true, flagReason: "Flagged by admin" } : j)),
        )
        setFilteredJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, flagged: true, flagReason: "Flagged by admin" } : j)),
        )
        console.log("[v0] Job flagged:", jobId)
        alert(`Job "${job.title}" has been flagged`)
        break
      case "unflag":
        setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, flagged: false, flagReason: undefined } : j)))
        setFilteredJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, flagged: false, flagReason: undefined } : j)),
        )
        console.log("[v0] Job unflagged:", jobId)
        alert(`Job "${job.title}" has been unflagged`)
        break
      case "suspend":
        console.log("[v0] Suspend job:", jobId)
        alert(`Job "${job.title}" has been suspended`)
        break
      case "resolve":
        console.log("[v0] Resolve job dispute:", jobId)
        alert(`Dispute for job "${job.title}" has been resolved`)
        break
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "posted":
        return "bg-blue-100 text-blue-800"
      case "assigned":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "posted":
        return <Clock className="w-4 h-4" />
      case "assigned":
      case "in-progress":
        return <Clock className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const stats = {
    total: jobs.length,
    posted: jobs.filter((j) => j.status === "posted").length,
    inProgress: jobs.filter((j) => j.status === "assigned" || j.status === "in-progress").length,
    completed: jobs.filter((j) => j.status === "completed").length,
    flagged: jobs.filter((j) => j.flagged).length,
    totalRevenue: jobs.reduce((sum, job) => sum + job.platformFee, 0),
  }

  return (
    <DashboardLayout
      userRole="admin"
      userName={currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Admin User"}
      notifications={5}
    >
      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Job Management</h2>
            <p className="text-muted-foreground">Monitor and manage all platform jobs</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total Jobs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.posted}</div>
              <p className="text-sm text-muted-foreground">Posted</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{stats.flagged}</div>
              <p className="text-sm text-muted-foreground">Flagged</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">R{stats.totalRevenue}</div>
              <p className="text-sm text-muted-foreground">Platform Fees</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search jobs by title, employer, worker, or location..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedStatus} onValueChange={handleStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="posted">Posted</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedCategory} onValueChange={handleCategoryFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="handyman">Handyman</SelectItem>
                    <SelectItem value="gardening">Gardening</SelectItem>
                    <SelectItem value="painting">Painting</SelectItem>
                    <SelectItem value="moving">Moving</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant={showFlaggedOnly ? "default" : "outline"}
                  onClick={() => handleFlaggedFilter(!showFlaggedOnly)}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Flagged Only
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs List */}
        <Card>
          <CardHeader>
            <CardTitle>Jobs ({filteredJobs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div key={job.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{job.title}</h3>
                        {job.flagged && <Flag className="w-4 h-4 text-red-500" />}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{job.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>
                          <strong>Employer:</strong> {job.employerName}
                        </span>
                        {job.workerName && (
                          <span>
                            <strong>Worker:</strong> {job.workerName}
                          </span>
                        )}
                        <span>
                          <strong>Location:</strong> {job.location.address}
                        </span>
                        <span>
                          <strong>Budget:</strong> R{job.budget.min} - R{job.budget.max}
                        </span>
                        <span>
                          <strong>Platform Fee:</strong> R{job.platformFee}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(job.status)} variant="secondary">
                        <div className="flex items-center gap-1">
                          {getStatusIcon(job.status)}
                          <span className="capitalize">{job.status.replace("-", " ")}</span>
                        </div>
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {job.category}
                      </Badge>
                    </div>
                  </div>

                  {job.flagged && job.flagReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-red-800">
                        <strong>Flagged:</strong> {job.flagReason}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="text-sm text-muted-foreground">
                      Created {job.createdAt.toLocaleDateString()} • Updated {job.updatedAt.toLocaleDateString()}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleJobAction(job.id, "view")}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {!job.flagged ? (
                          <DropdownMenuItem onClick={() => handleJobAction(job.id, "flag")}>
                            <Flag className="w-4 h-4 mr-2" />
                            Flag Job
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleJobAction(job.id, "unflag")}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Unflag Job
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleJobAction(job.id, "suspend")}>
                          <XCircle className="w-4 h-4 mr-2" />
                          Suspend Job
                        </DropdownMenuItem>
                        {job.flagged && (
                          <DropdownMenuItem onClick={() => handleJobAction(job.id, "resolve")}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Resolve Dispute
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}

              {filteredJobs.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">No jobs found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your search terms or filters</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default function AdminJobs() {
  return (
    <AuthGuard requiredRole="admin">
      <AdminJobsContent />
    </AuthGuard>
  )
}
