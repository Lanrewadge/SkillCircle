'use client'

import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  User,
  MapPin,
  Star,
  Calendar,
  Clock,
  BookOpen,
  Edit3,
  Camera,
  Settings,
  Award,
  DollarSign
} from 'lucide-react'

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    city: user?.city || '',
    country: user?.country || ''
  })

  const handleSave = async () => {
    updateUser(formData)
    setIsEditing(false)
    // TODO: Call API to update user profile
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  // Mock data for skills and reviews
  const mockSkills = [
    {
      id: 1,
      name: 'React Development',
      level: 'Expert',
      students: 24,
      rating: 4.8,
      hourlyRate: 75,
      category: 'Technology'
    },
    {
      id: 2,
      name: 'Python Programming',
      level: 'Advanced',
      students: 18,
      rating: 4.7,
      hourlyRate: 65,
      category: 'Technology'
    }
  ]

  const mockReviews = [
    {
      id: 1,
      rating: 5,
      comment: 'Alice is an amazing React teacher! She explains complex concepts clearly.',
      student: 'John Smith',
      date: '2024-01-15',
      skill: 'React Development'
    },
    {
      id: 2,
      rating: 5,
      comment: 'Great Python lessons. Very patient and knowledgeable.',
      student: 'Sarah Johnson',
      date: '2024-01-10',
      skill: 'Python Programming'
    },
    {
      id: 3,
      rating: 4,
      comment: 'Learned a lot about advanced React patterns. Highly recommend!',
      student: 'Mike Davis',
      date: '2024-01-05',
      skill: 'React Development'
    }
  ]

  const mockStats = {
    totalStudents: 42,
    totalSessions: 156,
    totalEarnings: 8540,
    avgRating: 4.8,
    completionRate: 98
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="text-2xl">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                {user?.verified && (
                  <Badge className="bg-green-100 text-green-800">
                    <Award className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
                <Badge variant="outline">
                  {user?.isTeacher ? 'Teacher' : 'Student'}
                </Badge>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Input
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData({...formData, bio: e.target.value})}
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                          />
                        </div>
                        <div className="flex-1">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={formData.country}
                            onChange={(e) => setFormData({...formData, country: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
                      <p className="text-gray-600 mt-2">{user?.bio || 'No bio yet'}</p>
                      <div className="flex items-center space-x-4 mt-4">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {user?.city}, {user?.country}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Joined {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{mockStats.totalStudents}</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{mockStats.totalSessions}</div>
                  <div className="text-sm text-gray-600">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">${mockStats.totalEarnings}</div>
                  <div className="text-sm text-gray-600">Earned</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-2xl font-bold text-yellow-600">{mockStats.avgRating}</span>
                  </div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{mockStats.completionRate}%</div>
                  <div className="text-sm text-gray-600">Completion</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Content */}
      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="skills">My Skills</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Skills I Teach</CardTitle>
                  <CardDescription>
                    Manage your teaching skills and set your rates
                  </CardDescription>
                </div>
                <Button>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {mockSkills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold">{skill.name}</h3>
                        <Badge variant="secondary">{skill.category}</Badge>
                        <Badge variant="outline">{skill.level}</Badge>
                      </div>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {skill.students} students
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{skill.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium">${skill.hourlyRate}/hr</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Reviews</CardTitle>
              <CardDescription>
                See what your students are saying about your teaching
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockReviews.map((review) => (
                  <div key={review.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {review.student.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-medium">{review.student}</h4>
                          <p className="text-sm text-gray-600">{review.skill}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Receive notifications about new messages and bookings</p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Privacy Settings</h3>
                  <p className="text-sm text-gray-600">Control who can see your profile and contact you</p>
                </div>
                <Button variant="outline">Manage</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Payment Methods</h3>
                  <p className="text-sm text-gray-600">Manage how you receive payments</p>
                </div>
                <Button variant="outline">Update</Button>
              </div>
              <div className="pt-4 border-t">
                <Button variant="destructive">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}