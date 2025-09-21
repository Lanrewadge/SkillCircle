import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  AlertCircle,
  Target,
  Star,
  BookOpen,
  Award,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Play,
  Pause,
  SkipForward,
  Flag,
  MapPin,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Milestone {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'semester' | 'year' | 'graduation' | 'internship' | 'project';
  date: Date;
  estimatedDate?: Date;
  status: 'completed' | 'in_progress' | 'upcoming' | 'overdue';
  progress?: number;
  requirements: string[];
  dependencies?: string[];
  rewards?: {
    credits?: number;
    certificates?: string[];
    skills?: string[];
    achievements?: string[];
  };
  metadata?: {
    courseCode?: string;
    instructor?: string;
    location?: string;
    duration?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  };
}

interface TimelineData {
  courseId: string;
  courseName: string;
  totalDuration: string;
  startDate: Date;
  expectedEndDate: Date;
  currentProgress: number;
  milestones: Milestone[];
  criticalPath: string[];
  upcomingDeadlines: Array<{
    milestoneId: string;
    daysRemaining: number;
    priority: 'high' | 'medium' | 'low';
  }>;
}

const InteractiveCourseTimeline: React.FC<{ courseId: string }> = ({ courseId }) => {
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar' | 'gantt'>('timeline');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimelineData();
  }, [courseId]);

  const fetchTimelineData = async () => {
    try {
      setLoading(true);
      // Mock timeline data - in a real app, this would come from the API
      const mockData: TimelineData = {
        courseId: 'computer-science',
        courseName: 'Computer Science',
        totalDuration: '4 years',
        startDate: new Date(2024, 0, 15), // January 15, 2024
        expectedEndDate: new Date(2028, 4, 15), // May 15, 2028
        currentProgress: 35,
        criticalPath: ['freshman-fall', 'freshman-spring', 'sophomore-fall'],
        upcomingDeadlines: [
          { milestoneId: 'cs102-final', daysRemaining: 14, priority: 'high' },
          { milestoneId: 'math142', daysRemaining: 28, priority: 'medium' }
        ],
        milestones: [
          // Freshman Year
          {
            id: 'freshman-fall',
            title: 'Freshman Fall Semester',
            description: 'Complete foundational courses in programming and mathematics',
            type: 'semester',
            date: new Date(2024, 0, 15),
            status: 'completed',
            progress: 100,
            requirements: ['CS101', 'MATH141', 'ENG101'],
            rewards: {
              credits: 15,
              skills: ['Programming Basics', 'Mathematical Foundations'],
              achievements: ['First Semester Complete']
            }
          },
          {
            id: 'cs101-complete',
            title: 'Introduction to Programming',
            description: 'Master basic programming concepts and syntax',
            type: 'course',
            date: new Date(2024, 3, 20),
            status: 'completed',
            progress: 100,
            requirements: ['Complete all assignments', 'Pass final exam', 'Submit final project'],
            metadata: {
              courseCode: 'CS101',
              instructor: 'Dr. Smith',
              duration: '16 weeks',
              difficulty: 'beginner'
            },
            rewards: {
              credits: 3,
              skills: ['Python Programming', 'Problem Solving'],
              certificates: ['Programming Fundamentals Certificate']
            }
          },
          {
            id: 'freshman-spring',
            title: 'Freshman Spring Semester',
            description: 'Build on programming fundamentals with OOP and advanced math',
            type: 'semester',
            date: new Date(2024, 4, 15),
            status: 'in_progress',
            progress: 75,
            requirements: ['CS102', 'MATH142', 'PHYS101'],
            dependencies: ['freshman-fall']
          },
          {
            id: 'cs102-final',
            title: 'Object-Oriented Programming Final',
            description: 'Complete final project demonstrating OOP mastery',
            type: 'project',
            date: new Date(2024, 11, 15),
            estimatedDate: new Date(2024, 11, 10),
            status: 'in_progress',
            progress: 75,
            requirements: ['Design class hierarchy', 'Implement polymorphism', 'Create user interface'],
            metadata: {
              courseCode: 'CS102',
              instructor: 'Dr. Johnson',
              difficulty: 'intermediate'
            },
            rewards: {
              credits: 3,
              skills: ['Object-Oriented Design', 'Software Architecture'],
              achievements: ['OOP Master']
            }
          },
          // Sophomore Year
          {
            id: 'sophomore-fall',
            title: 'Sophomore Fall Semester',
            description: 'Advanced data structures and algorithms',
            type: 'semester',
            date: new Date(2024, 7, 20),
            status: 'upcoming',
            requirements: ['CS201', 'CS202', 'MATH241'],
            dependencies: ['freshman-spring']
          },
          {
            id: 'data-structures',
            title: 'Data Structures Mastery',
            description: 'Implement and analyze fundamental data structures',
            type: 'course',
            date: new Date(2024, 11, 20),
            status: 'upcoming',
            requirements: ['Implement trees', 'Hash table optimization', 'Graph algorithms'],
            metadata: {
              courseCode: 'CS201',
              difficulty: 'intermediate'
            }
          },
          // Junior Year
          {
            id: 'internship-summer',
            title: 'Summer Internship',
            description: 'Apply skills in real-world software development environment',
            type: 'internship',
            date: new Date(2025, 5, 1),
            status: 'upcoming',
            requirements: ['Complete application', 'Technical interviews', '3 months commitment'],
            rewards: {
              skills: ['Industry Experience', 'Professional Development'],
              achievements: ['Industry Ready']
            }
          },
          // Senior Year
          {
            id: 'capstone-project',
            title: 'Senior Capstone Project',
            description: 'Design and implement a comprehensive software system',
            type: 'project',
            date: new Date(2026, 4, 1),
            status: 'upcoming',
            requirements: ['Project proposal', 'System design', 'Implementation', 'Presentation'],
            rewards: {
              achievements: ['Project Leader', 'Innovation Award']
            }
          },
          {
            id: 'graduation',
            title: 'Graduation',
            description: 'Complete Bachelor of Science in Computer Science',
            type: 'graduation',
            date: new Date(2028, 4, 15),
            status: 'upcoming',
            requirements: ['120 credits', 'GPA ≥ 2.0', 'Capstone project'],
            rewards: {
              certificates: ['BS Computer Science Degree'],
              achievements: ['Graduate']
            }
          }
        ]
      };

      setTimelineData(mockData);
    } catch (error) {
      console.error('Error fetching timeline data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMilestoneIcon = (milestone: Milestone) => {
    switch (milestone.type) {
      case 'course':
        return <BookOpen className="w-4 h-4" />;
      case 'semester':
        return <Calendar className="w-4 h-4" />;
      case 'year':
        return <Target className="w-4 h-4" />;
      case 'graduation':
        return <Award className="w-4 h-4" />;
      case 'internship':
        return <Zap className="w-4 h-4" />;
      case 'project':
        return <Flag className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Play className="w-5 h-5 text-blue-500" />;
      case 'upcoming':
        return <Circle className="w-5 h-5 text-gray-400" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-50';
      case 'in_progress':
        return 'border-blue-500 bg-blue-50';
      case 'upcoming':
        return 'border-gray-300 bg-gray-50';
      case 'overdue':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDaysFromNow = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredMilestones = timelineData?.milestones.filter(milestone => {
    if (filterStatus === 'all') return true;
    return milestone.status === filterStatus;
  }) || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!timelineData) {
    return <div>No timeline data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{timelineData.courseName} Timeline</CardTitle>
              <CardDescription>
                {formatDate(timelineData.startDate)} - {formatDate(timelineData.expectedEndDate)}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{timelineData.currentProgress}%</div>
              <div className="text-sm text-gray-600">Overall Progress</div>
            </div>
          </div>
          <Progress value={timelineData.currentProgress} className="h-3" />
        </CardHeader>
      </Card>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">View:</span>
          <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <TabsList>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="gantt">Gantt</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Milestones</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="upcoming">Upcoming</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Upcoming Deadlines Alert */}
      {timelineData.upcomingDeadlines.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="w-5 h-5" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {timelineData.upcomingDeadlines.map(deadline => {
                const milestone = timelineData.milestones.find(m => m.id === deadline.milestoneId);
                return (
                  <div key={deadline.milestoneId} className="flex items-center justify-between">
                    <span className="font-medium">{milestone?.title}</span>
                    <Badge variant={deadline.priority === 'high' ? 'destructive' : deadline.priority === 'medium' ? 'secondary' : 'outline'}>
                      {deadline.daysRemaining} days
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline View */}
      <TabsContent value="timeline" className="space-y-4">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>

          {filteredMilestones.map((milestone, index) => (
            <div key={milestone.id} className="relative flex items-start space-x-4 pb-8">
              {/* Timeline Node */}
              <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 ${getStatusColor(milestone.status)}`}>
                {getStatusIcon(milestone.status)}
              </div>

              {/* Milestone Card */}
              <Card className={`flex-1 cursor-pointer transition-all ${
                selectedMilestone === milestone.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
              }`} onClick={() => setSelectedMilestone(selectedMilestone === milestone.id ? null : milestone.id)}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getMilestoneIcon(milestone)}
                        {milestone.title}
                      </CardTitle>
                      <CardDescription>{milestone.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{milestone.type}</Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDate(milestone.date)}
                      </p>
                      {milestone.estimatedDate && milestone.status === 'in_progress' && (
                        <p className="text-xs text-blue-600">
                          Est: {formatDate(milestone.estimatedDate)}
                        </p>
                      )}
                    </div>
                  </div>

                  {milestone.progress !== undefined && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{milestone.progress}%</span>
                      </div>
                      <Progress value={milestone.progress} className="h-2" />
                    </div>
                  )}
                </CardHeader>

                {/* Expanded Details */}
                {selectedMilestone === milestone.id && (
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Requirements */}
                      <div>
                        <h4 className="font-medium mb-2">Requirements</h4>
                        <ul className="space-y-1">
                          {milestone.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-center text-sm">
                              <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Metadata */}
                      {milestone.metadata && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {milestone.metadata.courseCode && (
                            <div>
                              <span className="text-gray-600">Course Code:</span>
                              <p className="font-medium">{milestone.metadata.courseCode}</p>
                            </div>
                          )}
                          {milestone.metadata.instructor && (
                            <div>
                              <span className="text-gray-600">Instructor:</span>
                              <p className="font-medium">{milestone.metadata.instructor}</p>
                            </div>
                          )}
                          {milestone.metadata.duration && (
                            <div>
                              <span className="text-gray-600">Duration:</span>
                              <p className="font-medium">{milestone.metadata.duration}</p>
                            </div>
                          )}
                          {milestone.metadata.difficulty && (
                            <div>
                              <span className="text-gray-600">Difficulty:</span>
                              <Badge variant="outline" className="ml-1">
                                {milestone.metadata.difficulty}
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Rewards */}
                      {milestone.rewards && (
                        <div>
                          <h4 className="font-medium mb-2">Rewards</h4>
                          <div className="flex flex-wrap gap-2">
                            {milestone.rewards.credits && (
                              <Badge variant="secondary">{milestone.rewards.credits} Credits</Badge>
                            )}
                            {milestone.rewards.skills?.map(skill => (
                              <Badge key={skill} variant="outline">{skill}</Badge>
                            ))}
                            {milestone.rewards.achievements?.map(achievement => (
                              <Badge key={achievement} variant="default" className="bg-yellow-100 text-yellow-800">
                                🏆 {achievement}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        {milestone.status === 'in_progress' && (
                          <>
                            <Button size="sm">
                              <Play className="w-4 h-4 mr-2" />
                              Continue
                            </Button>
                            <Button size="sm" variant="outline">
                              <Pause className="w-4 h-4 mr-2" />
                              Mark Complete
                            </Button>
                          </>
                        )}
                        {milestone.status === 'upcoming' && (
                          <Button size="sm" variant="outline">
                            <SkipForward className="w-4 h-4 mr-2" />
                            Start Early
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          ))}
        </div>
      </TabsContent>

      {/* Calendar View */}
      <TabsContent value="calendar">
        <Card>
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
            <CardDescription>
              View milestones in calendar format (Coming Soon)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">Calendar view will be implemented here</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Gantt View */}
      <TabsContent value="gantt">
        <Card>
          <CardHeader>
            <CardTitle>Gantt Chart</CardTitle>
            <CardDescription>
              Project timeline with dependencies (Coming Soon)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">Gantt chart will be implemented here</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
};

export default InteractiveCourseTimeline;