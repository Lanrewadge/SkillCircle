import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Users,
  Calendar,
  TrendingUp,
  Award,
  Target,
  Clock,
  Star,
  ChevronRight,
  PlayCircle,
  GraduationCap,
  Briefcase,
  Brain,
  Zap,
  Globe,
  MessageCircle,
  Video,
  FileText,
  BarChart3,
  Bell,
  Search,
  Filter,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

interface LearningActivity {
  id: string;
  type: 'course' | 'session' | 'assessment' | 'project' | 'certification';
  title: string;
  description: string;
  progress?: number;
  dueDate?: Date;
  lastActivity?: Date;
  instructor?: string;
  status: 'active' | 'completed' | 'upcoming' | 'overdue';
  category: 'institutional' | 'marketplace';
  metadata?: {
    credits?: number;
    hours?: number;
    difficulty?: string;
    skills?: string[];
  };
}

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  progress: number;
  milestones: Array<{
    title: string;
    completed: boolean;
    dueDate: Date;
  }>;
  category: 'skill' | 'certification' | 'degree' | 'career';
}

interface MarketplaceConnection {
  id: string;
  type: 'tutor' | 'mentor' | 'study_group' | 'project_partner';
  name: string;
  avatar?: string;
  rating?: number;
  skills: string[];
  status: 'active' | 'scheduled' | 'completed';
  nextSession?: Date;
  totalSessions?: number;
}

interface LearningRecommendation {
  id: string;
  type: 'course' | 'tutor' | 'resource' | 'certification' | 'skill_path';
  title: string;
  description: string;
  reason: string;
  relevanceScore: number;
  category: 'institutional' | 'marketplace';
  urgency: 'high' | 'medium' | 'low';
  estimatedTime?: string;
  cost?: number;
}

const UnifiedLearningDashboard: React.FC = () => {
  const [activities, setActivities] = useState<LearningActivity[]>([]);
  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [connections, setConnections] = useState<MarketplaceConnection[]>([]);
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'institutional' | 'marketplace'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock unified dashboard data
      const mockActivities: LearningActivity[] = [
        {
          id: 'cs101-course',
          type: 'course',
          title: 'Introduction to Programming',
          description: 'CS101 - Computer Science Fundamentals',
          progress: 75,
          dueDate: new Date(2024, 5, 15),
          lastActivity: new Date(2024, 2, 10),
          instructor: 'Dr. Smith',
          status: 'active',
          category: 'institutional',
          metadata: {
            credits: 3,
            difficulty: 'beginner',
            skills: ['Python', 'Programming Logic', 'Problem Solving']
          }
        },
        {
          id: 'react-session',
          type: 'session',
          title: 'React Development Session',
          description: '1:1 tutoring session with Sarah Chen',
          dueDate: new Date(2024, 2, 15),
          lastActivity: new Date(2024, 2, 8),
          instructor: 'Sarah Chen',
          status: 'upcoming',
          category: 'marketplace',
          metadata: {
            hours: 2,
            difficulty: 'intermediate',
            skills: ['React', 'JavaScript', 'Web Development']
          }
        },
        {
          id: 'midterm-exam',
          type: 'assessment',
          title: 'Programming Fundamentals Midterm',
          description: 'Comprehensive exam covering first half of course',
          dueDate: new Date(2024, 2, 20),
          status: 'upcoming',
          category: 'institutional',
          metadata: {
            hours: 2,
            difficulty: 'intermediate'
          }
        },
        {
          id: 'portfolio-project',
          type: 'project',
          title: 'Personal Portfolio Website',
          description: 'Build a responsive portfolio using HTML, CSS, and JavaScript',
          progress: 60,
          dueDate: new Date(2024, 3, 1),
          lastActivity: new Date(2024, 2, 12),
          status: 'active',
          category: 'marketplace',
          metadata: {
            hours: 20,
            difficulty: 'intermediate',
            skills: ['HTML', 'CSS', 'JavaScript', 'Web Design']
          }
        },
        {
          id: 'python-cert',
          type: 'certification',
          title: 'Python Programming Certification',
          description: 'Industry-recognized Python certification',
          progress: 40,
          dueDate: new Date(2024, 4, 30),
          lastActivity: new Date(2024, 2, 5),
          status: 'active',
          category: 'marketplace',
          metadata: {
            hours: 50,
            difficulty: 'intermediate',
            skills: ['Python', 'Data Structures', 'OOP']
          }
        }
      ];

      const mockGoals: LearningGoal[] = [
        {
          id: 'cs-degree',
          title: 'Complete Computer Science Degree',
          description: 'Earn Bachelor of Science in Computer Science',
          targetDate: new Date(2028, 4, 15),
          progress: 35,
          category: 'degree',
          milestones: [
            { title: 'Complete Year 1', completed: false, dueDate: new Date(2024, 4, 15) },
            { title: 'Declare Major', completed: true, dueDate: new Date(2024, 0, 15) },
            { title: 'Complete Core Requirements', completed: false, dueDate: new Date(2026, 4, 15) }
          ]
        },
        {
          id: 'fullstack-dev',
          title: 'Become Full-Stack Developer',
          description: 'Master both frontend and backend development',
          targetDate: new Date(2024, 11, 31),
          progress: 65,
          category: 'career',
          milestones: [
            { title: 'Master React', completed: true, dueDate: new Date(2024, 2, 1) },
            { title: 'Learn Node.js', completed: false, dueDate: new Date(2024, 4, 1) },
            { title: 'Build Full-Stack Project', completed: false, dueDate: new Date(2024, 6, 1) }
          ]
        },
        {
          id: 'python-mastery',
          title: 'Python Programming Mastery',
          description: 'Achieve advanced proficiency in Python',
          targetDate: new Date(2024, 5, 30),
          progress: 80,
          category: 'skill',
          milestones: [
            { title: 'Complete Basic Python', completed: true, dueDate: new Date(2024, 0, 15) },
            { title: 'Master Data Structures', completed: true, dueDate: new Date(2024, 1, 15) },
            { title: 'Get Certified', completed: false, dueDate: new Date(2024, 4, 30) }
          ]
        }
      ];

      const mockConnections: MarketplaceConnection[] = [
        {
          id: 'sarah-chen',
          type: 'tutor',
          name: 'Sarah Chen',
          avatar: '/avatars/sarah.jpg',
          rating: 4.9,
          skills: ['React', 'JavaScript', 'Web Development'],
          status: 'scheduled',
          nextSession: new Date(2024, 2, 15),
          totalSessions: 8
        },
        {
          id: 'dev-study-group',
          type: 'study_group',
          name: 'Web Development Study Group',
          skills: ['HTML', 'CSS', 'JavaScript', 'React'],
          status: 'active',
          totalSessions: 12
        },
        {
          id: 'mike-mentor',
          type: 'mentor',
          name: 'Mike Rodriguez',
          avatar: '/avatars/mike.jpg',
          rating: 4.8,
          skills: ['Career Guidance', 'Software Engineering', 'Leadership'],
          status: 'active',
          nextSession: new Date(2024, 2, 18),
          totalSessions: 4
        }
      ];

      const mockRecommendations: LearningRecommendation[] = [
        {
          id: 'data-structures-course',
          type: 'course',
          title: 'Data Structures and Algorithms',
          description: 'Advanced CS course building on programming fundamentals',
          reason: 'Natural progression from your current CS studies',
          relevanceScore: 95,
          category: 'institutional',
          urgency: 'high',
          estimatedTime: '1 semester'
        },
        {
          id: 'nodejs-tutor',
          type: 'tutor',
          title: 'Node.js Backend Development Tutor',
          description: '1:1 tutoring to master server-side JavaScript',
          reason: 'Complements your frontend React skills',
          relevanceScore: 88,
          category: 'marketplace',
          urgency: 'medium',
          estimatedTime: '4-6 weeks',
          cost: 240
        },
        {
          id: 'aws-certification',
          type: 'certification',
          title: 'AWS Cloud Practitioner Certification',
          description: 'Entry-level cloud computing certification',
          reason: 'High demand skill in the job market',
          relevanceScore: 75,
          category: 'marketplace',
          urgency: 'low',
          estimatedTime: '2-3 months',
          cost: 100
        }
      ];

      setActivities(mockActivities);
      setGoals(mockGoals);
      setConnections(mockConnections);
      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'upcoming': return 'outline';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen className="w-4 h-4" />;
      case 'session': return <Video className="w-4 h-4" />;
      case 'assessment': return <FileText className="w-4 h-4" />;
      case 'project': return <Target className="w-4 h-4" />;
      case 'certification': return <Award className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getConnectionIcon = (type: string) => {
    switch (type) {
      case 'tutor': return <Users className="w-4 h-4" />;
      case 'mentor': return <Brain className="w-4 h-4" />;
      case 'study_group': return <Users className="w-4 h-4" />;
      case 'project_partner': return <Target className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntil = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || activity.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Learning Dashboard</h1>
            <p className="text-gray-600">Your unified learning experience across institutional and marketplace education</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Learning</p>
                  <p className="text-2xl font-bold">{activities.filter(a => a.status === 'active').length}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Goals Progress</p>
                  <p className="text-2xl font-bold">
                    {Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)}%
                  </p>
                </div>
                <Target className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Connections</p>
                  <p className="text-2xl font-bold">{connections.length}</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Recommendations</p>
                  <p className="text-2xl font-bold">{recommendations.length}</p>
                </div>
                <Zap className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Upcoming Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities
                  .filter(a => a.status === 'upcoming' || a.dueDate)
                  .sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0))
                  .slice(0, 5)
                  .map(activity => (
                    <div key={activity.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getActivityIcon(activity.type)}
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={activity.category === 'institutional' ? 'default' : 'secondary'}>
                          {activity.category}
                        </Badge>
                        {activity.dueDate && (
                          <p className="text-sm text-gray-600 mt-1">
                            {getDaysUntil(activity.dueDate)} days
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Learning Goals Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goals.slice(0, 3).map(goal => (
                    <div key={goal.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{goal.title}</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      <p className="text-xs text-gray-600 mt-1">
                        Target: {formatDate(goal.targetDate)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Recent Connections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {connections.slice(0, 3).map(connection => (
                    <div key={connection.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getConnectionIcon(connection.type)}
                        <div>
                          <p className="font-medium">{connection.name}</p>
                          <div className="flex items-center gap-1">
                            {connection.rating && (
                              <>
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="text-xs text-gray-600">{connection.rating}</span>
                              </>
                            )}
                            <Badge variant="outline" className="text-xs ml-2">
                              {connection.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {connection.nextSession && (
                        <div className="text-right text-xs text-gray-600">
                          Next: {formatDate(connection.nextSession)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search activities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-600" />
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All Sources</option>
                    <option value="institutional">Institutional</option>
                    <option value="marketplace">Marketplace</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activities List */}
          <div className="space-y-4">
            {filteredActivities.map(activity => (
              <Card key={activity.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <CardTitle className="text-lg">{activity.title}</CardTitle>
                        <CardDescription>{activity.description}</CardDescription>
                        {activity.instructor && (
                          <p className="text-sm text-gray-600 mt-1">
                            Instructor: {activity.instructor}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                      <Badge variant={activity.category === 'institutional' ? 'default' : 'secondary'}>
                        {activity.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activity.progress !== undefined && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{activity.progress}%</span>
                        </div>
                        <Progress value={activity.progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {activity.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Due: {formatDate(activity.dueDate)}
                          </div>
                        )}
                        {activity.metadata?.hours && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {activity.metadata.hours}h
                          </div>
                        )}
                        {activity.metadata?.credits && (
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            {activity.metadata.credits} credits
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {activity.type === 'session' && (
                          <Button size="sm" variant="outline">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        )}
                        <Button size="sm">
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Continue
                        </Button>
                      </div>
                    </div>

                    {activity.metadata?.skills && (
                      <div className="flex flex-wrap gap-1">
                        {activity.metadata.skills.map(skill => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          {goals.map(goal => (
            <Card key={goal.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      {goal.title}
                    </CardTitle>
                    <CardDescription>{goal.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{goal.category}</Badge>
                    <p className="text-sm text-gray-600 mt-1">
                      Target: {formatDate(goal.targetDate)}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Overall Progress</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-3" />
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  <h4 className="font-medium mb-3">Milestones</h4>
                  <div className="space-y-2">
                    {goal.milestones.map((milestone, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                        <div className="flex items-center gap-2">
                          {milestone.completed ? (
                            <Award className="w-4 h-4 text-green-500" />
                          ) : (
                            <Clock className="w-4 h-4 text-gray-400" />
                          )}
                          <span className={milestone.completed ? 'line-through text-gray-500' : ''}>
                            {milestone.title}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatDate(milestone.dueDate)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="connections" className="space-y-4">
          <div className="grid gap-4">
            {connections.map(connection => (
              <Card key={connection.id}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        {getConnectionIcon(connection.type)}
                      </div>
                      <div>
                        <h3 className="font-medium">{connection.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{connection.type}</Badge>
                          {connection.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-sm">{connection.rating}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {connection.skills.slice(0, 3).map(skill => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getStatusColor(connection.status)}>
                        {connection.status}
                      </Badge>
                      {connection.nextSession && (
                        <p className="text-sm text-gray-600 mt-1">
                          Next: {formatDate(connection.nextSession)}
                        </p>
                      )}
                      {connection.totalSessions && (
                        <p className="text-xs text-gray-500">
                          {connection.totalSessions} sessions
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {recommendations.map(rec => (
            <Card key={rec.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {rec.type === 'course' && <BookOpen className="w-5 h-5" />}
                      {rec.type === 'tutor' && <Users className="w-5 h-5" />}
                      {rec.type === 'certification' && <Award className="w-5 h-5" />}
                      {rec.title}
                    </CardTitle>
                    <CardDescription>{rec.description}</CardDescription>
                    <p className="text-sm text-blue-600 mt-2">{rec.reason}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={rec.urgency === 'high' ? 'destructive' : rec.urgency === 'medium' ? 'secondary' : 'outline'}>
                      {rec.urgency} priority
                    </Badge>
                    <Badge variant={rec.category === 'institutional' ? 'default' : 'secondary'}>
                      {rec.category}
                    </Badge>
                    <div className="text-sm text-gray-600">
                      Match: {rec.relevanceScore}%
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {rec.estimatedTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {rec.estimatedTime}
                      </div>
                    )}
                    {rec.cost && (
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        ${rec.cost}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                    <Button size="sm">
                      Get Started
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedLearningDashboard;