export interface LearningModule {
  id: string
  title: string
  duration: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  description: string
  topics: string[]
  projects: string[]
  prerequisites: string[]
  outcomes: string[]
  certification?: string
}

export interface ComprehensiveRoadmap {
  id: string
  title: string
  description: string
  totalDuration: string
  estimatedHours: number
  careerOutcomes: string[]
  salaryRange: string
  modules: LearningModule[]
  projects: {
    title: string
    description: string
    technologies: string[]
    complexity: 'Simple' | 'Medium' | 'Complex' | 'Enterprise'
    duration: string
  }[]
  certifications: string[]
  jobRoles: string[]
}

export const comprehensiveRoadmaps: Record<string, ComprehensiveRoadmap> = {
  'web-development': {
    id: 'web-development',
    title: 'Full-Stack Web Developer',
    description: 'Master modern web development from frontend to backend, including the latest frameworks and deployment strategies.',
    totalDuration: '12-18 months',
    estimatedHours: 800,
    careerOutcomes: [
      'Frontend Developer',
      'Backend Developer',
      'Full-Stack Developer',
      'React Developer',
      'Node.js Developer',
      'DevOps Engineer'
    ],
    salaryRange: '$65,000 - $150,000+',
    modules: [
      {
        id: 'foundations',
        title: 'Web Development Foundations',
        duration: '6-8 weeks',
        difficulty: 'Beginner',
        description: 'Build a solid foundation in web technologies',
        topics: [
          'HTML5 Semantic Elements',
          'CSS3 Flexbox & Grid',
          'JavaScript ES6+ Features',
          'DOM Manipulation',
          'Browser DevTools',
          'Version Control with Git',
          'Command Line Basics',
          'Package Managers (npm/yarn)'
        ],
        projects: [
          'Personal Portfolio Website',
          'Interactive Landing Page',
          'Calculator App',
          'Todo List Application'
        ],
        prerequisites: [],
        outcomes: [
          'Create responsive web pages',
          'Use modern JavaScript features',
          'Manage code with Git',
          'Debug web applications'
        ]
      },
      {
        id: 'frontend-frameworks',
        title: 'Modern Frontend Development',
        duration: '8-10 weeks',
        difficulty: 'Intermediate',
        description: 'Master React ecosystem and modern frontend tools',
        topics: [
          'React Components & JSX',
          'State Management (useState, useReducer)',
          'Effect Hooks & Lifecycle',
          'Context API & Props Drilling',
          'React Router for SPA',
          'TypeScript Integration',
          'Testing with Jest & RTL',
          'CSS-in-JS (Styled Components)',
          'Build Tools (Vite, Webpack)',
          'Performance Optimization'
        ],
        projects: [
          'E-commerce Product Catalog',
          'Social Media Dashboard',
          'Real-time Chat Application',
          'Movie Search App with API'
        ],
        prerequisites: ['foundations'],
        outcomes: [
          'Build complex React applications',
          'Implement state management',
          'Write unit tests',
          'Optimize application performance'
        ]
      },
      {
        id: 'backend-development',
        title: 'Backend & API Development',
        duration: '8-10 weeks',
        difficulty: 'Intermediate',
        description: 'Build robust server-side applications and APIs',
        topics: [
          'Node.js & Express.js',
          'RESTful API Design',
          'GraphQL Fundamentals',
          'Database Design (SQL/NoSQL)',
          'MongoDB & Mongoose',
          'PostgreSQL & Prisma',
          'Authentication & Authorization',
          'JWT & Session Management',
          'Error Handling & Logging',
          'API Documentation (Swagger)'
        ],
        projects: [
          'Blog API with CRUD operations',
          'User Authentication System',
          'E-commerce Backend',
          'Real-time Notification Service'
        ],
        prerequisites: ['foundations'],
        outcomes: [
          'Design and build REST APIs',
          'Implement secure authentication',
          'Work with databases',
          'Handle server-side logic'
        ]
      },
      {
        id: 'fullstack-integration',
        title: 'Full-Stack Integration',
        duration: '6-8 weeks',
        difficulty: 'Advanced',
        description: 'Connect frontend and backend for complete applications',
        topics: [
          'Frontend-Backend Communication',
          'State Management (Redux/Zustand)',
          'Real-time Features (WebSockets)',
          'File Upload & Processing',
          'Payment Integration (Stripe)',
          'Email Services',
          'Caching Strategies',
          'API Rate Limiting',
          'Security Best Practices',
          'Performance Monitoring'
        ],
        projects: [
          'Full-Stack E-commerce Platform',
          'Social Media Application',
          'Project Management Tool',
          'Learning Management System'
        ],
        prerequisites: ['frontend-frameworks', 'backend-development'],
        outcomes: [
          'Build complete web applications',
          'Implement real-time features',
          'Handle payments and transactions',
          'Optimize full-stack performance'
        ]
      },
      {
        id: 'deployment-devops',
        title: 'Deployment & DevOps',
        duration: '4-6 weeks',
        difficulty: 'Advanced',
        description: 'Deploy and maintain applications in production',
        topics: [
          'Cloud Platforms (AWS, Vercel, Netlify)',
          'Docker Containerization',
          'CI/CD Pipelines',
          'Environment Configuration',
          'Domain & DNS Setup',
          'SSL Certificates',
          'Database Hosting',
          'Monitoring & Analytics',
          'Error Tracking (Sentry)',
          'Performance Optimization'
        ],
        projects: [
          'Dockerized Application Deployment',
          'CI/CD Pipeline Setup',
          'Production Environment Configuration',
          'Monitoring Dashboard'
        ],
        prerequisites: ['fullstack-integration'],
        outcomes: [
          'Deploy applications to production',
          'Set up automated deployments',
          'Monitor application health',
          'Handle production issues'
        ],
        certification: 'AWS Cloud Practitioner'
      }
    ],
    projects: [
      {
        title: 'E-commerce Platform',
        description: 'Full-featured online store with user authentication, product catalog, shopping cart, payment processing, and admin dashboard',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'JWT'],
        complexity: 'Enterprise',
        duration: '6-8 weeks'
      },
      {
        title: 'Social Media Application',
        description: 'Real-time social platform with posts, comments, likes, messaging, and user profiles',
        technologies: ['React', 'Express', 'Socket.io', 'PostgreSQL', 'Redis'],
        complexity: 'Complex',
        duration: '4-6 weeks'
      },
      {
        title: 'Project Management Tool',
        description: 'Collaborative workspace with task management, team communication, and progress tracking',
        technologies: ['Next.js', 'Prisma', 'WebSockets', 'TypeScript'],
        complexity: 'Complex',
        duration: '4-5 weeks'
      },
      {
        title: 'Personal Portfolio',
        description: 'Professional portfolio showcasing your projects with modern design and animations',
        technologies: ['React', 'Framer Motion', 'Vercel'],
        complexity: 'Medium',
        duration: '2-3 weeks'
      }
    ],
    certifications: [
      'AWS Certified Developer',
      'Google Cloud Developer',
      'Meta Frontend Developer',
      'freeCodeCamp Full Stack'
    ],
    jobRoles: [
      'Frontend Developer',
      'Backend Developer',
      'Full-Stack Developer',
      'React Developer',
      'JavaScript Developer',
      'Web Application Developer'
    ]
  },

  'data-science-ai': {
    id: 'data-science-ai',
    title: 'Data Scientist & AI Specialist',
    description: 'Master data science, machine learning, and artificial intelligence with hands-on projects and real-world applications.',
    totalDuration: '15-20 months',
    estimatedHours: 1000,
    careerOutcomes: [
      'Data Scientist',
      'Machine Learning Engineer',
      'AI Research Scientist',
      'Data Analyst',
      'ML Ops Engineer'
    ],
    salaryRange: '$80,000 - $200,000+',
    modules: [
      {
        id: 'python-foundations',
        title: 'Python & Data Foundations',
        duration: '6-8 weeks',
        difficulty: 'Beginner',
        description: 'Master Python programming and essential data science libraries',
        topics: [
          'Python Programming Fundamentals',
          'NumPy for Numerical Computing',
          'Pandas for Data Manipulation',
          'Matplotlib & Seaborn Visualization',
          'Jupyter Notebooks',
          'Data Cleaning Techniques',
          'Exploratory Data Analysis',
          'Statistical Foundations'
        ],
        projects: [
          'Weather Data Analysis',
          'Sales Performance Dashboard',
          'COVID-19 Data Exploration',
          'Stock Price Visualization'
        ],
        prerequisites: [],
        outcomes: [
          'Write efficient Python code',
          'Manipulate data with Pandas',
          'Create compelling visualizations',
          'Perform statistical analysis'
        ]
      },
      {
        id: 'machine-learning',
        title: 'Machine Learning Fundamentals',
        duration: '10-12 weeks',
        difficulty: 'Intermediate',
        description: 'Learn core ML algorithms and techniques',
        topics: [
          'Supervised Learning Algorithms',
          'Unsupervised Learning (Clustering, PCA)',
          'Scikit-learn Library',
          'Feature Engineering',
          'Model Selection & Validation',
          'Cross-validation Techniques',
          'Hyperparameter Tuning',
          'Ensemble Methods',
          'Model Evaluation Metrics',
          'Bias-Variance Tradeoff'
        ],
        projects: [
          'House Price Prediction Model',
          'Customer Segmentation Analysis',
          'Fraud Detection System',
          'Recommendation Engine'
        ],
        prerequisites: ['python-foundations'],
        outcomes: [
          'Build predictive models',
          'Evaluate model performance',
          'Apply feature engineering',
          'Tune hyperparameters'
        ]
      },
      {
        id: 'deep-learning',
        title: 'Deep Learning & Neural Networks',
        duration: '12-14 weeks',
        difficulty: 'Advanced',
        description: 'Master deep learning with TensorFlow and PyTorch',
        topics: [
          'Neural Network Fundamentals',
          'TensorFlow & Keras',
          'PyTorch Framework',
          'Convolutional Neural Networks',
          'Recurrent Neural Networks',
          'LSTM & GRU Networks',
          'Computer Vision Applications',
          'Natural Language Processing',
          'Transfer Learning',
          'Generative Adversarial Networks'
        ],
        projects: [
          'Image Classification System',
          'Sentiment Analysis Tool',
          'Chatbot Development',
          'Style Transfer Application'
        ],
        prerequisites: ['machine-learning'],
        outcomes: [
          'Design neural networks',
          'Implement computer vision solutions',
          'Build NLP applications',
          'Use transfer learning'
        ]
      },
      {
        id: 'mlops-deployment',
        title: 'MLOps & Model Deployment',
        duration: '6-8 weeks',
        difficulty: 'Advanced',
        description: 'Deploy and maintain ML models in production',
        topics: [
          'Model Versioning & Tracking',
          'MLflow & Experiment Tracking',
          'Docker for ML Applications',
          'Cloud Deployment (AWS, GCP)',
          'API Development for ML Models',
          'Model Monitoring & Maintenance',
          'A/B Testing for ML',
          'CI/CD for Machine Learning',
          'Data Pipeline Automation',
          'Model Performance Monitoring'
        ],
        projects: [
          'ML Model API Service',
          'Automated ML Pipeline',
          'Model Monitoring Dashboard',
          'Production ML System'
        ],
        prerequisites: ['deep-learning'],
        outcomes: [
          'Deploy models to production',
          'Build ML pipelines',
          'Monitor model performance',
          'Implement MLOps practices'
        ],
        certification: 'AWS Machine Learning Specialty'
      }
    ],
    projects: [
      {
        title: 'Predictive Analytics Platform',
        description: 'End-to-end platform for business forecasting with automated model training and deployment',
        technologies: ['Python', 'TensorFlow', 'FastAPI', 'Docker', 'AWS'],
        complexity: 'Enterprise',
        duration: '8-10 weeks'
      },
      {
        title: 'Computer Vision Application',
        description: 'Real-time object detection and classification system for security applications',
        technologies: ['PyTorch', 'OpenCV', 'Flask', 'React'],
        complexity: 'Complex',
        duration: '6-8 weeks'
      },
      {
        title: 'NLP Chatbot',
        description: 'Intelligent customer service chatbot with sentiment analysis and intent recognition',
        technologies: ['Transformers', 'Hugging Face', 'FastAPI', 'PostgreSQL'],
        complexity: 'Complex',
        duration: '5-7 weeks'
      }
    ],
    certifications: [
      'AWS Certified Machine Learning',
      'Google Cloud ML Engineer',
      'Microsoft Azure AI Engineer',
      'TensorFlow Developer Certificate'
    ],
    jobRoles: [
      'Data Scientist',
      'Machine Learning Engineer',
      'AI Research Scientist',
      'Data Analyst',
      'MLOps Engineer',
      'Computer Vision Engineer'
    ]
  },

  'mobile-development': {
    id: 'mobile-development',
    title: 'Mobile App Developer',
    description: 'Create native and cross-platform mobile applications for iOS and Android with modern frameworks.',
    totalDuration: '10-14 months',
    estimatedHours: 700,
    careerOutcomes: [
      'iOS Developer',
      'Android Developer',
      'React Native Developer',
      'Flutter Developer',
      'Mobile App Developer'
    ],
    salaryRange: '$70,000 - $160,000+',
    modules: [
      {
        id: 'mobile-fundamentals',
        title: 'Mobile Development Fundamentals',
        duration: '4-6 weeks',
        difficulty: 'Beginner',
        description: 'Learn mobile development concepts and platform differences',
        topics: [
          'Mobile Platform Overview (iOS/Android)',
          'Mobile UI/UX Design Principles',
          'App Store Guidelines',
          'Mobile Performance Considerations',
          'Platform-specific Features',
          'Device Testing Strategies',
          'Mobile Security Basics',
          'App Distribution Process'
        ],
        projects: [
          'Simple Calculator App',
          'Weather Information App',
          'Note-taking Application',
          'Timer and Stopwatch App'
        ],
        prerequisites: [],
        outcomes: [
          'Understand mobile platforms',
          'Design mobile-first interfaces',
          'Navigate app store processes',
          'Implement mobile best practices'
        ]
      },
      {
        id: 'react-native',
        title: 'React Native Development',
        duration: '8-10 weeks',
        difficulty: 'Intermediate',
        description: 'Build cross-platform apps with React Native',
        topics: [
          'React Native Components',
          'Navigation (React Navigation)',
          'State Management (Redux/Context)',
          'Native Module Integration',
          'Platform-specific Code',
          'Animations & Gestures',
          'Push Notifications',
          'Camera & Media Access',
          'Local Storage Solutions',
          'Performance Optimization'
        ],
        projects: [
          'Social Media Feed App',
          'E-commerce Mobile App',
          'Fitness Tracking Application',
          'Chat Messaging App'
        ],
        prerequisites: ['mobile-fundamentals'],
        outcomes: [
          'Build cross-platform mobile apps',
          'Implement complex navigation',
          'Handle device features',
          'Optimize app performance'
        ]
      },
      {
        id: 'native-development',
        title: 'Native Development (iOS/Android)',
        duration: '10-12 weeks',
        difficulty: 'Advanced',
        description: 'Master platform-specific native development',
        topics: [
          'Swift for iOS Development',
          'Kotlin for Android Development',
          'UIKit & SwiftUI',
          'Android Jetpack Compose',
          'Core Data & Room Database',
          'Networking & API Integration',
          'Background Processing',
          'In-App Purchases',
          'App Analytics & Crash Reporting',
          'Advanced UI Patterns'
        ],
        projects: [
          'iOS News Reader App',
          'Android Expense Tracker',
          'Cross-platform Game',
          'Productivity Suite App'
        ],
        prerequisites: ['react-native'],
        outcomes: [
          'Develop native iOS apps',
          'Create native Android apps',
          'Implement platform features',
          'Publish to app stores'
        ]
      },
      {
        id: 'advanced-mobile',
        title: 'Advanced Mobile Features',
        duration: '6-8 weeks',
        difficulty: 'Expert',
        description: 'Implement advanced mobile capabilities',
        topics: [
          'Augmented Reality (ARKit/ARCore)',
          'Machine Learning on Mobile',
          'Offline Data Synchronization',
          'Real-time Communication',
          'Advanced Security Features',
          'Mobile CI/CD Pipelines',
          'App Performance Monitoring',
          'Cross-platform Code Sharing',
          'Micro-frontend Architecture',
          'Progressive Web Apps'
        ],
        projects: [
          'AR Shopping Experience',
          'Real-time Collaboration App',
          'Offline-first Application',
          'Mobile ML Inference App'
        ],
        prerequisites: ['native-development'],
        outcomes: [
          'Implement AR/VR features',
          'Build offline-capable apps',
          'Integrate ML models',
          'Optimize for performance'
        ]
      }
    ],
    projects: [
      {
        title: 'Social Media Mobile App',
        description: 'Complete social platform with real-time messaging, photo sharing, and social features',
        technologies: ['React Native', 'Firebase', 'Redux', 'Socket.io'],
        complexity: 'Enterprise',
        duration: '8-10 weeks'
      },
      {
        title: 'E-commerce Mobile Store',
        description: 'Full-featured shopping app with payments, user accounts, and product catalog',
        technologies: ['Flutter', 'Stripe', 'Firebase', 'Provider'],
        complexity: 'Complex',
        duration: '6-8 weeks'
      },
      {
        title: 'Fitness Tracking App',
        description: 'Health and fitness tracker with workout plans, progress monitoring, and social features',
        technologies: ['Swift', 'HealthKit', 'Core Data', 'Charts'],
        complexity: 'Complex',
        duration: '5-7 weeks'
      }
    ],
    certifications: [
      'Google Associate Android Developer',
      'Apple iOS App Development',
      'Meta React Native Specialist',
      'Google Flutter Developer'
    ],
    jobRoles: [
      'iOS Developer',
      'Android Developer',
      'React Native Developer',
      'Flutter Developer',
      'Mobile App Developer',
      'Cross-platform Developer'
    ]
  }
}