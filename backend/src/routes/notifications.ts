import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Get user notifications
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const { page = 1, limit = 20, unread = false } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { userId };
    if (unread === 'true') {
      where.read = false;
    }

    // Mock notifications data - in a real app, you'd have a notifications table
    const notifications = [
      {
        id: '1',
        type: 'session_booked',
        title: 'New Session Booked',
        message: 'John Doe has booked a session with you for JavaScript',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        data: {
          sessionId: 'session_1',
          userId: 'user_123',
          skill: 'JavaScript'
        }
      },
      {
        id: '2',
        type: 'session_reminder',
        title: 'Session Reminder',
        message: 'Your Python session starts in 15 minutes',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        data: {
          sessionId: 'session_2',
          skill: 'Python'
        }
      },
      {
        id: '3',
        type: 'review_received',
        title: 'New Review',
        message: 'You received a 5-star review for your React session',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        data: {
          reviewId: 'review_1',
          rating: 5,
          skill: 'React'
        }
      },
      {
        id: '4',
        type: 'message_received',
        title: 'New Message',
        message: 'Sarah sent you a message',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        data: {
          conversationId: 'conv_1',
          senderId: 'user_456',
          senderName: 'Sarah'
        }
      }
    ];

    // Filter based on read status
    const filteredNotifications = unread === 'true'
      ? notifications.filter(n => !n.read)
      : notifications;

    // Apply pagination
    const paginatedNotifications = filteredNotifications.slice(skip, skip + Number(limit));

    res.json({
      success: true,
      data: {
        notifications: paginatedNotifications,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: filteredNotifications.length,
          pages: Math.ceil(filteredNotifications.length / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Mark notification as read
router.put('/:id/read', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    // In a real app, you'd update the notification in the database
    // await prisma.notification.update({
    //   where: { id, userId },
    //   data: { read: true }
    // });

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    next(error);
  }
});

// Mark all notifications as read
router.put('/mark-all-read', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;

    // In a real app, you'd update all notifications in the database
    // await prisma.notification.updateMany({
    //   where: { userId, read: false },
    //   data: { read: true }
    // });

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
});

// Delete notification
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    // In a real app, you'd delete the notification from the database
    // await prisma.notification.delete({
    //   where: { id, userId }
    // });

    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    next(error);
  }
});

// Get notification stats
router.get('/stats', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;

    // In a real app, you'd query the database for actual stats
    const stats = {
      total: 4,
      unread: 2,
      byType: {
        session_booked: 1,
        session_reminder: 1,
        review_received: 1,
        message_received: 1
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

export default router;