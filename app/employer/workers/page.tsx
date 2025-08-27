"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Star, MapPin, MessageCircle } from "lucide-react"
import type { User } from "@/lib/local-db"

interface Worker {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  categories: string[]
  rating: number
  completedJobs: number
  hourlyRate: number
  availability: "available" | "busy" | "offline"
  bio: string
  skills: string[]
  verified: boolean
}

// Mock worker data
const mockWorkers: Worker[] = [
  {
    id: "w1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    phone: "+27 82 123 4567",
    location: "Sandton, Johannesburg",
    categories: ["cleaning", "handyman"],
    rating: 4.8,
    completedJobs: 45,
    hourlyRate: 120,
    availability: "available",
    bio: "Experienced cleaner and handyman with 5+ years in residential and commercial properties.",
    skills: ["Deep cleaning", "Plumbing", "Electrical work", "Painting"],
    verified: true,
  },
  {
    id: "w2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@email.com",
    phone: "+27 83 987 6543",
    location: "Rosebank, Johannesburg",
    categories: ["gardening", "landscaping"],
    rating: 4.9,
    completedJobs: 32,
    hourlyRate: 100,
    availability: "available",
    bio: "Professional gardener specializing in landscape design and maintenance.",
    skills: ["Landscape design", "Plant care", "Irrigation", "Tree pruning"],
    verified: true,
  },
  {
    id: "w3",
    firstName: "Mike",
    lastName: "Williams",
    email: "mike.w@email.com",
    phone: "+27 84 555 7890",
    location: "Midrand, Johannesburg",
    categories: ["moving", "packing"],
    rating: 4.6,
    completedJobs: 28,
    hourlyRate: 80,
    availability: "busy",
    bio: "Reliable moving and packing specialist with own transport and equipment.",
    skills: ["Furniture moving", "Packing", "Loading", "Assembly"],
    verified: true,
  },
]

function EmployerWorkersContent() {
  const [workers] = useState<Worker[]>(mockWorkers)
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>(mockWorkers)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [currentUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("currentUser")
      return userData ? JSON.parse(userData) : null
    }
    return null
  })

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterWorkers(term, selectedCategory)
  }

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
    filterWorkers(searchTerm, category)
  }

  const filterWorkers = (search: string, category: string) => {
    let filtered = workers

    if (search) {
      filtered = filtered.filter(
        (worker) =>
          worker.firstName.toLowerCase().includes(search.toLowerCase()) ||
          worker.lastName.toLowerCase().includes(search.toLowerCase()) ||
          worker.skills.some((skill) => skill.toLowerCase().includes(search.toLowerCase())) ||
          worker.location.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (category !== "all") {
      filtered = filtered.filter((worker) => worker.categories.includes(category))
    }

    setFilteredWorkers(filtered)
  }

  const handleContactWorker = (worker: Worker) => {
    console.log("[v0] Contact worker:", worker.id)
    // TODO: Open messaging interface
    alert(`Contacting ${worker.firstName} ${worker.lastName}`)
  }

  const handleViewProfile = (worker: Worker) => {
    console.log("[v0] View worker profile:", worker.id)
    // TODO: Navigate to worker profile page
    alert(`Viewing profile: ${worker.firstName} ${worker.lastName}`)
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-100 text-green-800"
      case "busy":
        return "bg-yellow-100 text-yellow-800"
      case "offline":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const categories = ["all", "cleaning", "handyman", "gardening", "moving", "painting", "plumbing"]

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
            <h2 className="text-3xl font-bold text-foreground">Browse Workers</h2>
            <p className="text-muted-foreground">Find skilled professionals for your jobs</p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search workers by name, skills, or location..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryFilter(category)}
                    className="capitalize"
                  >
                    {category === "all" ? "All Categories" : category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkers.map((worker) => (
            <Card key={worker.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {worker.firstName[0]}
                        {worker.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {worker.firstName} {worker.lastName}
                      </h3>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{worker.rating}</span>
                        <span className="text-muted-foreground">({worker.completedJobs} jobs)</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getAvailabilityColor(worker.availability)} variant="secondary">
                    {worker.availability}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{worker.location}</span>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{worker.bio}</p>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {worker.categories.map((category) => (
                      <Badge key={category} variant="outline" className="text-xs capitalize">
                        {category}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {worker.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {worker.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{worker.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="text-sm">
                    <span className="font-semibold text-primary">R{worker.hourlyRate}/hr</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleViewProfile(worker)}>
                      View Profile
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleContactWorker(worker)}
                      disabled={worker.availability === "offline"}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Contact
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredWorkers.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No workers found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search terms or category filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

export default function EmployerWorkers() {
  return (
    <AuthGuard requiredRole="employer">
      <EmployerWorkersContent />
    </AuthGuard>
  )
}
