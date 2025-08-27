export interface User {
  id: string
  email: string
  password: string
  role: "employer" | "worker" | "admin"
  firstName: string
  lastName: string
  phone: string
  bankName?: string
  accountNumber?: string
  accountHolder?: string
  createdAt: string
}

export interface PasswordResetToken {
  token: string
  email: string
  expiresAt: string
  used: boolean
}

// Simple in-memory database simulation

const loadUsersFromStorage = (): User[] => {
  if (typeof window === "undefined") return getDefaultUsers()

  try {
    const stored = localStorage.getItem("oddjobs-users")
    if (stored) {
      const parsedUsers = JSON.parse(stored)
      // Ensure we always have admin accounts
      const hasAdmin = parsedUsers.some((u: User) => u.email === "admin@oddjobs.com")
      if (!hasAdmin) {
        return [...getDefaultUsers(), ...parsedUsers]
      }
      return parsedUsers
    }
  } catch (error) {
    console.error("[v0] Error loading users from storage:", error)
  }

  return getDefaultUsers()
}

const saveUsersToStorage = (users: User[]) => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("oddjobs-users", JSON.stringify(users))
    console.log("[v0] Users saved to localStorage, total:", users.length)
  } catch (error) {
    console.error("[v0] Error saving users to storage:", error)
  }
}

const getDefaultUsers = (): User[] => [
  {
    id: "admin-1",
    email: "admin@oddjobs.com",
    password: "admin123",
    role: "admin",
    firstName: "Admin",
    lastName: "User",
    phone: "+27123456789",
    createdAt: new Date().toISOString(),
  },
  {
    id: "admin-2",
    email: "superadmin@oddjobs.com",
    password: "superadmin123",
    role: "admin",
    firstName: "Super",
    lastName: "Admin",
    phone: "+27987654321",
    createdAt: new Date().toISOString(),
  },
]

const users: User[] = loadUsersFromStorage()

const passwordResetTokens: PasswordResetToken[] = []

const loadPasswordResetTokensFromStorage = (): PasswordResetToken[] => {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem("oddjobs-reset-tokens")
    if (stored) {
      const tokens = JSON.parse(stored)
      // Clean up expired tokens
      const validTokens = tokens.filter((t: PasswordResetToken) => new Date(t.expiresAt) > new Date())
      if (validTokens.length !== tokens.length) {
        savePasswordResetTokensToStorage(validTokens)
      }
      return validTokens
    }
  } catch (error) {
    console.error("[v0] Error loading reset tokens from storage:", error)
  }

  return []
}

const savePasswordResetTokensToStorage = (tokens: PasswordResetToken[]) => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("oddjobs-reset-tokens", JSON.stringify(tokens))
    console.log("[v0] Reset tokens saved to localStorage, total:", tokens.length)
  } catch (error) {
    console.error("[v0] Error saving reset tokens to storage:", error)
  }
}

const generateSecureToken = (): string => {
  const timestamp = Date.now().toString(36)
  const randomPart1 = Math.random().toString(36).substring(2, 15)
  const randomPart2 = Math.random().toString(36).substring(2, 15)
  const randomPart3 = Math.random().toString(36).substring(2, 15)
  return `reset_${timestamp}_${randomPart1}${randomPart2}${randomPart3}`
}

export const localDB = {
  // Create new user
  createUser: (userData: Omit<User, "id" | "createdAt">): User => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    saveUsersToStorage(users)
    console.log("[v0] User created:", newUser.email, "Role:", newUser.role)
    return newUser
  },

  // Find user by email and password
  authenticateUser: (email: string, password: string, role: string): User | null => {
    const currentUsers = loadUsersFromStorage()
    const user = currentUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.role === role,
    )
    console.log("[v0] Authentication attempt:", email, "Role:", role, "Success:", !!user)
    console.log("[v0] Total users in database:", currentUsers.length)
    return user || null
  },

  // Find user by email (for duplicate check)
  findUserByEmail: (email: string): User | null => {
    const currentUsers = loadUsersFromStorage()
    return currentUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
  },

  // Get all users (for admin)
  getAllUsers: (): User[] => {
    return users
  },

  // Get users by role
  getUsersByRole: (role: string): User[] => {
    return users.filter((u) => u.role === role)
  },

  generatePasswordResetToken: (email: string): string | null => {
    const user = localDB.findUserByEmail(email)
    if (!user) return null

    // Load existing tokens and clean up old ones for this email
    const currentTokens = loadPasswordResetTokensFromStorage()
    const filteredTokens = currentTokens.filter((t) => t.email.toLowerCase() !== email.toLowerCase())

    // Generate new secure token
    const token = generateSecureToken()
    const resetToken: PasswordResetToken = {
      token,
      email: email.toLowerCase(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      used: false,
    }

    // Save new token
    const updatedTokens = [...filteredTokens, resetToken]
    savePasswordResetTokensToStorage(updatedTokens)

    console.log("[v0] Password reset token generated for:", email)
    console.log("[v0] Token:", token)
    return token
  },

  validatePasswordResetToken: (token: string): PasswordResetToken | null => {
    const currentTokens = loadPasswordResetTokensFromStorage()
    const resetToken = currentTokens.find((t) => t.token === token && !t.used && new Date(t.expiresAt) > new Date())

    console.log("[v0] Token validation for:", token, "Valid:", !!resetToken)
    return resetToken || null
  },

  resetPassword: (token: string, newPassword: string): boolean => {
    const currentTokens = loadPasswordResetTokensFromStorage()
    const resetToken = currentTokens.find((t) => t.token === token && !t.used && new Date(t.expiresAt) > new Date())

    if (!resetToken) {
      console.log("[v0] Invalid or expired token:", token)
      return false
    }

    const currentUsers = loadUsersFromStorage()
    const user = currentUsers.find((u) => u.email.toLowerCase() === resetToken.email)
    if (!user) {
      console.log("[v0] User not found for token:", resetToken.email)
      return false
    }

    // Update password
    user.password = newPassword
    saveUsersToStorage(currentUsers)

    // Mark token as used and save
    resetToken.used = true
    savePasswordResetTokensToStorage(currentTokens)

    console.log("[v0] Password reset successful for:", resetToken.email)
    return true
  },

  cleanupExpiredTokens: (): void => {
    const currentTokens = loadPasswordResetTokensFromStorage()
    const validTokens = currentTokens.filter((t) => new Date(t.expiresAt) > new Date() && !t.used)
    if (validTokens.length !== currentTokens.length) {
      savePasswordResetTokensToStorage(validTokens)
      console.log("[v0] Cleaned up expired tokens, remaining:", validTokens.length)
    }
  },
}
