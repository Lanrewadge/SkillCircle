import React, { useState } from 'react';
import SkillVisualization from '@/components/visualization/SkillVisualization';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Play, Shuffle, RotateCcw } from 'lucide-react';

interface DemoSkill {
  id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  baseProgress: number;
  topics: string[];
  description: string;
}

const demoSkills: DemoSkill[] = [
  {
    id: 'react-development',
    name: 'React Development',
    category: 'programming',
    level: 'intermediate',
    baseProgress: 65,
    topics: ['Components', 'Hooks', 'State Management', 'JSX', 'Props', 'Lifecycle'],
    description: 'Modern frontend development with React library'
  },
  {
    id: 'ui-ux-design',
    name: 'UI/UX Design',
    category: 'design',
    level: 'advanced',
    baseProgress: 78,
    topics: ['Color Theory', 'Typography', 'Layout', 'User Research', 'Prototyping'],
    description: 'User interface and experience design principles'
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    category: 'data science',
    level: 'intermediate',
    baseProgress: 55,
    topics: ['Statistics', 'Visualization', 'Python', 'SQL', 'Machine Learning'],
    description: 'Extracting insights from data using statistical methods'
  },
  {
    id: 'business-strategy',
    name: 'Business Strategy',
    category: 'business',
    level: 'advanced',
    baseProgress: 82,
    topics: ['Market Analysis', 'Financial Planning', 'Leadership', 'Operations'],
    description: 'Strategic planning and business development'
  },
  {
    id: 'spanish-language',
    name: 'Spanish Language',
    category: 'languages',
    level: 'beginner',
    baseProgress: 35,
    topics: ['Grammar', 'Vocabulary', 'Conversation', 'Pronunciation', 'Culture'],
    description: 'Learning Spanish for communication and cultural understanding'
  },
  {
    id: 'nutrition-wellness',
    name: 'Nutrition & Wellness',
    category: 'health',
    level: 'intermediate',
    baseProgress: 60,
    topics: ['Macronutrients', 'Meal Planning', 'Exercise', 'Mental Health'],
    description: 'Holistic approach to health and wellness'
  },
  {
    id: 'culinary-arts',
    name: 'Culinary Arts',
    category: 'cooking',
    level: 'beginner',
    baseProgress: 42,
    topics: ['Knife Skills', 'Flavor Pairing', 'Cooking Methods', 'Food Safety'],
    description: 'Professional cooking techniques and culinary creativity'
  }
];

const SkillVisualizationDemo: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<DemoSkill>(demoSkills[0]);
  const [progressOverride, setProgressOverride] = useState<number[]>([selectedSkill.baseProgress]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);

  const handleSkillChange = (skillId: string) => {
    const skill = demoSkills.find(s => s.id === skillId);
    if (skill) {
      setSelectedSkill(skill);
      setProgressOverride([skill.baseProgress]);
    }
  };

  const animateProgress = () => {
    setIsAnimating(true);
    let currentProgress = 0;
    const targetProgress = selectedSkill.baseProgress;
    const increment = targetProgress / 50;

    const interval = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= targetProgress) {
        currentProgress = targetProgress;
        clearInterval(interval);
        setIsAnimating(false);
      }
      setProgressOverride([Math.round(currentProgress)]);
    }, 50);
  };

  const randomizeProgress = () => {
    const newProgress = Math.floor(Math.random() * 100);
    setProgressOverride([newProgress]);
  };

  const resetProgress = () => {
    setProgressOverride([selectedSkill.baseProgress]);
  };

  const currentProgress = progressOverride[0];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Interactive Skill Visualizations
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Explore our dynamic, SVG-based skill visualizations that adapt to different categories
          and learning styles. Each visualization provides unique interactive elements and animations.
        </p>
      </div>

      {/* Demo Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Interactive Demo Controls
          </CardTitle>
          <CardDescription>
            Customize the visualization experience and explore different skills
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Skill</label>
              <Select value={selectedSkill.id} onValueChange={handleSkillChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {demoSkills.map(skill => (
                    <SelectItem key={skill.id} value={skill.id}>
                      {skill.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Progress: {currentProgress}%</label>
              <Slider
                value={progressOverride}
                onValueChange={setProgressOverride}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Badge variant="secondary" className="w-full justify-center">
                {selectedSkill.category}
              </Badge>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Level</label>
              <Badge variant="outline" className="w-full justify-center capitalize">
                {selectedSkill.level}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={animateProgress} disabled={isAnimating} className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              {isAnimating ? 'Animating...' : 'Animate Progress'}
            </Button>
            <Button onClick={randomizeProgress} variant="outline" className="flex items-center gap-2">
              <Shuffle className="w-4 h-4" />
              Random Progress
            </Button>
            <Button onClick={resetProgress} variant="outline" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <Button
              onClick={() => setShowAllSkills(!showAllSkills)}
              variant="secondary"
            >
              {showAllSkills ? 'Show Single' : 'Show All Skills'}
            </Button>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">{selectedSkill.name}</h4>
            <p className="text-sm text-gray-600 mb-3">{selectedSkill.description}</p>
            <div className="flex flex-wrap gap-1">
              {selectedSkill.topics.map((topic, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className={`text-xs ${currentProgress > (idx + 1) * (100 / selectedSkill.topics.length) ? 'bg-green-100 text-green-800' : ''}`}
                >
                  {topic}
                  {currentProgress > (idx + 1) * (100 / selectedSkill.topics.length) && ' ✓'}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Single Skill Visualization */}
      {!showAllSkills && (
        <SkillVisualization
          skillId={selectedSkill.id}
          skillName={selectedSkill.name}
          category={selectedSkill.category}
          level={selectedSkill.level}
          progress={currentProgress}
          topics={selectedSkill.topics}
          interactive={true}
        />
      )}

      {/* All Skills Grid */}
      {showAllSkills && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">All Skill Categories</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {demoSkills.map(skill => (
              <SkillVisualization
                key={skill.id}
                skillId={skill.id}
                skillName={skill.name}
                category={skill.category}
                level={skill.level}
                progress={skill.baseProgress}
                topics={skill.topics}
                interactive={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Visualization Features</CardTitle>
          <CardDescription>
            Each skill category has specialized visual metaphors and interactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-600">Programming</h4>
              <p className="text-sm text-gray-600">
                Node-based flow diagrams with data flow animations and interactive concept exploration
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-purple-600">Design</h4>
              <p className="text-sm text-gray-600">
                Color palettes, typography samples, and layout grids with interactive design tools
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">Data Science</h4>
              <p className="text-sm text-gray-600">
                Pipeline visualization with step-by-step process flow and animated results
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-yellow-600">Business</h4>
              <p className="text-sm text-gray-600">
                Interactive charts, KPI dashboards, and animated trend visualizations
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-indigo-600">Languages</h4>
              <p className="text-sm text-gray-600">
                Four core skills visualization with speaking waves and vocabulary progress
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-teal-600">Health</h4>
              <p className="text-sm text-gray-600">
                Human body outline with health areas and animated wellness indicators
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-orange-600">Cooking</h4>
              <p className="text-sm text-gray-600">
                Kitchen scene with cooking techniques, ingredients, and animated steam effects
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillVisualizationDemo;