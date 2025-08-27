import { localDB, type User } from "./local-db"

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export class AuthService {
  private static instance: AuthService
  private listeners: ((state: AuthState) => void)[] = []
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  constructor() {
    this.initializeAuth()
  }

  private initializeAuth() {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("currentUser")
      if (userData) {
        try {
          const user = JSON.parse(userData) as User
          this.state = {
            user,
            isAuthenticated: true,
            isLoading: false
          }
        } catch (error) {
          console.error("Failed to parse user data:", error)
          localStorage.removeItem("currentUser")
          this.state = {
            user: null,
            isAuthenticated: false,
            isLoading: false
          }
        }
      } else {
        this.state = {
          user: null,
          isAuthenticated: false,
          isLoading: false
        }
      }
    }
    this.notifyListeners()
  }

  getState(): AuthState {
    return { ...this.state }
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.getState()))
  }

  async login(email: string, password: string, role: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = localDB.authenticateUser(email, password, role)
      
      if (user) {
        this.state = {
          user,
          isAuthenticated: true,
          isLoading: false
        }
        
        if (typeof window !== "undefined") {
          localStorage.setItem("currentUser", JSON.stringify(user))
        }
        
        this.notifyListeners()
        return { success: true }
      } else {
        return { success: false, error: "Invalid credentials" }
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Login failed" }
    }
  }

  async register(userData: Omit<User, "id" | "createdAt">): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if user already exists
      const existingUser = localDB.findUserByEmail(userData.email)
      if (existingUser) {
        return { success: false, error: "User already exists" }
      }

      const user = localDB.createUser(userData)
      
      this.state = {
        user,
        isAuthenticated: true,
        isLoading: false
      }
      
      if (typeof window !== "undefined") {
        localStorage.setItem("currentUser", JSON.stringify(user))
      }
      
      this.notifyListeners()
      return { success: true }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, error: "Registration failed" }
    }
  }

  logout() {
    this.state = {
      user: null,
      isAuthenticated: false,
      isLoading: false
    }
    
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser")
    }
    
    this.notifyListeners()
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const success = localDB.resetPassword(token, newPassword)
      if (success) {
        return { success: true }
      } else {
        return { success: false, error: "Invalid or expired token" }
      }
    } catch (error) {
      console.error("Password reset error:", error)
      return { success: false, error: "Password reset failed" }
    }
  }

  async requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const token = localDB.generatePasswordResetToken(email)
      if (token) {
        // In a real app, you would send an email here
        console.log("Password reset token:", token)
        return { success: true }
      } else {
        return { success: false, error: "User not found" }
      }
    } catch (error) {
      console.error("Password reset request error:", error)
      return { success: false, error: "Failed to request password reset" }
    }
  }

  hasRole(role: string): boolean {
    return this.state.user?.role === role
  }

  requireAuth(): User {
    if (!this.state.isAuthenticated || !this.state.user) {
      throw new Error("Authentication required")
    }
    return this.state.user
  }

  requireRole(role: string): User {
    const user = this.requireAuth()
    if (user.role !== role) {
      throw new Error(`Role ${role} required`)
    }
    return user
  }
}

export const authService = AuthService.getInstance()
