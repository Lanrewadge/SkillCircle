import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all skill categories
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await prisma.skillCategory.findMany({
      include: {
        skills: {
          take: 5,
          select: { id: true, name: true }
        },
        _count: {
          select: { skills: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
});

// Get skills by category
router.get('/categories/:categoryId/skills', async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skills = await prisma.skill.findMany({
      where: { categoryId },
      include: {
        category: true,
        _count: {
          select: { userSkills: true }
        }
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: skills
    });
  } catch (error) {
    next(error);
  }
});

// Add skill to user
router.post('/user-skills', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const { skillId, role, level, experience, hourlyRate, currency } = req.body;

    const userSkill = await prisma.userSkill.create({
      data: {
        userId,
        skillId,
        role,
        level,
        experience,
        hourlyRate,
        currency
      },
      include: {
        skill: {
          include: { category: true }
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

export default router;