"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ChatInterface } from "@/components/chat-interface"
import { ConversationList } from "@/components/conversation-list"
import { MessageCircle } from "lucide-react"
import type { Conversation, Message, CallSession } from "@/lib/messaging-types"

// Mock data for worker perspective
const mockConversations: Conversation[] = [
  {
    id: "conv1",
    jobId: "job1",
    jobTitle: "House Cleaning Service",
    employerId: "emp1",
    employerName: "John Smith",
    workerId: "worker1",
    workerName: "Sarah Johnson",
    lastMessage: {
      id: "msg1",
      conversationId: "conv1",
      senderId: "emp1",
      senderName: "John Smith",
      senderRole: "employer",
      content: "Yes, please bring your own supplies. I'll provide any additional items if needed.",
      type: "text",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      read: false,
    },
    unreadCount: 1,
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15),
  },
]

const mockMessages: Record<string, Message[]> = {
  conv1: [
    {
      id: "msg1",
      conversationId: "conv1",
      senderId: "system",
      senderName: "System",
      senderRole: "worker",
      content: "You have been assigned to this job",
      type: "system",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      read: true,
    },
    {
      id: "msg2",
      conversationId: "conv1",
      senderId: "emp1",
      senderName: "John Smith",
      senderRole: "employer",
      content: "Hi Sarah! Thanks for accepting the job. When would be a good time for you to start?",
      type: "text",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
    },
    {
      id: "msg3",
      conversationId: "conv1",
      senderId: "worker1",
      senderName: "Sarah Johnson",
      senderRole: "worker",
      content: "Hello! I'm available tomorrow morning. Would 9 AM work for you?",
      type: "text",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20),
      read: true,
    },
    {
      id: "msg4",
      conversationId: "conv1",
      senderId: "emp1",
      senderName: "John Smith",
      senderRole: "employer",
      content: "Perfect! 9 AM works great. The address is 123 Oak Street, Sandton.",
      type: "text",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18),
      read: true,
    },
    {
      id: "msg5",
      conversationId: "conv1",
      senderId: "worker1",
      senderName: "Sarah Johnson",
      senderRole: "worker",
      content: "I'll be there at 9 AM tomorrow. Should I bring my own cleaning supplies?",
      type: "text",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: true,
    },
    {
      id: "msg6",
      conversationId: "conv1",
      senderId: "emp1",
      senderName: "John Smith",
      senderRole: "employer",
      content: "Yes, please bring your own supplies. I'll provide any additional items if needed.",
      type: "text",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      read: false,
    },
  ],
}

export default function WorkerMessagesPage() {
  const [conversations] = useState<Conversation[]>(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [callSession, setCallSession] = useState<CallSession | null>(null)

  const currentUserId = "worker1"
  const currentUserRole = "worker"

  useEffect(() => {
    if (selectedConversation) {
      setMessages(mockMessages[selectedConversation.id] || [])
    }
  }, [selectedConversation])

  const handleSendMessage = (content: string, type: "text" | "image" | "file") => {
    if (!selectedConversation) return

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: currentUserId,
      senderName: "Sarah Johnson",
      senderRole: currentUserRole,
      content,
      type,
      timestamp: new Date(),
      read: false,
    }

    setMessages((prev) => [...prev, newMessage])
    console.log("[v0] Message sent:", newMessage)
  }

  const handleStartCall = () => {
    if (!selectedConversation) return

    const newCallSession: CallSession = {
      id: `call_${Date.now()}`,
      conversationId: selectedConversation.id,
      initiatorId: currentUserId,
      receiverId: selectedConversation.employerId,
      status: "ringing",
      startTime: new Date(),
    }

    setCallSession(newCallSession)
    console.log("[v0] Call started:", newCallSession)

    // Simulate call being answered
    setTimeout(() => {
      setCallSession((prev) => (prev ? { ...prev, status: "active", duration: 0 } : null))

      const timer = setInterval(() => {
        setCallSession((prev) => {
          if (prev?.status === "active") {
            return { ...prev, duration: (prev.duration || 0) + 1 }
          }
          clearInterval(timer)
          return prev
        })
      }, 1000)
    }, 2000)
  }

  const handleEndCall = () => {
    if (callSession) {
      setCallSession({
        ...callSession,
        status: "ended",
        endTime: new Date(),
      })

      const callMessage: Message = {
        id: `msg_${Date.now()}`,
        conversationId: selectedConversation!.id,
        senderId: "system",
        senderName: "System",
        senderRole: "worker",
        content: `Call ended - Duration: ${Math.floor((callSession.duration || 0) / 60)}:${((callSession.duration || 0) % 60).toString().padStart(2, "0")}`,
        type: "system",
        timestamp: new Date(),
        read: true,
      }

      setMessages((prev) => [...prev, callMessage])

      setTimeout(() => {
        setCallSession(null)
      }, 2000)
    }
  }

  return (
    <DashboardLayout userRole="worker" userName="Sarah Johnson" notifications={2}>
      <div className="h-[calc(100vh-200px)] grid lg:grid-cols-3 gap-6">
        <div className={`${selectedConversation ? "hidden lg:block" : ""}`}>
          <ConversationList
            conversations={conversations}
            currentUserRole={currentUserRole}
            onSelectConversation={setSelectedConversation}
            selectedConversationId={selectedConversation?.id}
          />
        </div>

        <div className={`lg:col-span-2 ${!selectedConversation ? "hidden lg:block" : ""}`}>
          {selectedConversation ? (
            <ChatInterface
              conversation={selectedConversation}
              messages={messages}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
              onSendMessage={handleSendMessage}
              onStartCall={handleStartCall}
              onEndCall={handleEndCall}
              onBack={() => setSelectedConversation(null)}
              callSession={callSession || undefined}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-card rounded-lg border border-border">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
