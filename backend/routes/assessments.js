const express = require('express');
const router = express.Router();

// Mock assessment data
const assessmentQuestions = {
  'react': [
    {
      id: 'react_q1',
      type: 'multiple-choice',
      question: 'What is the purpose of the useState hook in React?',
      options: [
        'To manage component lifecycle',
        'To manage local component state',
        'To handle side effects',
        'To optimize performance'
      ],
      correctAnswer: 1,
      points: 10,
      explanation: 'useState is used to add state to functional components in React.'
    },
    {
      id: 'react_q2',
      type: 'code',
      question: 'Write a React component that displays a counter with increment and decrement buttons.',
      points: 20,
      timeLimit: 300,
      codeTemplate: `import React, { useState } from 'react';

function Counter() {
  // Your code here

  return (
    <div>
      {/* Your JSX here */}
    </div>
  );
}

export default Counter;`
    },
    {
      id: 'react_q3',
      type: 'multiple-choice',
      question: 'Which lifecycle method is equivalent to componentDidMount in functional components?',
      options: [
        'useEffect with empty dependency array',
        'useEffect with no dependency array',
        'useState',
        'useCallback'
      ],
      correctAnswer: 0,
      points: 15,
      explanation: 'useEffect with an empty dependency array runs once after the component mounts.'
    }
  ],
  'javascript': [
    {
      id: 'js_q1',
      type: 'multiple-choice',
      question: 'What is the difference between let, const, and var in JavaScript?',
      options: [
        'No difference, they are synonyms',
        'Different scoping rules and mutability',
        'Only syntax differences',
        'Performance differences only'
      ],
      correctAnswer: 1,
      points: 10
    },
    {
      id: 'js_q2',
      type: 'code',
      question: 'Write a function that debounces another function call.',
      points: 25,
      timeLimit: 600,
      codeTemplate: `function debounce(func, delay) {
  // Your implementation here
}`
    }
  ]
};

const mockAssessmentResults = [
  {
    id: 'assess_001',
    userId: 'user_001',
    skillName: 'React Development',
    skillId: 'react',
    type: 'full-assessment',
    score: 85,
    maxScore: 100,
    percentage: 85,
    level: 'Advanced',
    completedAt: new Date().toISOString(),
    timeSpent: 1800,
    certificateUrl: '/certificates/react_advanced.pdf'
  }
];

const availableAssessments = [
  {
    id: 'react',
    name: 'React Development',
    description: 'Comprehensive assessment covering React fundamentals, hooks, state management, and best practices.',
    category: 'Frontend',
    difficulty: 'intermediate',
    duration: 45,
    questions: 25,
    attempts: 1247,
    avgScore: 73,
    participants: 856,
    certificateAvailable: true,
    tags: ['React', 'JavaScript', 'Frontend', 'Components']
  },
  {
    id: 'javascript',
    name: 'JavaScript ES6+',
    description: 'Test your knowledge of modern JavaScript including ES6+ features, async programming, and design patterns.',
    category: 'Programming',
    difficulty: 'intermediate',
    duration: 40,
    questions: 30,
    attempts: 2156,
    avgScore: 68,
    participants: 1423,
    certificateAvailable: true,
    tags: ['JavaScript', 'ES6', 'Async', 'Programming']
  },
  {
    id: 'typescript',
    name: 'TypeScript Fundamentals',
    description: 'Evaluate your TypeScript skills including type system, interfaces, generics, and advanced patterns.',
    category: 'Programming',
    difficulty: 'intermediate',
    duration: 35,
    questions: 20,
    attempts: 892,
    avgScore: 71,
    participants: 634,
    certificateAvailable: true,
    tags: ['TypeScript', 'Types', 'JavaScript', 'Programming']
  }
];

// Get all available assessments
router.get('/', (req, res) => {
  try {
    const { category, difficulty, search } = req.query;

    let filtered = [...availableAssessments];

    if (category && category !== 'all') {
      filtered = filtered.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }

    if (difficulty && difficulty !== 'all') {
      filtered = filtered.filter(a => a.difficulty === difficulty);
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(searchTerm) ||
        a.description.toLowerCase().includes(searchTerm) ||
        a.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    res.json({
      success: true,
      assessments: filtered,
      total: filtered.length
    });
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assessments'
    });
  }
});

// Get assessment by ID
router.get('/:assessmentId', (req, res) => {
  try {
    const { assessmentId } = req.params;
    const assessment = availableAssessments.find(a => a.id === assessmentId);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    res.json({
      success: true,
      assessment
    });
  } catch (error) {
    console.error('Error fetching assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assessment'
    });
  }
});

// Get assessment questions
router.get('/:assessmentId/questions', (req, res) => {
  try {
    const { assessmentId } = req.params;
    const questions = assessmentQuestions[assessmentId];

    if (!questions) {
      return res.status(404).json({
        success: false,
        message: 'Assessment questions not found'
      });
    }

    // Remove correct answers from questions for security
    const sanitizedQuestions = questions.map(q => {
      const { correctAnswer, explanation, ...sanitized } = q;
      return sanitized;
    });

    res.json({
      success: true,
      questions: sanitizedQuestions,
      total: questions.length
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch questions'
    });
  }
});

// Submit assessment
router.post('/:assessmentId/submit', (req, res) => {
  try {
    const { assessmentId } = req.params;
    const { answers, timeSpent } = req.body;
    const userId = req.user?.id || 'anonymous';

    const questions = assessmentQuestions[assessmentId];
    const assessment = availableAssessments.find(a => a.id === assessmentId);

    if (!questions || !assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Calculate score
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach(question => {
      maxScore += question.points;
      const userAnswer = answers[question.id];

      if (question.type === 'multiple-choice' && userAnswer === question.correctAnswer) {
        totalScore += question.points;
      } else if (question.type === 'code' || question.type === 'practical') {
        // Simplified scoring for code questions
        if (userAnswer && userAnswer.trim().length > 50) {
          totalScore += Math.floor(question.points * 0.7);
        }
      } else if (question.type === 'essay') {
        // Simplified scoring for essays
        if (userAnswer && userAnswer.trim().length > 100) {
          totalScore += Math.floor(question.points * 0.8);
        }
      }
    });

    const percentage = Math.round((totalScore / maxScore) * 100);

    // Determine skill level
    let level;
    if (percentage >= 90) level = 'Expert';
    else if (percentage >= 75) level = 'Advanced';
    else if (percentage >= 60) level = 'Intermediate';
    else if (percentage >= 40) level = 'Beginner';
    else level = 'Novice';

    // Generate recommendations
    const recommendations = [];
    if (percentage < 60) {
      recommendations.push(`Consider taking a foundational ${assessment.name} course`);
      recommendations.push(`Practice basic ${assessment.name} concepts daily`);
      recommendations.push('Join a study group or find a mentor');
    } else if (percentage < 80) {
      recommendations.push(`Work on intermediate ${assessment.name} projects`);
      recommendations.push('Contribute to open source projects');
      recommendations.push(`Consider advanced ${assessment.name} specializations`);
    } else {
      recommendations.push('Share your knowledge by teaching others');
      recommendations.push(`Explore cutting-edge ${assessment.name} features`);
      recommendations.push(`Consider becoming a ${assessment.name} mentor`);
    }

    const result = {
      id: `result_${Date.now()}`,
      userId,
      skillId: assessmentId,
      skillName: assessment.name,
      type: 'full-assessment',
      score: totalScore,
      maxScore,
      percentage,
      level,
      timeSpent,
      answers,
      feedback: `You scored ${totalScore} out of ${maxScore} points (${percentage}%). Your current skill level is ${level}.`,
      recommendations,
      completedAt: new Date().toISOString(),
      certificate: percentage >= 70 ? {
        id: `cert_${assessmentId}_${Date.now()}`,
        url: `/certificates/cert_${assessmentId}_${Date.now()}.pdf`
      } : undefined
    };

    // In a real app, save to database
    mockAssessmentResults.push(result);

    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Error submitting assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit assessment'
    });
  }
});

// Get user's assessment results
router.get('/results/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user?.id || userId;

    // Filter results for the current user
    const userResults = mockAssessmentResults.filter(r => r.userId === currentUserId);

    res.json({
      success: true,
      results: userResults,
      total: userResults.length
    });
  } catch (error) {
    console.error('Error fetching user results:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assessment results'
    });
  }
});

// Submit level test
router.post('/:assessmentId/level-test', (req, res) => {
  try {
    const { assessmentId } = req.params;
    const { answers } = req.body;
    const userId = req.user?.id || 'anonymous';

    const assessment = availableAssessments.find(a => a.id === assessmentId);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Calculate average score from level test answers (1-5 scale)
    const scores = Object.values(answers);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    let level, description, nextSteps;

    if (averageScore <= 1.5) {
      level = 'Novice';
      description = "You're just starting your journey with this skill. Focus on learning fundamentals and building a strong foundation.";
      nextSteps = [
        'Start with beginner-friendly tutorials and courses',
        'Practice basic concepts daily',
        'Join community forums and study groups',
        'Find a mentor or study buddy'
      ];
    } else if (averageScore <= 2.5) {
      level = 'Beginner';
      description = "You have basic understanding and can follow tutorials. Time to start building simple projects.";
      nextSteps = [
        'Build simple personal projects',
        'Follow along with guided tutorials',
        'Learn best practices and conventions',
        'Start reading documentation regularly'
      ];
    } else if (averageScore <= 3.5) {
      level = 'Intermediate';
      description = "You can work independently on most tasks and understand core concepts well.";
      nextSteps = [
        'Take on more complex projects',
        'Learn advanced patterns and architectures',
        'Contribute to open source projects',
        'Start mentoring beginners'
      ];
    } else if (averageScore <= 4.5) {
      level = 'Advanced';
      description = "You have strong expertise and can handle complex problems and architectural decisions.";
      nextSteps = [
        'Lead technical projects and teams',
        'Share knowledge through teaching or writing',
        'Explore cutting-edge features and techniques',
        'Contribute to the community and ecosystem'
      ];
    } else {
      level = 'Expert';
      description = "You have mastery-level knowledge and regularly help others learn and solve complex problems.";
      nextSteps = [
        'Become a thought leader in the field',
        'Create educational content and courses',
        'Speak at conferences and events',
        'Innovate and push the boundaries of the skill'
      ];
    }

    const result = {
      level: level.toLowerCase(),
      score: Math.round(averageScore * 20),
      description,
      nextSteps
    };

    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Error submitting level test:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit level test'
    });
  }
});

// Get assessment statistics
router.get('/stats/overview', (req, res) => {
  try {
    const stats = {
      totalAssessments: availableAssessments.length,
      totalParticipants: availableAssessments.reduce((sum, a) => sum + a.participants, 0),
      averageScore: Math.round(
        availableAssessments.reduce((sum, a) => sum + a.avgScore, 0) / availableAssessments.length
      ),
      certificatesAvailable: availableAssessments.filter(a => a.certificateAvailable).length,
      categories: [...new Set(availableAssessments.map(a => a.category))],
      popularSkills: availableAssessments
        .sort((a, b) => b.participants - a.participants)
        .slice(0, 5)
        .map(a => ({
          name: a.name,
          participants: a.participants,
          avgScore: a.avgScore
        }))
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

module.exports = router;