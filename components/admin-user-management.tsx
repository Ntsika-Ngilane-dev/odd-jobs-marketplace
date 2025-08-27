"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Shield, 
  ShieldCheck, 
  ShieldX,
  Ban, 
  UserCheck, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  Star,
  Briefcase,
  Eye,
  Edit,
  Trash2
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { User } from "@/lib/types"

interface AdminUser extends User {
  lastActive: Date
  totalEarnings?: number
  totalSpent?: number
  flaggedReports: number
  accountStatus: "active" | "suspended" | "banned"
  verificationStatus: "pending" | "verified" | "rejected"
  joinedDate: Date
}

interface AdminUserManagementProps {
  users: AdminUser[]
  onVerifyUser: (userId: string) => void
  onSuspendUser: (userId: string, reason: string) => void
  onBanUser: (userId: string, reason: string) => void
  onReactivateUser: (userId: string) => void
  onSendMessage: (userId: string, message: string) => void
  onViewUserDetails: (userId: string) => void
}

export function AdminUserManagement({
  users,
  onVerifyUser,
  onSuspendUser,
  onBanUser,
  onReactivateUser,
  onSendMessage,
  onViewUserDetails,
}: AdminUserManagementProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | "employer" | "worker">("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended" | "banned">("all")
  const [verificationFilter, setVerificationFilter] = useState<"all" | "pending" | "verified" | "rejected">("all")
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [actionReason, setActionReason] = useState("")
  const [messageContent, setMessageContent] = useState("")

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.accountStatus === statusFilter
    const matchesVerification = verificationFilter === "all" || user.verificationStatus === verificationFilter

    return matchesSearch && matchesRole && matchesStatus && matchesVerification
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "suspended":
        return "bg-yellow-100 text-yellow-800"
      case "banned":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <ShieldCheck className="w-4 h-4 text-green-500" />
      case "rejected":
        return <ShieldX className="w-4 h-4 text-red-500" />
      case "pending":
        return <Shield className="w-4 h-4 text-yellow-500" />
      default:
        return <Shield className="w-4 h-4 text-gray-500" />
    }
  }

  const formatLastActive = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return `${Math.floor(days / 30)} months ago`
  }

  const handleSuspendUser = (user: AdminUser) => {
    if (actionReason.trim()) {
      onSuspendUser(user.id, actionReason)
      setActionReason("")
      setSelectedUser(null)
    }
  }

  const handleBanUser = (user: AdminUser) => {
    if (actionReason.trim()) {
      onBanUser(user.id, actionReason)
      setActionReason("")
      setSelectedUser(null)
    }
  }

  const handleSendMessage = (user: AdminUser) => {
    if (messageContent.trim()) {
      onSendMessage(user.id, messageContent)
      setMessageContent("")
      setSelectedUser(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={roleFilter} onValueChange={(value: any) => setRoleFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="employer">Employers</SelectItem>
                <SelectItem value="worker">Workers</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>

            <Select value={verificationFilter} onValueChange={(value: any) => setVerificationFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            <div className="space-y-1 p-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.profilePhoto} />
                      <AvatarFallback>
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{user.firstName} {user.lastName}</h4>
                        {getVerificationIcon(user.verificationStatus)}
                        <Badge variant="outline" className="text-xs">
                          {user.role}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Joined {new Intl.DateTimeFormat("en-US", {
                            year: "numeric",
                            month: "short",
                          }).format(user.joinedDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {user.completedJobs} jobs
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {user.rating.toFixed(1)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(user.accountStatus)}>
                          {user.accountStatus}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Last active: {formatLastActive(user.lastActive)}
                        </span>
                        {user.flaggedReports > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {user.flaggedReports} reports
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {user.role === "worker" && user.totalEarnings && (
                      <div className="text-right text-sm">
                        <p className="font-medium">R{user.totalEarnings.toLocaleString()}</p>
                        <p className="text-muted-foreground">earned</p>
                      </div>
                    )}
                    
                    {user.role === "employer" && user.totalSpent && (
                      <div className="text-right text-sm">
                        <p className="font-medium">R{user.totalSpent.toLocaleString()}</p>
                        <p className="text-muted-foreground">spent</p>
                      </div>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewUserDetails(user.id)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Message
                        </DropdownMenuItem>

                        {user.verificationStatus === "pending" && (
                          <DropdownMenuItem onClick={() => onVerifyUser(user.id)}>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Verify User
                          </DropdownMenuItem>
                        )}

                        {user.accountStatus === "active" && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => setSelectedUser(user)}
                              className="text-yellow-600"
                            >
                              <Ban className="w-4 h-4 mr-2" />
                              Suspend User
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setSelectedUser(user)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Ban User
                            </DropdownMenuItem>
                          </>
                        )}

                        {(user.accountStatus === "suspended" || user.accountStatus === "banned") && (
                          <DropdownMenuItem 
                            onClick={() => onReactivateUser(user.id)}
                            className="text-green-600"
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Reactivate User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Action Dialogs */}
      {selectedUser && (
        <>
          {/* Send Message Dialog */}
          <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Message to {selectedUser.firstName} {selectedUser.lastName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full h-32 p-3 border rounded-lg resize-none"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedUser(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleSendMessage(selectedUser)}>
                    Send Message
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Suspend User Dialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="hidden" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Suspend User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to suspend {selectedUser.firstName} {selectedUser.lastName}? 
                  Please provide a reason for this action.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="my-4">
                <Input
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="Reason for suspension..."
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSelectedUser(null)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => handleSuspendUser(selectedUser)}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  Suspend User
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Ban User Dialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="hidden" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Ban User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to permanently ban {selectedUser.firstName} {selectedUser.lastName}? 
                  This action cannot be easily undone. Please provide a reason.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="my-4">
                <Input
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="Reason for ban..."
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSelectedUser(null)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => handleBanUser(selectedUser)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Ban User
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  )
}
