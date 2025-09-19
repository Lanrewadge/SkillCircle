// AI-Powered Skill Assessment Service
class AIAssessmentService {
  constructor() {
    this.difficultyLevels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']
    this.learningStyles = ['VISUAL', 'AUDITORY', 'KINESTHETIC', 'READING_WRITING']
    this.personalityTypes = ['ANALYTICAL', 'CREATIVE', 'SOCIAL', 'PRACTICAL']
  }

  // Generate adaptive assessment questions based on skill and current level
  generateAssessmentQuestions(skillId, currentLevel = 'BEGINNER', answeredQuestions = []) {
    const questionBank = this.getQuestionBank(skillId)
    const filteredQuestions = questionBank.filter(q =>
      q.difficulty === currentLevel &&
      !answeredQuestions.includes(q.id)
    )

    // Adaptive algorithm: select questions based on performance
    return filteredQuestions.slice(0, 5).map(q => ({
      ...q,
      options: this.shuffleArray(q.options)
    }))
  }

  // Analyze user's learning patterns and preferences
  analyzeUserProfile(userResponses, learningHistory) {
    const profile = {
      learningStyle: this.determineLearningStyle(userResponses),
      personalityType: this.determinePersonalityType(userResponses),
      skillAptitudes: this.calculateSkillAptitudes(learningHistory),
      optimalLearningTime: this.predictOptimalLearningTime(learningHistory),
      estimatedProficiencyTime: this.estimateProficiencyTime(userResponses, learningHistory)
    }

    return profile
  }

  // Smart teacher-student matching based on compatibility
  findCompatibleMatches(learnerId, teacherIds, skillId) {
    const learnerProfile = this.getUserProfile(learnerId)
    const matches = teacherIds.map(teacherId => {
      const teacherProfile = this.getTeacherProfile(teacherId)
      const compatibility = this.calculateCompatibility(learnerProfile, teacherProfile, skillId)

      return {
        teacherId,
        compatibilityScore: compatibility.score,
        reasons: compatibility.reasons,
        recommendedSessionType: compatibility.sessionType
      }
    })

    return matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore)
  }

  // Generate personalized learning path
  generateLearningPath(skillId, userProfile, targetLevel = 'INTERMEDIATE') {
    const skillData = this.getSkillData(skillId)
    const modules = skillData.modules || []

    const personalizedPath = {
      estimatedDuration: this.calculateEstimatedDuration(modules, userProfile),
      phases: this.optimizePhaseOrder(modules, userProfile),
      dailySchedule: this.createDailySchedule(userProfile),
      milestones: this.generateMilestones(modules, targetLevel),
      adaptiveContent: this.selectAdaptiveContent(userProfile, skillId)
    }

    return personalizedPath
  }

  // Predict learning success rate
  predictSuccessRate(userId, skillId, sessionType = 'ONE_ON_ONE') {
    const userProfile = this.getUserProfile(userId)
    const skillComplexity = this.getSkillComplexity(skillId)

    // ML-like algorithm simulation
    let baseRate = 0.7 // 70% base success rate

    // Adjust based on user's learning style compatibility
    const styleBonus = this.getStyleCompatibilityBonus(userProfile.learningStyle, skillId)
    baseRate += styleBonus

    // Adjust based on skill complexity vs user experience
    const complexityPenalty = this.getComplexityPenalty(skillComplexity, userProfile.experience)
    baseRate -= complexityPenalty

    // Session type adjustments
    const sessionBonus = sessionType === 'ONE_ON_ONE' ? 0.15 :
                        sessionType === 'GROUP' ? 0.05 : 0
    baseRate += sessionBonus

    return Math.min(0.95, Math.max(0.15, baseRate))
  }

  // Helper methods
  getQuestionBank(skillId) {
    const questionBanks = {
      '1': [ // React Development
        {
          id: 'react_1',
          question: 'What is the primary purpose of React hooks?',
          options: [
            'To manage state in functional components',
            'To create class components',
            'To handle CSS styling',
            'To make API calls'
          ],
          correctAnswer: 0,
          difficulty: 'BEGINNER',
          explanation: 'React hooks allow you to use state and other React features in functional components.'
        },
        {
          id: 'react_2',
          question: 'How do you optimize React component re-renders?',
          options: [
            'Use React.memo and useMemo',
            'Add more state variables',
            'Use class components only',
            'Avoid using props'
          ],
          correctAnswer: 0,
          difficulty: 'INTERMEDIATE',
          explanation: 'React.memo prevents unnecessary re-renders by memoizing component output.'
        }
      ],
      '2': [ // Python Programming
        {
          id: 'python_1',
          question: 'What is a list comprehension in Python?',
          options: [
            'A way to create lists using a concise syntax',
            'A method to compress files',
            'A debugging technique',
            'A way to import modules'
          ],
          correctAnswer: 0,
          difficulty: 'BEGINNER',
          explanation: 'List comprehensions provide a concise way to create lists based on existing lists.'
        }
      ]
    }

    return questionBanks[skillId] || []
  }

  determineLearningStyle(responses) {
    // Analyze response patterns to determine learning style
    const visualScore = responses.filter(r => r.preferredFormat === 'visual').length
    const auditoryScore = responses.filter(r => r.preferredFormat === 'audio').length
    const kinestheticScore = responses.filter(r => r.preferredFormat === 'hands-on').length

    const scores = {
      VISUAL: visualScore,
      AUDITORY: auditoryScore,
      KINESTHETIC: kinestheticScore,
      READING_WRITING: responses.length - visualScore - auditoryScore - kinestheticScore
    }

    return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b)
  }

  determinePersonalityType(responses) {
    // Simple personality assessment based on learning preferences
    const analyticalScore = responses.filter(r => r.approach === 'systematic').length
    const creativeScore = responses.filter(r => r.approach === 'experimental').length
    const socialScore = responses.filter(r => r.preferredMode === 'group').length

    if (analyticalScore >= creativeScore && analyticalScore >= socialScore) return 'ANALYTICAL'
    if (creativeScore >= socialScore) return 'CREATIVE'
    if (socialScore > 0) return 'SOCIAL'
    return 'PRACTICAL'
  }

  calculateCompatibility(learnerProfile, teacherProfile, skillId) {
    let score = 0.5 // Base compatibility
    const reasons = []

    // Learning style compatibility
    if (learnerProfile.learningStyle === teacherProfile.teachingStyle) {
      score += 0.3
      reasons.push('Matching learning and teaching styles')
    }

    // Personality compatibility
    const personalityMatch = this.checkPersonalityCompatibility(
      learnerProfile.personalityType,
      teacherProfile.personalityType
    )
    score += personalityMatch.score
    if (personalityMatch.compatible) {
      reasons.push(personalityMatch.reason)
    }

    // Experience level appropriateness
    const skillLevel = learnerProfile.skillLevels[skillId] || 'BEGINNER'
    if (teacherProfile.specializations.includes(skillLevel)) {
      score += 0.2
      reasons.push('Teacher specializes in your skill level')
    }

    return {
      score: Math.min(1.0, score),
      reasons,
      sessionType: score > 0.8 ? 'INTENSIVE' : score > 0.6 ? 'STANDARD' : 'GUIDED'
    }
  }

  checkPersonalityCompatibility(learnerType, teacherType) {
    const compatibilityMatrix = {
      'ANALYTICAL': { 'ANALYTICAL': 0.3, 'PRACTICAL': 0.2, 'CREATIVE': 0.1, 'SOCIAL': 0.15 },
      'CREATIVE': { 'CREATIVE': 0.3, 'SOCIAL': 0.2, 'ANALYTICAL': 0.1, 'PRACTICAL': 0.15 },
      'SOCIAL': { 'SOCIAL': 0.3, 'CREATIVE': 0.2, 'PRACTICAL': 0.15, 'ANALYTICAL': 0.1 },
      'PRACTICAL': { 'PRACTICAL': 0.3, 'ANALYTICAL': 0.2, 'SOCIAL': 0.15, 'CREATIVE': 0.1 }
    }

    const score = compatibilityMatrix[learnerType][teacherType]
    return {
      score,
      compatible: score >= 0.2,
      reason: score >= 0.3 ? 'Perfect personality match' : score >= 0.2 ? 'Good personality compatibility' : 'Different but complementary styles'
    }
  }

  shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  getUserProfile(userId) {
    // Mock user profile - in real app, this would come from database
    return {
      learningStyle: 'VISUAL',
      personalityType: 'ANALYTICAL',
      skillLevels: { '1': 'BEGINNER', '2': 'INTERMEDIATE' },
      experience: 'BEGINNER',
      optimalLearningTime: ['09:00', '14:00', '19:00'],
      averageSessionDuration: 60
    }
  }

  getTeacherProfile(teacherId) {
    // Mock teacher profile
    return {
      teachingStyle: 'VISUAL',
      personalityType: 'SOCIAL',
      specializations: ['BEGINNER', 'INTERMEDIATE'],
      rating: 4.8,
      experience: 'EXPERT'
    }
  }

  getSkillData(skillId) {
    const skillsData = {
      '1': {
        modules: [
          { id: 1, name: 'React Basics', difficulty: 'BEGINNER', duration: 480 },
          { id: 2, name: 'React Hooks', difficulty: 'INTERMEDIATE', duration: 600 },
          { id: 3, name: 'State Management', difficulty: 'ADVANCED', duration: 720 }
        ]
      }
    }
    return skillsData[skillId] || { modules: [] }
  }

  getSkillComplexity(skillId) {
    const complexityMap = {
      '1': 0.7, // React - Medium-High complexity
      '2': 0.5, // Python - Medium complexity
      '3': 0.8, // Machine Learning - High complexity
      '4': 0.3, // Spanish - Low-Medium complexity
      '5': 0.6  // UI/UX - Medium complexity
    }
    return complexityMap[skillId] || 0.5
  }

  getStyleCompatibilityBonus(learningStyle, skillId) {
    // Some skills work better with certain learning styles
    const styleSkillMatrix = {
      'VISUAL': { '1': 0.15, '5': 0.2 }, // React and UI/UX are very visual
      'AUDITORY': { '4': 0.2 }, // Spanish benefits from auditory learning
      'KINESTHETIC': { '2': 0.15 }, // Python benefits from hands-on coding
      'READING_WRITING': { '3': 0.1 } // ML has lots of theory
    }
    return styleSkillMatrix[learningStyle]?.[skillId] || 0
  }

  getComplexityPenalty(complexity, userExperience) {
    const experienceMap = { 'BEGINNER': 0, 'INTERMEDIATE': 0.3, 'ADVANCED': 0.6, 'EXPERT': 0.9 }
    const userLevel = experienceMap[userExperience] || 0
    return Math.max(0, (complexity - userLevel) * 0.2)
  }

  calculateEstimatedDuration(modules, userProfile) {
    const baseDuration = modules.reduce((total, module) => total + module.duration, 0)
    const styleMultiplier = userProfile.learningStyle === 'KINESTHETIC' ? 1.2 : 1.0
    const experienceMultiplier = userProfile.experience === 'BEGINNER' ? 1.5 : 1.0

    return Math.round(baseDuration * styleMultiplier * experienceMultiplier)
  }

  optimizePhaseOrder(modules, userProfile) {
    // Reorder modules based on user's learning preferences
    const sortedModules = [...modules].sort((a, b) => {
      if (userProfile.learningStyle === 'ANALYTICAL') {
        return a.difficulty.localeCompare(b.difficulty) // Sequential difficulty
      } else if (userProfile.learningStyle === 'CREATIVE') {
        return Math.random() - 0.5 // Mix it up for creative learners
      }
      return 0 // Keep original order for others
    })

    return sortedModules.map((module, index) => ({
      phase: index + 1,
      ...module,
      estimatedWeeks: Math.ceil(module.duration / 480) // 8 hours per week
    }))
  }

  createDailySchedule(userProfile) {
    return {
      recommendedDuration: userProfile.averageSessionDuration || 60,
      optimalTimes: userProfile.optimalLearningTime || ['09:00', '14:00', '19:00'],
      frequency: 'DAILY',
      restDays: ['Sunday']
    }
  }

  generateMilestones(modules, targetLevel) {
    return modules.map((module, index) => ({
      id: `milestone_${index + 1}`,
      title: `Complete ${module.name}`,
      description: `Master the concepts and complete all exercises in ${module.name}`,
      type: 'MODULE_COMPLETION',
      points: module.difficulty === 'BEGINNER' ? 100 : module.difficulty === 'INTERMEDIATE' ? 200 : 300,
      badge: this.generateBadgeForMilestone(module)
    }))
  }

  generateBadgeForMilestone(module) {
    const badges = {
      'BEGINNER': '🌱',
      'INTERMEDIATE': '🚀',
      'ADVANCED': '⭐',
      'EXPERT': '🏆'
    }
    return {
      icon: badges[module.difficulty],
      name: `${module.name} ${module.difficulty.toLowerCase().charAt(0).toUpperCase() + module.difficulty.toLowerCase().slice(1)}`,
      rarity: module.difficulty === 'EXPERT' ? 'LEGENDARY' : module.difficulty === 'ADVANCED' ? 'EPIC' : 'COMMON'
    }
  }

  selectAdaptiveContent(userProfile, skillId) {
    // Select content based on learning style
    const contentTypes = {
      'VISUAL': ['video', 'infographic', 'diagram'],
      'AUDITORY': ['podcast', 'audio', 'discussion'],
      'KINESTHETIC': ['hands-on', 'project', 'simulation'],
      'READING_WRITING': ['article', 'documentation', 'notes']
    }

    return {
      primaryFormats: contentTypes[userProfile.learningStyle] || ['video'],
      supplementaryFormats: Object.values(contentTypes).flat().filter(
        type => !contentTypes[userProfile.learningStyle]?.includes(type)
      ).slice(0, 2)
    }
  }
}

module.exports = AIAssessmentService