require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');

// Import services
const AIAssessmentService = require('./src/services/aiAssessmentService');
const SkillSwapService = require('./src/services/skillSwapService');
const SocialLearningService = require('./src/services/socialLearningService');
const CollaborationService = require('./src/services/collaborationService');
const CommunityService = require('./src/services/communityService');

// Import middleware
const errorHandler = require('./src/middleware/errorHandler');
const { protect, optionalAuth, mockLogin, getCurrentUser } = require('./src/middleware/auth');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
    credentials: true
  }
});
const port = process.env.PORT || 3001;

// Initialize services
const aiService = new AIAssessmentService();
const swapService = new SkillSwapService();
const socialService = new SocialLearningService();
const collaborationService = new CollaborationService();
const communityService = new CommunityService();

// Security and logging middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
  crossOriginEmbedderPolicy: false
}));

app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

// Import and use payment routes
const paymentRoutes = require('./routes/payments');
app.use('/api/v1/payments', paymentRoutes);

// Import and use assessment routes
const assessmentRoutes = require('./routes/assessments');
app.use('/api/v1/assessments', assessmentRoutes);

// Import and use auth routes
const authRoutes = require('./routes/auth');
app.use('/api/v1/auth', authRoutes);

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
  const { email, password, twoFactorCode } = req.body;

  // Mock user with 2FA enabled
  const mockUser = {
    id: '1',
    name: 'Test User',
    email,
    isTeacher: true,
    isLearner: true,
    twoFactorEnabled: true
  };

  // Simulate password verification (always pass for demo)
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // If 2FA is enabled and no code provided, request 2FA
  if (mockUser.twoFactorEnabled && !twoFactorCode) {
    return res.json({
      success: false,
      requiresTwoFactor: true,
      message: 'Two-factor authentication code required',
      tempToken: 'temp-2fa-token'
    });
  }

  // If 2FA code provided, verify it
  if (mockUser.twoFactorEnabled && twoFactorCode) {
    // Mock verification (accept any 6-digit code for demo)
    if (!/^\d{6}$/.test(twoFactorCode)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid two-factor authentication code'
      });
    }
  }

  // Successful login
  res.json({
    success: true,
    user: mockUser,
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
      country,
      twoFactorEnabled: false
    },
    token: 'mock-jwt-token',
    requiresTwoFactorSetup: true
  });
});

// 2FA Endpoints

// Setup 2FA for a user
app.post('/api/auth/2fa/setup', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }

  // Mock 2FA secret generation
  const secret = {
    base32: 'JBSWY3DPEHPK3PXP',
    otpauth_url: `otpauth://totp/SkillCircle:${email}?secret=JBSWY3DPEHPK3PXP&issuer=SkillCircle`
  };

  // Mock QR code (placeholder image)
  const qrCodeUrl = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`;

  // Mock backup codes
  const backupCodes = ['A1B2C3D4', 'E5F6G7H8', 'I9J0K1L2', 'M3N4O5P6', 'Q7R8S9T0'];

  res.json({
    success: true,
    data: {
      secret: secret.base32,
      qrCodeUrl,
      manualEntryKey: secret.base32,
      backupCodes
    }
  });
});

// Verify and enable 2FA
app.post('/api/auth/2fa/verify', (req, res) => {
  const { email, token, secret } = req.body;

  if (!email || !token || !secret) {
    return res.status(400).json({
      success: false,
      message: 'Email, token, and secret are required'
    });
  }

  // Mock verification (accept any 6-digit code)
  if (!/^\d{6}$/.test(token)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid token format'
    });
  }

  res.json({
    success: true,
    message: 'Two-factor authentication enabled successfully',
    backupCodes: ['A1B2C3D4', 'E5F6G7H8', 'I9J0K1L2', 'M3N4O5P6', 'Q7R8S9T0']
  });
});

// Disable 2FA
app.post('/api/auth/2fa/disable', (req, res) => {
  const { email, password, token } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Two-factor authentication code required'
    });
  }

  // Mock verification
  if (!/^\d{6}$/.test(token)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid token format'
    });
  }

  res.json({
    success: true,
    message: 'Two-factor authentication disabled successfully'
  });
});

// Verify backup code
app.post('/api/auth/2fa/backup-code', (req, res) => {
  const { email, backupCode } = req.body;

  if (!email || !backupCode) {
    return res.status(400).json({
      success: false,
      message: 'Email and backup code are required'
    });
  }

  // Mock backup codes
  const validCodes = ['A1B2C3D4', 'E5F6G7H8', 'I9J0K1L2', 'M3N4O5P6', 'Q7R8S9T0'];

  if (!validCodes.includes(backupCode.toUpperCase())) {
    return res.status(400).json({
      success: false,
      message: 'Invalid backup code'
    });
  }

  res.json({
    success: true,
    message: 'Backup code verified successfully',
    user: {
      id: '1',
      name: 'Test User',
      email,
      isTeacher: true,
      isLearner: true,
      twoFactorEnabled: true
    },
    token: 'mock-jwt-token'
  });
});

// Enhanced Skills Endpoints

// Get all skill categories
app.get('/api/v1/skills/categories', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        name: 'Technology & Programming',
        description: 'Software development, web technologies, mobile apps, and emerging tech',
        icon: '💻',
        color: '#3B82F6',
        skills: [
          { id: '1', name: 'React Development' },
          { id: '2', name: 'Python Programming' },
          { id: '3', name: 'Full-Stack JavaScript' }
        ],
        _count: { skills: 3 }
      },
      {
        id: '2',
        name: 'Data Science & AI',
        description: 'Machine learning, data analysis, artificial intelligence, and big data',
        icon: '🤖',
        color: '#6366F1',
        skills: [
          { id: '4', name: 'Machine Learning Fundamentals' }
        ],
        _count: { skills: 1 }
      },
      {
        id: '3',
        name: 'Design & Creative Arts',
        description: 'Graphic design, UI/UX, digital art, photography, and creative expression',
        icon: '🎨',
        color: '#EC4899',
        skills: [
          { id: '5', name: 'UI/UX Design' }
        ],
        _count: { skills: 1 }
      },
      {
        id: '4',
        name: 'Business & Entrepreneurship',
        description: 'Business strategy, marketing, finance, leadership, and startup skills',
        icon: '💼',
        color: '#059669',
        skills: [
          { id: '6', name: 'Digital Marketing' }
        ],
        _count: { skills: 1 }
      },
      {
        id: '5',
        name: 'Languages & Communication',
        description: 'Foreign languages, public speaking, writing, and communication skills',
        icon: '🗣️',
        color: '#10B981',
        skills: [
          { id: '7', name: 'Spanish Conversation' }
        ],
        _count: { skills: 1 }
      },
      {
        id: '6',
        name: 'Culinary Arts',
        description: 'Cooking techniques, baking, international cuisines, and food presentation',
        icon: '🍳',
        color: '#EF4444',
        skills: [
          { id: '8', name: 'Italian Cooking' }
        ],
        _count: { skills: 1 }
      },
      {
        id: '7',
        name: 'Music & Audio',
        description: 'Musical instruments, composition, audio production, and music theory',
        icon: '🎵',
        color: '#F59E0B',
        skills: [
          { id: '9', name: 'Guitar Fundamentals' }
        ],
        _count: { skills: 1 }
      },
      {
        id: '8',
        name: 'Sports & Fitness',
        description: 'Athletic training, sports coaching, outdoor activities, and physical fitness',
        icon: '⚽',
        color: '#06B6D4',
        skills: [
          { id: '10', name: 'Personal Training' }
        ],
        _count: { skills: 1 }
      }
    ]
  });
});

// Get enhanced skills list with filtering
app.get('/api/v1/skills', (req, res) => {
  const { search, category, difficulty, page = 1, limit = 20 } = req.query;

  const allSkills = [
    {
      id: '1',
      name: 'React Development',
      description: 'Master modern React with hooks, context, state management, and best practices for building scalable web applications',
      category: {
        id: '1',
        name: 'Technology & Programming',
        icon: '💻',
        color: '#3B82F6'
      },
      difficulty: 'INTERMEDIATE',
      duration: '3-4 months',
      prerequisites: 'JavaScript fundamentals,HTML/CSS,ES6+ features',
      learningOutcomes: 'Build complex React applications with hooks,Implement state management with Context API and Redux,Create reusable components and custom hooks,Optimize React apps for performance,Test React components effectively',
      tags: 'JavaScript,Frontend,Web Development,React Hooks,Redux',
      popularity: 95,
      averageRating: 4.8,
      _count: {
        userSkills: 42,
        content: 8,
        roadmaps: 1
      }
    },
    {
      id: '2',
      name: 'Python Programming',
      description: 'Comprehensive Python programming from basics to advanced topics including web development, data science, and automation',
      category: {
        id: '1',
        name: 'Technology & Programming',
        icon: '💻',
        color: '#3B82F6'
      },
      difficulty: 'BEGINNER',
      duration: '2-6 months',
      prerequisites: 'Basic computer literacy',
      learningOutcomes: 'Write clean, efficient Python code,Build web applications with Django/Flask,Automate tasks and processes,Work with databases and APIs,Apply Python to data analysis',
      tags: 'Python,Backend,Automation,Scripting,Django',
      popularity: 98,
      averageRating: 4.7,
      _count: {
        userSkills: 68,
        content: 12,
        roadmaps: 1
      }
    },
    {
      id: '3',
      name: 'Full-Stack JavaScript',
      description: 'Complete full-stack development with Node.js, Express, React, and MongoDB',
      category: {
        id: '1',
        name: 'Technology & Programming',
        icon: '💻',
        color: '#3B82F6'
      },
      difficulty: 'ADVANCED',
      duration: '4-6 months',
      prerequisites: 'JavaScript proficiency,HTML/CSS,Basic database knowledge',
      learningOutcomes: 'Build complete web applications,Create RESTful APIs with Node.js,Implement authentication and authorization,Deploy applications to production,Optimize full-stack performance',
      tags: 'JavaScript,Node.js,React,MongoDB,Express',
      popularity: 89,
      averageRating: 4.6,
      _count: {
        userSkills: 34,
        content: 15,
        roadmaps: 1
      }
    },
    {
      id: '4',
      name: 'Machine Learning Fundamentals',
      description: 'Introduction to machine learning algorithms, data preprocessing, model training, and evaluation',
      category: {
        id: '2',
        name: 'Data Science & AI',
        icon: '🤖',
        color: '#6366F1'
      },
      difficulty: 'INTERMEDIATE',
      duration: '3-5 months',
      prerequisites: 'Python programming,Basic statistics,Linear algebra basics',
      learningOutcomes: 'Understand core ML algorithms,Preprocess and clean datasets,Train and evaluate ML models,Implement scikit-learn workflows,Apply ML to real-world problems',
      tags: 'Machine Learning,Python,Scikit-learn,Data Analysis,Statistics',
      popularity: 92,
      averageRating: 4.7,
      _count: {
        userSkills: 28,
        content: 10,
        roadmaps: 1
      }
    },
    {
      id: '5',
      name: 'UI/UX Design',
      description: 'Comprehensive user interface and user experience design with industry-standard tools and methodologies',
      category: {
        id: '3',
        name: 'Design & Creative Arts',
        icon: '🎨',
        color: '#EC4899'
      },
      difficulty: 'INTERMEDIATE',
      duration: '3-4 months',
      prerequisites: 'Design fundamentals,Basic understanding of web/mobile',
      learningOutcomes: 'Design user-centered interfaces,Conduct user research and testing,Create wireframes and prototypes,Master Figma and design systems,Apply accessibility principles',
      tags: 'UI Design,UX Research,Figma,Prototyping,User Testing',
      popularity: 88,
      averageRating: 4.6,
      _count: {
        userSkills: 35,
        content: 7,
        roadmaps: 1
      }
    },
    {
      id: '6',
      name: 'Digital Marketing',
      description: 'Comprehensive digital marketing including SEO, social media, content marketing, and analytics',
      category: {
        id: '4',
        name: 'Business & Entrepreneurship',
        icon: '💼',
        color: '#059669'
      },
      difficulty: 'BEGINNER',
      duration: '2-3 months',
      prerequisites: 'Basic understanding of social media',
      learningOutcomes: 'Develop digital marketing strategies,Master SEO and content marketing,Run effective social media campaigns,Analyze marketing performance,Create compelling marketing content',
      tags: 'Digital Marketing,SEO,Social Media,Content Marketing,Analytics',
      popularity: 86,
      averageRating: 4.5,
      _count: {
        userSkills: 41,
        content: 6,
        roadmaps: 1
      }
    },
    {
      id: '7',
      name: 'Spanish Conversation',
      description: 'Improve Spanish speaking fluency through conversation practice, grammar, and cultural understanding',
      category: {
        id: '5',
        name: 'Languages & Communication',
        icon: '🗣️',
        color: '#10B981'
      },
      difficulty: 'BEGINNER',
      duration: '6-12 months',
      prerequisites: 'Basic Spanish vocabulary (optional)',
      learningOutcomes: 'Engage in natural Spanish conversations,Understand grammar in context,Learn about Hispanic cultures,Improve pronunciation and accent,Build confidence in speaking',
      tags: 'Spanish,Conversation,Grammar,Pronunciation,Culture',
      popularity: 91,
      averageRating: 4.8,
      _count: {
        userSkills: 56,
        content: 9,
        roadmaps: 1
      }
    },
    {
      id: '8',
      name: 'Italian Cooking',
      description: 'Authentic Italian cooking techniques, traditional recipes, and regional specialties',
      category: {
        id: '6',
        name: 'Culinary Arts',
        icon: '🍳',
        color: '#EF4444'
      },
      difficulty: 'BEGINNER',
      duration: '2-4 months',
      prerequisites: 'Basic cooking skills',
      learningOutcomes: 'Master traditional Italian techniques,Cook authentic pasta dishes,Understand Italian ingredients,Learn regional cooking styles,Create complete Italian menus',
      tags: 'Italian Cuisine,Pasta,Traditional Cooking,Mediterranean,Recipes',
      popularity: 84,
      averageRating: 4.8,
      _count: {
        userSkills: 22,
        content: 5,
        roadmaps: 1
      }
    },
    {
      id: '9',
      name: 'Guitar Fundamentals',
      description: 'Learn guitar from complete beginner to confident player with proper technique and music theory',
      category: {
        id: '7',
        name: 'Music & Audio',
        icon: '🎵',
        color: '#F59E0B'
      },
      difficulty: 'BEGINNER',
      duration: '3-6 months',
      prerequisites: 'Access to acoustic or electric guitar',
      learningOutcomes: 'Play basic chords and strumming patterns,Read guitar tabs and chord charts,Understand basic music theory,Play popular songs confidently,Develop proper playing technique',
      tags: 'Guitar,Music Theory,Chords,Acoustic,Electric',
      popularity: 88,
      averageRating: 4.7,
      _count: {
        userSkills: 39,
        content: 8,
        roadmaps: 1
      }
    },
    {
      id: '10',
      name: 'Personal Training',
      description: 'Learn how to design effective workout programs, understand exercise science, and help others achieve their fitness goals',
      category: {
        id: '8',
        name: 'Sports & Fitness',
        icon: '⚽',
        color: '#06B6D4'
      },
      difficulty: 'INTERMEDIATE',
      duration: '2-4 months',
      prerequisites: 'Basic fitness knowledge,Interest in helping others',
      learningOutcomes: 'Design personalized workout programs,Understand exercise physiology,Learn proper form and technique,Develop coaching and motivation skills,Understand nutrition basics for fitness',
      tags: 'Personal Training,Exercise Science,Fitness,Coaching,Nutrition',
      popularity: 76,
      averageRating: 4.5,
      _count: {
        userSkills: 18,
        content: 6,
        roadmaps: 1
      }
    }
  ];

  let filteredSkills = allSkills;

  // Apply filters
  if (search) {
    const searchLower = search.toLowerCase();
    filteredSkills = filteredSkills.filter(skill =>
      skill.name.toLowerCase().includes(searchLower) ||
      skill.description.toLowerCase().includes(searchLower) ||
      skill.tags.toLowerCase().includes(searchLower)
    );
  }

  if (category) {
    filteredSkills = filteredSkills.filter(skill =>
      skill.category.name.toLowerCase().includes(category.toLowerCase())
    );
  }

  if (difficulty) {
    filteredSkills = filteredSkills.filter(skill =>
      skill.difficulty === difficulty.toUpperCase()
    );
  }

  // Pagination
  const startIndex = (Number(page) - 1) * Number(limit);
  const endIndex = startIndex + Number(limit);
  const paginatedSkills = filteredSkills.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: {
      skills: paginatedSkills,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filteredSkills.length,
        pages: Math.ceil(filteredSkills.length / Number(limit))
      }
    }
  });
});

// Get skill details with roadmap and content
app.get('/api/v1/skills/:id', (req, res) => {
  const { id } = req.params;

  const skillDetails = {
    '1': {
      id: '1',
      name: 'React Development',
      description: 'Master modern React with hooks, context, state management, and best practices for building scalable web applications',
      category: {
        id: '1',
        name: 'Technology & Programming',
        icon: '💻',
        color: '#3B82F6'
      },
      difficulty: 'INTERMEDIATE',
      duration: '3-4 months',
      prerequisites: 'JavaScript fundamentals,HTML/CSS,ES6+ features',
      learningOutcomes: 'Build complex React applications with hooks,Implement state management with Context API and Redux,Create reusable components and custom hooks,Optimize React apps for performance,Test React components effectively',
      tags: 'JavaScript,Frontend,Web Development,React Hooks,Redux',
      popularity: 95,
      averageRating: 4.8,
      roadmaps: [{
        id: '1',
        title: 'Complete React Developer Roadmap',
        description: 'A comprehensive path to becoming a professional React developer',
        estimatedHours: 120
      }],
      content: [
        {
          id: '1',
          type: 'article',
          title: 'Introduction to React Components',
          description: 'Understanding the building blocks of React applications',
          level: 'BEGINNER',
          duration: 15,
          order: 1
        },
        {
          id: '2',
          type: 'tutorial',
          title: 'Building Your First React App',
          description: 'Step-by-step tutorial for creating a React application',
          level: 'BEGINNER',
          duration: 30,
          order: 2
        }
      ],
      _count: {
        userSkills: 42,
        sessions: 156
      }
    }
  };

  const skill = skillDetails[id];
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
});

// Get skill roadmap
app.get('/api/v1/skills/:id/roadmap', (req, res) => {
  const { id } = req.params;

  if (id === '1') {
    res.json({
      success: true,
      data: {
        id: '1',
        skillId: '1',
        title: 'Complete React Developer Roadmap',
        description: 'A comprehensive path to becoming a professional React developer',
        estimatedHours: 120,
        phases: [
          {
            phase: 1,
            title: 'JavaScript Fundamentals',
            duration: '2-3 weeks',
            topics: ['ES6+ Features', 'Async Programming', 'DOM Manipulation', 'Module Systems'],
            milestones: ['Build vanilla JS projects', 'Understand promises and async/await', 'Master array methods']
          },
          {
            phase: 2,
            title: 'React Basics',
            duration: '3-4 weeks',
            topics: ['Components', 'JSX', 'Props', 'State', 'Event Handling'],
            milestones: ['Create first React app', 'Build interactive components', 'Understand component lifecycle']
          },
          {
            phase: 3,
            title: 'Advanced React',
            duration: '4-5 weeks',
            topics: ['Hooks', 'Context API', 'Custom Hooks', 'Performance Optimization'],
            milestones: ['Build complex state management', 'Create reusable hooks', 'Optimize component rendering']
          }
        ],
        resources: [
          { type: 'course', title: 'Complete React Developer Course', provider: 'Various Platforms' },
          { type: 'book', title: 'React - The Complete Guide', author: 'Maximilian Schwarzmüller' },
          { type: 'documentation', title: 'Official React Documentation', url: 'https://react.dev' }
        ],
        projects: [
          { title: 'Todo App with Local Storage', difficulty: 'Beginner', description: 'Build a todo app with CRUD operations' },
          { title: 'Weather Dashboard', difficulty: 'Intermediate', description: 'Create a weather app using APIs' },
          { title: 'E-commerce Product Catalog', difficulty: 'Advanced', description: 'Build a full product catalog with cart functionality' }
        ],
        skill: {
          name: 'React Development',
          description: 'Master modern React with hooks, context, state management, and best practices',
          difficulty: 'INTERMEDIATE',
          duration: '3-4 months',
          category: {
            name: 'Technology & Programming',
            icon: '💻'
          }
        }
      }
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Roadmap not found for this skill'
    });
  }
});

// Legacy skills endpoint (keep for compatibility)
app.get('/api/skills', (req, res) => {
  res.json([
    {
      id: '1',
      name: 'React Development',
      category: 'Technology & Programming',
      description: 'Master modern React with hooks, context, state management, and best practices',
      averageHourlyRate: { min: 50, max: 120, currency: 'USD' }
    },
    {
      id: '2',
      name: 'Python Programming',
      category: 'Technology & Programming',
      description: 'Comprehensive Python programming from basics to advanced topics',
      averageHourlyRate: { min: 40, max: 100, currency: 'USD' }
    },
    {
      id: '3',
      name: 'UI/UX Design',
      category: 'Design & Creative Arts',
      description: 'Comprehensive user interface and user experience design',
      averageHourlyRate: { min: 45, max: 90, currency: 'USD' }
    },
    {
      id: '4',
      name: 'Spanish Conversation',
      category: 'Languages & Communication',
      description: 'Improve Spanish speaking fluency through conversation practice',
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

// Global search endpoint
app.get('/api/search', (req, res) => {
  const { q, type, limit = 10, page = 1 } = req.query;

  if (!q || q.trim().length < 2) {
    return res.json({
      success: true,
      data: {
        skills: [],
        teachers: [],
        content: [],
        total: 0,
        query: q
      }
    });
  }

  const searchQuery = q.toLowerCase().trim();

  // Mock search results
  const allSkills = [
    {
      id: '1',
      name: 'React Development',
      category: 'Technology & Programming',
      description: 'Master modern React with hooks, context, state management, and best practices',
      tags: 'JavaScript,Frontend,Web Development,React Hooks,Redux',
      popularity: 95,
      averageRating: 4.8,
      type: 'skill'
    },
    {
      id: '2',
      name: 'Python Programming',
      category: 'Technology & Programming',
      description: 'Comprehensive Python programming from basics to advanced topics',
      tags: 'Python,Backend,Automation,Scripting,Django',
      popularity: 98,
      averageRating: 4.7,
      type: 'skill'
    },
    {
      id: '3',
      name: 'UI/UX Design',
      category: 'Design & Creative Arts',
      description: 'Comprehensive user interface and user experience design',
      tags: 'UI Design,UX Research,Figma,Prototyping,User Testing',
      popularity: 88,
      averageRating: 4.6,
      type: 'skill'
    },
    {
      id: '4',
      name: 'Spanish Conversation',
      category: 'Languages & Communication',
      description: 'Improve Spanish speaking fluency through conversation practice',
      tags: 'Spanish,Conversation,Grammar,Pronunciation,Culture',
      popularity: 91,
      averageRating: 4.8,
      type: 'skill'
    },
    {
      id: '5',
      name: 'Machine Learning',
      category: 'Data Science & AI',
      description: 'Introduction to machine learning algorithms and data science',
      tags: 'Machine Learning,Python,Scikit-learn,Data Analysis,Statistics',
      popularity: 92,
      averageRating: 4.7,
      type: 'skill'
    }
  ];

  const allTeachers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      skills: ['React Development', 'JavaScript Programming'],
      rating: 4.9,
      location: 'San Francisco, CA',
      experience: '5+ years',
      hourlyRate: 75,
      avatar: '/avatars/sarah.jpg',
      type: 'teacher'
    },
    {
      id: '2',
      name: 'Michael Chen',
      skills: ['Python Programming', 'Data Science'],
      rating: 4.8,
      location: 'New York, NY',
      experience: '7+ years',
      hourlyRate: 85,
      avatar: '/avatars/michael.jpg',
      type: 'teacher'
    },
    {
      id: '3',
      name: 'Maria Rodriguez',
      skills: ['Spanish Conversation', 'Language Learning'],
      rating: 4.9,
      location: 'Miami, FL',
      experience: '10+ years',
      hourlyRate: 45,
      avatar: '/avatars/maria.jpg',
      type: 'teacher'
    },
    {
      id: '4',
      name: 'Alex Thompson',
      skills: ['UI/UX Design', 'Product Design'],
      rating: 4.7,
      location: 'Seattle, WA',
      experience: '6+ years',
      hourlyRate: 90,
      avatar: '/avatars/alex.jpg',
      type: 'teacher'
    }
  ];

  const allContent = [
    {
      id: '1',
      title: 'Getting Started with React Hooks',
      type: 'tutorial',
      description: 'Learn the fundamentals of React Hooks',
      skill: 'React Development',
      level: 'Beginner',
      duration: 30,
      rating: 4.8,
      type: 'content'
    },
    {
      id: '2',
      title: 'Python for Beginners Complete Course',
      type: 'course',
      description: 'Complete Python programming course from scratch',
      skill: 'Python Programming',
      level: 'Beginner',
      duration: 480,
      rating: 4.7,
      type: 'content'
    },
    {
      id: '3',
      title: 'Advanced JavaScript Patterns',
      type: 'article',
      description: 'Deep dive into advanced JavaScript design patterns',
      skill: 'JavaScript Programming',
      level: 'Advanced',
      duration: 45,
      rating: 4.6,
      type: 'content'
    }
  ];

  // Filter based on type
  let results = { skills: [], teachers: [], content: [] };

  if (!type || type === 'skill' || type === 'all') {
    results.skills = allSkills.filter(skill =>
      skill.name.toLowerCase().includes(searchQuery) ||
      skill.description.toLowerCase().includes(searchQuery) ||
      skill.tags.toLowerCase().includes(searchQuery) ||
      skill.category.toLowerCase().includes(searchQuery)
    );
  }

  if (!type || type === 'teacher' || type === 'all') {
    results.teachers = allTeachers.filter(teacher =>
      teacher.name.toLowerCase().includes(searchQuery) ||
      teacher.skills.some(skill => skill.toLowerCase().includes(searchQuery)) ||
      teacher.location.toLowerCase().includes(searchQuery)
    );
  }

  if (!type || type === 'content' || type === 'all') {
    results.content = allContent.filter(content =>
      content.title.toLowerCase().includes(searchQuery) ||
      content.description.toLowerCase().includes(searchQuery) ||
      content.skill.toLowerCase().includes(searchQuery)
    );
  }

  // Calculate total results
  const total = results.skills.length + results.teachers.length + results.content.length;

  // Apply pagination (simplified for this example)
  const pageSize = Math.min(parseInt(limit), 50);
  if (pageSize < total) {
    if (results.skills.length > pageSize / 3) results.skills = results.skills.slice(0, Math.ceil(pageSize / 3));
    if (results.teachers.length > pageSize / 3) results.teachers = results.teachers.slice(0, Math.ceil(pageSize / 3));
    if (results.content.length > pageSize / 3) results.content = results.content.slice(0, Math.ceil(pageSize / 3));
  }

  res.json({
    success: true,
    data: {
      ...results,
      total,
      query: q,
      filters: {
        type: type || 'all',
        page: parseInt(page),
        limit: pageSize
      }
    }
  });
});

// Search suggestions endpoint
app.get('/api/search/suggestions', (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length < 2) {
    return res.json({
      success: true,
      data: []
    });
  }

  const searchQuery = q.toLowerCase().trim();

  const suggestions = [
    'React Development',
    'Python Programming',
    'JavaScript Fundamentals',
    'UI/UX Design',
    'Machine Learning',
    'Spanish Conversation',
    'Digital Marketing',
    'Data Science',
    'Web Development',
    'Mobile App Development',
    'Graphic Design',
    'Photography',
    'Italian Cooking',
    'Guitar Playing',
    'Personal Training',
    'Business Strategy',
    'Public Speaking',
    'Creative Writing'
  ].filter(suggestion =>
    suggestion.toLowerCase().includes(searchQuery)
  ).slice(0, 8);

  res.json({
    success: true,
    data: suggestions
  });
});

// AI Assessment Endpoints

// Generate skill assessment questions
app.post('/api/ai/assessment/questions', (req, res) => {
  const { skillId, currentLevel = 'BEGINNER', answeredQuestions = [] } = req.body;

  const questions = aiService.generateAssessmentQuestions(skillId, currentLevel, answeredQuestions);

  res.json({
    success: true,
    data: {
      questions,
      skillId,
      currentLevel,
      totalQuestions: questions.length
    }
  });
});

// Analyze user responses and generate profile
app.post('/api/ai/assessment/analyze', (req, res) => {
  const { userResponses, learningHistory = [] } = req.body;

  const profile = aiService.analyzeUserProfile(userResponses, learningHistory);

  res.json({
    success: true,
    data: {
      profile,
      insights: {
        strengths: profile.learningStyle === 'VISUAL' ?
          ['Excellent at processing visual information', 'Quick to understand diagrams and charts'] :
          ['Strong analytical thinking', 'Good at systematic problem solving'],
        recommendations: [
          `Focus on ${profile.learningStyle.toLowerCase()} learning materials`,
          `Best learning times: ${profile.optimalLearningTime.join(', ')}`,
          `Estimated time to proficiency: ${profile.estimatedProficiencyTime} hours`
        ]
      }
    }
  });
});

// Find compatible teacher matches
app.post('/api/ai/matching/teachers', (req, res) => {
  const { learnerId, teacherIds, skillId } = req.body;

  const matches = aiService.findCompatibleMatches(learnerId, teacherIds, skillId);

  res.json({
    success: true,
    data: {
      matches,
      totalCandidates: teacherIds.length,
      recommendedMatch: matches[0] // Best match
    }
  });
});

// Generate personalized learning path
app.post('/api/ai/learning-path', (req, res) => {
  const { skillId, userId, targetLevel = 'INTERMEDIATE' } = req.body;

  const userProfile = aiService.getUserProfile(userId);
  const learningPath = aiService.generateLearningPath(skillId, userProfile, targetLevel);

  res.json({
    success: true,
    data: {
      learningPath,
      userProfile: {
        learningStyle: userProfile.learningStyle,
        personalityType: userProfile.personalityType,
        estimatedDuration: learningPath.estimatedDuration
      }
    }
  });
});

// Predict learning success rate
app.post('/api/ai/predict/success', (req, res) => {
  const { userId, skillId, sessionType = 'ONE_ON_ONE' } = req.body;

  const successRate = aiService.predictSuccessRate(userId, skillId, sessionType);

  res.json({
    success: true,
    data: {
      successRate: Math.round(successRate * 100),
      confidence: 'HIGH',
      factors: {
        userExperience: 'BEGINNER',
        skillComplexity: 'MEDIUM',
        sessionType: sessionType,
        personalityMatch: 'GOOD'
      },
      recommendations: successRate > 0.8 ?
        ['You have excellent potential for this skill!', 'Consider intensive sessions for faster progress'] :
        ['Start with basics', 'Consider group sessions for support', 'Practice regularly for best results']
    }
  });
});

// Get AI insights for a skill
app.get('/api/ai/insights/:skillId', (req, res) => {
  const { skillId } = req.params;
  const { userId = '1' } = req.query;

  const userProfile = aiService.getUserProfile(userId);
  const successRate = aiService.predictSuccessRate(userId, skillId);
  const learningPath = aiService.generateLearningPath(skillId, userProfile);

  res.json({
    success: true,
    data: {
      personalizedInsights: {
        learningStyle: userProfile.learningStyle,
        estimatedDuration: `${Math.round(learningPath.estimatedDuration / 60)} hours`,
        successProbability: `${Math.round(successRate * 100)}%`,
        optimalSchedule: learningPath.dailySchedule,
        recommendedPhases: learningPath.phases.slice(0, 3)
      },
      adaptiveRecommendations: learningPath.adaptiveContent,
      milestones: learningPath.milestones
    }
  });
});

// Skill Swap Marketplace Endpoints

// Get all swap offers with filtering
app.get('/api/skill-swap/offers', (req, res) => {
  const { skill, location, format, difficulty, userId = '1' } = req.query;

  const filters = {};
  if (skill) filters.skill = skill;
  if (location) filters.location = location;
  if (format) filters.format = format;
  if (difficulty) filters.difficulty = difficulty;

  const offers = swapService.getSwapOffers(filters);

  res.json({
    success: true,
    data: {
      offers,
      total: offers.length,
      filters: filters
    }
  });
});

// Create a new swap offer
app.post('/api/skill-swap/offers', (req, res) => {
  const { userId = '1', ...offerData } = req.body;

  try {
    const newOffer = swapService.createSwapOffer(userId, offerData);

    res.json({
      success: true,
      data: newOffer,
      message: 'Swap offer created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Accept a swap offer
app.post('/api/skill-swap/offers/:offerId/accept', (req, res) => {
  const { offerId } = req.params;
  const { accepterId = '1' } = req.body;

  try {
    const swapMatch = swapService.acceptSwapOffer(offerId, accepterId);

    res.json({
      success: true,
      data: swapMatch,
      message: 'Swap offer accepted! You can now coordinate your learning sessions.'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get user's credit balance
app.get('/api/skill-swap/credits/:userId', (req, res) => {
  const { userId } = req.params;

  const credits = swapService.getUserCredits(userId);
  const transactions = swapService.getUserTransactions(userId, 10);

  res.json({
    success: true,
    data: {
      balance: credits,
      recentTransactions: transactions,
      earnRate: 'Earn 100-150 credits per hour taught',
      spendRate: 'Spend 80-120 credits per hour learned'
    }
  });
});

// Get transaction history
app.get('/api/skill-swap/transactions/:userId', (req, res) => {
  const { userId } = req.params;
  const { limit = 20 } = req.query;

  const transactions = swapService.getUserTransactions(userId, parseInt(limit));

  res.json({
    success: true,
    data: transactions
  });
});

// Calculate swap fairness
app.post('/api/skill-swap/calculate-fairness', (req, res) => {
  const { offeredSkill, offeredHours, requestedSkill, requestedHours } = req.body;

  const fairness = swapService.calculateSwapFairness(
    offeredSkill, offeredHours, requestedSkill, requestedHours
  );

  res.json({
    success: true,
    data: fairness
  });
});

// Get personalized swap recommendations
app.get('/api/skill-swap/recommendations/:userId', (req, res) => {
  const { userId } = req.params;

  // Mock user skills and interests - in real app, get from user profile
  const userSkills = ['React Development', 'JavaScript Programming'];
  const interestedSkills = ['UI/UX Design', 'Spanish Conversation'];

  const recommendations = swapService.recommendSwapMatches(userId, userSkills, interestedSkills);

  res.json({
    success: true,
    data: {
      recommendations,
      userSkills,
      interestedSkills,
      total: recommendations.length
    }
  });
});

// Get marketplace statistics
app.get('/api/skill-swap/stats', (req, res) => {
  const stats = swapService.getMarketplaceStats();

  res.json({
    success: true,
    data: {
      ...stats,
      growth: {
        weeklyNewOffers: 15,
        weeklyCompletedSwaps: 8,
        weeklyNewUsers: 23
      },
      trends: {
        hotSkills: ['React Development', 'Python Programming', 'UI/UX Design'],
        emergingSkills: ['Machine Learning', 'Blockchain Development', 'Data Science']
      }
    }
  });
});

// Award credits (for completing teaching session)
app.post('/api/skill-swap/credits/award', (req, res) => {
  const { userId, amount, reason } = req.body;

  try {
    const transaction = swapService.awardCredits(userId, amount, reason);

    res.json({
      success: true,
      data: transaction,
      message: `${amount} credits awarded!`
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Deduct credits (for learning session)
app.post('/api/skill-swap/credits/deduct', (req, res) => {
  const { userId, amount, reason } = req.body;

  try {
    const transaction = swapService.deductCredits(userId, amount, reason);

    res.json({
      success: true,
      data: transaction,
      message: `${amount} credits deducted`
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get skill credit values
app.get('/api/skill-swap/skill-values', (req, res) => {
  const skillValues = {
    'React Development': swapService.getSkillCreditValue('React Development'),
    'Python Programming': swapService.getSkillCreditValue('Python Programming'),
    'UI/UX Design': swapService.getSkillCreditValue('UI/UX Design'),
    'Spanish Conversation': swapService.getSkillCreditValue('Spanish Conversation'),
    'Machine Learning': swapService.getSkillCreditValue('Machine Learning'),
    'Guitar Playing': swapService.getSkillCreditValue('Guitar Playing'),
    'Italian Cooking': swapService.getSkillCreditValue('Italian Cooking'),
    'Digital Marketing': swapService.getSkillCreditValue('Digital Marketing')
  };

  res.json({
    success: true,
    data: {
      skillValues,
      note: 'Values are per hour and may vary based on demand and complexity'
    }
  });
});

// === SOCIAL LEARNING ENDPOINTS ===

// Study Rooms
app.get('/api/social/study-rooms', (req, res) => {
  const { subject, difficulty, status, hasSpace } = req.query;

  const filters = {};
  if (subject) filters.subject = subject;
  if (difficulty) filters.difficulty = difficulty;
  if (status) filters.status = status;
  if (hasSpace === 'true') filters.hasSpace = true;

  const rooms = socialService.getStudyRooms(filters);

  res.json({
    success: true,
    data: rooms
  });
});

app.post('/api/social/study-rooms', (req, res) => {
  const { hostId = '1', ...roomData } = req.body;

  try {
    const room = socialService.createStudyRoom(hostId, roomData);

    res.json({
      success: true,
      data: room,
      message: 'Study room created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

app.post('/api/social/study-rooms/:roomId/join', (req, res) => {
  const { roomId } = req.params;
  const { userId = '1', password } = req.body;

  try {
    const room = socialService.joinStudyRoom(roomId, userId, password);

    res.json({
      success: true,
      data: room,
      message: 'Successfully joined study room'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

app.post('/api/social/study-rooms/:roomId/leave', (req, res) => {
  const { roomId } = req.params;
  const { userId = '1' } = req.body;

  try {
    const room = socialService.leaveStudyRoom(roomId, userId);

    res.json({
      success: true,
      data: room,
      message: 'Successfully left study room'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Learning Challenges
app.get('/api/social/challenges', (req, res) => {
  const { category, difficulty, type, status } = req.query;

  const filters = {};
  if (category) filters.category = category;
  if (difficulty) filters.difficulty = difficulty;
  if (type) filters.type = type;
  if (status) filters.status = status;

  const challenges = socialService.getChallenges(filters);

  res.json({
    success: true,
    data: challenges
  });
});

app.post('/api/social/challenges', (req, res) => {
  const { creatorId = '1', ...challengeData } = req.body;

  try {
    const challenge = socialService.createChallenge(creatorId, challengeData);

    res.json({
      success: true,
      data: challenge,
      message: 'Challenge created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

app.post('/api/social/challenges/:challengeId/join', (req, res) => {
  const { challengeId } = req.params;
  const { userId = '1' } = req.body;

  try {
    const challenge = socialService.joinChallenge(challengeId, userId);

    res.json({
      success: true,
      data: challenge,
      message: 'Successfully joined challenge'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

app.put('/api/social/challenges/:challengeId/progress', (req, res) => {
  const { challengeId } = req.params;
  const { userId = '1', ...progressData } = req.body;

  try {
    const challenge = socialService.updateChallengeProgress(challengeId, userId, progressData);

    res.json({
      success: true,
      data: challenge,
      message: 'Progress updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// User Analytics
app.get('/api/social/analytics/:userId', (req, res) => {
  const { userId } = req.params;

  try {
    const analytics = socialService.getUserLearningAnalytics(userId);

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// === COLLABORATION ENDPOINTS ===

// Workspaces
app.post('/api/collaboration/workspaces', (req, res) => {
  const { ownerId = '1', ...workspaceData } = req.body;

  try {
    const workspace = collaborationService.createWorkspace(ownerId, workspaceData);

    res.json({
      success: true,
      data: workspace,
      message: 'Workspace created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

app.get('/api/collaboration/workspaces/:workspaceId', (req, res) => {
  const { workspaceId } = req.params;

  try {
    const workspace = collaborationService.getWorkspace(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found'
      });
    }

    res.json({
      success: true,
      data: workspace
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

app.post('/api/collaboration/workspaces/:workspaceId/join', (req, res) => {
  const { workspaceId } = req.params;
  const { userId = '1', role = 'VIEWER' } = req.body;

  try {
    const workspace = collaborationService.joinWorkspace(workspaceId, userId, role);

    res.json({
      success: true,
      data: workspace,
      message: 'Successfully joined workspace'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

app.post('/api/collaboration/workspaces/:workspaceId/leave', (req, res) => {
  const { workspaceId } = req.params;
  const { userId = '1' } = req.body;

  try {
    const workspace = collaborationService.leaveWorkspace(workspaceId, userId);

    res.json({
      success: true,
      data: workspace,
      message: 'Successfully left workspace'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Files
app.post('/api/collaboration/workspaces/:workspaceId/files', (req, res) => {
  const { workspaceId } = req.params;
  const { userId = '1', ...fileData } = req.body;

  try {
    const file = collaborationService.createFile(workspaceId, userId, fileData);

    res.json({
      success: true,
      data: file,
      message: 'File created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

app.put('/api/collaboration/workspaces/:workspaceId/files/:fileId', (req, res) => {
  const { workspaceId, fileId } = req.params;
  const { userId = '1', content } = req.body;

  try {
    const file = collaborationService.updateFile(workspaceId, fileId, userId, content);

    // Broadcast file update
    collaborationService.broadcastToWorkspace(workspaceId, 'file_update', {
      fileId,
      content,
      modifiedBy: userId
    }, userId);

    res.json({
      success: true,
      data: file,
      message: 'File updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

app.post('/api/collaboration/workspaces/:workspaceId/files/:fileId/lock', (req, res) => {
  const { workspaceId, fileId } = req.params;
  const { userId = '1' } = req.body;

  try {
    const file = collaborationService.lockFile(workspaceId, fileId, userId);

    // Broadcast lock status
    collaborationService.broadcastToWorkspace(workspaceId, 'file_lock', {
      fileId,
      locked: file.locked,
      lockedBy: file.lockedBy
    }, userId);

    res.json({
      success: true,
      data: file,
      message: file.locked ? 'File locked successfully' : 'File unlocked successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Code Sessions
app.post('/api/collaboration/code-sessions', (req, res) => {
  const { hostId = '1', ...sessionData } = req.body;

  try {
    const session = collaborationService.createCodeSession(hostId, sessionData);

    res.json({
      success: true,
      data: session,
      message: 'Code session created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

app.get('/api/collaboration/code-sessions/:sessionId', (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = collaborationService.codeSessions.get(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Code session not found'
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

app.post('/api/collaboration/code-sessions/:sessionId/join', (req, res) => {
  const { sessionId } = req.params;
  const { userId = '1' } = req.body;

  try {
    const session = collaborationService.joinCodeSession(sessionId, userId);

    // Broadcast user joined
    collaborationService.broadcastToCodeSession(sessionId, 'user_joined', {
      userId,
      userName: collaborationService.getUserName(userId)
    }, userId);

    res.json({
      success: true,
      data: session,
      message: 'Successfully joined code session'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

app.put('/api/collaboration/code-sessions/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const { userId = '1', ...updates } = req.body;

  try {
    const session = collaborationService.updateCodeSession(sessionId, userId, updates);

    // Broadcast code changes
    if (updates.code !== undefined) {
      collaborationService.broadcastToCodeSession(sessionId, 'code_update', {
        code: updates.code,
        updatedBy: userId
      }, userId);
    }

    // Broadcast cursor/selection changes
    if (updates.cursor || updates.selection !== undefined) {
      collaborationService.broadcastToCodeSession(sessionId, 'cursor_update', {
        userId,
        cursor: updates.cursor,
        selection: updates.selection,
        isTyping: updates.isTyping
      }, userId);
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

app.post('/api/collaboration/code-sessions/:sessionId/execute', (req, res) => {
  const { sessionId } = req.params;
  const { userId = '1', code, language } = req.body;

  try {
    const result = collaborationService.executeCode(sessionId, userId, code, language);

    // Broadcast execution result
    collaborationService.broadcastToCodeSession(sessionId, 'code_executed', {
      result,
      executedBy: userId
    }, userId);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Analytics
app.get('/api/collaboration/workspaces/:workspaceId/analytics', (req, res) => {
  const { workspaceId } = req.params;

  try {
    const analytics = collaborationService.getWorkspaceAnalytics(workspaceId);

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// === COMMUNITY ENDPOINTS ===

// Community Posts
app.get('/api/community/posts', (req, res) => {
  const { category, search, authorId } = req.query;

  const filters = {};
  if (category) filters.category = category;
  if (search) filters.search = search;
  if (authorId) filters.authorId = authorId;

  const posts = communityService.getPosts(filters);

  res.json({
    success: true,
    data: posts
  });
});

app.post('/api/community/posts', (req, res) => {
  const { authorId = '1', ...postData } = req.body;

  try {
    const post = communityService.createPost(authorId, postData);

    res.json({
      success: true,
      data: post,
      message: 'Post created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

app.post('/api/community/posts/:postId/like', (req, res) => {
  const { postId } = req.params;
  const { userId = '1' } = req.body;

  try {
    const post = communityService.likePost(postId, userId);

    res.json({
      success: true,
      data: post,
      message: 'Post liked successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

app.post('/api/community/posts/:postId/comment', (req, res) => {
  const { postId } = req.params;
  const { userId = '1', comment } = req.body;

  try {
    const post = communityService.commentOnPost(postId, userId, comment);

    res.json({
      success: true,
      data: post,
      message: 'Comment added successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Community Members
app.get('/api/community/members', (req, res) => {
  const { search, skill, isMentor } = req.query;

  const filters = {};
  if (search) filters.search = search;
  if (skill) filters.skill = skill;
  if (isMentor !== undefined) filters.isMentor = isMentor === 'true';

  const members = communityService.getMembers(filters);

  res.json({
    success: true,
    data: members
  });
});

// Peer Verification
app.get('/api/community/verification/requests', (req, res) => {
  const { status, skillCategory, userId } = req.query;

  const filters = {};
  if (status) filters.status = status;
  if (skillCategory) filters.skillCategory = skillCategory;
  if (userId) filters.userId = userId;

  const requests = communityService.getVerificationRequests(filters);

  res.json({
    success: true,
    data: requests
  });
});

app.post('/api/community/verification/requests', (req, res) => {
  const { userId = '1', ...requestData } = req.body;

  try {
    const request = communityService.submitVerificationRequest(userId, requestData);

    res.json({
      success: true,
      data: request,
      message: 'Verification request submitted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

app.post('/api/community/verification/requests/:requestId/review', (req, res) => {
  const { requestId } = req.params;
  const { reviewerId = '1', ...reviewData } = req.body;

  try {
    const result = communityService.submitVerificationReview(requestId, reviewerId, reviewData);

    res.json({
      success: true,
      data: result,
      message: 'Review submitted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Mentorship
app.get('/api/community/mentorship', (req, res) => {
  const { skillArea, format, maxPrice, availableOnly } = req.query;

  const filters = {};
  if (skillArea) filters.skillArea = skillArea;
  if (format) filters.format = format;
  if (maxPrice) filters.maxPrice = parseInt(maxPrice);
  if (availableOnly === 'true') filters.availableOnly = true;

  const opportunities = communityService.getMentorshipOpportunities(filters);

  res.json({
    success: true,
    data: opportunities
  });
});

app.post('/api/community/mentorship', (req, res) => {
  const { mentorId = '1', ...opportunityData } = req.body;

  try {
    const opportunity = communityService.createMentorshipOpportunity(mentorId, opportunityData);

    res.json({
      success: true,
      data: opportunity,
      message: 'Mentorship opportunity created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

app.post('/api/community/mentorship/:opportunityId/apply', (req, res) => {
  const { opportunityId } = req.params;
  const { menteeId = '1' } = req.body;

  try {
    const opportunity = communityService.applyForMentorship(opportunityId, menteeId);

    res.json({
      success: true,
      data: opportunity,
      message: 'Applied for mentorship successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Community Stats
app.get('/api/community/stats', (req, res) => {
  try {
    const stats = communityService.getCommunityStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// User Reputation
app.get('/api/community/reputation/:userId', (req, res) => {
  const { userId } = req.params;

  try {
    const reputation = communityService.getUserReputation(userId);

    res.json({
      success: true,
      data: { userId, reputation }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Enhanced Authentication Endpoints
app.post('/api/auth/login', mockLogin);
app.get('/api/auth/me', protect, getCurrentUser);

// Example protected route
app.get('/api/protected', protect, (req, res) => {
  res.json({
    success: true,
    message: 'This is a protected route',
    user: req.user
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Cleanup inactive sessions every hour
setInterval(() => {
  collaborationService.cleanupInactiveSessions();
}, 60 * 60 * 1000);

// WebSocket connection handling
const activeUsers = new Map();
const conversationRooms = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user authentication
  socket.on('authenticate', (userId) => {
    socket.userId = userId;
    activeUsers.set(userId, {
      socketId: socket.id,
      lastSeen: new Date(),
      isOnline: true
    });

    // Broadcast online users update
    io.emit('online_users_updated', Array.from(activeUsers.keys()));
  });

  // Handle joining conversation rooms
  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);

    if (!conversationRooms.has(conversationId)) {
      conversationRooms.set(conversationId, new Set());
    }
    conversationRooms.get(conversationId).add(socket.userId);

    console.log(`User ${socket.userId} joined conversation ${conversationId}`);
  });

  // Handle leaving conversation rooms
  socket.on('leave_conversation', (conversationId) => {
    socket.leave(conversationId);

    if (conversationRooms.has(conversationId)) {
      conversationRooms.get(conversationId).delete(socket.userId);
    }

    console.log(`User ${socket.userId} left conversation ${conversationId}`);
  });

  // Handle sending messages
  socket.on('send_message', (data) => {
    const { conversationId, message, timestamp } = data;

    const messageData = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      senderId: socket.userId,
      content: message,
      timestamp: timestamp || new Date().toISOString(),
      type: 'text',
      status: 'sent'
    };

    // Broadcast message to all users in the conversation
    socket.to(conversationId).emit('message_received', messageData);

    console.log(`Message sent in conversation ${conversationId}:`, messageData);
  });

  // Handle typing indicators
  socket.on('typing_start', (conversationId) => {
    socket.to(conversationId).emit('user_typing', {
      userId: socket.userId,
      conversationId
    });
  });

  socket.on('typing_stop', (conversationId) => {
    socket.to(conversationId).emit('user_stopped_typing', {
      userId: socket.userId,
      conversationId
    });
  });

  // Handle video call signals
  socket.on('call_user', (data) => {
    const { targetUserId, offer, conversationId } = data;
    const targetUser = activeUsers.get(targetUserId);

    if (targetUser) {
      io.to(targetUser.socketId).emit('incoming_call', {
        from: socket.userId,
        offer,
        conversationId
      });
    }
  });

  socket.on('answer_call', (data) => {
    const { targetUserId, answer } = data;
    const targetUser = activeUsers.get(targetUserId);

    if (targetUser) {
      io.to(targetUser.socketId).emit('call_answered', {
        from: socket.userId,
        answer
      });
    }
  });

  socket.on('ice_candidate', (data) => {
    const { targetUserId, candidate } = data;
    const targetUser = activeUsers.get(targetUserId);

    if (targetUser) {
      io.to(targetUser.socketId).emit('ice_candidate', {
        from: socket.userId,
        candidate
      });
    }
  });

  socket.on('end_call', (data) => {
    const { targetUserId } = data;
    const targetUser = activeUsers.get(targetUserId);

    if (targetUser) {
      io.to(targetUser.socketId).emit('call_ended', {
        from: socket.userId
      });
    }
  });

  // WebRTC Video Call Signaling
  const videoCallRooms = new Map();

  socket.on('join-video-call', (data) => {
    const { sessionId, userName, isTeacher } = data;
    socket.join(sessionId);

    if (!videoCallRooms.has(sessionId)) {
      videoCallRooms.set(sessionId, new Set());
    }

    const room = videoCallRooms.get(sessionId);
    room.add({
      socketId: socket.id,
      userId: socket.userId,
      userName,
      isTeacher
    });

    // Notify others in the room
    socket.to(sessionId).emit('user-joined-video-call', {
      userId: socket.userId,
      userName,
      isTeacher
    });

    console.log(`User ${userName} joined video call ${sessionId}`);
  });

  socket.on('leave-video-call', (data) => {
    const { sessionId } = data;
    socket.leave(sessionId);

    if (videoCallRooms.has(sessionId)) {
      const room = videoCallRooms.get(sessionId);
      room.forEach(participant => {
        if (participant.socketId === socket.id) {
          room.delete(participant);
          socket.to(sessionId).emit('user-left-video-call', {
            userId: participant.userId,
            userName: participant.userName
          });
        }
      });

      if (room.size === 0) {
        videoCallRooms.delete(sessionId);
      }
    }
  });

  // WebRTC Signaling
  socket.on('webrtc-offer', (data) => {
    const { sessionId, offer } = data;
    socket.to(sessionId).emit('webrtc-offer', {
      offer,
      from: socket.userId
    });
    console.log(`WebRTC offer sent in session ${sessionId}`);
  });

  socket.on('webrtc-answer', (data) => {
    const { sessionId, answer, to } = data;
    socket.to(sessionId).emit('webrtc-answer', {
      answer,
      from: socket.userId
    });
    console.log(`WebRTC answer sent in session ${sessionId}`);
  });

  socket.on('webrtc-ice-candidate', (data) => {
    const { sessionId, candidate } = data;
    socket.to(sessionId).emit('webrtc-ice-candidate', {
      candidate,
      from: socket.userId
    });
  });

  // Video/Audio toggle events
  socket.on('video-toggle', (data) => {
    const { sessionId, isVideoEnabled } = data;
    socket.to(sessionId).emit('participant-video-toggle', {
      userId: socket.userId,
      isVideoEnabled
    });
  });

  socket.on('audio-toggle', (data) => {
    const { sessionId, isAudioEnabled } = data;
    socket.to(sessionId).emit('participant-audio-toggle', {
      userId: socket.userId,
      isAudioEnabled
    });
  });

  // Screen sharing events
  socket.on('screen-share-start', (data) => {
    const { sessionId } = data;
    socket.to(sessionId).emit('participant-screen-share-start', {
      userId: socket.userId
    });
  });

  socket.on('screen-share-stop', (data) => {
    const { sessionId } = data;
    socket.to(sessionId).emit('participant-screen-share-stop', {
      userId: socket.userId
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);

    if (socket.userId) {
      activeUsers.delete(socket.userId);

      // Remove from all conversation rooms
      conversationRooms.forEach((users, conversationId) => {
        users.delete(socket.userId);
      });

      // Broadcast online users update
      io.emit('online_users_updated', Array.from(activeUsers.keys()));
    }
  });
});

server.listen(port, () => {
  console.log(`🚀 Backend server running at http://localhost:${port}`);
  console.log(`📋 Health check: http://localhost:${port}/health`);
  console.log(`🔐 Auth: http://localhost:${port}/api/auth/*`);
  console.log(`🎓 AI Assessment: http://localhost:${port}/api/ai/assessment/*`);
  console.log(`🔄 Skill Swap: http://localhost:${port}/api/skill-swap/*`);
  console.log(`👥 Social Learning: http://localhost:${port}/api/social/*`);
  console.log(`🤝 Collaboration: http://localhost:${port}/api/collaboration/*`);
  console.log(`🌟 Community: http://localhost:${port}/api/community/*`);
  console.log(`🔍 Search: http://localhost:${port}/api/search*`);
  console.log(`💬 WebSocket server ready for real-time features`);
});