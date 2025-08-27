"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { JobCard } from "@/components/job-card"
import { JobFilters } from "@/components/job-filters"
import { Plus, Search, Filter } from "lucide-react"
import type { Job } from "@/lib/types"
import type { User } from "@/lib/local-db"

// Mock data - expanded job list
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
  {
    id: "6",
    title: "Office Deep Clean",
    description: "Monthly deep cleaning of office space including carpets and windows",
    category: "cleaning",
    location: { address: "Midrand, Johannesburg" },
    budget: { min: 800, max: 1200, currency: "ZAR" },
    duration: { estimated: 6, flexible: true },
    requirements: ["Commercial cleaning experience", "Insurance coverage"],
    status: "completed",
    employerId: "emp1",
    workerId: "worker2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

function EmployerJobsContent() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs)
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [currentUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("currentUser")
      return userData ? JSON.parse(userData) : null
    }
    return null
  })

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(term.toLowerCase()) ||
        job.description.toLowerCase().includes(term.toLowerCase()) ||
        job.category.toLowerCase().includes(term.toLowerCase()),
    )
    setFilteredJobs(filtered)
  }

  const handleFilter = (filters: any) => {
    let filtered = jobs

    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter((job) => job.status === filters.status)
    }

    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter((job) => job.category === filters.category)
    }

    if (filters.minBudget) {
      filtered = filtered.filter((job) => job.budget.max >= filters.minBudget)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredJobs(filtered)
  }

  const handleViewJob = (job: Job) => {
    console.log("[v0] View job details:", job.id)
    // TODO: Navigate to job details page
    alert(`Viewing job: ${job.title}`)
  }

  const handleEditJob = (job: Job) => {
    console.log("[v0] Edit job:", job.id)
    // TODO: Navigate to edit job page
    alert(`Edit job: ${job.title}`)
  }

  const handleDeleteJob = (job: Job) => {
    if (confirm(`Are you sure you want to delete "${job.title}"?`)) {
      const updatedJobs = jobs.filter((j) => j.id !== job.id)
      setJobs(updatedJobs)
      setFilteredJobs(
        updatedJobs.filter(
          (j) =>
            !searchTerm ||
            j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            j.description.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
      console.log("[v0] Job deleted:", job.id)
    }
  }

  return (
    <DashboardLayout
      userRole="employer"
      userName={currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Employer"}
      notifications={3}
    >
      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">My Jobs</h2>
            <p className="text-muted-foreground">Manage all your posted jobs</p>
          </div>
          <Button onClick={() => (window.location.href = "/employer/post-job")}>
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="sm:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-border">
                <JobFilters onFilterChange={handleFilter} userRole="employer" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Job Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{jobs.length}</div>
              <p className="text-sm text-muted-foreground">Total Jobs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{jobs.filter((j) => j.status === "posted").length}</div>
              <p className="text-sm text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {jobs.filter((j) => j.status === "assigned" || j.status === "in-progress").length}
              </div>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {jobs.filter((j) => j.status === "completed").length}
              </div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Jobs List */}
        <Card>
          <CardHeader>
            <CardTitle>Jobs ({filteredJobs.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                userRole="employer"
                onViewDetails={handleViewJob}
                onEdit={handleEditJob}
                onDelete={handleDeleteJob}
              />
            ))}
            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">No jobs found</p>
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? "Try adjusting your search terms" : "Start by posting your first job"}
                </p>
                {!searchTerm && (
                  <Button className="mt-4" onClick={() => (window.location.href = "/employer/post-job")}>
                    Post Your First Job
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

export default function EmployerJobs() {
  return (
    <AuthGuard requiredRole="employer">
      <EmployerJobsContent />
    </AuthGuard>
  )
}
