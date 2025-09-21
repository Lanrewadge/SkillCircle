import React, { useState, useEffect } from 'react';
import {
  Brain,
  Code,
  Palette,
  Calculator,
  Globe,
  Briefcase,
  Microscope,
  Heart,
  BookOpen,
  Music,
  Camera,
  PenTool,
  Database,
  Smartphone,
  Cloud,
  Shield,
  TrendingUp,
  Users,
  Target,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Maximize,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SkillVisualizationProps {
  skillId: string;
  skillName: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  progress: number;
  topics?: string[];
  interactive?: boolean;
}

// Interactive SVG Components for different skill categories
const ProgrammingVisualization: React.FC<{ progress: number; interactive: boolean; topics: string[] }> = ({
  progress,
  interactive,
  topics
}) => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [animationSpeed, setAnimationSpeed] = useState(1);

  const nodes = [
    { id: 'variables', x: 100, y: 100, label: 'Variables', completed: progress > 20 },
    { id: 'functions', x: 200, y: 80, label: 'Functions', completed: progress > 40 },
    { id: 'loops', x: 150, y: 150, label: 'Loops', completed: progress > 30 },
    { id: 'conditionals', x: 250, y: 120, label: 'Conditionals', completed: progress > 35 },
    { id: 'objects', x: 300, y: 100, label: 'Objects', completed: progress > 60 },
    { id: 'classes', x: 350, y: 80, label: 'Classes', completed: progress > 70 },
    { id: 'modules', x: 400, y: 100, label: 'Modules', completed: progress > 80 }
  ];

  const connections = [
    { from: 'variables', to: 'functions' },
    { from: 'variables', to: 'loops' },
    { from: 'functions', to: 'conditionals' },
    { from: 'loops', to: 'objects' },
    { from: 'conditionals', to: 'objects' },
    { from: 'objects', to: 'classes' },
    { from: 'classes', to: 'modules' }
  ];

  return (
    <div className="relative">
      <svg width="500" height="200" className="border border-gray-200 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Connections */}
        {connections.map((conn, idx) => {
          const fromNode = nodes.find(n => n.id === conn.from);
          const toNode = nodes.find(n => n.id === conn.to);
          if (!fromNode || !toNode) return null;

          const completed = fromNode.completed && toNode.completed;
          return (
            <line
              key={idx}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={completed ? "#10b981" : "#d1d5db"}
              strokeWidth="2"
              strokeDasharray={completed ? "0" : "5,5"}
              className={completed ? "animate-pulse" : ""}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r="20"
              fill={node.completed ? "#10b981" : activeNode === node.id ? "#3b82f6" : "#e5e7eb"}
              stroke={activeNode === node.id ? "#1d4ed8" : "#9ca3af"}
              strokeWidth="2"
              className={`cursor-pointer transition-all duration-300 ${
                interactive ? "hover:scale-110" : ""
              }`}
              onClick={() => interactive && setActiveNode(activeNode === node.id ? null : node.id)}
            >
              {node.completed && (
                <animate
                  attributeName="r"
                  values="20;22;20"
                  dur={`${2 / animationSpeed}s`}
                  repeatCount="indefinite"
                />
              )}
            </circle>
            <text
              x={node.x}
              y={node.y + 35}
              textAnchor="middle"
              className="text-xs font-medium fill-gray-700"
            >
              {node.label}
            </text>
            {node.completed && (
              <text
                x={node.x}
                y={node.y + 4}
                textAnchor="middle"
                className="text-xs fill-white font-bold"
              >
                ✓
              </text>
            )}
          </g>
        ))}

        {/* Data Flow Animation */}
        {progress > 50 && (
          <circle r="3" fill="#3b82f6" opacity="0.8">
            <animateMotion
              dur={`${3 / animationSpeed}s`}
              repeatCount="indefinite"
              path="M 100,100 L 200,80 L 300,100 L 400,100"
            />
          </circle>
        )}
      </svg>

      {/* Interactive Controls */}
      {interactive && (
        <div className="absolute top-2 right-2 flex gap-2">
          <Button size="sm" variant="outline">
            <Play className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="outline">
            <Pause className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="outline">
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* Active Node Details */}
      {activeNode && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium capitalize">{activeNode}</h4>
          <p className="text-sm text-gray-600 mt-1">
            {getTopicDescription(activeNode)}
          </p>
          <div className="flex gap-2 mt-2">
            <Button size="sm">Learn More</Button>
            <Button size="sm" variant="outline">Practice</Button>
          </div>
        </div>
      )}
    </div>
  );
};

const DesignVisualization: React.FC<{ progress: number; interactive: boolean }> = ({
  progress,
  interactive
}) => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const tools = [
    { id: 'color', x: 150, y: 60, color: '#ef4444', label: 'Color Theory' },
    { id: 'typography', x: 250, y: 60, color: '#3b82f6', label: 'Typography' },
    { id: 'layout', x: 350, y: 60, color: '#10b981', label: 'Layout' },
    { id: 'composition', x: 200, y: 130, color: '#f59e0b', label: 'Composition' },
    { id: 'branding', x: 300, y: 130, color: '#8b5cf6', label: 'Branding' }
  ];

  return (
    <div className="relative">
      <svg width="500" height="200" className="border border-gray-200 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Design Canvas */}
        <rect x="50" y="30" width="400" height="140" fill="white" stroke="#e5e7eb" strokeWidth="2" rx="8" />

        {/* Color Palette */}
        <g>
          {['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'].map((color, idx) => (
            <rect
              key={idx}
              x={70 + idx * 25}
              y={50}
              width="20"
              height="20"
              fill={color}
              rx="3"
              className={`cursor-pointer transition-all ${progress > (idx + 1) * 20 ? 'opacity-100' : 'opacity-30'}`}
              onClick={() => interactive && setSelectedTool(`color-${idx}`)}
            />
          ))}
        </g>

        {/* Typography Samples */}
        <text x="70" y="90" className="text-xs fill-gray-700 font-bold">Heading</text>
        <text x="70" y="105" className="text-xs fill-gray-600">Body text sample</text>

        {/* Layout Grid */}
        <g opacity={progress > 40 ? "1" : "0.3"}>
          {[0, 1, 2].map(row => (
            [0, 1, 2].map(col => (
              <rect
                key={`${row}-${col}`}
                x={200 + col * 60}
                y={80 + row * 25}
                width="50"
                height="20"
                fill="none"
                stroke="#d1d5db"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            ))
          ))}
        </g>

        {/* Design Elements */}
        <circle cx="380" cy="100" r="15" fill="#3b82f6" opacity={progress > 60 ? "1" : "0.3"} />
        <rect x="400" y="85" width="30" height="30" fill="#10b981" opacity={progress > 70 ? "1" : "0.3"} rx="4" />
      </svg>

      {interactive && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
          {tools.map(tool => (
            <Button
              key={tool.id}
              size="sm"
              variant={selectedTool === tool.id ? "default" : "outline"}
              onClick={() => setSelectedTool(selectedTool === tool.id ? null : tool.id)}
              className="flex items-center gap-2"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: tool.color }}
              />
              {tool.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

const DataScienceVisualization: React.FC<{ progress: number; interactive: boolean }> = ({
  progress,
  interactive
}) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { id: 'collect', label: 'Data Collection', icon: Database, completed: progress > 20 },
    { id: 'clean', label: 'Data Cleaning', icon: Settings, completed: progress > 40 },
    { id: 'analyze', label: 'Analysis', icon: TrendingUp, completed: progress > 60 },
    { id: 'visualize', label: 'Visualization', icon: Palette, completed: progress > 80 }
  ];

  useEffect(() => {
    if (interactive) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [interactive]);

  return (
    <div className="relative">
      <svg width="500" height="200" className="border border-gray-200 rounded-lg bg-gradient-to-br from-green-50 to-blue-50">
        {/* Data Pipeline */}
        <defs>
          <linearGradient id="pipelineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* Pipeline Flow */}
        <rect x="50" y="90" width="400" height="20" fill="url(#pipelineGrad)" rx="10" opacity="0.3" />

        {/* Data Flow Animation */}
        <circle r="8" fill="#3b82f6" opacity="0.8">
          <animateMotion
            dur="4s"
            repeatCount="indefinite"
            path="M 60,100 L 440,100"
          />
        </circle>

        {/* Process Steps */}
        {steps.map((step, idx) => {
          const x = 80 + idx * 100;
          const Icon = step.icon;
          const isActive = activeStep === idx;

          return (
            <g key={step.id}>
              <circle
                cx={x}
                cy={100}
                r="25"
                fill={step.completed ? "#10b981" : isActive ? "#3b82f6" : "#e5e7eb"}
                stroke={isActive ? "#1d4ed8" : "#9ca3af"}
                strokeWidth="3"
                className={`cursor-pointer transition-all ${isActive ? "animate-pulse" : ""}`}
                onClick={() => interactive && setActiveStep(idx)}
              />
              <text x={x} y={130} textAnchor="middle" className="text-xs font-medium fill-gray-700">
                {step.label}
              </text>
              {step.completed && (
                <text x={x} y={105} textAnchor="middle" className="text-sm fill-white font-bold">
                  ✓
                </text>
              )}
            </g>
          );
        })}

        {/* Data Visualization Chart */}
        <g transform="translate(350, 30)">
          {progress > 80 && (
            <>
              <rect x="0" y="0" width="100" height="60" fill="white" stroke="#e5e7eb" strokeWidth="1" rx="4" />
              <text x="50" y="15" textAnchor="middle" className="text-xs fill-gray-700 font-medium">Results</text>
              {[0, 1, 2, 3, 4].map(i => (
                <rect
                  key={i}
                  x={10 + i * 16}
                  y={50 - (Math.random() * 25 + 5)}
                  width="12"
                  height={Math.random() * 25 + 5}
                  fill="#3b82f6"
                  opacity="0.8"
                >
                  <animate
                    attributeName="height"
                    values="5;30;5"
                    dur="3s"
                    repeatCount="indefinite"
                    begin={`${i * 0.5}s`}
                  />
                </rect>
              ))}
            </>
          )}
        </g>
      </svg>

      {interactive && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Current Step: {steps[activeStep].label}</span>
            <div className="flex gap-1">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${
                    idx === activeStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <Progress value={(activeStep + 1) * 25} className="h-2" />
        </div>
      )}
    </div>
  );
};

const BusinessVisualization: React.FC<{ progress: number; interactive: boolean }> = ({
  progress,
  interactive
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const metrics = [
    { id: 'revenue', value: 85, label: 'Revenue', color: '#10b981' },
    { id: 'customers', value: 72, label: 'Customers', color: '#3b82f6' },
    { id: 'growth', value: 90, label: 'Growth', color: '#f59e0b' },
    { id: 'satisfaction', value: 78, label: 'Satisfaction', color: '#8b5cf6' }
  ];

  return (
    <div className="relative">
      <svg width="500" height="200" className="border border-gray-200 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50">
        {/* Business Dashboard */}
        <rect x="20" y="20" width="460" height="160" fill="white" stroke="#e5e7eb" strokeWidth="1" rx="8" />

        {/* Chart Area */}
        <g transform="translate(50, 50)">
          {/* Bar Chart */}
          {metrics.map((metric, idx) => {
            const barHeight = (metric.value / 100) * 80;
            const x = idx * 80 + 20;
            const isActive = selectedMetric === metric.id;

            return (
              <g key={metric.id}>
                <rect
                  x={x}
                  y={100 - barHeight}
                  width="40"
                  height={barHeight}
                  fill={metric.color}
                  opacity={progress > (idx + 1) * 25 ? (isActive ? "1" : "0.8") : "0.3"}
                  rx="2"
                  className={`cursor-pointer transition-all ${isActive ? "animate-pulse" : ""}`}
                  onClick={() => interactive && setSelectedMetric(
                    selectedMetric === metric.id ? null : metric.id
                  )}
                >
                  {progress > (idx + 1) * 25 && (
                    <animate
                      attributeName="height"
                      values={`0;${barHeight}`}
                      dur="1s"
                      fill="freeze"
                    />
                  )}
                </rect>
                <text
                  x={x + 20}
                  y={115}
                  textAnchor="middle"
                  className="text-xs fill-gray-700 font-medium"
                >
                  {metric.label}
                </text>
                <text
                  x={x + 20}
                  y={100 - barHeight - 5}
                  textAnchor="middle"
                  className="text-xs fill-gray-600 font-bold"
                >
                  {progress > (idx + 1) * 25 ? `${metric.value}%` : ''}
                </text>
              </g>
            );
          })}
        </g>

        {/* Trend Line */}
        {progress > 75 && (
          <polyline
            points="50,150 150,120 250,90 350,80 450,70"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeDasharray="300"
            strokeDashoffset="300"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="300;0"
              dur="2s"
              fill="freeze"
            />
          </polyline>
        )}

        {/* KPI Indicators */}
        <g transform="translate(380, 40)">
          <circle cx="0" cy="0" r="8" fill="#10b981" opacity={progress > 50 ? "1" : "0.3"} />
          <text x="15" y="4" className="text-xs fill-gray-700">Growth ↗</text>

          <circle cx="0" cy="20" r="8" fill="#f59e0b" opacity={progress > 60 ? "1" : "0.3"} />
          <text x="15" y="24" className="text-xs fill-gray-700">Revenue</text>

          <circle cx="0" cy="40" r="8" fill="#3b82f6" opacity={progress > 70 ? "1" : "0.3"} />
          <text x="15" y="44" className="text-xs fill-gray-700">Market</text>
        </g>
      </svg>

      {selectedMetric && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium capitalize">{selectedMetric} Analysis</h4>
          <p className="text-sm text-gray-600 mt-1">
            {getBusinessMetricDescription(selectedMetric)}
          </p>
        </div>
      )}
    </div>
  );
};

const LanguageVisualization: React.FC<{ progress: number; interactive: boolean }> = ({
  progress,
  interactive
}) => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const languageSkills = [
    { id: 'listening', x: 100, y: 80, label: 'Listening', completed: progress > 25 },
    { id: 'speaking', x: 200, y: 60, label: 'Speaking', completed: progress > 50 },
    { id: 'reading', x: 300, y: 80, label: 'Reading', completed: progress > 35 },
    { id: 'writing', x: 400, y: 100, label: 'Writing', completed: progress > 65 }
  ];

  return (
    <div className="relative">
      <svg width="500" height="200" className="border border-gray-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Language Learning Path */}
        <defs>
          <pattern id="wordsPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <text x="20" y="20" textAnchor="middle" className="text-xs fill-gray-300 font-light">
              ABC
            </text>
          </pattern>
        </defs>

        <rect x="20" y="20" width="460" height="160" fill="url(#wordsPattern)" opacity="0.1" rx="8" />

        {/* Speaking Waves */}
        {progress > 50 && (
          <g transform="translate(180, 40)">
            {[0, 1, 2].map(i => (
              <ellipse
                key={i}
                cx="20"
                cy="20"
                rx={10 + i * 8}
                ry={5 + i * 3}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                opacity={0.6 - i * 0.2}
              >
                <animate
                  attributeName="rx"
                  values={`${10 + i * 8};${15 + i * 8};${10 + i * 8}`}
                  dur="2s"
                  repeatCount="indefinite"
                  begin={`${i * 0.3}s`}
                />
              </ellipse>
            ))}
          </g>
        )}

        {/* Language Skills Bubbles */}
        {languageSkills.map((skill) => (
          <g key={skill.id}>
            <circle
              cx={skill.x}
              cy={skill.y}
              r="25"
              fill={skill.completed ? "#10b981" : selectedSkill === skill.id ? "#3b82f6" : "#e5e7eb"}
              stroke={selectedSkill === skill.id ? "#1d4ed8" : "#9ca3af"}
              strokeWidth="2"
              className={`cursor-pointer transition-all duration-300 ${
                interactive ? "hover:scale-110" : ""
              }`}
              onClick={() => interactive && setSelectedSkill(selectedSkill === skill.id ? null : skill.id)}
            />
            <text
              x={skill.x}
              y={skill.y + 40}
              textAnchor="middle"
              className="text-xs font-medium fill-gray-700"
            >
              {skill.label}
            </text>
            {skill.completed && (
              <text
                x={skill.x}
                y={skill.y + 4}
                textAnchor="middle"
                className="text-sm fill-white font-bold"
              >
                ✓
              </text>
            )}
          </g>
        ))}

        {/* Progress Connections */}
        <path
          d="M 125,80 Q 150,50 175,60 Q 225,40 250,60 Q 275,80 325,80 Q 350,90 375,100"
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          strokeDasharray={progress > 40 ? "0" : "5,5"}
          opacity={progress > 40 ? "0.8" : "0.3"}
        />

        {/* Vocabulary Building */}
        <g transform="translate(50, 140)">
          <text x="0" y="0" className="text-xs fill-gray-600 font-medium">Vocabulary Progress:</text>
          {[...Array(10)].map((_, i) => (
            <rect
              key={i}
              x={i * 15 + 120}
              y={-8}
              width="12"
              height="12"
              fill={progress > i * 10 ? "#3b82f6" : "#e5e7eb"}
              rx="2"
            />
          ))}
        </g>
      </svg>

      {selectedSkill && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium capitalize">{selectedSkill} Skills</h4>
          <p className="text-sm text-gray-600 mt-1">
            {getLanguageSkillDescription(selectedSkill)}
          </p>
        </div>
      )}
    </div>
  );
};

const HealthVisualization: React.FC<{ progress: number; interactive: boolean }> = ({
  progress,
  interactive
}) => {
  const [activeArea, setActiveArea] = useState<string | null>(null);

  const healthAreas = [
    { id: 'nutrition', x: 150, y: 80, label: 'Nutrition', completed: progress > 30 },
    { id: 'exercise', x: 250, y: 60, label: 'Exercise', completed: progress > 50 },
    { id: 'mental', x: 350, y: 80, label: 'Mental Health', completed: progress > 40 },
    { id: 'sleep', x: 200, y: 130, label: 'Sleep', completed: progress > 60 },
    { id: 'preventive', x: 300, y: 130, label: 'Prevention', completed: progress > 70 }
  ];

  return (
    <div className="relative">
      <svg width="500" height="200" className="border border-gray-200 rounded-lg bg-gradient-to-br from-green-50 to-teal-50">
        {/* Human Body Outline */}
        <defs>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Body visualization */}
        <g transform="translate(80, 30)">
          <ellipse cx="50" cy="20" rx="15" ry="18" fill="url(#bodyGrad)" stroke="#10b981" strokeWidth="2" />
          <rect x="40" y="38" width="20" height="40" fill="url(#bodyGrad)" stroke="#10b981" strokeWidth="2" rx="8" />
          <rect x="25" y="45" width="15" height="25" fill="url(#bodyGrad)" stroke="#10b981" strokeWidth="2" rx="6" />
          <rect x="60" y="45" width="15" height="25" fill="url(#bodyGrad)" stroke="#10b981" strokeWidth="2" rx="6" />
          <rect x="35" y="78" width="10" height="30" fill="url(#bodyGrad)" stroke="#10b981" strokeWidth="2" rx="4" />
          <rect x="55" y="78" width="10" height="30" fill="url(#bodyGrad)" stroke="#10b981" strokeWidth="2" rx="4" />

          {/* Health indicators */}
          {progress > 25 && (
            <circle cx="50" cy="55" r="3" fill="#ef4444" opacity="0.8">
              <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" />
            </circle>
          )}
        </g>

        {/* Health Areas */}
        {healthAreas.map((area) => (
          <g key={area.id}>
            <circle
              cx={area.x}
              cy={area.y}
              r="20"
              fill={area.completed ? "#10b981" : activeArea === area.id ? "#06b6d4" : "#e5e7eb"}
              stroke={activeArea === area.id ? "#0891b2" : "#9ca3af"}
              strokeWidth="2"
              className={`cursor-pointer transition-all duration-300 ${
                interactive ? "hover:scale-110" : ""
              }`}
              onClick={() => interactive && setActiveArea(activeArea === area.id ? null : area.id)}
            />
            <text
              x={area.x}
              y={area.y + 35}
              textAnchor="middle"
              className="text-xs font-medium fill-gray-700"
            >
              {area.label}
            </text>
            {area.completed && (
              <text
                x={area.x}
                y={area.y + 4}
                textAnchor="middle"
                className="text-sm fill-white font-bold"
              >
                ✓
              </text>
            )}
          </g>
        ))}

        {/* Health Progress Bar */}
        <g transform="translate(380, 50)">
          <text x="0" y="0" className="text-xs fill-gray-600 font-medium">Wellness</text>
          <rect x="0" y="10" width="80" height="8" fill="#e5e7eb" rx="4" />
          <rect x="0" y="10" width={progress * 0.8} height="8" fill="#10b981" rx="4">
            <animate attributeName="width" values="0;80;0" dur="3s" repeatCount="indefinite" />
          </rect>
          <text x="40" y="30" textAnchor="middle" className="text-xs fill-gray-600">{progress}%</text>
        </g>
      </svg>

      {activeArea && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium capitalize">{activeArea}</h4>
          <p className="text-sm text-gray-600 mt-1">
            {getHealthAreaDescription(activeArea)}
          </p>
        </div>
      )}
    </div>
  );
};

const CookingVisualization: React.FC<{ progress: number; interactive: boolean }> = ({
  progress,
  interactive
}) => {
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);

  const techniques = [
    { id: 'knife', x: 100, y: 80, label: 'Knife Skills', completed: progress > 20 },
    { id: 'seasoning', x: 200, y: 60, label: 'Seasoning', completed: progress > 40 },
    { id: 'heat', x: 300, y: 80, label: 'Heat Control', completed: progress > 60 },
    { id: 'plating', x: 400, y: 100, label: 'Plating', completed: progress > 80 }
  ];

  return (
    <div className="relative">
      <svg width="500" height="200" className="border border-gray-200 rounded-lg bg-gradient-to-br from-orange-50 to-red-50">
        {/* Kitchen Scene */}
        <rect x="50" y="50" width="400" height="100" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" rx="8" />

        {/* Cooking Surface */}
        <rect x="70" y="70" width="60" height="60" fill="#374151" rx="30" />
        <circle cx="100" cy="100" r="20" fill="#ef4444" opacity={progress > 30 ? "0.8" : "0.3"}>
          {progress > 30 && (
            <animate attributeName="r" values="20;25;20" dur="2s" repeatCount="indefinite" />
          )}
        </circle>

        {/* Ingredients */}
        <g transform="translate(180, 80)">
          {['🥕', '🧅', '🧄', '🌿'].map((emoji, idx) => (
            <text
              key={idx}
              x={idx * 30}
              y={0}
              className="text-lg"
              opacity={progress > (idx + 1) * 15 ? "1" : "0.3"}
            >
              {emoji}
            </text>
          ))}
        </g>

        {/* Cooking Techniques */}
        {techniques.map((technique) => (
          <g key={technique.id}>
            <circle
              cx={technique.x}
              cy={technique.y}
              r="18"
              fill={technique.completed ? "#f59e0b" : selectedTechnique === technique.id ? "#ef4444" : "#e5e7eb"}
              stroke={selectedTechnique === technique.id ? "#dc2626" : "#9ca3af"}
              strokeWidth="2"
              className={`cursor-pointer transition-all duration-300 ${
                interactive ? "hover:scale-110" : ""
              }`}
              onClick={() => interactive && setSelectedTechnique(selectedTechnique === technique.id ? null : technique.id)}
            />
            <text
              x={technique.x}
              y={technique.y + 30}
              textAnchor="middle"
              className="text-xs font-medium fill-gray-700"
            >
              {technique.label}
            </text>
            {technique.completed && (
              <text
                x={technique.x}
                y={technique.y + 4}
                textAnchor="middle"
                className="text-xs fill-white font-bold"
              >
                ✓
              </text>
            )}
          </g>
        ))}

        {/* Steam Animation */}
        {progress > 50 && (
          <g transform="translate(95, 75)">
            {[0, 1, 2].map(i => (
              <path
                key={i}
                d={`M ${i * 3} 0 Q ${i * 3 + 2} -10 ${i * 3 + 4} -20 Q ${i * 3 + 6} -30 ${i * 3 + 8} -40`}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                opacity="0.6"
              >
                <animate
                  attributeName="opacity"
                  values="0;0.6;0"
                  dur="3s"
                  repeatCount="indefinite"
                  begin={`${i * 0.5}s`}
                />
              </path>
            ))}
          </g>
        )}
      </svg>

      {selectedTechnique && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <h4 className="font-medium capitalize">{selectedTechnique}</h4>
          <p className="text-sm text-gray-600 mt-1">
            {getCookingTechniqueDescription(selectedTechnique)}
          </p>
        </div>
      )}
    </div>
  );
};

const SkillVisualization: React.FC<SkillVisualizationProps> = ({
  skillId,
  skillName,
  category,
  level,
  progress,
  topics = [],
  interactive = false
}) => {
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'interactive'>('overview');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getCategoryIcon = () => {
    switch (category.toLowerCase()) {
      case 'technology':
      case 'programming':
        return <Code className="w-5 h-5" />;
      case 'design':
      case 'creative':
        return <Palette className="w-5 h-5" />;
      case 'business':
        return <Briefcase className="w-5 h-5" />;
      case 'science':
      case 'data science':
        return <Microscope className="w-5 h-5" />;
      case 'languages':
      case 'language':
        return <Globe className="w-5 h-5" />;
      case 'health':
      case 'medical':
      case 'healthcare':
        return <Heart className="w-5 h-5" />;
      case 'cooking':
      case 'culinary':
      case 'food':
        return <PenTool className="w-5 h-5" />;
      default:
        return <Brain className="w-5 h-5" />;
    }
  };

  const renderVisualization = () => {
    const commonProps = { progress, interactive: viewMode === 'interactive', topics };

    switch (category.toLowerCase()) {
      case 'technology':
      case 'programming':
        return <ProgrammingVisualization {...commonProps} />;
      case 'design':
      case 'creative':
        return <DesignVisualization {...commonProps} />;
      case 'business':
        return <BusinessVisualization {...commonProps} />;
      case 'science':
      case 'data science':
        return <DataScienceVisualization {...commonProps} />;
      case 'languages':
      case 'language':
        return <LanguageVisualization {...commonProps} />;
      case 'health':
      case 'medical':
      case 'healthcare':
        return <HealthVisualization {...commonProps} />;
      case 'cooking':
      case 'culinary':
      case 'food':
        return <CookingVisualization {...commonProps} />;
      default:
        return <ProgrammingVisualization {...commonProps} />; // Default fallback
    }
  };

  const getLevelColor = () => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`transition-all duration-300 ${isFullscreen ? 'fixed inset-4 z-50 overflow-auto' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getCategoryIcon()}
            <div>
              <CardTitle className="flex items-center gap-2">
                {skillName}
                <Badge className={getLevelColor()}>
                  {level}
                </Badge>
              </CardTitle>
              <CardDescription>{category} • {progress}% Complete</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Overall Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed</TabsTrigger>
            <TabsTrigger value="interactive">Interactive</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-4">
              {renderVisualization()}

              {/* Topics */}
              {topics.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Key Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((topic, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className={`${progress > (idx + 1) * (100 / topics.length) ? 'bg-green-100 text-green-800' : ''}`}
                      >
                        {topic}
                        {progress > (idx + 1) * (100 / topics.length) && ' ✓'}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="detailed">
            <div className="space-y-4">
              {renderVisualization()}

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Learning Path</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {['Fundamentals', 'Practical Application', 'Advanced Concepts', 'Mastery'].map((phase, idx) => (
                        <div key={phase} className="flex items-center justify-between">
                          <span className="text-sm">{phase}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={Math.max(0, Math.min(100, (progress - idx * 25) * 4))} className="w-16 h-2" />
                            {progress > (idx + 1) * 25 && <Badge className="text-xs bg-green-100 text-green-800">✓</Badge>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Skill Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Theoretical Knowledge</span>
                        <span className="text-sm font-medium">{Math.min(100, progress + 10)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Practical Skills</span>
                        <span className="text-sm font-medium">{Math.max(0, progress - 15)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Problem Solving</span>
                        <span className="text-sm font-medium">{Math.max(0, progress - 5)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="interactive">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Interactive Learning Mode</h4>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Play className="w-4 h-4 mr-2" />
                    Start Tutorial
                  </Button>
                  <Button size="sm" variant="outline">
                    <Target className="w-4 h-4 mr-2" />
                    Practice Mode
                  </Button>
                </div>
              </div>

              {renderVisualization()}

              {/* Interactive Controls */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Quick Quiz
                </Button>
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Study Group
                </Button>
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Resources
                </Button>
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Practice
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Helper functions
const getTopicDescription = (topic: string): string => {
  const descriptions: Record<string, string> = {
    'variables': 'Containers for storing data values that can be changed during program execution.',
    'functions': 'Reusable blocks of code that perform specific tasks and can accept parameters.',
    'loops': 'Programming constructs that repeat a block of code multiple times.',
    'conditionals': 'Statements that execute different code based on whether conditions are true or false.',
    'objects': 'Data structures that combine data and functions into a single unit.',
    'classes': 'Templates for creating objects with shared properties and methods.',
    'modules': 'Separate files that contain related functions, classes, and variables.'
  };
  return descriptions[topic] || 'Learn more about this programming concept.';
};

const getBusinessMetricDescription = (metric: string): string => {
  const descriptions: Record<string, string> = {
    'revenue': 'Total income generated from business operations before expenses.',
    'customers': 'Number of active customers and customer acquisition metrics.',
    'growth': 'Rate of business expansion across various key performance indicators.',
    'satisfaction': 'Customer satisfaction scores and feedback analysis.'
  };
  return descriptions[metric] || 'Key business performance indicator.';
};

const getLanguageSkillDescription = (skill: string): string => {
  const descriptions: Record<string, string> = {
    'listening': 'Ability to understand spoken language, including accents and dialects.',
    'speaking': 'Oral communication skills including pronunciation and fluency.',
    'reading': 'Comprehension of written texts across different styles and complexities.',
    'writing': 'Written expression skills from basic to advanced composition.'
  };
  return descriptions[skill] || 'Essential language learning component.';
};

const getHealthAreaDescription = (area: string): string => {
  const descriptions: Record<string, string> = {
    'nutrition': 'Understanding of balanced diet and nutritional requirements.',
    'exercise': 'Physical fitness routines and movement for optimal health.',
    'mental': 'Mental wellness strategies and emotional health management.',
    'sleep': 'Sleep hygiene and restorative rest practices.',
    'preventive': 'Preventive care and health maintenance strategies.'
  };
  return descriptions[area] || 'Important aspect of overall health and wellness.';
};

const getCookingTechniqueDescription = (technique: string): string => {
  const descriptions: Record<string, string> = {
    'knife': 'Proper knife handling, cutting techniques, and kitchen safety.',
    'seasoning': 'Understanding flavors, spices, and how to balance taste.',
    'heat': 'Temperature control and cooking methods for optimal results.',
    'plating': 'Food presentation and visual appeal techniques.'
  };
  return descriptions[technique] || 'Essential culinary skill for cooking mastery.';
};

export default SkillVisualization;