import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get user matches
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const { status, page = 1, limit = 20 } = req.query;

    const where: any = {
      OR: [
        { learnerId: userId },
        { teacherId: userId }
      ]
    };

    if (status) {
      where.status = status;
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        learner: {
          select: { id: true, name: true, avatar: true, rating: true }
        },
        teacher: {
          select: { id: true, name: true, avatar: true, rating: true }
        },
        skill: {
          select: { name: true, category: true }
        }
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: matches
    });
  } catch (error) {
    next(error);
  }
});

export default router;