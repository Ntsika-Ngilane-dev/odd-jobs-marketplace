"use client"

import { useAuth } from "@/hooks/use-auth"
import { LoadingPage } from "@/components/loading-spinner"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: string
  redirectTo?: string
}

export function AuthGuard({ children, requiredRole, redirectTo = "/auth/login" }: AuthGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        router.push(redirectTo)
        return
      }
      
      if (requiredRole && user.role !== requiredRole) {
        // Redirect based on user role
        const roleRedirects = {
          employer: "/employer/dashboard",
          worker: "/worker/dashboard", 
          admin: "/admin/dashboard"
        }
        router.push(roleRedirects[user.role as keyof typeof roleRedirects] || redirectTo)
        return
      }
    }
  }, [isLoading, isAuthenticated, user, requiredRole, redirectTo, router])

  if (isLoading) {
    return <LoadingPage message="Checking authentication..." />
  }

  if (!isAuthenticated || !user) {
    return <LoadingPage message="Redirecting to login..." />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <LoadingPage message="Redirecting..." />
  }

  return <>{children}</>
}
