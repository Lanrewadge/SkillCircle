'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Monitor,
  Camera,
  Settings,
  MessageCircle,
  Users,
  Clock,
  Maximize2,
  Minimize2,
  MoreVertical,
  Volume2,
  VolumeX
} from 'lucide-react'

interface VideoCallModalProps {
  isOpen: boolean
  onClose: () => void
  participant: {
    id: string
    name: string
    avatar: string
    role: 'tutor' | 'learner'
  }
  session: {
    id: string
    title: string
    duration: number
    startTime: Date
  }
}

interface CallControls {
  video: boolean
  audio: boolean
  screenShare: boolean
  recording: boolean
}

export default function VideoCallModal({ isOpen, onClose, participant, session }: VideoCallModalProps) {
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting')
  const [callDuration, setCallDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [controls, setControls] = useState<CallControls>({
    video: true,
    audio: true,
    screenShare: false,
    recording: false
  })
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('good')

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const callTimerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (callStatus === 'connected') {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current)
      }
    }
  }, [callStatus])

  useEffect(() => {
    if (isOpen) {
      // Simulate connection process
      setTimeout(() => setCallStatus('connected'), 2000)

      // Simulate getting user media
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then(stream => {
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream
            }
          })
          .catch(console.error)
      }
    }

    return () => {
      setCallStatus('connecting')
      setCallDuration(0)
    }
  }, [isOpen])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const toggleControl = (control: keyof CallControls) => {
    setControls(prev => ({
      ...prev,
      [control]: !prev[control]
    }))
  }

  const endCall = () => {
    setCallStatus('ended')
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  const getConnectionBadge = () => {
    const colors = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-red-100 text-red-800'
    }
    return (
      <Badge className={colors[connectionQuality]}>
        {connectionQuality} connection
      </Badge>
    )
  }

  if (callStatus === 'ended') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <PhoneOff className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Call Ended</h3>
            <p className="text-gray-600 mb-4">
              Call duration: {formatDuration(callDuration)}
            </p>
            <div className="space-y-2">
              <Button className="w-full">Rate this session</Button>
              <Button variant="outline" className="w-full" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isFullscreen ? 'max-w-full h-full' : 'max-w-4xl h-[600px]'} p-0`}>
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                {session.title}
              </DialogTitle>
              {getConnectionBadge()}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                {callStatus === 'connected' ? formatDuration(callDuration) : 'Connecting...'}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex">
          {/* Main Video Area */}
          <div className="flex-1 relative bg-gray-900">
            {callStatus === 'connecting' ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p>Connecting to {participant.name}...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Remote Video */}
                <video
                  ref={remoteVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                />

                {/* Remote Video Placeholder */}
                {!remoteVideoRef.current?.srcObject && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-6xl mb-4">{participant.avatar}</div>
                      <p className="text-xl">{participant.name}</p>
                      <p className="text-sm text-gray-300">{participant.role}</p>
                    </div>
                  </div>
                )}

                {/* Local Video */}
                <div className="absolute top-4 right-4 w-48 h-32 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20">
                  {controls.video ? (
                    <video
                      ref={localVideoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                      muted
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <VideoOff className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Screen Share Indicator */}
                {controls.screenShare && (
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    You're sharing your screen
                  </div>
                )}

                {/* Recording Indicator */}
                {controls.recording && (
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    Recording
                  </div>
                )}
              </>
            )}

            {/* Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant={controls.audio ? "default" : "destructive"}
                  size="lg"
                  className="rounded-full w-14 h-14"
                  onClick={() => toggleControl('audio')}
                >
                  {controls.audio ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                </Button>

                <Button
                  variant={controls.video ? "default" : "destructive"}
                  size="lg"
                  className="rounded-full w-14 h-14"
                  onClick={() => toggleControl('video')}
                >
                  {controls.video ? <Camera className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                </Button>

                <Button
                  variant="destructive"
                  size="lg"
                  className="rounded-full w-16 h-16"
                  onClick={endCall}
                >
                  <PhoneOff className="h-8 w-8" />
                </Button>

                <Button
                  variant={controls.screenShare ? "default" : "outline"}
                  size="lg"
                  className="rounded-full w-14 h-14"
                  onClick={() => toggleControl('screenShare')}
                >
                  <Monitor className="h-6 w-6" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full w-14 h-14"
                  onClick={() => setShowChat(!showChat)}
                >
                  <MessageCircle className="h-6 w-6" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full w-14 h-14"
                >
                  <MoreVertical className="h-6 w-6" />
                </Button>
              </div>

              <div className="flex items-center justify-center gap-4 mt-4">
                <Button
                  variant={controls.recording ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => toggleControl('recording')}
                >
                  {controls.recording ? 'Stop Recording' : 'Start Recording'}
                </Button>

                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>

          {/* Chat Panel */}
          {showChat && (
            <div className="w-80 border-l bg-white">
              <div className="p-4 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </h3>
              </div>
              <div className="flex-1 p-4">
                <div className="text-center text-gray-500">
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs">Send a message to start the conversation</p>
                </div>
              </div>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button size="sm">Send</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}