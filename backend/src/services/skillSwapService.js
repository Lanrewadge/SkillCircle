// Skill Swap Marketplace Service
class SkillSwapService {
  constructor() {
    this.swapOffers = []
    this.userCredits = new Map()
    this.transactions = []
    this.skillPrices = new Map() // Skill to credit value mapping
    this.initializeDefaultData()
  }

  initializeDefaultData() {
    // Initialize some default skill credit values
    this.skillPrices.set('React Development', 120)
    this.skillPrices.set('Python Programming', 100)
    this.skillPrices.set('UI/UX Design', 110)
    this.skillPrices.set('Spanish Conversation', 80)
    this.skillPrices.set('Machine Learning', 150)
    this.skillPrices.set('Guitar Playing', 70)
    this.skillPrices.set('Italian Cooking', 90)
    this.skillPrices.set('Digital Marketing', 95)

    // Initialize user credits
    this.userCredits.set('1', 200) // Starting credits for user 1
    this.userCredits.set('2', 150)
    this.userCredits.set('3', 300)

    // Mock some swap offers
    this.swapOffers = [
      {
        id: 'swap_1',
        offererId: '2',
        offererName: 'Sarah Johnson',
        offererAvatar: '/avatars/sarah.jpg',
        offeredSkill: 'React Development',
        offeredHours: 2,
        offeredDescription: 'Advanced React patterns, hooks, and state management',
        requestedSkill: 'UI/UX Design',
        requestedHours: 2,
        requestedDescription: 'Looking to learn Figma and design principles',
        status: 'ACTIVE',
        location: 'San Francisco, CA',
        preferredFormat: 'ONLINE',
        difficulty: 'INTERMEDIATE',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['React', 'JavaScript', 'Frontend'],
        rating: 4.9,
        completedSwaps: 12
      },
      {
        id: 'swap_2',
        offererId: '3',
        offererName: 'Michael Chen',
        offererAvatar: '/avatars/michael.jpg',
        offeredSkill: 'Python Programming',
        offeredHours: 3,
        offeredDescription: 'Python basics to advanced, including data science libraries',
        requestedSkill: 'Spanish Conversation',
        requestedHours: 4,
        requestedDescription: 'Want to practice conversational Spanish',
        status: 'ACTIVE',
        location: 'New York, NY',
        preferredFormat: 'HYBRID',
        difficulty: 'BEGINNER',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['Python', 'Data Science', 'Programming'],
        rating: 4.7,
        completedSwaps: 8
      },
      {
        id: 'swap_3',
        offererId: '4',
        offererName: 'Maria Rodriguez',
        offererAvatar: '/avatars/maria.jpg',
        offeredSkill: 'Spanish Conversation',
        offeredHours: 2,
        offeredDescription: 'Native Spanish speaker, focus on pronunciation and culture',
        requestedSkill: 'Digital Marketing',
        requestedHours: 2,
        requestedDescription: 'SEO, social media marketing, and content strategy',
        status: 'ACTIVE',
        location: 'Miami, FL',
        preferredFormat: 'ONLINE',
        difficulty: 'BEGINNER',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['Spanish', 'Language', 'Culture'],
        rating: 4.8,
        completedSwaps: 15
      },
      {
        id: 'swap_4',
        offererId: '5',
        offererName: 'Alex Thompson',
        offererAvatar: '/avatars/alex.jpg',
        offeredSkill: 'Guitar Playing',
        offeredHours: 1.5,
        offeredDescription: 'Acoustic guitar, chords, strumming patterns, beginner songs',
        requestedSkill: 'Machine Learning',
        requestedHours: 2,
        requestedDescription: 'Introduction to ML algorithms and practical applications',
        status: 'PENDING',
        location: 'Seattle, WA',
        preferredFormat: 'IN_PERSON',
        difficulty: 'BEGINNER',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        tags: ['Guitar', 'Music', 'Acoustic'],
        rating: 4.6,
        completedSwaps: 6
      }
    ]
  }

  // Get all active swap offers with filtering
  getSwapOffers(filters = {}) {
    let filteredOffers = this.swapOffers.filter(offer => offer.status === 'ACTIVE')

    if (filters.skill) {
      filteredOffers = filteredOffers.filter(offer =>
        offer.offeredSkill.toLowerCase().includes(filters.skill.toLowerCase()) ||
        offer.requestedSkill.toLowerCase().includes(filters.skill.toLowerCase())
      )
    }

    if (filters.location) {
      filteredOffers = filteredOffers.filter(offer =>
        offer.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    if (filters.format) {
      filteredOffers = filteredOffers.filter(offer =>
        offer.preferredFormat === filters.format
      )
    }

    if (filters.difficulty) {
      filteredOffers = filteredOffers.filter(offer =>
        offer.difficulty === filters.difficulty
      )
    }

    // Sort by relevance (newest first, then by rating)
    filteredOffers.sort((a, b) => {
      const scoreA = a.rating * 0.7 + (new Date(a.createdAt).getTime() / 1000000) * 0.3
      const scoreB = b.rating * 0.7 + (new Date(b.createdAt).getTime() / 1000000) * 0.3
      return scoreB - scoreA
    })

    return filteredOffers
  }

  // Create a new swap offer
  createSwapOffer(userId, offerData) {
    const newOffer = {
      id: `swap_${Date.now()}`,
      offererId: userId,
      offererName: this.getUserName(userId),
      offererAvatar: this.getUserAvatar(userId),
      ...offerData,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      completedSwaps: this.getUserCompletedSwaps(userId),
      rating: this.getUserRating(userId)
    }

    this.swapOffers.push(newOffer)
    return newOffer
  }

  // Accept a swap offer
  acceptSwapOffer(offerId, accepterId) {
    const offer = this.swapOffers.find(o => o.id === offerId)
    if (!offer || offer.status !== 'ACTIVE') {
      throw new Error('Offer not available')
    }

    // Create swap match
    const swapMatch = {
      id: `match_${Date.now()}`,
      offerId: offerId,
      offererId: offer.offererId,
      accepterId: accepterId,
      offeredSkill: offer.offeredSkill,
      requestedSkill: offer.requestedSkill,
      offeredHours: offer.offeredHours,
      requestedHours: offer.requestedHours,
      status: 'MATCHED',
      matchedAt: new Date().toISOString(),
      sessionDate: null,
      completedAt: null
    }

    // Update offer status
    offer.status = 'MATCHED'

    return swapMatch
  }

  // Get user's credit balance
  getUserCredits(userId) {
    return this.userCredits.get(userId) || 0
  }

  // Award credits to user (for teaching)
  awardCredits(userId, amount, reason) {
    const currentCredits = this.getUserCredits(userId)
    const newBalance = currentCredits + amount

    this.userCredits.set(userId, newBalance)

    // Record transaction
    const transaction = {
      id: `txn_${Date.now()}`,
      userId,
      type: 'CREDIT',
      amount,
      reason,
      balance: newBalance,
      timestamp: new Date().toISOString()
    }

    this.transactions.push(transaction)
    return transaction
  }

  // Deduct credits from user (for learning)
  deductCredits(userId, amount, reason) {
    const currentCredits = this.getUserCredits(userId)

    if (currentCredits < amount) {
      throw new Error('Insufficient credits')
    }

    const newBalance = currentCredits - amount
    this.userCredits.set(userId, newBalance)

    // Record transaction
    const transaction = {
      id: `txn_${Date.now()}`,
      userId,
      type: 'DEBIT',
      amount: -amount,
      reason,
      balance: newBalance,
      timestamp: new Date().toISOString()
    }

    this.transactions.push(transaction)
    return transaction
  }

  // Get skill credit value
  getSkillCreditValue(skillName, hours = 1) {
    const baseValue = this.skillPrices.get(skillName) || 100
    return Math.round(baseValue * hours)
  }

  // Calculate swap fairness score
  calculateSwapFairness(offeredSkill, offeredHours, requestedSkill, requestedHours) {
    const offeredValue = this.getSkillCreditValue(offeredSkill, offeredHours)
    const requestedValue = this.getSkillCreditValue(requestedSkill, requestedHours)

    const ratio = Math.min(offeredValue, requestedValue) / Math.max(offeredValue, requestedValue)

    return {
      fairnessScore: ratio,
      offeredValue,
      requestedValue,
      isFair: ratio >= 0.8, // 80% or higher is considered fair
      suggestion: ratio < 0.8 ? this.generateFairnessAdjustment(offeredValue, requestedValue) : null
    }
  }

  generateFairnessAdjustment(offeredValue, requestedValue) {
    const difference = Math.abs(offeredValue - requestedValue)
    const higherValue = Math.max(offeredValue, requestedValue)
    const lowerValue = Math.min(offeredValue, requestedValue)

    if (difference > lowerValue * 0.5) {
      return {
        type: 'HOURS_ADJUSTMENT',
        message: 'Consider adjusting the hours to make this swap more balanced',
        suggestedHours: Math.round((higherValue / lowerValue) * 100) / 100
      }
    } else {
      return {
        type: 'CREDIT_SUPPLEMENT',
        message: 'Consider adding credit supplement to balance the exchange',
        suggestedCredits: Math.round(difference * 0.2)
      }
    }
  }

  // Get user transaction history
  getUserTransactions(userId, limit = 20) {
    return this.transactions
      .filter(txn => txn.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  }

  // Get skill marketplace stats
  getMarketplaceStats() {
    const activeOffers = this.swapOffers.filter(o => o.status === 'ACTIVE').length
    const completedSwaps = this.swapOffers.filter(o => o.status === 'COMPLETED').length
    const totalUsers = this.userCredits.size

    // Calculate most popular skills
    const skillCounts = new Map()
    this.swapOffers.forEach(offer => {
      skillCounts.set(offer.offeredSkill, (skillCounts.get(offer.offeredSkill) || 0) + 1)
      skillCounts.set(offer.requestedSkill, (skillCounts.get(offer.requestedSkill) || 0) + 1)
    })

    const popularSkills = Array.from(skillCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([skill, count]) => ({ skill, count }))

    return {
      activeOffers,
      completedSwaps,
      totalUsers,
      popularSkills,
      totalCreditsInCirculation: Array.from(this.userCredits.values()).reduce((sum, credits) => sum + credits, 0)
    }
  }

  // Recommend swap matches for a user
  recommendSwapMatches(userId, userSkills = [], interestedSkills = []) {
    const recommendations = []

    this.swapOffers
      .filter(offer => offer.offererId !== userId && offer.status === 'ACTIVE')
      .forEach(offer => {
        let score = 0

        // Check if user can teach what's requested
        if (userSkills.includes(offer.requestedSkill)) {
          score += 0.6
        }

        // Check if user wants to learn what's offered
        if (interestedSkills.includes(offer.offeredSkill)) {
          score += 0.4
        }

        // Consider location proximity (simplified)
        // In real app, this would use geolocation
        score += 0.1 // Base location score

        // Consider rating
        score += (offer.rating - 4.0) * 0.1

        // Consider fairness
        const fairness = this.calculateSwapFairness(
          offer.requestedSkill, offer.requestedHours,
          offer.offeredSkill, offer.offeredHours
        )
        score += fairness.fairnessScore * 0.2

        if (score > 0.3) { // Minimum threshold
          recommendations.push({
            ...offer,
            matchScore: Math.round(score * 100),
            reasons: this.generateMatchReasons(userSkills, interestedSkills, offer)
          })
        }
      })

    return recommendations
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10)
  }

  generateMatchReasons(userSkills, interestedSkills, offer) {
    const reasons = []

    if (userSkills.includes(offer.requestedSkill)) {
      reasons.push(`You can teach ${offer.requestedSkill}`)
    }

    if (interestedSkills.includes(offer.offeredSkill)) {
      reasons.push(`You want to learn ${offer.offeredSkill}`)
    }

    if (offer.rating >= 4.7) {
      reasons.push('Highly rated teacher')
    }

    const fairness = this.calculateSwapFairness(
      offer.requestedSkill, offer.requestedHours,
      offer.offeredSkill, offer.offeredHours
    )

    if (fairness.isFair) {
      reasons.push('Fair time exchange')
    }

    return reasons
  }

  // Helper methods
  getUserName(userId) {
    const names = {
      '1': 'You',
      '2': 'Sarah Johnson',
      '3': 'Michael Chen',
      '4': 'Maria Rodriguez',
      '5': 'Alex Thompson'
    }
    return names[userId] || 'Unknown User'
  }

  getUserAvatar(userId) {
    const avatars = {
      '1': '/avatars/you.jpg',
      '2': '/avatars/sarah.jpg',
      '3': '/avatars/michael.jpg',
      '4': '/avatars/maria.jpg',
      '5': '/avatars/alex.jpg'
    }
    return avatars[userId] || '/avatars/default.jpg'
  }

  getUserRating(userId) {
    const ratings = {
      '1': 4.5,
      '2': 4.9,
      '3': 4.7,
      '4': 4.8,
      '5': 4.6
    }
    return ratings[userId] || 4.0
  }

  getUserCompletedSwaps(userId) {
    const swaps = {
      '1': 3,
      '2': 12,
      '3': 8,
      '4': 15,
      '5': 6
    }
    return swaps[userId] || 0
  }
}

module.exports = SkillSwapService