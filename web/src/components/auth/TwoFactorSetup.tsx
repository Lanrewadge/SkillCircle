'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { QrCode, Copy, Check, Shield } from 'lucide-react'

interface TwoFactorSetupProps {
  onSetupComplete: () => void
  onCancel: () => void
}

export default function TwoFactorSetup({ onSetupComplete, onCancel }: TwoFactorSetupProps) {
  const [step, setStep] = useState<'setup' | 'verify'>('setup')
  const [qrData, setQrData] = useState<{
    secret: string
    qrCodeUrl: string
    manualEntryKey: string
    backupCodes: string[]
  } | null>(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedSecret, setCopiedSecret] = useState(false)
  const [copiedBackupCodes, setCopiedBackupCodes] = useState(false)

  const handleSetup2FA = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com' // In real app, get from auth context
        }),
      })

      const data = await response.json()

      if (data.success) {
        setQrData(data.data)
        setStep('verify')
      } else {
        setError(data.message || 'Failed to setup 2FA')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com', // In real app, get from auth context
          token: verificationCode,
          secret: qrData?.secret
        }),
      })

      const data = await response.json()

      if (data.success) {
        onSetupComplete()
      } else {
        setError(data.message || 'Invalid verification code')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, type: 'secret' | 'backup') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'secret') {
        setCopiedSecret(true)
        setTimeout(() => setCopiedSecret(false), 2000)
      } else {
        setCopiedBackupCodes(true)
        setTimeout(() => setCopiedBackupCodes(false), 2000)
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  if (step === 'setup') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle>Set Up Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account with 2FA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Two-factor authentication adds an extra layer of security to your account.
              You'll need to enter a code from your authenticator app each time you sign in.
            </p>

            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">What you'll need:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• An authenticator app (Google Authenticator, Authy, etc.)</li>
                <li>• Your mobile device</li>
                <li>• A few minutes to complete setup</li>
              </ul>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-3">
            <Button onClick={onCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSetup2FA} disabled={loading} className="flex-1">
              {loading ? 'Setting up...' : 'Get Started'}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
          <QrCode className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle>Scan QR Code</CardTitle>
        <CardDescription>
          Use your authenticator app to scan this QR code
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {qrData && (
          <>
            {/* QR Code Section */}
            <div className="text-center space-y-4">
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                <img
                  src={qrData.qrCodeUrl}
                  alt="2FA QR Code"
                  className="w-48 h-48 mx-auto bg-gray-100 rounded"
                />
              </div>

              {/* Manual Entry */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Can't scan? Enter this code manually:</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={qrData.manualEntryKey}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(qrData.manualEntryKey, 'secret')}
                  >
                    {copiedSecret ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Backup Codes */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Backup Codes (Save these safely):</Label>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                  {qrData.backupCodes.map((code, index) => (
                    <div key={index} className="text-center p-1 bg-white rounded">
                      {code}
                    </div>
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => copyToClipboard(qrData.backupCodes.join('\n'), 'backup')}
                >
                  {copiedBackupCodes ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy All Backup Codes
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Verification */}
            <div className="space-y-3">
              <Label htmlFor="verification-code">Enter verification code from your app:</Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-lg font-mono tracking-widest"
                maxLength={6}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex space-x-3">
              <Button onClick={onCancel} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleVerify2FA}
                disabled={loading || verificationCode.length !== 6}
                className="flex-1"
              >
                {loading ? 'Verifying...' : 'Complete Setup'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}