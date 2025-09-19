// Real-time Collaboration Service
class CollaborationService {
  constructor() {
    this.workspaces = new Map()
    this.codeSessions = new Map()
    this.whiteboardSessions = new Map()
    this.activeConnections = new Map()
    this.initializeDefaultData()
  }

  initializeDefaultData() {
    // Initialize sample workspace
    const sampleWorkspace = {
      id: 'workspace_demo',
      name: 'React Learning Project',
      description: 'Collaborative workspace for learning React fundamentals',
      ownerId: '1',
      created: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      members: [
        {
          id: '1',
          name: 'You',
          role: 'OWNER',
          status: 'ONLINE',
          joinedAt: new Date().toISOString(),
          permissions: ['READ', 'WRITE', 'ADMIN']
        },
        {
          id: '2',
          name: 'Sarah Chen',
          role: 'COLLABORATOR',
          status: 'ONLINE',
          joinedAt: new Date(Date.now() - 30 * 60000).toISOString(),
          permissions: ['READ', 'WRITE']
        },
        {
          id: '3',
          name: 'Mike Johnson',
          role: 'VIEWER',
          status: 'AWAY',
          joinedAt: new Date(Date.now() - 60 * 60000).toISOString(),
          permissions: ['READ']
        }
      ],
      files: [
        {
          id: 'file_1',
          name: 'Project Proposal.md',
          type: 'TEXT',
          content: '# React Learning Project\n\nThis is our collaborative project to build a React application.\n\n## Goals\n- Learn React hooks\n- Implement state management\n- Create reusable components\n\n## Timeline\nWeek 1: Setup and basic components\nWeek 2: State management\nWeek 3: Testing and deployment',
          lastModified: new Date().toISOString(),
          modifiedBy: '2',
          version: 3,
          locked: false,
          history: []
        },
        {
          id: 'file_2',
          name: 'app.js',
          type: 'CODE',
          content: 'import React, { useState } from \'react\';\n\nfunction App() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div className="App">\n      <h1>Counter: {count}</h1>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n}\n\nexport default App;',
          lastModified: new Date(Date.now() - 30 * 60000).toISOString(),
          modifiedBy: '1',
          version: 1,
          locked: false,
          history: []
        }
      ],
      settings: {
        isPublic: false,
        allowGuests: false,
        maxMembers: 10,
        autoSave: true,
        versionControl: true
      }
    }

    this.workspaces.set('workspace_demo', sampleWorkspace)

    // Initialize sample code session
    const sampleCodeSession = {
      id: 'code_demo',
      name: 'JavaScript Practice Session',
      language: 'javascript',
      code: '// Welcome to the collaborative code editor!\n\nfunction greetLearners() {\n  const learners = ["Alice", "Bob", "Charlie"];\n  \n  learners.forEach(name => {\n    console.log(`Hello, ${name}! Welcome to SkillCircle!`);\n  });\n}\n\n// Call the function\ngreetLearners();\n\n// Try editing this code collaboratively!',
      participants: [
        {
          id: '1',
          name: 'You',
          cursor: { line: 5, column: 15 },
          selection: null,
          isTyping: false,
          color: '#FF6B6B'
        },
        {
          id: '2',
          name: 'Sarah Chen',
          cursor: { line: 8, column: 25 },
          selection: { start: { line: 8, column: 20 }, end: { line: 8, column: 35 } },
          isTyping: true,
          color: '#4ECDC4'
        }
      ],
      executionHistory: [
        {
          code: 'console.log("Hello, World!");',
          output: 'Hello, World!',
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
          executedBy: '1'
        }
      ],
      created: new Date().toISOString(),
      lastActive: new Date().toISOString()
    }

    this.codeSessions.set('code_demo', sampleCodeSession)
  }

  // Workspace Management
  createWorkspace(ownerId, workspaceData) {
    const workspace = {
      id: `workspace_${Date.now()}`,
      name: workspaceData.name,
      description: workspaceData.description || '',
      ownerId,
      created: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      members: [{
        id: ownerId,
        name: this.getUserName(ownerId),
        role: 'OWNER',
        status: 'ONLINE',
        joinedAt: new Date().toISOString(),
        permissions: ['READ', 'WRITE', 'ADMIN']
      }],
      files: [],
      settings: {
        isPublic: workspaceData.isPublic || false,
        allowGuests: workspaceData.allowGuests || false,
        maxMembers: workspaceData.maxMembers || 10,
        autoSave: true,
        versionControl: true
      }
    }

    this.workspaces.set(workspace.id, workspace)
    return workspace
  }

  getWorkspace(workspaceId) {
    return this.workspaces.get(workspaceId)
  }

  joinWorkspace(workspaceId, userId, role = 'VIEWER') {
    const workspace = this.workspaces.get(workspaceId)
    if (!workspace) {
      throw new Error('Workspace not found')
    }

    if (workspace.members.length >= workspace.settings.maxMembers) {
      throw new Error('Workspace is full')
    }

    const existingMember = workspace.members.find(m => m.id === userId)
    if (existingMember) {
      // Update existing member status
      existingMember.status = 'ONLINE'
      existingMember.joinedAt = new Date().toISOString()
    } else {
      // Add new member
      const permissions = role === 'OWNER' ? ['READ', 'WRITE', 'ADMIN'] :
                         role === 'COLLABORATOR' ? ['READ', 'WRITE'] : ['READ']

      workspace.members.push({
        id: userId,
        name: this.getUserName(userId),
        role,
        status: 'ONLINE',
        joinedAt: new Date().toISOString(),
        permissions
      })
    }

    workspace.lastActive = new Date().toISOString()
    return workspace
  }

  leaveWorkspace(workspaceId, userId) {
    const workspace = this.workspaces.get(workspaceId)
    if (!workspace) {
      throw new Error('Workspace not found')
    }

    const memberIndex = workspace.members.findIndex(m => m.id === userId)
    if (memberIndex === -1) {
      throw new Error('User not in workspace')
    }

    // If owner leaves, transfer ownership to next collaborator
    const member = workspace.members[memberIndex]
    if (member.role === 'OWNER' && workspace.members.length > 1) {
      const nextOwner = workspace.members.find(m => m.id !== userId && m.role === 'COLLABORATOR')
      if (nextOwner) {
        nextOwner.role = 'OWNER'
        nextOwner.permissions = ['READ', 'WRITE', 'ADMIN']
        workspace.ownerId = nextOwner.id
      }
    }

    workspace.members.splice(memberIndex, 1)
    workspace.lastActive = new Date().toISOString()

    return workspace
  }

  // File Operations
  createFile(workspaceId, userId, fileData) {
    const workspace = this.workspaces.get(workspaceId)
    if (!workspace) {
      throw new Error('Workspace not found')
    }

    const member = workspace.members.find(m => m.id === userId)
    if (!member || !member.permissions.includes('WRITE')) {
      throw new Error('Insufficient permissions')
    }

    const file = {
      id: `file_${Date.now()}`,
      name: fileData.name,
      type: fileData.type || 'TEXT',
      content: fileData.content || '',
      lastModified: new Date().toISOString(),
      modifiedBy: userId,
      version: 1,
      locked: false,
      history: []
    }

    workspace.files.push(file)
    workspace.lastActive = new Date().toISOString()

    return file
  }

  updateFile(workspaceId, fileId, userId, content) {
    const workspace = this.workspaces.get(workspaceId)
    if (!workspace) {
      throw new Error('Workspace not found')
    }

    const member = workspace.members.find(m => m.id === userId)
    if (!member || !member.permissions.includes('WRITE')) {
      throw new Error('Insufficient permissions')
    }

    const file = workspace.files.find(f => f.id === fileId)
    if (!file) {
      throw new Error('File not found')
    }

    if (file.locked && file.lockedBy !== userId) {
      throw new Error('File is locked by another user')
    }

    // Save to history
    if (workspace.settings.versionControl) {
      file.history.push({
        version: file.version,
        content: file.content,
        modifiedBy: file.modifiedBy,
        modifiedAt: file.lastModified
      })
    }

    // Update file
    file.content = content
    file.lastModified = new Date().toISOString()
    file.modifiedBy = userId
    file.version += 1

    workspace.lastActive = new Date().toISOString()

    return file
  }

  lockFile(workspaceId, fileId, userId) {
    const workspace = this.workspaces.get(workspaceId)
    if (!workspace) {
      throw new Error('Workspace not found')
    }

    const file = workspace.files.find(f => f.id === fileId)
    if (!file) {
      throw new Error('File not found')
    }

    if (file.locked && file.lockedBy !== userId) {
      throw new Error('File is already locked by another user')
    }

    file.locked = !file.locked
    file.lockedBy = file.locked ? userId : undefined

    return file
  }

  // Code Session Management
  createCodeSession(hostId, sessionData) {
    const session = {
      id: `code_${Date.now()}`,
      name: sessionData.name || 'Code Session',
      language: sessionData.language || 'javascript',
      code: sessionData.code || '',
      participants: [{
        id: hostId,
        name: this.getUserName(hostId),
        cursor: { line: 1, column: 1 },
        selection: null,
        isTyping: false,
        color: this.getUserColor(hostId)
      }],
      executionHistory: [],
      created: new Date().toISOString(),
      lastActive: new Date().toISOString()
    }

    this.codeSessions.set(session.id, session)
    return session
  }

  joinCodeSession(sessionId, userId) {
    const session = this.codeSessions.get(sessionId)
    if (!session) {
      throw new Error('Code session not found')
    }

    const existingParticipant = session.participants.find(p => p.id === userId)
    if (!existingParticipant) {
      session.participants.push({
        id: userId,
        name: this.getUserName(userId),
        cursor: { line: 1, column: 1 },
        selection: null,
        isTyping: false,
        color: this.getUserColor(userId)
      })
    }

    session.lastActive = new Date().toISOString()
    return session
  }

  updateCodeSession(sessionId, userId, updates) {
    const session = this.codeSessions.get(sessionId)
    if (!session) {
      throw new Error('Code session not found')
    }

    const participant = session.participants.find(p => p.id === userId)
    if (!participant) {
      throw new Error('User not in session')
    }

    // Update code
    if (updates.code !== undefined) {
      session.code = updates.code
    }

    // Update participant cursor/selection
    if (updates.cursor) {
      participant.cursor = updates.cursor
    }
    if (updates.selection !== undefined) {
      participant.selection = updates.selection
    }
    if (updates.isTyping !== undefined) {
      participant.isTyping = updates.isTyping
    }

    session.lastActive = new Date().toISOString()
    return session
  }

  executeCode(sessionId, userId, code, language) {
    const session = this.codeSessions.get(sessionId)
    if (!session) {
      throw new Error('Code session not found')
    }

    // Mock code execution
    let result
    try {
      if (language === 'javascript') {
        // Simple JavaScript execution (in real app, use secure sandbox)
        const originalLog = console.log
        let output = ''
        console.log = (...args) => {
          output += args.join(' ') + '\n'
        }

        eval(code)
        console.log = originalLog

        result = {
          success: true,
          output: output || 'Code executed successfully',
          error: null,
          executionTime: Math.random() * 100 + 50
        }
      } else {
        result = {
          success: true,
          output: `${language.toUpperCase()} code executed successfully!`,
          error: null,
          executionTime: Math.random() * 100 + 50
        }
      }
    } catch (error) {
      result = {
        success: false,
        output: '',
        error: error.message,
        executionTime: 0
      }
    }

    // Add to execution history
    session.executionHistory.push({
      code,
      result,
      timestamp: new Date().toISOString(),
      executedBy: userId
    })

    return result
  }

  // Real-time Updates
  broadcastToWorkspace(workspaceId, event, data, senderId) {
    const workspace = this.workspaces.get(workspaceId)
    if (!workspace) return

    // In real implementation, this would use WebSocket/Socket.io
    const message = {
      type: event,
      data,
      senderId,
      timestamp: new Date().toISOString()
    }

    console.log(`Broadcasting to workspace ${workspaceId}:`, message)

    // Simulate real-time updates
    this.simulateRealTimeUpdate(workspaceId, message)

    return message
  }

  broadcastToCodeSession(sessionId, event, data, senderId) {
    const session = this.codeSessions.get(sessionId)
    if (!session) return

    const message = {
      type: event,
      data,
      senderId,
      timestamp: new Date().toISOString()
    }

    console.log(`Broadcasting to code session ${sessionId}:`, message)
    return message
  }

  simulateRealTimeUpdate(workspaceId, message) {
    // Simulate collaborative editing
    setTimeout(() => {
      if (message.type === 'file_update' && Math.random() > 0.7) {
        // Simulate another user making changes
        const workspace = this.workspaces.get(workspaceId)
        if (workspace && workspace.members.length > 1) {
          const otherUser = workspace.members.find(m => m.id !== message.senderId)
          if (otherUser) {
            console.log(`Simulated update from ${otherUser.name}`)
          }
        }
      }
    }, 2000 + Math.random() * 3000)
  }

  // Analytics
  getWorkspaceAnalytics(workspaceId) {
    const workspace = this.workspaces.get(workspaceId)
    if (!workspace) {
      throw new Error('Workspace not found')
    }

    const now = new Date()
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    return {
      totalMembers: workspace.members.length,
      activeMembers: workspace.members.filter(m => m.status === 'ONLINE').length,
      totalFiles: workspace.files.length,
      filesModifiedToday: workspace.files.filter(f =>
        new Date(f.lastModified) > dayAgo
      ).length,
      totalFileVersions: workspace.files.reduce((sum, file) => sum + file.version, 0),
      averageFileSize: workspace.files.length > 0 ?
        Math.round(workspace.files.reduce((sum, file) => sum + file.content.length, 0) / workspace.files.length) : 0,
      createdDate: workspace.created,
      lastActiveDate: workspace.lastActive,
      collaborationScore: this.calculateCollaborationScore(workspace)
    }
  }

  calculateCollaborationScore(workspace) {
    let score = 0

    // Points for active members
    score += workspace.members.filter(m => m.status === 'ONLINE').length * 10

    // Points for recent file modifications
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    score += workspace.files.filter(f => new Date(f.lastModified) > dayAgo).length * 5

    // Points for version history
    score += workspace.files.reduce((sum, file) => sum + file.history.length, 0) * 2

    // Points for diverse contributors
    const contributors = new Set(workspace.files.map(f => f.modifiedBy))
    score += contributors.size * 15

    return Math.min(100, score)
  }

  // Helper methods
  getUserName(userId) {
    const names = {
      '1': 'You',
      '2': 'Sarah Chen',
      '3': 'Mike Johnson',
      '4': 'Alex Kim',
      '5': 'Emma Watson',
      '6': 'Carlos Mendez'
    }
    return names[userId] || `User ${userId}`
  }

  getUserColor(userId) {
    const colors = {
      '1': '#FF6B6B',
      '2': '#4ECDC4',
      '3': '#45B7D1',
      '4': '#96CEB4',
      '5': '#FFEAA7',
      '6': '#DDA0DD'
    }
    return colors[userId] || '#999999'
  }

  // Cleanup inactive sessions
  cleanupInactiveSessions() {
    const now = new Date()
    const threshold = 60 * 60 * 1000 // 1 hour

    // Cleanup code sessions
    for (const [sessionId, session] of this.codeSessions) {
      if (now.getTime() - new Date(session.lastActive).getTime() > threshold) {
        this.codeSessions.delete(sessionId)
        console.log(`Cleaned up inactive code session: ${sessionId}`)
      }
    }

    // Update member status for workspaces
    for (const [workspaceId, workspace] of this.workspaces) {
      workspace.members.forEach(member => {
        if (now.getTime() - new Date(member.joinedAt).getTime() > threshold) {
          member.status = 'AWAY'
        }
      })
    }
  }
}

module.exports = CollaborationService