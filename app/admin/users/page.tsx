"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, Shield, ShieldCheck, ShieldX, Eye, MessageCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { User as UserType } from "@/lib/local-db"

interface AdminUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: "employer" | "worker" | "admin"
  status: "active" | "suspended" | "pending"
  verified: boolean
  joinedAt: Date
  lastActive: Date
  completedJobs: number
  rating?: number
  location: string
}

// Mock users data
const mockUsers: AdminUser[] = [
  {
    id: "u1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    phone: "+27 82 123 4567",
    role: "worker",
    status: "active",
    verified: true,
    joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    completedJobs: 45,
    rating: 4.8,
    location: "Sandton, Johannesburg",
  },
  {
    id: "u2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@email.com",
    phone: "+27 83 987 6543",
    role: "employer",
    status: "active",
    verified: true,
    joinedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
    completedJobs: 12,
    location: "Cape Town",
  },
  {
    id: "u3",
    firstName: "Mike",
    lastName: "Williams",
    email: "mike.w@email.com",
    phone: "+27 84 555 7890",
    role: "worker",
    status: "pending",
    verified: false,
    joinedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    lastActive: new Date(Date.now() - 6 * 60 * 60 * 1000),
    completedJobs: 0,
    location: "Durban",
  },
  {
    id: "u4",
    firstName: "Jennifer",
    lastName: "Wilson",
    email: "jennifer.w@email.com",
    phone: "+27 85 111 2222",
    role: "employer",
    status: "suspended",
    verified: true,
    joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    completedJobs: 8,
    location: "Pretoria",
  },
]

function AdminUsersContent() {
  const [users, setUsers] = useState<AdminUser[]>(mockUsers)
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [currentUser] = useState<UserType | null>(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("currentUser")
      return userData ? JSON.parse(userData) : null
    }
    return null
  })

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterUsers(term, selectedRole, selectedStatus)
  }

  const handleRoleFilter = (role: string) => {
    setSelectedRole(role)
    filterUsers(searchTerm, role, selectedStatus)
  }

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status)
    filterUsers(searchTerm, selectedRole, status)
  }

  const filterUsers = (search: string, role: string, status: string) => {
    let filtered = users

    if (search) {
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(search.toLowerCase()) ||
          user.lastName.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.location.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (role !== "all") {
      filtered = filtered.filter((user) => user.role === role)
    }

    if (status !== "all") {
      filtered = filtered.filter((user) => user.status === status)
    }

    setFilteredUsers(filtered)
  }

  const handleUserAction = (userId: string, action: string) => {
    const user = users.find((u) => u.id === userId)
    if (!user) return

    switch (action) {
      case "verify":
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, verified: true, status: "active" as const } : u)))
        setFilteredUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, verified: true, status: "active" as const } : u)),
        )
        console.log("[v0] User verified:", userId)
        alert(`${user.firstName} ${user.lastName} has been verified`)
        break
      case "suspend":
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: "suspended" as const } : u)))
        setFilteredUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: "suspended" as const } : u)))
        console.log("[v0] User suspended:", userId)
        alert(`${user.firstName} ${user.lastName} has been suspended`)
        break
      case "activate":
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: "active" as const } : u)))
        setFilteredUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: "active" as const } : u)))
        console.log("[v0] User activated:", userId)
        alert(`${user.firstName} ${user.lastName} has been activated`)
        break
      case "view":
        console.log("[v0] View user details:", userId)
        alert(`Viewing details for ${user.firstName} ${user.lastName}`)
        break
      case "message":
        console.log("[v0] Message user:", userId)
        alert(`Messaging ${user.firstName} ${user.lastName}`)
        break
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "employer":
        return "bg-blue-100 text-blue-800"
      case "worker":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    pending: users.filter((u) => u.status === "pending").length,
    suspended: users.filter((u) => u.status === "suspended").length,
    employers: users.filter((u) => u.role === "employer").length,
    workers: users.filter((u) => u.role === "worker").length,
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
            <h2 className="text-3xl font-bold text-foreground">User Management</h2>
            <p className="text-muted-foreground">Manage all platform users and their permissions</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-sm text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{stats.suspended}</div>
              <p className="text-sm text-muted-foreground">Suspended</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.employers}</div>
              <p className="text-sm text-muted-foreground">Employers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.workers}</div>
              <p className="text-sm text-muted-foreground">Workers</p>
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
                  placeholder="Search users by name, email, or location..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedRole} onValueChange={handleRoleFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="employer">Employer</SelectItem>
                    <SelectItem value="worker">Worker</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={handleStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {user.firstName} {user.lastName}
                        </h3>
                        {user.verified && <ShieldCheck className="w-4 h-4 text-green-600" />}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{user.email}</p>
                      <p className="text-sm text-muted-foreground">{user.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex gap-2 mb-1">
                        <Badge className={getRoleColor(user.role)} variant="secondary">
                          {user.role}
                        </Badge>
                        <Badge className={getStatusColor(user.status)} variant="secondary">
                          {user.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {user.completedJobs} jobs
                        {user.rating && ` • ${user.rating}★`}
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleUserAction(user.id, "view")}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUserAction(user.id, "message")}>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Send Message
                        </DropdownMenuItem>
                        {user.status === "pending" && (
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, "verify")}>
                            <ShieldCheck className="w-4 h-4 mr-2" />
                            Verify User
                          </DropdownMenuItem>
                        )}
                        {user.status === "active" && (
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, "suspend")}>
                            <ShieldX className="w-4 h-4 mr-2" />
                            Suspend User
                          </DropdownMenuItem>
                        )}
                        {user.status === "suspended" && (
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, "activate")}>
                            <Shield className="w-4 h-4 mr-2" />
                            Activate User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">No users found</p>
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

export default function AdminUsers() {
  return (
    <AuthGuard requiredRole="admin">
      <AdminUsersContent />
    </AuthGuard>
  )
}
