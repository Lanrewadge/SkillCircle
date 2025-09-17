export interface Skill {
  id: string
  name: string
  description: string
  category: SkillCategory
  levels: SkillLevel[]
  prerequisites?: string[]
  roadmap?: RoadmapStep[]
  averageHourlyRate: {
    min: number
    max: number
    currency: 'USD' | 'EUR' | 'GBP'
  }
  estimatedLearningTime: {
    beginner: string
    intermediate: string
    advanced: string
    expert: string
  }
  popularCertifications?: string[]
  relatedSkills?: string[]
}

export interface SkillCategory {
  id: string
  name: string
  icon: string
  description: string
  color: string
}

export interface SkillLevel {
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  title: string
  description: string
  requirements: string[]
  outcomes: string[]
}

export interface RoadmapStep {
  id: string
  title: string
  description: string
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  estimatedHours: number
  skills: string[]
  projects?: string[]
  resources?: {
    type: 'documentation' | 'tutorial' | 'book' | 'course'
    title: string
    url?: string
  }[]
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'technology',
    name: 'Technology',
    icon: '💻',
    description: 'Programming, web development, data science, and tech skills',
    color: 'blue'
  },
  {
    id: 'languages',
    name: 'Languages',
    icon: '🌍',
    description: 'Learn new languages and improve communication skills',
    color: 'green'
  },
  {
    id: 'creative',
    name: 'Creative Arts',
    icon: '🎨',
    description: 'Art, design, music, writing, and creative expression',
    color: 'purple'
  },
  {
    id: 'business',
    name: 'Business & Finance',
    icon: '💼',
    description: 'Entrepreneurship, marketing, finance, and business skills',
    color: 'indigo'
  },
  {
    id: 'fitness',
    name: 'Health & Fitness',
    icon: '💪',
    description: 'Physical fitness, nutrition, wellness, and sports',
    color: 'red'
  },
  {
    id: 'cooking',
    name: 'Cooking & Food',
    icon: '🍳',
    description: 'Culinary arts, baking, nutrition, and food preparation',
    color: 'orange'
  },
  {
    id: 'crafts',
    name: 'Crafts & DIY',
    icon: '🔨',
    description: 'Handmade crafts, woodworking, and DIY projects',
    color: 'yellow'
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    icon: '🌱',
    description: 'Personal development, hobbies, and life skills',
    color: 'teal'
  }
]

// Technology Skills with Comprehensive Roadmaps
export const technologySkills: Skill[] = [
  {
    id: 'react-development',
    name: 'React Development',
    description: 'Build modern, interactive user interfaces with React.js',
    category: skillCategories[0],
    averageHourlyRate: { min: 50, max: 150, currency: 'USD' },
    estimatedLearningTime: {
      beginner: '2-3 months',
      intermediate: '4-6 months',
      advanced: '8-12 months',
      expert: '2+ years'
    },
    prerequisites: ['HTML', 'CSS', 'JavaScript'],
    popularCertifications: ['Meta React Developer Certificate', 'React Nanodegree'],
    relatedSkills: ['JavaScript', 'TypeScript', 'Redux', 'Next.js'],
    levels: [
      {
        level: 'BEGINNER',
        title: 'React Fundamentals',
        description: 'Learn basic React concepts and create simple components',
        requirements: ['Basic HTML/CSS', 'JavaScript ES6 knowledge'],
        outcomes: ['Create functional components', 'Understand JSX', 'Handle basic state and props']
      },
      {
        level: 'INTERMEDIATE',
        title: 'React Application Development',
        description: 'Build complete React applications with routing and state management',
        requirements: ['React fundamentals', 'JavaScript proficiency'],
        outcomes: ['Build full applications', 'Use React Router', 'Implement hooks effectively']
      },
      {
        level: 'ADVANCED',
        title: 'React Architecture & Optimization',
        description: 'Design scalable React applications with advanced patterns',
        requirements: ['Intermediate React skills', 'Component design patterns'],
        outcomes: ['Optimize performance', 'Design complex architectures', 'Custom hooks mastery']
      },
      {
        level: 'EXPERT',
        title: 'React Ecosystem Mastery',
        description: 'Master the entire React ecosystem and contribute to open source',
        requirements: ['Advanced React knowledge', 'Deep JavaScript understanding'],
        outcomes: ['Contribute to React', 'Build libraries', 'Mentor other developers']
      }
    ],
    roadmap: [
      {
        id: 'react-basics',
        title: 'React Fundamentals',
        description: 'Master the core concepts of React',
        level: 'BEGINNER',
        estimatedHours: 40,
        skills: ['JSX', 'Components', 'Props', 'State'],
        projects: ['Todo App', 'Weather Widget', 'Contact Card'],
        resources: [
          { type: 'documentation', title: 'React Official Docs', url: 'https://react.dev' },
          { type: 'course', title: 'React Basics Course' }
        ]
      },
      {
        id: 'react-hooks',
        title: 'React Hooks Deep Dive',
        description: 'Master all React hooks and create custom ones',
        level: 'INTERMEDIATE',
        estimatedHours: 30,
        skills: ['useState', 'useEffect', 'useContext', 'Custom Hooks'],
        projects: ['Shopping Cart', 'Blog with Comments', 'Dashboard']
      },
      {
        id: 'react-routing',
        title: 'React Router & Navigation',
        description: 'Implement complex routing and navigation',
        level: 'INTERMEDIATE',
        estimatedHours: 20,
        skills: ['React Router', 'Navigation', 'Route Guards', 'Nested Routes'],
        projects: ['Multi-page Application', 'Admin Dashboard']
      },
      {
        id: 'state-management',
        title: 'Advanced State Management',
        description: 'Learn Redux, Zustand, and other state management solutions',
        level: 'ADVANCED',
        estimatedHours: 35,
        skills: ['Redux Toolkit', 'Zustand', 'React Query', 'Context API'],
        projects: ['E-commerce App', 'Social Media Dashboard']
      },
      {
        id: 'react-performance',
        title: 'Performance Optimization',
        description: 'Optimize React applications for production',
        level: 'ADVANCED',
        estimatedHours: 25,
        skills: ['React.memo', 'useMemo', 'useCallback', 'Code Splitting'],
        projects: ['Performance-optimized SPA']
      },
      {
        id: 'react-testing',
        title: 'Testing React Applications',
        description: 'Comprehensive testing strategies for React',
        level: 'ADVANCED',
        estimatedHours: 30,
        skills: ['React Testing Library', 'Jest', 'Cypress', 'Unit Testing'],
        projects: ['Fully Tested Application']
      }
    ]
  },
  {
    id: 'python-programming',
    name: 'Python Programming',
    description: 'Learn Python for web development, data science, and automation',
    category: skillCategories[0],
    averageHourlyRate: { min: 45, max: 120, currency: 'USD' },
    estimatedLearningTime: {
      beginner: '3-4 months',
      intermediate: '6-8 months',
      advanced: '10-15 months',
      expert: '2+ years'
    },
    popularCertifications: ['Python Institute PCAP', 'Google Python Certificate'],
    relatedSkills: ['Django', 'FastAPI', 'Data Science', 'Machine Learning'],
    levels: [
      {
        level: 'BEGINNER',
        title: 'Python Basics',
        description: 'Learn Python syntax and fundamental programming concepts',
        requirements: ['Basic computer literacy'],
        outcomes: ['Write basic Python scripts', 'Understand data types', 'Control flow mastery']
      },
      {
        level: 'INTERMEDIATE',
        title: 'Python Application Development',
        description: 'Build applications and work with APIs and databases',
        requirements: ['Python basics', 'Object-oriented programming concepts'],
        outcomes: ['Build CLI applications', 'Work with databases', 'API integration']
      },
      {
        level: 'ADVANCED',
        title: 'Python Frameworks & Libraries',
        description: 'Master Django, Flask, and specialized libraries',
        requirements: ['Intermediate Python', 'Web development concepts'],
        outcomes: ['Build web applications', 'Data analysis', 'Automation scripts']
      },
      {
        level: 'EXPERT',
        title: 'Python Architecture & Performance',
        description: 'Design scalable systems and optimize performance',
        requirements: ['Advanced Python knowledge', 'System design understanding'],
        outcomes: ['Architect large systems', 'Performance optimization', 'Contribute to open source']
      }
    ],
    roadmap: [
      {
        id: 'python-fundamentals',
        title: 'Python Fundamentals',
        description: 'Master Python syntax and core concepts',
        level: 'BEGINNER',
        estimatedHours: 50,
        skills: ['Variables', 'Data Types', 'Control Flow', 'Functions'],
        projects: ['Calculator', 'Number Guessing Game', 'File Organizer']
      },
      {
        id: 'python-oop',
        title: 'Object-Oriented Programming',
        description: 'Learn OOP principles in Python',
        level: 'INTERMEDIATE',
        estimatedHours: 35,
        skills: ['Classes', 'Inheritance', 'Polymorphism', 'Encapsulation'],
        projects: ['Library Management System', 'Bank Account Simulator']
      },
      {
        id: 'web-development-python',
        title: 'Web Development with Python',
        description: 'Build web applications using Django and Flask',
        level: 'INTERMEDIATE',
        estimatedHours: 60,
        skills: ['Django', 'Flask', 'REST APIs', 'Database Integration'],
        projects: ['Blog Platform', 'E-commerce API', 'Social Media App']
      },
      {
        id: 'data-science-python',
        title: 'Data Science with Python',
        description: 'Analyze data using pandas, numpy, and matplotlib',
        level: 'ADVANCED',
        estimatedHours: 45,
        skills: ['Pandas', 'NumPy', 'Matplotlib', 'Data Analysis'],
        projects: ['Sales Analysis Dashboard', 'Machine Learning Model']
      }
    ]
  },
  {
    id: 'javascript-fundamentals',
    name: 'JavaScript Fundamentals',
    description: 'Master modern JavaScript for web development',
    category: skillCategories[0],
    averageHourlyRate: { min: 40, max: 130, currency: 'USD' },
    estimatedLearningTime: {
      beginner: '2-3 months',
      intermediate: '4-6 months',
      advanced: '8-12 months',
      expert: '2+ years'
    },
    prerequisites: ['HTML', 'CSS'],
    popularCertifications: ['JavaScript Developer Certificate', 'FreeCodeCamp JS Certificate'],
    relatedSkills: ['React', 'Node.js', 'TypeScript', 'Vue.js'],
    levels: [
      {
        level: 'BEGINNER',
        title: 'JavaScript Basics',
        description: 'Learn JavaScript syntax and DOM manipulation',
        requirements: ['HTML/CSS knowledge'],
        outcomes: ['Variable and function usage', 'DOM manipulation', 'Event handling']
      },
      {
        level: 'INTERMEDIATE',
        title: 'Modern JavaScript',
        description: 'Master ES6+ features and async programming',
        requirements: ['JavaScript basics'],
        outcomes: ['ES6+ features', 'Async/await', 'Module systems']
      },
      {
        level: 'ADVANCED',
        title: 'JavaScript Architecture',
        description: 'Design patterns and advanced concepts',
        requirements: ['Intermediate JavaScript'],
        outcomes: ['Design patterns', 'Performance optimization', 'Testing']
      },
      {
        level: 'EXPERT',
        title: 'JavaScript Mastery',
        description: 'Deep understanding of JavaScript engine and ecosystem',
        requirements: ['Advanced JavaScript knowledge'],
        outcomes: ['Engine internals', 'Framework development', 'Open source contributions']
      }
    ],
    roadmap: [
      {
        id: 'js-basics',
        title: 'JavaScript Fundamentals',
        description: 'Core JavaScript concepts and syntax',
        level: 'BEGINNER',
        estimatedHours: 40,
        skills: ['Variables', 'Functions', 'Arrays', 'Objects', 'DOM'],
        projects: ['Interactive Calculator', 'To-Do List', 'Image Gallery']
      },
      {
        id: 'js-modern',
        title: 'Modern JavaScript (ES6+)',
        description: 'Latest JavaScript features and best practices',
        level: 'INTERMEDIATE',
        estimatedHours: 35,
        skills: ['Arrow Functions', 'Destructuring', 'Modules', 'Classes'],
        projects: ['Weather App', 'Quiz Application', 'Budget Tracker']
      },
      {
        id: 'js-async',
        title: 'Asynchronous JavaScript',
        description: 'Promises, async/await, and API integration',
        level: 'INTERMEDIATE',
        estimatedHours: 30,
        skills: ['Promises', 'Async/Await', 'Fetch API', 'Error Handling'],
        projects: ['Movie Database App', 'News Aggregator']
      }
    ]
  },
  {
    id: 'nodejs-development',
    name: 'Node.js Development',
    description: 'Build scalable server-side applications with Node.js',
    category: skillCategories[0],
    averageHourlyRate: { min: 55, max: 140, currency: 'USD' },
    estimatedLearningTime: {
      beginner: '3-4 months',
      intermediate: '6-8 months',
      advanced: '10-14 months',
      expert: '2+ years'
    },
    prerequisites: ['JavaScript', 'Web Development Basics'],
    popularCertifications: ['Node.js Certified Developer', 'OpenJS Node.js Services Developer'],
    relatedSkills: ['Express.js', 'MongoDB', 'PostgreSQL', 'GraphQL'],
    levels: [
      {
        level: 'BEGINNER',
        title: 'Node.js Fundamentals',
        description: 'Learn Node.js runtime and basic server development',
        requirements: ['JavaScript proficiency'],
        outcomes: ['Basic server creation', 'File system operations', 'NPM usage']
      },
      {
        level: 'INTERMEDIATE',
        title: 'Express.js & APIs',
        description: 'Build RESTful APIs and web applications',
        requirements: ['Node.js basics', 'HTTP knowledge'],
        outcomes: ['REST API development', 'Database integration', 'Authentication']
      },
      {
        level: 'ADVANCED',
        title: 'Scalable Node.js Applications',
        description: 'Build production-ready, scalable applications',
        requirements: ['Express.js knowledge', 'Database experience'],
        outcomes: ['Microservices', 'Performance optimization', 'Security best practices']
      },
      {
        level: 'EXPERT',
        title: 'Node.js Architecture',
        description: 'Design enterprise-level Node.js systems',
        requirements: ['Advanced Node.js knowledge', 'System design'],
        outcomes: ['System architecture', 'High-performance applications', 'Team leadership']
      }
    ],
    roadmap: [
      {
        id: 'node-fundamentals',
        title: 'Node.js Core Concepts',
        description: 'Understanding Node.js runtime and core modules',
        level: 'BEGINNER',
        estimatedHours: 35,
        skills: ['Node.js Runtime', 'Core Modules', 'NPM', 'File System'],
        projects: ['CLI Tool', 'File Processor', 'Simple HTTP Server']
      },
      {
        id: 'express-apis',
        title: 'Building APIs with Express.js',
        description: 'Create RESTful APIs using Express framework',
        level: 'INTERMEDIATE',
        estimatedHours: 45,
        skills: ['Express.js', 'Routing', 'Middleware', 'Error Handling'],
        projects: ['Blog API', 'E-commerce Backend', 'User Management System']
      },
      {
        id: 'database-integration',
        title: 'Database Integration',
        description: 'Connect Node.js applications to databases',
        level: 'INTERMEDIATE',
        estimatedHours: 40,
        skills: ['MongoDB', 'Mongoose', 'PostgreSQL', 'SQL/NoSQL'],
        projects: ['Social Media API', 'Inventory Management System']
      }
    ]
  },
  {
    id: 'data-science',
    name: 'Data Science',
    description: 'Extract insights from data using statistical analysis and machine learning',
    category: skillCategories[0],
    averageHourlyRate: { min: 60, max: 180, currency: 'USD' },
    estimatedLearningTime: {
      beginner: '4-6 months',
      intermediate: '8-12 months',
      advanced: '12-18 months',
      expert: '3+ years'
    },
    prerequisites: ['Python or R', 'Statistics', 'Mathematics'],
    popularCertifications: ['Google Data Analytics', 'IBM Data Science', 'Coursera ML Certificate'],
    relatedSkills: ['Machine Learning', 'Python', 'R', 'SQL', 'Tableau'],
    levels: [
      {
        level: 'BEGINNER',
        title: 'Data Analysis Basics',
        description: 'Learn data manipulation and basic statistical analysis',
        requirements: ['Basic programming', 'Statistics fundamentals'],
        outcomes: ['Data cleaning', 'Descriptive statistics', 'Data visualization']
      },
      {
        level: 'INTERMEDIATE',
        title: 'Statistical Analysis & ML',
        description: 'Apply statistical methods and basic machine learning',
        requirements: ['Data analysis experience', 'Python/R proficiency'],
        outcomes: ['Hypothesis testing', 'ML algorithms', 'Model evaluation']
      },
      {
        level: 'ADVANCED',
        title: 'Advanced Machine Learning',
        description: 'Deep learning and advanced ML techniques',
        requirements: ['ML fundamentals', 'Linear algebra knowledge'],
        outcomes: ['Deep learning', 'Advanced algorithms', 'Big data processing']
      },
      {
        level: 'EXPERT',
        title: 'Data Science Leadership',
        description: 'Lead data science projects and teams',
        requirements: ['Advanced ML knowledge', 'Business acumen'],
        outcomes: ['Project leadership', 'Business strategy', 'Research publication']
      }
    ],
    roadmap: [
      {
        id: 'data-fundamentals',
        title: 'Data Science Foundations',
        description: 'Core concepts and tools for data science',
        level: 'BEGINNER',
        estimatedHours: 60,
        skills: ['Python/R', 'Pandas', 'NumPy', 'Statistics', 'Data Cleaning'],
        projects: ['Sales Analysis', 'Customer Segmentation', 'Survey Analysis']
      },
      {
        id: 'machine-learning',
        title: 'Machine Learning Fundamentals',
        description: 'Introduction to machine learning algorithms',
        level: 'INTERMEDIATE',
        estimatedHours: 50,
        skills: ['Scikit-learn', 'Regression', 'Classification', 'Clustering'],
        projects: ['Predictive Model', 'Recommendation System', 'Image Classifier']
      },
      {
        id: 'deep-learning',
        title: 'Deep Learning',
        description: 'Neural networks and deep learning frameworks',
        level: 'ADVANCED',
        estimatedHours: 70,
        skills: ['TensorFlow', 'PyTorch', 'Neural Networks', 'CNN', 'RNN'],
        projects: ['Image Recognition', 'Natural Language Processing', 'Time Series Forecasting']
      }
    ]
  }
]

// Other category skills
export const languageSkills: Skill[] = [
  {
    id: 'spanish-language',
    name: 'Spanish Language',
    description: 'Learn Spanish for communication, travel, and business',
    category: skillCategories[1],
    averageHourlyRate: { min: 20, max: 60, currency: 'USD' },
    estimatedLearningTime: {
      beginner: '3-6 months',
      intermediate: '8-12 months',
      advanced: '12-18 months',
      expert: '2+ years'
    },
    popularCertifications: ['DELE', 'SIELE', 'CEFR'],
    relatedSkills: ['Portuguese', 'Italian', 'French'],
    levels: [
      {
        level: 'BEGINNER',
        title: 'Basic Spanish (A1-A2)',
        description: 'Learn essential vocabulary and basic grammar',
        requirements: ['No prior experience needed'],
        outcomes: ['Basic conversations', 'Present tense', '500+ vocabulary words']
      },
      {
        level: 'INTERMEDIATE',
        title: 'Conversational Spanish (B1-B2)',
        description: 'Develop fluency in everyday conversations',
        requirements: ['Basic Spanish knowledge'],
        outcomes: ['Complex conversations', 'Past/future tenses', 'Cultural understanding']
      },
      {
        level: 'ADVANCED',
        title: 'Advanced Spanish (C1)',
        description: 'Master complex grammar and professional communication',
        requirements: ['Intermediate Spanish fluency'],
        outcomes: ['Professional communication', 'Literature comprehension', 'Advanced grammar']
      },
      {
        level: 'EXPERT',
        title: 'Native-level Spanish (C2)',
        description: 'Perfect fluency and cultural mastery',
        requirements: ['Advanced Spanish knowledge'],
        outcomes: ['Native-level fluency', 'Teaching capability', 'Cultural expertise']
      }
    ],
    roadmap: [
      {
        id: 'spanish-basics',
        title: 'Spanish Fundamentals',
        description: 'Essential vocabulary and grammar basics',
        level: 'BEGINNER',
        estimatedHours: 80,
        skills: ['Pronunciation', 'Basic Vocabulary', 'Present Tense', 'Articles'],
        projects: ['Self Introduction', 'Daily Routine Description', 'Shopping Dialogue']
      },
      {
        id: 'spanish-conversation',
        title: 'Conversational Skills',
        description: 'Practice speaking and listening comprehension',
        level: 'INTERMEDIATE',
        estimatedHours: 100,
        skills: ['Past Tenses', 'Future Tense', 'Conditionals', 'Subjunctive'],
        projects: ['Travel Planning', 'Job Interview', 'Cultural Presentation']
      }
    ]
  },
  {
    id: 'french-language',
    name: 'French Language',
    description: 'Master French for travel, business, and cultural appreciation',
    category: skillCategories[1],
    averageHourlyRate: { min: 25, max: 65, currency: 'USD' },
    estimatedLearningTime: {
      beginner: '4-6 months',
      intermediate: '8-12 months',
      advanced: '12-18 months',
      expert: '2+ years'
    },
    popularCertifications: ['DELF', 'DALF', 'TCF'],
    relatedSkills: ['Spanish', 'Italian', 'Portuguese'],
    levels: [
      {
        level: 'BEGINNER',
        title: 'Basic French (A1-A2)',
        description: 'Foundation in French pronunciation and basic communication',
        requirements: ['No prior experience needed'],
        outcomes: ['Basic conversations', 'Pronunciation mastery', 'Essential vocabulary']
      },
      {
        level: 'INTERMEDIATE',
        title: 'Conversational French (B1-B2)',
        description: 'Develop fluency for daily communication',
        requirements: ['Basic French knowledge'],
        outcomes: ['Fluent conversations', 'Complex grammar', 'Cultural understanding']
      },
      {
        level: 'ADVANCED',
        title: 'Advanced French (C1)',
        description: 'Professional and academic French proficiency',
        requirements: ['Intermediate French fluency'],
        outcomes: ['Academic writing', 'Professional communication', 'Literature analysis']
      },
      {
        level: 'EXPERT',
        title: 'Native-level French (C2)',
        description: 'Complete mastery of French language and culture',
        requirements: ['Advanced French knowledge'],
        outcomes: ['Native-level proficiency', 'Teaching qualification', 'Cultural expertise']
      }
    ],
    roadmap: [
      {
        id: 'french-phonetics',
        title: 'French Pronunciation & Phonetics',
        description: 'Master French sounds and pronunciation patterns',
        level: 'BEGINNER',
        estimatedHours: 40,
        skills: ['French Sounds', 'Liaisons', 'Intonation', 'Accent'],
        projects: ['Pronunciation Practice', 'Reading Aloud', 'Phonetic Exercises']
      },
      {
        id: 'french-grammar',
        title: 'French Grammar Mastery',
        description: 'Complete understanding of French grammatical structures',
        level: 'INTERMEDIATE',
        estimatedHours: 90,
        skills: ['Verb Conjugations', 'Subjunctive', 'Agreement Rules', 'Complex Tenses'],
        projects: ['Essay Writing', 'Grammar Exercises', 'Formal Correspondence']
      }
    ]
  }
]

export const creativeSkills: Skill[] = [
  {
    id: 'digital-art',
    name: 'Digital Art & Illustration',
    description: 'Create stunning digital artwork using professional tools',
    category: skillCategories[2],
    averageHourlyRate: { min: 30, max: 100, currency: 'USD' },
    estimatedLearningTime: {
      beginner: '2-4 months',
      intermediate: '6-10 months',
      advanced: '12-18 months',
      expert: '2+ years'
    },
    popularCertifications: ['Adobe Certified Expert', 'Wacom Certified Trainer'],
    relatedSkills: ['Graphic Design', 'Animation', 'UI/UX Design'],
    levels: [
      {
        level: 'BEGINNER',
        title: 'Digital Art Basics',
        description: 'Learn fundamental digital art techniques and tools',
        requirements: ['Basic computer skills', 'Interest in art'],
        outcomes: ['Tool proficiency', 'Basic compositions', 'Color theory understanding']
      },
      {
        level: 'INTERMEDIATE',
        title: 'Illustration Techniques',
        description: 'Develop personal style and advanced techniques',
        requirements: ['Digital art basics', 'Drawing fundamentals'],
        outcomes: ['Personal style', 'Complex illustrations', 'Professional workflow']
      },
      {
        level: 'ADVANCED',
        title: 'Professional Digital Art',
        description: 'Create commercial-quality artwork and illustrations',
        requirements: ['Intermediate skills', 'Portfolio development'],
        outcomes: ['Commercial projects', 'Client work', 'Portfolio quality']
      },
      {
        level: 'EXPERT',
        title: 'Digital Art Mastery',
        description: 'Lead projects and mentor other artists',
        requirements: ['Professional experience', 'Advanced portfolio'],
        outcomes: ['Art direction', 'Teaching others', 'Industry recognition']
      }
    ],
    roadmap: [
      {
        id: 'digital-tools',
        title: 'Digital Art Tools Mastery',
        description: 'Master Photoshop, Procreate, and other digital art tools',
        level: 'BEGINNER',
        estimatedHours: 50,
        skills: ['Photoshop', 'Procreate', 'Digital Brushes', 'Layers'],
        projects: ['Character Design', 'Landscape Art', 'Portrait Study']
      },
      {
        id: 'illustration-styles',
        title: 'Illustration Styles & Techniques',
        description: 'Explore different illustration styles and find your voice',
        level: 'INTERMEDIATE',
        estimatedHours: 80,
        skills: ['Style Development', 'Composition', 'Storytelling', 'Color Harmony'],
        projects: ['Book Illustration', 'Brand Identity', 'Editorial Art']
      }
    ]
  },
  {
    id: 'guitar-playing',
    name: 'Guitar Playing',
    description: 'Learn acoustic and electric guitar from basics to advanced techniques',
    category: skillCategories[2],
    averageHourlyRate: { min: 25, max: 80, currency: 'USD' },
    estimatedLearningTime: {
      beginner: '3-6 months',
      intermediate: '8-12 months',
      advanced: '1-2 years',
      expert: '3+ years'
    },
    popularCertifications: ['RockSchool Grades', 'Trinity College London'],
    relatedSkills: ['Bass Guitar', 'Music Theory', 'Songwriting'],
    levels: [
      {
        level: 'BEGINNER',
        title: 'Guitar Fundamentals',
        description: 'Learn basic chords, strumming, and simple songs',
        requirements: ['No prior experience', 'Access to guitar'],
        outcomes: ['Basic chords', 'Strumming patterns', 'Simple songs']
      },
      {
        level: 'INTERMEDIATE',
        title: 'Guitar Techniques',
        description: 'Master barre chords, fingerpicking, and intermediate songs',
        requirements: ['Basic chord knowledge', 'Regular practice'],
        outcomes: ['Barre chords', 'Fingerpicking', 'Song repertoire']
      },
      {
        level: 'ADVANCED',
        title: 'Advanced Guitar Skills',
        description: 'Learn complex techniques and music theory',
        requirements: ['Intermediate skills', 'Music theory basics'],
        outcomes: ['Advanced techniques', 'Improvisation', 'Music composition']
      },
      {
        level: 'EXPERT',
        title: 'Guitar Mastery',
        description: 'Professional-level playing and teaching ability',
        requirements: ['Advanced skills', 'Performance experience'],
        outcomes: ['Professional performance', 'Teaching capability', 'Original compositions']
      }
    ],
    roadmap: [
      {
        id: 'guitar-basics',
        title: 'Guitar Foundation',
        description: 'Essential guitar skills and techniques',
        level: 'BEGINNER',
        estimatedHours: 60,
        skills: ['Open Chords', 'Strumming', 'Basic Theory', 'Tuning'],
        projects: ['First Song', 'Chord Progressions', 'Rhythm Exercises']
      },
      {
        id: 'guitar-intermediate',
        title: 'Expanding Your Skills',
        description: 'More complex techniques and song structures',
        level: 'INTERMEDIATE',
        estimatedHours: 80,
        skills: ['Barre Chords', 'Fingerpicking', 'Scales', 'Song Structure'],
        projects: ['Full Song Performance', 'Lead Guitar Parts', 'Acoustic Arrangements']
      }
    ]
  }
]

export const businessSkills: Skill[] = [
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    description: 'Master online marketing strategies and tools',
    category: skillCategories[3],
    averageHourlyRate: { min: 35, max: 120, currency: 'USD' },
    estimatedLearningTime: {
      beginner: '2-3 months',
      intermediate: '4-6 months',
      advanced: '8-12 months',
      expert: '1-2 years'
    },
    popularCertifications: ['Google Ads', 'Facebook Blueprint', 'HubSpot', 'Google Analytics'],
    relatedSkills: ['SEO', 'Content Marketing', 'Social Media', 'Analytics'],
    levels: [
      {
        level: 'BEGINNER',
        title: 'Digital Marketing Basics',
        description: 'Understanding digital marketing fundamentals',
        requirements: ['Basic computer skills', 'Internet familiarity'],
        outcomes: ['Marketing concepts', 'Platform awareness', 'Basic campaigns']
      },
      {
        level: 'INTERMEDIATE',
        title: 'Campaign Management',
        description: 'Create and manage digital marketing campaigns',
        requirements: ['Marketing basics', 'Platform experience'],
        outcomes: ['Campaign creation', 'Performance analysis', 'Optimization skills']
      },
      {
        level: 'ADVANCED',
        title: 'Marketing Strategy',
        description: 'Develop comprehensive marketing strategies',
        requirements: ['Campaign experience', 'Analytics knowledge'],
        outcomes: ['Strategic planning', 'Multi-channel campaigns', 'ROI optimization']
      },
      {
        level: 'EXPERT',
        title: 'Marketing Leadership',
        description: 'Lead marketing teams and drive business growth',
        requirements: ['Advanced strategy skills', 'Leadership experience'],
        outcomes: ['Team leadership', 'Business growth', 'Industry expertise']
      }
    ],
    roadmap: [
      {
        id: 'marketing-fundamentals',
        title: 'Digital Marketing Foundation',
        description: 'Core concepts and platforms overview',
        level: 'BEGINNER',
        estimatedHours: 40,
        skills: ['Marketing Concepts', 'Platform Overview', 'Target Audience', 'Content Basics'],
        projects: ['Marketing Plan', 'Audience Research', 'Content Calendar']
      },
      {
        id: 'paid-advertising',
        title: 'Paid Advertising Mastery',
        description: 'Google Ads, Facebook Ads, and other paid platforms',
        level: 'INTERMEDIATE',
        estimatedHours: 60,
        skills: ['Google Ads', 'Facebook Ads', 'Campaign Optimization', 'Conversion Tracking'],
        projects: ['Search Campaign', 'Social Media Ads', 'E-commerce Campaign']
      }
    ]
  }
]

export const cookingSkills: Skill[] = [
  {
    id: 'italian-cooking',
    name: 'Italian Cooking',
    description: 'Master authentic Italian cuisine and techniques',
    category: skillCategories[5],
    averageHourlyRate: { min: 30, max: 90, currency: 'USD' },
    estimatedLearningTime: {
      beginner: '1-2 months',
      intermediate: '3-4 months',
      advanced: '6-8 months',
      expert: '1+ year'
    },
    popularCertifications: ['Italian Culinary Institute', 'Professional Chef Certification'],
    relatedSkills: ['French Cooking', 'Baking', 'Wine Pairing'],
    levels: [
      {
        level: 'BEGINNER',
        title: 'Italian Cooking Basics',
        description: 'Learn fundamental Italian ingredients and simple dishes',
        requirements: ['Basic cooking skills', 'Kitchen equipment'],
        outcomes: ['Pasta mastery', 'Basic sauces', 'Italian ingredients knowledge']
      },
      {
        level: 'INTERMEDIATE',
        title: 'Regional Italian Cuisine',
        description: 'Explore different Italian regions and their specialties',
        requirements: ['Basic Italian cooking', 'Ingredient sourcing'],
        outcomes: ['Regional dishes', 'Advanced techniques', 'Flavor profiles']
      },
      {
        level: 'ADVANCED',
        title: 'Authentic Italian Techniques',
        description: 'Master traditional techniques and complex dishes',
        requirements: ['Intermediate skills', 'Quality ingredients access'],
        outcomes: ['Traditional techniques', 'Complex dishes', 'Menu planning']
      },
      {
        level: 'EXPERT',
        title: 'Italian Culinary Mastery',
        description: 'Professional-level Italian cooking and teaching',
        requirements: ['Advanced techniques', 'Cultural understanding'],
        outcomes: ['Professional cooking', 'Teaching ability', 'Recipe development']
      }
    ],
    roadmap: [
      {
        id: 'pasta-mastery',
        title: 'Pasta and Sauce Fundamentals',
        description: 'Master pasta making and classic Italian sauces',
        level: 'BEGINNER',
        estimatedHours: 25,
        skills: ['Fresh Pasta', 'Tomato Sauce', 'Pesto', 'Carbonara'],
        projects: ['Homemade Ravioli', 'Perfect Bolognese', 'Classic Carbonara']
      },
      {
        id: 'italian-regions',
        title: 'Regional Italian Specialties',
        description: 'Explore cuisine from different Italian regions',
        level: 'INTERMEDIATE',
        estimatedHours: 40,
        skills: ['Northern Italian', 'Southern Italian', 'Sicilian', 'Tuscan'],
        projects: ['Regional Menu', 'Traditional Risotto', 'Authentic Pizza']
      }
    ]
  }
]

// Combine all skills
export const allSkills: Skill[] = [
  ...technologySkills,
  ...languageSkills,
  ...creativeSkills,
  ...businessSkills,
  ...cookingSkills
]