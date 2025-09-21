import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Award,
  Target,
  BarChart3,
  TrendingUp,
  Users,
  Star,
  Brain,
  Zap,
  Shield,
  Download,
  Eye,
  Share,
  RefreshCw,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Timer,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AssessmentQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'coding' | 'practical';
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  points: number;
  timeLimit?: number; // in minutes
  resources?: string[];
  hints?: string[];
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'midterm' | 'final' | 'project' | 'certification' | 'competency';
  courseId: string;
  totalQuestions: number;
  totalPoints: number;
  timeLimit: number; // in minutes
  attempts: number;
  passingScore: number;
  questions: AssessmentQuestion[];
  prerequisites?: string[];
  availableFrom: Date;
  dueDate: Date;
  settings: {
    shuffleQuestions: boolean;
    showResults: boolean;
    allowReview: boolean;
    openBook: boolean;
    proctored: boolean;
  };
}

interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  status: 'in_progress' | 'completed' | 'paused' | 'submitted' | 'graded';
  score?: number;
  percentage?: number;
  answers: Record<string, any>;
  timeSpent: number; // in minutes
  feedback?: string;
  graderNotes?: string;
}

interface Certification {
  id: string;
  title: string;
  description: string;
  issuer: string;
  type: 'course_completion' | 'skill_mastery' | 'industry_standard' | 'academic_credit';
  requirements: Array<{
    type: 'assessment' | 'project' | 'time' | 'grade';
    description: string;
    completed: boolean;
    score?: number;
  }>;
  verificationCode: string;
  issuedDate?: Date;
  expiryDate?: Date;
  creditsEarned?: number;
  skills: string[];
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  digitalBadge?: string;
  blockchainVerified?: boolean;
}

interface AssessmentAnalytics {
  totalAssessments: number;
  completedAssessments: number;
  averageScore: number;
  timeSpent: number;
  strengths: string[];
  improvementAreas: string[];
  performanceTrend: Array<{
    date: Date;
    score: number;
    assessment: string;
  }>;
  topicMastery: Record<string, number>;
  recommendations: string[];
}

const ComprehensiveAssessment: React.FC<{ courseId: string }> = ({ courseId }) => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState<AssessmentAttempt | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [analytics, setAnalytics] = useState<AssessmentAnalytics | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'assessments' | 'attempt' | 'results' | 'certifications' | 'analytics'>('assessments');

  useEffect(() => {
    fetchAssessments();
    fetchCertifications();
    fetchAnalytics();
  }, [courseId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeRemaining !== null && timeRemaining > 0 && currentAttempt?.status === 'in_progress') {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev !== null ? Math.max(0, prev - 1) : 0);
      }, 60000); // Update every minute
    }
    return () => clearInterval(timer);
  }, [timeRemaining, currentAttempt]);

  const fetchAssessments = async () => {
    try {
      // Mock assessment data
      const mockAssessments: Assessment[] = [
        {
          id: 'cs101-quiz1',
          title: 'Programming Fundamentals Quiz',
          description: 'Test your understanding of basic programming concepts',
          type: 'quiz',
          courseId: 'cs101',
          totalQuestions: 15,
          totalPoints: 100,
          timeLimit: 30,
          attempts: 3,
          passingScore: 70,
          availableFrom: new Date(2024, 0, 15),
          dueDate: new Date(2024, 2, 15),
          settings: {
            shuffleQuestions: true,
            showResults: true,
            allowReview: true,
            openBook: false,
            proctored: false
          },
          questions: [
            {
              id: 'q1',
              type: 'multiple_choice',
              question: 'What is a variable in programming?',
              options: [
                'A container for storing data',
                'A type of loop',
                'A function parameter',
                'A programming language'
              ],
              correctAnswer: 0,
              difficulty: 'easy',
              topics: ['Variables', 'Data Types'],
              points: 5,
              explanation: 'A variable is a container for storing data values that can be changed during program execution.'
            },
            {
              id: 'q2',
              type: 'coding',
              question: 'Write a function that calculates the factorial of a number.',
              difficulty: 'medium',
              topics: ['Functions', 'Recursion', 'Mathematics'],
              points: 15,
              timeLimit: 10
            }
          ]
        },
        {
          id: 'cs101-midterm',
          title: 'Midterm Examination',
          description: 'Comprehensive midterm covering all topics from the first half of the course',
          type: 'midterm',
          courseId: 'cs101',
          totalQuestions: 50,
          totalPoints: 200,
          timeLimit: 120,
          attempts: 1,
          passingScore: 60,
          availableFrom: new Date(2024, 2, 1),
          dueDate: new Date(2024, 2, 7),
          settings: {
            shuffleQuestions: true,
            showResults: false,
            allowReview: false,
            openBook: false,
            proctored: true
          },
          questions: []
        },
        {
          id: 'cs101-final-project',
          title: 'Final Project Assessment',
          description: 'Capstone project demonstrating mastery of course concepts',
          type: 'project',
          courseId: 'cs101',
          totalQuestions: 1,
          totalPoints: 300,
          timeLimit: 0, // No time limit
          attempts: 1,
          passingScore: 70,
          availableFrom: new Date(2024, 3, 1),
          dueDate: new Date(2024, 4, 15),
          settings: {
            shuffleQuestions: false,
            showResults: true,
            allowReview: true,
            openBook: true,
            proctored: false
          },
          questions: []
        }
      ];

      setAssessments(mockAssessments);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCertifications = async () => {
    try {
      // Mock certification data
      const mockCertifications: Certification[] = [
        {
          id: 'cs101-completion',
          title: 'Introduction to Programming Certificate',
          description: 'Certificate of completion for CS101 Introduction to Programming',
          issuer: 'SkillCircle University',
          type: 'course_completion',
          verificationCode: 'SC-CS101-2024-001234',
          issuedDate: new Date(2024, 4, 20),
          creditsEarned: 3,
          skills: ['Python Programming', 'Problem Solving', 'Algorithm Design'],
          level: 'beginner',
          digitalBadge: '/badges/cs101-completion.png',
          blockchainVerified: true,
          requirements: [
            {
              type: 'assessment',
              description: 'Pass all quizzes with 70% or higher',
              completed: true,
              score: 85
            },
            {
              type: 'assessment',
              description: 'Complete midterm examination',
              completed: true,
              score: 78
            },
            {
              type: 'project',
              description: 'Submit and pass final project',
              completed: false
            },
            {
              type: 'time',
              description: 'Complete minimum 40 hours of coursework',
              completed: true
            }
          ]
        },
        {
          id: 'python-mastery',
          title: 'Python Programming Mastery',
          description: 'Industry-recognized certification for Python programming proficiency',
          issuer: 'Python Software Foundation',
          type: 'skill_mastery',
          verificationCode: 'PSF-PY-2024-005678',
          expiryDate: new Date(2027, 4, 20),
          skills: ['Python', 'Object-Oriented Programming', 'Data Structures', 'Web Development'],
          level: 'intermediate',
          digitalBadge: '/badges/python-mastery.png',
          blockchainVerified: true,
          requirements: [
            {
              type: 'assessment',
              description: 'Pass Python competency exam',
              completed: false
            },
            {
              type: 'project',
              description: 'Complete 3 portfolio projects',
              completed: false
            }
          ]
        }
      ];

      setCertifications(mockCertifications);
    } catch (error) {
      console.error('Error fetching certifications:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      // Mock analytics data
      const mockAnalytics: AssessmentAnalytics = {
        totalAssessments: 12,
        completedAssessments: 8,
        averageScore: 82.5,
        timeSpent: 180, // minutes
        strengths: ['Problem Solving', 'Syntax Understanding', 'Code Logic'],
        improvementAreas: ['Algorithm Optimization', 'Error Handling', 'Testing'],
        performanceTrend: [
          { date: new Date(2024, 0, 15), score: 75, assessment: 'Quiz 1' },
          { date: new Date(2024, 0, 22), score: 80, assessment: 'Quiz 2' },
          { date: new Date(2024, 1, 5), score: 85, assessment: 'Quiz 3' },
          { date: new Date(2024, 1, 19), score: 88, assessment: 'Midterm' },
          { date: new Date(2024, 2, 10), score: 90, assessment: 'Quiz 4' }
        ],
        topicMastery: {
          'Variables': 95,
          'Functions': 88,
          'Loops': 82,
          'Conditionals': 90,
          'Data Structures': 75,
          'Object-Oriented Programming': 70,
          'Error Handling': 65
        },
        recommendations: [
          'Focus on data structures and algorithms',
          'Practice more complex programming problems',
          'Review error handling patterns',
          'Consider advanced Python topics'
        ]
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const startAssessment = (assessment: Assessment) => {
    const attempt: AssessmentAttempt = {
      id: `attempt-${Date.now()}`,
      assessmentId: assessment.id,
      userId: 'current-user',
      startTime: new Date(),
      status: 'in_progress',
      answers: {},
      timeSpent: 0
    };

    setCurrentAttempt(attempt);
    setSelectedAssessment(assessment);
    setCurrentQuestion(0);
    setAnswers({});

    if (assessment.timeLimit > 0) {
      setTimeRemaining(assessment.timeLimit);
    }

    setView('attempt');
  };

  const submitAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const nextQuestion = () => {
    if (selectedAssessment && currentQuestion < selectedAssessment.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const submitAssessment = async () => {
    if (!currentAttempt || !selectedAssessment) return;

    // Calculate score
    let totalScore = 0;
    let totalPoints = 0;

    selectedAssessment.questions.forEach(question => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];

      if (question.type === 'multiple_choice' && userAnswer === question.correctAnswer) {
        totalScore += question.points;
      }
      // Add more scoring logic for other question types
    });

    const percentage = Math.round((totalScore / totalPoints) * 100);

    const updatedAttempt: AssessmentAttempt = {
      ...currentAttempt,
      endTime: new Date(),
      status: 'submitted',
      score: totalScore,
      percentage,
      answers
    };

    setCurrentAttempt(updatedAttempt);
    setView('results');
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getAssessmentStatusBadge = (assessment: Assessment) => {
    const now = new Date();
    if (now < assessment.availableFrom) {
      return <Badge variant="secondary">Not Available</Badge>;
    } else if (now > assessment.dueDate) {
      return <Badge variant="destructive">Overdue</Badge>;
    } else {
      return <Badge variant="default">Available</Badge>;
    }
  };

  const getCertificationStatusBadge = (cert: Certification) => {
    const completedReqs = cert.requirements.filter(req => req.completed).length;
    const totalReqs = cert.requirements.length;

    if (completedReqs === totalReqs) {
      return <Badge variant="default">Earned</Badge>;
    } else {
      return <Badge variant="outline">{completedReqs}/{totalReqs} Complete</Badge>;
    }
  };

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Assessment & Certification Center
          </CardTitle>
          <CardDescription>
            Test your knowledge, track progress, and earn certifications
          </CardDescription>
        </CardHeader>
      </Card>

      {view === 'assessments' && (
        <Tabs defaultValue="available" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            {assessments.map(assessment => (
              <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {assessment.type === 'quiz' && <Brain className="w-5 h-5 text-blue-500" />}
                        {assessment.type === 'midterm' && <FileText className="w-5 h-5 text-purple-500" />}
                        {assessment.type === 'final' && <Award className="w-5 h-5 text-gold-500" />}
                        {assessment.type === 'project' && <Target className="w-5 h-5 text-green-500" />}
                        {assessment.title}
                      </CardTitle>
                      <CardDescription>{assessment.description}</CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getAssessmentStatusBadge(assessment)}
                      <Badge variant="outline">{assessment.type}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{assessment.totalQuestions}</div>
                      <div className="text-sm text-gray-600">Questions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{assessment.totalPoints}</div>
                      <div className="text-sm text-gray-600">Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {assessment.timeLimit > 0 ? formatTime(assessment.timeLimit) : 'No limit'}
                      </div>
                      <div className="text-sm text-gray-600">Time Limit</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">{assessment.passingScore}%</div>
                      <div className="text-sm text-gray-600">Passing Score</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Due: {assessment.dueDate.toLocaleDateString()} • {assessment.attempts} attempts allowed
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button size="sm" onClick={() => startAssessment(assessment)}>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Start Assessment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Assessments</CardTitle>
                <CardDescription>Review your past assessment performances</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Completed assessments will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-4">
            {certifications.map(cert => (
              <Card key={cert.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-500" />
                        {cert.title}
                      </CardTitle>
                      <CardDescription>{cert.description}</CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{cert.issuer}</Badge>
                        <Badge variant="secondary">{cert.level}</Badge>
                        {cert.blockchainVerified && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                    {getCertificationStatusBadge(cert)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Requirements */}
                    <div>
                      <h4 className="font-medium mb-2">Requirements</h4>
                      <div className="space-y-2">
                        {cert.requirements.map((req, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                            <div className="flex items-center gap-2">
                              {req.completed ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-gray-400" />
                              )}
                              <span className="text-sm">{req.description}</span>
                            </div>
                            {req.score && (
                              <Badge variant="outline">{req.score}%</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <h4 className="font-medium mb-2">Skills Covered</h4>
                      <div className="flex flex-wrap gap-1">
                        {cert.skills.map(skill => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    {cert.issuedDate && (
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-sm text-gray-600">
                          Issued: {cert.issuedDate.toLocaleDateString()}
                          {cert.expiryDate && ` • Expires: ${cert.expiryDate.toLocaleDateString()}`}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            {analytics && (
              <>
                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                          <p className="text-2xl font-bold">
                            {Math.round((analytics.completedAssessments / analytics.totalAssessments) * 100)}%
                          </p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Average Score</p>
                          <p className="text-2xl font-bold">{analytics.averageScore}%</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Time Spent</p>
                          <p className="text-2xl font-bold">{formatTime(analytics.timeSpent)}</p>
                        </div>
                        <Clock className="w-8 h-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Assessments</p>
                          <p className="text-2xl font-bold">
                            {analytics.completedAssessments}/{analytics.totalAssessments}
                          </p>
                        </div>
                        <FileText className="w-8 h-8 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Performance Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Strengths & Improvement Areas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-green-600 mb-2">Strengths</h4>
                          <ul className="space-y-1">
                            {analytics.strengths.map((strength, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-orange-600 mb-2">Areas for Improvement</h4>
                          <ul className="space-y-1">
                            {analytics.improvementAreas.map((area, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm">
                                <AlertTriangle className="w-4 h-4 text-orange-500" />
                                {area}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Topic Mastery</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(analytics.topicMastery).map(([topic, score]) => (
                          <div key={topic}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{topic}</span>
                              <span>{score}%</span>
                            </div>
                            <Progress value={score} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analytics.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Zap className="w-4 h-4 text-blue-500 mt-0.5" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Assessment Attempt View */}
      {view === 'attempt' && selectedAssessment && currentAttempt && (
        <div className="space-y-4">
          {/* Assessment Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedAssessment.title}</CardTitle>
                  <CardDescription>
                    Question {currentQuestion + 1} of {selectedAssessment.questions.length}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  {timeRemaining !== null && (
                    <div className="flex items-center gap-2">
                      <Timer className="w-4 h-4 text-red-500" />
                      <span className="font-mono text-lg">
                        {formatTime(timeRemaining)}
                      </span>
                    </div>
                  )}
                  <Button variant="outline" onClick={submitAssessment}>
                    Submit Assessment
                  </Button>
                </div>
              </div>
              <Progress
                value={((currentQuestion + 1) / selectedAssessment.questions.length) * 100}
                className="h-2"
              />
            </CardHeader>
          </Card>

          {/* Current Question */}
          {selectedAssessment.questions[currentQuestion] && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Question {currentQuestion + 1}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {selectedAssessment.questions[currentQuestion].difficulty}
                    </Badge>
                    <Badge variant="secondary">
                      {selectedAssessment.questions[currentQuestion].points} points
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-lg">
                    {selectedAssessment.questions[currentQuestion].question}
                  </p>

                  {/* Multiple Choice Options */}
                  {selectedAssessment.questions[currentQuestion].type === 'multiple_choice' && (
                    <div className="space-y-2">
                      {selectedAssessment.questions[currentQuestion].options?.map((option, idx) => (
                        <label key={idx} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name={`question-${currentQuestion}`}
                            value={idx}
                            checked={answers[selectedAssessment.questions[currentQuestion].id] === idx}
                            onChange={() => submitAnswer(selectedAssessment.questions[currentQuestion].id, idx)}
                            className="text-blue-600"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Topic Tags */}
                  <div className="flex flex-wrap gap-1">
                    {selectedAssessment.questions[currentQuestion].topics.map(topic => (
                      <Badge key={topic} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">
                <PauseCircle className="w-4 h-4 mr-2" />
                Save & Exit
              </Button>
              <Button
                onClick={nextQuestion}
                disabled={currentQuestion === selectedAssessment.questions.length - 1}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Results View */}
      {view === 'results' && currentAttempt && selectedAssessment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentAttempt.percentage! >= selectedAssessment.passingScore ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              Assessment Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {currentAttempt.percentage}%
                </div>
                <div className="text-sm text-gray-600">Final Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {currentAttempt.score}/{selectedAssessment.totalPoints}
                </div>
                <div className="text-sm text-gray-600">Points Earned</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${
                  currentAttempt.percentage! >= selectedAssessment.passingScore ? 'text-green-600' : 'text-red-600'
                }`}>
                  {currentAttempt.percentage! >= selectedAssessment.passingScore ? 'PASS' : 'FAIL'}
                </div>
                <div className="text-sm text-gray-600">Result</div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button onClick={() => setView('assessments')}>
                <BookOpen className="w-4 h-4 mr-2" />
                Back to Assessments
              </Button>
              {selectedAssessment.settings.allowReview && (
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Review Answers
                </Button>
              )}
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retake Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComprehensiveAssessment;