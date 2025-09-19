// Social Learning Service for Study Rooms and Challenges
class SocialLearningService {
  constructor() {
    this.studyRooms = []
    this.challenges = []
    this.roomParticipants = new Map()
    this.challengeParticipants = new Map()
    this.userStats = new Map()
    this.initializeDefaultData()
  }

  initializeDefaultData() {
    // Initialize study rooms
    this.studyRooms = [
      {
        id: 'room_1',
        name: 'React Fundamentals Study Group',
        description: 'Learning React hooks, components, and state management together',
        subject: 'Programming',
        hostId: '1',
        hostName: 'Sarah Chen',
        hostAvatar: '/avatars/sarah.jpg',
        participants: [
          {
            id: '1',
            name: 'Sarah Chen',
            avatar: '/avatars/sarah.jpg',
            role: 'HOST',
            status: 'ONLINE',
            joinedAt: new Date(Date.now() - 30 * 60000).toISOString(),
            isMuted: false,
            hasVideo: true,
            studyStreak: 15,
            reputation: 850
          },
          {
            id: '2',
            name: 'Mike Johnson',
            avatar: '/avatars/mike.jpg',
            role: 'PARTICIPANT',
            status: 'ONLINE',
            joinedAt: new Date(Date.now() - 20 * 60000).toISOString(),
            isMuted: false,
            hasVideo: false,
            studyStreak: 7,
            reputation: 620
          }
        ],
        maxParticipants: 8,
        isPrivate: false,
        hasPassword: false,
        status: 'ACTIVE',
        startTime: new Date(Date.now() - 45 * 60000).toISOString(),
        estimatedDuration: 120,
        studyGoals: ['Master React Hooks', 'Build a Todo App', 'Understand State Management'],
        difficulty: 'INTERMEDIATE',
        tags: ['React', 'JavaScript', 'Frontend', 'Hands-on'],
        features: {
          hasWhiteboard: true,
          hasScreenShare: true,
          hasBreakoutRooms: false,
          hasTimer: true
        }
      }
    ]

    // Initialize challenges
    this.challenges = [
      {
        id: 'challenge_1',
        title: '30-Day React Mastery Challenge',
        description: 'Build 30 React projects in 30 days. From simple components to complex applications.',
        category: 'Programming',
        difficulty: 'MEDIUM',
        type: 'INDIVIDUAL',
        status: 'ACTIVE',
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        participants: 1247,
        prize: {
          type: 'CERTIFICATE',
          value: 'React Master Certificate',
          description: 'Official certificate + 5000 skill points'
        },
        requirements: ['Basic JavaScript knowledge', 'Git fundamentals', 'HTML/CSS basics'],
        skills: ['React', 'JavaScript', 'Frontend Development', 'Component Design'],
        leaderboard: [
          {
            rank: 1,
            userId: '1',
            username: 'CodeNinja',
            avatar: '/avatars/user1.jpg',
            score: 2850,
            progress: 28,
            streak: 28,
            completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          }
        ],
        featured: true
      }
    ]

    // Initialize user stats
    this.userStats.set('1', {
      studySessionsCompleted: 45,
      challengesCompleted: 12,
      totalStudyHours: 180,
      averageSessionDuration: 75,
      streakDays: 15,
      reputation: 850,
      achievements: ['Early Bird', 'Consistency Master', 'Team Player'],
      preferredSubjects: ['Programming', 'Mathematics'],
      studyGoals: ['Master React', 'Learn ML', 'Improve Communication']
    })
  }

  // Study Rooms Management
  getStudyRooms(filters = {}) {
    let filteredRooms = [...this.studyRooms]

    if (filters.subject) {
      filteredRooms = filteredRooms.filter(room =>
        room.subject.toLowerCase().includes(filters.subject.toLowerCase())
      )
    }

    if (filters.difficulty) {
      filteredRooms = filteredRooms.filter(room =>
        room.difficulty === filters.difficulty
      )
    }

    if (filters.status) {
      filteredRooms = filteredRooms.filter(room =>
        room.status === filters.status
      )
    }

    if (filters.hasSpace) {
      filteredRooms = filteredRooms.filter(room =>
        room.participants.length < room.maxParticipants
      )
    }

    // Sort by relevance (active first, then by participants)
    return filteredRooms.sort((a, b) => {
      if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') return -1
      if (b.status === 'ACTIVE' && a.status !== 'ACTIVE') return 1
      return b.participants.length - a.participants.length
    })
  }

  createStudyRoom(hostId, roomData) {
    const newRoom = {
      id: `room_${Date.now()}`,
      ...roomData,
      hostId,
      hostName: this.getUserName(hostId),
      hostAvatar: this.getUserAvatar(hostId),
      participants: [{
        id: hostId,
        name: this.getUserName(hostId),
        avatar: this.getUserAvatar(hostId),
        role: 'HOST',
        status: 'ONLINE',
        joinedAt: new Date().toISOString(),
        isMuted: false,
        hasVideo: true,
        studyStreak: this.getUserStreak(hostId),
        reputation: this.getUserReputation(hostId)
      }],
      hasPassword: roomData.password && roomData.password.length > 0,
      status: 'WAITING',
      startTime: new Date(Date.now() + 5 * 60000).toISOString(), // Start in 5 minutes
      tags: roomData.subject ? [roomData.subject] : []
    }

    this.studyRooms.unshift(newRoom)
    return newRoom
  }

  joinStudyRoom(roomId, userId, password = null) {
    const room = this.studyRooms.find(r => r.id === roomId)
    if (!room) {
      throw new Error('Study room not found')
    }

    if (room.participants.length >= room.maxParticipants) {
      throw new Error('Study room is full')
    }

    if (room.hasPassword && room.password !== password) {
      throw new Error('Invalid password')
    }

    if (room.participants.find(p => p.id === userId)) {
      throw new Error('User already in room')
    }

    const participant = {
      id: userId,
      name: this.getUserName(userId),
      avatar: this.getUserAvatar(userId),
      role: 'PARTICIPANT',
      status: 'ONLINE',
      joinedAt: new Date().toISOString(),
      isMuted: false,
      hasVideo: false,
      studyStreak: this.getUserStreak(userId),
      reputation: this.getUserReputation(userId)
    }

    room.participants.push(participant)

    // Update room status if needed
    if (room.status === 'WAITING' && room.participants.length >= 2) {
      room.status = 'ACTIVE'
      room.startTime = new Date().toISOString()
    }

    return room
  }

  leaveStudyRoom(roomId, userId) {
    const room = this.studyRooms.find(r => r.id === roomId)
    if (!room) {
      throw new Error('Study room not found')
    }

    const participantIndex = room.participants.findIndex(p => p.id === userId)
    if (participantIndex === -1) {
      throw new Error('User not in room')
    }

    const participant = room.participants[participantIndex]
    room.participants.splice(participantIndex, 1)

    // Handle host leaving
    if (participant.role === 'HOST' && room.participants.length > 0) {
      // Transfer host to next participant
      room.participants[0].role = 'HOST'
      room.hostId = room.participants[0].id
      room.hostName = room.participants[0].name
    }

    // End room if empty
    if (room.participants.length === 0) {
      room.status = 'ENDED'
    }

    return room
  }

  // Challenges Management
  getChallenges(filters = {}) {
    let filteredChallenges = [...this.challenges]

    if (filters.category) {
      filteredChallenges = filteredChallenges.filter(challenge =>
        challenge.category.toLowerCase().includes(filters.category.toLowerCase())
      )
    }

    if (filters.difficulty) {
      filteredChallenges = filteredChallenges.filter(challenge =>
        challenge.difficulty === filters.difficulty
      )
    }

    if (filters.type) {
      filteredChallenges = filteredChallenges.filter(challenge =>
        challenge.type === filters.type
      )
    }

    if (filters.status) {
      filteredChallenges = filteredChallenges.filter(challenge =>
        challenge.status === filters.status
      )
    }

    // Sort by featured first, then by participants
    return filteredChallenges.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (b.featured && !a.featured) return 1
      return b.participants - a.participants
    })
  }

  createChallenge(creatorId, challengeData) {
    const newChallenge = {
      id: `challenge_${Date.now()}`,
      ...challengeData,
      creatorId,
      participants: 0,
      leaderboard: [],
      status: 'UPCOMING',
      featured: false
    }

    this.challenges.unshift(newChallenge)
    return newChallenge
  }

  joinChallenge(challengeId, userId) {
    const challenge = this.challenges.find(c => c.id === challengeId)
    if (!challenge) {
      throw new Error('Challenge not found')
    }

    if (challenge.maxParticipants && challenge.participants >= challenge.maxParticipants) {
      throw new Error('Challenge is full')
    }

    if (this.challengeParticipants.has(challengeId)) {
      const participants = this.challengeParticipants.get(challengeId)
      if (participants.includes(userId)) {
        throw new Error('User already joined challenge')
      }
      participants.push(userId)
    } else {
      this.challengeParticipants.set(challengeId, [userId])
    }

    challenge.participants += 1

    // Add to leaderboard with initial score
    const leaderboardEntry = {
      rank: challenge.leaderboard.length + 1,
      userId,
      username: this.getUserName(userId),
      avatar: this.getUserAvatar(userId),
      score: 0,
      progress: 0,
      streak: 0
    }

    challenge.leaderboard.push(leaderboardEntry)
    return challenge
  }

  updateChallengeProgress(challengeId, userId, progressData) {
    const challenge = this.challenges.find(c => c.id === challengeId)
    if (!challenge) {
      throw new Error('Challenge not found')
    }

    const leaderboardEntry = challenge.leaderboard.find(entry => entry.userId === userId)
    if (!leaderboardEntry) {
      throw new Error('User not participating in challenge')
    }

    // Update progress
    leaderboardEntry.score = progressData.score || leaderboardEntry.score
    leaderboardEntry.progress = progressData.progress || leaderboardEntry.progress
    leaderboardEntry.streak = progressData.streak || leaderboardEntry.streak

    if (progressData.completed) {
      leaderboardEntry.completedAt = new Date().toISOString()
    }

    // Re-rank leaderboard
    challenge.leaderboard.sort((a, b) => {
      if (a.completedAt && !b.completedAt) return -1
      if (b.completedAt && !a.completedAt) return 1
      return b.score - a.score
    })

    // Update ranks
    challenge.leaderboard.forEach((entry, index) => {
      entry.rank = index + 1
    })

    return challenge
  }

  // Analytics and Insights
  getUserLearningAnalytics(userId) {
    const userStats = this.userStats.get(userId) || {}
    const userRooms = this.studyRooms.filter(room =>
      room.participants.some(p => p.id === userId)
    )
    const userChallenges = this.challenges.filter(challenge =>
      this.challengeParticipants.get(challenge.id)?.includes(userId)
    )

    return {
      stats: userStats,
      activeRooms: userRooms.filter(room => room.status === 'ACTIVE').length,
      activeChallenges: userChallenges.filter(challenge => challenge.status === 'ACTIVE').length,
      weeklyActivity: this.generateWeeklyActivity(userId),
      achievements: userStats.achievements || [],
      socialRank: this.calculateSocialRank(userId),
      studyPartners: this.getFrequentStudyPartners(userId),
      recommendedRooms: this.getRecommendedRooms(userId),
      recommendedChallenges: this.getRecommendedChallenges(userId)
    }
  }

  generateWeeklyActivity(userId) {
    // Mock weekly activity data
    return [
      { day: 'Mon', studyHours: 2.5, roomsJoined: 1, challengesProgress: 15 },
      { day: 'Tue', studyHours: 3.0, roomsJoined: 2, challengesProgress: 20 },
      { day: 'Wed', studyHours: 1.5, roomsJoined: 1, challengesProgress: 10 },
      { day: 'Thu', studyHours: 4.0, roomsJoined: 2, challengesProgress: 25 },
      { day: 'Fri', studyHours: 2.0, roomsJoined: 1, challengesProgress: 18 },
      { day: 'Sat', studyHours: 3.5, roomsJoined: 3, challengesProgress: 30 },
      { day: 'Sun', studyHours: 2.5, roomsJoined: 2, challengesProgress: 22 }
    ]
  }

  calculateSocialRank(userId) {
    const userStats = this.userStats.get(userId) || {}
    const reputation = userStats.reputation || 0

    if (reputation >= 2000) return { level: 'Expert', icon: '🏆' }
    if (reputation >= 1500) return { level: 'Advanced', icon: '🥇' }
    if (reputation >= 1000) return { level: 'Intermediate', icon: '🥈' }
    if (reputation >= 500) return { level: 'Novice', icon: '🥉' }
    return { level: 'Beginner', icon: '📚' }
  }

  getFrequentStudyPartners(userId) {
    // Analyze study room participation history
    const partners = new Map()

    this.studyRooms.forEach(room => {
      const userInRoom = room.participants.find(p => p.id === userId)
      if (userInRoom) {
        room.participants.forEach(participant => {
          if (participant.id !== userId) {
            const count = partners.get(participant.id) || 0
            partners.set(participant.id, count + 1)
          }
        })
      }
    })

    return Array.from(partners.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([partnerId, sessionCount]) => ({
        id: partnerId,
        name: this.getUserName(partnerId),
        avatar: this.getUserAvatar(partnerId),
        sessionCount,
        reputation: this.getUserReputation(partnerId)
      }))
  }

  getRecommendedRooms(userId) {
    const userStats = this.userStats.get(userId) || {}
    const preferredSubjects = userStats.preferredSubjects || []

    return this.studyRooms
      .filter(room =>
        room.status === 'WAITING' || room.status === 'ACTIVE' &&
        room.participants.length < room.maxParticipants &&
        !room.participants.find(p => p.id === userId)
      )
      .filter(room =>
        preferredSubjects.length === 0 ||
        preferredSubjects.includes(room.subject)
      )
      .sort((a, b) => b.participants.length - a.participants.length)
      .slice(0, 3)
  }

  getRecommendedChallenges(userId) {
    const userStats = this.userStats.get(userId) || {}
    const preferredSubjects = userStats.preferredSubjects || []

    return this.challenges
      .filter(challenge =>
        challenge.status === 'ACTIVE' || challenge.status === 'UPCOMING' &&
        (!this.challengeParticipants.get(challenge.id)?.includes(userId))
      )
      .filter(challenge =>
        preferredSubjects.length === 0 ||
        preferredSubjects.some(subject =>
          challenge.category.includes(subject) ||
          challenge.skills.includes(subject)
        )
      )
      .slice(0, 3)
  }

  // Helper methods
  getUserName(userId) {
    const names = {
      '1': 'You',
      '2': 'Mike Johnson',
      '3': 'Alex Kim',
      '4': 'Dr. Maria Rodriguez',
      '5': 'Emma Watson',
      '6': 'Carlos Mendez'
    }
    return names[userId] || `User ${userId}`
  }

  getUserAvatar(userId) {
    const avatars = {
      '1': '/avatars/you.jpg',
      '2': '/avatars/mike.jpg',
      '3': '/avatars/alex.jpg',
      '4': '/avatars/maria.jpg',
      '5': '/avatars/emma.jpg',
      '6': '/avatars/carlos.jpg'
    }
    return avatars[userId] || '/avatars/default.jpg'
  }

  getUserStreak(userId) {
    const streaks = { '1': 15, '2': 7, '3': 23, '4': 45, '5': 12, '6': 38 }
    return streaks[userId] || 0
  }

  getUserReputation(userId) {
    const reputations = { '1': 850, '2': 620, '3': 1200, '4': 2100, '5': 780, '6': 1650 }
    return reputations[userId] || 100
  }
}

module.exports = SocialLearningService