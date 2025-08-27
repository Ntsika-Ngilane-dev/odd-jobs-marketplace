"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { JobCard } from "@/components/job-card"
import { JobFilters } from "@/components/job-filters"
import { JobMap } from "@/components/job-map"
import { Search, MapPin, Filter } from "lucide-react"
import type { Job } from "@/lib/types"
import type { User } from "@/lib/local-db"

// Mock available jobs data
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
  {
    id: "7",
    title: "Garden Landscaping",
    description: "Complete garden makeover including new plants and irrigation system",
    category: "gardening",
    location: { address: "Sandton, Johannesburg" },
    budget: { min: 1500, max: 2500, currency: "ZAR" },
    duration: { estimated: 16, flexible: true },
    requirements: ["Landscaping experience", "Plant knowledge", "Irrigation skills"],
    status: "posted",
    employerId: "emp4",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "8",
    title: "House Painting",
    description: "Interior painting of 2-bedroom apartment",
    category: "painting",
    location: { address: "Rosebank, Johannesburg" },
    budget: { min: 800, max: 1200, currency: "ZAR" },
    duration: { estimated: 8, flexible: false },
    requirements: ["Painting experience", "Own equipment", "References"],
    status: "posted",
    employerId: "emp5",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

function WorkerJobsContent() {
  const [jobs] = useState<Job[]>(mockAvailableJobs)
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockAvailableJobs)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<string>()
  const [currentUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("currentUser")
      return userData ? JSON.parse(userData) : null
    }
    return null
  })

  const mapJobs = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    address: job.location.address,
    lat: -26.2041 + (Math.random() - 0.5) * 0.1, // Mock coordinates around Johannesburg
    lng: 28.0473 + (Math.random() - 0.5) * 0.1,
    category: job.category,
    budget: job.budget.max,
    urgency: job.duration.flexible ? "low" : ("medium" as "low" | "medium" | "high"),
  }))

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(term.toLowerCase()) ||
        job.description.toLowerCase().includes(term.toLowerCase()) ||
        job.category.toLowerCase().includes(term.toLowerCase()) ||
        job.location.address.toLowerCase().includes(term.toLowerCase()),
    )
    setFilteredJobs(filtered)
  }

  const handleFilter = (filters: any) => {
    let filtered = jobs

    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter((job) => job.category === filters.category)
    }

    if (filters.minBudget) {
      filtered = filtered.filter((job) => job.budget.max >= filters.minBudget)
    }

    if (filters.maxBudget) {
      filtered = filtered.filter((job) => job.budget.min <= filters.maxBudget)
    }

    if (filters.location) {
      filtered = filtered.filter((job) => job.location.address.toLowerCase().includes(filters.location.toLowerCase()))
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
    alert(`Viewing job: ${job.title}`)
  }

  const handleApplyJob = (job: Job) => {
    console.log("[v0] Apply to job:", job.id)
    alert(`Applied to job: ${job.title}`)
  }

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId)
    const selectedJob = jobs.find((job) => job.id === jobId)
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Find Jobs</h2>
            <p className="text-muted-foreground">Discover new job opportunities near you</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowMap(!showMap)} className="sm:w-auto">
              <MapPin className="w-4 h-4 mr-2" />
              {showMap ? "Hide Map" : "Show Map"}
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search jobs by title, category, or location..."
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
                <JobFilters onFiltersChange={handleFilter} userRole="worker" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Map View */}
        {showMap && (
          <JobMap
            jobs={mapJobs}
            selectedJob={selectedJobId}
            onJobSelect={handleJobSelect}
            className="animate-slide-in-left"
          />
        )}

        {/* Job Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{filteredJobs.length}</div>
              <p className="text-sm text-muted-foreground">Available Jobs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">
                {filteredJobs.filter((j) => j.budget.max >= 500).length}
              </div>
              <p className="text-sm text-muted-foreground">High Paying</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {filteredJobs.filter((j) => j.duration.flexible).length}
              </div>
              <p className="text-sm text-muted-foreground">Flexible</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {filteredJobs.filter((j) => j.location.address.includes("Johannesburg")).length}
              </div>
              <p className="text-sm text-muted-foreground">Near You</p>
            </CardContent>
          </Card>
        </div>

        {/* Jobs List */}
        <Card>
          <CardHeader>
            <CardTitle>Available Jobs ({filteredJobs.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                userRole="worker"
                onViewDetails={handleViewJob}
                onApply={handleApplyJob}
              />
            ))}
            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">No jobs found</p>
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? "Try adjusting your search terms or filters" : "Check back later for new opportunities"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default function WorkerJobs() {
  return (
    <AuthGuard requiredRole="worker">
      <WorkerJobsContent />
    </AuthGuard>
  )
}
