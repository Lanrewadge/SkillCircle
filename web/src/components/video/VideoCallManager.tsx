'use client'

import React, { useState } from 'react'
import { VideoCall } from './VideoCall'
import { VideoCallSetup } from './VideoCallSetup'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Video, Clock, User, Calendar } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface VideoCallManagerProps {
  sessionId: string
  sessionInfo: {
    id: string
    skillName: string
    teacherName: string
    studentName: string
    sessionDate: string
    duration: number
    status: 'scheduled' | 'active' | 'completed' | 'cancelled'
  }
  currentUser: {
    id: string
    name: string
    role: 'teacher' | 'student'
  }
  onSessionUpdate?: (session: any) => void
}

interface MediaDeviceConfig {
  videoDeviceId?: string
  audioDeviceId?: string
  isVideoEnabled: boolean
  isAudioEnabled: boolean
  videoQuality: 'low' | 'medium' | 'high'
}

type CallStage = 'waiting' | 'setup' | 'calling' | 'ended'

export const VideoCallManager: React.FC<VideoCallManagerProps> = ({
  sessionId,
  sessionInfo,
  currentUser,
  onSessionUpdate
}) => {
  const [callStage, setCallStage] = useState<CallStage>('waiting')
  const [deviceConfig, setDeviceConfig] = useState<MediaDeviceConfig | null>(null)

  const isTeacher = currentUser.role === 'teacher'
  const sessionDateTime = new Date(sessionInfo.sessionDate)
  const now = new Date()
  const timeToSession = sessionDateTime.getTime() - now.getTime()
  const isSessionTime = timeToSession <= 300000 && timeToSession >= -300000 // 5 minutes before/after

  const formatTimeUntilSession = () => {
    if (timeToSession < 0) {
      const minutesLate = Math.abs(Math.floor(timeToSession / 60000))
      return `Session started ${minutesLate} minute${minutesLate === 1 ? '' : 's'} ago`
    }

    const hours = Math.floor(timeToSession / 3600000)
    const minutes = Math.floor((timeToSession % 3600000) / 60000)

    if (hours > 0) {
      return `Session starts in ${hours}h ${minutes}m`
    } else {
      return `Session starts in ${minutes}m`
    }
  }

  const handleStartCall = () => {
    if (!isSessionTime && !isTeacher) {
      toast.error('You can only join the call within 5 minutes of the scheduled time')
      return
    }

    setCallStage('setup')
  }

  const handleJoinCall = (config: MediaDeviceConfig) => {
    setDeviceConfig(config)
    setCallStage('calling')

    // Update session status to active
    onSessionUpdate?.({
      ...sessionInfo,
      status: 'active'
    })

    toast.success('Joining video call...')
  }

  const handleCallEnd = () => {
    setCallStage('ended')

    // Update session status to completed
    onSessionUpdate?.({
      ...sessionInfo,
      status: 'completed'
    })

    toast.success('Video call ended')
  }

  const handleBackToWaiting = () => {
    setCallStage('waiting')
    setDeviceConfig(null)
  }

  // Render based on call stage
  switch (callStage) {
    case 'setup':
      return (
        <VideoCallSetup
          onJoinCall={handleJoinCall}
          onCancel={handleBackToWaiting}
          sessionInfo={sessionInfo}
        />
      )

    case 'calling':
      if (!deviceConfig) return null
      return (
        <VideoCall
          sessionId={sessionId}
          isTeacher={isTeacher}
          participantName={currentUser.name}
          onCallEnd={handleCallEnd}
        />
      )

    case 'ended':
      return (
        <div className="max-w-2xl mx-auto p-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-green-600">Session Completed</CardTitle>
              <CardDescription>
                Your video call has ended successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Video className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">{sessionInfo.skillName}</h3>
                <p className="text-gray-600">
                  Session with {isTeacher ? sessionInfo.studentName : sessionInfo.teacherName}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{sessionInfo.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{sessionDateTime.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{sessionDateTime.toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button variant="outline" className="flex-1">
                  View Session Details
                </Button>
                <Button variant="outline" className="flex-1">
                  Schedule Follow-up
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )

    default: // waiting
      return (
        <div className="max-w-2xl mx-auto p-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Video className="w-5 h-5" />
                  <span>Video Session</span>
                </CardTitle>
                <Badge
                  variant={sessionInfo.status === 'scheduled' ? 'default' : 'secondary'}
                >
                  {sessionInfo.status}
                </Badge>
              </div>
              <CardDescription>
                Prepare for your upcoming skill learning session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Session Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">{sessionInfo.skillName}</h3>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="font-medium">
                        {isTeacher ? 'Student' : 'Teacher'}
                      </div>
                      <div className="text-gray-600">
                        {isTeacher ? sessionInfo.studentName : sessionInfo.teacherName}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="font-medium">Duration</div>
                      <div className="text-gray-600">{sessionInfo.duration} minutes</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 col-span-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="font-medium">Scheduled Time</div>
                      <div className="text-gray-600">
                        {sessionDateTime.toLocaleDateString()} at {sessionDateTime.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Status */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                    {formatTimeUntilSession()}
                  </div>
                  {!isSessionTime && !isTeacher && (
                    <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                      You can join 5 minutes before the scheduled time
                    </div>
                  )}
                </div>
              </div>

              {/* Call Action */}
              <div className="space-y-3">
                <Button
                  onClick={handleStartCall}
                  disabled={!isSessionTime && !isTeacher}
                  className="w-full"
                  size="lg"
                >
                  <Video className="w-5 h-5 mr-2" />
                  {isTeacher ? 'Start Video Call' : 'Join Video Call'}
                </Button>

                {!isSessionTime && !isTeacher && (
                  <p className="text-xs text-gray-500 text-center">
                    The join button will be enabled 5 minutes before your session
                  </p>
                )}

                {isTeacher && (
                  <p className="text-xs text-gray-500 text-center">
                    As the teacher, you can start the call at any time
                  </p>
                )}
              </div>

              {/* Pre-call checklist */}
              <div className="space-y-3">
                <h4 className="font-medium">Before you join:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Test your camera and microphone</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Ensure stable internet connection</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Find a quiet, well-lit space</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Prepare any materials needed for the session</span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="text-xs text-gray-500 text-center pt-4 border-t">
                Having technical issues? Contact our support team for help
              </div>
            </CardContent>
          </Card>
        </div>
      )
  }
}