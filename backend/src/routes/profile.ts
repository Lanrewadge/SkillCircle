import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Get user profile
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
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
        createdAt: true,
        profile: true,
        userSkills: {
          include: {
            skill: {
              include: {
                category: true
              }
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
router.put('/', [
  body('name').optional().isLength({ min: 1, max: 100 }).trim(),
  body('bio').optional().isLength({ max: 500 }).trim(),
  body('avatar').optional().isURL(),
  body('latitude').optional().isFloat(),
  body('longitude').optional().isFloat(),
  body('address').optional().isLength({ max: 200 }).trim(),
  body('city').optional().isLength({ max: 100 }).trim(),
  body('country').optional().isLength({ max: 100 }).trim()
], authenticate, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError(400, 'Validation failed', errors.array());
    }

    const userId = (req as any).user.id;
    const {
      name,
      bio,
      avatar,
      isTeacher,
      isLearner,
      latitude,
      longitude,
      address,
      city,
      country
    } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(bio !== undefined && { bio }),
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
        email: true,
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

// Upload avatar
router.post('/avatar', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const { avatar } = req.body;

    if (!avatar) {
      throw createError(400, 'Avatar URL is required');
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatar },
      select: {
        id: true,
        avatar: true
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

// Update privacy settings
router.put('/privacy', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const { showEmail, showLocation, showOnlineStatus } = req.body;

    // Update user profile privacy settings
    await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        showEmail: showEmail ?? true,
        showLocation: showLocation ?? true,
        showOnlineStatus: showOnlineStatus ?? true
      },
      update: {
        ...(typeof showEmail === 'boolean' && { showEmail }),
        ...(typeof showLocation === 'boolean' && { showLocation }),
        ...(typeof showOnlineStatus === 'boolean' && { showOnlineStatus })
      }
    });

    res.json({
      success: true,
      message: 'Privacy settings updated'
    });
  } catch (error) {
    next(error);
  }
});

// Update notification settings
router.put('/notifications', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const {
      emailNotifications,
      pushNotifications,
      sessionReminders,
      messageNotifications,
      reviewNotifications
    } = req.body;

    // Update user profile notification settings
    await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        emailNotifications: emailNotifications ?? true,
        pushNotifications: pushNotifications ?? true,
        sessionReminders: sessionReminders ?? true,
        messageNotifications: messageNotifications ?? true,
        reviewNotifications: reviewNotifications ?? true
      },
      update: {
        ...(typeof emailNotifications === 'boolean' && { emailNotifications }),
        ...(typeof pushNotifications === 'boolean' && { pushNotifications }),
        ...(typeof sessionReminders === 'boolean' && { sessionReminders }),
        ...(typeof messageNotifications === 'boolean' && { messageNotifications }),
        ...(typeof reviewNotifications === 'boolean' && { reviewNotifications })
      }
    });

    res.json({
      success: true,
      message: 'Notification settings updated'
    });
  } catch (error) {
    next(error);
  }
});

// Get user activity
router.get('/activity', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Get recent sessions
    const sessions = await prisma.session.findMany({
      where: {
        OR: [
          { teacherId: userId },
          { learnerId: userId }
        ]
      },
      include: {
        skill: true,
        teacher: {
          select: { name: true, avatar: true }
        },
        learner: {
          select: { name: true, avatar: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    });

    // Format activity data
    const activity = sessions.map(session => ({
      id: session.id,
      type: session.teacherId === userId ? 'teaching' : 'learning',
      title: `${session.teacherId === userId ? 'Taught' : 'Learned'} ${session.skill.name}`,
      description: session.teacherId === userId
        ? `Session with ${session.learner.name}`
        : `Session with ${session.teacher.name}`,
      status: session.status,
      date: session.createdAt,
      duration: session.duration,
      price: session.price
    }));

    res.json({
      success: true,
      data: {
        activity,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: sessions.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get user skills
router.get('/skills', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;

    const userSkills = await prisma.userSkill.findMany({
      where: { userId },
      include: {
        skill: {
          include: {
            category: true
          }
        }
      },
      orderBy: { proficiencyLevel: 'desc' }
    });

    res.json({
      success: true,
      data: userSkills
    });
  } catch (error) {
    next(error);
  }
});

// Add user skill
router.post('/skills', [
  body('skillId').isUUID(),
  body('proficiencyLevel').isIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
  body('canTeach').isBoolean(),
  body('wantsToLearn').isBoolean()
], authenticate, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError(400, 'Validation failed', errors.array());
    }

    const userId = (req as any).user.id;
    const { skillId, proficiencyLevel, canTeach, wantsToLearn } = req.body;

    // Check if user already has this skill
    const existingUserSkill = await prisma.userSkill.findUnique({
      where: {
        userId_skillId: {
          userId,
          skillId
        }
      }
    });

    if (existingUserSkill) {
      throw createError(409, 'User already has this skill');
    }

    const userSkill = await prisma.userSkill.create({
      data: {
        userId,
        skillId,
        proficiencyLevel,
        canTeach,
        wantsToLearn
      },
      include: {
        skill: {
          include: {
            category: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: userSkill
    });
  } catch (error) {
    next(error);
  }
});

// Update user skill
router.put('/skills/:id', [
  body('proficiencyLevel').optional().isIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
  body('canTeach').optional().isBoolean(),
  body('wantsToLearn').optional().isBoolean()
], authenticate, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError(400, 'Validation failed', errors.array());
    }

    const { id } = req.params;
    const userId = (req as any).user.id;
    const { proficiencyLevel, canTeach, wantsToLearn } = req.body;

    const userSkill = await prisma.userSkill.update({
      where: {
        id,
        userId // Ensure user can only update their own skills
      },
      data: {
        ...(proficiencyLevel && { proficiencyLevel }),
        ...(typeof canTeach === 'boolean' && { canTeach }),
        ...(typeof wantsToLearn === 'boolean' && { wantsToLearn })
      },
      include: {
        skill: {
          include: {
            category: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: userSkill
    });
  } catch (error) {
    next(error);
  }
});

// Delete user skill
router.delete('/skills/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    await prisma.userSkill.delete({
      where: {
        id,
        userId // Ensure user can only delete their own skills
      }
    });

    res.json({
      success: true,
      message: 'Skill removed from profile'
    });
  } catch (error) {
    next(error);
  }
});

// Get user reviews
router.get('/reviews', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { reviewedId: userId },
        include: {
          reviewer: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          session: {
            select: {
              id: true,
              skill: {
                select: { name: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.review.count({
        where: { reviewedId: userId }
      })
    ]);

    res.json({
      success: true,
      data: {
        reviews,
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