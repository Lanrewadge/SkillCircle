'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, KeyRound } from 'lucide-react'

interface TwoFactorVerificationProps {
  email: string
  tempToken: string
  onVerificationSuccess: (token: string, user: any) => void
  onCancel: () => void
}

export default function TwoFactorVerification({
  email,
  tempToken,
  onVerificationSuccess,
  onCancel
}: TwoFactorVerificationProps) {
  const [verificationCode, setVerificationCode] = useState('')
  const [backupCode, setBackupCode] = useState('')
  const [useBackupCode, setUseBackupCode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleVerify = async () => {
    if (!useBackupCode && (!verificationCode || verificationCode.length !== 6)) {
      setError('Please enter a valid 6-digit code')
      return
    }

    if (useBackupCode && !backupCode.trim()) {
      setError('Please enter a backup code')
      return
    }

    setLoading(true)
    setError('')

    try {
      if (useBackupCode) {
        // Verify backup code
        const response = await fetch('/api/auth/2fa/backup-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            backupCode: backupCode.trim()
          }),
        })

        const data = await response.json()

        if (data.success) {
          onVerificationSuccess(data.token, data.user)
        } else {
          setError(data.message || 'Invalid backup code')
        }
      } else {
        // Verify TOTP code
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password: 'temp', // In real app, store temporarily or use temp token
            twoFactorCode: verificationCode
          }),
        })

        const data = await response.json()

        if (data.success) {
          onVerificationSuccess(data.token, data.user)
        } else {
          setError(data.message || 'Invalid verification code')
        }
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCodeInput = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 6)
    setVerificationCode(numericValue)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
          {useBackupCode ? (
            <KeyRound className="h-6 w-6 text-blue-600" />
          ) : (
            <Shield className="h-6 w-6 text-blue-600" />
          )}
        </div>
        <CardTitle>
          {useBackupCode ? 'Enter Backup Code' : 'Two-Factor Authentication'}
        </CardTitle>
        <CardDescription>
          {useBackupCode
            ? 'Enter one of your backup codes to sign in'
            : 'Enter the code from your authenticator app'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center text-sm text-gray-600 mb-4">
          Signing in as: <strong>{email}</strong>
        </div>

        {!useBackupCode ? (
          <div className="space-y-3">
            <Label htmlFor="verification-code">Authentication Code</Label>
            <Input
              id="verification-code"
              type="text"
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => handleCodeInput(e.target.value)}
              className="text-center text-lg font-mono tracking-widest"
              maxLength={6}
              autoComplete="one-time-code"
              autoFocus
            />
            <p className="text-xs text-gray-500 text-center">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <Label htmlFor="backup-code">Backup Code</Label>
            <Input
              id="backup-code"
              type="text"
              placeholder="Enter backup code"
              value={backupCode}
              onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
              className="text-center text-sm font-mono tracking-wider"
              autoComplete="off"
              autoFocus
            />
            <p className="text-xs text-gray-500 text-center">
              Enter one of your saved backup codes
            </p>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <Button
            onClick={handleVerify}
            disabled={loading || (!useBackupCode && verificationCode.length !== 6) || (useBackupCode && !backupCode.trim())}
            className="w-full"
          >
            {loading ? 'Verifying...' : 'Verify and Sign In'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setUseBackupCode(!useBackupCode)
                setVerificationCode('')
                setBackupCode('')
                setError('')
              }}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              {useBackupCode
                ? 'Use authenticator app instead'
                : 'Use backup code instead'
              }
            </button>
          </div>

          <Button onClick={onCancel} variant="outline" className="w-full">
            Cancel
          </Button>
        </div>

        <div className="text-center text-xs text-gray-500">
          <p>Having trouble? Contact support for help accessing your account.</p>
        </div>
      </CardContent>
    </Card>
  )
}