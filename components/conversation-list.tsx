"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, MessageCircle, Phone } from "lucide-react"
import type { Conversation } from "@/lib/messaging-types"

interface ConversationListProps {
  conversations: Conversation[]
  currentUserRole: "employer" | "worker"
  onSelectConversation: (conversation: Conversation) => void
  selectedConversationId?: string
}

export function ConversationList({
  conversations,
  currentUserRole,
  onSelectConversation,
  selectedConversationId,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter((conv) => {
    const otherUserName = currentUserRole === "employer" ? conv.workerName : conv.employerName
    const jobTitle = conv.jobTitle
    return (
      otherUserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } else if (days === 1) {
      return "Yesterday"
    } else if (days < 7) {
      return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date)
    } else {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date)
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Messages
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="space-y-1">
          {filteredConversations.map((conversation) => {
            const otherUserName = currentUserRole === "employer" ? conversation.workerName : conversation.employerName
            const isSelected = conversation.id === selectedConversationId

            return (
              <Button
                key={conversation.id}
                variant="ghost"
                className={`w-full h-auto p-3 justify-start ${isSelected ? "bg-accent text-accent-foreground" : ""}`}
                onClick={() => onSelectConversation(conversation)}
              >
                <div className="flex items-center gap-3 w-full">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>{otherUserName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm truncate">{otherUserName}</h4>
                      <div className="flex items-center gap-1">
                        {conversation.unreadCount > 0 && (
                          <Badge
                            variant="secondary"
                            className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5"
                          >
                            {conversation.unreadCount}
                          </Badge>
                        )}
                        {conversation.lastMessage && (
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground truncate mb-1">{conversation.jobTitle}</p>

                    {conversation.lastMessage && (
                      <p className="text-xs text-muted-foreground truncate">
                        {conversation.lastMessage.type === "file" ? (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            File attachment
                          </span>
                        ) : (
                          conversation.lastMessage.content
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </Button>
            )
          })}

          {filteredConversations.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{searchQuery ? "No conversations found" : "No messages yet"}</p>
              {!searchQuery && (
                <p className="text-sm text-muted-foreground mt-2">
                  Messages will appear here when you start working on jobs
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
