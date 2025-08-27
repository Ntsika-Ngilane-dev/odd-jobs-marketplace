"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Briefcase,
  Users,
  Shield,
  Home,
  Plus,
  Search,
  MessageCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  User,
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole: "employer" | "worker" | "admin"
  userName: string
  userAvatar?: string
  notifications?: number
}

export function DashboardLayout({ children, userRole, userName, userAvatar, notifications = 0 }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const getRoleConfig = () => {
    switch (userRole) {
      case "employer":
        return {
          icon: <Briefcase className="w-6 h-6" />,
          title: "Employer Dashboard",
          navigation: [
            { icon: <Home className="w-5 h-5" />, label: "Overview", href: "/employer/dashboard" },
            { icon: <Plus className="w-5 h-5" />, label: "Post Job", href: "/employer/post-job" },
            { icon: <Briefcase className="w-5 h-5" />, label: "My Jobs", href: "/employer/jobs" },
            { icon: <Users className="w-5 h-5" />, label: "Workers", href: "/employer/workers" },
            { icon: <MessageCircle className="w-5 h-5" />, label: "Messages", href: "/employer/messages" },
          ],
        }
      case "worker":
        return {
          icon: <Users className="w-6 h-6" />,
          title: "Worker Dashboard",
          navigation: [
            { icon: <Home className="w-5 h-5" />, label: "Overview", href: "/worker/dashboard" },
            { icon: <Search className="w-5 h-5" />, label: "Find Jobs", href: "/worker/jobs" },
            { icon: <Briefcase className="w-5 h-5" />, label: "My Applications", href: "/worker/applications" },
            { icon: <User className="w-5 h-5" />, label: "Profile", href: "/worker/profile" },
            { icon: <MessageCircle className="w-5 h-5" />, label: "Messages", href: "/worker/messages" },
          ],
        }
      case "admin":
        return {
          icon: <Shield className="w-6 h-6" />,
          title: "Admin Dashboard",
          navigation: [
            { icon: <Home className="w-5 h-5" />, label: "Overview", href: "/admin/dashboard" },
            { icon: <Users className="w-5 h-5" />, label: "Users", href: "/admin/users" },
            { icon: <Briefcase className="w-5 h-5" />, label: "Jobs", href: "/admin/jobs" },
            { icon: <MessageCircle className="w-5 h-5" />, label: "Reports", href: "/admin/reports" },
          ],
        }
    }
  }

  const config = getRoleConfig()

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">{config.icon}</div>
          <span className="font-semibold text-foreground">OddJobs</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform lg:relative lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-sidebar-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-sidebar-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold text-sidebar-foreground">OddJobs</span>
                </div>
                <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-sidebar-foreground/70 mt-1">{config.title}</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {config.navigation.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  onClick={() => (window.location.href = item.href)}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Button>
              ))}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-sidebar-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-sidebar-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-sidebar-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">{userName}</p>
                  <p className="text-xs text-sidebar-foreground/70 capitalize">{userRole}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                  onClick={() => (window.location.href = "/")}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Top Bar */}
          <div className="hidden lg:flex bg-card border-b border-border p-4 items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">{config.title}</h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                    {notifications}
                  </Badge>
                )}
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{userName}</span>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-6">{children}</div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
