// Community and Peer Verification Service
class CommunityService {
  constructor() {
    this.posts = []
    this.members = []
    this.verificationRequests = []
    this.verificationReviews = []
    this.mentorshipOpportunities = []
    this.userReputations = new Map()
    this.initializeDefaultData()
  }

  initializeDefaultData() {
    // Initialize community posts
    this.posts = [
      {
        id: 'post_1',
        authorId: '2',
        authorName: 'Sarah Chen',
        authorAvatar: '/avatars/sarah.jpg',
        authorBadges: ['React Expert', 'Top Contributor'],
        title: 'Best practices for React state management in 2024?',
        content: 'I\'ve been working with React for a while, but I\'m still unsure about the best approaches for complex state management. Should I stick with useState and useContext, or is it time to adopt Zustand or Redux Toolkit?',
        category: 'QUESTION',
        tags: ['React', 'State Management', 'JavaScript'],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        likes: 24,
        comments: 18,
        views: 156,
        isPinned: false,
        isSolved: false
      },
      {
        id: 'post_2',
        authorId: '3',
        authorName: 'Dr. Michael Rodriguez',
        authorAvatar: '/avatars/michael.jpg',
        authorBadges: ['ML Expert', 'Verified Mentor', 'Top Researcher'],
        title: '🚀 New Machine Learning Course Series - Free for Community!',
        content: 'Excited to announce a new comprehensive ML course series! We\'ll cover everything from basics to advanced topics like transformers and reinforcement learning.',
        category: 'ANNOUNCEMENT',
        tags: ['Machine Learning', 'Course', 'Free', 'Education'],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        likes: 127,
        comments: 43,
        views: 892,
        isPinned: true
      }
    ]

    // Initialize community members
    this.members = [
      {
        id: '2',
        name: 'Sarah Chen',
        avatar: '/avatars/sarah.jpg',
        title: 'Senior React Developer',
        location: 'San Francisco, CA',
        skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
        badges: ['React Expert', 'Top Contributor', 'Mentor'],
        reputation: 2480,
        contributions: 156,
        joined: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ONLINE',
        isVerified: true,
        isMentor: true
      },
      {
        id: '3',
        name: 'Dr. Michael Rodriguez',
        avatar: '/avatars/michael.jpg',
        title: 'AI Research Scientist',
        location: 'Boston, MA',
        skills: ['Machine Learning', 'Python', 'TensorFlow', 'Research'],
        badges: ['ML Expert', 'Verified Mentor', 'Top Researcher', 'PhD'],
        reputation: 3920,
        contributions: 289,
        joined: new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ONLINE',
        isVerified: true,
        isMentor: true
      }
    ]

    // Initialize verification requests
    this.verificationRequests = [
      {
        id: 'req_1',
        userId: '2',
        userName: 'Sarah Chen',
        userAvatar: '/avatars/sarah.jpg',
        skillName: 'React Development',
        skillCategory: 'Programming',
        experienceLevel: 'ADVANCED',
        evidence: [
          {
            type: 'PROJECT',
            title: 'E-commerce Platform with React',
            description: 'Built a full-stack e-commerce platform using React, Redux, and Node.js.',
            url: 'https://github.com/sarachen/ecommerce-react'
          },
          {
            type: 'CERTIFICATE',
            title: 'React Advanced Patterns Certification',
            description: 'Completed advanced React certification covering hooks, context, and performance optimization.',
            url: 'https://certificates.dev/react-advanced-123'
          }
        ],
        submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        status: 'UNDER_REVIEW',
        reviewers: ['1', '3', '4'],
        requiredReviews: 3,
        currentReviews: 2,
        consensusScore: 85
      }
    ]

    // Initialize verification reviews
    this.verificationReviews = [
      {
        id: 'review_1',
        requestId: 'req_1',
        reviewerId: '1',
        reviewerName: 'You',
        reviewerReputation: 850,
        decision: 'APPROVE',
        confidence: 90,
        feedback: 'Excellent work! The e-commerce project demonstrates advanced React skills.',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ]

    // Initialize mentorship opportunities
    this.mentorshipOpportunities = [
      {
        id: 'mentor_1',
        mentorId: '3',
        mentorName: 'Dr. Michael Rodriguez',
        mentorAvatar: '/avatars/michael.jpg',
        mentorRating: 4.9,
        skillArea: 'Machine Learning & AI',
        description: 'Comprehensive ML mentorship covering fundamentals to advanced topics.',
        format: 'ONE_ON_ONE',
        duration: '3 months',
        price: 150,
        availability: ['Mon 6-8 PM EST', 'Wed 6-8 PM EST', 'Sat 10-12 PM EST'],
        maxMentees: 3,
        currentMentees: 1
      }
    ]

    // Initialize user reputations
    this.userReputations.set('1', 850)
    this.userReputations.set('2', 2480)
    this.userReputations.set('3', 3920)
  }

  // Community Posts Management
  getPosts(filters = {}) {
    let filteredPosts = [...this.posts]

    if (filters.category && filters.category !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === filters.category)
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }

    if (filters.authorId) {
      filteredPosts = filteredPosts.filter(post => post.authorId === filters.authorId)
    }

    // Sort by pinned first, then by creation date
    return filteredPosts.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (b.isPinned && !a.isPinned) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }

  createPost(authorId, postData) {
    const post = {
      id: `post_${Date.now()}`,
      authorId,
      authorName: this.getUserName(authorId),
      authorAvatar: this.getUserAvatar(authorId),
      authorBadges: this.getUserBadges(authorId),
      title: postData.title,
      content: postData.content,
      category: postData.category,
      tags: Array.isArray(postData.tags) ? postData.tags : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      views: 1,
      isPinned: false,
      isSolved: false
    }

    this.posts.unshift(post)
    this.updateUserReputation(authorId, 10) // Award points for posting
    return post
  }

  likePost(postId, userId) {
    const post = this.posts.find(p => p.id === postId)
    if (!post) {
      throw new Error('Post not found')
    }

    post.likes += 1
    post.updatedAt = new Date().toISOString()

    // Award reputation to post author
    this.updateUserReputation(post.authorId, 5)

    return post
  }

  commentOnPost(postId, userId, comment) {
    const post = this.posts.find(p => p.id === postId)
    if (!post) {
      throw new Error('Post not found')
    }

    post.comments += 1
    post.updatedAt = new Date().toISOString()

    // Award reputation to both commenter and post author
    this.updateUserReputation(userId, 3)
    this.updateUserReputation(post.authorId, 2)

    return post
  }

  // Member Management
  getMembers(filters = {}) {
    let filteredMembers = [...this.members]

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredMembers = filteredMembers.filter(member =>
        member.name.toLowerCase().includes(searchTerm) ||
        member.title.toLowerCase().includes(searchTerm) ||
        member.skills.some(skill => skill.toLowerCase().includes(searchTerm))
      )
    }

    if (filters.skill) {
      filteredMembers = filteredMembers.filter(member =>
        member.skills.some(skill => skill.toLowerCase().includes(filters.skill.toLowerCase()))
      )
    }

    if (filters.isMentor !== undefined) {
      filteredMembers = filteredMembers.filter(member => member.isMentor === filters.isMentor)
    }

    // Sort by reputation
    return filteredMembers.sort((a, b) => b.reputation - a.reputation)
  }

  updateMemberStatus(userId, status) {
    const member = this.members.find(m => m.id === userId)
    if (member) {
      member.status = status
    }
    return member
  }

  // Peer Verification System
  getVerificationRequests(filters = {}) {
    let filteredRequests = [...this.verificationRequests]

    if (filters.status) {
      filteredRequests = filteredRequests.filter(req => req.status === filters.status)
    }

    if (filters.skillCategory) {
      filteredRequests = filteredRequests.filter(req => req.skillCategory === filters.skillCategory)
    }

    if (filters.userId) {
      filteredRequests = filteredRequests.filter(req => req.userId === filters.userId)
    }

    return filteredRequests.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
  }

  submitVerificationRequest(userId, requestData) {
    const request = {
      id: `req_${Date.now()}`,
      userId,
      userName: this.getUserName(userId),
      userAvatar: this.getUserAvatar(userId),
      skillName: requestData.skillName,
      skillCategory: requestData.skillCategory,
      experienceLevel: requestData.experienceLevel,
      evidence: requestData.evidence,
      submittedAt: new Date().toISOString(),
      status: 'PENDING',
      reviewers: [],
      requiredReviews: this.calculateRequiredReviews(requestData.experienceLevel),
      currentReviews: 0,
      consensusScore: 0
    }

    this.verificationRequests.push(request)
    return request
  }

  calculateRequiredReviews(experienceLevel) {
    switch (experienceLevel) {
      case 'BEGINNER': return 2
      case 'INTERMEDIATE': return 3
      case 'ADVANCED': return 4
      case 'EXPERT': return 5
      default: return 3
    }
  }

  submitVerificationReview(requestId, reviewerId, reviewData) {
    const request = this.verificationRequests.find(r => r.id === requestId)
    if (!request) {
      throw new Error('Verification request not found')
    }

    if (request.reviewers.includes(reviewerId)) {
      throw new Error('User has already reviewed this request')
    }

    if (request.userId === reviewerId) {
      throw new Error('Cannot review your own request')
    }

    const review = {
      id: `review_${Date.now()}`,
      requestId,
      reviewerId,
      reviewerName: this.getUserName(reviewerId),
      reviewerReputation: this.getUserReputation(reviewerId),
      decision: reviewData.decision,
      confidence: reviewData.confidence,
      feedback: reviewData.feedback,
      createdAt: new Date().toISOString()
    }

    this.verificationReviews.push(review)

    // Update request
    request.reviewers.push(reviewerId)
    request.currentReviews += 1
    request.status = 'UNDER_REVIEW'

    // Calculate consensus score
    const requestReviews = this.verificationReviews.filter(r => r.requestId === requestId)
    const approvals = requestReviews.filter(r => r.decision === 'APPROVE').length
    const totalReviews = requestReviews.length
    request.consensusScore = Math.round((approvals / totalReviews) * 100)

    // Check if verification is complete
    if (request.currentReviews >= request.requiredReviews) {
      const approvalRate = approvals / totalReviews
      request.status = approvalRate >= 0.7 ? 'VERIFIED' : 'REJECTED'

      if (request.status === 'VERIFIED') {
        this.awardVerificationBadge(request.userId, request.skillName, request.experienceLevel)
        this.updateUserReputation(request.userId, 50) // Big reputation boost for verification
      }
    }

    // Award reputation to reviewer
    this.updateUserReputation(reviewerId, 15)

    return { request, review }
  }

  awardVerificationBadge(userId, skillName, level) {
    const member = this.members.find(m => m.id === userId)
    if (member) {
      const badgeName = `${skillName} ${level === 'EXPERT' ? 'Expert' : level === 'ADVANCED' ? 'Pro' : 'Specialist'}`
      if (!member.badges.includes(badgeName)) {
        member.badges.push(badgeName)
      }
      member.isVerified = true
    }
  }

  // Mentorship System
  getMentorshipOpportunities(filters = {}) {
    let filteredOpportunities = [...this.mentorshipOpportunities]

    if (filters.skillArea) {
      filteredOpportunities = filteredOpportunities.filter(opp =>
        opp.skillArea.toLowerCase().includes(filters.skillArea.toLowerCase())
      )
    }

    if (filters.format) {
      filteredOpportunities = filteredOpportunities.filter(opp => opp.format === filters.format)
    }

    if (filters.maxPrice) {
      filteredOpportunities = filteredOpportunities.filter(opp =>
        !opp.price || opp.price <= filters.maxPrice
      )
    }

    if (filters.availableOnly) {
      filteredOpportunities = filteredOpportunities.filter(opp =>
        opp.currentMentees < opp.maxMentees
      )
    }

    return filteredOpportunities.sort((a, b) => b.mentorRating - a.mentorRating)
  }

  createMentorshipOpportunity(mentorId, opportunityData) {
    const opportunity = {
      id: `mentor_${Date.now()}`,
      mentorId,
      mentorName: this.getUserName(mentorId),
      mentorAvatar: this.getUserAvatar(mentorId),
      mentorRating: this.calculateMentorRating(mentorId),
      ...opportunityData,
      currentMentees: 0
    }

    this.mentorshipOpportunities.push(opportunity)

    // Update member to be a mentor
    const member = this.members.find(m => m.id === mentorId)
    if (member) {
      member.isMentor = true
      if (!member.badges.includes('Mentor')) {
        member.badges.push('Mentor')
      }
    }

    return opportunity
  }

  applyForMentorship(opportunityId, menteeId) {
    const opportunity = this.mentorshipOpportunities.find(o => o.id === opportunityId)
    if (!opportunity) {
      throw new Error('Mentorship opportunity not found')
    }

    if (opportunity.currentMentees >= opportunity.maxMentees) {
      throw new Error('Mentorship opportunity is full')
    }

    opportunity.currentMentees += 1

    // Award reputation to mentor
    this.updateUserReputation(opportunity.mentorId, 20)

    return opportunity
  }

  calculateMentorRating(mentorId) {
    // Mock calculation - in real app, this would be based on feedback
    const baseRating = 4.0
    const reputation = this.getUserReputation(mentorId)
    const bonus = Math.min(1.0, reputation / 2000)
    return Math.round((baseRating + bonus) * 10) / 10
  }

  // Reputation System
  getUserReputation(userId) {
    return this.userReputations.get(userId) || 0
  }

  updateUserReputation(userId, points) {
    const currentReputation = this.getUserReputation(userId)
    const newReputation = Math.max(0, currentReputation + points)
    this.userReputations.set(userId, newReputation)

    // Update member reputation
    const member = this.members.find(m => m.id === userId)
    if (member) {
      member.reputation = newReputation
      this.updateMemberBadges(member)
    }

    return newReputation
  }

  updateMemberBadges(member) {
    const reputation = member.reputation

    // Award reputation-based badges
    if (reputation >= 1000 && !member.badges.includes('Active Member')) {
      member.badges.push('Active Member')
    }
    if (reputation >= 2000 && !member.badges.includes('Top Contributor')) {
      member.badges.push('Top Contributor')
    }
    if (reputation >= 5000 && !member.badges.includes('Community Leader')) {
      member.badges.push('Community Leader')
    }

    // Award contribution-based badges
    if (member.contributions >= 50 && !member.badges.includes('Helpful')) {
      member.badges.push('Helpful')
    }
    if (member.contributions >= 100 && !member.badges.includes('Super Helper')) {
      member.badges.push('Super Helper')
    }
  }

  // Analytics
  getCommunityStats() {
    const totalPosts = this.posts.length
    const totalMembers = this.members.length
    const totalVerifications = this.verificationRequests.length
    const verifiedSkills = this.verificationRequests.filter(r => r.status === 'VERIFIED').length
    const activeMentors = this.members.filter(m => m.isMentor).length

    const topContributors = this.members
      .sort((a, b) => b.reputation - a.reputation)
      .slice(0, 5)
      .map(member => ({
        id: member.id,
        name: member.name,
        avatar: member.avatar,
        reputation: member.reputation,
        contributions: member.contributions
      }))

    const categoryStats = this.posts.reduce((acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1
      return acc
    }, {})

    return {
      totalPosts,
      totalMembers,
      totalVerifications,
      verifiedSkills,
      activeMentors,
      verificationRate: totalVerifications > 0 ? Math.round((verifiedSkills / totalVerifications) * 100) : 0,
      topContributors,
      categoryStats,
      averageReputation: Math.round(
        this.members.reduce((sum, member) => sum + member.reputation, 0) / this.members.length
      )
    }
  }

  // Helper methods
  getUserName(userId) {
    const names = {
      '1': 'You',
      '2': 'Sarah Chen',
      '3': 'Dr. Michael Rodriguez',
      '4': 'Alex Kim',
      '5': 'Emma Watson',
      '6': 'David Wilson'
    }
    return names[userId] || `User ${userId}`
  }

  getUserAvatar(userId) {
    const avatars = {
      '1': '/avatars/you.jpg',
      '2': '/avatars/sarah.jpg',
      '3': '/avatars/michael.jpg',
      '4': '/avatars/alex.jpg',
      '5': '/avatars/emma.jpg',
      '6': '/avatars/david.jpg'
    }
    return avatars[userId] || '/avatars/default.jpg'
  }

  getUserBadges(userId) {
    const member = this.members.find(m => m.id === userId)
    return member ? member.badges : ['Member']
  }

  // Content Moderation
  reportPost(postId, reporterId, reason) {
    // In a real implementation, this would flag content for moderation
    console.log(`Post ${postId} reported by ${reporterId} for: ${reason}`)
    return { success: true, message: 'Post reported for review' }
  }

  moderatePost(postId, moderatorId, action) {
    const post = this.posts.find(p => p.id === postId)
    if (!post) {
      throw new Error('Post not found')
    }

    switch (action) {
      case 'APPROVE':
        // Post is approved, no action needed
        break
      case 'HIDE':
        post.isHidden = true
        break
      case 'DELETE':
        const postIndex = this.posts.findIndex(p => p.id === postId)
        if (postIndex > -1) {
          this.posts.splice(postIndex, 1)
        }
        break
      case 'PIN':
        post.isPinned = true
        break
      case 'UNPIN':
        post.isPinned = false
        break
    }

    return post
  }
}

module.exports = CommunityService