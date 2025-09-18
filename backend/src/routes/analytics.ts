import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Get analytics overview
router.get('/overview', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;

    // Get user's analytics data
    const [
      totalSessions,
      totalEarnings,
      totalReviews,
      averageRating,
      hoursTeaching,
      hoursLearning
    ] = await Promise.all([
      prisma.session.count({
        where: {
          OR: [
            { teacherId: userId },
            { learnerId: userId }
          ],
          status: 'COMPLETED'
        }
      }),
      prisma.session.aggregate({
        where: {
          teacherId: userId,
          status: 'COMPLETED'
        },
        _sum: {
          price: true
        }
      }),
      prisma.review.count({
        where: { reviewedId: userId }
      }),
      prisma.review.aggregate({
        where: { reviewedId: userId },
        _avg: {
          rating: true
        }
      }),
      prisma.session.aggregate({
        where: {
          teacherId: userId,
          status: 'COMPLETED'
        },
        _sum: {
          duration: true
        }
      }),
      prisma.session.aggregate({
        where: {
          learnerId: userId,
          status: 'COMPLETED'
        },
        _sum: {
          duration: true
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        totalSessions,
        totalEarnings: totalEarnings._sum.price || 0,
        totalReviews,
        averageRating: Number(averageRating._avg.rating?.toFixed(1)) || 0,
        hoursTeaching: (hoursTeaching._sum.duration || 0) / 60,
        hoursLearning: (hoursLearning._sum.duration || 0) / 60,
        period: 'all-time'
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get performance analytics
router.get('/performance', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const { period = '30' } = req.query;

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period as string));

    // Get session performance data
    const sessions = await prisma.session.findMany({
      where: {
        OR: [
          { teacherId: userId },
          { learnerId: userId }
        ],
        createdAt: {
          gte: daysAgo
        }
      },
      select: {
        id: true,
        status: true,
        duration: true,
        price: true,
        createdAt: true,
        teacherId: true,
        skill: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate performance metrics
    const teachingSessions = sessions.filter(s => s.teacherId === userId);
    const learningSessions = sessions.filter(s => s.teacherId !== userId);

    const completionRate = sessions.length > 0
      ? (sessions.filter(s => s.status === 'COMPLETED').length / sessions.length) * 100
      : 0;

    const totalEarnings = teachingSessions
      .filter(s => s.status === 'COMPLETED')
      .reduce((sum, s) => sum + (s.price || 0), 0);

    res.json({
      success: true,
      data: {
        sessions: {
          total: sessions.length,
          teaching: teachingSessions.length,
          learning: learningSessions.length,
          completed: sessions.filter(s => s.status === 'COMPLETED').length,
          cancelled: sessions.filter(s => s.status === 'CANCELLED').length,
          completionRate: Math.round(completionRate)
        },
        earnings: {
          total: totalEarnings,
          period: `${period} days`
        },
        topSkills: Object.entries(
          sessions.reduce((acc, session) => {
            const skillName = session.skill.name;
            acc[skillName] = (acc[skillName] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        )
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([skill, count]) => ({ skill, count }))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get goals analytics
router.get('/goals', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;

    // Mock goals data - in a real app, you'd have a goals table
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0);

    const [monthlyEarnings, monthlySessions, monthlyHours] = await Promise.all([
      prisma.session.aggregate({
        where: {
          teacherId: userId,
          status: 'COMPLETED',
          createdAt: {
            gte: monthStart,
            lte: monthEnd
          }
        },
        _sum: {
          price: true
        }
      }),
      prisma.session.count({
        where: {
          teacherId: userId,
          status: 'COMPLETED',
          createdAt: {
            gte: monthStart,
            lte: monthEnd
          }
        }
      }),
      prisma.session.aggregate({
        where: {
          teacherId: userId,
          status: 'COMPLETED',
          createdAt: {
            gte: monthStart,
            lte: monthEnd
          }
        },
        _sum: {
          duration: true
        }
      })
    ]);

    const goals = [
      {
        id: 1,
        title: 'Monthly Earnings',
        target: 1000,
        current: monthlyEarnings._sum.price || 0,
        unit: '$',
        period: 'month'
      },
      {
        id: 2,
        title: 'Teaching Sessions',
        target: 20,
        current: monthlySessions,
        unit: 'sessions',
        period: 'month'
      },
      {
        id: 3,
        title: 'Teaching Hours',
        target: 40,
        current: Math.round((monthlyHours._sum.duration || 0) / 60),
        unit: 'hours',
        period: 'month'
      }
    ];

    res.json({
      success: true,
      data: goals.map(goal => ({
        ...goal,
        progress: Math.min(Math.round((goal.current / goal.target) * 100), 100),
        status: goal.current >= goal.target ? 'completed' : 'in-progress'
      }))
    });
  } catch (error) {
    next(error);
  }
});

export default router;