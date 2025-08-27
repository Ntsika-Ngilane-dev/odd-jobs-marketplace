"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, MessageCircle, Phone, Video, Archive, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Conversation } from "@/lib/messaging-types"

interface MessagingListProps {
  conversations: Conversation[]
  selectedConversationId?: string
  onSelectConversation: (conversation: Conversation) => void
  onArchiveConversation: (conversationId: string) => void
  onStartCall: (conversationId: string, type: "voice" | "video") => void
  currentUserRole: "employer" | "worker"
}

export function MessagingList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onArchiveConversation,
  onStartCall,
  currentUserRole,
}: MessagingListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "unread" | "archived">("all")

  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch = 
      conversation.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (currentUserRole === "employer" 
        ? conversation.workerName.toLowerCase().includes(searchQuery.toLowerCase())
        : conversation.employerName.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesFilter = 
      filter === "all" ? conversation.status === "active" :
      filter === "unread" ? conversation.unreadCount > 0 :
      filter === "archived" ? conversation.status === "archived" : true

    return matchesSearch && matchesFilter
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Messages</h2>
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("unread")}
            >
              Unread
            </Button>
            <Button
              variant={filter === "archived" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("archived")}
            >
              Archived
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageCircle className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-medium text-muted-foreground mb-2">No conversations found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Try adjusting your search" : "Start a conversation with a job"}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredConversations.map((conversation) => {
                const otherUser = currentUserRole === "employer" 
                  ? conversation.workerName 
                  : conversation.employerName
                const isSelected = conversation.id === selectedConversationId

                return (
                  <div
                    key={conversation.id}
                    className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected 
                        ? "bg-primary/10 border border-primary/20" 
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => onSelectConversation(conversation)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>{otherUser.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {conversation.unreadCount > 0 && (
                          <Badge 
                            variant="destructive" 
                            className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                          >
                            {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                          </Badge>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm truncate">{otherUser}</h4>
                          <span className="text-xs text-muted-foreground">
                            {conversation.lastMessage && formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-1 truncate">
                          {conversation.jobTitle}
                        </p>
                        
                        {conversation.lastMessage && (
                          <p className={`text-sm truncate ${
                            conversation.unreadCount > 0 ? "font-medium text-foreground" : "text-muted-foreground"
                          }`}>
                            {conversation.lastMessage.type === "file" ? "📎 File attachment" : conversation.lastMessage.content}
                          </p>
                        )}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onStartCall(conversation.id, "voice")}>
                            <Phone className="w-4 h-4 mr-2" />
                            Voice Call
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onStartCall(conversation.id, "video")}>
                            <Video className="w-4 h-4 mr-2" />
                            Video Call
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onArchiveConversation(conversation.id)}>
                            <Archive className="w-4 h-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
