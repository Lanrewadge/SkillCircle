import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  Award,
  TrendingUp,
  Target,
  CheckCircle,
  AlertCircle,
  Star,
  GraduationCap,
  ChevronRight,
  Progress,
  Users,
  Brain,
  Trophy,
  Play,
  Pause,
  RotateCcw,
  BarChart3
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EnrolledCourse {
  id: string;
  course: any;
  enrolledAt: Date;
  progress: {
    overallProgress: number;
    currentYear: number;
    currentSemester: number;
    completedCourses: number;
    totalCourses: number;
    gpa: number;
    creditsEarned: number;
    creditsRequired: number;
  };
  currentCourse: {
    code: string;
    title: string;
    progress: number;
    dueDate: Date;
  };
  nextMilestone: {
    title: string;
    description: string;
    dueDate: Date;
    progress: number;
  };
}

interface DetailedProgress {
  courseId: string;
  userId: string;
  enrolledAt: Date;
  overallProgress: number;
  currentYear: number;
  currentSemester: number;
  academicRecord: {
    gpa: number;
    creditsEarned: number;
    creditsRequired: number;
    expectedGraduation: Date;
  };
  yearProgress: Array<{
    year: number;
    title: string;
    progress: number;
    semesters: Array<{
      semester: number;
      completed: boolean;
      progress?: number;
      gpa?: number;
      courses: Array<{
        code: string;
        title: string;
        credits: number;
        grade?: string;
        completed: boolean;
        progress?: number;
        finalScore?: number;
        assignments?: {
          completed: number;
          total: number;
          averageScore: number;
        };
      }>;
    }>;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    earnedAt: Date;
    icon: string;
  }>;
  upcomingDeadlines: Array<{
    type: string;
    title: string;
    courseCode: string;
    dueDate: Date;
    priority: string;
  }>;
}

const CourseProgressDashboard: React.FC = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [detailedProgress, setDetailedProgress] = useState<DetailedProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchDetailedProgress(selectedCourse);
    }
  }, [selectedCourse]);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await fetch('/api/learning/my-courses');
      const data = await response.json();
      if (data.success) {
        setEnrolledCourses(data.data);
        if (data.data.length > 0) {
          setSelectedCourse(data.data[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedProgress = async (courseId: string) => {
    try {
      const response = await fetch(`/api/learning/courses/${courseId}/progress`);
      const data = await response.json();
      if (data.success) {
        setDetailedProgress(data.data);
      }
    } catch (error) {
      console.error('Error fetching detailed progress:', error);
    }
  };

  const updateCourseProgress = async (courseId: string, courseCode: string, progress: number, action?: string) => {
    try {
      const response = await fetch(`/api/learning/courses/${courseId}/courses/${courseCode}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ progress, action }),
      });

      const data = await response.json();
      if (data.success) {
        // Refresh the detailed progress
        fetchDetailedProgress(courseId);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntil = (date: Date | string) => {
    const now = new Date();
    const target = new Date(date);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade?.startsWith('A')) return 'text-green-600';
    if (grade?.startsWith('B')) return 'text-blue-600';
    if (grade?.startsWith('C')) return 'text-yellow-600';
    if (grade?.startsWith('D')) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (enrolledCourses.length === 0) {
    return (
      <div className="text-center py-12">
        <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Enrolled Courses</h3>
        <p className="text-gray-600 mb-4">Start your academic journey by enrolling in institutional courses</p>
        <Button>Browse Courses</Button>
      </div>
    );
  }

  const selectedEnrollment = enrolledCourses.find(course => course.id === selectedCourse);

  return (
    <div className="space-y-6">
      {/* Course Selection */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">My Academic Progress</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrolledCourses.map((enrollment) => (
            <Card
              key={enrollment.id}
              className={`cursor-pointer transition-all ${
                selectedCourse === enrollment.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedCourse(enrollment.id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{enrollment.course.title}</CardTitle>
                <CardDescription>{enrollment.course.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Progress</span>
                      <span>{enrollment.progress.overallProgress}%</span>
                    </div>
                    <ProgressBar value={enrollment.progress.overallProgress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Year</span>
                      <p className="font-medium">{enrollment.progress.currentYear}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">GPA</span>
                      <p className="font-medium">{enrollment.progress.gpa}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {enrollment.progress.creditsEarned}/{enrollment.progress.creditsRequired} Credits
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Detailed Progress */}
      {selectedEnrollment && detailedProgress && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Academic Record */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Academic Record
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {detailedProgress.academicRecord.gpa}
                    </div>
                    <div className="text-sm text-gray-600">Current GPA</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {detailedProgress.academicRecord.creditsEarned}
                    </div>
                    <div className="text-sm text-gray-600">Credits Earned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round((detailedProgress.academicRecord.creditsEarned / detailedProgress.academicRecord.creditsRequired) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Completion</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {formatDate(detailedProgress.academicRecord.expectedGraduation)}
                    </div>
                    <div className="text-sm text-gray-600">Expected Graduation</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Course */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Current Course
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{selectedEnrollment.currentCourse.title}</h3>
                    <p className="text-sm text-gray-600">{selectedEnrollment.currentCourse.code}</p>
                  </div>
                  <Badge variant="outline">
                    Due {formatDate(selectedEnrollment.currentCourse.dueDate)}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{selectedEnrollment.currentCourse.progress}%</span>
                    </div>
                    <ProgressBar value={selectedEnrollment.currentCourse.progress} className="h-2" />
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Play className="w-4 h-4 mr-2" />
                      Continue Learning
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateCourseProgress(
                        selectedCourse!,
                        selectedEnrollment.currentCourse.code,
                        selectedEnrollment.currentCourse.progress + 10
                      )}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Progress
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {detailedProgress.upcomingDeadlines.map((deadline, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          deadline.priority === 'high' ? 'bg-red-500' :
                          deadline.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <div>
                          <p className="font-medium">{deadline.title}</p>
                          <p className="text-sm text-gray-600">{deadline.courseCode}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={getPriorityColor(deadline.priority)}>
                          {getDaysUntil(deadline.dueDate)} days
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(deadline.dueDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            {detailedProgress.yearProgress.map((year) => (
              <Card key={year.year}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Year {year.year}: {year.title}</span>
                    <Badge variant="outline">{year.progress}% Complete</Badge>
                  </CardTitle>
                  <ProgressBar value={year.progress} className="h-2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {year.semesters.map((semester) => (
                      <div key={semester.semester} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Semester {semester.semester}</h4>
                          <div className="flex items-center gap-2">
                            {semester.completed ? (
                              <Badge variant="default">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completed
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                {semester.progress}% Progress
                              </Badge>
                            )}
                            {semester.gpa && (
                              <Badge variant="outline">GPA: {semester.gpa}</Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid gap-3">
                          {semester.courses.map((course) => (
                            <div key={course.code} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  course.completed ? 'bg-green-500' : 'bg-yellow-500'
                                }`}></div>
                                <div>
                                  <p className="font-medium">{course.code} - {course.title}</p>
                                  <p className="text-sm text-gray-600">{course.credits} credits</p>
                                </div>
                              </div>

                              <div className="text-right">
                                {course.completed ? (
                                  <div>
                                    <Badge variant="outline" className={getGradeColor(course.grade!)}>
                                      {course.grade}
                                    </Badge>
                                    {course.finalScore && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        Score: {course.finalScore}%
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <div>
                                    <div className="text-sm font-medium">{course.progress}%</div>
                                    {course.assignments && (
                                      <p className="text-xs text-gray-500">
                                        {course.assignments.completed}/{course.assignments.total} assignments
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Academic Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {detailedProgress.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Earned {formatDate(achievement.earnedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Assignment Score</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Course Completion Rate</span>
                      <span className="font-medium">95%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Study Time (Weekly)</span>
                      <span className="font-medium">24 hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Learning Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Maintain GPA above 3.5</span>
                        <span className="text-green-600">✓ On Track</span>
                      </div>
                      <ProgressBar value={95} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Complete Year 1 by June</span>
                        <span className="text-yellow-600">⚠ Behind</span>
                      </div>
                      <ProgressBar value={65} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default CourseProgressDashboard;