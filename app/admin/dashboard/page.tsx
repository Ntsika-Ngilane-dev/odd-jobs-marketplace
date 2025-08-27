"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AdminAnalytics } from "@/components/admin-analytics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Users, Briefcase, BarChart3 } from "lucide-react"
import type { User } from "@/lib/local-db"

function AdminDashboardContent() {
  const [timeRange, setTimeRange] = useState("30d")
  const [currentUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("currentUser")
      return userData ? JSON.parse(userData) : null
    }
    return null
  })

  const analyticsData = {
    totalUsers: 1247,
    totalJobs: 2156,
    totalRevenue: 452300,
    activeJobs: 89,
    completedJobs: 1987,
    averageRating: 4.7,
    topCategories: [
      { name: "House Cleaning", count: 456, revenue: 125400 },
      { name: "Handyman Services", count: 342, revenue: 98700 },
      { name: "Gardening", count: 298, revenue: 76500 },
      { name: "Moving & Packing", count: 234, revenue: 89200 },
      { name: "Painting", count: 187, revenue: 62300 },
    ],
    recentActivity: [
      { type: "signup", description: "New employer registered from Cape Town", time: "2 minutes ago" },
      { type: "completion", description: "House cleaning job completed successfully", time: "15 minutes ago" },
      { type: "payment", description: "Payment of R450 processed with R67.50 platform fee", time: "1 hour ago" },
      { type: "dispute", description: "Job dispute reported - handyman services", time: "2 hours ago" },
      { type: "verification", description: "Worker profile verified with documents", time: "3 hours ago" },
    ],
    locationStats: [
      { city: "Johannesburg", jobs: 678, revenue: 187600 },
      { city: "Cape Town", jobs: 543, revenue: 156800 },
      { city: "Durban", jobs: 432, revenue: 98400 },
      { city: "Pretoria", jobs: 298, revenue: 76200 },
      { city: "Port Elizabeth", jobs: 205, revenue: 43300 },
    ],
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
            <h2 className="text-3xl font-bold text-foreground">Admin Dashboard</h2>
            <p className="text-muted-foreground">Monitor platform performance and user activity</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setTimeRange("7d")}>
              7 Days
            </Button>
            <Button variant="outline" size="sm" onClick={() => setTimeRange("30d")}>
              30 Days
            </Button>
            <Button variant="outline" size="sm" onClick={() => setTimeRange("90d")}>
              90 Days
            </Button>
          </div>
        </div>

        <AdminAnalytics data={analyticsData} />

        {/* Quick Actions & System Status */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Briefcase className="w-4 h-4 mr-2" />
                Review Jobs
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Handle Disputes
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <BarChart3 className="w-4 h-4 mr-2" />
                Generate Reports
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status & Pending Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Status</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Payment Gateway</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Operational
                  </Badge>
                </div>
              </div>

              <hr className="my-4" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">User Verifications</span>
                  <Badge variant="secondary">12</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Job Disputes</span>
                  <Badge variant="secondary">3</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Payment Issues</span>
                  <Badge variant="secondary">1</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function AdminDashboard() {
  return (
    <AuthGuard requiredRole="admin">
      <AdminDashboardContent />
    </AuthGuard>
  )
}
