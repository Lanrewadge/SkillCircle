const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const Redis = require('ioredis');
const amqp = require('amqplib');
const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');

const logger = require('../../shared/logger');
const PerformanceOptimizer = require('../../shared/performance/PerformanceOptimizer');
const CacheManager = require('../../shared/cache/CacheManager');

const app = express();
const PORT = process.env.PORT || 3003;

// Performance optimization
const optimizer = new PerformanceOptimizer({
  clustering: process.env.NODE_ENV === 'production',
  compression: true,
  caching: true
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skill_circle_learning', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Redis connection
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
});

// Cache manager
const cacheManager = new CacheManager({
  redis,
  defaultTTL: 3600,
  memoryCache: true
});

// Course Schema
const CourseSchema = new mongoose.Schema({
  id: { type: String, unique: true, default: uuidv4 },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: String,
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  duration: Number, // in hours
  prerequisites: [String],
  objectives: [String],
  roadmap: [{
    module: String,
    title: String,
    description: String,
    duration: Number,
    order: Number,
    resources: [{
      type: { type: String, enum: ['video', 'article', 'quiz', 'assignment', 'project'] },
      title: String,
      url: String,
      duration: Number,
      isRequired: { type: Boolean, default: true }
    }]
  }],
  instructor: {
    id: String,
    name: String,
    bio: String,
    avatar: String,
    credentials: [String]
  },
  metadata: {
    language: { type: String, default: 'en' },
    difficulty: Number, // 1-10 scale
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    enrollmentCount: { type: Number, default: 0 },
    tags: [String],
    skills: [String]
  },
  pricing: {
    type: { type: String, enum: ['free', 'paid', 'subscription'], default: 'free' },
    amount: Number,
    currency: { type: String, default: 'USD' }
  },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Course = mongoose.model('Course', CourseSchema);

// User Progress Schema
const ProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  courseId: { type: String, required: true },
  enrollmentDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['enrolled', 'in_progress', 'completed', 'dropped'], default: 'enrolled' },
  progress: {
    completedModules: [String],
    currentModule: String,
    overallProgress: { type: Number, default: 0 }, // percentage
    timeSpent: { type: Number, default: 0 }, // in minutes
    lastAccessed: Date
  },
  assessments: [{
    moduleId: String,
    score: Number,
    maxScore: Number,
    attempts: Number,
    completedAt: Date
  }],
  certificates: [{
    id: String,
    type: String,
    issuedAt: Date,
    certificateUrl: String
  }],
  notes: [{
    moduleId: String,
    content: String,
    timestamp: { type: Date, default: Date.now }
  }],
  bookmarks: [{
    moduleId: String,
    resourceId: String,
    timestamp: { type: Date, default: Date.now }
  }]
});

ProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });
const Progress = mongoose.model('Progress', ProgressSchema);

// Learning Path Schema
const LearningPathSchema = new mongoose.Schema({
  id: { type: String, unique: true, default: uuidv4 },
  title: { type: String, required: true },
  description: String,
  category: String,
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  estimatedDuration: Number, // in hours
  courses: [{
    courseId: String,
    order: Number,
    isRequired: { type: Boolean, default: true },
    prerequisites: [String]
  }],
  skills: [String],
  outcomes: [String],
  createdBy: String,
  isPublic: { type: Boolean, default: true },
  enrollmentCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const LearningPath = mongoose.model('LearningPath', LearningPathSchema);

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP'
});
app.use(limiter);

// Performance monitoring
app.use(optimizer.getMetricsMiddleware());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'learning-secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Course Routes

// Get all courses with filters
app.get('/api/courses', async (req, res) => {
  try {
    const {
      category,
      level,
      language,
      rating,
      free,
      search,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    const cacheKey = `courses:${JSON.stringify(req.query)}`;
    const cachedResult = await cacheManager.get(cacheKey);
    if (cachedResult) {
      return res.json(cachedResult);
    }

    const filter = { status: 'published' };

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (language) filter['metadata.language'] = language;
    if (rating) filter['metadata.rating'] = { $gte: parseFloat(rating) };
    if (free === 'true') filter['pricing.type'] = 'free';

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'metadata.tags': { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = { [sort]: sortOrder };

    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      Course.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Course.countDocuments(filter)
    ]);

    const result = {
      courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };

    await cacheManager.set(cacheKey, result, 600); // 10 minutes cache
    res.json(result);

  } catch (error) {
    logger.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get course by ID
app.get('/api/courses/:id', async (req, res) => {
  try {
    const cacheKey = `course:${req.params.id}`;
    const cachedCourse = await cacheManager.get(cacheKey);
    if (cachedCourse) {
      return res.json(cachedCourse);
    }

    const course = await Course.findOne({
      $or: [{ id: req.params.id }, { _id: req.params.id }]
    }).lean();

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await cacheManager.set(cacheKey, course, 1800); // 30 minutes cache
    res.json(course);

  } catch (error) {
    logger.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// Create new course
app.post('/api/courses', authenticateToken, async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const course = new Course(courseData);
    await course.save();

    // Invalidate courses cache
    await cacheManager.deletePattern('courses:*');

    logger.info(`Course created: ${course.id}`);
    res.status(201).json(course);

  } catch (error) {
    logger.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Update course
app.put('/api/courses/:id', authenticateToken, async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { $or: [{ id: req.params.id }, { _id: req.params.id }] },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Invalidate caches
    await cacheManager.delete(`course:${req.params.id}`);
    await cacheManager.deletePattern('courses:*');

    res.json(course);

  } catch (error) {
    logger.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Enroll in course
app.post('/api/courses/:courseId/enroll', authenticateToken, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.id;

    // Check if course exists
    const course = await Course.findOne({
      $or: [{ id: courseId }, { _id: courseId }]
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if already enrolled
    const existingProgress = await Progress.findOne({ userId, courseId });
    if (existingProgress) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Create progress record
    const progress = new Progress({
      userId,
      courseId,
      status: 'enrolled',
      progress: {
        completedModules: [],
        overallProgress: 0,
        timeSpent: 0,
        lastAccessed: new Date()
      }
    });

    await progress.save();

    // Update course enrollment count
    await Course.findByIdAndUpdate(course._id, {
      $inc: { 'metadata.enrollmentCount': 1 }
    });

    logger.info(`User ${userId} enrolled in course ${courseId}`);
    res.status(201).json({ message: 'Successfully enrolled', progress });

  } catch (error) {
    logger.error('Error enrolling in course:', error);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
});

// Get user progress
app.get('/api/progress/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Verify user can access this data
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const cacheKey = `progress:${userId}`;
    const cachedProgress = await cacheManager.get(cacheKey);
    if (cachedProgress) {
      return res.json(cachedProgress);
    }

    const progressRecords = await Progress.find({ userId }).lean();

    // Enrich with course information
    const enrichedProgress = await Promise.all(
      progressRecords.map(async (progress) => {
        const course = await Course.findOne({
          $or: [{ id: progress.courseId }, { _id: progress.courseId }]
        }).select('title description category level duration metadata.rating').lean();

        return {
          ...progress,
          course
        };
      })
    );

    await cacheManager.set(cacheKey, enrichedProgress, 300); // 5 minutes cache
    res.json(enrichedProgress);

  } catch (error) {
    logger.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Update progress
app.put('/api/progress/:userId/:courseId', authenticateToken, async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    // Verify user can update this data
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const progress = await Progress.findOneAndUpdate(
      { userId, courseId },
      {
        ...req.body,
        'progress.lastAccessed': new Date()
      },
      { new: true }
    );

    if (!progress) {
      return res.status(404).json({ error: 'Progress record not found' });
    }

    // Invalidate cache
    await cacheManager.delete(`progress:${userId}`);

    res.json(progress);

  } catch (error) {
    logger.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Learning Paths Routes

// Get learning paths
app.get('/api/learning-paths', async (req, res) => {
  try {
    const { category, level, search, page = 1, limit = 20 } = req.query;

    const filter = { isPublic: true };

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [paths, total] = await Promise.all([
      LearningPath.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      LearningPath.countDocuments(filter)
    ]);

    res.json({
      paths,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error('Error fetching learning paths:', error);
    res.status(500).json({ error: 'Failed to fetch learning paths' });
  }
});

// Create learning path
app.post('/api/learning-paths', authenticateToken, async (req, res) => {
  try {
    const pathData = {
      ...req.body,
      id: uuidv4(),
      createdBy: req.user.id,
      createdAt: new Date()
    };

    const path = new LearningPath(pathData);
    await path.save();

    logger.info(`Learning path created: ${path.id}`);
    res.status(201).json(path);

  } catch (error) {
    logger.error('Error creating learning path:', error);
    res.status(500).json({ error: 'Failed to create learning path' });
  }
});

// Analytics Routes

// Get course analytics
app.get('/api/analytics/courses/:courseId', authenticateToken, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { period = '30d' } = req.query;

    const cacheKey = `analytics:course:${courseId}:${period}`;
    const cachedAnalytics = await cacheManager.get(cacheKey);
    if (cachedAnalytics) {
      return res.json(cachedAnalytics);
    }

    // Calculate date range
    const days = parseInt(period.replace('d', ''));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [
      enrollmentStats,
      completionStats,
      progressStats
    ] = await Promise.all([
      Progress.aggregate([
        { $match: { courseId, enrollmentDate: { $gte: startDate } } },
        { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$enrollmentDate" } },
          enrollments: { $sum: 1 }
        }},
        { $sort: { _id: 1 } }
      ]),
      Progress.aggregate([
        { $match: { courseId, status: 'completed' } },
        { $group: {
          _id: null,
          totalCompleted: { $sum: 1 },
          avgTimeSpent: { $avg: "$progress.timeSpent" }
        }}
      ]),
      Progress.aggregate([
        { $match: { courseId } },
        { $group: {
          _id: null,
          avgProgress: { $avg: "$progress.overallProgress" },
          totalEnrolled: { $sum: 1 }
        }}
      ])
    ]);

    const analytics = {
      enrollmentTrend: enrollmentStats,
      completion: completionStats[0] || { totalCompleted: 0, avgTimeSpent: 0 },
      progress: progressStats[0] || { avgProgress: 0, totalEnrolled: 0 }
    };

    await cacheManager.set(cacheKey, analytics, 3600); // 1 hour cache
    res.json(analytics);

  } catch (error) {
    logger.error('Error fetching course analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Health check
app.get('/health', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    await redis.ping();

    res.json({
      status: 'healthy',
      service: 'learning-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

// Scheduled tasks
cron.schedule('0 2 * * *', async () => {
  try {
    logger.info('Running daily learning analytics update');

    // Update course ratings and stats
    const courses = await Course.find({ status: 'published' });

    for (const course of courses) {
      const stats = await Progress.aggregate([
        { $match: { courseId: course.id } },
        { $group: {
          _id: null,
          enrollmentCount: { $sum: 1 },
          completionRate: {
            $avg: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
          }
        }}
      ]);

      if (stats[0]) {
        await Course.findByIdAndUpdate(course._id, {
          'metadata.enrollmentCount': stats[0].enrollmentCount,
          'metadata.completionRate': stats[0].completionRate
        });
      }
    }

    logger.info('Daily analytics update completed');
  } catch (error) {
    logger.error('Error in daily analytics update:', error);
  }
});

// Error handling
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Start server
if (require.main === module) {
  optimizer.setupClustering(() => {
    const server = app.listen(PORT, () => {
      logger.info(`Learning Service running on port ${PORT}`);
    });

    optimizer.setupGracefulShutdown(server, async () => {
      await mongoose.connection.close();
      await redis.disconnect();
    });
  });
}

module.exports = app;