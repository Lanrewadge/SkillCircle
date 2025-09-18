const express = require('express');
const cors = require('cors');
const app = express();
const port = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

// Mock API endpoints for the frontend
app.get('/api/auth/me', (req, res) => {
  res.json({
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    isTeacher: true,
    isLearner: true
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  res.json({
    success: true,
    user: {
      id: '1',
      name: 'Test User',
      email,
      isTeacher: true,
      isLearner: true
    },
    token: 'mock-jwt-token'
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, userType, city, country } = req.body;
  res.json({
    success: true,
    user: {
      id: '1',
      name,
      email,
      isTeacher: userType === 'tutor' || userType === 'both',
      isLearner: userType === 'learner' || userType === 'both',
      city,
      country
    },
    token: 'mock-jwt-token'
  });
});

app.get('/api/skills', (req, res) => {
  res.json([
    {
      id: '1',
      name: 'JavaScript Programming',
      category: 'Technology',
      description: 'Learn modern JavaScript programming',
      averageHourlyRate: { min: 30, max: 80, currency: 'USD' }
    },
    {
      id: '2',
      name: 'Guitar Playing',
      category: 'Music',
      description: 'Learn to play guitar from basics to advanced',
      averageHourlyRate: { min: 25, max: 60, currency: 'USD' }
    }
  ]);
});

app.get('/api/teachers', (req, res) => {
  res.json([
    {
      id: '1',
      name: 'John Doe',
      skills: ['JavaScript Programming'],
      rating: 4.8,
      hourlyRate: 50,
      location: 'New York, NY'
    },
    {
      id: '2',
      name: 'Jane Smith',
      skills: ['Guitar Playing'],
      rating: 4.9,
      hourlyRate: 40,
      location: 'Los Angeles, CA'
    }
  ]);
});

// Messaging endpoints
app.get('/api/messages/conversations', (req, res) => {
  res.json([
    {
      id: '1',
      participants: [
        { user: { id: '1', name: 'You', avatar: '👤' } },
        { user: { id: '2', name: 'Sarah Johnson', avatar: '👩‍🏫' } }
      ],
      lastMessage: {
        id: '1',
        content: "Great! I've prepared some exercises for our session tomorrow.",
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        senderId: '2'
      },
      unreadCount: 2
    },
    {
      id: '2',
      participants: [
        { user: { id: '1', name: 'You', avatar: '👤' } },
        { user: { id: '3', name: 'Michael Chen', avatar: '👨‍💻' } }
      ],
      lastMessage: {
        id: '2',
        content: "Thanks for the great session! The pandas tutorial was very helpful.",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        senderId: '1'
      },
      unreadCount: 0
    }
  ]);
});

app.get('/api/messages/:conversationId', (req, res) => {
  const { conversationId } = req.params;
  const messages = {
    '1': [
      {
        id: '1',
        senderId: '1',
        content: "Hi Sarah! I'm excited about our JavaScript session tomorrow. What should I prepare?",
        createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        senderId: '2',
        content: "Hi! Great to hear you're excited. I recommend reviewing basic ES6 features like arrow functions and destructuring.",
        createdAt: new Date(Date.now() - 50 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        senderId: '2',
        content: "Great! I've prepared some exercises for our session tomorrow.",
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
      }
    ],
    '2': [
      {
        id: '4',
        senderId: '3',
        content: "Thank you for the session today!",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        senderId: '1',
        content: "Thanks for the great session! The pandas tutorial was very helpful.",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ]
  };

  res.json(messages[conversationId] || []);
});

app.post('/api/messages', (req, res) => {
  const { conversationId, content } = req.body;
  const newMessage = {
    id: Date.now().toString(),
    senderId: '1',
    content,
    createdAt: new Date().toISOString()
  };

  res.json({ success: true, message: newMessage });
});

// Analytics endpoints
app.get('/api/analytics/overview', (req, res) => {
  res.json({
    totalSessions: 69,
    hoursLearned: 103.5,
    averageRating: 4.8,
    skillsMastered: 3,
    monthlyGrowth: {
      sessions: 12,
      hours: 8,
      rating: 0.2,
      skills: 1
    }
  });
});

app.get('/api/analytics/performance', (req, res) => {
  res.json([
    {
      skill: 'JavaScript',
      sessionsCompleted: 24,
      averageRating: 4.8,
      totalEarnings: 1200,
      hoursSpent: 36,
      improvementRate: 15,
      progressPercentage: 85
    },
    {
      skill: 'Python',
      sessionsCompleted: 18,
      averageRating: 4.6,
      totalEarnings: 900,
      hoursSpent: 27,
      improvementRate: 12,
      progressPercentage: 72
    },
    {
      skill: 'React',
      sessionsCompleted: 15,
      averageRating: 4.9,
      totalEarnings: 750,
      hoursSpent: 22.5,
      improvementRate: 18,
      progressPercentage: 68
    }
  ]);
});

app.get('/api/analytics/goals', (req, res) => {
  res.json([
    {
      id: '1',
      title: 'Complete 30 Sessions This Month',
      current: 25,
      target: 30,
      category: 'Learning',
      status: 'on-track',
      deadline: '2025-09-30'
    },
    {
      id: '2',
      title: 'Earn $1500 in Revenue',
      current: 1250,
      target: 1500,
      category: 'Financial',
      status: 'on-track',
      deadline: '2025-09-30'
    },
    {
      id: '3',
      title: 'Maintain 4.8+ Rating',
      current: 4.8,
      target: 4.8,
      category: 'Quality',
      status: 'achieved',
      deadline: '2025-09-30'
    }
  ]);
});

// Notification endpoints
app.get('/api/notifications', (req, res) => {
  res.json([
    {
      id: '1',
      type: 'message',
      title: 'New message from Sarah Chen',
      body: 'Hi! I see you\'re interested in learning Italian cooking. I\'d love to help you get started!',
      read: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      avatar: '/avatars/sarah.jpg',
      actionUrl: '/dashboard/messages'
    },
    {
      id: '2',
      type: 'session',
      title: 'Session reminder',
      body: 'Your React Development session with Alex Rodriguez starts in 1 hour',
      read: false,
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      avatar: '/avatars/alex.jpg',
      actionUrl: '/dashboard/sessions'
    },
    {
      id: '3',
      type: 'match',
      title: 'New teacher match found!',
      body: 'Maria Gonzalez is available to teach Spanish Language in your area',
      read: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      avatar: '/avatars/maria.jpg',
      actionUrl: '/dashboard/skills/browse'
    },
    {
      id: '4',
      type: 'review',
      title: 'New review received',
      body: 'James Thompson left you a 5-star review for your Guitar lesson!',
      read: true,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      avatar: '/avatars/james.jpg',
      actionUrl: '/dashboard/profile'
    },
    {
      id: '5',
      type: 'payment',
      title: 'Payment received',
      body: 'You received $85.00 for your React Development session',
      read: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      actionUrl: '/dashboard/earnings'
    },
    {
      id: '6',
      type: 'reminder',
      title: 'Complete your profile',
      body: 'Add more skills to your profile to get better matches!',
      read: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      actionUrl: '/dashboard/profile'
    },
    {
      id: '7',
      type: 'session',
      title: 'Session completed',
      body: 'Your Italian Cooking session with Sarah Chen has been marked as completed',
      read: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      avatar: '/avatars/sarah.jpg',
      actionUrl: '/dashboard/sessions'
    }
  ]);
});

app.put('/api/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  res.json({ success: true, message: `Notification ${id} marked as read` });
});

app.put('/api/notifications/mark-all-read', (req, res) => {
  res.json({ success: true, message: 'All notifications marked as read' });
});

app.delete('/api/notifications/:id', (req, res) => {
  const { id } = req.params;
  res.json({ success: true, message: `Notification ${id} deleted` });
});

app.get('/api/notifications/stats', (req, res) => {
  res.json({
    total: 7,
    unread: 3,
    highPriority: 1,
    thisWeek: 5
  });
});

app.listen(port, () => {
  console.log(`🚀 Backend server running at http://localhost:${port}`);
  console.log(`📋 Health check: http://localhost:${port}/health`);
});