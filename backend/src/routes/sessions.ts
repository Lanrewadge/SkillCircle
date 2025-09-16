import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get user sessions
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;

    const sessions = await prisma.session.findMany({
      where: {
        OR: [
          { teacherId: userId },
          { learnerId: userId }
        ]
      },
      include: {
        teacher: {
          select: { id: true, name: true, avatar: true }
        },
        learner: {
          select: { id: true, name: true, avatar: true }
        },
        skill: {
          select: { name: true, category: true }
        }
      },
      orderBy: { scheduledAt: 'desc' }
    });

    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
});

export default router;