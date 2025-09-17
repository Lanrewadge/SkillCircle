'use client'

import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Bell,
  Mail,
  MessageCircle,
  Calendar,
  CreditCard,
  Shield,
  Globe,
  Smartphone,
  Volume2,
  Eye,
  Lock,
  Trash2,
  Download,
  Settings as SettingsIcon
} from 'lucide-react'

interface NotificationSettings {
  email: {
    newMessages: boolean
    sessionReminders: boolean
    paymentUpdates: boolean
    weeklyDigest: boolean
    marketingEmails: boolean
  }
  push: {
    newMessages: boolean
    sessionReminders: boolean
    paymentUpdates: boolean
    sessionRequests: boolean
  }
  inApp: {
    newMessages: boolean
    sessionUpdates: boolean
    systemUpdates: boolean
  }
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends'
  showEmail: boolean
  showLocation: boolean
  showActivity: boolean
  searchable: boolean
}

export default function SettingsPage() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('notifications')

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: {
      newMessages: true,
      sessionReminders: true,
      paymentUpdates: true,
      weeklyDigest: false,
      marketingEmails: false
    },
    push: {
      newMessages: true,
      sessionReminders: true,
      paymentUpdates: true,
      sessionRequests: true
    },
    inApp: {
      newMessages: true,
      sessionUpdates: true,
      systemUpdates: true
    }
  })

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showEmail: false,
    showLocation: true,
    showActivity: true,
    searchable: true
  })

  const updateNotificationSetting = (category: keyof NotificationSettings, setting: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }))
  }

  const updatePrivacySetting = (setting: keyof PrivacySettings, value: any) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account preferences and privacy settings
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Notifications
              </CardTitle>
              <CardDescription>
                Choose what email notifications you'd like to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">New Messages</Label>
                  <p className="text-xs text-muted-foreground">Get notified when someone sends you a message</p>
                </div>
                <Switch
                  checked={notificationSettings.email.newMessages}
                  onCheckedChange={(checked) => updateNotificationSetting('email', 'newMessages', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Session Reminders</Label>
                  <p className="text-xs text-muted-foreground">Reminders about upcoming sessions</p>
                </div>
                <Switch
                  checked={notificationSettings.email.sessionReminders}
                  onCheckedChange={(checked) => updateNotificationSetting('email', 'sessionReminders', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Payment Updates</Label>
                  <p className="text-xs text-muted-foreground">Updates about payments and earnings</p>
                </div>
                <Switch
                  checked={notificationSettings.email.paymentUpdates}
                  onCheckedChange={(checked) => updateNotificationSetting('email', 'paymentUpdates', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Weekly Digest</Label>
                  <p className="text-xs text-muted-foreground">Weekly summary of your activity</p>
                </div>
                <Switch
                  checked={notificationSettings.email.weeklyDigest}
                  onCheckedChange={(checked) => updateNotificationSetting('email', 'weeklyDigest', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Marketing Emails</Label>
                  <p className="text-xs text-muted-foreground">Tips, features, and promotional content</p>
                </div>
                <Switch
                  checked={notificationSettings.email.marketingEmails}
                  onCheckedChange={(checked) => updateNotificationSetting('email', 'marketingEmails', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Push Notifications
              </CardTitle>
              <CardDescription>
                Manage push notifications on your devices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">New Messages</Label>
                  <p className="text-xs text-muted-foreground">Instant notifications for new messages</p>
                </div>
                <Switch
                  checked={notificationSettings.push.newMessages}
                  onCheckedChange={(checked) => updateNotificationSetting('push', 'newMessages', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Session Requests</Label>
                  <p className="text-xs text-muted-foreground">When someone requests a session with you</p>
                </div>
                <Switch
                  checked={notificationSettings.push.sessionRequests}
                  onCheckedChange={(checked) => updateNotificationSetting('push', 'sessionRequests', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Session Reminders</Label>
                  <p className="text-xs text-muted-foreground">Reminders 30 minutes before sessions</p>
                </div>
                <Switch
                  checked={notificationSettings.push.sessionReminders}
                  onCheckedChange={(checked) => updateNotificationSetting('push', 'sessionReminders', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                In-App Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">New Messages</Label>
                <Switch
                  checked={notificationSettings.inApp.newMessages}
                  onCheckedChange={(checked) => updateNotificationSetting('inApp', 'newMessages', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Session Updates</Label>
                <Switch
                  checked={notificationSettings.inApp.sessionUpdates}
                  onCheckedChange={(checked) => updateNotificationSetting('inApp', 'sessionUpdates', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">System Updates</Label>
                <Switch
                  checked={notificationSettings.inApp.systemUpdates}
                  onCheckedChange={(checked) => updateNotificationSetting('inApp', 'systemUpdates', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Profile Visibility
              </CardTitle>
              <CardDescription>
                Control who can see your profile and information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Profile Visibility</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={privacySettings.profileVisibility === 'public' ? 'default' : 'outline'}
                    onClick={() => updatePrivacySetting('profileVisibility', 'public')}
                    className="text-sm"
                  >
                    Public
                  </Button>
                  <Button
                    variant={privacySettings.profileVisibility === 'private' ? 'default' : 'outline'}
                    onClick={() => updatePrivacySetting('profileVisibility', 'private')}
                    className="text-sm"
                  >
                    Private
                  </Button>
                  <Button
                    variant={privacySettings.profileVisibility === 'friends' ? 'default' : 'outline'}
                    onClick={() => updatePrivacySetting('profileVisibility', 'friends')}
                    className="text-sm"
                  >
                    Friends Only
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Show Email Address</Label>
                  <p className="text-xs text-muted-foreground">Allow others to see your email</p>
                </div>
                <Switch
                  checked={privacySettings.showEmail}
                  onCheckedChange={(checked) => updatePrivacySetting('showEmail', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Show Location</Label>
                  <p className="text-xs text-muted-foreground">Display your city and country</p>
                </div>
                <Switch
                  checked={privacySettings.showLocation}
                  onCheckedChange={(checked) => updatePrivacySetting('showLocation', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Show Activity Status</Label>
                  <p className="text-xs text-muted-foreground">Let others see when you're online</p>
                </div>
                <Switch
                  checked={privacySettings.showActivity}
                  onCheckedChange={(checked) => updatePrivacySetting('showActivity', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Searchable Profile</Label>
                  <p className="text-xs text-muted-foreground">Allow your profile to appear in search results</p>
                </div>
                <Switch
                  checked={privacySettings.searchable}
                  onCheckedChange={(checked) => updatePrivacySetting('searchable', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Change Password</Label>
                  <p className="text-xs text-muted-foreground">Update your account password</p>
                </div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Badge variant="outline">Not Enabled</Badge>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Active Sessions</Label>
                  <p className="text-xs text-muted-foreground">Manage your logged in devices</p>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Deactivate Account</Label>
                  <p className="text-xs text-muted-foreground">Temporarily disable your account</p>
                </div>
                <Button variant="outline" size="sm">
                  Deactivate
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-red-600">Delete Account</Label>
                  <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Data Export
              </CardTitle>
              <CardDescription>
                Download your data and activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Profile Data</Label>
                  <p className="text-xs text-muted-foreground">Your profile information and settings</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Session History</Label>
                  <p className="text-xs text-muted-foreground">All your teaching and learning sessions</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Payment History</Label>
                  <p className="text-xs text-muted-foreground">Transaction and earning records</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Message History</Label>
                  <p className="text-xs text-muted-foreground">All your conversations</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Usage</CardTitle>
              <CardDescription>
                Overview of your account data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">47</div>
                  <div className="text-xs text-muted-foreground">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">152</div>
                  <div className="text-xs text-muted-foreground">Messages</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-xs text-muted-foreground">Skills</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">2.3GB</div>
                  <div className="text-xs text-muted-foreground">Storage</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  )
}