import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Lock,
  Unlock,
  CheckCircle,
  Circle,
  Star,
  Target,
  Clock,
  Award,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Maximize
} from 'lucide-react';

interface SkillNode {
  id: string;
  name: string;
  description: string;
  category: string;
  level: number;
  prerequisiteIds: string[];
  unlocked: boolean;
  completed: boolean;
  progress: number;
  estimatedHours: number;
  xp: number;
  x: number;
  y: number;
  skills?: string[];
}

interface SkillTreeProps {
  treeId: string;
  treeName: string;
  description: string;
  nodes: SkillNode[];
  userProgress?: Record<string, number>;
  onNodeSelect?: (nodeId: string) => void;
  interactive?: boolean;
}

const skillTrees = {
  'full-stack-web-dev': {
    name: 'Full-Stack Web Development',
    description: 'Complete pathway from frontend to backend development',
    nodes: [
      {
        id: 'html-css',
        name: 'HTML & CSS',
        description: 'Foundation of web structure and styling',
        category: 'frontend',
        level: 1,
        prerequisiteIds: [],
        unlocked: true,
        completed: true,
        progress: 100,
        estimatedHours: 40,
        xp: 500,
        x: 100,
        y: 100,
        skills: ['HTML5', 'CSS3', 'Responsive Design', 'Flexbox', 'Grid']
      },
      {
        id: 'javascript',
        name: 'JavaScript Fundamentals',
        description: 'Core programming language for web development',
        category: 'frontend',
        level: 2,
        prerequisiteIds: ['html-css'],
        unlocked: true,
        completed: true,
        progress: 85,
        estimatedHours: 60,
        xp: 750,
        x: 250,
        y: 80,
        skills: ['ES6+', 'DOM Manipulation', 'Event Handling', 'Async/Await']
      },
      {
        id: 'react',
        name: 'React Framework',
        description: 'Modern frontend library for building user interfaces',
        category: 'frontend',
        level: 3,
        prerequisiteIds: ['javascript'],
        unlocked: true,
        completed: false,
        progress: 60,
        estimatedHours: 80,
        xp: 1000,
        x: 400,
        y: 60,
        skills: ['Components', 'Hooks', 'State Management', 'Router']
      },
      {
        id: 'node-js',
        name: 'Node.js',
        description: 'Server-side JavaScript runtime environment',
        category: 'backend',
        level: 3,
        prerequisiteIds: ['javascript'],
        unlocked: true,
        completed: false,
        progress: 30,
        estimatedHours: 70,
        xp: 900,
        x: 250,
        y: 180,
        skills: ['NPM', 'Express.js', 'File System', 'HTTP Modules']
      },
      {
        id: 'database',
        name: 'Database Management',
        description: 'Data storage and retrieval systems',
        category: 'backend',
        level: 4,
        prerequisiteIds: ['node-js'],
        unlocked: false,
        completed: false,
        progress: 0,
        estimatedHours: 50,
        xp: 800,
        x: 400,
        y: 200,
        skills: ['SQL', 'MongoDB', 'Database Design', 'Queries']
      },
      {
        id: 'api-development',
        name: 'API Development',
        description: 'Building RESTful and GraphQL APIs',
        category: 'backend',
        level: 4,
        prerequisiteIds: ['node-js'],
        unlocked: false,
        completed: false,
        progress: 0,
        estimatedHours: 60,
        xp: 1200,
        x: 100,
        y: 220,
        skills: ['REST', 'GraphQL', 'Authentication', 'Testing']
      },
      {
        id: 'full-stack-project',
        name: 'Full-Stack Project',
        description: 'Complete application combining frontend and backend',
        category: 'project',
        level: 5,
        prerequisiteIds: ['react', 'database', 'api-development'],
        unlocked: false,
        completed: false,
        progress: 0,
        estimatedHours: 120,
        xp: 2000,
        x: 300,
        y: 300,
        skills: ['Integration', 'Deployment', 'Testing', 'Performance']
      }
    ]
  },
  'data-science': {
    name: 'Data Science Mastery',
    description: 'From data analysis to machine learning deployment',
    nodes: [
      {
        id: 'python-basics',
        name: 'Python Programming',
        description: 'Programming fundamentals with Python',
        category: 'programming',
        level: 1,
        prerequisiteIds: [],
        unlocked: true,
        completed: true,
        progress: 100,
        estimatedHours: 50,
        xp: 600,
        x: 100,
        y: 100,
        skills: ['Syntax', 'Data Structures', 'Functions', 'OOP']
      },
      {
        id: 'data-manipulation',
        name: 'Data Manipulation',
        description: 'Working with Pandas and NumPy for data processing',
        category: 'analysis',
        level: 2,
        prerequisiteIds: ['python-basics'],
        unlocked: true,
        completed: false,
        progress: 70,
        estimatedHours: 40,
        xp: 700,
        x: 250,
        y: 80,
        skills: ['Pandas', 'NumPy', 'Data Cleaning', 'File I/O']
      },
      {
        id: 'statistics',
        name: 'Statistics & Probability',
        description: 'Mathematical foundations for data analysis',
        category: 'math',
        level: 2,
        prerequisiteIds: ['python-basics'],
        unlocked: true,
        completed: false,
        progress: 40,
        estimatedHours: 60,
        xp: 800,
        x: 100,
        y: 200,
        skills: ['Descriptive Stats', 'Probability', 'Hypothesis Testing']
      },
      {
        id: 'visualization',
        name: 'Data Visualization',
        description: 'Creating compelling charts and graphs',
        category: 'visualization',
        level: 3,
        prerequisiteIds: ['data-manipulation'],
        unlocked: false,
        completed: false,
        progress: 0,
        estimatedHours: 35,
        xp: 600,
        x: 400,
        y: 100,
        skills: ['Matplotlib', 'Seaborn', 'Plotly', 'Dashboard']
      },
      {
        id: 'machine-learning',
        name: 'Machine Learning',
        description: 'Supervised and unsupervised learning algorithms',
        category: 'ml',
        level: 4,
        prerequisiteIds: ['statistics', 'data-manipulation'],
        unlocked: false,
        completed: false,
        progress: 0,
        estimatedHours: 100,
        xp: 1500,
        x: 250,
        y: 250,
        skills: ['Scikit-learn', 'Regression', 'Classification', 'Clustering']
      },
      {
        id: 'deep-learning',
        name: 'Deep Learning',
        description: 'Neural networks and advanced AI techniques',
        category: 'ml',
        level: 5,
        prerequisiteIds: ['machine-learning'],
        unlocked: false,
        completed: false,
        progress: 0,
        estimatedHours: 120,
        xp: 2000,
        x: 400,
        y: 280,
        skills: ['TensorFlow', 'PyTorch', 'CNN', 'RNN']
      }
    ]
  }
};

const SkillTreeVisualization: React.FC<SkillTreeProps> = ({
  treeId,
  treeName,
  description,
  nodes,
  userProgress = {},
  onNodeSelect,
  interactive = true
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [viewMode, setViewMode] = useState<'tree' | 'list' | 'stats'>('tree');
  const [animationSpeed, setAnimationSpeed] = useState(1);

  const getNodeStatus = (node: SkillNode) => {
    if (node.completed) return 'completed';
    if (node.unlocked) return 'unlocked';
    return 'locked';
  };

  const getNodeColor = (node: SkillNode) => {
    const status = getNodeStatus(node);
    switch (status) {
      case 'completed': return '#10b981';
      case 'unlocked': return node.progress > 0 ? '#3b82f6' : '#e5e7eb';
      case 'locked': return '#9ca3af';
      default: return '#e5e7eb';
    }
  };

  const getNodeIcon = (node: SkillNode) => {
    const status = getNodeStatus(node);
    switch (status) {
      case 'completed': return CheckCircle;
      case 'unlocked': return node.progress > 0 ? Target : Circle;
      case 'locked': return Lock;
      default: return Circle;
    }
  };

  const handleNodeClick = (nodeId: string) => {
    if (interactive) {
      setSelectedNode(selectedNode === nodeId ? null : nodeId);
      onNodeSelect?.(nodeId);
    }
  };

  const calculateTreeProgress = () => {
    const totalNodes = nodes.length;
    const completedNodes = nodes.filter(n => n.completed).length;
    const totalProgress = nodes.reduce((sum, n) => sum + n.progress, 0);
    return {
      completion: (completedNodes / totalNodes) * 100,
      averageProgress: totalProgress / totalNodes
    };
  };

  const { completion, averageProgress } = calculateTreeProgress();

  const getConnections = () => {
    const connections: Array<{ from: SkillNode; to: SkillNode }> = [];
    nodes.forEach(node => {
      node.prerequisiteIds.forEach(prereqId => {
        const prereqNode = nodes.find(n => n.id === prereqId);
        if (prereqNode) {
          connections.push({ from: prereqNode, to: node });
        }
      });
    });
    return connections;
  };

  const connections = getConnections();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              {treeName}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{nodes.length} Skills</Badge>
            <Badge className="bg-green-100 text-green-800">
              {Math.round(completion)}% Complete
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {nodes.filter(n => n.completed).length}
            </div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {nodes.filter(n => n.unlocked && !n.completed).length}
            </div>
            <div className="text-xs text-gray-600">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {nodes.reduce((sum, n) => sum + n.xp, 0)}
            </div>
            <div className="text-xs text-gray-600">Total XP</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {nodes.reduce((sum, n) => sum + n.estimatedHours, 0)}h
            </div>
            <div className="text-xs text-gray-600">Est. Time</div>
          </div>
        </div>

        <Progress value={averageProgress} className="h-3 mt-4" />
      </CardHeader>

      <CardContent>
        <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tree">Skill Tree</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="tree" className="space-y-4">
            <div className="relative">
              <svg width="500" height="400" className="border border-gray-200 rounded-lg bg-gradient-to-br from-gray-50 to-blue-50">
                {/* Connections */}
                {connections.map((conn, idx) => (
                  <line
                    key={idx}
                    x1={conn.from.x}
                    y1={conn.from.y}
                    x2={conn.to.x}
                    y2={conn.to.y}
                    stroke={conn.from.completed ? "#10b981" : "#d1d5db"}
                    strokeWidth="2"
                    strokeDasharray={conn.from.completed ? "0" : "5,5"}
                    className={conn.from.completed ? "animate-pulse" : ""}
                  />
                ))}

                {/* Skill Nodes */}
                {nodes.map((node) => {
                  const Icon = getNodeIcon(node);
                  const isSelected = selectedNode === node.id;
                  const nodeColor = getNodeColor(node);

                  return (
                    <g key={node.id}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="25"
                        fill={nodeColor}
                        stroke={isSelected ? "#1d4ed8" : "#9ca3af"}
                        strokeWidth={isSelected ? "3" : "2"}
                        className={`cursor-pointer transition-all duration-300 ${
                          interactive ? "hover:scale-110" : ""
                        } ${node.completed ? "animate-pulse" : ""}`}
                        onClick={() => handleNodeClick(node.id)}
                      />

                      {/* Progress Ring */}
                      {node.progress > 0 && node.progress < 100 && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="28"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3"
                          strokeDasharray={`${(node.progress / 100) * 175.9} 175.9`}
                          strokeDashoffset="-43.98"
                          transform={`rotate(-90 ${node.x} ${node.y})`}
                          opacity="0.8"
                        />
                      )}

                      {/* Level Badge */}
                      <circle
                        cx={node.x + 18}
                        cy={node.y - 18}
                        r="8"
                        fill="#f59e0b"
                        stroke="white"
                        strokeWidth="2"
                      />
                      <text
                        x={node.x + 18}
                        y={node.y - 14}
                        textAnchor="middle"
                        className="text-xs fill-white font-bold"
                      >
                        {node.level}
                      </text>

                      {/* Node Label */}
                      <text
                        x={node.x}
                        y={node.y + 40}
                        textAnchor="middle"
                        className="text-xs font-medium fill-gray-700 max-w-20"
                      >
                        {node.name.length > 12 ? `${node.name.substring(0, 12)}...` : node.name}
                      </text>

                      {/* Status Icon */}
                      <foreignObject x={node.x - 8} y={node.y - 8} width="16" height="16">
                        <Icon className="w-4 h-4 text-white" />
                      </foreignObject>
                    </g>
                  );
                })}

                {/* Legend */}
                <g transform="translate(20, 350)">
                  <text x="0" y="0" className="text-xs font-medium fill-gray-700">Legend:</text>
                  <circle cx="50" cy="-3" r="5" fill="#10b981" />
                  <text x="60" y="0" className="text-xs fill-gray-600">Completed</text>
                  <circle cx="120" cy="-3" r="5" fill="#3b82f6" />
                  <text x="130" y="0" className="text-xs fill-gray-600">In Progress</text>
                  <circle cx="200" cy="-3" r="5" fill="#e5e7eb" />
                  <text x="210" y="0" className="text-xs fill-gray-600">Available</text>
                  <circle cx="270" cy="-3" r="5" fill="#9ca3af" />
                  <text x="280" y="0" className="text-xs fill-gray-600">Locked</text>
                </g>
              </svg>

              {/* Selected Node Details */}
              {selectedNode && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  {(() => {
                    const node = nodes.find(n => n.id === selectedNode);
                    if (!node) return null;

                    const Icon = getNodeIcon(node);
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-blue-600" />
                          <h4 className="font-medium">{node.name}</h4>
                          <Badge variant="outline">Level {node.level}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{node.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <div className="font-medium">Progress</div>
                            <div className="text-gray-600">{node.progress}%</div>
                          </div>
                          <div>
                            <div className="font-medium">Est. Time</div>
                            <div className="text-gray-600">{node.estimatedHours}h</div>
                          </div>
                          <div>
                            <div className="font-medium">XP Reward</div>
                            <div className="text-gray-600">{node.xp} XP</div>
                          </div>
                          <div>
                            <div className="font-medium">Category</div>
                            <div className="text-gray-600 capitalize">{node.category}</div>
                          </div>
                        </div>

                        {node.skills && (
                          <div>
                            <div className="font-medium mb-2">Skills You'll Learn:</div>
                            <div className="flex flex-wrap gap-1">
                              {node.skills.map((skill, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button size="sm" disabled={!node.unlocked}>
                            {node.completed ? 'Review' : 'Start Learning'}
                          </Button>
                          {node.prerequisiteIds.length > 0 && (
                            <Button size="sm" variant="outline">
                              View Prerequisites
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <div className="space-y-3">
              {nodes.sort((a, b) => a.level - b.level).map((node) => {
                const Icon = getNodeIcon(node);
                const status = getNodeStatus(node);

                return (
                  <div
                    key={node.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedNode === node.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleNodeClick(node.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${
                          status === 'completed' ? 'text-green-600' :
                          status === 'unlocked' ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <div>
                          <h4 className="font-medium">{node.name}</h4>
                          <p className="text-sm text-gray-600">{node.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">Level {node.level}</Badge>
                        <div className="text-sm text-gray-600 mt-1">{node.estimatedHours}h</div>
                      </div>
                    </div>
                    {(node.progress > 0 || node.completed) && (
                      <div className="mt-3">
                        <Progress value={node.progress} className="h-2" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Progress by Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(level => {
                      const levelNodes = nodes.filter(n => n.level === level);
                      const completedNodes = levelNodes.filter(n => n.completed).length;
                      const progressPercent = levelNodes.length > 0 ? (completedNodes / levelNodes.length) * 100 : 0;

                      return (
                        <div key={level} className="flex items-center justify-between">
                          <span className="text-sm">Level {level}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={progressPercent} className="w-20 h-2" />
                            <span className="text-sm text-gray-600">{completedNodes}/{levelNodes.length}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Learning Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Total XP Earned</span>
                      <span className="text-sm font-medium">
                        {nodes.filter(n => n.completed).reduce((sum, n) => sum + n.xp, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Hours Invested</span>
                      <span className="text-sm font-medium">
                        {Math.round(nodes.filter(n => n.completed).reduce((sum, n) => sum + n.estimatedHours, 0))}h
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Skills Mastered</span>
                      <span className="text-sm font-medium">
                        {nodes.filter(n => n.completed).reduce((sum, n) => sum + (n.skills?.length || 0), 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Next Milestone</span>
                      <span className="text-sm font-medium">
                        Level {Math.max(...nodes.filter(n => n.completed).map(n => n.level)) + 1}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const SkillTreeDemo: React.FC = () => {
  const [selectedTree, setSelectedTree] = useState<keyof typeof skillTrees>('full-stack-web-dev');

  const currentTree = skillTrees[selectedTree];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Interactive Skill Trees
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Visualize learning pathways with prerequisite dependencies, progress tracking, and gamified elements
        </p>
      </div>

      <div className="flex justify-center gap-4">
        {Object.entries(skillTrees).map(([key, tree]) => (
          <Button
            key={key}
            variant={selectedTree === key ? "default" : "outline"}
            onClick={() => setSelectedTree(key as keyof typeof skillTrees)}
          >
            {tree.name}
          </Button>
        ))}
      </div>

      <SkillTreeVisualization
        treeId={selectedTree}
        treeName={currentTree.name}
        description={currentTree.description}
        nodes={currentTree.nodes}
        interactive={true}
      />
    </div>
  );
};

export { SkillTreeVisualization, SkillTreeDemo };
export default SkillTreeVisualization;