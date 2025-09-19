'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Settings,
  Monitor,
  Camera,
  Headphones,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface VideoCallSetupProps {
  onJoinCall: (config: MediaDeviceConfig) => void
  onCancel: () => void
  sessionInfo: {
    skillName: string
    teacherName: string
    studentName: string
    sessionDate: string
    duration: number
  }
}

interface MediaDeviceConfig {
  videoDeviceId?: string
  audioDeviceId?: string
  isVideoEnabled: boolean
  isAudioEnabled: boolean
  videoQuality: 'low' | 'medium' | 'high'
}

interface DeviceInfo {
  deviceId: string
  label: string
  kind: string
}

export const VideoCallSetup: React.FC<VideoCallSetupProps> = ({
  onJoinCall,
  onCancel,
  sessionInfo
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [config, setConfig] = useState<MediaDeviceConfig>({
    isVideoEnabled: true,
    isAudioEnabled: true,
    videoQuality: 'medium'
  })

  const [devices, setDevices] = useState<{
    cameras: DeviceInfo[]
    microphones: DeviceInfo[]
    speakers: DeviceInfo[]
  }>({
    cameras: [],
    microphones: [],
    speakers: []
  })

  const [permissionState, setPermissionState] = useState<{
    camera: 'granted' | 'denied' | 'prompt' | 'checking'
    microphone: 'granted' | 'denied' | 'prompt' | 'checking'
  }>({
    camera: 'checking',
    microphone: 'checking'
  })

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get available media devices
  const getMediaDevices = async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices()

      const cameras = deviceList
        .filter(device => device.kind === 'videoinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${device.deviceId.slice(-4)}`,
          kind: device.kind
        }))

      const microphones = deviceList
        .filter(device => device.kind === 'audioinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Microphone ${device.deviceId.slice(-4)}`,
          kind: device.kind
        }))

      const speakers = deviceList
        .filter(device => device.kind === 'audiooutput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Speaker ${device.deviceId.slice(-4)}`,
          kind: device.kind
        }))

      setDevices({ cameras, microphones, speakers })

      // Set default devices
      if (cameras.length > 0 && !config.videoDeviceId) {
        setConfig(prev => ({ ...prev, videoDeviceId: cameras[0].deviceId }))
      }
      if (microphones.length > 0 && !config.audioDeviceId) {
        setConfig(prev => ({ ...prev, audioDeviceId: microphones[0].deviceId }))
      }

    } catch (error) {
      console.error('Error getting media devices:', error)
      setError('Unable to access media devices')
    }
  }

  // Check permissions
  const checkPermissions = async () => {
    try {
      // Check camera permission
      const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName })
      setPermissionState(prev => ({ ...prev, camera: cameraPermission.state as any }))

      // Check microphone permission
      const micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName })
      setPermissionState(prev => ({ ...prev, microphone: micPermission.state as any }))

      // Listen for permission changes
      cameraPermission.onchange = () => {
        setPermissionState(prev => ({ ...prev, camera: cameraPermission.state as any }))
      }
      micPermission.onchange = () => {
        setPermissionState(prev => ({ ...prev, microphone: micPermission.state as any }))
      }

    } catch (error) {
      console.error('Error checking permissions:', error)
    }
  }

  // Request media permissions and get stream
  const getMediaStream = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: config.isVideoEnabled ? {
          deviceId: config.videoDeviceId ? { exact: config.videoDeviceId } : undefined,
          width: config.videoQuality === 'high' ? 1920 : config.videoQuality === 'medium' ? 1280 : 640,
          height: config.videoQuality === 'high' ? 1080 : config.videoQuality === 'medium' ? 720 : 480,
          frameRate: { ideal: 30 }
        } : false,
        audio: config.isAudioEnabled ? {
          deviceId: config.audioDeviceId ? { exact: config.audioDeviceId } : undefined,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } : false
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current && config.isVideoEnabled) {
        videoRef.current.srcObject = stream
      }

      setPermissionState({
        camera: config.isVideoEnabled ? 'granted' : permissionState.camera,
        microphone: config.isAudioEnabled ? 'granted' : permissionState.microphone
      })

    } catch (error) {
      console.error('Error getting media stream:', error)

      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setPermissionState({
            camera: 'denied',
            microphone: 'denied'
          })
          setError('Camera and microphone access denied. Please allow permissions and try again.')
        } else if (error.name === 'NotFoundError') {
          setError('No camera or microphone found. Please connect devices and try again.')
        } else {
          setError(`Media access error: ${error.message}`)
        }
      }
    }
  }

  // Initialize setup
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true)
      setError(null)

      await checkPermissions()
      await getMediaDevices()
      await getMediaStream()

      setIsLoading(false)
    }

    initialize()

    return () => {
      // Cleanup stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Update stream when config changes
  useEffect(() => {
    if (!isLoading) {
      getMediaStream()
    }
  }, [config.isVideoEnabled, config.isAudioEnabled, config.videoDeviceId, config.audioDeviceId, config.videoQuality])

  // Test audio levels
  const testAudioLevels = () => {
    if (streamRef.current) {
      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      const microphone = audioContext.createMediaStreamSource(streamRef.current)

      microphone.connect(analyser)
      analyser.fftSize = 512

      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      const checkLevel = () => {
        analyser.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((a, b) => a + b) / bufferLength

        if (average > 10) {
          toast.success('Microphone is working!')
          audioContext.close()
          return
        }

        requestAnimationFrame(checkLevel)
      }

      checkLevel()

      // Clean up after 5 seconds
      setTimeout(() => {
        audioContext.close()
      }, 5000)
    }
  }

  const handleJoinCall = () => {
    if (permissionState.camera === 'denied' || permissionState.microphone === 'denied') {
      setError('Please allow camera and microphone access to join the video call.')
      return
    }

    onJoinCall(config)
  }

  const getPermissionIcon = (state: string) => {
    switch (state) {
      case 'granted':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'denied':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Session Info */}
      <Card>
        <CardHeader>
          <CardTitle>Video Call Setup</CardTitle>
          <CardDescription>
            Configure your camera and microphone settings before joining the call
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Skill:</strong> {sessionInfo.skillName}
            </div>
            <div>
              <strong>Duration:</strong> {sessionInfo.duration} minutes
            </div>
            <div>
              <strong>Teacher:</strong> {sessionInfo.teacherName}
            </div>
            <div>
              <strong>Student:</strong> {sessionInfo.studentName}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Video Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="w-5 h-5" />
              <span>Video Preview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
              {config.isVideoEnabled ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <VideoOff className="w-12 h-12 text-gray-400" />
                </div>
              )}

              <div className="absolute bottom-2 left-2 flex space-x-2">
                <Badge variant={config.isVideoEnabled ? 'default' : 'secondary'}>
                  {config.isVideoEnabled ? 'Video On' : 'Video Off'}
                </Badge>
                <Badge variant={config.isAudioEnabled ? 'default' : 'secondary'}>
                  {config.isAudioEnabled ? 'Audio On' : 'Audio Off'}
                </Badge>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                variant={config.isVideoEnabled ? 'default' : 'outline'}
                onClick={() => setConfig(prev => ({ ...prev, isVideoEnabled: !prev.isVideoEnabled }))}
              >
                {config.isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </Button>
              <Button
                variant={config.isAudioEnabled ? 'default' : 'outline'}
                onClick={() => setConfig(prev => ({ ...prev, isAudioEnabled: !prev.isAudioEnabled }))}
              >
                {config.isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </Button>
              <Button variant="outline" onClick={testAudioLevels}>
                Test Audio
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Device Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Device Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Permissions Status */}
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center space-x-2">
                    <Camera className="w-4 h-4" />
                    <span className="text-sm">Camera</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getPermissionIcon(permissionState.camera)}
                    <span className="text-sm capitalize">{permissionState.camera}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center space-x-2">
                    <Mic className="w-4 h-4" />
                    <span className="text-sm">Microphone</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getPermissionIcon(permissionState.microphone)}
                    <span className="text-sm capitalize">{permissionState.microphone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Camera Selection */}
            <div className="space-y-2">
              <Label>Camera</Label>
              <Select
                value={config.videoDeviceId}
                onValueChange={(value) => setConfig(prev => ({ ...prev, videoDeviceId: value }))}
                disabled={!config.isVideoEnabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select camera" />
                </SelectTrigger>
                <SelectContent>
                  {devices.cameras.map((camera) => (
                    <SelectItem key={camera.deviceId} value={camera.deviceId}>
                      {camera.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Microphone Selection */}
            <div className="space-y-2">
              <Label>Microphone</Label>
              <Select
                value={config.audioDeviceId}
                onValueChange={(value) => setConfig(prev => ({ ...prev, audioDeviceId: value }))}
                disabled={!config.isAudioEnabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select microphone" />
                </SelectTrigger>
                <SelectContent>
                  {devices.microphones.map((mic) => (
                    <SelectItem key={mic.deviceId} value={mic.deviceId}>
                      {mic.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Video Quality */}
            <div className="space-y-2">
              <Label>Video Quality</Label>
              <Select
                value={config.videoQuality}
                onValueChange={(value: 'low' | 'medium' | 'high') =>
                  setConfig(prev => ({ ...prev, videoQuality: value }))
                }
                disabled={!config.isVideoEnabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (640x480)</SelectItem>
                  <SelectItem value="medium">Medium (1280x720)</SelectItem>
                  <SelectItem value="high">High (1920x1080)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleJoinCall}
          disabled={isLoading || permissionState.camera === 'denied' || permissionState.microphone === 'denied'}
          className="min-w-32"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Setting up...
            </>
          ) : (
            'Join Call'
          )}
        </Button>
      </div>
    </div>
  )
}