import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SkillVisualization from '@/components/visualization/SkillVisualization';
import { SkillTreeDemo } from '@/components/visualization/SkillTreeVisualization';
import { AnimatedProgressDemo } from '@/components/visualization/AnimatedProgress';
import SkillVisualizationDemo from '@/components/demo/SkillVisualizationDemo';
import {
  Brain,
  Eye,
  Target,
  TrendingUp,
  Layers,
  Play,
  Settings,
  BookOpen,
  Users,
  Award,
  Lightbulb,
  Zap,
  Star
} from 'lucide-react';

interface LearningStyle {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  recommended: string[];
}

interface VisualLearningMode {
  id: string;
  name: string;
  description: string;
  component: React.ReactNode;
  benefits: string[];
  bestFor: string[];
}

const learningStyles: LearningStyle[] = [
  {
    id: 'visual',
    name: 'Visual Learner',
    description: 'Learn best through charts, diagrams, and visual representations',
    icon: <Eye className="w-5 h-5" />,
    color: '#3b82f6',
    features: ['Color-coded content', 'Interactive diagrams', 'Progress charts', 'Mind maps'],
    recommended: ['Skill Visualizations', 'Progress Animations', 'Interactive Diagrams']
  },
  {
    id: 'kinesthetic',
    name: 'Kinesthetic Learner',
    description: 'Learn through hands-on interaction and experimentation',
    icon: <Target className="w-5 h-5" />,
    color: '#10b981',
    features: ['Interactive elements', 'Drag & drop', 'Clickable components', 'Simulation'],
    recommended: ['Interactive Skill Trees', 'Hands-on Projects', 'Practice Modes']
  },
  {
    id: 'analytical',
    name: 'Analytical Learner',
    description: 'Prefer structured, step-by-step learning with clear progressions',
    icon: <Layers className="w-5 h-5" />,
    color: '#8b5cf6',
    features: ['Skill trees', 'Prerequisites', 'Milestone tracking', 'Statistics'],
    recommended: ['Skill Trees', 'Progress Tracking', 'Learning Pathways']
  },
  {
    id: 'social',
    name: 'Social Learner',
    description: 'Learn effectively in collaborative and community environments',
    icon: <Users className="w-5 h-5" />,
    color: '#f59e0b',
    features: ['Group activities', 'Peer comparisons', 'Leaderboards', 'Discussions'],
    recommended: ['Study Groups', 'Peer Learning', 'Community Challenges']
  }
];

const visualLearningModes: VisualLearningMode[] = [
  {
    id: 'skill-visualizations',
    name: 'Interactive Skill Visualizations',
    description: 'Category-specific SVG visualizations with animations and interactions',
    component: <SkillVisualizationDemo />,
    benefits: [
      'Visual representation of skill concepts',
      'Category-specific metaphors',
      'Interactive exploration',
      'Animated progress feedback'
    ],
    bestFor: ['Visual learners', 'Concept understanding', 'Skill exploration']
  },
  {
    id: 'skill-trees',
    name: 'Skill Trees & Pathways',
    description: 'Gamified learning paths with prerequisites and dependencies',
    component: <SkillTreeDemo />,
    benefits: [
      'Clear learning progression',
      'Prerequisite visualization',
      'Achievement tracking',
      'Gamified experience'
    ],
    bestFor: ['Goal-oriented learners', 'Long-term planning', 'Structured learning']
  },
  {
    id: 'animated-progress',
    name: 'Animated Progress Tracking',
    description: 'Dynamic progress indicators with multiple visualization styles',
    component: <AnimatedProgressDemo />,
    benefits: [
      'Motivational progress display',
      'Multiple visual styles',
      'Real-time updates',
      'Achievement celebration'
    ],
    bestFor: ['Motivation', 'Progress monitoring', 'Goal tracking']
  }
];

const VisualLearningHub: React.FC = () => {
  const [selectedLearningStyle, setSelectedLearningStyle] = useState<string>('visual');
  const [selectedMode, setSelectedMode] = useState<string>('skill-visualizations');
  const [userPreferences, setUserPreferences] = useState({
    animations: true,
    interactivity: true,
    progressTracking: true,
    gamification: true
  });

  const currentLearningStyle = learningStyles.find(style => style.id === selectedLearningStyle);
  const currentMode = visualLearningModes.find(mode => mode.id === selectedMode);

  const getPersonalizedRecommendations = () => {
    const style = currentLearningStyle;
    if (!style) return [];

    return visualLearningModes.filter(mode =>
      style.recommended.some(rec =>
        mode.name.toLowerCase().includes(rec.toLowerCase().split(' ')[0])
      )
    );
  };

  const recommendations = getPersonalizedRecommendations();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Visual Learning Hub
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover your optimal learning style and explore interactive visualizations designed
          to enhance your skill development journey through engaging visual experiences.
        </p>
      </div>

      {/* Learning Style Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Learning Style Preferences
          </CardTitle>
          <CardDescription>
            Choose your preferred learning style to get personalized visual learning recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {learningStyles.map(style => (
              <div
                key={style.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedLearningStyle === style.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedLearningStyle(style.id)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${style.color}20`, color: style.color }}
                  >
                    {style.icon}
                  </div>
                  <h3 className="font-medium">{style.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{style.description}</p>
                <div className="space-y-1">
                  {style.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="text-xs text-gray-500 flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-gray-400" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {currentLearningStyle && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <h4 className="font-medium mb-2">Recommended for {currentLearningStyle.name}s:</h4>
              <div className="flex flex-wrap gap-2">
                {currentLearningStyle.recommended.map((rec, idx) => (
                  <Badge key={idx} variant="secondary">{rec}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visual Learning Modes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Visual Learning Modes
              </CardTitle>
              <CardDescription>
                Interactive visualization tools designed for different learning preferences
              </CardDescription>
            </div>
            <Select value={selectedMode} onValueChange={setSelectedMode}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {visualLearningModes.map(mode => (
                  <SelectItem key={mode.id} value={mode.id}>
                    {mode.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedMode} onValueChange={setSelectedMode}>
            <TabsList className="grid w-full grid-cols-3">
              {visualLearningModes.map(mode => (
                <TabsTrigger key={mode.id} value={mode.id} className="text-xs">
                  {mode.name.split(' ').slice(0, 2).join(' ')}
                </TabsTrigger>
              ))}
            </TabsList>

            {visualLearningModes.map(mode => (
              <TabsContent key={mode.id} value={mode.id} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Benefits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {mode.benefits.map((benefit, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <Star className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Best For</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {mode.bestFor.map((item, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button size="sm" className="w-full">
                        <Play className="w-3 h-3 mr-2" />
                        Try Interactive Demo
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <BookOpen className="w-3 h-3 mr-2" />
                        View Tutorial
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="border-t pt-6">
                  {mode.component}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Personalized Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Personalized Recommendations
            </CardTitle>
            <CardDescription>
              Based on your {currentLearningStyle?.name} preference
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map(mode => (
                <div
                  key={mode.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedMode === mode.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMode(mode.id)}
                >
                  <h4 className="font-medium mb-2">{mode.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{mode.description}</p>
                  <Badge
                    variant={selectedMode === mode.id ? "default" : "secondary"}
                    className="text-xs"
                  >
                    Recommended
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Visual Learning Preferences
          </CardTitle>
          <CardDescription>
            Customize your visual learning experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(userPreferences).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <p className="text-xs text-gray-500">
                    {key === 'animations' && 'Enable smooth animations and transitions'}
                    {key === 'interactivity' && 'Allow clicking and hovering interactions'}
                    {key === 'progressTracking' && 'Show progress bars and completion status'}
                    {key === 'gamification' && 'Include XP, badges, and achievements'}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={value ? "default" : "outline"}
                  onClick={() => setUserPreferences(prev => ({ ...prev, [key]: !value }))}
                >
                  {value ? 'On' : 'Off'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Visual Learning Impact
          </CardTitle>
          <CardDescription>
            How visual learning tools enhance your education
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">65%</div>
              <div className="text-sm text-gray-600">Better retention with visual learning</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">3x</div>
              <div className="text-sm text-gray-600">Faster concept understanding</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">40%</div>
              <div className="text-sm text-gray-600">Increase in engagement</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisualLearningHub;