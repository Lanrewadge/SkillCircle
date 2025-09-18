import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Get user profile
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        bio: true,
        verified: true,
        isTeacher: true,
        isLearner: true,
        rating: true,
        reviewCount: true,
        city: true,
        country: true,
        createdAt: true,
        userSkills: {
          include: {
            skill: {
              include: {
                category: true
              }
            }
          }
        },
        receivedReviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            reviewer: {
              select: { name: true, avatar: true }
            }
          }
        }
      }
    });

    if (!user) {
      throw createError(404, 'User not found');
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const { name, bio, avatar, isTeacher, isLearner, latitude, longitude, address, city, country } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(bio && { bio }),
        ...(avatar && { avatar }),
        ...(typeof isTeacher === 'boolean' && { isTeacher }),
        ...(typeof isLearner === 'boolean' && { isLearner }),
        ...(latitude && { latitude }),
        ...(longitude && { longitude }),
        ...(address && { address }),
        ...(city && { city }),
        ...(country && { country })
      },
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        bio: true,
        verified: true,
        isTeacher: true,
        isLearner: true,
        rating: true,
        reviewCount: true,
        latitude: true,
        longitude: true,
        address: true,
        city: true,
        country: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// Search users
router.get('/', authenticate, async (req, res, next) => {
  try {
    const {
      search,
      skills,
      city,
      isTeacher,
      page = 1,
      limit = 20
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { username: { contains: search as string, mode: 'insensitive' } },
        { bio: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (skills) {
      const skillNames = (skills as string).split(',');
      where.userSkills = {
        some: {
          skill: {
            name: { in: skillNames }
          }
        }
      };
    }

    if (city) {
      where.city = { contains: city as string, mode: 'insensitive' };
    }

    if (isTeacher !== undefined) {
      where.isTeacher = isTeacher === 'true';
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          name: true,
          avatar: true,
          bio: true,
          verified: true,
          isTeacher: true,
          isLearner: true,
          rating: true,
          reviewCount: true,
          city: true,
          country: true,
          userSkills: {
            include: {
              skill: {
                select: { name: true, category: true }
              }
            }
          }
        },
        skip,
        take: Number(limit),
        orderBy: { rating: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;