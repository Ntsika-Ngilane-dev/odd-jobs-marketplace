"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, DollarSign, User } from "lucide-react"
import type { Job } from "@/lib/types"
import { JOB_CATEGORIES } from "@/lib/types"

interface JobCardProps {
  job: Job
  userRole: "employer" | "worker" | "admin"
  onViewDetails: (job: Job) => void
  onApply?: (job: Job) => void
  onEdit?: (job: Job) => void
  onDelete?: (job: Job) => void
}

export function JobCard({ job, userRole, onViewDetails, onApply, onEdit, onDelete }: JobCardProps) {
  const category = JOB_CATEGORIES[job.category]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "posted":
        return "bg-blue-100 text-blue-800"
      case "assigned":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-orange-100 text-orange-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{category.icon}</span>
            <div>
              <CardTitle className="text-lg">{job.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{category.label}</p>
            </div>
          </div>
          <Badge className={getStatusColor(job.status)}>{job.status.replace("-", " ")}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{job.location.address}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{job.duration.estimated}h</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-primary font-semibold">
            <DollarSign className="w-4 h-4" />
            <span>
              R{job.budget.min} - R{job.budget.max}
            </span>
          </div>

          {job.workerId && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>Assigned</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => onViewDetails(job)} className="flex-1">
            View Details
          </Button>

          {userRole === "worker" && job.status === "posted" && onApply && (
            <Button size="sm" onClick={() => onApply(job)} className="flex-1">
              Apply
            </Button>
          )}

          {userRole === "employer" && onEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(job)}>
              Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
