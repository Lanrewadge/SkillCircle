'use client';

import React, { useState } from 'react';
import {
  Cog,
  Cpu,
  Wrench,
  Zap,
  Car,
  Building2,
  Plane,
  Atom,
  Factory,
  Smartphone,
  Play,
  BookOpen,
  Users,
  Award,
  Clock,
  Star,
  TrendingUp,
  Globe,
  Calculator,
  Settings,
  Microscope,
  ChevronRight,
  Video,
  Calendar,
  Phone,
  FileText,
  Download,
  Share,
  Bookmark
} from 'lucide-react';

const engineeringSubcategories = [
  {
    id: 'mechanical-engineering',
    name: 'Mechanical Engineering',
    icon: <Cog className="w-6 h-6" />,
    description: 'Design, manufacturing, and mechanical systems analysis',
    skillCount: 150,
    color: 'bg-blue-500',
    trending: true,
    skills: ['CAD Design', 'Thermodynamics', 'Fluid Mechanics', 'Material Science', 'Manufacturing']
  },
  {
    id: 'electrical-engineering',
    name: 'Electrical Engineering',
    icon: <Zap className="w-6 h-6" />,
    description: 'Electrical systems, circuits, and power engineering',
    skillCount: 140,
    color: 'bg-yellow-500',
    trending: true,
    skills: ['Circuit Analysis', 'Digital Systems', 'Power Systems', 'Control Systems', 'Electronics']
  },
  {
    id: 'civil-engineering',
    name: 'Civil Engineering',
    icon: <Building2 className="w-6 h-6" />,
    description: 'Infrastructure, construction, and structural engineering',
    skillCount: 120,
    color: 'bg-green-500',
    trending: false,
    skills: ['Structural Analysis', 'Geotechnical', 'Transportation', 'Environmental', 'Construction']
  },
  {
    id: 'computer-engineering',
    name: 'Computer Engineering',
    icon: <Cpu className="w-6 h-6" />,
    description: 'Hardware design, embedded systems, and computer architecture',
    skillCount: 180,
    color: 'bg-purple-500',
    trending: true,
    skills: ['Digital Logic', 'Microprocessors', 'Embedded Systems', 'VLSI Design', 'Computer Architecture']
  },
  {
    id: 'chemical-engineering',
    name: 'Chemical Engineering',
    icon: <Atom className="w-6 h-6" />,
    description: 'Process design, chemical reactions, and industrial chemistry',
    skillCount: 110,
    color: 'bg-red-500',
    trending: false,
    skills: ['Process Design', 'Reaction Engineering', 'Mass Transfer', 'Heat Transfer', 'Process Control']
  },
  {
    id: 'aerospace-engineering',
    name: 'Aerospace Engineering',
    icon: <Plane className="w-6 h-6" />,
    description: 'Aircraft, spacecraft, and propulsion systems design',
    skillCount: 95,
    color: 'bg-indigo-500',
    trending: true,
    skills: ['Aerodynamics', 'Propulsion', 'Flight Mechanics', 'Space Systems', 'Avionics']
  },
  {
    id: 'automotive-engineering',
    name: 'Automotive Engineering',
    icon: <Car className="w-6 h-6" />,
    description: 'Vehicle design, manufacturing, and automotive systems',
    skillCount: 85,
    color: 'bg-gray-500',
    trending: true,
    skills: ['Vehicle Dynamics', 'Engine Design', 'Automotive Electronics', 'Safety Systems', 'Manufacturing']
  },
  {
    id: 'industrial-engineering',
    name: 'Industrial Engineering',
    icon: <Factory className="w-6 h-6" />,
    description: 'Process optimization, quality control, and systems engineering',
    skillCount: 100,
    color: 'bg-orange-500',
    trending: false,
    skills: ['Operations Research', 'Quality Control', 'Lean Manufacturing', 'Supply Chain', 'Ergonomics']
  }
];

const engineeringLearningPaths = {
  beginner: {
    title: 'Engineering Fundamentals',
    duration: '6-8 months',
    courses: [
      {
        title: 'Engineering Mathematics',
        topics: ['Calculus', 'Linear Algebra', 'Differential Equations', 'Statistics'],
        duration: '10 weeks',
        difficulty: 'Beginner'
      },
      {
        title: 'Engineering Physics',
        topics: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Modern Physics'],
        duration: '8 weeks',
        difficulty: 'Beginner'
      },
      {
        title: 'Engineering Design Process',
        topics: ['Problem Identification', 'Design Thinking', 'Prototyping', 'Testing'],
        duration: '6 weeks',
        difficulty: 'Beginner'
      },
      {
        title: 'Materials Science Basics',
        topics: ['Material Properties', 'Metals', 'Polymers', 'Ceramics'],
        duration: '8 weeks',
        difficulty: 'Beginner'
      }
    ]
  },
  intermediate: {
    title: 'Specialized Engineering',
    duration: '8-12 months',
    courses: [
      {
        title: 'Advanced CAD and Modeling',
        topics: ['3D Modeling', 'FEA Analysis', 'CFD Basics', 'Simulation'],
        duration: '12 weeks',
        difficulty: 'Intermediate'
      },
      {
        title: 'Systems Engineering',
        topics: ['System Design', 'Requirements Engineering', 'Integration', 'Testing'],
        duration: '10 weeks',
        difficulty: 'Intermediate'
      },
      {
        title: 'Project Management',
        topics: ['Planning', 'Risk Management', 'Quality Assurance', 'Team Leadership'],
        duration: '8 weeks',
        difficulty: 'Intermediate'
      },
      {
        title: 'Engineering Economics',
        topics: ['Cost Analysis', 'Economic Evaluation', 'Decision Making', 'Risk Assessment'],
        duration: '6 weeks',
        difficulty: 'Intermediate'
      }
    ]
  },
  advanced: {
    title: 'Engineering Leadership',
    duration: '6-10 months',
    courses: [
      {
        title: 'Innovation and R&D',
        topics: ['Research Methods', 'Innovation Management', 'Technology Transfer', 'IP Strategy'],
        duration: '10 weeks',
        difficulty: 'Advanced'
      },
      {
        title: 'Sustainable Engineering',
        topics: ['Life Cycle Assessment', 'Green Design', 'Environmental Impact', 'Sustainability'],
        duration: '8 weeks',
        difficulty: 'Advanced'
      },
      {
        title: 'Engineering Management',
        topics: ['Strategic Planning', 'Operations Management', 'Quality Systems', 'Leadership'],
        duration: '12 weeks',
        difficulty: 'Advanced'
      },
      {
        title: 'Emerging Technologies',
        topics: ['AI in Engineering', 'IoT Systems', 'Additive Manufacturing', 'Robotics'],
        duration: '10 weeks',
        difficulty: 'Advanced'
      }
    ]
  }
};

const engineeringRoadmaps = [
  {
    id: 'mechanical-engineer',
    title: 'Mechanical Engineer',
    description: 'Design and develop mechanical systems and devices',
    duration: '4-6 years',
    difficulty: 'Advanced',
    steps: [
      { id: 1, title: 'Engineering Mathematics', completed: false, duration: '6 months' },
      { id: 2, title: 'Physics & Mechanics', completed: false, duration: '4 months' },
      { id: 3, title: 'CAD and Design', completed: false, duration: '6 months' },
      { id: 4, title: 'Thermodynamics', completed: false, duration: '4 months' },
      { id: 5, title: 'Fluid Mechanics', completed: false, duration: '4 months' },
      { id: 6, title: 'Material Science', completed: false, duration: '3 months' },
      { id: 7, title: 'Manufacturing Processes', completed: false, duration: '6 months' },
      { id: 8, title: 'Control Systems', completed: false, duration: '4 months' },
      { id: 9, title: 'Professional Practice', completed: false, duration: '6 months' }
    ]
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    description: 'Develop software systems and applications',
    duration: '2-4 years',
    difficulty: 'Intermediate',
    steps: [
      { id: 1, title: 'Programming Fundamentals', completed: false, duration: '3 months' },
      { id: 2, title: 'Data Structures & Algorithms', completed: false, duration: '6 months' },
      { id: 3, title: 'Object-Oriented Programming', completed: false, duration: '4 months' },
      { id: 4, title: 'Database Design', completed: false, duration: '3 months' },
      { id: 5, title: 'Web Development', completed: false, duration: '6 months' },
      { id: 6, title: 'Software Engineering', completed: false, duration: '4 months' },
      { id: 7, title: 'System Design', completed: false, duration: '6 months' },
      { id: 8, title: 'DevOps & Deployment', completed: false, duration: '3 months' }
    ]
  },
  {
    id: 'civil-engineer',
    title: 'Civil Engineer',
    description: 'Design and construct infrastructure projects',
    duration: '4-5 years',
    difficulty: 'Advanced',
    steps: [
      { id: 1, title: 'Engineering Mathematics', completed: false, duration: '6 months' },
      { id: 2, title: 'Structural Analysis', completed: false, duration: '6 months' },
      { id: 3, title: 'Geotechnical Engineering', completed: false, duration: '4 months' },
      { id: 4, title: 'Transportation Engineering', completed: false, duration: '4 months' },
      { id: 5, title: 'Environmental Engineering', completed: false, duration: '4 months' },
      { id: 6, title: 'Construction Management', completed: false, duration: '6 months' },
      { id: 7, title: 'Project Planning', completed: false, duration: '3 months' },
      { id: 8, title: 'Professional Licensure', completed: false, duration: '6 months' }
    ]
  }
];

const engineeringEncyclopedia = [
  {
    category: 'Fundamentals',
    topics: [
      {
        title: 'Engineering Design Process',
        description: 'Systematic approach to solving engineering problems',
        content: 'The engineering design process is a methodical series of steps that engineers use to create functional products and processes...',
        difficulty: 'Beginner'
      },
      {
        title: 'Materials Science',
        description: 'Study of material properties and applications',
        content: 'Materials science examines the properties and applications of materials used in engineering...',
        difficulty: 'Intermediate'
      },
      {
        title: 'Statics and Dynamics',
        description: 'Analysis of forces and motion in engineering systems',
        content: 'Statics deals with forces in equilibrium, while dynamics analyzes motion and acceleration...',
        difficulty: 'Intermediate'
      }
    ]
  },
  {
    category: 'Design & Analysis',
    topics: [
      {
        title: 'Computer-Aided Design (CAD)',
        description: 'Digital design and modeling tools',
        content: 'CAD software enables engineers to create detailed 2D and 3D models of products and systems...',
        difficulty: 'Intermediate'
      },
      {
        title: 'Finite Element Analysis (FEA)',
        description: 'Numerical method for engineering analysis',
        content: 'FEA breaks down complex structures into smaller elements for computational analysis...',
        difficulty: 'Advanced'
      },
      {
        title: 'Optimization Techniques',
        description: 'Methods for improving engineering designs',
        content: 'Engineering optimization involves finding the best solution within given constraints...',
        difficulty: 'Advanced'
      }
    ]
  },
  {
    category: 'Specialized Fields',
    topics: [
      {
        title: 'Control Systems',
        description: 'Automated control of engineering systems',
        content: 'Control systems manage the behavior of dynamic systems using feedback mechanisms...',
        difficulty: 'Advanced'
      },
      {
        title: 'Robotics Engineering',
        description: 'Design and programming of robotic systems',
        content: 'Robotics combines mechanical, electrical, and software engineering to create autonomous systems...',
        difficulty: 'Advanced'
      },
      {
        title: 'Sustainable Engineering',
        description: 'Environmentally conscious engineering practices',
        content: 'Sustainable engineering considers environmental impact throughout the product lifecycle...',
        difficulty: 'Intermediate'
      }
    ]
  }
];

const EngineeringPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [activeRoadmap, setActiveRoadmap] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState('beginner');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <Globe className="w-4 h-4" /> },
    { id: 'content', name: 'Content', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'roadmaps', name: 'Roadmaps', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'encyclopedia', name: 'Encyclopedia', icon: <FileText className="w-4 h-4" /> },
    { id: 'design-lab', name: 'Design Lab', icon: <Settings className="w-4 h-4" /> }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">Engineering</h1>
        <p className="text-xl mb-6">Master the art and science of designing, building, and innovating solutions that shape our world</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold">8</div>
            <div className="text-sm opacity-90">Specializations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">980+</div>
            <div className="text-sm opacity-90">Skills</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">15M+</div>
            <div className="text-sm opacity-90">Engineers Worldwide</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">95%</div>
            <div className="text-sm opacity-90">Job Growth</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {engineeringSubcategories.map((subcategory) => (
          <div
            key={subcategory.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border"
            onClick={() => setSelectedSubcategory(subcategory)}
          >
            <div className={`${subcategory.color} rounded-lg p-3 w-12 h-12 flex items-center justify-center text-white mb-4`}>
              {subcategory.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{subcategory.name}</h3>
            <p className="text-gray-600 text-sm mb-3">{subcategory.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{subcategory.skillCount} skills</span>
              {subcategory.trending && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Trending</span>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {subcategory.skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Why Choose Engineering?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Problem Solving</h3>
            <p className="text-gray-600">Apply scientific principles to solve real-world challenges and improve lives</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Innovation</h3>
            <p className="text-gray-600">Drive technological advancement and create solutions for the future</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Career Growth</h3>
            <p className="text-gray-600">Excellent job prospects and opportunities for professional advancement</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Engineering Learning Paths</h2>
        <div className="flex space-x-4 mb-6">
          {Object.keys(engineeringLearningPaths).map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedLevel === level
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {engineeringLearningPaths[level].title}
            </button>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-semibold">{engineeringLearningPaths[selectedLevel].title}</h3>
            <span className="ml-4 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {engineeringLearningPaths[selectedLevel].duration}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {engineeringLearningPaths[selectedLevel].courses.map((course, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-lg">{course.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    course.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                    course.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {course.difficulty}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <Clock className="w-4 h-4 mr-1" />
                  {course.duration}
                </div>
                <div className="space-y-1">
                  {course.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="flex items-center text-sm text-gray-700">
                      <ChevronRight className="w-3 h-3 mr-1 text-gray-400" />
                      {topic}
                    </div>
                  ))}
                </div>
                <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center">
                  <Play className="w-4 h-4 mr-2" />
                  Start Course
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRoadmaps = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Engineering Career Roadmaps</h2>
        <div className="flex space-x-4 mb-6 overflow-x-auto">
          {engineeringRoadmaps.map((roadmap, index) => (
            <button
              key={roadmap.id}
              onClick={() => setActiveRoadmap(index)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeRoadmap === index
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {roadmap.title}
            </button>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{engineeringRoadmaps[activeRoadmap].title}</h3>
            <p className="text-gray-600 mb-4">{engineeringRoadmaps[activeRoadmap].description}</p>
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                {engineeringRoadmaps[activeRoadmap].duration}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                engineeringRoadmaps[activeRoadmap].difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                engineeringRoadmaps[activeRoadmap].difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {engineeringRoadmaps[activeRoadmap].difficulty}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {engineeringRoadmaps[activeRoadmap].steps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.id}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{step.title}</h4>
                  <span className="text-sm text-gray-600">{step.duration}</span>
                </div>
                <button className="text-blue-500 hover:text-blue-600 font-medium text-sm">
                  Start Learning
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEncyclopedia = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Engineering Encyclopedia</h2>
        <div className="space-y-6">
          {engineeringEncyclopedia.map((category, categoryIndex) => (
            <div key={categoryIndex} className="border-b pb-6 last:border-b-0">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">{category.category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.topics.map((topic, topicIndex) => (
                  <div key={topicIndex} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-lg">{topic.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        topic.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                        topic.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {topic.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{topic.description}</p>
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">{topic.content}</p>
                    <div className="flex space-x-2">
                      <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                        Read More
                      </button>
                      <button className="text-gray-500 hover:text-gray-600">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDesignLab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Engineering Design Lab</h2>
        <p className="text-gray-600 mb-6">Access professional design tools, collaborate with engineers, and test your designs</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <Calculator className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Engineering Calculator</h3>
            <p className="text-sm mb-4 opacity-90">Advanced calculators for structural, thermal, and electrical analysis</p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
              Open Calculator
            </button>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <Settings className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">3D CAD Simulator</h3>
            <p className="text-sm mb-4 opacity-90">Browser-based CAD tools for mechanical design and prototyping</p>
            <button className="bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
              Launch CAD
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <Cpu className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Circuit Simulator</h3>
            <p className="text-sm mb-4 opacity-90">Design and test electrical circuits with real-time simulation</p>
            <button className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
              Start Simulation
            </button>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <Microscope className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Materials Lab</h3>
            <p className="text-sm mb-4 opacity-90">Virtual materials testing and property analysis tools</p>
            <button className="bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
              Enter Lab
            </button>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white">
            <Video className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Design Review Sessions</h3>
            <p className="text-sm mb-4 opacity-90">Schedule video sessions with engineering mentors and peers</p>
            <button className="bg-white text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
              Schedule Session
            </button>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
            <Users className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Engineering Teams</h3>
            <p className="text-sm mb-4 opacity-90">Join collaborative engineering projects and design challenges</p>
            <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
              Join Team
            </button>
          </div>
        </div>

        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Schedule Engineering Consultation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Engineering Discipline</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option>Mechanical Engineering</option>
                <option>Electrical Engineering</option>
                <option>Civil Engineering</option>
                <option>Computer Engineering</option>
                <option>Chemical Engineering</option>
                <option>Aerospace Engineering</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option>Design Review</option>
                <option>Problem Solving</option>
                <option>Career Guidance</option>
                <option>Technical Interview Prep</option>
                <option>Project Collaboration</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex space-x-4">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Video Call
            </button>
            <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              Audio Conference
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'content':
        return renderContent();
      case 'roadmaps':
        return renderRoadmaps();
      case 'encyclopedia':
        return renderEncyclopedia();
      case 'design-lab':
        return renderDesignLab();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>

      {selectedSubcategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`${selectedSubcategory.color} rounded-lg p-3 text-white`}>
                    {selectedSubcategory.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedSubcategory.name}</h3>
                    <p className="text-gray-600">{selectedSubcategory.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSubcategory(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Key Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSubcategory.skills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  Start Learning
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  View Roadmap
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EngineeringPage;