export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderRole: "employer" | "worker"
  content: string
  type: "text" | "image" | "file" | "system"
  timestamp: Date
  read: boolean
}

export interface Conversation {
  id: string
  jobId: string
  jobTitle: string
  employerId: string
  employerName: string
  workerId: string
  workerName: string
  lastMessage?: Message
  unreadCount: number
  status: "active" | "archived"
  createdAt: Date
  updatedAt: Date
}

export interface CallSession {
  id: string
  conversationId: string
  initiatorId: string
  receiverId: string
  status: "ringing" | "active" | "ended" | "missed"
  startTime?: Date
  endTime?: Date
  duration?: number
}
