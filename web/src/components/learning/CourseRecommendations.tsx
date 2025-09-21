import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  TrendingUp,
  Star,
  Users,
  Clock,
  Target,
  Brain,
  Zap,
  Award,
  ChevronRight,
  Filter,
  Lightbulb,
  BarChart3,
  Heart,
  Bookmark,
  ExternalLink,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface CourseRecommendation {
  id: string;
  course: any;
  reason: string;
  relevanceScore: number;
  matchingFactors: string[];
  prerequisites: {
    met: boolean;
    missing: string[];
    progress?: number;
  };
  careerAlignment: {
    score: number;
    roles: string[];
  };
  learningPath: {
    currentLevel: string;
    nextStep: string;
    estimatedTime: string;
  };
  similarUsers: {
    count: number;
    successRate: number;
    averageRating: number;
  };
  urgency?: {
    level: 'low' | 'medium' | 'high';
    reason: string;
  };
  tags: string[];
}

interface UserProfile {
  interests: string[];
  careerGoals: string[];
  currentLevel: string;
  preferredDifficulty: string;
  availableTime: string;
  learningStyle: string[];
  completedCourses: string[];
  currentCourses: string[];
}

interface RecommendationFilters {
  category: string;
  difficulty: string;
  duration: string;
  prerequisites: string;
  relevanceScore: number;
}

const CourseRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [filters, setFilters] = useState<RecommendationFilters>({
    category: 'all',
    difficulty: 'all',
    duration: 'all',
    prerequisites: 'all',
    relevanceScore: 0
  });
  const [loading, setLoading] = useState(true);
  const [bookmarkedCourses, setBookmarkedCourses] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchUserProfile();
    fetchRecommendations();
  }, []);

  const fetchUserProfile = async () => {
    try {
      // Mock user profile data
      const profileData: UserProfile = {
        interests: ['Programming', 'AI/ML', 'Web Development', 'Data Science'],
        careerGoals: ['Software Engineer', 'Data Scientist', 'AI Researcher'],
        currentLevel: 'intermediate',
        preferredDifficulty: 'intermediate',
        availableTime: '10-15 hours/week',
        learningStyle: ['Visual', 'Hands-on', 'Project-based'],
        completedCourses: ['computer-science'],
        currentCourses: ['computer-science']
      };
      setUserProfile(profileData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/learning/course-recommendations');
      const data = await response.json();

      if (data.success) {
        // Enhance the recommendations with additional data
        const enhancedRecommendations: CourseRecommendation[] = data.data.map((rec: any) => ({
          ...rec,
          matchingFactors: generateMatchingFactors(rec),
          careerAlignment: generateCareerAlignment(rec),
          learningPath: generateLearningPath(rec),
          similarUsers: generateSimilarUsersData(rec),
          urgency: generateUrgency(rec),
          tags: generateTags(rec)
        }));

        setRecommendations(enhancedRecommendations);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMatchingFactors = (rec: any): string[] => {
    const factors = [];
    if (rec.relevanceScore > 90) factors.push('High relevance to your goals');
    if (rec.prerequisites.met) factors.push('Prerequisites satisfied');
    factors.push('Matches your learning style');
    factors.push('Popular among similar learners');
    return factors;
  };

  const generateCareerAlignment = (rec: any) => ({
    score: Math.floor(Math.random() * 30) + 70, // 70-100
    roles: ['Software Engineer', 'System Architect', 'Technical Lead']
  });

  const generateLearningPath = (rec: any) => ({
    currentLevel: 'Intermediate',
    nextStep: 'Advanced Specialization',
    estimatedTime: '12-18 months'
  });

  const generateSimilarUsersData = (rec: any) => ({
    count: Math.floor(Math.random() * 500) + 100,
    successRate: Math.floor(Math.random() * 20) + 80,
    averageRating: (Math.random() * 1 + 4).toFixed(1)
  });

  const generateUrgency = (rec: any) => {
    const urgencies = [
      { level: 'high' as const, reason: 'Limited enrollment period' },
      { level: 'medium' as const, reason: 'Growing industry demand' },
      { level: 'low' as const, reason: 'Always available' }
    ];
    return urgencies[Math.floor(Math.random() * urgencies.length)];
  };

  const generateTags = (rec: any): string[] => {
    const allTags = ['Popular', 'Trending', 'Career-focused', 'Project-based', 'Industry-relevant', 'Beginner-friendly'];
    return allTags.slice(0, Math.floor(Math.random() * 3) + 2);
  };

  const toggleBookmark = (courseId: string) => {
    setBookmarkedCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (filters.category !== 'all' && rec.course.category !== filters.category) return false;
    if (filters.difficulty !== 'all' && rec.course.difficulty !== filters.difficulty) return false;
    if (filters.prerequisites === 'met' && !rec.prerequisites.met) return false;
    if (rec.relevanceScore < filters.relevanceScore) return false;
    return true;
  });

  const getUrgencyColor = (urgency?: { level: string }) => {
    switch (urgency?.level) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
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
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Course Recommendations</h1>
            <p className="text-gray-600">Personalized suggestions based on your goals and progress</p>
          </div>
          <Lightbulb className="w-8 h-8 text-yellow-500" />
        </div>

        {/* User Profile Summary */}
        {userProfile && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {userProfile.interests.map(interest => (
                    <Badge key={interest} variant="secondary" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Career Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {userProfile.careerGoals.map(goal => (
                    <Badge key={goal} variant="outline" className="text-xs">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Learning Style</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {userProfile.learningStyle.map(style => (
                    <Badge key={style} variant="default" className="text-xs">
                      {style}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                <option value="STEM">STEM</option>
                <option value="Business">Business</option>
                <option value="Liberal Arts">Liberal Arts</option>
                <option value="Health Sciences">Health Sciences</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Prerequisites</label>
              <select
                value={filters.prerequisites}
                onChange={(e) => setFilters({...filters, prerequisites: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Courses</option>
                <option value="met">Prerequisites Met</option>
                <option value="partial">Partial Prerequisites</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Min Relevance Score</label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.relevanceScore}
                onChange={(e) => setFilters({...filters, relevanceScore: parseInt(e.target.value)})}
                className="w-full"
              />
              <div className="text-xs text-gray-600 mt-1">{filters.relevanceScore}%</div>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => setFilters({
                  category: 'all',
                  difficulty: 'all',
                  duration: 'all',
                  prerequisites: 'all',
                  relevanceScore: 0
                })}
                className="w-full"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Tabs defaultValue="personalized" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personalized">For You</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="career">Career-focused</TabsTrigger>
          <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
        </TabsList>

        <TabsContent value="personalized" className="space-y-4">
          {filteredRecommendations.map((recommendation) => (
            <Card key={recommendation.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{recommendation.course.title}</CardTitle>
                      <Badge variant="outline">{recommendation.course.category}</Badge>
                      {recommendation.urgency && (
                        <Badge variant={getUrgencyColor(recommendation.urgency)}>
                          {recommendation.urgency.level} priority
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="mb-3">
                      {recommendation.course.description}
                    </CardDescription>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {recommendation.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Relevance Score */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Relevance: {recommendation.relevanceScore}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{recommendation.similarUsers.count} similar learners</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">{recommendation.similarUsers.averageRating} rating</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleBookmark(recommendation.id)}
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarkedCourses.has(recommendation.id) ? 'fill-current text-blue-500' : ''}`} />
                    </Button>
                    <Progress value={recommendation.relevanceScore} className="w-20 h-2" />
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Why Recommended */}
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                      <Brain className="w-4 h-4" />
                      Why Recommended
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {recommendation.matchingFactors.map((factor, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prerequisites */}
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      Prerequisites
                    </h4>
                    {recommendation.prerequisites.met ? (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        All prerequisites met
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 text-sm text-orange-600 mb-2">
                          <AlertTriangle className="w-4 h-4" />
                          Missing prerequisites
                        </div>
                        <ul className="space-y-1 text-xs text-gray-600">
                          {recommendation.prerequisites.missing.map((prereq, idx) => (
                            <li key={idx}>• {prereq}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Career Alignment */}
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      Career Alignment
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Match Score</span>
                        <span className="font-medium">{recommendation.careerAlignment.score}%</span>
                      </div>
                      <Progress value={recommendation.careerAlignment.score} className="h-2" />
                      <div className="text-xs text-gray-600">
                        Relevant for: {recommendation.careerAlignment.roles.slice(0, 2).join(', ')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Learning Path */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Learning Path
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Current Level:</span>
                      <p className="font-medium">{recommendation.learningPath.currentLevel}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Next Step:</span>
                      <p className="font-medium">{recommendation.learningPath.nextStep}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Est. Time:</span>
                      <p className="font-medium">{recommendation.learningPath.estimatedTime}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-gray-600">
                    {recommendation.similarUsers.successRate}% of similar users completed this course
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button size="sm">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Enroll Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="trending">
          <Card>
            <CardHeader>
              <CardTitle>Trending Courses</CardTitle>
              <CardDescription>Most popular courses this month</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Trending recommendations will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="career">
          <Card>
            <CardHeader>
              <CardTitle>Career-focused Recommendations</CardTitle>
              <CardDescription>Courses aligned with your career goals</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Career-focused recommendations will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookmarked">
          <Card>
            <CardHeader>
              <CardTitle>Bookmarked Courses</CardTitle>
              <CardDescription>Courses you've saved for later</CardDescription>
            </CardHeader>
            <CardContent>
              {bookmarkedCourses.size === 0 ? (
                <p className="text-gray-500">No bookmarked courses yet</p>
              ) : (
                <p className="text-gray-500">Your bookmarked courses will be displayed here</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseRecommendations;