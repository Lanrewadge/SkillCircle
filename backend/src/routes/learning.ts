import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Get learning paths
router.get('/paths', authenticate, async (req, res, next) => {
  try {
    const { category, difficulty, page = 1, limit = 20 } = req.query;

    // Mock learning paths data - in a real app, you'd have a learning_paths table
    const learningPaths = [
      {
        id: '1',
        title: 'Complete Web Development',
        description: 'Learn HTML, CSS, JavaScript, React, and Node.js',
        category: 'Web Development',
        difficulty: 'Beginner',
        duration: '12 weeks',
        modules: 8,
        enrolledCount: 1250,
        rating: 4.8,
        instructor: {
          name: 'John Smith',
          avatar: 'https://example.com/avatar1.jpg'
        },
        thumbnail: 'https://example.com/path1.jpg',
        skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
        price: 99,
        isEnrolled: false
      },
      {
        id: '2',
        title: 'Python for Data Science',
        description: 'Master Python, pandas, NumPy, and machine learning',
        category: 'Data Science',
        difficulty: 'Intermediate',
        duration: '10 weeks',
        modules: 6,
        enrolledCount: 980,
        rating: 4.9,
        instructor: {
          name: 'Sarah Johnson',
          avatar: 'https://example.com/avatar2.jpg'
        },
        thumbnail: 'https://example.com/path2.jpg',
        skills: ['Python', 'Pandas', 'NumPy', 'Machine Learning'],
        price: 149,
        isEnrolled: true
      },
      {
        id: '3',
        title: 'Mobile App Development',
        description: 'Build iOS and Android apps with React Native',
        category: 'Mobile Development',
        difficulty: 'Advanced',
        duration: '16 weeks',
        modules: 10,
        enrolledCount: 750,
        rating: 4.7,
        instructor: {
          name: 'Mike Chen',
          avatar: 'https://example.com/avatar3.jpg'
        },
        thumbnail: 'https://example.com/path3.jpg',
        skills: ['React Native', 'iOS', 'Android', 'JavaScript'],
        price: 199,
        isEnrolled: false
      }
    ];

    // Apply filters
    let filteredPaths = learningPaths;
    if (category) {
      filteredPaths = filteredPaths.filter(path =>
        path.category.toLowerCase().includes((category as string).toLowerCase())
      );
    }
    if (difficulty) {
      filteredPaths = filteredPaths.filter(path =>
        path.difficulty.toLowerCase() === (difficulty as string).toLowerCase()
      );
    }

    res.json({
      success: true,
      data: {
        paths: filteredPaths,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: filteredPaths.length,
          pages: Math.ceil(filteredPaths.length / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get current module
router.get('/modules/current', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;

    // Mock current module data
    const currentModule = {
      id: '1',
      pathId: '2',
      title: 'Introduction to Python',
      description: 'Learn Python basics and syntax',
      content: {
        video: 'https://example.com/video1.mp4',
        transcript: 'Welcome to Python programming...',
        resources: [
          {
            title: 'Python Documentation',
            url: 'https://docs.python.org',
            type: 'documentation'
          },
          {
            title: 'Practice Exercises',
            url: 'https://example.com/exercises',
            type: 'exercises'
          }
        ]
      },
      duration: 45,
      progress: 75,
      isCompleted: false,
      nextModule: {
        id: '2',
        title: 'Variables and Data Types'
      },
      quiz: {
        questions: 5,
        passingScore: 80,
        attempts: 2,
        bestScore: 60
      }
    };

    res.json({
      success: true,
      data: currentModule
    });
  } catch (error) {
    next(error);
  }
});

// Get achievements
router.get('/achievements', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;

    // Mock achievements data
    const achievements = [
      {
        id: '1',
        title: 'First Steps',
        description: 'Complete your first module',
        icon: '🎯',
        category: 'Progress',
        earned: true,
        earnedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        progress: 100,
        total: 1
      },
      {
        id: '2',
        title: 'Speed Learner',
        description: 'Complete 5 modules in one week',
        icon: '⚡',
        category: 'Progress',
        earned: true,
        earnedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        progress: 5,
        total: 5
      },
      {
        id: '3',
        title: 'Quiz Master',
        description: 'Score 100% on 10 quizzes',
        icon: '🧠',
        category: 'Performance',
        earned: false,
        earnedAt: null,
        progress: 7,
        total: 10
      },
      {
        id: '4',
        title: 'Path Completer',
        description: 'Complete an entire learning path',
        icon: '🏆',
        category: 'Achievement',
        earned: false,
        earnedAt: null,
        progress: 60,
        total: 100
      },
      {
        id: '5',
        title: 'Consistency King',
        description: 'Learn for 30 consecutive days',
        icon: '📅',
        category: 'Streak',
        earned: false,
        earnedAt: null,
        progress: 12,
        total: 30
      }
    ];

    const stats = {
      total: achievements.length,
      earned: achievements.filter(a => a.earned).length,
      points: achievements.filter(a => a.earned).length * 100,
      nextMilestone: achievements.find(a => !a.earned)
    };

    res.json({
      success: true,
      data: {
        achievements,
        stats
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get learning stats
router.get('/stats', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;

    // Mock learning stats
    const stats = {
      totalTimeSpent: 2400, // minutes
      modulesCompleted: 15,
      pathsCompleted: 1,
      currentStreak: 12, // days
      longestStreak: 25,
      averageScore: 87,
      totalPoints: 1200,
      level: 5,
      nextLevelPoints: 300,
      weeklyGoal: {
        target: 300, // minutes
        current: 180,
        progress: 60
      },
      recentActivity: [
        {
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 0),
          minutes: 45,
          modules: 1
        },
        {
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
          minutes: 60,
          modules: 2
        },
        {
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          minutes: 30,
          modules: 1
        },
        {
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
          minutes: 75,
          modules: 2
        }
      ]
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

// Enroll in learning path
router.post('/paths/:id/enroll', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    // In a real app, you'd create an enrollment record
    // await prisma.learningPathEnrollment.create({
    //   data: {
    //     userId,
    //     pathId: id,
    //     enrolledAt: new Date()
    //   }
    // });

    res.json({
      success: true,
      message: 'Successfully enrolled in learning path'
    });
  } catch (error) {
    next(error);
  }
});

// Update module progress
router.put('/modules/:id/progress', [
  body('progress').isInt({ min: 0, max: 100 })
], authenticate, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError(400, 'Validation failed', errors.array());
    }

    const { id } = req.params;
    const { progress } = req.body;
    const userId = (req as any).user.id;

    // In a real app, you'd update the module progress
    // await prisma.moduleProgress.upsert({
    //   where: {
    //     userId_moduleId: { userId, moduleId: id }
    //   },
    //   create: {
    //     userId,
    //     moduleId: id,
    //     progress
    //   },
    //   update: {
    //     progress
    //   }
    // });

    res.json({
      success: true,
      message: 'Module progress updated'
    });
  } catch (error) {
    next(error);
  }
});

// Complete module
router.post('/modules/:id/complete', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    // In a real app, you'd mark the module as completed
    // await prisma.moduleProgress.upsert({
    //   where: {
    //     userId_moduleId: { userId, moduleId: id }
    //   },
    //   create: {
    //     userId,
    //     moduleId: id,
    //     progress: 100,
    //     completedAt: new Date()
    //   },
    //   update: {
    //     progress: 100,
    //     completedAt: new Date()
    //   }
    // });

    res.json({
      success: true,
      message: 'Module completed successfully',
      data: {
        pointsEarned: 50,
        achievementsUnlocked: []
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get path progress
router.get('/progress/:pathId', authenticate, async (req, res, next) => {
  try {
    const { pathId } = req.params;
    const userId = (req as any).user.id;

    // Mock progress data
    const progress = {
      pathId,
      userId,
      enrolledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      overallProgress: 45,
      modulesCompleted: 3,
      totalModules: 8,
      timeSpent: 720, // minutes
      lastAccessed: new Date(Date.now() - 1000 * 60 * 60 * 2),
      modules: [
        {
          id: '1',
          title: 'Introduction to Python',
          progress: 100,
          completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
        },
        {
          id: '2',
          title: 'Variables and Data Types',
          progress: 100,
          completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
        },
        {
          id: '3',
          title: 'Control Structures',
          progress: 75,
          completedAt: null
        },
        {
          id: '4',
          title: 'Functions',
          progress: 0,
          completedAt: null
        }
      ]
    };

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    next(error);
  }
});

// Get learning recommendations
router.get('/recommendations', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;

    // Mock recommendations based on user's skills and progress
    const recommendations = [
      {
        id: '4',
        title: 'Advanced JavaScript',
        description: 'Master ES6+, async/await, and modern JS features',
        category: 'Web Development',
        difficulty: 'Advanced',
        reason: 'Based on your JavaScript skills',
        rating: 4.8,
        duration: '8 weeks',
        price: 129
      },
      {
        id: '5',
        title: 'Database Design',
        description: 'Learn SQL, NoSQL, and database optimization',
        category: 'Backend Development',
        difficulty: 'Intermediate',
        reason: 'Popular among web developers',
        rating: 4.7,
        duration: '6 weeks',
        price: 89
      },
      {
        id: '6',
        title: 'UI/UX Design Fundamentals',
        description: 'Design principles, wireframing, and prototyping',
        category: 'Design',
        difficulty: 'Beginner',
        reason: 'Complements your development skills',
        rating: 4.9,
        duration: '4 weeks',
        price: 69
      }
    ];

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
});

export default router;