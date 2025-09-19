'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  Circle,
  Clock,
  ArrowRight,
  ArrowDown,
  Book,
  Video,
  ExternalLink,
  Play,
  Pause,
  SkipForward,
  Target,
  TrendingUp,
  Users,
  Star,
  Lightbulb,
  Zap
} from 'lucide-react'

interface RoadmapNode {
  id: string
  title: string
  description: string
  type: 'foundation' | 'core' | 'advanced' | 'optional' | 'practice'
  position: { x: number; y: number }
  connections: string[]
  status: 'pending' | 'in-progress' | 'completed' | 'skipped'
  estimatedTime: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  resources: {
    type: 'article' | 'video' | 'course' | 'book' | 'practice'
    title: string
    url: string
    duration?: string
  }[]
  prerequisites?: string[]
  skills: string[]
  importance: 'essential' | 'recommended' | 'optional'
}

interface InteractiveRoadmapProps {
  skill: string
  roadmapData: RoadmapNode[]
  onNodeClick?: (node: RoadmapNode) => void
  onProgressUpdate?: (nodeId: string, status: RoadmapNode['status']) => void
}

export default function InteractiveRoadmap({
  skill,
  roadmapData,
  onNodeClick,
  onProgressUpdate
}: InteractiveRoadmapProps) {
  const [nodes, setNodes] = useState<RoadmapNode[]>(roadmapData)
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null)
  const [filter, setFilter] = useState<'all' | 'essential' | 'recommended' | 'optional'>('all')
  const [showCompleted, setShowCompleted] = useState(true)

  // Progress statistics
  const totalNodes = nodes.length
  const completedNodes = nodes.filter(node => node.status === 'completed').length
  const inProgressNodes = nodes.filter(node => node.status === 'in-progress').length
  const progressPercentage = Math.round((completedNodes / totalNodes) * 100)

  const handleNodeStatusChange = (nodeId: string, status: RoadmapNode['status']) => {
    setNodes(prev =>
      prev.map(node =>
        node.id === nodeId ? { ...node, status } : node
      )
    )
    onProgressUpdate?.(nodeId, status)
  }

  const handleNodeClick = (node: RoadmapNode) => {
    setSelectedNode(node)
    onNodeClick?.(node)
  }

  const getNodeColor = (node: RoadmapNode) => {
    switch (node.status) {
      case 'completed':
        return 'bg-green-500 border-green-600 text-white'
      case 'in-progress':
        return 'bg-blue-500 border-blue-600 text-white'
      case 'skipped':
        return 'bg-gray-400 border-gray-500 text-white'
      default:
        switch (node.type) {
          case 'foundation':
            return 'bg-purple-100 border-purple-300 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-100'
          case 'core':
            return 'bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-100'
          case 'advanced':
            return 'bg-red-100 border-red-300 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:border-red-700 dark:text-red-100'
          case 'optional':
            return 'bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100'
          case 'practice':
            return 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:border-green-700 dark:text-green-100'
          default:
            return 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50'
        }
    }
  }

  const getNodeIcon = (node: RoadmapNode) => {
    switch (node.status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'in-progress':
        return <Clock className="w-4 h-4" />
      case 'skipped':
        return <SkipForward className="w-4 h-4" />
      default:
        return <Circle className="w-4 h-4" />
    }
  }

  const filteredNodes = nodes.filter(node => {
    if (filter !== 'all' && node.importance !== filter) return false
    if (!showCompleted && node.status === 'completed') return false
    return true
  })

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold gradient-text">{skill} Learning Roadmap</h2>
          <p className="text-muted-foreground">Interactive pathway to master {skill}</p>
        </div>

        {/* Progress Stats */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{progressPercentage}%</div>
            <div className="text-sm text-muted-foreground">Complete</div>
          </div>
          <div className="w-16 h-16 relative">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="stroke-gray-200 dark:stroke-gray-700"
                strokeWidth="3"
                fill="transparent"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="stroke-green-500"
                strokeWidth="3"
                strokeDasharray={`${progressPercentage}, 100`}
                strokeLinecap="round"
                fill="transparent"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completedNodes}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{inProgressNodes}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{totalNodes}</div>
            <div className="text-sm text-muted-foreground">Total Topics</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {nodes.reduce((acc, node) => acc + parseInt(node.estimatedTime), 0)}h
            </div>
            <div className="text-sm text-muted-foreground">Est. Time</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filter:</span>
          {(['all', 'essential', 'recommended', 'optional'] as const).map((filterOption) => (
            <Button
              key={filterOption}
              variant={filter === filterOption ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterOption)}
              className="capitalize"
            >
              {filterOption}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showCompleted"
            checked={showCompleted}
            onChange={(e) => setShowCompleted(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="showCompleted" className="text-sm">Show completed</label>
        </div>
      </div>

      {/* Interactive Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roadmap Visualization */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Foundation Column */}
                <div className="space-y-4">
                  <h3 className="font-bold text-center text-purple-600 mb-4">Foundation</h3>
                  {filteredNodes
                    .filter(node => node.type === 'foundation')
                    .map((node) => (
                      <div
                        key={node.id}
                        className={`relative cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${getNodeColor(node)}`}
                        onClick={() => handleNodeClick(node)}
                      >
                        <div className="flex items-start gap-2">
                          {getNodeIcon(node)}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{node.title}</h4>
                            <p className="text-xs opacity-75 line-clamp-2">{node.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {node.estimatedTime}h
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {node.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Connection Line */}
                        {node.connections.length > 0 && (
                          <div className="absolute -right-2 top-1/2 transform translate-x-full -translate-y-1/2 hidden md:block">
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                </div>

                {/* Core Column */}
                <div className="space-y-4">
                  <h3 className="font-bold text-center text-blue-600 mb-4">Core Skills</h3>
                  {filteredNodes
                    .filter(node => node.type === 'core')
                    .map((node) => (
                      <div
                        key={node.id}
                        className={`relative cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${getNodeColor(node)}`}
                        onClick={() => handleNodeClick(node)}
                      >
                        <div className="flex items-start gap-2">
                          {getNodeIcon(node)}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{node.title}</h4>
                            <p className="text-xs opacity-75 line-clamp-2">{node.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {node.estimatedTime}h
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {node.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Connection Line */}
                        {node.connections.length > 0 && (
                          <div className="absolute -right-2 top-1/2 transform translate-x-full -translate-y-1/2 hidden md:block">
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                </div>

                {/* Advanced Column */}
                <div className="space-y-4">
                  <h3 className="font-bold text-center text-red-600 mb-4">Advanced</h3>
                  {filteredNodes
                    .filter(node => node.type === 'advanced' || node.type === 'practice')
                    .map((node) => (
                      <div
                        key={node.id}
                        className={`relative cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${getNodeColor(node)}`}
                        onClick={() => handleNodeClick(node)}
                      >
                        <div className="flex items-start gap-2">
                          {getNodeIcon(node)}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{node.title}</h4>
                            <p className="text-xs opacity-75 line-clamp-2">{node.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {node.estimatedTime}h
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {node.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Node Details Sidebar */}
        <div className="lg:col-span-1">
          {selectedNode ? (
            <Card className="sticky top-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{selectedNode.title}</CardTitle>
                  <Badge variant={selectedNode.importance === 'essential' ? 'default' : 'secondary'}>
                    {selectedNode.importance}
                  </Badge>
                </div>
                <CardDescription>{selectedNode.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status Controls */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Progress</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant={selectedNode.status === 'in-progress' ? 'default' : 'outline'}
                      onClick={() => handleNodeStatusChange(selectedNode.id, 'in-progress')}
                      className="text-xs"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Start
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedNode.status === 'completed' ? 'default' : 'outline'}
                      onClick={() => handleNodeStatusChange(selectedNode.id, 'completed')}
                      className="text-xs"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Done
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant={selectedNode.status === 'skipped' ? 'default' : 'outline'}
                    onClick={() => handleNodeStatusChange(selectedNode.id, 'skipped')}
                    className="w-full text-xs"
                  >
                    <SkipForward className="w-3 h-3 mr-1" />
                    Skip
                  </Button>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Estimated Time:</span>
                    <span className="font-medium">{selectedNode.estimatedTime} hours</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Difficulty:</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {selectedNode.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {selectedNode.type}
                    </Badge>
                  </div>
                </div>

                {/* Skills */}
                {selectedNode.skills.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Skills you'll learn:</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedNode.skills.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resources */}
                {selectedNode.resources.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Learning Resources:</h4>
                    <div className="space-y-2">
                      {selectedNode.resources.map((resource, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded border bg-muted/30">
                          {resource.type === 'video' && <Video className="w-4 h-4 text-red-500" />}
                          {resource.type === 'article' && <Book className="w-4 h-4 text-blue-500" />}
                          {resource.type === 'course' && <Target className="w-4 h-4 text-green-500" />}
                          {resource.type === 'practice' && <Zap className="w-4 h-4 text-purple-500" />}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium line-clamp-1">{resource.title}</div>
                            {resource.duration && (
                              <div className="text-xs text-muted-foreground">{resource.duration}</div>
                            )}
                          </div>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prerequisites */}
                {selectedNode.prerequisites && selectedNode.prerequisites.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Prerequisites:</h4>
                    <div className="space-y-1">
                      {selectedNode.prerequisites.map((prereq, idx) => (
                        <div key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
                          <Lightbulb className="w-3 h-3" />
                          {prereq}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="sticky top-8">
              <CardContent className="p-6 text-center">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">Select a Topic</h3>
                <p className="text-sm text-muted-foreground">
                  Click on any topic in the roadmap to see details and resources
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Roadmap Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-100 border-2 border-purple-300 rounded"></div>
              <span className="text-sm">Foundation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
              <span className="text-sm">Core Skills</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
              <span className="text-sm">Advanced</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
              <span className="text-sm">Practice</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded"></div>
              <span className="text-sm">Optional</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}