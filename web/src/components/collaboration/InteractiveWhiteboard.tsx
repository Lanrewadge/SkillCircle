'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Palette,
  Eraser,
  Square,
  Circle,
  MousePointer,
  Type,
  Undo,
  Redo,
  Download,
  Upload,
  Users,
  Eye,
  EyeOff,
  Trash2,
  Move,
  Pencil
} from 'lucide-react'

interface Point {
  x: number
  y: number
}

interface DrawingPath {
  id: string
  tool: string
  color: string
  width: number
  points: Point[]
  timestamp: number
  userId: string
}

interface WhiteboardUser {
  id: string
  name: string
  color: string
  cursor?: Point
  isActive: boolean
}

interface InteractiveWhiteboardProps {
  sessionId?: string
  isTeacher?: boolean
  className?: string
}

export default function InteractiveWhiteboard({
  sessionId = 'demo',
  isTeacher = false,
  className = ''
}: InteractiveWhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentTool, setCurrentTool] = useState('pen')
  const [currentColor, setCurrentColor] = useState('#000000')
  const [currentWidth, setCurrentWidth] = useState(3)
  const [paths, setPaths] = useState<DrawingPath[]>([])
  const [currentPath, setCurrentPath] = useState<Point[]>([])
  const [history, setHistory] = useState<DrawingPath[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [users, setUsers] = useState<WhiteboardUser[]>([
    { id: '1', name: 'You', color: '#FF6B6B', isActive: true },
    { id: '2', name: 'Sarah (Teacher)', color: '#4ECDC4', isActive: true },
    { id: '3', name: 'Mike', color: '#45B7D1', isActive: false }
  ])
  const [showCursors, setShowCursors] = useState(true)
  const [textInput, setTextInput] = useState('')
  const [textPosition, setTextPosition] = useState<Point | null>(null)

  const colors = [
    '#000000', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471'
  ]

  const tools = [
    { id: 'pen', name: 'Pen', icon: Pencil },
    { id: 'eraser', name: 'Eraser', icon: Eraser },
    { id: 'text', name: 'Text', icon: Type },
    { id: 'select', name: 'Select', icon: MousePointer },
    { id: 'rectangle', name: 'Rectangle', icon: Square },
    { id: 'circle', name: 'Circle', icon: Circle },
    { id: 'move', name: 'Move', icon: Move }
  ]

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Set default styles
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.imageSmoothingEnabled = true

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    redrawCanvas()
  }, [])

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw all paths
    paths.forEach(path => {
      if (path.points.length < 2) return

      ctx.beginPath()
      ctx.globalCompositeOperation = path.tool === 'eraser' ? 'destination-out' : 'source-over'
      ctx.strokeStyle = path.color
      ctx.lineWidth = path.width

      ctx.moveTo(path.points[0].x, path.points[0].y)
      path.points.forEach(point => {
        ctx.lineTo(point.x, point.y)
      })
      ctx.stroke()
    })
  }, [paths])

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === 'text') {
      const pos = getMousePos(e)
      setTextPosition(pos)
      return
    }

    setIsDrawing(true)
    const pos = getMousePos(e)
    setCurrentPath([pos])
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || currentTool === 'text') return

    const pos = getMousePos(e)
    const newPath = [...currentPath, pos]
    setCurrentPath(newPath)

    // Real-time drawing
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.globalCompositeOperation = currentTool === 'eraser' ? 'destination-out' : 'source-over'
    ctx.strokeStyle = currentColor
    ctx.lineWidth = currentWidth

    if (currentPath.length > 0) {
      ctx.beginPath()
      ctx.moveTo(currentPath[currentPath.length - 1].x, currentPath[currentPath.length - 1].y)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    }
  }

  const stopDrawing = () => {
    if (!isDrawing) return

    setIsDrawing(false)

    if (currentPath.length > 0) {
      const newDrawingPath: DrawingPath = {
        id: Date.now().toString(),
        tool: currentTool,
        color: currentColor,
        width: currentWidth,
        points: currentPath,
        timestamp: Date.now(),
        userId: '1'
      }

      const newPaths = [...paths, newDrawingPath]
      setPaths(newPaths)

      // Add to history for undo/redo
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(newPaths)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)

      // Simulate real-time collaboration
      broadcastDrawing(newDrawingPath)
    }

    setCurrentPath([])
  }

  const broadcastDrawing = (path: DrawingPath) => {
    // In a real app, this would send to WebSocket/Socket.io
    console.log('Broadcasting drawing:', path)
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setPaths(history[historyIndex - 1] || [])
      setTimeout(redrawCanvas, 0)
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setPaths(history[historyIndex + 1] || [])
      setTimeout(redrawCanvas, 0)
    }
  }

  const clearCanvas = () => {
    setPaths([])
    const newHistory = [...history, []]
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    setTimeout(redrawCanvas, 0)
  }

  const saveCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `whiteboard_${sessionId}_${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const addTextToCanvas = () => {
    if (!textPosition || !textInput.trim()) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.font = `${currentWidth * 8}px Arial`
    ctx.fillStyle = currentColor
    ctx.fillText(textInput, textPosition.x, textPosition.y)

    // Create a text path for collaboration
    const textPath: DrawingPath = {
      id: Date.now().toString(),
      tool: 'text',
      color: currentColor,
      width: currentWidth,
      points: [{ ...textPosition, text: textInput } as any],
      timestamp: Date.now(),
      userId: '1'
    }

    const newPaths = [...paths, textPath]
    setPaths(newPaths)

    setTextInput('')
    setTextPosition(null)
  }

  return (
    <Card className={`${className} h-full flex flex-col`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Interactive Whiteboard</span>
            <Badge variant="outline" className="ml-2">
              Live Session
            </Badge>
          </CardTitle>

          {/* Active Users */}
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <div className="flex -space-x-2">
              {users.map(user => (
                <div
                  key={user.id}
                  className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white relative ${
                    user.isActive ? '' : 'opacity-50'
                  }`}
                  style={{ backgroundColor: user.color }}
                  title={user.name}
                >
                  {user.name.charAt(0)}
                  {user.isActive && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between space-x-4 pt-3 border-t">
          {/* Tools */}
          <div className="flex items-center space-x-1">
            {tools.map(tool => {
              const Icon = tool.icon
              return (
                <Button
                  key={tool.id}
                  variant={currentTool === tool.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentTool(tool.id)}
                  title={tool.name}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              )
            })}
          </div>

          {/* Colors */}
          <div className="flex items-center space-x-1">
            {colors.map(color => (
              <button
                key={color}
                className={`w-6 h-6 rounded border-2 ${
                  currentColor === color ? 'border-gray-400' : 'border-gray-200'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setCurrentColor(color)}
              />
            ))}
          </div>

          {/* Brush Size */}
          <Select value={currentWidth.toString()} onValueChange={(value) => setCurrentWidth(parseInt(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1px</SelectItem>
              <SelectItem value="3">3px</SelectItem>
              <SelectItem value="5">5px</SelectItem>
              <SelectItem value="8">8px</SelectItem>
              <SelectItem value="12">12px</SelectItem>
            </SelectContent>
          </Select>

          {/* Actions */}
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={historyIndex <= 0}
              title="Undo"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              title="Redo"
            >
              <Redo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCursors(!showCursors)}
              title="Toggle Cursors"
            >
              {showCursors ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearCanvas}
              title="Clear All"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={saveCanvas}
              title="Save Image"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 relative">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full border cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{
            cursor: currentTool === 'eraser' ? 'crosshair' :
                   currentTool === 'text' ? 'text' :
                   currentTool === 'select' ? 'pointer' :
                   currentTool === 'move' ? 'move' : 'crosshair'
          }}
        />

        {/* Text Input Overlay */}
        {textPosition && (
          <div
            className="absolute bg-white border rounded p-2 shadow-lg z-10"
            style={{
              left: textPosition.x,
              top: textPosition.y
            }}
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addTextToCanvas()
                } else if (e.key === 'Escape') {
                  setTextPosition(null)
                  setTextInput('')
                }
              }}
              className="border-none outline-none bg-transparent"
              style={{ color: currentColor }}
              placeholder="Type text..."
              autoFocus
            />
            <div className="flex space-x-1 mt-1">
              <Button size="sm" onClick={addTextToCanvas}>Add</Button>
              <Button size="sm" variant="outline" onClick={() => setTextPosition(null)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Collaborative Cursors */}
        {showCursors && users.filter(u => u.cursor && u.id !== '1').map(user => (
          <div
            key={`cursor-${user.id}`}
            className="absolute pointer-events-none z-20"
            style={{
              left: user.cursor?.x,
              top: user.cursor?.y,
              transform: 'translate(-2px, -2px)'
            }}
          >
            <div
              className="w-4 h-4 rotate-12 border-l-2 border-b-2 border-white"
              style={{ backgroundColor: user.color }}
            ></div>
            <div
              className="text-xs bg-black text-white px-1 rounded mt-1 whitespace-nowrap"
              style={{ backgroundColor: user.color }}
            >
              {user.name}
            </div>
          </div>
        ))}

        {/* Floating Toolbar for Mobile */}
        <div className="md:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg p-2 flex space-x-2">
          <Button
            variant={currentTool === 'pen' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentTool('pen')}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant={currentTool === 'eraser' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentTool('eraser')}
          >
            <Eraser className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={undo}>
            <Undo className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}