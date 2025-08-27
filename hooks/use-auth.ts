"use client"

import { useState, useEffect } from "react"
import { authService, type AuthState } from "@/lib/auth"

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(authService.getState())

  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState)
    return unsubscribe
  }, [])

  return {
    ...authState,
    login: authService.login.bind(authService),
    register: authService.register.bind(authService),
    logout: authService.logout.bind(authService),
    resetPassword: authService.resetPassword.bind(authService),
    requestPasswordReset: authService.requestPasswordReset.bind(authService),
    hasRole: authService.hasRole.bind(authService),
    requireAuth: authService.requireAuth.bind(authService),
    requireRole: authService.requireRole.bind(authService),
  }
}
