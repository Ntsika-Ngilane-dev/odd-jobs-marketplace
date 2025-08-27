"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { 
  AlertTriangle, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Flag,
  User,
  Briefcase,
  MessageCircle,
  Shield
} from "lucide-react"

interface Report {
  id: string
  type: "user" | "job" | "payment" | "content"
  category: "harassment" | "fraud" | "inappropriate_content" | "spam" | "safety_concern" | "other"
  reporterId: string
  reporterName: string
  reportedUserId?: string
  reportedUserName?: string
  jobId?: string
  jobTitle?: string
  description: string
  evidence?: string[]
  status: "pending" | "investigating" | "resolved" | "dismissed"
  priority: "low" | "medium" | "high" | "critical"
  createdAt: Date
  updatedAt: Date
  assignedTo?: string
  resolution?: string
}

interface AdminReportsManagementProps {
  reports: Report[]
  onUpdateReportStatus: (reportId: string, status: Report["status"], resolution?: string) => void
  onAssignReport: (reportId: string, adminId: string) => void
  onViewEvidence: (evidence: string[]) => void
}

export function AdminReportsManagement({
  reports,
  onUpdateReportStatus,
  onAssignReport,
  onViewEvidence,
}: AdminReportsManagementProps) {
  const [statusFilter, setStatusFilter] = useState<"all" | Report["status"]>("all")
  const [priorityFilter, setPriorityFilter] = useState<"all" | Report["priority"]>("all")
  const [typeFilter, setTypeFilter] = useState<"all" | Report["type"]>("all")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [resolution, setResolution] = useState("")

  const filteredReports = reports.filter(report => {
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    const matchesPriority = priorityFilter === "all" || report.priority === priorityFilter
    const matchesType = typeFilter === "all" || report.type === typeFilter
    return matchesStatus && matchesPriority && matchesType
  })

  const getStatusIcon = (status: Report["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "investigating":
        return <Eye className="w-4 h-4 text-blue-500" />
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "dismissed":
        return <XCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: Report["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "investigating":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "dismissed":
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: Report["priority"]) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const getTypeIcon = (type: Report["type"]) => {
    switch (type) {
      case "user":
        return <User className="w-4 h-4" />
      case "job":
        return <Briefcase className="w-4 h-4" />
      case "content":
        return <MessageCircle className="w-4 h-4" />
      case "payment":
        return <Shield className="w-4 h-4" />
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

  const handleResolveReport = (report: Report) => {
    if (resolution.trim()) {
      onUpdateReportStatus(report.id, "resolved", resolution)
      setResolution("")
      setSelectedReport(null)
    }
  }

  const handleDismissReport = (report: Report) => {
    if (resolution.trim()) {
      onUpdateReportStatus(report.id, "dismissed", resolution)
      setResolution("")
      setSelectedReport(null)
    }
  }

  const pendingCount = reports.filter(r => r.status === "pending").length
  const investigatingCount = reports.filter(r => r.status === "investigating").length
  const criticalCount = reports.filter(r => r.priority === "critical").length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investigating</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{investigatingCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={(value: any) => setPriorityFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="user">User Reports</SelectItem>
                <SelectItem value="job">Job Reports</SelectItem>
                <SelectItem value="content">Content Reports</SelectItem>
                <SelectItem value="payment">Payment Reports</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            <div className="space-y-2 p-4">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className={`p-4 rounded-lg border-l-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                    getPriorityColor(report.priority).includes("border") ? getPriorityColor(report.priority) : "border-l-gray-300"
                  }`}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getTypeIcon(report.type)}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(report.priority)}>
                            {report.priority}
                          </Badge>
                          <Badge variant="outline">
                            {report.category.replace("_", " ")}
                          </Badge>
                          <Badge className={getStatusColor(report.status)}>
                            {getStatusIcon(report.status)}
                            <span className="ml-1">{report.status}</span>
                          </Badge>
                        </div>

                        <div>
                          <h4 className="font-medium">
                            {report.type === "user" && `User Report: ${report.reportedUserName}`}
                            {report.type === "job" && `Job Report: ${report.jobTitle}`}
                            {report.type === "content" && "Content Report"}
                            {report.type === "payment" && "Payment Report"}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Reported by {report.reporterName}
                          </p>
                        </div>

                        <p className="text-sm line-clamp-2">{report.description}</p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Created: {formatDate(report.createdAt)}</span>
                          <span>Updated: {formatDate(report.updatedAt)}</span>
                          {report.evidence && report.evidence.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {report.evidence.length} evidence files
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {report.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            onUpdateReportStatus(report.id, "investigating")
                          }}
                        >
                          Start Investigation
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedReport(report)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Report Details Dialog */}
      {selectedReport && (
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Report Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getPriorityColor(selectedReport.priority)}>
                  {selectedReport.priority}
                </Badge>
                <Badge variant="outline">
                  {selectedReport.category.replace("_", " ")}
                </Badge>
                <Badge className={getStatusColor(selectedReport.status)}>
                  {selectedReport.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Reporter</h4>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{selectedReport.reporterName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{selectedReport.reporterName}</span>
                  </div>
                </div>

                {selectedReport.reportedUserName && (
                  <div>
                    <h4 className="font-medium mb-2">Reported User</h4>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{selectedReport.reportedUserName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{selectedReport.reportedUserName}</span>
                    </div>
                  </div>
                )}
              </div>

              {selectedReport.jobTitle && (
                <div>
                  <h4 className="font-medium mb-2">Related Job</h4>
                  <p>{selectedReport.jobTitle}</p>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm bg-muted p-3 rounded-lg">{selectedReport.description}</p>
              </div>

              {selectedReport.evidence && selectedReport.evidence.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Evidence</h4>
                  <Button
                    variant="outline"
                    onClick={() => onViewEvidence(selectedReport.evidence!)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Evidence ({selectedReport.evidence.length} files)
                  </Button>
                </div>
              )}

              {selectedReport.resolution && (
                <div>
                  <h4 className="font-medium mb-2">Resolution</h4>
                  <p className="text-sm bg-muted p-3 rounded-lg">{selectedReport.resolution}</p>
                </div>
              )}

              {(selectedReport.status === "investigating" || selectedReport.status === "pending") && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Resolution Notes</h4>
                    <Textarea
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      placeholder="Enter resolution details..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline">Dismiss Report</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Dismiss Report</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to dismiss this report? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDismissReport(selectedReport)}>
                            Dismiss
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Button onClick={() => handleResolveReport(selectedReport)}>
                      Resolve Report
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
