"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock,
  Star,
  User,
  Send,
  Heart,
  Share,
  Bookmark,
  AlertCircle
} from "lucide-react"
import type { Job, JobCategory } from "@/lib/types"

interface JobApplication {
  jobId: string
  workerId: string
  proposal: string
  proposedRate: number
  estimatedDuration: number
  availableFrom: Date
  portfolio?: string[]
  questions?: { question: string; answer: string }[]
}

interface JobApplicationSystemProps {
  job: Job
  currentUserId?: string
  userRole: "employer" | "worker" | "guest"
  onApplyToJob: (application: JobApplication) => void
  onSaveJob: (jobId: string) => void
  onShareJob: (jobId: string) => void
  onReportJob: (jobId: string, reason: string) => void
  isJobSaved?: boolean
  hasApplied?: boolean
}

export function JobApplicationSystem({
  job,
  currentUserId,
  userRole,
  onApplyToJob,
  onSaveJob,
  onShareJob,
  onReportJob,
  isJobSaved = false,
  hasApplied = false,
}: JobApplicationSystemProps) {
  const [isApplying, setIsApplying] = useState(false)
  const [application, setApplication] = useState<Partial<JobApplication>>({
    proposal: "",
    proposedRate: job.budget.min,
    estimatedDuration: job.duration.estimated,
    availableFrom: new Date(),
    portfolio: [],
    questions: [],
  })
  const [reportReason, setReportReason] = useState("")
  const [isReporting, setIsReporting] = useState(false)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  const handleApply = () => {
    if (application.proposal && application.proposedRate && currentUserId) {
      onApplyToJob({
        jobId: job.id,
        workerId: currentUserId,
        proposal: application.proposal,
        proposedRate: application.proposedRate,
        estimatedDuration: application.estimatedDuration || job.duration.estimated,
        availableFrom: application.availableFrom || new Date(),
        portfolio: application.portfolio,
        questions: application.questions,
      } as JobApplication)
      setIsApplying(false)
    }
  }

  const handleReport = () => {
    if (reportReason.trim()) {
      onReportJob(job.id, reportReason)
      setReportReason("")
      setIsReporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Job Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{job.title}</h1>
                <Badge variant="outline" className="capitalize">
                  {job.category.replace("-", " ")}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location.address}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {job.scheduledFor ? formatDate(job.scheduledFor) : "Flexible timing"}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {job.duration.estimated} hours {job.duration.flexible && "(flexible)"}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-600">
                    R{job.budget.min} - R{job.budget.max}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Posted {getTimeAgo(job.createdAt)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSaveJob(job.id)}
                className={isJobSaved ? "text-red-500" : ""}
              >
                <Heart className={`w-4 h-4 ${isJobSaved ? "fill-current" : ""}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onShareJob(job.id)}>
                <Share className="w-4 h-4" />
              </Button>
              <Dialog open={isReporting} onOpenChange={setIsReporting}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <AlertCircle className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Report Job</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      placeholder="Please describe why you're reporting this job..."
                      rows={4}
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsReporting(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleReport} variant="destructive">
                        Report Job
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Job Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
            </div>

            {job.requirements.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Requirements</h3>
                <ul className="space-y-1">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.images && job.images.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {job.images.map((image, index) => (
                    <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                      <img src={image} alt={`Job image ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Application Section */}
      {userRole === "worker" && (
        <Card>
          <CardHeader>
            <CardTitle>Apply for this Job</CardTitle>
          </CardHeader>
          <CardContent>
            {hasApplied ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-green-600 mb-2">Application Submitted</h3>
                <p className="text-muted-foreground">
                  You&apos;ve already applied for this job. The employer will review your application and get back to you.
                </p>
              </div>
            ) : job.status === "posted" ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Submit a proposal to apply for this job. Make sure to highlight your relevant experience and explain why you&apos;re the right fit.
                </p>
                
                <Dialog open={isApplying} onOpenChange={setIsApplying}>
                  <DialogTrigger asChild>
                    <Button className="w-full">Apply Now</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Apply for: {job.title}</DialogTitle>
                    </DialogHeader>
                    
                    <ScrollArea className="max-h-96">
                      <div className="space-y-4 pr-4">
                        <div>
                          <label className="text-sm font-medium">Your Proposal</label>
                          <Textarea
                            value={application.proposal}
                            onChange={(e) => setApplication(prev => ({ ...prev, proposal: e.target.value }))}
                            placeholder="Explain why you're the perfect fit for this job. Include your relevant experience, approach, and timeline..."
                            rows={6}
                            className="mt-1"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Your Rate (ZAR)</label>
                            <Input
                              type="number"
                              value={application.proposedRate}
                              onChange={(e) => setApplication(prev => ({ ...prev, proposedRate: parseFloat(e.target.value) }))}
                              min={job.budget.min}
                              max={job.budget.max}
                              className="mt-1"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Budget range: R{job.budget.min} - R{job.budget.max}
                            </p>
                          </div>

                          <div>
                            <label className="text-sm font-medium">Estimated Duration (hours)</label>
                            <Input
                              type="number"
                              value={application.estimatedDuration}
                              onChange={(e) => setApplication(prev => ({ ...prev, estimatedDuration: parseFloat(e.target.value) }))}
                              className="mt-1"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Available From</label>
                          <Input
                            type="date"
                            value={application.availableFrom?.toISOString().split('T')[0]}
                            onChange={(e) => setApplication(prev => ({ ...prev, availableFrom: new Date(e.target.value) }))}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">Portfolio (Optional)</label>
                          <Button variant="outline" className="w-full mt-1">
                            <Bookmark className="w-4 h-4 mr-2" />
                            Add Portfolio Items
                          </Button>
                          <p className="text-xs text-muted-foreground mt-1">
                            Showcase relevant work examples to strengthen your application
                          </p>
                        </div>
                      </div>
                    </ScrollArea>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button variant="outline" onClick={() => setIsApplying(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleApply}
                        disabled={!application.proposal || !application.proposedRate}
                      >
                        Submit Application
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-muted-foreground mb-2">Job No Longer Available</h3>
                <p className="text-muted-foreground">
                  This job has been {job.status === "assigned" ? "assigned to another worker" : job.status}.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Employer Info */}
      <Card>
        <CardHeader>
          <CardTitle>About the Employer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <Avatar className="w-12 h-12">
              <AvatarFallback>E</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div>
                <h4 className="font-medium">Employer</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span>4.8 rating</span>
                  </div>
                  <span>•</span>
                  <span>23 jobs posted</span>
                  <span>•</span>
                  <span>Member since 2023</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Reliable employer with a track record of successful job completions. 
                Clear communication and fair payment practices.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Similar Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Similar Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div>
                  <h4 className="font-medium text-sm">House Cleaning Service</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>R200 - R400</span>
                    <span>•</span>
                    <span>Johannesburg</span>
                    <span>•</span>
                    <span>2 hours ago</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  cleaning
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
