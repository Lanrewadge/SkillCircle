'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  Settings,
  Users,
  MessageSquare,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Loader2
} from 'lucide-react'
import { useSocket } from '@/contexts/SocketContext'
import { toast } from 'react-hot-toast'

interface VideoCallProps {
  sessionId: string
  isTeacher: boolean
  participantName: string
  onCallEnd: () => void
}

interface CallState {
  isConnected: boolean
  isVideoEnabled: boolean
  isAudioEnabled: boolean
  isScreenSharing: boolean
  isMuted: boolean
  isFullscreen: boolean
  connectionState: 'connecting' | 'connected' | 'failed' | 'disconnected'
}

interface Participant {
  id: string
  name: string
  isVideoEnabled: boolean
  isAudioEnabled: boolean
  stream?: MediaStream
}

export const VideoCall: React.FC<VideoCallProps> = ({
  sessionId,
  isTeacher,
  participantName,
  onCallEnd
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const screenStreamRef = useRef<MediaStream | null>(null)

  const { socket, isConnected } = useSocket()

  const [callState, setCallState] = useState<CallState>({
    isConnected: false,
    isVideoEnabled: true,
    isAudioEnabled: true,
    isScreenSharing: false,
    isMuted: false,
    isFullscreen: false,
    connectionState: 'connecting'
  })

  const [participants, setParticipants] = useState<Participant[]>([])
  const [callDuration, setCallDuration] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // WebRTC configuration
  const rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  }

  // Initialize peer connection
  const initializePeerConnection = useCallback(() => {
    const peerConnection = new RTCPeerConnection(rtcConfig)

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('webrtc-ice-candidate', {
          sessionId,
          candidate: event.candidate
        })
      }
    }

    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0]
      }
    }

    peerConnection.onconnectionstatechange = () => {
      const state = peerConnection.connectionState
      setCallState(prev => ({ ...prev, connectionState: state as any }))

      if (state === 'connected') {
        setCallState(prev => ({ ...prev, isConnected: true }))
        toast.success('Video call connected!')
      } else if (state === 'failed' || state === 'disconnected') {
        setCallState(prev => ({ ...prev, isConnected: false }))
        if (state === 'failed') {
          setError('Connection failed. Please check your internet connection.')
        }
      }
    }

    peerConnectionRef.current = peerConnection
    return peerConnection
  }, [sessionId, socket])

  // Get user media
  const getUserMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })

      localStreamRef.current = stream

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      return stream
    } catch (error) {
      console.error('Error accessing media devices:', error)
      setError('Unable to access camera or microphone. Please check permissions.')
      throw error
    }
  }, [])

  // Add local stream to peer connection
  const addStreamToPeerConnection = useCallback((stream: MediaStream, peerConnection: RTCPeerConnection) => {
    stream.getTracks().forEach(track => {
      peerConnection.addTrack(track, stream)
    })
  }, [])

  // Handle WebRTC signaling
  useEffect(() => {
    if (!socket || !isConnected) return

    const handleOffer = async (data: { offer: RTCSessionDescriptionInit; from: string }) => {
      const peerConnection = peerConnectionRef.current || initializePeerConnection()

      try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer))

        const stream = await getUserMedia()
        addStreamToPeerConnection(stream, peerConnection)

        const answer = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(answer)

        socket.emit('webrtc-answer', {
          sessionId,
          answer,
          to: data.from
        })
      } catch (error) {
        console.error('Error handling offer:', error)
        setError('Failed to establish video connection')
      }
    }

    const handleAnswer = async (data: { answer: RTCSessionDescriptionInit }) => {
      const peerConnection = peerConnectionRef.current
      if (peerConnection) {
        try {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer))
        } catch (error) {
          console.error('Error handling answer:', error)
        }
      }
    }

    const handleIceCandidate = async (data: { candidate: RTCIceCandidateInit }) => {
      const peerConnection = peerConnectionRef.current
      if (peerConnection) {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate))
        } catch (error) {
          console.error('Error handling ICE candidate:', error)
        }
      }
    }

    const handleUserJoined = (data: { userId: string; userName: string }) => {
      setParticipants(prev => [...prev, {
        id: data.userId,
        name: data.userName,
        isVideoEnabled: true,
        isAudioEnabled: true
      }])
      toast.success(`${data.userName} joined the call`)
    }

    const handleUserLeft = (data: { userId: string; userName: string }) => {
      setParticipants(prev => prev.filter(p => p.id !== data.userId))
      toast.info(`${data.userName} left the call`)
    }

    socket.on('webrtc-offer', handleOffer)
    socket.on('webrtc-answer', handleAnswer)
    socket.on('webrtc-ice-candidate', handleIceCandidate)
    socket.on('user-joined-video-call', handleUserJoined)
    socket.on('user-left-video-call', handleUserLeft)

    return () => {
      socket.off('webrtc-offer', handleOffer)
      socket.off('webrtc-answer', handleAnswer)
      socket.off('webrtc-ice-candidate', handleIceCandidate)
      socket.off('user-joined-video-call', handleUserJoined)
      socket.off('user-left-video-call', handleUserLeft)
    }
  }, [socket, isConnected, sessionId, initializePeerConnection, getUserMedia, addStreamToPeerConnection])

  // Initialize call
  useEffect(() => {
    const initializeCall = async () => {
      try {
        const stream = await getUserMedia()
        const peerConnection = initializePeerConnection()
        addStreamToPeerConnection(stream, peerConnection)

        // Join video call room
        if (socket) {
          socket.emit('join-video-call', {
            sessionId,
            userName: participantName,
            isTeacher
          })
        }

        // If teacher, create offer
        if (isTeacher) {
          const offer = await peerConnection.createOffer()
          await peerConnection.setLocalDescription(offer)

          socket?.emit('webrtc-offer', {
            sessionId,
            offer
          })
        }
      } catch (error) {
        console.error('Error initializing call:', error)
        setError('Failed to initialize video call')
      }
    }

    initializeCall()

    // Start call duration timer
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1)
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [sessionId, isTeacher, participantName, socket, getUserMedia, initializePeerConnection, addStreamToPeerConnection])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up streams
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop())
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop())
      }

      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
      }
    }
  }, [])

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setCallState(prev => ({ ...prev, isVideoEnabled: videoTrack.enabled }))

        socket?.emit('video-toggle', {
          sessionId,
          isVideoEnabled: videoTrack.enabled
        })
      }
    }
  }, [sessionId, socket])

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setCallState(prev => ({ ...prev, isAudioEnabled: audioTrack.enabled }))

        socket?.emit('audio-toggle', {
          sessionId,
          isAudioEnabled: audioTrack.enabled
        })
      }
    }
  }, [sessionId, socket])

  // Screen sharing
  const toggleScreenShare = useCallback(async () => {
    try {
      if (!callState.isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        })

        screenStreamRef.current = screenStream

        // Replace video track
        const peerConnection = peerConnectionRef.current
        if (peerConnection && localStreamRef.current) {
          const videoTrack = screenStream.getVideoTracks()[0]
          const sender = peerConnection.getSenders().find(s =>
            s.track && s.track.kind === 'video'
          )

          if (sender) {
            await sender.replaceTrack(videoTrack)
          }
        }

        setCallState(prev => ({ ...prev, isScreenSharing: true }))

        // Handle screen share end
        screenStream.getVideoTracks()[0].onended = () => {
          stopScreenShare()
        }

        toast.success('Screen sharing started')
      } else {
        stopScreenShare()
      }
    } catch (error) {
      console.error('Error toggling screen share:', error)
      toast.error('Failed to start screen sharing')
    }
  }, [callState.isScreenSharing])

  const stopScreenShare = useCallback(async () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop())
      screenStreamRef.current = null
    }

    // Restore camera
    if (localStreamRef.current && peerConnectionRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      const sender = peerConnectionRef.current.getSenders().find(s =>
        s.track && s.track.kind === 'video'
      )

      if (sender && videoTrack) {
        await sender.replaceTrack(videoTrack)
      }
    }

    setCallState(prev => ({ ...prev, isScreenSharing: false }))
    toast.info('Screen sharing stopped')
  }, [])

  // End call
  const endCall = useCallback(() => {
    // Clean up streams
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop())
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
    }

    // Leave video call room
    socket?.emit('leave-video-call', { sessionId })

    onCallEnd()
  }, [sessionId, socket, onCallEnd])

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold">Video Call</h3>
          <Badge variant={callState.isConnected ? 'default' : 'secondary'}>
            {callState.connectionState}
          </Badge>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Users className="w-4 h-4" />
            <span>{participants.length + 1} participant{participants.length !== 0 ? 's' : ''}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400">{formatDuration(callDuration)}</span>
          <Button variant="destructive" onClick={endCall}>
            <PhoneOff className="w-4 h-4 mr-2" />
            End Call
          </Button>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          {/* Remote Video */}
          <Card className="relative bg-gray-800 border-gray-700">
            <CardContent className="p-0 h-full">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover rounded-lg"
              />
              {!callState.isConnected && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Connecting...</p>
                  </div>
                </div>
              )}
              <div className="absolute bottom-4 left-4">
                <Badge>{participantName}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Local Video */}
          <Card className="relative bg-gray-800 border-gray-700">
            <CardContent className="p-0 h-full">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded-lg scale-x-[-1]"
              />
              {!callState.isVideoEnabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-700 rounded-lg">
                  <VideoOff className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="absolute bottom-4 left-4">
                <Badge>You {callState.isScreenSharing && '(Screen)'}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 bg-gray-800">
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant={callState.isAudioEnabled ? 'default' : 'destructive'}
            size="lg"
            onClick={toggleAudio}
            className="rounded-full w-12 h-12 p-0"
          >
            {callState.isAudioEnabled ?
              <Mic className="w-5 h-5" /> :
              <MicOff className="w-5 h-5" />
            }
          </Button>

          <Button
            variant={callState.isVideoEnabled ? 'default' : 'destructive'}
            size="lg"
            onClick={toggleVideo}
            className="rounded-full w-12 h-12 p-0"
          >
            {callState.isVideoEnabled ?
              <Video className="w-5 h-5" /> :
              <VideoOff className="w-5 h-5" />
            }
          </Button>

          <Button
            variant={callState.isScreenSharing ? 'destructive' : 'outline'}
            size="lg"
            onClick={toggleScreenShare}
            className="rounded-full w-12 h-12 p-0"
          >
            <Monitor className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-12 h-12 p-0"
          >
            <MessageSquare className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-12 h-12 p-0"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}