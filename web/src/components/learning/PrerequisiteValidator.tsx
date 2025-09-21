import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  BookOpen,
  Clock,
  Target,
  ArrowRight,
  Lock,
  Unlock,
  Calendar,
  Users,
  Star,
  TrendingUp,
  MapPin,
  Route,
  Zap,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Prerequisite {
  id: string;
  type: 'course' | 'skill' | 'experience' | 'certification' | 'grade';
  title: string;
  description: string;
  required: boolean;
  status: 'met' | 'partial' | 'not_met' | 'waived';
  progress?: number;
  alternatives?: string[];
  waivableWith?: string[];
  estimatedTime?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  provider?: string;
  cost?: number;
}

interface CourseSequence {
  id: string;
  title: string;
  courses: Array<{
    id: string;
    title: string;
    semester: number;
    year: number;
    credits: number;
    prerequisites: string[];
    corequisites?: string[];
    status: 'available' | 'locked' | 'enrolled' | 'completed';
    recommendedSchedule: Date;
    flexibility: 'fixed' | 'flexible' | 'elective';
  }>;
  totalCredits: number;
  estimatedDuration: string;
  flexibility: {
    electiveCredits: number;
    substitutionOptions: Record<string, string[]>;
    accelerationPaths: string[];
  };
}

interface ValidationResult {
  eligible: boolean;
  missingPrerequisites: Prerequisite[];
  warnings: string[];
  recommendations: string[];
  alternativePaths: Array<{
    title: string;
    description: string;
    steps: string[];
    estimatedTime: string;
  }>;
  waiver: {
    available: boolean;
    requirements: string[];
    process: string;
  };
}

const PrerequisiteValidator: React.FC<{ courseId: string }> = ({ courseId }) => {
  const [prerequisites, setPrerequisites] = useState<Prerequisite[]>([]);
  const [courseSequence, setCourseSequence] = useState<CourseSequence | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [selectedPrerequisite, setSelectedPrerequisite] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'validation' | 'sequence' | 'planning'>('validation');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrerequisites();
    fetchCourseSequence();
    validatePrerequisites();
  }, [courseId]);

  const fetchPrerequisites = async () => {
    try {
      // Mock prerequisites data
      const mockPrerequisites: Prerequisite[] = [
        {
          id: 'high-school-math',
          type: 'course',
          title: 'High School Mathematics',
          description: 'Completion of high school level mathematics including algebra and trigonometry',
          required: true,
          status: 'met',
          progress: 100,
          difficulty: 'beginner'
        },
        {
          id: 'basic-programming',
          type: 'skill',
          title: 'Basic Programming Knowledge',
          description: 'Understanding of basic programming concepts and at least one programming language',
          required: true,
          status: 'partial',
          progress: 65,
          alternatives: ['CS050 Introduction to Programming', 'Online Python Course', 'Coding Bootcamp'],
          estimatedTime: '40-60 hours',
          difficulty: 'beginner'
        },
        {
          id: 'calculus-i',
          type: 'course',
          title: 'Calculus I',
          description: 'Single-variable calculus including limits, derivatives, and basic integration',
          required: true,
          status: 'not_met',
          alternatives: ['MATH141', 'AP Calculus AB', 'Community College Calculus'],
          waivableWith: ['Placement test score ≥ 80', 'SAT Math ≥ 750'],
          estimatedTime: '1 semester',
          difficulty: 'intermediate',
          cost: 1200
        },
        {
          id: 'english-proficiency',
          type: 'certification',
          title: 'English Proficiency',
          description: 'Demonstrated proficiency in English language for academic work',
          required: true,
          status: 'met',
          progress: 100,
          alternatives: ['TOEFL ≥ 80', 'IELTS ≥ 6.5', 'Native speaker'],
          difficulty: 'intermediate'
        },
        {
          id: 'gpa-requirement',
          type: 'grade',
          title: 'Minimum GPA',
          description: 'Cumulative GPA of 2.5 or higher in previous coursework',
          required: true,
          status: 'met',
          progress: 100,
          waivableWith: ['Strong entrance exam score', 'Relevant work experience'],
          difficulty: 'beginner'
        },
        {
          id: 'physics-background',
          type: 'course',
          title: 'Physics Background',
          description: 'Basic understanding of physics principles',
          required: false,
          status: 'not_met',
          alternatives: ['PHYS101', 'High School Physics', 'Online Physics Course'],
          estimatedTime: '1 semester',
          difficulty: 'intermediate'
        }
      ];

      setPrerequisites(mockPrerequisites);
    } catch (error) {
      console.error('Error fetching prerequisites:', error);
    }
  };

  const fetchCourseSequence = async () => {
    try {
      // Mock course sequence data
      const mockSequence: CourseSequence = {
        id: 'cs-degree-sequence',
        title: 'Computer Science Degree Sequence',
        totalCredits: 120,
        estimatedDuration: '4 years',
        flexibility: {
          electiveCredits: 18,
          substitutionOptions: {
            'MATH142': ['MATH151', 'STAT200'],
            'CS301': ['CS302', 'CS303']
          },
          accelerationPaths: ['Summer courses', 'Overload semesters', 'Transfer credits']
        },
        courses: [
          // Year 1
          {
            id: 'cs101',
            title: 'Introduction to Programming',
            semester: 1,
            year: 1,
            credits: 3,
            prerequisites: ['high-school-math'],
            status: 'completed',
            recommendedSchedule: new Date(2024, 0, 15),
            flexibility: 'fixed'
          },
          {
            id: 'math141',
            title: 'Calculus I',
            semester: 1,
            year: 1,
            credits: 4,
            prerequisites: ['calculus-i'],
            status: 'available',
            recommendedSchedule: new Date(2024, 0, 15),
            flexibility: 'fixed'
          },
          {
            id: 'cs102',
            title: 'Object-Oriented Programming',
            semester: 2,
            year: 1,
            credits: 3,
            prerequisites: ['cs101'],
            status: 'locked',
            recommendedSchedule: new Date(2024, 4, 15),
            flexibility: 'fixed'
          },
          {
            id: 'math142',
            title: 'Calculus II',
            semester: 2,
            year: 1,
            credits: 4,
            prerequisites: ['math141'],
            corequisites: ['cs102'],
            status: 'locked',
            recommendedSchedule: new Date(2024, 4, 15),
            flexibility: 'flexible'
          },
          // Year 2
          {
            id: 'cs201',
            title: 'Data Structures',
            semester: 1,
            year: 2,
            credits: 3,
            prerequisites: ['cs102', 'math142'],
            status: 'locked',
            recommendedSchedule: new Date(2024, 7, 15),
            flexibility: 'fixed'
          },
          {
            id: 'cs202',
            title: 'Computer Architecture',
            semester: 2,
            year: 2,
            credits: 3,
            prerequisites: ['cs201'],
            status: 'locked',
            recommendedSchedule: new Date(2024, 11, 15),
            flexibility: 'flexible'
          }
        ]
      };

      setCourseSequence(mockSequence);
    } catch (error) {
      console.error('Error fetching course sequence:', error);
    }
  };

  const validatePrerequisites = async () => {
    try {
      const missingRequired = prerequisites.filter(p => p.required && p.status !== 'met');
      const warnings = [];
      const recommendations = [];

      if (missingRequired.length > 0) {
        warnings.push(`${missingRequired.length} required prerequisites not met`);
        recommendations.push('Complete missing prerequisites before enrollment');
      }

      const partialPrereqs = prerequisites.filter(p => p.status === 'partial');
      if (partialPrereqs.length > 0) {
        warnings.push(`${partialPrereqs.length} prerequisites partially completed`);
      }

      const result: ValidationResult = {
        eligible: missingRequired.length === 0,
        missingPrerequisites: missingRequired,
        warnings,
        recommendations: [
          'Consider taking preparatory courses in mathematics',
          'Complete programming fundamentals before advanced courses',
          'Maintain good academic standing throughout the program'
        ],
        alternativePaths: [
          {
            title: 'Accelerated Path',
            description: 'Complete prerequisites through intensive summer courses',
            steps: [
              'Enroll in summer Calculus intensive',
              'Complete online programming course',
              'Take placement exam for advanced standing'
            ],
            estimatedTime: '3 months'
          },
          {
            title: 'Part-time Path',
            description: 'Complete prerequisites while taking reduced course load',
            steps: [
              'Take 1-2 prerequisite courses per semester',
              'Maintain part-time status',
              'Complete program in 5-6 years'
            ],
            estimatedTime: '5-6 years'
          }
        ],
        waiver: {
          available: true,
          requirements: ['Submit portfolio of programming projects', 'Pass technical interview', 'Demonstrate equivalent experience'],
          process: 'Submit waiver request to academic committee for review'
        }
      };

      setValidationResult(result);
    } catch (error) {
      console.error('Error validating prerequisites:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'met':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'partial':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'not_met':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'waived':
        return <Shield className="w-5 h-5 text-blue-500" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'met':
        return 'border-green-200 bg-green-50';
      case 'partial':
        return 'border-yellow-200 bg-yellow-50';
      case 'not_met':
        return 'border-red-200 bg-red-50';
      case 'waived':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getCourseStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <Unlock className="w-4 h-4 text-green-500" />;
      case 'locked':
        return <Lock className="w-4 h-4 text-red-500" />;
      case 'enrolled':
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Lock className="w-4 h-4 text-gray-400" />;
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
            <Target className="w-5 h-5" />
            Prerequisite Validation & Course Sequencing
          </CardTitle>
          <CardDescription>
            Verify requirements and plan your academic pathway
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Validation Summary */}
      {validationResult && (
        <Card className={validationResult.eligible ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {validationResult.eligible ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              Eligibility Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium mb-2">Status</h4>
                <Badge variant={validationResult.eligible ? 'default' : 'destructive'}>
                  {validationResult.eligible ? 'Eligible to Enroll' : 'Prerequisites Required'}
                </Badge>
              </div>
              <div>
                <h4 className="font-medium mb-2">Missing Requirements</h4>
                <p className="text-2xl font-bold text-red-600">
                  {validationResult.missingPrerequisites.length}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Warnings</h4>
                <p className="text-2xl font-bold text-yellow-600">
                  {validationResult.warnings.length}
                </p>
              </div>
            </div>

            {validationResult.warnings.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Warnings & Recommendations</h4>
                <ul className="space-y-1 text-sm">
                  {validationResult.warnings.map((warning, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="validation">Prerequisites</TabsTrigger>
          <TabsTrigger value="sequence">Course Sequence</TabsTrigger>
          <TabsTrigger value="planning">Academic Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="validation" className="space-y-4">
          <div className="grid gap-4">
            {prerequisites.map((prerequisite) => (
              <Card
                key={prerequisite.id}
                className={`${getStatusColor(prerequisite.status)} cursor-pointer transition-all ${
                  selectedPrerequisite === prerequisite.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedPrerequisite(selectedPrerequisite === prerequisite.id ? null : prerequisite.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {getStatusIcon(prerequisite.status)}
                        {prerequisite.title}
                        {prerequisite.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {prerequisite.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {prerequisite.type}
                    </Badge>
                  </div>

                  {prerequisite.progress !== undefined && prerequisite.status === 'partial' && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{prerequisite.progress}%</span>
                      </div>
                      <Progress value={prerequisite.progress} className="h-2" />
                    </div>
                  )}
                </CardHeader>

                {selectedPrerequisite === prerequisite.id && (
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {prerequisite.difficulty && (
                          <div>
                            <span className="text-gray-600">Difficulty:</span>
                            <Badge variant="outline" className="ml-2">
                              {prerequisite.difficulty}
                            </Badge>
                          </div>
                        )}
                        {prerequisite.estimatedTime && (
                          <div>
                            <span className="text-gray-600">Est. Time:</span>
                            <span className="font-medium ml-2">{prerequisite.estimatedTime}</span>
                          </div>
                        )}
                        {prerequisite.cost && (
                          <div>
                            <span className="text-gray-600">Cost:</span>
                            <span className="font-medium ml-2">${prerequisite.cost}</span>
                          </div>
                        )}
                      </div>

                      {/* Alternatives */}
                      {prerequisite.alternatives && prerequisite.alternatives.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Alternative Options</h4>
                          <ul className="space-y-1">
                            {prerequisite.alternatives.map((alt, idx) => (
                              <li key={idx} className="flex items-center text-sm">
                                <ArrowRight className="w-3 h-3 text-blue-500 mr-2" />
                                {alt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Waiver Options */}
                      {prerequisite.waivableWith && prerequisite.waivableWith.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Waiver Options</h4>
                          <ul className="space-y-1">
                            {prerequisite.waivableWith.map((waiver, idx) => (
                              <li key={idx} className="flex items-center text-sm">
                                <Shield className="w-3 h-3 text-blue-500 mr-2" />
                                {waiver}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Actions */}
                      {prerequisite.status !== 'met' && (
                        <div className="flex gap-2 pt-2">
                          {prerequisite.status === 'not_met' && (
                            <Button size="sm">
                              <BookOpen className="w-4 h-4 mr-2" />
                              Find Courses
                            </Button>
                          )}
                          {prerequisite.waivableWith && (
                            <Button size="sm" variant="outline">
                              <Shield className="w-4 h-4 mr-2" />
                              Request Waiver
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sequence" className="space-y-4">
          {courseSequence && (
            <div className="space-y-6">
              {/* Sequence Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>{courseSequence.title}</CardTitle>
                  <CardDescription>
                    {courseSequence.totalCredits} credits • {courseSequence.estimatedDuration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Flexibility</h4>
                      <p className="text-sm text-gray-600">
                        {courseSequence.flexibility.electiveCredits} elective credits available
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Acceleration Options</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {courseSequence.flexibility.accelerationPaths.map((path, idx) => (
                          <li key={idx}>• {path}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Substitutions</h4>
                      <p className="text-sm text-gray-600">
                        {Object.keys(courseSequence.flexibility.substitutionOptions).length} courses have alternatives
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Timeline */}
              <div className="space-y-6">
                {[1, 2, 3, 4].map(year => {
                  const yearCourses = courseSequence.courses.filter(c => c.year === year);
                  return (
                    <Card key={year}>
                      <CardHeader>
                        <CardTitle>Year {year}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[1, 2].map(semester => {
                            const semesterCourses = yearCourses.filter(c => c.semester === semester);
                            return (
                              <div key={semester} className="space-y-3">
                                <h4 className="font-medium">Semester {semester}</h4>
                                {semesterCourses.map(course => (
                                  <div
                                    key={course.id}
                                    className={`p-3 border rounded-lg ${
                                      course.status === 'available' ? 'border-green-200 bg-green-50' :
                                      course.status === 'completed' ? 'border-blue-200 bg-blue-50' :
                                      course.status === 'enrolled' ? 'border-yellow-200 bg-yellow-50' :
                                      'border-gray-200 bg-gray-50'
                                    }`}
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          {getCourseStatusIcon(course.status)}
                                          <h5 className="font-medium">{course.title}</h5>
                                        </div>
                                        <p className="text-sm text-gray-600">{course.credits} credits</p>
                                        {course.prerequisites.length > 0 && (
                                          <p className="text-xs text-gray-500 mt-1">
                                            Prerequisites: {course.prerequisites.join(', ')}
                                          </p>
                                        )}
                                      </div>
                                      <Badge
                                        variant={course.flexibility === 'fixed' ? 'default' : 'outline'}
                                        className="text-xs"
                                      >
                                        {course.flexibility}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          {validationResult && (
            <div className="space-y-6">
              {/* Alternative Paths */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Route className="w-5 h-5" />
                    Alternative Pathways
                  </CardTitle>
                  <CardDescription>
                    Different approaches to complete your degree requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {validationResult.alternativePaths.map((path, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{path.title}</h4>
                            <p className="text-sm text-gray-600">{path.description}</p>
                          </div>
                          <Badge variant="outline">{path.estimatedTime}</Badge>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-2">Steps:</h5>
                          <ol className="space-y-1 text-sm">
                            {path.steps.map((step, stepIdx) => (
                              <li key={stepIdx} className="flex items-center gap-2">
                                <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center">
                                  {stepIdx + 1}
                                </span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Waiver Information */}
              {validationResult.waiver.available && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Prerequisite Waiver
                    </CardTitle>
                    <CardDescription>
                      Alternative qualification through demonstrated competency
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Requirements</h4>
                        <ul className="space-y-1 text-sm">
                          {validationResult.waiver.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Process</h4>
                        <p className="text-sm text-gray-600">{validationResult.waiver.process}</p>
                      </div>
                      <Button>
                        <Shield className="w-4 h-4 mr-2" />
                        Apply for Waiver
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {validationResult.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PrerequisiteValidator;