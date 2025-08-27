"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Phone, PhoneOff, Send, Paperclip, ImageIcon, MoreVertical, ArrowLeft, CheckCheck, Check } from "lucide-react"
import type { Message, Conversation, CallSession } from "@/lib/messaging-types"

interface ChatInterfaceProps {
  conversation: Conversation
  messages: Message[]
  currentUserId: string
  currentUserRole: "employer" | "worker"
  onSendMessage: (content: string, type: "text" | "image" | "file") => void
  onStartCall: () => void
  onEndCall: () => void
  onBack: () => void
  callSession?: CallSession
}

export function ChatInterface({
  conversation,
  messages,
  currentUserId,
  currentUserRole,
  onSendMessage,
  onStartCall,
  onEndCall,
  onBack,
  callSession,
}: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const otherUser = currentUserRole === "employer" ? conversation.workerName : conversation.employerName

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim(), "text")
      setNewMessage("")
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // TODO: Handle file upload
      console.log("[v0] File selected:", file.name)
      onSendMessage(`Shared file: ${file.name}`, "file")
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getMessageStatus = (message: Message) => {
    if (message.senderId !== currentUserId) return null
    return message.read ? (
      <CheckCheck className="w-3 h-3 text-primary" />
    ) : (
      <Check className="w-3 h-3 text-muted-foreground" />
    )
  }

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="lg:hidden">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Avatar>
            <AvatarFallback>{otherUser.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground">{otherUser}</h3>
            <p className="text-sm text-muted-foreground">{conversation.jobTitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {callSession?.status === "active" && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span>{formatCallDuration(callSession.duration || 0)}</span>
            </div>
          )}

          {callSession?.status === "ringing" && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Calling...
            </Badge>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={callSession?.status === "active" ? onEndCall : onStartCall}
            disabled={callSession?.status === "ringing"}
          >
            {callSession?.status === "active" ? (
              <PhoneOff className="w-4 h-4 text-red-500" />
            ) : (
              <Phone className="w-4 h-4" />
            )}
          </Button>

          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Call Status */}
      {callSession && (
        <div className="p-3 bg-muted/50 border-b border-border">
          <div className="flex items-center justify-center gap-2 text-sm">
            {callSession.status === "ringing" && (
              <>
                <Phone className="w-4 h-4 animate-pulse" />
                <span>Calling {otherUser}...</span>
              </>
            )}
            {callSession.status === "active" && (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Call in progress - {formatCallDuration(callSession.duration || 0)}</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwn = message.senderId === currentUserId
          const isSystem = message.type === "system"

          if (isSystem) {
            return (
              <div key={message.id} className="flex justify-center">
                <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">{message.content}</div>
              </div>
            )
          }

          return (
            <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] ${isOwn ? "order-2" : "order-1"}`}>
                <div
                  className={`rounded-lg px-3 py-2 ${
                    isOwn ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {message.type === "file" && (
                    <div className="flex items-center gap-2 mb-1">
                      <Paperclip className="w-4 h-4" />
                      <span className="text-sm">File attachment</span>
                    </div>
                  )}
                  <p className="text-sm">{message.content}</p>
                </div>
                <div className={`flex items-center gap-1 mt-1 ${isOwn ? "justify-end" : "justify-start"}`}>
                  <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                  {getMessageStatus(message)}
                </div>
              </div>
            </div>
          )
        })}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-3 py-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
            <ImageIcon className="w-4 h-4" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="sm" disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileUpload}
          accept="image/*,.pdf,.doc,.docx"
        />
      </div>
    </div>
  )
}
