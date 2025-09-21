const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const admin = require('firebase-admin');
const webpush = require('web-push');
const Bull = require('bull');
const handlebars = require('handlebars');
const moment = require('moment');
const AWS = require('aws-sdk');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const Redis = require('ioredis');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;

const logger = require('../../shared/logger');
const PerformanceOptimizer = require('../../shared/performance/PerformanceOptimizer');
const CacheManager = require('../../shared/cache/CacheManager');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3006;

// Performance optimization
const optimizer = new PerformanceOptimizer({
  clustering: false, // Disable clustering for WebSocket service
  compression: true,
  caching: true
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skill_circle_notifications', {
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

// Bull Queue for notification processing
const notificationQueue = new Bull('notification processing', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
  }
});

// Email transporter
const emailTransporter = nodemailer.createTransporter({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Twilio client
const twilioClient = process.env.TWILIO_ACCOUNT_SID ?
  twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN) : null;

// Firebase Admin SDK
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  });
}

// Web Push configuration
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:notifications@skillcircle.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// AWS SES for email delivery
const ses = new AWS.SES({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

// Notification Schema
const NotificationSchema = new mongoose.Schema({
  id: { type: String, unique: true, default: uuidv4 },

  // Recipients
  recipients: {
    userIds: [String],
    roles: [String],
    groups: [String],
    all: { type: Boolean, default: false }
  },

  // Content
  title: { type: String, required: true },
  message: { type: String, required: true },

  // Rich content
  content: {
    html: String,
    attachments: [{
      filename: String,
      url: String,
      contentType: String
    }],
    actions: [{
      label: String,
      url: String,
      style: String // 'primary', 'secondary', 'danger'
    }]
  },

  // Notification type and category
  type: {
    type: String,
    enum: [
      'course_enrollment', 'assignment_due', 'achievement_unlocked',
      'friend_request', 'course_completion', 'reminder', 'announcement',
      'system_update', 'security_alert', 'payment_receipt', 'feedback_request'
    ],
    required: true
  },

  category: {
    type: String,
    enum: ['educational', 'social', 'system', 'marketing', 'security'],
    required: true
  },

  // Priority and urgency
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },

  // Delivery channels
  channels: {
    inApp: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: false },
    webhook: { type: Boolean, default: false }
  },

  // Scheduling
  scheduling: {
    sendAt: Date,
    timezone: String,
    recurring: {
      enabled: { type: Boolean, default: false },
      pattern: String, // 'daily', 'weekly', 'monthly'
      endDate: Date
    }
  },

  // Targeting and personalization
  targeting: {
    conditions: [{
      field: String, // 'user.role', 'user.courseProgress', etc.
      operator: String, // 'equals', 'contains', 'greaterThan', etc.
      value: mongoose.Schema.Types.Mixed
    }],
    segmentIds: [String],
    exclude: {
      userIds: [String],
      conditions: [mongoose.Schema.Types.Mixed]
    }
  },

  // Template and personalization
  template: {
    id: String,
    variables: mongoose.Schema.Types.Mixed
  },

  // Delivery status
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sending', 'sent', 'failed', 'cancelled'],
    default: 'draft'
  },

  // Delivery tracking
  delivery: {
    totalRecipients: { type: Number, default: 0 },
    successful: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
    pending: { type: Number, default: 0 },

    // Channel-specific delivery stats
    channels: {
      inApp: { sent: Number, delivered: Number, read: Number },
      email: { sent: Number, delivered: Number, opened: Number, clicked: Number, bounced: Number },
      sms: { sent: Number, delivered: Number, failed: Number },
      push: { sent: Number, delivered: Number, opened: Number }
    }
  },

  // Analytics
  analytics: {
    openRate: Number,
    clickRate: Number,
    responseRate: Number,
    engagementScore: Number
  },

  // Metadata
  metadata: {
    sourceService: String,
    correlationId: String,
    tags: [String],
    customData: mongoose.Schema.Types.Mixed
  },

  // Ownership and tracking
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  sentAt: Date
});

NotificationSchema.index({ 'recipients.userIds': 1 });
NotificationSchema.index({ type: 1, category: 1 });
NotificationSchema.index({ status: 1, 'scheduling.sendAt': 1 });
NotificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model('Notification', NotificationSchema);

// User Notification Preferences Schema
const PreferenceSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },

  // Channel preferences
  channels: {
    inApp: { enabled: { type: Boolean, default: true } },
    email: {
      enabled: { type: Boolean, default: true },
      frequency: { type: String, enum: ['immediate', 'daily', 'weekly'], default: 'immediate' }
    },
    sms: { enabled: { type: Boolean, default: false } },
    push: { enabled: { type: Boolean, default: true } }
  },

  // Category preferences
  categories: {
    educational: { enabled: { type: Boolean, default: true } },
    social: { enabled: { type: Boolean, default: true } },
    system: { enabled: { type: Boolean, default: true } },
    marketing: { enabled: { type: Boolean, default: false } },
    security: { enabled: { type: Boolean, default: true } }
  },

  // Type-specific preferences
  types: {
    course_enrollment: { enabled: { type: Boolean, default: true } },
    assignment_due: { enabled: { type: Boolean, default: true } },
    achievement_unlocked: { enabled: { type: Boolean, default: true } },
    friend_request: { enabled: { type: Boolean, default: true } },
    course_completion: { enabled: { type: Boolean, default: true } },
    reminder: { enabled: { type: Boolean, default: true } },
    announcement: { enabled: { type: Boolean, default: true } },
    system_update: { enabled: { type: Boolean, default: false } },
    security_alert: { enabled: { type: Boolean, default: true } },
    payment_receipt: { enabled: { type: Boolean, default: true } },
    feedback_request: { enabled: { type: Boolean, default: true } }
  },

  // Quiet hours
  quietHours: {
    enabled: { type: Boolean, default: false },
    start: String, // '22:00'
    end: String,   // '08:00'
    timezone: String
  },

  // Device tokens for push notifications
  devices: [{
    token: String,
    platform: { type: String, enum: ['ios', 'android', 'web'] },
    lastUsed: Date,
    active: { type: Boolean, default: true }
  }],

  updatedAt: { type: Date, default: Date.now }
});

const Preference = mongoose.model('Preference', PreferenceSchema);

// Notification Template Schema
const TemplateSchema = new mongoose.Schema({
  id: { type: String, unique: true, default: uuidv4 },
  name: { type: String, required: true },
  description: String,

  // Template content
  content: {
    subject: String,
    title: String,
    message: String,
    html: String,
    sms: String
  },

  // Variables for personalization
  variables: [{
    name: String,
    type: String, // 'string', 'number', 'date', 'boolean'
    required: { type: Boolean, default: false },
    defaultValue: String,
    description: String
  }],

  type: String,
  category: String,
  language: { type: String, default: 'en' },

  isActive: { type: Boolean, default: true },
  version: { type: Number, default: 1 },

  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Template = mongoose.model('Template', TemplateSchema);

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

  jwt.verify(token, process.env.JWT_SECRET || 'notification-secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Notification Delivery Functions

// Send in-app notification
async function sendInAppNotification(notification, userIds) {
  const deliveryResults = { sent: 0, delivered: 0 };

  for (const userId of userIds) {
    try {
      // Send via WebSocket if user is connected
      const socketId = await redis.get(`user:${userId}:socket`);
      if (socketId) {
        io.to(socketId).emit('notification', {
          id: notification.id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          priority: notification.priority,
          createdAt: notification.createdAt
        });
        deliveryResults.delivered++;
      }
      deliveryResults.sent++;
    } catch (error) {
      logger.error(`Error sending in-app notification to user ${userId}:`, error);
    }
  }

  return deliveryResults;
}

// Send email notification
async function sendEmailNotification(notification, userIds) {
  const deliveryResults = { sent: 0, delivered: 0, bounced: 0 };

  // Get user email addresses (this would typically come from user service)
  // For now, we'll simulate this
  const userEmails = userIds.map(id => `user${id}@example.com`);

  for (const email of userEmails) {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'notifications@skillcircle.com',
        to: email,
        subject: notification.title,
        text: notification.message,
        html: notification.content?.html || `<p>${notification.message}</p>`
      };

      if (process.env.USE_SES === 'true') {
        // Use AWS SES
        await ses.sendEmail({
          Source: mailOptions.from,
          Destination: { ToAddresses: [email] },
          Message: {
            Subject: { Data: mailOptions.subject },
            Body: {
              Text: { Data: mailOptions.text },
              Html: { Data: mailOptions.html }
            }
          }
        }).promise();
      } else {
        // Use Nodemailer
        await emailTransporter.sendMail(mailOptions);
      }

      deliveryResults.sent++;
      deliveryResults.delivered++;
    } catch (error) {
      logger.error(`Error sending email to ${email}:`, error);
      if (error.code === 'EENVELOPE' || error.responseCode === 550) {
        deliveryResults.bounced++;
      }
    }
  }

  return deliveryResults;
}

// Send SMS notification
async function sendSMSNotification(notification, userIds) {
  const deliveryResults = { sent: 0, delivered: 0, failed: 0 };

  if (!twilioClient) {
    logger.warn('Twilio not configured, skipping SMS notifications');
    return deliveryResults;
  }

  // Get user phone numbers (this would typically come from user service)
  const userPhones = userIds.map(id => `+1555000${id.slice(-4)}`);

  for (const phone of userPhones) {
    try {
      await twilioClient.messages.create({
        body: notification.message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      });

      deliveryResults.sent++;
      deliveryResults.delivered++;
    } catch (error) {
      logger.error(`Error sending SMS to ${phone}:`, error);
      deliveryResults.failed++;
    }
  }

  return deliveryResults;
}

// Send push notification
async function sendPushNotification(notification, userIds) {
  const deliveryResults = { sent: 0, delivered: 0 };

  for (const userId of userIds) {
    try {
      const preferences = await Preference.findOne({ userId });
      if (!preferences?.devices?.length) continue;

      const activeDevices = preferences.devices.filter(device => device.active);

      for (const device of activeDevices) {
        try {
          if (device.platform === 'web' && process.env.VAPID_PUBLIC_KEY) {
            // Web push
            const payload = JSON.stringify({
              title: notification.title,
              body: notification.message,
              icon: '/icon-192x192.png',
              badge: '/badge-72x72.png',
              data: {
                notificationId: notification.id,
                type: notification.type
              }
            });

            await webpush.sendNotification({
              endpoint: device.token,
              keys: device.keys
            }, payload);

          } else if ((device.platform === 'ios' || device.platform === 'android') && admin.messaging) {
            // Firebase push
            await admin.messaging().send({
              token: device.token,
              notification: {
                title: notification.title,
                body: notification.message
              },
              data: {
                notificationId: notification.id,
                type: notification.type
              }
            });
          }

          deliveryResults.delivered++;
        } catch (error) {
          logger.error(`Error sending push to device ${device.token}:`, error);
        }

        deliveryResults.sent++;
      }
    } catch (error) {
      logger.error(`Error sending push notification to user ${userId}:`, error);
    }
  }

  return deliveryResults;
}

// Process notification queue
notificationQueue.process(async (job) => {
  const { notificationId } = job.data;

  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new Error('Notification not found');
    }

    // Update status to sending
    await Notification.findByIdAndUpdate(notificationId, {
      status: 'sending',
      sentAt: new Date()
    });

    // Get recipient user IDs (this would typically involve querying user service)
    let userIds = notification.recipients.userIds || [];

    // Handle role-based recipients
    if (notification.recipients.roles?.length) {
      // Query user service for users with these roles
      // userIds = userIds.concat(await getUsersByRoles(notification.recipients.roles));
    }

    // Handle group-based recipients
    if (notification.recipients.groups?.length) {
      // Query user service for users in these groups
      // userIds = userIds.concat(await getUsersByGroups(notification.recipients.groups));
    }

    // Filter users based on preferences
    const filteredUserIds = await filterUsersByPreferences(userIds, notification);

    const deliveryResults = {
      inApp: { sent: 0, delivered: 0 },
      email: { sent: 0, delivered: 0, bounced: 0 },
      sms: { sent: 0, delivered: 0, failed: 0 },
      push: { sent: 0, delivered: 0 }
    };

    // Send through each enabled channel
    if (notification.channels.inApp) {
      deliveryResults.inApp = await sendInAppNotification(notification, filteredUserIds);
    }

    if (notification.channels.email) {
      deliveryResults.email = await sendEmailNotification(notification, filteredUserIds);
    }

    if (notification.channels.sms) {
      deliveryResults.sms = await sendSMSNotification(notification, filteredUserIds);
    }

    if (notification.channels.push) {
      deliveryResults.push = await sendPushNotification(notification, filteredUserIds);
    }

    // Update notification with delivery results
    await Notification.findByIdAndUpdate(notificationId, {
      status: 'sent',
      'delivery.totalRecipients': filteredUserIds.length,
      'delivery.successful': Object.values(deliveryResults).reduce((sum, channel) =>
        sum + (channel.delivered || channel.sent), 0),
      'delivery.channels': deliveryResults
    });

    logger.info(`Notification ${notificationId} sent successfully`);

  } catch (error) {
    logger.error(`Error processing notification ${notificationId}:`, error);

    await Notification.findByIdAndUpdate(notificationId, {
      status: 'failed'
    });

    throw error;
  }
});

// Filter users based on notification preferences
async function filterUsersByPreferences(userIds, notification) {
  const filteredIds = [];

  for (const userId of userIds) {
    try {
      const preferences = await Preference.findOne({ userId });

      if (!preferences) {
        // No preferences set, allow all notifications
        filteredIds.push(userId);
        continue;
      }

      // Check category preference
      if (!preferences.categories[notification.category]?.enabled) {
        continue;
      }

      // Check type preference
      if (!preferences.types[notification.type]?.enabled) {
        continue;
      }

      // Check quiet hours
      if (preferences.quietHours?.enabled) {
        const now = moment().tz(preferences.quietHours.timezone || 'UTC');
        const start = moment(preferences.quietHours.start, 'HH:mm');
        const end = moment(preferences.quietHours.end, 'HH:mm');

        if (now.isBetween(start, end) && notification.priority !== 'urgent') {
          continue;
        }
      }

      filteredIds.push(userId);
    } catch (error) {
      logger.error(`Error checking preferences for user ${userId}:`, error);
      // Include user if preference check fails
      filteredIds.push(userId);
    }
  }

  return filteredIds;
}

// API Routes

// Send notification
app.post('/api/notifications/send', authenticateToken, async (req, res) => {
  try {
    const notificationData = {
      ...req.body,
      id: uuidv4(),
      createdBy: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const notification = new Notification(notificationData);
    await notification.save();

    // Add to processing queue
    if (notification.scheduling?.sendAt && moment(notification.scheduling.sendAt).isAfter()) {
      // Schedule for later
      await notificationQueue.add(
        { notificationId: notification._id },
        { delay: moment(notification.scheduling.sendAt).diff(moment()) }
      );
      notification.status = 'scheduled';
    } else {
      // Send immediately
      await notificationQueue.add({ notificationId: notification._id });
    }

    await notification.save();

    res.status(201).json({
      id: notification.id,
      status: notification.status,
      message: 'Notification queued for delivery'
    });

  } catch (error) {
    logger.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Get user notifications
app.get('/api/notifications/user/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const { page = 1, limit = 20, unread = false } = req.query;

    // Verify user can access these notifications
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const filter = {
      'recipients.userIds': userId,
      status: 'sent'
    };

    if (unread === 'true') {
      filter.read = { $ne: true };
    }

    const skip = (page - 1) * limit;

    const notifications = await Notification.find(filter)
      .select('id title message type priority createdAt read')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    res.json({ notifications });

  } catch (error) {
    logger.error('Error fetching user notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Update user notification preferences
app.put('/api/preferences/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Verify user can update these preferences
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const preferences = await Preference.findOneAndUpdate(
      { userId },
      { ...req.body, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    res.json(preferences);

  } catch (error) {
    logger.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Register device for push notifications
app.post('/api/devices/register', authenticateToken, async (req, res) => {
  try {
    const { token, platform, keys } = req.body;
    const userId = req.user.id;

    const preferences = await Preference.findOneAndUpdate(
      { userId },
      {
        $addToSet: {
          devices: {
            token,
            platform,
            keys,
            lastUsed: new Date(),
            active: true
          }
        },
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    );

    res.json({ message: 'Device registered successfully' });

  } catch (error) {
    logger.error('Error registering device:', error);
    res.status(500).json({ error: 'Failed to register device' });
  }
});

// WebSocket connections for real-time notifications
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('authenticate', async (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'notification-secret');
      socket.userId = decoded.id;

      // Store socket ID for user
      await redis.set(`user:${decoded.id}:socket`, socket.id, 'EX', 3600);

      logger.info(`User ${decoded.id} authenticated on socket ${socket.id}`);
    } catch (error) {
      logger.error('Socket authentication failed:', error);
      socket.disconnect();
    }
  });

  socket.on('mark-read', async (notificationId) => {
    if (!socket.userId) return;

    try {
      await Notification.findOneAndUpdate(
        { id: notificationId, 'recipients.userIds': socket.userId },
        { read: true, readAt: new Date() }
      );
    } catch (error) {
      logger.error('Error marking notification as read:', error);
    }
  });

  socket.on('disconnect', async () => {
    if (socket.userId) {
      await redis.del(`user:${socket.userId}:socket`);
    }
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Health check
app.get('/health', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    await redis.ping();

    res.json({
      status: 'healthy',
      service: 'notification-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      queue: {
        waiting: await notificationQueue.waiting(),
        active: await notificationQueue.active(),
        completed: await notificationQueue.completed(),
        failed: await notificationQueue.failed()
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
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
  server.listen(PORT, () => {
    logger.info(`Notification Service running on port ${PORT}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
      mongoose.connection.close();
      redis.disconnect();
      notificationQueue.close();
      process.exit(0);
    });
  });
}

module.exports = { app, server };