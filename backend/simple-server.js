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

app.listen(port, () => {
  console.log(`🚀 Backend server running at http://localhost:${port}`);
  console.log(`📋 Health check: http://localhost:${port}/health`);
});