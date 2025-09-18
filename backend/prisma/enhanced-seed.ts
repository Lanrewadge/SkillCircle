import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting enhanced seed...')

  // Create comprehensive skill categories
  const categories = await Promise.all([
    // Technology & Programming
    prisma.skillCategory.upsert({
      where: { name: 'Technology & Programming' },
      update: {},
      create: {
        name: 'Technology & Programming',
        description: 'Software development, web technologies, mobile apps, and emerging tech',
        icon: '💻',
        color: '#3B82F6'
      }
    }),

    // Data Science & AI
    prisma.skillCategory.upsert({
      where: { name: 'Data Science & AI' },
      update: {},
      create: {
        name: 'Data Science & AI',
        description: 'Machine learning, data analysis, artificial intelligence, and big data',
        icon: '🤖',
        color: '#6366F1'
      }
    }),

    // Design & Creative Arts
    prisma.skillCategory.upsert({
      where: { name: 'Design & Creative Arts' },
      update: {},
      create: {
        name: 'Design & Creative Arts',
        description: 'Graphic design, UI/UX, digital art, photography, and creative expression',
        icon: '🎨',
        color: '#EC4899'
      }
    }),

    // Business & Entrepreneurship
    prisma.skillCategory.upsert({
      where: { name: 'Business & Entrepreneurship' },
      update: {},
      create: {
        name: 'Business & Entrepreneurship',
        description: 'Business strategy, marketing, finance, leadership, and startup skills',
        icon: '💼',
        color: '#059669'
      }
    }),

    // Languages & Communication
    prisma.skillCategory.upsert({
      where: { name: 'Languages & Communication' },
      update: {},
      create: {
        name: 'Languages & Communication',
        description: 'Foreign languages, public speaking, writing, and communication skills',
        icon: '🗣️',
        color: '#10B981'
      }
    }),

    // Health & Wellness
    prisma.skillCategory.upsert({
      where: { name: 'Health & Wellness' },
      update: {},
      create: {
        name: 'Health & Wellness',
        description: 'Fitness, nutrition, mental health, yoga, and wellness practices',
        icon: '🧘',
        color: '#8B5CF6'
      }
    }),

    // Culinary Arts
    prisma.skillCategory.upsert({
      where: { name: 'Culinary Arts' },
      update: {},
      create: {
        name: 'Culinary Arts',
        description: 'Cooking techniques, baking, international cuisines, and food presentation',
        icon: '🍳',
        color: '#EF4444'
      }
    }),

    // Music & Audio
    prisma.skillCategory.upsert({
      where: { name: 'Music & Audio' },
      update: {},
      create: {
        name: 'Music & Audio',
        description: 'Musical instruments, composition, audio production, and music theory',
        icon: '🎵',
        color: '#F59E0B'
      }
    }),

    // Sports & Fitness
    prisma.skillCategory.upsert({
      where: { name: 'Sports & Fitness' },
      update: {},
      create: {
        name: 'Sports & Fitness',
        description: 'Athletic training, sports coaching, outdoor activities, and physical fitness',
        icon: '⚽',
        color: '#06B6D4'
      }
    }),

    // Crafts & Hobbies
    prisma.skillCategory.upsert({
      where: { name: 'Crafts & Hobbies' },
      update: {},
      create: {
        name: 'Crafts & Hobbies',
        description: 'DIY projects, woodworking, knitting, gardening, and creative hobbies',
        icon: '🔨',
        color: '#84CC16'
      }
    }),

    // Academic & Education
    prisma.skillCategory.upsert({
      where: { name: 'Academic & Education' },
      update: {},
      create: {
        name: 'Academic & Education',
        description: 'Math, science, history, test preparation, and educational support',
        icon: '📚',
        color: '#0EA5E9'
      }
    }),

    // Life Skills
    prisma.skillCategory.upsert({
      where: { name: 'Life Skills' },
      update: {},
      create: {
        name: 'Life Skills',
        description: 'Personal development, time management, financial literacy, and practical skills',
        icon: '🌟',
        color: '#F97316'
      }
    })
  ])

  console.log('✅ Enhanced categories created')

  // Create diverse skills with rich content
  const skills = [
    // Technology & Programming
    {
      name: 'React Development',
      description: 'Master modern React with hooks, context, state management, and best practices for building scalable web applications',
      categoryId: categories[0].id,
      difficulty: 'INTERMEDIATE',
      duration: '3-4 months',
      prerequisites: 'JavaScript fundamentals,HTML/CSS,ES6+ features',
      learningOutcomes: 'Build complex React applications with hooks,Implement state management with Context API and Redux,Create reusable components and custom hooks,Optimize React apps for performance,Test React components effectively',
      tags: 'JavaScript,Frontend,Web Development,React Hooks,Redux',
      popularity: 95,
      averageRating: 4.8
    },
    {
      name: 'Python Programming',
      description: 'Comprehensive Python programming from basics to advanced topics including web development, data science, and automation',
      categoryId: categories[0].id,
      difficulty: 'BEGINNER',
      duration: '2-6 months',
      prerequisites: 'Basic computer literacy',
      learningOutcomes: 'Write clean, efficient Python code,Build web applications with Django/Flask,Automate tasks and processes,Work with databases and APIs,Apply Python to data analysis',
      tags: 'Python,Backend,Automation,Scripting,Django',
      popularity: 98,
      averageRating: 4.7
    },
    {
      name: 'Full-Stack JavaScript',
      description: 'Complete full-stack development with Node.js, Express, React, and MongoDB',
      categoryId: categories[0].id,
      difficulty: 'ADVANCED',
      duration: '4-6 months',
      prerequisites: ['JavaScript proficiency', 'HTML/CSS', 'Basic database knowledge'],
      learningOutcomes: [
        'Build complete web applications',
        'Create RESTful APIs with Node.js',
        'Implement authentication and authorization',
        'Deploy applications to production',
        'Optimize full-stack performance'
      ],
      tags: ['JavaScript', 'Node.js', 'React', 'MongoDB', 'Express'],
      popularity: 89,
      averageRating: 4.6
    },

    // Data Science & AI
    {
      name: 'Machine Learning Fundamentals',
      description: 'Introduction to machine learning algorithms, data preprocessing, model training, and evaluation',
      categoryId: categories[1].id,
      difficulty: 'INTERMEDIATE',
      duration: '3-5 months',
      prerequisites: ['Python programming', 'Basic statistics', 'Linear algebra basics'],
      learningOutcomes: [
        'Understand core ML algorithms',
        'Preprocess and clean datasets',
        'Train and evaluate ML models',
        'Implement scikit-learn workflows',
        'Apply ML to real-world problems'
      ],
      tags: ['Machine Learning', 'Python', 'Scikit-learn', 'Data Analysis', 'Statistics'],
      popularity: 92,
      averageRating: 4.7
    },
    {
      name: 'Data Visualization',
      description: 'Create compelling data visualizations using tools like Tableau, Power BI, and Python libraries',
      categoryId: categories[1].id,
      difficulty: 'BEGINNER',
      duration: '2-3 months',
      prerequisites: ['Basic data analysis knowledge'],
      learningOutcomes: [
        'Design effective data visualizations',
        'Use Tableau and Power BI proficiently',
        'Create interactive dashboards',
        'Apply visualization best practices',
        'Tell stories with data'
      ],
      tags: ['Data Visualization', 'Tableau', 'Power BI', 'Charts', 'Dashboard'],
      popularity: 85,
      averageRating: 4.5
    },

    // Design & Creative Arts
    {
      name: 'UI/UX Design',
      description: 'Comprehensive user interface and user experience design with industry-standard tools and methodologies',
      categoryId: categories[2].id,
      difficulty: 'INTERMEDIATE',
      duration: '3-4 months',
      prerequisites: ['Design fundamentals', 'Basic understanding of web/mobile'],
      learningOutcomes: [
        'Design user-centered interfaces',
        'Conduct user research and testing',
        'Create wireframes and prototypes',
        'Master Figma and design systems',
        'Apply accessibility principles'
      ],
      tags: ['UI Design', 'UX Research', 'Figma', 'Prototyping', 'User Testing'],
      popularity: 88,
      averageRating: 4.6
    },
    {
      name: 'Digital Photography',
      description: 'Master digital photography techniques, composition, lighting, and post-processing',
      categoryId: categories[2].id,
      difficulty: 'BEGINNER',
      duration: '2-4 months',
      prerequisites: ['Camera (DSLR/mirrorless or smartphone)'],
      learningOutcomes: [
        'Understand camera settings and exposure',
        'Master composition techniques',
        'Work with natural and artificial lighting',
        'Edit photos with Lightroom/Photoshop',
        'Develop a personal photography style'
      ],
      tags: ['Photography', 'Lightroom', 'Photoshop', 'Composition', 'Lighting'],
      popularity: 78,
      averageRating: 4.4
    },

    // Business & Entrepreneurship
    {
      name: 'Digital Marketing',
      description: 'Comprehensive digital marketing including SEO, social media, content marketing, and analytics',
      categoryId: categories[3].id,
      difficulty: 'BEGINNER',
      duration: '2-3 months',
      prerequisites: ['Basic understanding of social media'],
      learningOutcomes: [
        'Develop digital marketing strategies',
        'Master SEO and content marketing',
        'Run effective social media campaigns',
        'Analyze marketing performance',
        'Create compelling marketing content'
      ],
      tags: ['Digital Marketing', 'SEO', 'Social Media', 'Content Marketing', 'Analytics'],
      popularity: 86,
      averageRating: 4.5
    },
    {
      name: 'Project Management',
      description: 'Learn modern project management methodologies including Agile, Scrum, and traditional approaches',
      categoryId: categories[3].id,
      difficulty: 'INTERMEDIATE',
      duration: '3-4 months',
      prerequisites: ['Work experience in any field'],
      learningOutcomes: [
        'Plan and execute projects effectively',
        'Master Agile and Scrum methodologies',
        'Use project management tools',
        'Lead and manage teams',
        'Prepare for PMP/Scrum Master certification'
      ],
      tags: ['Project Management', 'Agile', 'Scrum', 'Leadership', 'Planning'],
      popularity: 82,
      averageRating: 4.3
    },

    // Languages & Communication
    {
      name: 'Spanish Conversation',
      description: 'Improve Spanish speaking fluency through conversation practice, grammar, and cultural understanding',
      categoryId: categories[4].id,
      difficulty: 'BEGINNER',
      duration: '6-12 months',
      prerequisites: ['Basic Spanish vocabulary (optional)'],
      learningOutcomes: [
        'Engage in natural Spanish conversations',
        'Understand grammar in context',
        'Learn about Hispanic cultures',
        'Improve pronunciation and accent',
        'Build confidence in speaking'
      ],
      tags: ['Spanish', 'Conversation', 'Grammar', 'Pronunciation', 'Culture'],
      popularity: 91,
      averageRating: 4.8
    },
    {
      name: 'Public Speaking',
      description: 'Overcome fear and master the art of public speaking, presentation skills, and audience engagement',
      categoryId: categories[4].id,
      difficulty: 'BEGINNER',
      duration: '1-3 months',
      prerequisites: ['None'],
      learningOutcomes: [
        'Deliver confident presentations',
        'Structure compelling speeches',
        'Manage speaking anxiety',
        'Engage any audience effectively',
        'Use visual aids effectively'
      ],
      tags: ['Public Speaking', 'Presentation', 'Communication', 'Confidence', 'Leadership'],
      popularity: 75,
      averageRating: 4.6
    },

    // Health & Wellness
    {
      name: 'Yoga for Beginners',
      description: 'Introduction to yoga practice including basic poses, breathing techniques, and mindfulness',
      categoryId: categories[5].id,
      difficulty: 'BEGINNER',
      duration: '2-3 months',
      prerequisites: ['None'],
      learningOutcomes: [
        'Practice basic yoga poses safely',
        'Learn breathing techniques',
        'Develop flexibility and strength',
        'Understand yoga philosophy',
        'Create a personal practice routine'
      ],
      tags: ['Yoga', 'Flexibility', 'Mindfulness', 'Breathing', 'Wellness'],
      popularity: 79,
      averageRating: 4.7
    },
    {
      name: 'Nutrition & Meal Planning',
      description: 'Learn evidence-based nutrition principles and create sustainable meal plans for optimal health',
      categoryId: categories[5].id,
      difficulty: 'BEGINNER',
      duration: '1-2 months',
      prerequisites: ['None'],
      learningOutcomes: [
        'Understand macronutrients and micronutrients',
        'Create balanced meal plans',
        'Read and understand food labels',
        'Plan for dietary restrictions',
        'Develop healthy eating habits'
      ],
      tags: ['Nutrition', 'Meal Planning', 'Health', 'Diet', 'Wellness'],
      popularity: 73,
      averageRating: 4.4
    },

    // Culinary Arts
    {
      name: 'Italian Cooking',
      description: 'Authentic Italian cooking techniques, traditional recipes, and regional specialties',
      categoryId: categories[6].id,
      difficulty: 'BEGINNER',
      duration: '2-4 months',
      prerequisites: ['Basic cooking skills'],
      learningOutcomes: [
        'Master traditional Italian techniques',
        'Cook authentic pasta dishes',
        'Understand Italian ingredients',
        'Learn regional cooking styles',
        'Create complete Italian menus'
      ],
      tags: ['Italian Cuisine', 'Pasta', 'Traditional Cooking', 'Mediterranean', 'Recipes'],
      popularity: 84,
      averageRating: 4.8
    },
    {
      name: 'Artisan Bread Baking',
      description: 'Master the art of bread making from basic loaves to complex sourdoughs and artisan breads',
      categoryId: categories[6].id,
      difficulty: 'INTERMEDIATE',
      duration: '2-6 months',
      prerequisites: ['Basic baking knowledge'],
      learningOutcomes: [
        'Understand bread science and fermentation',
        'Create perfect sourdough starter',
        'Shape and score artisan loaves',
        'Control texture and flavor development',
        'Troubleshoot common bread problems'
      ],
      tags: ['Bread Baking', 'Sourdough', 'Fermentation', 'Artisan', 'Baking Science'],
      popularity: 67,
      averageRating: 4.9
    },

    // Music & Audio
    {
      name: 'Guitar Fundamentals',
      description: 'Learn guitar from complete beginner to confident player with proper technique and music theory',
      categoryId: categories[7].id,
      difficulty: 'BEGINNER',
      duration: '3-6 months',
      prerequisites: ['Access to acoustic or electric guitar'],
      learningOutcomes: [
        'Play basic chords and strumming patterns',
        'Read guitar tabs and chord charts',
        'Understand basic music theory',
        'Play popular songs confidently',
        'Develop proper playing technique'
      ],
      tags: ['Guitar', 'Music Theory', 'Chords', 'Acoustic', 'Electric'],
      popularity: 88,
      averageRating: 4.7
    },
    {
      name: 'Music Production',
      description: 'Create professional music productions using DAW software, mixing, and mastering techniques',
      categoryId: categories[7].id,
      difficulty: 'INTERMEDIATE',
      duration: '4-8 months',
      prerequisites: ['Basic music knowledge', 'Computer with DAW software'],
      learningOutcomes: [
        'Record and edit audio professionally',
        'Mix tracks with proper balance',
        'Master songs for different platforms',
        'Use virtual instruments and effects',
        'Produce complete musical arrangements'
      ],
      tags: ['Music Production', 'DAW', 'Mixing', 'Mastering', 'Recording'],
      popularity: 71,
      averageRating: 4.5
    }
  ]

  // Create skills with enhanced data
  const createdSkills = []
  for (const skillData of skills) {
    const skill = await prisma.skill.upsert({
      where: { name_categoryId: { name: skillData.name, categoryId: skillData.categoryId } },
      update: {},
      create: skillData
    })
    createdSkills.push(skill)
  }

  console.log('✅ Enhanced skills created')

  // Create comprehensive roadmaps for each skill
  const roadmaps = [
    // React Development Roadmap
    {
      skillId: createdSkills[0].id, // React Development
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
        },
        {
          phase: 4,
          title: 'Ecosystem & Tools',
          duration: '3-4 weeks',
          topics: ['React Router', 'State Management', 'Testing', 'Build Tools'],
          milestones: ['Create multi-page applications', 'Implement global state', 'Write comprehensive tests']
        }
      ],
      resources: [
        { type: 'course', title: 'Complete React Developer Course', provider: 'Various Platforms', url: '' },
        { type: 'book', title: 'React - The Complete Guide', author: 'Maximilian Schwarzmüller' },
        { type: 'documentation', title: 'Official React Documentation', url: 'https://react.dev' },
        { type: 'practice', title: 'React Challenges', url: 'https://reactjs.org/community/courses.html' }
      ],
      projects: [
        { title: 'Todo App with Local Storage', difficulty: 'Beginner', description: 'Build a todo app with CRUD operations' },
        { title: 'Weather Dashboard', difficulty: 'Intermediate', description: 'Create a weather app using APIs' },
        { title: 'E-commerce Product Catalog', difficulty: 'Advanced', description: 'Build a full product catalog with cart functionality' },
        { title: 'Social Media Dashboard', difficulty: 'Expert', description: 'Create a complex dashboard with real-time updates' }
      ],
      certifications: [
        { name: 'Meta React Developer Certificate', provider: 'Meta', url: 'https://www.coursera.org/professional-certificates/meta-react-native-developer' },
        { name: 'React Developer Certification', provider: 'HackerRank', url: '' }
      ],
      careerPaths: [
        { title: 'Frontend Developer', salary: '$70k-120k', demand: 'High' },
        { title: 'Full-Stack Developer', salary: '$80k-140k', demand: 'Very High' },
        { title: 'React Specialist', salary: '$90k-150k', demand: 'High' },
        { title: 'Tech Lead', salary: '$120k-200k', demand: 'Medium' }
      ]
    },

    // Python Programming Roadmap
    {
      skillId: createdSkills[1].id, // Python Programming
      title: 'Python Developer Complete Path',
      description: 'Master Python programming from basics to advanced applications',
      estimatedHours: 150,
      phases: [
        {
          phase: 1,
          title: 'Python Fundamentals',
          duration: '3-4 weeks',
          topics: ['Syntax & Variables', 'Data Types', 'Control Flow', 'Functions'],
          milestones: ['Write basic Python scripts', 'Understand Python data structures', 'Create reusable functions']
        },
        {
          phase: 2,
          title: 'Object-Oriented Programming',
          duration: '2-3 weeks',
          topics: ['Classes', 'Inheritance', 'Polymorphism', 'Encapsulation'],
          milestones: ['Design class hierarchies', 'Implement OOP principles', 'Build modular applications']
        },
        {
          phase: 3,
          title: 'Libraries & Frameworks',
          duration: '4-6 weeks',
          topics: ['NumPy', 'Pandas', 'Flask/Django', 'Requests'],
          milestones: ['Build web applications', 'Process data efficiently', 'Create APIs']
        },
        {
          phase: 4,
          title: 'Advanced Topics',
          duration: '3-4 weeks',
          topics: ['Testing', 'Deployment', 'Database Integration', 'Performance'],
          milestones: ['Write comprehensive tests', 'Deploy applications', 'Optimize code performance']
        }
      ],
      resources: [
        { type: 'course', title: 'Python for Everybody', provider: 'Coursera', url: '' },
        { type: 'book', title: 'Automate the Boring Stuff with Python', author: 'Al Sweigart' },
        { type: 'documentation', title: 'Official Python Documentation', url: 'https://docs.python.org' },
        { type: 'practice', title: 'LeetCode Python Problems', url: 'https://leetcode.com' }
      ],
      projects: [
        { title: 'Personal Finance Tracker', difficulty: 'Beginner', description: 'Track expenses and income with data visualization' },
        { title: 'Web Scraper Dashboard', difficulty: 'Intermediate', description: 'Scrape data and present in a web dashboard' },
        { title: 'REST API with Authentication', difficulty: 'Advanced', description: 'Build a secure API with user management' },
        { title: 'Machine Learning Pipeline', difficulty: 'Expert', description: 'Create an end-to-end ML pipeline' }
      ],
      certifications: [
        { name: 'Python Institute PCPP', provider: 'Python Institute', url: '' },
        { name: 'Microsoft Python Developer', provider: 'Microsoft', url: '' }
      ],
      careerPaths: [
        { title: 'Python Developer', salary: '$75k-125k', demand: 'Very High' },
        { title: 'Data Scientist', salary: '$95k-160k', demand: 'High' },
        { title: 'DevOps Engineer', salary: '$85k-145k', demand: 'High' },
        { title: 'Backend Developer', salary: '$80k-135k', demand: 'High' }
      ]
    }
  ]

  // Create roadmaps
  for (const roadmapData of roadmaps) {
    await prisma.skillRoadmap.upsert({
      where: { skillId: roadmapData.skillId },
      update: {},
      create: roadmapData
    })
  }

  console.log('✅ Skill roadmaps created')

  // Create rich skill content
  const skillContent = [
    // React Development Content
    {
      skillId: createdSkills[0].id,
      type: 'article',
      title: 'Introduction to React Components',
      description: 'Understanding the building blocks of React applications',
      content: `# React Components: The Building Blocks

React components are the fundamental units of a React application. Think of them as reusable pieces of UI that encapsulate both the structure and behavior of a part of your interface.

## What is a Component?

A component is essentially a JavaScript function that returns JSX (JavaScript XML). Here's a simple example:

\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}
\`\`\`

## Types of Components

1. **Functional Components**: Simple functions that return JSX
2. **Class Components**: ES6 classes that extend React.Component (legacy)

## Key Concepts

- **Props**: Data passed to components
- **State**: Internal component data
- **JSX**: Syntax extension for JavaScript
- **Lifecycle**: Component creation, update, and destruction phases

Understanding components is crucial for building scalable React applications.`,
      level: 'BEGINNER',
      duration: 15,
      order: 1,
      tags: ['components', 'jsx', 'props', 'fundamentals']
    },
    {
      skillId: createdSkills[0].id,
      type: 'tutorial',
      title: 'Building Your First React App',
      description: 'Step-by-step tutorial for creating a React application',
      content: `# Building Your First React App

Let's create a simple React application from scratch!

## Prerequisites
- Node.js installed
- Basic JavaScript knowledge
- Code editor (VS Code recommended)

## Step 1: Create React App
\`\`\`bash
npx create-react-app my-first-app
cd my-first-app
npm start
\`\`\`

## Step 2: Understanding the File Structure
- \`src/App.js\` - Main application component
- \`src/index.js\` - Entry point
- \`public/index.html\` - HTML template

## Step 3: Creating Your First Component
\`\`\`jsx
// src/components/Greeting.js
import React from 'react';

function Greeting({ name }) {
  return (
    <div>
      <h2>Welcome to React, {name}!</h2>
      <p>You're about to embark on an amazing journey.</p>
    </div>
  );
}

export default Greeting;
\`\`\`

## Step 4: Using the Component
\`\`\`jsx
// src/App.js
import Greeting from './components/Greeting';

function App() {
  return (
    <div className="App">
      <Greeting name="Developer" />
    </div>
  );
}

export default App;
\`\`\`

Congratulations! You've built your first React component.`,
      level: 'BEGINNER',
      duration: 30,
      order: 2,
      tags: ['tutorial', 'create-react-app', 'components', 'hands-on']
    },

    // Python Programming Content
    {
      skillId: createdSkills[1].id,
      type: 'article',
      title: 'Python Fundamentals: Variables and Data Types',
      description: 'Master the basics of Python programming',
      content: `# Python Variables and Data Types

Python is a dynamically typed language, which means you don't need to declare variable types explicitly.

## Variables in Python

Variables are containers for storing data values:

\`\`\`python
# Variable assignment
name = "Alice"
age = 30
height = 5.6
is_student = True
\`\`\`

## Basic Data Types

### 1. Numbers
\`\`\`python
# Integers
count = 42
year = 2024

# Floats
price = 19.99
temperature = -5.5

# Complex numbers (advanced)
complex_num = 3 + 4j
\`\`\`

### 2. Strings
\`\`\`python
# Single or double quotes
message = "Hello, World!"
name = 'Python'

# Multi-line strings
description = """
This is a multi-line
string in Python.
"""

# String methods
print(message.upper())  # HELLO, WORLD!
print(len(name))        # 6
\`\`\`

### 3. Booleans
\`\`\`python
is_active = True
is_complete = False

# Boolean operations
result = is_active and not is_complete  # True
\`\`\`

### 4. Lists
\`\`\`python
# Ordered, mutable collections
fruits = ["apple", "banana", "orange"]
numbers = [1, 2, 3, 4, 5]
mixed = ["text", 42, True, 3.14]

# List operations
fruits.append("grape")
print(fruits[0])  # apple
\`\`\`

Understanding these fundamentals is essential for Python programming!`,
      level: 'BEGINNER',
      duration: 20,
      order: 1,
      tags: ['variables', 'data-types', 'fundamentals', 'syntax']
    },
    {
      skillId: createdSkills[1].id,
      type: 'exercise',
      title: 'Python Variables Practice',
      description: 'Hands-on exercises for mastering Python variables',
      content: `# Python Variables Exercises

Practice these exercises to strengthen your understanding of Python variables and data types.

## Exercise 1: Personal Information
Create variables to store your personal information:
\`\`\`python
# TODO: Create variables for:
# - Your full name
# - Your age
# - Your height in meters
# - Whether you are a student
# - A list of your hobbies

# Example solution:
full_name = "John Doe"
age = 25
height = 1.75
is_student = True
hobbies = ["reading", "coding", "hiking"]
\`\`\`

## Exercise 2: Calculate and Display
\`\`\`python
# Given variables
length = 10
width = 5

# TODO: Calculate area and perimeter
# area = ?
# perimeter = ?

# TODO: Display results using f-strings
# Expected output: "Area: 50, Perimeter: 30"
\`\`\`

## Exercise 3: String Manipulation
\`\`\`python
sentence = "python programming is fun"

# TODO:
# 1. Convert to title case
# 2. Count the number of words
# 3. Replace 'fun' with 'awesome'
# 4. Check if 'programming' is in the sentence
\`\`\`

## Exercise 4: List Operations
\`\`\`python
numbers = [1, 2, 3, 4, 5]

# TODO:
# 1. Add 6 to the end of the list
# 2. Insert 0 at the beginning
# 3. Remove the number 3
# 4. Find the sum of all numbers
\`\`\`

Try to solve these without looking at the solutions first!`,
      level: 'BEGINNER',
      duration: 45,
      order: 2,
      tags: ['exercises', 'practice', 'variables', 'hands-on']
    }
  ]

  // Create skill content
  for (const contentData of skillContent) {
    await prisma.skillContent.create({
      data: contentData
    })
  }

  console.log('✅ Skill content created')

  console.log('🎉 Enhanced seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })