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

// User profile endpoints
app.get('/api/profile', (req, res) => {
  res.json({
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Experienced software developer with 8+ years in React and Node.js. Passionate about teaching and helping others grow their coding skills.',
    avatar: '/avatars/alice.jpg',
    city: 'San Francisco',
    country: 'United States',
    website: 'https://alicejohnson.dev',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/alicejohnson',
      github: 'https://github.com/alicejohnson',
      twitter: 'https://twitter.com/alicejohnson',
      youtube: 'https://youtube.com/c/alicejohnson'
    },
    isTeacher: true,
    isLearner: false,
    verified: true,
    joinDate: '2023-01-15',
    stats: {
      totalStudents: 42,
      totalSessions: 156,
      totalEarnings: 8540,
      avgRating: 4.8,
      completionRate: 98
    },
    settings: {
      privacy: {
        profileVisible: true,
        showEmail: false,
        showPhone: false,
        allowMessages: true,
        showStats: true
      },
      notifications: {
        email: true,
        sms: false,
        push: true,
        marketing: false
      }
    }
  });
});

app.put('/api/profile', (req, res) => {
  const { name, bio, city, country, email, phone, website, socialLinks } = req.body;
  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      name,
      bio,
      city,
      country,
      email,
      phone,
      website,
      socialLinks
    }
  });
});

app.post('/api/profile/avatar', (req, res) => {
  res.json({
    success: true,
    message: 'Avatar updated successfully',
    avatarUrl: '/avatars/updated-avatar.jpg'
  });
});

app.put('/api/profile/privacy', (req, res) => {
  const { privacy } = req.body;
  res.json({
    success: true,
    message: 'Privacy settings updated successfully',
    privacy
  });
});

app.put('/api/profile/notifications', (req, res) => {
  const { notifications } = req.body;
  res.json({
    success: true,
    message: 'Notification preferences updated successfully',
    notifications
  });
});

app.get('/api/profile/activity', (req, res) => {
  res.json([
    {
      id: '1',
      type: 'profile_update',
      title: 'Profile updated',
      description: 'Updated bio and contact information',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      type: 'skill_added',
      title: 'New skill added',
      description: 'Added React Development to your skills',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      type: 'review_received',
      title: 'Received 5-star review',
      description: 'New review from John Smith for Python tutorial',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);
});

app.get('/api/profile/skills', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'React Development',
      level: 'Expert',
      students: 24,
      rating: 4.8,
      hourlyRate: 75,
      category: 'Technology',
      description: 'Modern React development including hooks, context, and state management'
    },
    {
      id: 2,
      name: 'Python Programming',
      level: 'Advanced',
      students: 18,
      rating: 4.7,
      hourlyRate: 65,
      category: 'Technology',
      description: 'Python programming for beginners to advanced, including web development and data analysis'
    },
    {
      id: 3,
      name: 'JavaScript Fundamentals',
      level: 'Expert',
      students: 35,
      rating: 4.9,
      hourlyRate: 70,
      category: 'Technology',
      description: 'Core JavaScript concepts, ES6+, async programming, and modern development practices'
    }
  ]);
});

app.post('/api/profile/skills', (req, res) => {
  const { name, level, hourlyRate, category, description } = req.body;
  res.json({
    success: true,
    message: 'Skill added successfully',
    skill: {
      id: Date.now(),
      name,
      level,
      hourlyRate,
      category,
      description,
      students: 0,
      rating: 0
    }
  });
});

app.put('/api/profile/skills/:id', (req, res) => {
  const { id } = req.params;
  const { name, level, hourlyRate, category, description } = req.body;
  res.json({
    success: true,
    message: `Skill ${id} updated successfully`,
    skill: {
      id,
      name,
      level,
      hourlyRate,
      category,
      description
    }
  });
});

app.delete('/api/profile/skills/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    success: true,
    message: `Skill ${id} deleted successfully`
  });
});

app.get('/api/profile/reviews', (req, res) => {
  res.json([
    {
      id: 1,
      rating: 5,
      comment: 'Alice is an amazing React teacher! She explains complex concepts clearly and is very patient.',
      student: 'John Smith',
      studentAvatar: '/avatars/john.jpg',
      date: '2024-01-15',
      skill: 'React Development',
      sessionDuration: 90
    },
    {
      id: 2,
      rating: 5,
      comment: 'Great Python lessons. Very knowledgeable and provides excellent real-world examples.',
      student: 'Sarah Johnson',
      studentAvatar: '/avatars/sarah.jpg',
      date: '2024-01-10',
      skill: 'Python Programming',
      sessionDuration: 60
    },
    {
      id: 3,
      rating: 4,
      comment: 'Learned a lot about advanced JavaScript patterns. Highly recommend!',
      student: 'Mike Davis',
      studentAvatar: '/avatars/mike.jpg',
      date: '2024-01-05',
      skill: 'JavaScript Fundamentals',
      sessionDuration: 75
    },
    {
      id: 4,
      rating: 5,
      comment: 'Fantastic teacher! Made React hooks easy to understand.',
      student: 'Emily Chen',
      studentAvatar: '/avatars/emily.jpg',
      date: '2023-12-28',
      skill: 'React Development',
      sessionDuration: 120
    }
  ]);
});

// Learning path endpoints
app.get('/api/learning/paths', (req, res) => {
  res.json([
    {
      id: '1',
      title: 'Complete React Development',
      description: 'Master React from basics to advanced concepts including hooks, context, and state management.',
      category: 'Web Development',
      difficulty: 'Intermediate',
      duration: '8 weeks',
      progress: 65,
      totalModules: 12,
      completedModules: 8,
      instructor: {
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah.jpg',
        rating: 4.9
      },
      skills: ['React', 'JavaScript', 'JSX', 'Hooks', 'State Management'],
      nextSession: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      estimatedCompletion: '3 weeks',
      certificate: true,
      enrolled: true
    },
    {
      id: '2',
      title: 'Python for Data Science',
      description: 'Learn Python programming with focus on data analysis, visualization, and machine learning.',
      category: 'Data Science',
      difficulty: 'Beginner',
      duration: '10 weeks',
      progress: 30,
      totalModules: 15,
      completedModules: 4,
      instructor: {
        name: 'Michael Chen',
        avatar: '/avatars/michael.jpg',
        rating: 4.8
      },
      skills: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn'],
      nextSession: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedCompletion: '7 weeks',
      certificate: true,
      enrolled: true
    },
    {
      id: '3',
      title: 'Full Stack JavaScript',
      description: 'Complete full-stack development with Node.js, Express, MongoDB, and React.',
      category: 'Full Stack',
      difficulty: 'Advanced',
      duration: '12 weeks',
      progress: 0,
      totalModules: 18,
      completedModules: 0,
      instructor: {
        name: 'Alex Rodriguez',
        avatar: '/avatars/alex.jpg',
        rating: 4.7
      },
      skills: ['Node.js', 'Express', 'MongoDB', 'React', 'JavaScript'],
      estimatedCompletion: '12 weeks',
      certificate: true,
      enrolled: false
    }
  ]);
});

app.get('/api/learning/modules/current', (req, res) => {
  res.json([
    {
      id: '1',
      title: 'React Hooks Deep Dive',
      type: 'video',
      duration: 45,
      completed: false,
      progress: 60,
      resources: 3
    },
    {
      id: '2',
      title: 'State Management with Context',
      type: 'live-session',
      duration: 90,
      completed: false,
      progress: 0,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      resources: 5
    },
    {
      id: '3',
      title: 'Building a Todo App',
      type: 'project',
      duration: 120,
      completed: true,
      progress: 100,
      resources: 8
    },
    {
      id: '4',
      title: 'React Performance Quiz',
      type: 'quiz',
      duration: 15,
      completed: true,
      progress: 100,
      resources: 1
    }
  ]);
});

app.get('/api/learning/achievements', (req, res) => {
  res.json([
    {
      id: '1',
      title: 'First Steps',
      description: 'Completed your first learning module',
      icon: '🎯',
      unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      points: 50,
      category: 'Progress'
    },
    {
      id: '2',
      title: 'Speed Learner',
      description: 'Completed 5 modules in one week',
      icon: '⚡',
      unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      points: 100,
      category: 'Speed'
    },
    {
      id: '3',
      title: 'Quiz Master',
      description: 'Scored 100% on 10 quizzes',
      icon: '🧠',
      unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      points: 200,
      category: 'Knowledge'
    },
    {
      id: '4',
      title: 'Consistency King',
      description: 'Maintained a 30-day learning streak',
      icon: '👑',
      unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      points: 300,
      category: 'Consistency'
    }
  ]);
});

app.get('/api/learning/stats', (req, res) => {
  res.json({
    learningStreak: {
      current: 12,
      longest: 45,
      unit: 'days'
    },
    hoursThisWeek: 8.5,
    hoursThisMonth: 24.3,
    modulesCompleted: 24,
    achievementPoints: 1250,
    skillsLearning: 5,
    certificatesEarned: 2,
    nextMilestone: {
      type: 'streak',
      target: 30,
      current: 12,
      reward: '🏆 Consistency Master Badge'
    }
  });
});

app.post('/api/learning/paths/:id/enroll', (req, res) => {
  const { id } = req.params;
  res.json({
    success: true,
    message: `Successfully enrolled in learning path ${id}`,
    enrollmentId: `enroll_${id}_${Date.now()}`
  });
});

app.put('/api/learning/modules/:id/progress', (req, res) => {
  const { id } = req.params;
  const { progress } = req.body;
  res.json({
    success: true,
    message: `Progress updated for module ${id}`,
    progress,
    completed: progress >= 100
  });
});

app.post('/api/learning/modules/:id/complete', (req, res) => {
  const { id } = req.params;
  res.json({
    success: true,
    message: `Module ${id} marked as completed`,
    pointsEarned: 25,
    newAchievements: []
  });
});

app.get('/api/learning/progress/:pathId', (req, res) => {
  const { pathId } = req.params;
  res.json({
    pathId,
    overallProgress: 65,
    totalModules: 12,
    completedModules: 8,
    currentModule: {
      id: '1',
      title: 'React Hooks Deep Dive',
      progress: 60
    },
    timeSpent: 450, // minutes
    estimatedTimeRemaining: 180, // minutes
    nextSession: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    recentActivity: [
      {
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        action: 'Completed module: React Performance Quiz',
        points: 25
      },
      {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        action: 'Started module: React Hooks Deep Dive',
        points: 0
      }
    ]
  });
});

app.get('/api/learning/recommendations', (req, res) => {
  res.json([
    {
      id: 'rec1',
      type: 'path',
      title: 'Advanced React Patterns',
      description: 'Take your React skills to the next level',
      reason: 'Based on your progress in React Development',
      difficulty: 'Advanced',
      duration: '6 weeks',
      rating: 4.8
    },
    {
      id: 'rec2',
      type: 'module',
      title: 'TypeScript Fundamentals',
      description: 'Learn TypeScript to improve your React code',
      reason: 'Complements your React learning path',
      difficulty: 'Intermediate',
      duration: '2 weeks',
      rating: 4.9
    }
  ]);
});

app.listen(port, () => {
  console.log(`🚀 Backend server running at http://localhost:${port}`);
  console.log(`📋 Health check: http://localhost:${port}/health`);
});