"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Download, TrendingUp, Users, Briefcase, DollarSign, Calendar } from "lucide-react"
import type { User } from "@/lib/local-db"

// Mock report data
const monthlyRevenue = [
  { month: "Jan", revenue: 12500, jobs: 85 },
  { month: "Feb", revenue: 15200, jobs: 102 },
  { month: "Mar", revenue: 18900, jobs: 126 },
  { month: "Apr", revenue: 22100, jobs: 147 },
  { month: "May", revenue: 25800, jobs: 172 },
  { month: "Jun", revenue: 28400, jobs: 189 },
]

const categoryData = [
  { name: "Cleaning", value: 35, revenue: 125400, jobs: 456 },
  { name: "Handyman", value: 25, revenue: 98700, jobs: 342 },
  { name: "Gardening", value: 20, revenue: 76500, jobs: 298 },
  { name: "Moving", value: 12, revenue: 89200, jobs: 234 },
  { name: "Painting", value: 8, revenue: 62300, jobs: 187 },
]

const userGrowth = [
  { month: "Jan", employers: 45, workers: 120 },
  { month: "Feb", employers: 52, workers: 145 },
  { month: "Mar", employers: 61, workers: 178 },
  { month: "Apr", employers: 68, workers: 203 },
  { month: "May", employers: 76, workers: 234 },
  { month: "Jun", employers: 84, workers: 267 },
]

const COLORS = ["#10b981", "#059669", "#164e63", "#84cc16", "#f87171"]

function AdminReportsContent() {
  const [timeRange, setTimeRange] = useState("6m")
  const [reportType, setReportType] = useState("overview")
  const [currentUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("currentUser")
      return userData ? JSON.parse(userData) : null
    }
    return null
  })

  const handleExportReport = (type: string) => {
    console.log("[v0] Exporting report:", type)
    alert(`Exporting ${type} report...`)
  }

  const totalStats = {
    totalRevenue: monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0),
    totalJobs: monthlyRevenue.reduce((sum, item) => sum + item.jobs, 0),
    totalUsers: userGrowth[userGrowth.length - 1].employers + userGrowth[userGrowth.length - 1].workers,
    avgJobValue: Math.round(
      monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0) /
        monthlyRevenue.reduce((sum, item) => sum + item.jobs, 0),
    ),
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
            <h2 className="text-3xl font-bold text-foreground">Reports & Analytics</h2>
            <p className="text-muted-foreground">Comprehensive platform performance insights</p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 Month</SelectItem>
                <SelectItem value="3m">3 Months</SelectItem>
                <SelectItem value="6m">6 Months</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => handleExportReport("comprehensive")}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground">R{totalStats.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12.5% from last period
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Jobs</p>
                  <p className="text-2xl font-bold text-foreground">{totalStats.totalJobs.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8.3% from last period
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground">{totalStats.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +15.2% from last period
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Job Value</p>
                  <p className="text-2xl font-bold text-foreground">R{totalStats.avgJobValue}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +3.7% from last period
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Revenue & Jobs Trend</CardTitle>
                <Button size="sm" variant="outline" onClick={() => handleExportReport("revenue")}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="revenue" fill="#10b981" name="Revenue (ZAR)" />
                  <Bar yAxisId="right" dataKey="jobs" fill="#164e63" name="Jobs" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Job Categories</CardTitle>
                <Button size="sm" variant="outline" onClick={() => handleExportReport("categories")}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* User Growth */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>User Growth</CardTitle>
              <Button size="sm" variant="outline" onClick={() => handleExportReport("users")}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="employers" stroke="#10b981" strokeWidth={2} name="Employers" />
                <Line type="monotone" dataKey="workers" stroke="#164e63" strokeWidth={2} name="Workers" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((category, index) => (
                <div
                  key={category.name}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <div>
                      <h3 className="font-semibold text-foreground">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.jobs} jobs completed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">R{category.revenue.toLocaleString()}</p>
                    <Badge variant="secondary">{category.value}% of total</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default function AdminReports() {
  return (
    <AuthGuard requiredRole="admin">
      <AdminReportsContent />
    </AuthGuard>
  )
}
