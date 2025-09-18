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

// Get all skills with enhanced filtering
router.get('/', async (req, res, next) => {
  try {
    const {
      search,
      category,
      difficulty,
      skillLevel,
      minRating,
      sortBy = 'popularity',
      page = 1,
      limit = 20
    } = req.query;

    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { tags: { has: search as string } }
      ];
    }

    if (category) {
      where.category = {
        name: { contains: category as string, mode: 'insensitive' }
      };
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (skillLevel) {
      where.skillLevel = skillLevel;
    }

    if (minRating) {
      where.averageRating = { gte: Number(minRating) };
    }

    // Determine sort order
    let orderBy: any = { popularity: 'desc' };
    switch (sortBy) {
      case 'rating':
        orderBy = { averageRating: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'name':
        orderBy = { name: 'asc' };
        break;
      default:
        orderBy = { popularity: 'desc' };
    }

    const [skills, total] = await Promise.all([
      prisma.skill.findMany({
        where,
        include: {
          category: true,
          _count: {
            select: {
              userSkills: true,
              content: true,
              roadmaps: true
            }
          }
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy
      }),
      prisma.skill.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        skills,
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

// Get teachers for skills
router.get('/teachers', async (req, res, next) => {
  try {
    const { skill, location, rating, page = 1, limit = 20 } = req.query;

    const where: any = {
      isTeacher: true,
      userSkills: {
        some: {
          canTeach: true
        }
      }
    };

    if (skill) {
      where.userSkills.some.skill = {
        name: {
          contains: skill as string,
          mode: 'insensitive'
        }
      };
    }

    if (location) {
      where.OR = [
        { city: { contains: location as string, mode: 'insensitive' } },
        { country: { contains: location as string, mode: 'insensitive' } }
      ];
    }

    if (rating) {
      where.rating = {
        gte: Number(rating)
      };
    }

    const [teachers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          avatar: true,
          bio: true,
          rating: true,
          reviewCount: true,
          city: true,
          country: true,
          verified: true,
          userSkills: {
            where: { canTeach: true },
            include: {
              skill: {
                include: { category: true }
              }
            }
          },
          receivedReviews: {
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: {
              reviewer: {
                select: { name: true, avatar: true }
              }
            }
          }
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { rating: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        teachers,
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

// Get skill details with roadmap and content
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const skill = await prisma.skill.findUnique({
      where: { id },
      include: {
        category: true,
        roadmaps: true,
        content: {
          where: { isPublic: true },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            userSkills: true,
            sessions: true
          }
        }
      }
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.json({
      success: true,
      data: skill
    });
  } catch (error) {
    next(error);
  }
});

// Get skill roadmap
router.get('/:id/roadmap', async (req, res, next) => {
  try {
    const { id } = req.params;

    const roadmap = await prisma.skillRoadmap.findFirst({
      where: { skillId: id },
      include: {
        skill: {
          select: {
            name: true,
            description: true,
            difficulty: true,
            duration: true,
            category: true
          }
        }
      }
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: 'Roadmap not found for this skill'
      });
    }

    res.json({
      success: true,
      data: roadmap
    });
  } catch (error) {
    next(error);
  }
});

// Get skill content/lessons
router.get('/:id/content', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, level, page = 1, limit = 10 } = req.query;

    const where: any = {
      skillId: id,
      isPublic: true
    };

    if (type) {
      where.type = type;
    }

    if (level) {
      where.level = level;
    }

    const [content, total] = await Promise.all([
      prisma.skillContent.findMany({
        where,
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      }),
      prisma.skillContent.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        content,
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

// Get specific content item
router.get('/content/:contentId', async (req, res, next) => {
  try {
    const { contentId } = req.params;

    const content = await prisma.skillContent.findUnique({
      where: { id: contentId },
      include: {
        skill: {
          select: {
            name: true,
            category: true
          }
        }
      }
    });

    if (!content || !content.isPublic) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    next(error);
  }
});

// Get skill statistics
router.get('/:id/stats', async (req, res, next) => {
  try {
    const { id } = req.params;

    const [
      skill,
      teacherCount,
      learnerCount,
      avgSessionPrice,
      totalSessions,
      ratingDistribution
    ] = await Promise.all([
      prisma.skill.findUnique({
        where: { id },
        select: {
          name: true,
          averageRating: true,
          totalReviews: true,
          popularity: true
        }
      }),
      prisma.userSkill.count({
        where: { skillId: id, role: 'TEACHER', isActive: true }
      }),
      prisma.userSkill.count({
        where: { skillId: id, role: 'LEARNER', isActive: true }
      }),
      prisma.session.aggregate({
        where: { skillId: id, status: 'completed' },
        _avg: { price: true }
      }),
      prisma.session.count({
        where: { skillId: id, status: 'completed' }
      }),
      // Mock rating distribution - in real app, calculate from reviews
      Promise.resolve({
        5: 45,
        4: 30,
        3: 15,
        2: 7,
        1: 3
      })
    ]);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.json({
      success: true,
      data: {
        skill,
        stats: {
          teacherCount,
          learnerCount,
          averageSessionPrice: avgSessionPrice._avg.price || 0,
          totalSessions,
          ratingDistribution,
          demandLevel: teacherCount > 0 ? 'High' : 'Medium'
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Search skills with advanced filters
router.get('/search/advanced', async (req, res, next) => {
  try {
    const {
      q,
      categories,
      difficulties,
      skillLevels,
      minRating,
      maxPrice,
      location,
      sortBy = 'relevance',
      page = 1,
      limit = 12
    } = req.query;

    const where: any = { isActive: true };

    // Text search
    if (q) {
      where.OR = [
        { name: { contains: q as string, mode: 'insensitive' } },
        { description: { contains: q as string, mode: 'insensitive' } },
        { tags: { has: q as string } },
        { learningOutcomes: { has: q as string } }
      ];
    }

    // Category filter
    if (categories) {
      const categoryList = (categories as string).split(',');
      where.category = {
        name: { in: categoryList }
      };
    }

    // Difficulty filter
    if (difficulties) {
      const difficultyList = (difficulties as string).split(',');
      where.difficulty = { in: difficultyList };
    }

    // Skill level filter
    if (skillLevels) {
      const levelList = (skillLevels as string).split(',');
      where.skillLevel = { in: levelList };
    }

    // Rating filter
    if (minRating) {
      where.averageRating = { gte: Number(minRating) };
    }

    // Sort options
    let orderBy: any = { popularity: 'desc' };
    switch (sortBy) {
      case 'rating':
        orderBy = [{ averageRating: 'desc' }, { totalReviews: 'desc' }];
        break;
      case 'popularity':
        orderBy = { popularity: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'price_low':
        // This would need a complex query with user skills
        orderBy = { name: 'asc' };
        break;
      default:
        orderBy = { popularity: 'desc' };
    }

    const [skills, total, topCategories] = await Promise.all([
      prisma.skill.findMany({
        where,
        include: {
          category: true,
          _count: {
            select: {
              userSkills: true,
              content: true,
              roadmaps: true
            }
          }
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy
      }),
      prisma.skill.count({ where }),
      // Get popular categories for faceted search
      prisma.skillCategory.findMany({
        include: {
          _count: {
            select: { skills: true }
          }
        },
        orderBy: {
          skills: { _count: 'desc' }
        },
        take: 8
      })
    ]);

    res.json({
      success: true,
      data: {
        skills,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        },
        facets: {
          categories: topCategories.map(cat => ({
            name: cat.name,
            count: cat._count.skills,
            icon: cat.icon,
            color: cat.color
          }))
        }
      }
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