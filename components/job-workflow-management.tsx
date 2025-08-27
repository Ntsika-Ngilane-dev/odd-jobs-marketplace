"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  MapPin,
  Calendar,
  DollarSign,
  User,
  MessageCircle,
  Phone,
  Star,
  Camera,
  FileText,
  Upload
} from "lucide-react"
import type { Job, JobStatus } from "@/lib/types"

interface JobWorkflow extends Job {
  applicants?: {
    id: string
    name: string
    rating: number
    hourlyRate: number
    profilePhoto?: string
    appliedAt: Date
    proposal: string
  }[]
  milestones?: {
    id: string
    title: string
    description: string
    amount: number
    status: "pending" | "in_progress" | "completed" | "disputed"
    dueDate: Date
    completedAt?: Date
  }[]
  workProgress?: {
    percentage: number
    lastUpdate: Date
    notes: string
    photos?: string[]
  }
  disputes?: {
    id: string
    type: "quality" | "payment" | "scope" | "timeline"
    description: string
    status: "open" | "resolved"
    createdAt: Date
  }[]
}

interface JobWorkflowManagementProps {
  job: JobWorkflow
  currentUserRole: "employer" | "worker"
  onUpdateJobStatus: (jobId: string, status: JobStatus) => void
  onAcceptApplicant: (jobId: string, workerId: string) => void
  onRejectApplicant: (jobId: string, workerId: string) => void
  onSubmitWork: (jobId: string, notes: string, photos: string[]) => void
  onApproveWork: (jobId: string) => void
  onRequestRevision: (jobId: string, feedback: string) => void
  onCompleteJob: (jobId: string, rating: number, review: string) => void
  onCancelJob: (jobId: string, reason: string) => void
  onCreateDispute: (jobId: string, type: string, description: string) => void
}

export function JobWorkflowManagement({
  job,
  currentUserRole,
  onUpdateJobStatus,
  onAcceptApplicant,
  onRejectApplicant,
  onSubmitWork,
  onApproveWork,
  onRequestRevision,
  onCompleteJob,
  onCancelJob,
  onCreateDispute,
}: JobWorkflowManagementProps) {
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null)
  const [workNotes, setWorkNotes] = useState("")
  const [workPhotos, setWorkPhotos] = useState<string[]>([])
  const [revisionFeedback, setRevisionFeedback] = useState("")
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState("")
  const [cancelReason, setCancelReason] = useState("")
  const [disputeType, setDisputeType] = useState("")
  const [disputeDescription, setDisputeDescription] = useState("")

  const getStatusColor = (status: JobStatus) => {
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

  const getStatusIcon = (status: JobStatus) => {
    switch (status) {
      case "posted":
        return <Clock className="w-4 h-4" />
      case "assigned":
        return <User className="w-4 h-4" />
      case "in-progress":
        return <Clock className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const handleAcceptApplicant = (applicant: any) => {
    onAcceptApplicant(job.id, applicant.id)
    setSelectedApplicant(null)
  }

  const handleSubmitWork = () => {
    if (workNotes.trim()) {
      onSubmitWork(job.id, workNotes, workPhotos)
      setWorkNotes("")
      setWorkPhotos([])
    }
  }

  const handleRequestRevision = () => {
    if (revisionFeedback.trim()) {
      onRequestRevision(job.id, revisionFeedback)
      setRevisionFeedback("")
    }
  }

  const handleCompleteJob = () => {
    if (review.trim()) {
      onCompleteJob(job.id, rating, review)
      setRating(5)
      setReview("")
    }
  }

  const handleCancelJob = () => {
    if (cancelReason.trim()) {
      onCancelJob(job.id, cancelReason)
      setCancelReason("")
    }
  }

  const handleCreateDispute = () => {
    if (disputeType && disputeDescription.trim()) {
      onCreateDispute(job.id, disputeType, disputeDescription)
      setDisputeType("")
      setDisputeDescription("")
    }
  }

  return (
    <div className="space-y-6">
      {/* Job Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location.address}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {job.scheduledFor ? formatDate(job.scheduledFor) : "Flexible"}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  R{job.budget.min} - R{job.budget.max}
                </div>
              </div>
            </div>
            <Badge className={getStatusColor(job.status)}>
              {getStatusIcon(job.status)}
              <span className="ml-1 capitalize">{job.status.replace("-", " ")}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{job.description}</p>
          
          {job.workProgress && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">{job.workProgress.percentage}%</span>
              </div>
              <Progress value={job.workProgress.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Last updated: {formatDate(job.workProgress.lastUpdate)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applicants">Applicants</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="disputes">Disputes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium">Category:</span>
                  <span className="ml-2 text-muted-foreground">{job.category}</span>
                </div>
                <div>
                  <span className="font-medium">Duration:</span>
                  <span className="ml-2 text-muted-foreground">
                    {job.duration.estimated} hours {job.duration.flexible && "(flexible)"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Requirements:</span>
                  <ul className="ml-2 mt-1 space-y-1">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="text-sm text-muted-foreground">• {req}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {job.status === "posted" && currentUserRole === "employer" && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => onUpdateJobStatus(job.id, "cancelled")}
                  >
                    Cancel Job Posting
                  </Button>
                )}

                {job.status === "assigned" && currentUserRole === "worker" && (
                  <Button 
                    className="w-full"
                    onClick={() => onUpdateJobStatus(job.id, "in-progress")}
                  >
                    Start Working
                  </Button>
                )}

                {job.status === "in-progress" && currentUserRole === "worker" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">Submit Work</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Submit Work</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Work Notes</label>
                          <Textarea
                            value={workNotes}
                            onChange={(e) => setWorkNotes(e.target.value)}
                            placeholder="Describe the work completed..."
                            rows={4}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Photos (Optional)</label>
                          <Button variant="outline" className="w-full mt-2">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Photos
                          </Button>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline">Cancel</Button>
                          <Button onClick={handleSubmitWork}>Submit Work</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {job.status === "in-progress" && currentUserRole === "employer" && (
                  <div className="space-y-2">
                    <Button 
                      className="w-full"
                      onClick={() => onApproveWork(job.id)}
                    >
                      Approve Work
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">Request Revision</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Request Revision</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            value={revisionFeedback}
                            onChange={(e) => setRevisionFeedback(e.target.value)}
                            placeholder="Explain what needs to be revised..."
                            rows={4}
                          />
                          <div className="flex justify-end gap-2">
                            <Button variant="outline">Cancel</Button>
                            <Button onClick={handleRequestRevision}>Request Revision</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full text-red-600">
                      Create Dispute
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Dispute</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Dispute Type</label>
                        <select
                          value={disputeType}
                          onChange={(e) => setDisputeType(e.target.value)}
                          className="w-full mt-1 p-2 border rounded-lg"
                        >
                          <option value="">Select type...</option>
                          <option value="quality">Work Quality</option>
                          <option value="payment">Payment Issue</option>
                          <option value="scope">Scope Change</option>
                          <option value="timeline">Timeline Issue</option>
                        </select>
                      </div>
                      <Textarea
                        value={disputeDescription}
                        onChange={(e) => setDisputeDescription(e.target.value)}
                        placeholder="Describe the issue..."
                        rows={4}
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button onClick={handleCreateDispute}>Create Dispute</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">Cancel Job</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Job</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to cancel this job? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="my-4">
                      <Textarea
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Reason for cancellation..."
                        rows={3}
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCancelJob}>
                        Cancel Job
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applicants" className="space-y-4">
          {job.applicants && job.applicants.length > 0 ? (
            <div className="space-y-4">
              {job.applicants.map((applicant) => (
                <Card key={applicant.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{applicant.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              {applicant.rating.toFixed(1)}
                            </div>
                            <span>R{applicant.hourlyRate}/hour</span>
                          </div>
                          <p className="text-sm mt-2">{applicant.proposal}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Applied {formatDate(applicant.appliedAt)}
                          </p>
                        </div>
                      </div>
                      
                      {currentUserRole === "employer" && job.status === "posted" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedApplicant(applicant)}
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAcceptApplicant(applicant)}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onRejectApplicant(job.id, applicant.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-muted-foreground mb-2">No applicants yet</h3>
                <p className="text-sm text-muted-foreground">
                  Applications will appear here once workers apply for this job.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          {job.workProgress ? (
            <Card>
              <CardHeader>
                <CardTitle>Work Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">{job.workProgress.percentage}%</span>
                  </div>
                  <Progress value={job.workProgress.percentage} className="h-3" />
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Latest Update</h4>
                  <p className="text-sm bg-muted p-3 rounded-lg">{job.workProgress.notes}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Updated {formatDate(job.workProgress.lastUpdate)}
                  </p>
                </div>

                {job.workProgress.photos && job.workProgress.photos.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Progress Photos</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {job.workProgress.photos.map((photo, index) => (
                        <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                          <img src={photo} alt={`Progress ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-muted-foreground mb-2">No progress updates yet</h3>
                <p className="text-sm text-muted-foreground">
                  Progress updates will appear here once work begins.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          {job.milestones && job.milestones.length > 0 ? (
            <div className="space-y-4">
              {job.milestones.map((milestone) => (
                <Card key={milestone.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{milestone.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span>R{milestone.amount.toLocaleString()}</span>
                          <span>Due: {formatDate(milestone.dueDate)}</span>
                          {milestone.completedAt && (
                            <span className="text-green-600">
                              Completed: {formatDate(milestone.completedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge className={getStatusColor(milestone.status as any)}>
                        {milestone.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-muted-foreground mb-2">No milestones set</h3>
                <p className="text-sm text-muted-foreground">
                  Milestones help track progress and payments for larger jobs.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="disputes" className="space-y-4">
          {job.disputes && job.disputes.length > 0 ? (
            <div className="space-y-4">
              {job.disputes.map((dispute) => (
                <Card key={dispute.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <h4 className="font-medium capitalize">{dispute.type.replace("_", " ")} Dispute</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{dispute.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Created {formatDate(dispute.createdAt)}
                        </p>
                      </div>
                      <Badge variant={dispute.status === "open" ? "destructive" : "secondary"}>
                        {dispute.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-muted-foreground mb-2">No disputes</h3>
                <p className="text-sm text-muted-foreground">
                  Great! This job has no active disputes.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
