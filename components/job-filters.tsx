"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, MapPin, DollarSign } from "lucide-react"
import type { JobCategory, JobStatus } from "@/lib/types"
import { JOB_CATEGORIES } from "@/lib/types"

interface JobFiltersProps {
  onFiltersChange: (filters: JobFilters) => void
  userRole: "employer" | "worker" | "admin"
}

export interface JobFilters {
  search: string
  category: JobCategory | "all"
  status: JobStatus | "all"
  location: string
  budgetMin: number
  budgetMax: number
  sortBy: "newest" | "oldest" | "budget-high" | "budget-low" | "distance"
}

export function JobFilters({ onFiltersChange, userRole }: JobFiltersProps) {
  const [filters, setFilters] = useState<JobFilters>({
    search: "",
    category: "all",
    status: "all",
    location: "",
    budgetMin: 0,
    budgetMax: 10000,
    sortBy: "newest",
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const updateFilters = (newFilters: Partial<JobFilters>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFiltersChange(updated)
  }

  const clearFilters = () => {
    const cleared: JobFilters = {
      search: "",
      category: "all",
      status: "all",
      location: "",
      budgetMin: 0,
      budgetMax: 10000,
      sortBy: "newest",
    }
    setFilters(cleared)
    onFiltersChange(cleared)
  }

  const hasActiveFilters = filters.search || filters.category !== "all" || filters.status !== "all" || filters.location

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* Quick Filters */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Category</Label>
            <Select
              value={filters.category}
              onValueChange={(value: JobCategory | "all") => updateFilters({ category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(JOB_CATEGORIES).map(([key, category]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value: JobStatus | "all") => updateFilters({ status: value })}
            >
              <SelectTrigger>
                <SelectValue />
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
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <Button variant="ghost" size="sm" onClick={() => setShowAdvanced(!showAdvanced)} className="w-full">
          {showAdvanced ? "Hide" : "Show"} Advanced Filters
        </Button>

        {showAdvanced && (
          <div className="space-y-4 pt-2 border-t">
            {/* Location */}
            <div>
              <Label>Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Enter location..."
                  value={filters.location}
                  onChange={(e) => updateFilters({ location: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <Label>Budget Range (ZAR)</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.budgetMin || ""}
                    onChange={(e) => updateFilters({ budgetMin: Number(e.target.value) || 0 })}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.budgetMax || ""}
                    onChange={(e) => updateFilters({ budgetMax: Number(e.target.value) || 10000 })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <Label>Sort By</Label>
              <Select value={filters.sortBy} onValueChange={(value: any) => updateFilters({ sortBy: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="budget-high">Highest Budget</SelectItem>
                  <SelectItem value="budget-low">Lowest Budget</SelectItem>
                  <SelectItem value="distance">Nearest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {filters.search && (
              <Badge variant="secondary">
                Search: {filters.search}
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => updateFilters({ search: "" })} />
              </Badge>
            )}
            {filters.category !== "all" && (
              <Badge variant="secondary">
                {JOB_CATEGORIES[filters.category as JobCategory]?.label}
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => updateFilters({ category: "all" })} />
              </Badge>
            )}
            {filters.status !== "all" && (
              <Badge variant="secondary">
                Status: {filters.status}
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => updateFilters({ status: "all" })} />
              </Badge>
            )}
            {filters.location && (
              <Badge variant="secondary">
                Location: {filters.location}
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => updateFilters({ location: "" })} />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
