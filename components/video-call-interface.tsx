"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Phone, 
  PhoneOff, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  MessageCircle
} from "lucide-react"
import type { CallSession } from "@/lib/messaging-types"

interface VideoCallInterfaceProps {
  callSession: CallSession
  otherUserName: string
  onEndCall: () => void
  onToggleVideo: () => void
  onToggleMute: () => void
  onToggleChat: () => void
  isVideoEnabled: boolean
  isMuted: boolean
  isFullscreen: boolean
  onToggleFullscreen: () => void
}

export function VideoCallInterface({
  callSession,
  otherUserName,
  onEndCall,
  onToggleVideo,
  onToggleMute,
  onToggleChat,
  isVideoEnabled,
  isMuted,
  isFullscreen,
  onToggleFullscreen,
}: VideoCallInterfaceProps) {
  const [callDuration, setCallDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (callSession.status === "active") {
      const interval = setInterval(() => {
        const startTime = callSession.startTime?.getTime() || Date.now()
        setCallDuration(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [callSession.status, callSession.startTime])

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }

    if (isFullscreen) {
      document.addEventListener("mousemove", handleMouseMove)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current)
        }
      }
    }
  }, [isFullscreen])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getCallStatusText = () => {
    switch (callSession.status) {
      case "ringing":
        return "Calling..."
      case "active":
        return formatDuration(callDuration)
      case "ended":
        return "Call ended"
      case "missed":
        return "Call missed"
      default:
        return ""
    }
  }

  if (callSession.status === "ringing") {
    return (
      <Card className="p-8 text-center max-w-md mx-auto">
        <div className="space-y-6">
          <Avatar className="w-24 h-24 mx-auto">
            <AvatarFallback className="text-2xl">
              {otherUserName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">{otherUserName}</h3>
            <p className="text-muted-foreground">Calling...</p>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant="destructive"
              size="lg"
              className="rounded-full w-16 h-16"
              onClick={onEndCall}
            >
              <PhoneOff className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className={`relative bg-black ${isFullscreen ? "fixed inset-0 z-50" : "rounded-lg overflow-hidden"}`}>
      {/* Remote Video */}
      <div className="relative w-full h-full min-h-[400px]">
        <video
          ref={remoteVideoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
        />
        
        {/* Remote user placeholder when video is off */}
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <Avatar className="w-32 h-32 mx-auto mb-4">
              <AvatarFallback className="text-4xl">
                {otherUserName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-white text-xl font-semibold">{otherUserName}</h3>
          </div>
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20">
          {isVideoEnabled ? (
            <video
              ref={localVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Avatar className="w-12 h-12">
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>

        {/* Call Status */}
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-black/50 text-white">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
            {getCallStatusText()}
          </Badge>
        </div>

        {/* Controls */}
        <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
          showControls || !isFullscreen ? "opacity-100" : "opacity-0"
        }`}>
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="lg"
              className="rounded-full w-14 h-14"
              onClick={onToggleMute}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </Button>

            <Button
              variant={isVideoEnabled ? "secondary" : "destructive"}
              size="lg"
              className="rounded-full w-14 h-14"
              onClick={onToggleVideo}
            >
              {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </Button>

            <Button
              variant="destructive"
              size="lg"
              className="rounded-full w-16 h-16"
              onClick={onEndCall}
            >
              <PhoneOff className="w-6 h-6" />
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="rounded-full w-14 h-14"
              onClick={onToggleChat}
            >
              <MessageCircle className="w-6 h-6" />
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="rounded-full w-14 h-14"
              onClick={onToggleFullscreen}
            >
              {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
