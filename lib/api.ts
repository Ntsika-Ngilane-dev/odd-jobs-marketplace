import { localDB, type User } from "./local-db"
import type { Job, JobStatus, JobCategory } from "./types"
import type { Payment, PaymentMethod, Payout } from "./payment-types"
import type { Message, Conversation } from "./messaging-types"

// Mock data generators
function generateMockJobs(count: number = 10): Job[] {
  const categories: JobCategory[] = ["cleaning", "handyman", "gardening", "moving", "painting"]
  const locations = ["Sandton, Johannesburg", "Rosebank, Cape Town", "Durban Central", "Pretoria East", "Port Elizabeth"]
  const statuses: JobStatus[] = ["posted", "assigned", "in-progress", "completed"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `job-${i + 1}`,
    title: `Job ${i + 1}`,
    description: `This is a detailed description for job ${i + 1}. It includes all the necessary information about what needs to be done.`,
    category: categories[i % categories.length],
    location: {
      address: locations[i % locations.length],
      coordinates: { lat: -26.2041 + Math.random() * 0.1, lng: 28.0473 + Math.random() * 0.1 }
    },
    budget: {
      min: 200 + (i * 50),
      max: 400 + (i * 100),
      currency: "ZAR" as const
    },
    duration: {
      estimated: 2 + (i % 6),
      flexible: i % 2 === 0
    },
    requirements: [`Requirement ${i + 1}`, `Experience needed`],
    status: statuses[i % statuses.length],
    employerId: `emp-${(i % 3) + 1}`,
    workerId: i % 4 === 0 ? `worker-${i + 1}` : undefined,
    createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)),
    updatedAt: new Date(Date.now() - (i * 12 * 60 * 60 * 1000)),
    scheduledFor: i % 3 === 0 ? new Date(Date.now() + (i * 24 * 60 * 60 * 1000)) : undefined,
    completedAt: statuses[i % statuses.length] === "completed" ? new Date(Date.now() - (i * 6 * 60 * 60 * 1000)) : undefined,
    rating: statuses[i % statuses.length] === "completed" ? {
      employer: 4 + Math.random(),
      worker: 4 + Math.random()
    } : undefined,
    images: i % 5 === 0 ? [`/placeholder-${i}.jpg`] : undefined
  }))
}

function generateMockPayments(count: number = 20): Payment[] {
  const types = ["job_payment", "tip", "refund"] as const
  const statuses = ["pending", "processing", "completed", "failed"] as const
  
  return Array.from({ length: count }, (_, i) => ({
    id: `payment-${i + 1}`,
    jobId: `job-${(i % 10) + 1}`,
    employerId: `emp-${(i % 3) + 1}`,
    workerId: `worker-${(i % 5) + 1}`,
    type: types[i % types.length],
    amount: 200 + (i * 50),
    platformFee: Math.round((200 + (i * 50)) * 0.15),
    totalAmount: Math.round((200 + (i * 50)) * 1.15),
    currency: "ZAR" as const,
    status: statuses[i % statuses.length],
    paymentMethod: i % 2 === 0 ? "card" : "bank_transfer",
    paymentProvider: "stripe" as const,
    transactionId: `txn_${Date.now()}_${i}`,
    createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)),
    completedAt: statuses[i % statuses.length] === "completed" ? new Date(Date.now() - (i * 12 * 60 * 60 * 1000)) : undefined,
    failureReason: statuses[i % statuses.length] === "failed" ? "Insufficient funds" : undefined
  }))
}

function generateMockConversations(count: number = 15): Conversation[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `conv-${i + 1}`,
    jobId: `job-${(i % 10) + 1}`,
    jobTitle: `Job ${(i % 10) + 1}`,
    employerId: `emp-${(i % 3) + 1}`,
    employerName: `Employer ${(i % 3) + 1}`,
    workerId: `worker-${(i % 5) + 1}`,
    workerName: `Worker ${(i % 5) + 1}`,
    lastMessage: {
      id: `msg-${i + 1}`,
      conversationId: `conv-${i + 1}`,
      senderId: i % 2 === 0 ? `emp-${(i % 3) + 1}` : `worker-${(i % 5) + 1}`,
      senderName: i % 2 === 0 ? `Employer ${(i % 3) + 1}` : `Worker ${(i % 5) + 1}`,
      senderRole: i % 2 === 0 ? "employer" : "worker",
      content: `This is message ${i + 1} content`,
      type: "text" as const,
      timestamp: new Date(Date.now() - (i * 60 * 60 * 1000)),
      read: i % 3 !== 0
    },
    unreadCount: i % 4,
    status: "active" as const,
    createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)),
    updatedAt: new Date(Date.now() - (i * 60 * 60 * 1000))
  }))
}

// API service class
export class ApiService {
  private static instance: ApiService
  private jobs: Job[] = generateMockJobs()
  private payments: Payment[] = generateMockPayments()
  private conversations: Conversation[] = generateMockConversations()

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService()
    }
    return ApiService.instance
  }

  // Job API methods
  async getJobs(filters?: {
    category?: JobCategory
    location?: string
    minBudget?: number
    maxBudget?: number
    status?: JobStatus
    employerId?: string
    workerId?: string
  }): Promise<Job[]> {
    let filteredJobs = [...this.jobs]

    if (filters) {
      if (filters.category) {
        filteredJobs = filteredJobs.filter(job => job.category === filters.category)
      }
      if (filters.location) {
        filteredJobs = filteredJobs.filter(job => 
          job.location.address.toLowerCase().includes(filters.location!.toLowerCase())
        )
      }
      if (filters.minBudget) {
        filteredJobs = filteredJobs.filter(job => job.budget.max >= filters.minBudget!)
      }
      if (filters.maxBudget) {
        filteredJobs = filteredJobs.filter(job => job.budget.min <= filters.maxBudget!)
      }
      if (filters.status) {
        filteredJobs = filteredJobs.filter(job => job.status === filters.status)
      }
      if (filters.employerId) {
        filteredJobs = filteredJobs.filter(job => job.employerId === filters.employerId)
      }
      if (filters.workerId) {
        filteredJobs = filteredJobs.filter(job => job.workerId === filters.workerId)
      }
    }

    return filteredJobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async getJob(id: string): Promise<Job | null> {
    return this.jobs.find(job => job.id === id) || null
  }

  async createJob(jobData: Omit<Job, "id" | "createdAt" | "updatedAt" | "status">): Promise<Job> {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      status: "posted",
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.jobs.unshift(newJob)
    return newJob
  }

  async updateJob(id: string, updates: Partial<Job>): Promise<Job | null> {
    const jobIndex = this.jobs.findIndex(job => job.id === id)
    if (jobIndex === -1) return null

    this.jobs[jobIndex] = {
      ...this.jobs[jobIndex],
      ...updates,
      updatedAt: new Date()
    }
    return this.jobs[jobIndex]
  }

  async deleteJob(id: string): Promise<boolean> {
    const jobIndex = this.jobs.findIndex(job => job.id === id)
    if (jobIndex === -1) return false

    this.jobs.splice(jobIndex, 1)
    return true
  }

  // Payment API methods
  async getPayments(filters?: {
    userId?: string
    status?: string
    type?: string
  }): Promise<Payment[]> {
    let filteredPayments = [...this.payments]

    if (filters) {
      if (filters.userId) {
        filteredPayments = filteredPayments.filter(payment => 
          payment.employerId === filters.userId || payment.workerId === filters.userId
        )
      }
      if (filters.status) {
        filteredPayments = filteredPayments.filter(payment => payment.status === filters.status)
      }
      if (filters.type) {
        filteredPayments = filteredPayments.filter(payment => payment.type === filters.type)
      }
    }

    return filteredPayments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async createPayment(paymentData: Omit<Payment, "id" | "createdAt">): Promise<Payment> {
    const newPayment: Payment = {
      ...paymentData,
      id: `payment-${Date.now()}`,
      createdAt: new Date()
    }
    this.payments.unshift(newPayment)
    return newPayment
  }

  // Messaging API methods
  async getConversations(userId: string, userRole: string): Promise<Conversation[]> {
    return this.conversations.filter(conv => 
      (userRole === "employer" && conv.employerId === userId) ||
      (userRole === "worker" && conv.workerId === userId)
    ).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    // Mock messages for a conversation
    return Array.from({ length: 10 }, (_, i) => ({
      id: `msg-${conversationId}-${i}`,
      conversationId,
      senderId: i % 2 === 0 ? "user1" : "user2",
      senderName: i % 2 === 0 ? "User 1" : "User 2",
      senderRole: i % 2 === 0 ? "employer" : "worker",
      content: `Message ${i + 1} content`,
      type: "text" as const,
      timestamp: new Date(Date.now() - (i * 60 * 60 * 1000)),
      read: i % 3 !== 0
    }))
  }

  async sendMessage(conversationId: string, senderId: string, content: string, type: "text" | "image" | "file" = "text"): Promise<Message> {
    const conversation = this.conversations.find(conv => conv.id === conversationId)
    const senderName = conversation?.employerId === senderId ? conversation.employerName : conversation?.workerName || "Unknown"
    const senderRole = conversation?.employerId === senderId ? "employer" : "worker"

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      senderName,
      senderRole,
      content,
      type,
      timestamp: new Date(),
      read: false
    }

    // Update conversation
    if (conversation) {
      conversation.lastMessage = newMessage
      conversation.updatedAt = new Date()
      conversation.unreadCount += 1
    }

    return newMessage
  }

  // User API methods
  async getUsers(filters?: { role?: string; status?: string }): Promise<User[]> {
    let users = localDB.getAllUsers()

    if (filters) {
      if (filters.role) {
        users = users.filter(user => user.role === filters.role)
      }
    }

    return users
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    // This would need to be implemented in localDB
    return null
  }

  // Analytics API methods
  async getAnalytics(userRole: string, userId?: string) {
    const jobs = await this.getJobs(userId ? { 
      [userRole === "employer" ? "employerId" : "workerId"]: userId 
    } : undefined)
    
    const payments = await this.getPayments(userId ? { userId } : undefined)

    return {
      totalJobs: jobs.length,
      activeJobs: jobs.filter(j => j.status === "posted" || j.status === "assigned" || j.status === "in-progress").length,
      completedJobs: jobs.filter(j => j.status === "completed").length,
      totalRevenue: payments.filter(p => p.status === "completed").reduce((sum, p) => sum + p.amount, 0),
      averageRating: 4.2,
      topCategories: [
        { name: "Cleaning", count: 45, revenue: 12500 },
        { name: "Handyman", count: 32, revenue: 8900 },
        { name: "Gardening", count: 28, revenue: 7200 }
      ],
      recentActivity: [
        { type: "job", description: "New job application received", time: "2 hours ago" },
        { type: "payment", description: "Payment processed successfully", time: "4 hours ago" },
        { type: "message", description: "New message from client", time: "6 hours ago" }
      ],
      locationStats: [
        { city: "Johannesburg", jobs: 156, revenue: 45000 },
        { city: "Cape Town", jobs: 89, revenue: 28000 },
        { city: "Durban", jobs: 67, revenue: 19000 }
      ]
    }
  }
}

export const apiService = ApiService.getInstance()
