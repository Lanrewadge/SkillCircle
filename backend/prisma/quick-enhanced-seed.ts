import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting quick enhanced seed...')

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
      prerequisites: 'JavaScript proficiency,HTML/CSS,Basic database knowledge',
      learningOutcomes: 'Build complete web applications,Create RESTful APIs with Node.js,Implement authentication and authorization,Deploy applications to production,Optimize full-stack performance',
      tags: 'JavaScript,Node.js,React,MongoDB,Express',
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
      prerequisites: 'Python programming,Basic statistics,Linear algebra basics',
      learningOutcomes: 'Understand core ML algorithms,Preprocess and clean datasets,Train and evaluate ML models,Implement scikit-learn workflows,Apply ML to real-world problems',
      tags: 'Machine Learning,Python,Scikit-learn,Data Analysis,Statistics',
      popularity: 92,
      averageRating: 4.7
    },

    // Design & Creative Arts
    {
      name: 'UI/UX Design',
      description: 'Comprehensive user interface and user experience design with industry-standard tools and methodologies',
      categoryId: categories[2].id,
      difficulty: 'INTERMEDIATE',
      duration: '3-4 months',
      prerequisites: 'Design fundamentals,Basic understanding of web/mobile',
      learningOutcomes: 'Design user-centered interfaces,Conduct user research and testing,Create wireframes and prototypes,Master Figma and design systems,Apply accessibility principles',
      tags: 'UI Design,UX Research,Figma,Prototyping,User Testing',
      popularity: 88,
      averageRating: 4.6
    },

    // Business & Entrepreneurship
    {
      name: 'Digital Marketing',
      description: 'Comprehensive digital marketing including SEO, social media, content marketing, and analytics',
      categoryId: categories[3].id,
      difficulty: 'BEGINNER',
      duration: '2-3 months',
      prerequisites: 'Basic understanding of social media',
      learningOutcomes: 'Develop digital marketing strategies,Master SEO and content marketing,Run effective social media campaigns,Analyze marketing performance,Create compelling marketing content',
      tags: 'Digital Marketing,SEO,Social Media,Content Marketing,Analytics',
      popularity: 86,
      averageRating: 4.5
    },

    // Languages & Communication
    {
      name: 'Spanish Conversation',
      description: 'Improve Spanish speaking fluency through conversation practice, grammar, and cultural understanding',
      categoryId: categories[4].id,
      difficulty: 'BEGINNER',
      duration: '6-12 months',
      prerequisites: 'Basic Spanish vocabulary (optional)',
      learningOutcomes: 'Engage in natural Spanish conversations,Understand grammar in context,Learn about Hispanic cultures,Improve pronunciation and accent,Build confidence in speaking',
      tags: 'Spanish,Conversation,Grammar,Pronunciation,Culture',
      popularity: 91,
      averageRating: 4.8
    },

    // Culinary Arts
    {
      name: 'Italian Cooking',
      description: 'Authentic Italian cooking techniques, traditional recipes, and regional specialties',
      categoryId: categories[5].id,
      difficulty: 'BEGINNER',
      duration: '2-4 months',
      prerequisites: 'Basic cooking skills',
      learningOutcomes: 'Master traditional Italian techniques,Cook authentic pasta dishes,Understand Italian ingredients,Learn regional cooking styles,Create complete Italian menus',
      tags: 'Italian Cuisine,Pasta,Traditional Cooking,Mediterranean,Recipes',
      popularity: 84,
      averageRating: 4.8
    },

    // Music & Audio
    {
      name: 'Guitar Fundamentals',
      description: 'Learn guitar from complete beginner to confident player with proper technique and music theory',
      categoryId: categories[6].id,
      difficulty: 'BEGINNER',
      duration: '3-6 months',
      prerequisites: 'Access to acoustic or electric guitar',
      learningOutcomes: 'Play basic chords and strumming patterns,Read guitar tabs and chord charts,Understand basic music theory,Play popular songs confidently,Develop proper playing technique',
      tags: 'Guitar,Music Theory,Chords,Acoustic,Electric',
      popularity: 88,
      averageRating: 4.7
    },

    // Sports & Fitness
    {
      name: 'Personal Training',
      description: 'Learn how to design effective workout programs, understand exercise science, and help others achieve their fitness goals',
      categoryId: categories[7].id,
      difficulty: 'INTERMEDIATE',
      duration: '2-4 months',
      prerequisites: 'Basic fitness knowledge,Interest in helping others',
      learningOutcomes: 'Design personalized workout programs,Understand exercise physiology,Learn proper form and technique,Develop coaching and motivation skills,Understand nutrition basics for fitness',
      tags: 'Personal Training,Exercise Science,Fitness,Coaching,Nutrition',
      popularity: 76,
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

  // Create sample roadmap for React Development
  await prisma.skillRoadmap.create({
    data: {
      skillId: createdSkills[0].id,
      title: 'Complete React Developer Roadmap',
      description: 'A comprehensive path to becoming a professional React developer',
      estimatedHours: 120,
      phases: JSON.stringify([
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
      ]),
      resources: JSON.stringify([
        { type: 'course', title: 'Complete React Developer Course', provider: 'Various Platforms' },
        { type: 'book', title: 'React - The Complete Guide', author: 'Maximilian Schwarzmüller' },
        { type: 'documentation', title: 'Official React Documentation', url: 'https://react.dev' }
      ]),
      projects: JSON.stringify([
        { title: 'Todo App with Local Storage', difficulty: 'Beginner', description: 'Build a todo app with CRUD operations' },
        { title: 'Weather Dashboard', difficulty: 'Intermediate', description: 'Create a weather app using APIs' },
        { title: 'E-commerce Product Catalog', difficulty: 'Advanced', description: 'Build a full product catalog with cart functionality' }
      ]),
      certifications: JSON.stringify([
        { name: 'Meta React Developer Certificate', provider: 'Meta' },
        { name: 'React Developer Certification', provider: 'HackerRank' }
      ]),
      careerPaths: JSON.stringify([
        { title: 'Frontend Developer', salary: '$70k-120k', demand: 'High' },
        { title: 'Full-Stack Developer', salary: '$80k-140k', demand: 'Very High' },
        { title: 'React Specialist', salary: '$90k-150k', demand: 'High' }
      ])
    }
  })

  console.log('✅ Sample roadmap created')

  // Create rich skill content for React
  const skillContent = [
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
      tags: 'components,jsx,props,fundamentals'
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

Congratulations! You've built your first React component.`,
      level: 'BEGINNER',
      duration: 30,
      order: 2,
      tags: 'tutorial,create-react-app,components,hands-on'
    }
  ]

  // Create skill content
  for (const contentData of skillContent) {
    await prisma.skillContent.create({
      data: contentData
    })
  }

  console.log('✅ Skill content created')

  console.log('🎉 Quick enhanced seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })