'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import ParticleSystem from '@/components/ParticleSystem'
import MagneticCursor from '@/components/MagneticCursor'
import SkillTree from '@/components/SkillTree'
import SoundEffects from '@/components/SoundEffects'
import InteractiveRoadmap from '@/components/InteractiveRoadmap'
import FloatingNotifications from '@/components/FloatingNotifications'
import CelebrationEffects, { useCelebration } from '@/components/CelebrationEffects'
import ImmersiveBackground from '@/components/ImmersiveBackground'
import CoursePreviewModal from '@/components/CoursePreviewModal'
import TouchGestureHandler, { MobileCard, SwipeNavigation, useMobileDetection } from '@/components/TouchGestureHandler'
import CertificationPathways from '@/components/CertificationPathways'
import IndustryTracks from '@/components/IndustryTracks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Star,
  Users,
  Clock,
  TrendingUp,
  Code,
  Laptop,
  Smartphone,
  Database,
  Cloud,
  Shield,
  Brain,
  Gamepad2,
  Globe,
  ChevronLeft,
  DollarSign,
  Calendar,
  Play,
  ArrowRight,
  Sparkles,
  Zap,
  Rocket,
  Wifi,
  Satellite,
  Heart,
  Leaf
} from 'lucide-react'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
}

const floatingVariants = {
  animate: {
    y: [0, -10, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const sparkleVariants = {
  animate: {
    scale: [0, 1, 0],
    rotate: [0, 180, 360],
    opacity: [0, 1, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
      times: [0, 0.5, 1]
    }
  }
}

// Technology subcategories data
const techSubcategories = [
  {
    id: 'web-development',
    name: 'Web Development',
    icon: <Globe className="w-6 h-6" />,
    description: 'Frontend, backend, and full-stack web development',
    skillCount: 150,
    color: 'bg-blue-500',
    gradient: 'from-blue-500 to-cyan-500',
    trending: true,
    skills: [
      'React.js', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'SvelteKit',
      'Node.js', 'Express.js', 'Fastify', 'Koa.js', 'NestJS', 'Deno', 'Bun',
      'Django', 'FastAPI', 'Flask', 'Laravel', 'Symfony', 'Ruby on Rails', 'ASP.NET', 'Spring Boot',
      'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Sass', 'Less', 'Styled Components',
      'Tailwind CSS', 'Bootstrap', 'Chakra UI', 'Material-UI', 'Ant Design',
      'GraphQL', 'REST APIs', 'tRPC', 'Prisma', 'Drizzle', 'TypeORM', 'Sequelize',
      'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'ElasticSearch', 'Neo4j'
    ]
  },
  {
    id: 'mobile-development',
    name: 'Mobile App Development',
    icon: <Smartphone className="w-6 h-6" />,
    description: 'iOS, Android, and cross-platform mobile apps',
    skillCount: 120,
    color: 'bg-green-500',
    gradient: 'from-green-500 to-emerald-500',
    trending: true,
    skills: [
      'React Native', 'Flutter', 'Swift', 'SwiftUI', 'Kotlin', 'Jetpack Compose', 'Java', 'Dart',
      'Xamarin', '.NET MAUI', 'Ionic', 'Capacitor', 'Cordova', 'Unity', 'Unreal Engine',
      'iOS Development', 'Android Development', 'Cross-platform Development', 'Progressive Web Apps',
      'Mobile UI/UX', 'App Store Optimization', 'Firebase', 'Supabase', 'Appwrite',
      'SQLite', 'Realm', 'Core Data', 'Room Database', 'Expo', 'React Navigation',
      'MobX', 'Redux Toolkit', 'Zustand', 'Provider Pattern', 'BLoC Pattern'
    ]
  },
  {
    id: 'data-science-ai',
    name: 'Data Science & AI',
    icon: <Brain className="w-6 h-6" />,
    description: 'Machine learning, data analysis, and artificial intelligence',
    skillCount: 140,
    color: 'bg-purple-500',
    gradient: 'from-purple-500 to-pink-500',
    trending: true,
    skills: [
      'Python', 'R', 'Machine Learning', 'Deep Learning', 'Neural Networks',
      'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy',
      'Data Visualization', 'Tableau', 'Power BI', 'D3.js', 'Matplotlib',
      'Statistics', 'SQL', 'NoSQL', 'Big Data', 'Spark', 'Hadoop',
      'Natural Language Processing', 'Computer Vision', 'Reinforcement Learning'
    ]
  },
  {
    id: 'cloud-computing',
    name: 'Cloud Computing',
    icon: <Cloud className="w-6 h-6" />,
    description: 'AWS, Azure, Google Cloud, and cloud architecture',
    skillCount: 70,
    color: 'bg-cyan-500',
    gradient: 'from-cyan-500 to-blue-500',
    trending: true,
    skills: [
      'Amazon Web Services (AWS)', 'Microsoft Azure', 'Google Cloud Platform',
      'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins',
      'Cloud Architecture', 'Serverless Computing', 'Lambda Functions',
      'Cloud Security', 'Cloud Storage', 'CDN', 'Load Balancing',
      'Microservices', 'API Gateway', 'Container Orchestration'
    ]
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    icon: <Shield className="w-6 h-6" />,
    description: 'Information security, ethical hacking, and protection',
    skillCount: 65,
    color: 'bg-red-500',
    gradient: 'from-red-500 to-orange-500',
    trending: true,
    skills: [
      'Ethical Hacking', 'Penetration Testing', 'Network Security',
      'Web Application Security', 'Cryptography', 'Security Auditing',
      'Incident Response', 'Malware Analysis', 'Digital Forensics',
      'Security Compliance', 'Risk Assessment', 'Vulnerability Assessment',
      'CISSP', 'CEH', 'OSCP', 'Security+', 'Wireshark', 'Metasploit'
    ]
  },
  {
    id: 'devops',
    name: 'DevOps & Infrastructure',
    icon: <Laptop className="w-6 h-6" />,
    description: 'CI/CD, automation, and infrastructure management',
    skillCount: 55,
    color: 'bg-orange-500',
    gradient: 'from-orange-500 to-yellow-500',
    trending: false,
    skills: [
      'CI/CD Pipelines', 'Git', 'GitHub Actions', 'GitLab CI', 'Jenkins',
      'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Chef', 'Puppet',
      'Monitoring & Logging', 'Prometheus', 'Grafana', 'ELK Stack',
      'Linux Administration', 'Shell Scripting', 'Infrastructure as Code',
      'Configuration Management', 'Container Security'
    ]
  },
  {
    id: 'game-development',
    name: 'Game Development',
    icon: <Gamepad2 className="w-6 h-6" />,
    description: '2D/3D games, game engines, and interactive experiences',
    skillCount: 45,
    color: 'bg-pink-500',
    gradient: 'from-pink-500 to-purple-500',
    trending: false,
    skills: [
      'Unity', 'Unreal Engine', 'Godot', 'C#', 'C++', 'JavaScript',
      'Game Design', 'Level Design', 'Character Design', '3D Modeling',
      'Animation', 'Shader Programming', 'Physics Programming',
      'Mobile Game Development', 'VR Game Development', 'AR Game Development',
      'Game Testing', 'Game Optimization', 'Multiplayer Programming'
    ]
  },
  {
    id: 'blockchain',
    name: 'Blockchain & Web3',
    icon: <Database className="w-6 h-6" />,
    description: 'Cryptocurrency, smart contracts, and DeFi',
    skillCount: 85,
    color: 'bg-yellow-500',
    gradient: 'from-yellow-500 to-orange-500',
    trending: true,
    skills: [
      'Blockchain Development', 'Smart Contracts', 'Solidity', 'Vyper', 'Rust', 'Move',
      'Ethereum', 'Bitcoin', 'Polygon', 'Avalanche', 'Solana', 'Cardano', 'Polkadot',
      'DeFi Protocols', 'NFTs', 'DAOs', 'Web3.js', 'Ethers.js', 'Wagmi', 'RainbowKit',
      'IPFS', 'The Graph', 'Chainlink', 'OpenZeppelin', 'Hardhat', 'Truffle', 'Foundry',
      'MetaMask Integration', 'WalletConnect', 'Decentralized Applications (DApps)',
      'Layer 2 Solutions', 'Cross-chain Bridges', 'Zero-Knowledge Proofs', 'MEV'
    ]
  },
  {
    id: 'iot-embedded',
    name: 'IoT & Embedded Systems',
    icon: <Zap className="w-6 h-6" />,
    description: 'Internet of Things, embedded programming, and edge computing',
    skillCount: 70,
    color: 'bg-indigo-500',
    gradient: 'from-indigo-500 to-purple-500',
    trending: true,
    skills: [
      'Arduino', 'Raspberry Pi', 'ESP32', 'ESP8266', 'STM32', 'BeagleBone',
      'C/C++', 'MicroPython', 'CircuitPython', 'Rust Embedded', 'Assembly',
      'MQTT', 'CoAP', 'LoRaWAN', 'Zigbee', 'Bluetooth LE', 'WiFi', '5G',
      'Edge Computing', 'FreeRTOS', 'Zephyr', 'PlatformIO', 'Device Drivers',
      'Sensor Integration', 'Actuator Control', 'Real-time Systems', 'Low Power Design',
      'Industrial IoT', 'Smart Home', 'Wearable Tech', 'Automotive Electronics'
    ]
  },
  {
    id: 'ar-vr-metaverse',
    name: 'AR/VR & Metaverse',
    icon: <Sparkles className="w-6 h-6" />,
    description: 'Augmented reality, virtual reality, and metaverse development',
    skillCount: 65,
    color: 'bg-pink-500',
    gradient: 'from-pink-500 to-rose-500',
    trending: true,
    skills: [
      'Unity 3D', 'Unreal Engine', 'ARCore', 'ARKit', 'Vuforia', 'WebXR',
      'Oculus SDK', 'OpenXR', 'Mixed Reality Toolkit', 'Magic Leap', 'HoloLens',
      'C#', 'C++', 'JavaScript', 'TypeScript', 'Blender', '3ds Max', 'Maya',
      '3D Modeling', 'Animation', 'Shader Programming', 'HLSL', 'GLSL',
      'Spatial Computing', 'Hand Tracking', 'Eye Tracking', 'Voice Recognition',
      'Metaverse Platforms', 'NFT Integration', 'Virtual Economies', 'Social VR'
    ]
  },
  {
    id: 'quantum-computing',
    name: 'Quantum Computing',
    icon: <Rocket className="w-6 h-6" />,
    description: 'Quantum algorithms, quantum programming, and quantum machine learning',
    skillCount: 45,
    color: 'bg-violet-500',
    gradient: 'from-violet-500 to-purple-500',
    trending: true,
    skills: [
      'Quantum Mechanics', 'Quantum Algorithms', 'Qiskit', 'Cirq', 'Q#', 'PennyLane',
      'Quantum Gates', 'Quantum Circuits', 'Quantum Entanglement', 'Superposition',
      'QAOA', 'VQE', 'Grover Algorithm', 'Shor Algorithm', 'Quantum Fourier Transform',
      'Quantum Machine Learning', 'Quantum Cryptography', 'Quantum Error Correction',
      'IBM Quantum', 'Google Quantum AI', 'Microsoft Azure Quantum', 'Amazon Braket',
      'Quantum Supremacy', 'NISQ Devices', 'Quantum Annealing', 'Adiabatic Computing'
    ]
  },
  {
    id: 'robotics-automation',
    name: 'Robotics & Automation',
    icon: <Brain className="w-6 h-6" />,
    description: 'Robotics programming, industrial automation, and autonomous systems',
    skillCount: 80,
    color: 'bg-emerald-500',
    gradient: 'from-emerald-500 to-teal-500',
    trending: true,
    skills: [
      'ROS (Robot Operating System)', 'ROS2', 'Gazebo', 'MoveIt', 'Navigation Stack',
      'Python', 'C++', 'MATLAB', 'Simulink', 'LabVIEW', 'PLC Programming',
      'Computer Vision for Robotics', 'SLAM', 'Path Planning', 'Kinematics', 'Dynamics',
      'Sensor Fusion', 'LIDAR', 'IMU', 'Cameras', 'Encoders', 'Force Sensors',
      'Industrial Automation', 'SCADA', 'HMI', 'Fieldbus', 'Ethernet/IP', 'Modbus',
      'Autonomous Vehicles', 'Drones', 'Manipulator Arms', 'Mobile Robots', 'Humanoid Robots'
    ]
  },
  {
    id: 'edge-computing-5g',
    name: 'Edge Computing & 5G/6G',
    icon: <Wifi className="w-6 h-6" />,
    description: 'Edge computing infrastructure, 5G/6G networks, and distributed systems',
    skillCount: 65,
    color: 'bg-orange-500',
    gradient: 'from-orange-500 to-red-500',
    trending: true,
    skills: [
      'Edge Computing Architecture', 'Multi-access Edge Computing (MEC)', 'Fog Computing',
      '5G Network Slicing', '6G Research', 'Network Function Virtualization (NFV)',
      'Software-Defined Networking (SDN)', 'Container Orchestration at Edge', 'Kubernetes',
      'Edge AI/ML', 'Real-time Processing', 'Low Latency Applications', 'IoT Integration',
      'mmWave Technology', 'Massive MIMO', 'Beamforming', 'Network Optimization',
      'Edge Security', 'Distributed Databases', 'CDN Technologies', 'Smart Cities'
    ]
  },
  {
    id: 'space-technology',
    name: 'Space Technology & Satellites',
    icon: <Satellite className="w-6 h-6" />,
    description: 'Satellite systems, space exploration technology, and aerospace engineering',
    skillCount: 55,
    color: 'bg-indigo-600',
    gradient: 'from-indigo-600 to-blue-600',
    trending: true,
    skills: [
      'Satellite Communication', 'Orbital Mechanics', 'CubeSat Development', 'Ground Stations',
      'Space Mission Design', 'Propulsion Systems', 'Guidance Navigation Control',
      'Remote Sensing', 'Earth Observation', 'GPS/GNSS Systems', 'Constellation Management',
      'Space-Based IoT', 'Inter-Satellite Links', 'Deep Space Communication', 'RF Engineering',
      'Antenna Design', 'Signal Processing', 'Space Weather', 'Debris Tracking',
      'Launch Systems', 'Reusable Rockets', 'Space Manufacturing', 'Mars Exploration'
    ]
  },
  {
    id: 'biotechnology-health',
    name: 'Biotechnology & Digital Health',
    icon: <Heart className="w-6 h-6" />,
    description: 'Digital health technologies, biotechnology, and medical device development',
    skillCount: 70,
    color: 'bg-rose-500',
    gradient: 'from-rose-500 to-pink-500',
    trending: true,
    skills: [
      'Bioinformatics', 'Genomics', 'Proteomics', 'Digital Therapeutics', 'mHealth Apps',
      'Wearable Health Tech', 'Medical IoT', 'Telemedicine Platforms', 'AI in Healthcare',
      'Medical Imaging', 'DICOM Standards', 'HL7 FHIR', 'Electronic Health Records',
      'Clinical Decision Support', 'Drug Discovery', 'Precision Medicine', 'Biomarkers',
      'Medical Device Software', 'FDA Regulations', 'HIPAA Compliance', 'Clinical Trials',
      'Synthetic Biology', 'CRISPR Technology', 'Lab Automation', 'Point-of-Care Testing'
    ]
  },
  {
    id: 'green-technology',
    name: 'Green Technology & Sustainability',
    icon: <Leaf className="w-6 h-6" />,
    description: 'Renewable energy systems, environmental monitoring, and sustainable technology',
    skillCount: 60,
    color: 'bg-green-600',
    gradient: 'from-green-600 to-emerald-600',
    trending: true,
    skills: [
      'Solar Energy Systems', 'Wind Power Technology', 'Energy Storage', 'Smart Grid',
      'Battery Management Systems', 'Electric Vehicle Charging', 'Carbon Tracking',
      'Environmental Monitoring', 'Air Quality Sensors', 'Water Management Systems',
      'Sustainable Manufacturing', 'Circular Economy', 'Life Cycle Assessment',
      'Green Building Technologies', 'Energy Efficiency', 'Renewable Energy Integration',
      'Climate Modeling', 'Carbon Capture', 'Waste-to-Energy', 'Sustainable Agriculture',
      'Precision Farming', 'Environmental AI', 'Green Finance', 'ESG Technologies'
    ]
  },
  {
    id: 'neuromorphic-computing',
    name: 'Neuromorphic Computing & Brain-Computer Interfaces',
    icon: <Brain className="w-6 h-6" />,
    description: 'Brain-inspired computing, neural interfaces, and cognitive technologies',
    skillCount: 45,
    color: 'bg-purple-600',
    gradient: 'from-purple-600 to-violet-600',
    trending: true,
    skills: [
      'Neuromorphic Architectures', 'Spiking Neural Networks', 'Brain-Computer Interfaces',
      'Neural Signal Processing', 'EEG/fMRI Analysis', 'Invasive/Non-invasive BCIs',
      'Cognitive Computing', 'Memristive Devices', 'Synaptic Computing', 'Neural Chips',
      'Brain Mapping', 'Neurofeedback Systems', 'Prosthetic Control', 'Thought Recognition',
      'Neural Decoding', 'Motor Imagery', 'P300 Spellers', 'Steady-State VEPs',
      'Neurorehabilitation', 'Cognitive Enhancement', 'Ethical Neurotechnology', 'Neural Privacy'
    ]
  }
]

// Comprehensive skills for each subcategory
const subcategorySkills = {
  'web-development': [
    {
      id: 1,
      title: 'Complete React Developer Course',
      level: 'Beginner to Advanced',
      rating: 4.9,
      students: 12000,
      duration: '12 weeks',
      price: 129,
      instructor: 'Sarah Johnson',
      description: 'Master React from basics to advanced concepts including hooks, context, and testing. Build 5 real-world projects including an e-commerce platform.',
      trending: true,
      modules: 15,
      projects: 5,
      certificate: true,
      jobGuarantee: true,
      roadmap: [
        'JavaScript ES6+ Mastery',
        'React Components & JSX',
        'State & Props Management',
        'Hooks & Lifecycle',
        'Context API & Redux',
        'React Router Navigation',
        'Testing with Jest & RTL',
        'Performance Optimization',
        'TypeScript Integration',
        'Real-world Projects'
      ],
      skills: ['React', 'JavaScript', 'TypeScript', 'Redux', 'Testing', 'Performance'],
      careerOutcomes: ['Frontend Developer', 'React Developer', 'Full-Stack Developer'],
      salaryRange: '$70,000 - $120,000'
    },
    {
      id: 2,
      title: 'Full-Stack JavaScript Bootcamp',
      level: 'Intermediate to Advanced',
      rating: 4.8,
      students: 8500,
      duration: '16 weeks',
      price: 199,
      instructor: 'John Martinez',
      description: 'Comprehensive full-stack development with MERN stack. Includes deployment, testing, and real client projects.',
      trending: true,
      modules: 20,
      projects: 7,
      certificate: true,
      jobGuarantee: true,
      roadmap: [
        'Advanced JavaScript ES6+',
        'Node.js & Express.js',
        'MongoDB & Mongoose',
        'React Frontend Development',
        'RESTful API Design',
        'Authentication & Security',
        'Testing & TDD',
        'DevOps & Deployment',
        'Performance Optimization',
        'Client Project Work'
      ],
      skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript', 'API Development'],
      careerOutcomes: ['Full-Stack Developer', 'Backend Developer', 'Software Engineer'],
      salaryRange: '$75,000 - $140,000'
    },
    {
      id: 3,
      title: 'Vue.js Complete Developer Course',
      level: 'Beginner to Intermediate',
      rating: 4.7,
      students: 6800,
      duration: '10 weeks',
      price: 89,
      instructor: 'Emily Chen',
      description: 'Build modern web applications with Vue.js 3, including Composition API, Vuex, and Vue Router. Perfect for beginners.',
      trending: false,
      modules: 12,
      projects: 4,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Vue.js Fundamentals',
        'Template Syntax & Directives',
        'Component Architecture',
        'Composition API',
        'State Management with Vuex',
        'Vue Router & Navigation',
        'Form Handling & Validation',
        'API Integration',
        'Testing Vue Applications',
        'Deployment Strategies'
      ],
      skills: ['Vue.js', 'JavaScript', 'Vuex', 'Vue Router', 'Testing'],
      careerOutcomes: ['Frontend Developer', 'Vue.js Developer', 'Web Developer'],
      salaryRange: '$60,000 - $100,000'
    },
    {
      id: 4,
      title: 'Next.js & TypeScript Mastery',
      level: 'Intermediate to Advanced',
      rating: 4.9,
      students: 5200,
      duration: '14 weeks',
      price: 159,
      instructor: 'Alex Thompson',
      description: 'Master modern web development with Next.js 14, TypeScript, and cutting-edge features like Server Components and App Router.',
      trending: true,
      modules: 16,
      projects: 6,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'TypeScript Fundamentals',
        'Next.js App Router',
        'Server Components',
        'Static Site Generation',
        'API Routes & Server Actions',
        'Database Integration',
        'Authentication Systems',
        'Performance & SEO',
        'Deployment & Hosting',
        'Advanced Patterns'
      ],
      skills: ['Next.js', 'TypeScript', 'React', 'SSR', 'API Development'],
      careerOutcomes: ['Senior Frontend Developer', 'Full-Stack Developer', 'Next.js Specialist'],
      salaryRange: '$80,000 - $150,000'
    },
    {
      id: 5,
      title: 'Backend Development with Node.js',
      level: 'Intermediate',
      rating: 4.6,
      students: 4800,
      duration: '12 weeks',
      price: 139,
      instructor: 'David Kumar',
      description: 'Comprehensive backend development course covering APIs, databases, authentication, and microservices architecture.',
      trending: true,
      modules: 14,
      projects: 5,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Node.js Fundamentals',
        'Express.js Framework',
        'Database Design & Integration',
        'RESTful API Development',
        'GraphQL Implementation',
        'Authentication & Authorization',
        'Testing & Debugging',
        'Security Best Practices',
        'Microservices Architecture',
        'Deployment & Scaling'
      ],
      skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'GraphQL', 'Testing'],
      careerOutcomes: ['Backend Developer', 'API Developer', 'Software Engineer'],
      salaryRange: '$70,000 - $130,000'
    },
    {
      id: 50,
      title: 'Advanced Python Web Development',
      level: 'Intermediate to Advanced',
      rating: 4.8,
      students: 6800,
      duration: '14 weeks',
      price: 169,
      instructor: 'Maria Garcia',
      description: 'Master Python web development with Django, FastAPI, and Flask. Build scalable web applications with modern Python frameworks.',
      trending: true,
      modules: 16,
      projects: 6,
      certificate: true,
      jobGuarantee: true,
      roadmap: [
        'Advanced Python Programming',
        'Django Framework Mastery',
        'FastAPI for Modern APIs',
        'Flask Microservices',
        'SQLAlchemy ORM',
        'PostgreSQL & Database Design',
        'REST & GraphQL APIs',
        'Authentication & Security',
        'Testing & TDD',
        'Performance Optimization',
        'Deployment & DevOps',
        'Microservices Architecture'
      ],
      skills: ['Python', 'Django', 'FastAPI', 'Flask', 'SQLAlchemy', 'PostgreSQL', 'REST APIs'],
      careerOutcomes: ['Python Developer', 'Backend Engineer', 'Full-Stack Python Developer'],
      salaryRange: '$75,000 - $145,000'
    },
    {
      id: 51,
      title: 'Svelte & SvelteKit Complete Course',
      level: 'Beginner to Advanced',
      rating: 4.7,
      students: 3900,
      duration: '12 weeks',
      price: 149,
      instructor: 'Alex Thompson',
      description: 'Learn the fastest-growing frontend framework. Build lightning-fast web applications with Svelte and SvelteKit.',
      trending: true,
      modules: 14,
      projects: 5,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Svelte Fundamentals',
        'Component Architecture',
        'Reactivity & State Management',
        'SvelteKit Framework',
        'Routing & Navigation',
        'Server-Side Rendering',
        'Static Site Generation',
        'API Routes & Endpoints',
        'Database Integration',
        'Authentication Systems',
        'Performance Optimization',
        'Production Deployment'
      ],
      skills: ['Svelte', 'SvelteKit', 'JavaScript', 'SSR', 'Static Site Generation'],
      careerOutcomes: ['Svelte Developer', 'Frontend Engineer', 'JavaScript Developer'],
      salaryRange: '$70,000 - $130,000'
    },
    {
      id: 52,
      title: 'Microservices Architecture with Node.js',
      level: 'Advanced',
      rating: 4.9,
      students: 4200,
      duration: '16 weeks',
      price: 219,
      instructor: 'Robert Kim',
      description: 'Design and build scalable microservices architectures with Node.js, Docker, and Kubernetes.',
      trending: true,
      modules: 18,
      projects: 7,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Microservices Fundamentals',
        'Service Decomposition Strategies',
        'API Gateway Patterns',
        'Inter-Service Communication',
        'Event-Driven Architecture',
        'Message Queues & Event Streaming',
        'Service Discovery & Load Balancing',
        'Distributed Data Management',
        'Monitoring & Observability',
        'Security in Microservices',
        'Testing Strategies',
        'Deployment & Orchestration'
      ],
      skills: ['Microservices', 'Node.js', 'Docker', 'Kubernetes', 'Event-Driven Architecture', 'API Gateway'],
      careerOutcomes: ['Microservices Architect', 'Senior Backend Engineer', 'Solutions Architect'],
      salaryRange: '$100,000 - $180,000'
    },
    {
      id: 53,
      title: 'GraphQL Advanced Development',
      level: 'Intermediate to Advanced',
      rating: 4.6,
      students: 3600,
      duration: '10 weeks',
      price: 159,
      instructor: 'Jennifer Park',
      description: 'Master GraphQL for building efficient APIs. Learn schema design, resolvers, subscriptions, and advanced patterns.',
      trending: true,
      modules: 12,
      projects: 4,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'GraphQL Fundamentals',
        'Schema Design & Best Practices',
        'Resolver Patterns',
        'DataLoader & N+1 Problem',
        'Subscriptions & Real-time',
        'Authentication & Authorization',
        'Error Handling & Validation',
        'Performance Optimization',
        'Testing GraphQL APIs',
        'Federation & Schema Stitching',
        'Caching Strategies',
        'Production Deployment'
      ],
      skills: ['GraphQL', 'Apollo Server', 'Schema Design', 'Resolvers', 'Subscriptions'],
      careerOutcomes: ['GraphQL Developer', 'API Architect', 'Backend Engineer'],
      salaryRange: '$80,000 - $150,000'
    },
    {
      id: 54,
      title: 'Web Performance & Optimization',
      level: 'Intermediate to Advanced',
      rating: 4.8,
      students: 2800,
      duration: '8 weeks',
      price: 139,
      instructor: 'David Chen',
      description: 'Learn advanced web performance optimization techniques. Master Core Web Vitals, loading strategies, and performance monitoring.',
      trending: true,
      modules: 10,
      projects: 4,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Performance Fundamentals',
        'Core Web Vitals Optimization',
        'Resource Loading Strategies',
        'Code Splitting & Lazy Loading',
        'Image & Asset Optimization',
        'Caching Strategies',
        'Service Workers & PWA',
        'Performance Monitoring',
        'Web Vitals Tooling',
        'Advanced Optimization Techniques'
      ],
      skills: ['Web Performance', 'Core Web Vitals', 'Optimization', 'Monitoring', 'Service Workers'],
      careerOutcomes: ['Performance Engineer', 'Frontend Architect', 'Web Optimization Specialist'],
      salaryRange: '$85,000 - $160,000'
    },
    {
      id: 6,
      title: 'Modern CSS & Responsive Design',
      level: 'Beginner to Intermediate',
      rating: 4.5,
      students: 7200,
      duration: '8 weeks',
      price: 79,
      instructor: 'Lisa Wang',
      description: 'Master modern CSS techniques including Grid, Flexbox, animations, and responsive design principles.',
      trending: false,
      modules: 10,
      projects: 4,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'CSS Fundamentals Review',
        'Flexbox Layout System',
        'CSS Grid Mastery',
        'Responsive Design Principles',
        'CSS Animations & Transitions',
        'Sass/SCSS Preprocessing',
        'CSS Architecture (BEM)',
        'Performance Optimization',
        'Modern CSS Features',
        'Design System Creation'
      ],
      skills: ['CSS', 'Sass', 'Responsive Design', 'Animations', 'Design Systems'],
      careerOutcomes: ['Frontend Developer', 'UI Developer', 'Web Designer'],
      salaryRange: '$50,000 - $90,000'
    }
  ],
  'mobile-development': [
    {
      id: 7,
      title: 'Flutter Cross-Platform Development',
      level: 'Beginner to Advanced',
      rating: 4.8,
      students: 9500,
      duration: '14 weeks',
      price: 149,
      instructor: 'Jennifer Liu',
      description: 'Master Flutter development with Dart. Build native iOS and Android apps from a single codebase. Includes advanced state management and real-world projects.',
      trending: true,
      modules: 18,
      projects: 6,
      certificate: true,
      jobGuarantee: true,
      roadmap: [
        'Dart Programming Fundamentals',
        'Flutter Widget System',
        'Layouts & UI Design',
        'Navigation & Routing',
        'State Management (Provider, Riverpod)',
        'HTTP Requests & APIs',
        'Local Storage & Databases',
        'Platform-specific Features',
        'Testing & Debugging',
        'App Store Deployment'
      ],
      skills: ['Flutter', 'Dart', 'Mobile UI/UX', 'State Management', 'API Integration'],
      careerOutcomes: ['Flutter Developer', 'Mobile App Developer', 'Cross-platform Developer'],
      salaryRange: '$65,000 - $125,000'
    },
    {
      id: 8,
      title: 'React Native Mastery Course',
      level: 'Intermediate to Advanced',
      rating: 4.7,
      students: 7800,
      duration: '12 weeks',
      price: 139,
      instructor: 'Carlos Rodriguez',
      description: 'Build native mobile apps using React Native. Learn advanced patterns, performance optimization, and native module integration.',
      trending: true,
      modules: 16,
      projects: 5,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'React Native Fundamentals',
        'Component Architecture',
        'Navigation with React Navigation',
        'State Management (Redux)',
        'Native Module Integration',
        'Device Features & APIs',
        'Performance Optimization',
        'Testing Strategies',
        'Platform-specific Code',
        'App Store Publishing'
      ],
      skills: ['React Native', 'JavaScript', 'Redux', 'Native Modules', 'Mobile Development'],
      careerOutcomes: ['React Native Developer', 'Mobile Developer', 'JavaScript Developer'],
      salaryRange: '$70,000 - $130,000'
    },
    {
      id: 9,
      title: 'iOS Development with Swift',
      level: 'Beginner to Advanced',
      rating: 4.9,
      students: 6200,
      duration: '16 weeks',
      price: 179,
      instructor: 'Michael Zhang',
      description: 'Complete iOS development course using Swift and SwiftUI. Build professional iOS apps with modern frameworks and best practices.',
      trending: true,
      modules: 20,
      projects: 7,
      certificate: true,
      jobGuarantee: true,
      roadmap: [
        'Swift Programming Language',
        'Xcode Development Environment',
        'UIKit Fundamentals',
        'SwiftUI Modern Framework',
        'Core Data & CloudKit',
        'Networking & REST APIs',
        'App Architecture (MVVM)',
        'Testing & Debugging',
        'App Store Guidelines',
        'Advanced iOS Features'
      ],
      skills: ['Swift', 'SwiftUI', 'UIKit', 'Xcode', 'Core Data', 'iOS Development'],
      careerOutcomes: ['iOS Developer', 'Swift Developer', 'Mobile Engineer'],
      salaryRange: '$75,000 - $150,000'
    },
    {
      id: 10,
      title: 'Android Development with Kotlin',
      level: 'Beginner to Advanced',
      rating: 4.6,
      students: 5500,
      duration: '15 weeks',
      price: 169,
      instructor: 'Priya Sharma',
      description: 'Master Android app development with Kotlin and Jetpack Compose. Learn modern Android development practices and architecture.',
      trending: true,
      modules: 18,
      projects: 6,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Kotlin Programming Language',
        'Android Studio Setup',
        'Android Fundamentals',
        'Jetpack Compose UI',
        'Room Database',
        'Retrofit & Networking',
        'Architecture Components',
        'Testing & Debugging',
        'Material Design',
        'Play Store Publishing'
      ],
      skills: ['Kotlin', 'Android', 'Jetpack Compose', 'Room', 'Material Design'],
      careerOutcomes: ['Android Developer', 'Kotlin Developer', 'Mobile Engineer'],
      salaryRange: '$70,000 - $140,000'
    },
    {
      id: 41,
      title: 'Progressive Web Apps (PWA) Mastery',
      level: 'Intermediate to Advanced',
      rating: 4.7,
      students: 4800,
      duration: '10 weeks',
      price: 149,
      instructor: 'Sarah Kim',
      description: 'Build cutting-edge Progressive Web Apps with offline capabilities, push notifications, and native-like experiences.',
      trending: true,
      modules: 12,
      projects: 5,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'PWA Architecture & Concepts',
        'Service Workers & Caching',
        'Web App Manifest',
        'Offline-First Development',
        'Push Notifications',
        'Background Sync',
        'App Installation & Updates',
        'Performance Optimization',
        'Security Best Practices',
        'Cross-Platform Deployment'
      ],
      skills: ['PWA', 'Service Workers', 'Web APIs', 'Offline Development', 'Push Notifications'],
      careerOutcomes: ['PWA Developer', 'Frontend Engineer', 'Mobile Web Developer'],
      salaryRange: '$75,000 - $140,000'
    },
    {
      id: 42,
      title: 'Xamarin Cross-Platform Development',
      level: 'Intermediate',
      rating: 4.5,
      students: 3200,
      duration: '12 weeks',
      price: 159,
      instructor: 'Michael Johnson',
      description: 'Build native iOS and Android apps using C# and Xamarin. Perfect for .NET developers entering mobile development.',
      trending: false,
      modules: 14,
      projects: 4,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'C# for Mobile Development',
        'Xamarin.Forms Basics',
        'XAML & Data Binding',
        'Navigation & Layouts',
        'Platform-Specific Features',
        'Database Integration',
        'REST API Consumption',
        'Testing & Debugging',
        'Performance Optimization',
        'App Store Deployment'
      ],
      skills: ['Xamarin', 'C#', '.NET', 'XAML', 'Cross-platform Development'],
      careerOutcomes: ['Xamarin Developer', '.NET Mobile Developer', 'Cross-platform Engineer'],
      salaryRange: '$70,000 - $130,000'
    },
    {
      id: 43,
      title: 'React Native Advanced Patterns',
      level: 'Advanced',
      rating: 4.8,
      students: 2800,
      duration: '8 weeks',
      price: 179,
      instructor: 'David Chen',
      description: 'Master advanced React Native patterns, performance optimization, and enterprise-scale app development.',
      trending: true,
      modules: 10,
      projects: 3,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Advanced Component Patterns',
        'State Management Architecture',
        'Performance Profiling & Optimization',
        'Memory Management',
        'Native Module Development',
        'Bridging Native Code',
        'Advanced Navigation Patterns',
        'Testing at Scale',
        'CI/CD for React Native',
        'Production Deployment Strategies'
      ],
      skills: ['Advanced React Native', 'Performance Optimization', 'Native Modules', 'Enterprise Architecture'],
      careerOutcomes: ['Senior React Native Developer', 'Mobile Architect', 'Technical Lead'],
      salaryRange: '$95,000 - $170,000'
    },
    {
      id: 44,
      title: 'Mobile App Security & DevSecOps',
      level: 'Advanced',
      rating: 4.6,
      students: 1900,
      duration: '10 weeks',
      price: 199,
      instructor: 'Elena Rodriguez',
      description: 'Comprehensive mobile app security course covering threat modeling, secure coding, and DevSecOps practices.',
      trending: true,
      modules: 12,
      projects: 4,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Mobile Security Fundamentals',
        'Threat Modeling for Mobile',
        'Secure Coding Practices',
        'Authentication & Authorization',
        'Data Protection & Encryption',
        'API Security',
        'Static & Dynamic Analysis',
        'Penetration Testing',
        'DevSecOps Integration',
        'Compliance & Standards'
      ],
      skills: ['Mobile Security', 'DevSecOps', 'Penetration Testing', 'Secure Coding', 'Compliance'],
      careerOutcomes: ['Mobile Security Engineer', 'DevSecOps Engineer', 'Security Consultant'],
      salaryRange: '$90,000 - $160,000'
    }
  ],
  'data-science-ai': [
    {
      id: 11,
      title: 'Complete Data Science Bootcamp',
      level: 'Beginner to Advanced',
      rating: 4.9,
      students: 15000,
      duration: '20 weeks',
      price: 249,
      instructor: 'Dr. Sarah Mitchell',
      description: 'Comprehensive data science program covering Python, statistics, machine learning, and deep learning. Includes real-world projects and industry mentorship.',
      trending: true,
      modules: 25,
      projects: 8,
      certificate: true,
      jobGuarantee: true,
      roadmap: [
        'Python Programming for Data Science',
        'Statistics & Probability',
        'Data Visualization (Matplotlib, Seaborn)',
        'Pandas & NumPy Mastery',
        'SQL & Database Management',
        'Machine Learning Algorithms',
        'Deep Learning with TensorFlow',
        'Natural Language Processing',
        'Computer Vision',
        'MLOps & Model Deployment'
      ],
      skills: ['Python', 'Pandas', 'Scikit-learn', 'TensorFlow', 'SQL', 'Statistics', 'Machine Learning'],
      careerOutcomes: ['Data Scientist', 'ML Engineer', 'Data Analyst', 'AI Researcher'],
      salaryRange: '$85,000 - $180,000'
    },
    {
      id: 12,
      title: 'Machine Learning Engineering',
      level: 'Intermediate to Advanced',
      rating: 4.8,
      students: 8500,
      duration: '16 weeks',
      price: 199,
      instructor: 'Dr. Michael Chen',
      description: 'Production-ready machine learning course focusing on MLOps, model deployment, and scalable systems. Perfect for engineers transitioning to ML.',
      trending: true,
      modules: 20,
      projects: 6,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'ML Engineering Fundamentals',
        'Data Pipeline Architecture',
        'Feature Engineering at Scale',
        'Model Training & Optimization',
        'Model Serving & APIs',
        'MLOps & CI/CD for ML',
        'Monitoring & Maintenance',
        'Cloud ML Platforms',
        'Distributed Training',
        'Production ML Systems'
      ],
      skills: ['MLOps', 'Docker', 'Kubernetes', 'AWS/GCP', 'Python', 'TensorFlow', 'PyTorch'],
      careerOutcomes: ['ML Engineer', 'MLOps Engineer', 'Data Platform Engineer'],
      salaryRange: '$90,000 - $170,000'
    },
    {
      id: 13,
      title: 'Deep Learning Specialization',
      level: 'Advanced',
      rating: 4.9,
      students: 6800,
      duration: '14 weeks',
      price: 179,
      instructor: 'Dr. Anna Rodriguez',
      description: 'Advanced deep learning course covering CNNs, RNNs, GANs, and Transformers. Build state-of-the-art AI applications.',
      trending: true,
      modules: 18,
      projects: 5,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Neural Network Fundamentals',
        'Convolutional Neural Networks',
        'Recurrent Neural Networks',
        'LSTM & GRU Networks',
        'Transformer Architecture',
        'Generative Adversarial Networks',
        'Computer Vision Applications',
        'Natural Language Processing',
        'Reinforcement Learning',
        'Research & Innovation'
      ],
      skills: ['Deep Learning', 'PyTorch', 'TensorFlow', 'Computer Vision', 'NLP', 'GANs'],
      careerOutcomes: ['AI Research Scientist', 'Deep Learning Engineer', 'Computer Vision Engineer'],
      salaryRange: '$100,000 - $220,000'
    },
    {
      id: 14,
      title: 'Data Analysis with Python',
      level: 'Beginner to Intermediate',
      rating: 4.6,
      students: 12000,
      duration: '10 weeks',
      price: 119,
      instructor: 'Lisa Chang',
      description: 'Learn data analysis fundamentals with Python. Perfect for beginners wanting to start their data career.',
      trending: false,
      modules: 12,
      projects: 4,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Python Basics for Data',
        'Pandas Data Manipulation',
        'Data Cleaning Techniques',
        'Exploratory Data Analysis',
        'Statistical Analysis',
        'Data Visualization',
        'SQL for Data Analysis',
        'Business Intelligence',
        'Reporting & Dashboards',
        'Industry Applications'
      ],
      skills: ['Python', 'Pandas', 'SQL', 'Tableau', 'Excel', 'Statistics'],
      careerOutcomes: ['Data Analyst', 'Business Analyst', 'Research Analyst'],
      salaryRange: '$55,000 - $95,000'
    },
    {
      id: 15,
      title: 'AI & Computer Vision',
      level: 'Advanced',
      rating: 4.7,
      students: 4200,
      duration: '12 weeks',
      price: 159,
      instructor: 'Dr. James Wilson',
      description: 'Specialized computer vision course covering image processing, object detection, and facial recognition systems.',
      trending: true,
      modules: 15,
      projects: 4,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Computer Vision Fundamentals',
        'Image Processing with OpenCV',
        'Deep Learning for Vision',
        'Object Detection (YOLO, R-CNN)',
        'Facial Recognition Systems',
        'Image Segmentation',
        'Video Analysis',
        'Real-time Processing',
        'Edge Computing for Vision',
        'Industry Applications'
      ],
      skills: ['Computer Vision', 'OpenCV', 'YOLO', 'TensorFlow', 'Image Processing'],
      careerOutcomes: ['Computer Vision Engineer', 'AI Engineer', 'Robotics Engineer'],
      salaryRange: '$95,000 - $190,000'
    },
    {
      id: 29,
      title: 'Large Language Models & Generative AI',
      level: 'Advanced to Expert',
      rating: 4.9,
      students: 3800,
      duration: '16 weeks',
      price: 299,
      instructor: 'Dr. Michael Zhang',
      description: 'Master the latest in generative AI, LLMs, and foundation models. Build applications with GPT, BERT, and custom models. Includes fine-tuning and deployment.',
      trending: true,
      modules: 20,
      projects: 6,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Transformer Architecture Deep Dive',
        'Pre-training & Fine-tuning LLMs',
        'BERT, GPT, T5 Implementation',
        'Prompt Engineering & Chain-of-Thought',
        'LangChain & Vector Databases',
        'RAG (Retrieval Augmented Generation)',
        'Multi-modal Models (CLIP, DALL-E)',
        'AI Safety & Alignment',
        'Model Compression & Optimization',
        'Production LLM Deployment'
      ],
      skills: ['LLMs', 'Transformers', 'GPT', 'BERT', 'LangChain', 'Vector Databases', 'Prompt Engineering'],
      careerOutcomes: ['LLM Engineer', 'AI Research Scientist', 'Generative AI Engineer', 'AI Product Manager'],
      salaryRange: '$120,000 - $250,000'
    },
    {
      id: 30,
      title: 'AI Engineering & MLOps Mastery',
      level: 'Intermediate to Advanced',
      rating: 4.8,
      students: 6200,
      duration: '18 weeks',
      price: 229,
      instructor: 'Sarah Kim',
      description: 'End-to-end AI engineering course covering MLOps, model serving, monitoring, and production AI systems at scale.',
      trending: true,
      modules: 22,
      projects: 7,
      certificate: true,
      jobGuarantee: true,
      roadmap: [
        'ML Engineering Foundations',
        'Data Pipeline Architecture',
        'Feature Stores & Data Versioning',
        'Experiment Tracking (MLflow, Weights & Biases)',
        'Model Serving & APIs (FastAPI, BentoML)',
        'Container Orchestration for ML',
        'Model Monitoring & Drift Detection',
        'A/B Testing for ML Models',
        'CI/CD for Machine Learning',
        'Multi-model Deployment Strategies'
      ],
      skills: ['MLOps', 'Docker', 'Kubernetes', 'MLflow', 'Kubeflow', 'Model Serving', 'ML Monitoring'],
      careerOutcomes: ['ML Engineer', 'AI Platform Engineer', 'MLOps Engineer', 'Data Platform Engineer'],
      salaryRange: '$95,000 - $180,000'
    },
    {
      id: 31,
      title: 'Advanced Reinforcement Learning',
      level: 'Advanced to Expert',
      rating: 4.7,
      students: 2800,
      duration: '14 weeks',
      price: 199,
      instructor: 'Dr. Alex Thompson',
      description: 'Deep dive into reinforcement learning algorithms, from Q-learning to cutting-edge methods like PPO, SAC, and multi-agent systems.',
      trending: true,
      modules: 16,
      projects: 5,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'RL Fundamentals & Markov Decision Processes',
        'Value-based Methods (Q-learning, DQN)',
        'Policy Gradient Methods (REINFORCE, PPO)',
        'Actor-Critic Methods (A3C, SAC)',
        'Model-based RL & Planning',
        'Multi-agent Reinforcement Learning',
        'Hierarchical Reinforcement Learning',
        'Meta-learning & Few-shot RL',
        'RL for Real-world Applications',
        'Advanced RL Research Topics'
      ],
      skills: ['Reinforcement Learning', 'OpenAI Gym', 'Stable Baselines', 'PyTorch', 'Multi-agent Systems'],
      careerOutcomes: ['RL Research Scientist', 'AI Engineer', 'Autonomous Systems Engineer', 'Game AI Developer'],
      salaryRange: '$110,000 - $220,000'
    },
    {
      id: 45,
      title: 'Generative AI & Foundation Models',
      level: 'Advanced to Expert',
      rating: 4.9,
      students: 2400,
      duration: '14 weeks',
      price: 299,
      instructor: 'Dr. James Park',
      description: 'Master the latest generative AI technologies including GPT, DALL-E, Stable Diffusion, and custom foundation model development.',
      trending: true,
      modules: 16,
      projects: 6,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Foundation Models Architecture',
        'Transformer Deep Dive',
        'GPT & Language Models',
        'Multimodal Models (CLIP, DALL-E)',
        'Diffusion Models & Stable Diffusion',
        'Fine-tuning & PEFT Methods',
        'Prompt Engineering & Chain-of-Thought',
        'RLHF & Constitutional AI',
        'Model Alignment & Safety',
        'Deployment & Scaling',
        'Custom Model Development',
        'Evaluation & Benchmarking'
      ],
      skills: ['Generative AI', 'Foundation Models', 'Transformers', 'Diffusion Models', 'RLHF', 'Model Alignment'],
      careerOutcomes: ['Generative AI Engineer', 'Foundation Model Researcher', 'AI Safety Engineer'],
      salaryRange: '$140,000 - $300,000'
    },
    {
      id: 46,
      title: 'MLOps & Production ML Systems',
      level: 'Intermediate to Advanced',
      rating: 4.8,
      students: 5600,
      duration: '16 weeks',
      price: 229,
      instructor: 'Lisa Chen',
      description: 'End-to-end MLOps pipeline development, model serving, monitoring, and production ML system design.',
      trending: true,
      modules: 18,
      projects: 7,
      certificate: true,
      jobGuarantee: true,
      roadmap: [
        'MLOps Fundamentals',
        'ML Pipeline Architecture',
        'Data Versioning & Lineage',
        'Experiment Tracking',
        'Model Registry & Governance',
        'Containerization for ML',
        'Kubernetes for ML Workloads',
        'Model Serving Patterns',
        'A/B Testing for ML',
        'Model Monitoring & Drift Detection',
        'Automated Retraining',
        'ML Platform Engineering'
      ],
      skills: ['MLOps', 'Kubernetes', 'Docker', 'Model Serving', 'ML Monitoring', 'Platform Engineering'],
      careerOutcomes: ['MLOps Engineer', 'ML Platform Engineer', 'Production ML Engineer'],
      salaryRange: '$100,000 - $190,000'
    },
    {
      id: 47,
      title: 'Edge AI & TinyML',
      level: 'Advanced',
      rating: 4.7,
      students: 2800,
      duration: '12 weeks',
      price: 199,
      instructor: 'Dr. Michael Zhang',
      description: 'Deploy AI models on edge devices and microcontrollers. Learn model optimization, quantization, and TinyML frameworks.',
      trending: true,
      modules: 14,
      projects: 5,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Edge AI Fundamentals',
        'Model Optimization Techniques',
        'Quantization & Pruning',
        'TensorFlow Lite & TensorRT',
        'ONNX & Model Conversion',
        'TinyML Frameworks',
        'Microcontroller Programming',
        'Hardware Acceleration',
        'Power Optimization',
        'Real-time Inference',
        'Edge Deployment Strategies',
        'IoT Integration'
      ],
      skills: ['Edge AI', 'TinyML', 'Model Optimization', 'TensorFlow Lite', 'Hardware Acceleration'],
      careerOutcomes: ['Edge AI Engineer', 'Embedded AI Developer', 'IoT AI Specialist'],
      salaryRange: '$95,000 - $180,000'
    },
    {
      id: 48,
      title: 'AI Ethics & Responsible AI',
      level: 'Intermediate',
      rating: 4.6,
      students: 3400,
      duration: '8 weeks',
      price: 129,
      instructor: 'Dr. Sarah Williams',
      description: 'Learn to build responsible AI systems with focus on fairness, transparency, accountability, and ethical considerations.',
      trending: true,
      modules: 10,
      projects: 4,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'AI Ethics Fundamentals',
        'Bias Detection & Mitigation',
        'Fairness Metrics & Evaluation',
        'Explainable AI (XAI)',
        'Privacy-Preserving ML',
        'Algorithmic Auditing',
        'Governance Frameworks',
        'Regulatory Compliance',
        'Stakeholder Engagement',
        'Ethical Impact Assessment'
      ],
      skills: ['AI Ethics', 'Bias Mitigation', 'Explainable AI', 'Privacy-Preserving ML', 'Algorithmic Auditing'],
      careerOutcomes: ['AI Ethics Specialist', 'Responsible AI Engineer', 'AI Governance Consultant'],
      salaryRange: '$85,000 - $150,000'
    },
    {
      id: 49,
      title: 'Multimodal AI & Vision-Language Models',
      level: 'Expert',
      rating: 4.8,
      students: 1600,
      duration: '16 weeks',
      price: 279,
      instructor: 'Dr. Anna Rodriguez',
      description: 'Advanced course on multimodal AI systems that understand and generate text, images, video, and audio.',
      trending: true,
      modules: 18,
      projects: 5,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Multimodal AI Fundamentals',
        'Vision-Language Models',
        'CLIP & ALIGN Architectures',
        'Text-to-Image Generation',
        'Image-to-Text Systems',
        'Video Understanding',
        'Audio-Visual Learning',
        'Cross-modal Retrieval',
        'Multimodal Fusion Techniques',
        'Vision-Language Navigation',
        'Embodied AI',
        'Research Frontiers'
      ],
      skills: ['Multimodal AI', 'Vision-Language Models', 'Cross-modal Learning', 'Embodied AI'],
      careerOutcomes: ['Multimodal AI Researcher', 'AI Research Scientist', 'Computer Vision Engineer'],
      salaryRange: '$120,000 - $280,000'
    },
    {
      id: 32,
      title: 'Neural Architecture Search & AutoML',
      level: 'Expert',
      rating: 4.6,
      students: 1500,
      duration: '12 weeks',
      price: 249,
      instructor: 'Dr. Jennifer Park',
      description: 'Cutting-edge course on automated machine learning, neural architecture search, and hyperparameter optimization for building state-of-the-art models.',
      trending: true,
      modules: 14,
      projects: 4,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'AutoML Landscape & Principles',
        'Neural Architecture Search (NAS)',
        'Hyperparameter Optimization',
        'Automated Feature Engineering',
        'Progressive NAS & Efficient Search',
        'Differentiable Architecture Search',
        'Multi-objective Optimization',
        'AutoML for Edge Devices',
        'Automated Model Compression',
        'Research Frontiers in AutoML'
      ],
      skills: ['AutoML', 'Neural Architecture Search', 'Hyperparameter Optimization', 'Model Compression'],
      careerOutcomes: ['AutoML Engineer', 'AI Research Scientist', 'ML Platform Engineer', 'AI Consultant'],
      salaryRange: '$130,000 - $280,000'
    }
  ],
  'cloud-computing': [
    {
      id: 16,
      title: 'AWS Cloud Solutions Architect',
      level: 'Intermediate to Advanced',
      rating: 4.8,
      students: 11000,
      duration: '16 weeks',
      price: 199,
      instructor: 'Alex Rodriguez',
      description: 'Master AWS cloud architecture. Design and deploy scalable, secure, and cost-effective cloud solutions. Includes hands-on labs and certification prep.',
      trending: true,
      modules: 20,
      projects: 6,
      certificate: true,
      jobGuarantee: true,
      roadmap: [
        'Cloud Computing Fundamentals',
        'AWS Core Services (EC2, S3, VPC)',
        'Identity & Access Management',
        'Database Services (RDS, DynamoDB)',
        'Application Services & APIs',
        'Monitoring & Logging',
        'Security & Compliance',
        'Cost Optimization',
        'Disaster Recovery',
        'Advanced Architectures'
      ],
      skills: ['AWS', 'Cloud Architecture', 'EC2', 'S3', 'Lambda', 'CloudFormation', 'DevOps'],
      careerOutcomes: ['Cloud Architect', 'DevOps Engineer', 'Cloud Engineer', 'AWS Specialist'],
      salaryRange: '$80,000 - $160,000'
    },
    {
      id: 17,
      title: 'Multi-Cloud Mastery (AWS, Azure, GCP)',
      level: 'Advanced',
      rating: 4.9,
      students: 6500,
      duration: '20 weeks',
      price: 279,
      instructor: 'Dr. Jennifer Park',
      description: 'Master all major cloud platforms. Learn platform-specific services and multi-cloud strategies for enterprise environments.',
      trending: true,
      modules: 24,
      projects: 8,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Cloud Platform Comparison',
        'AWS Advanced Services',
        'Azure Cloud Solutions',
        'Google Cloud Platform',
        'Multi-cloud Architecture',
        'Cloud Migration Strategies',
        'Hybrid Cloud Solutions',
        'Container Orchestration',
        'Serverless Computing',
        'Enterprise Cloud Governance'
      ],
      skills: ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Terraform', 'Multi-cloud Strategy'],
      careerOutcomes: ['Senior Cloud Architect', 'Cloud Consultant', 'Enterprise Architect'],
      salaryRange: '$110,000 - $200,000'
    },
    {
      id: 18,
      title: 'DevOps with Cloud Platforms',
      level: 'Intermediate',
      rating: 4.6,
      students: 8200,
      duration: '14 weeks',
      price: 169,
      instructor: 'Marcus Thompson',
      description: 'Learn modern DevOps practices with cloud platforms. Master CI/CD, infrastructure as code, and automated deployments.',
      trending: true,
      modules: 16,
      projects: 5,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'DevOps Fundamentals',
        'Version Control & Git',
        'CI/CD Pipelines',
        'Infrastructure as Code',
        'Container Technologies',
        'Kubernetes Orchestration',
        'Monitoring & Logging',
        'Security & Compliance',
        'Cloud Native Applications',
        'Automation & Scripting'
      ],
      skills: ['DevOps', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Monitoring'],
      careerOutcomes: ['DevOps Engineer', 'Site Reliability Engineer', 'Cloud Engineer'],
      salaryRange: '$75,000 - $145,000'
    }
  ],
  'cybersecurity': [
    {
      id: 19,
      title: 'Ethical Hacking & Penetration Testing',
      level: 'Intermediate to Advanced',
      rating: 4.8,
      students: 7500,
      duration: '16 weeks',
      price: 249,
      instructor: 'David Kumar',
      description: 'Master ethical hacking and penetration testing. Learn real-world attack techniques and defensive strategies. Includes certification preparation.',
      trending: true,
      modules: 20,
      projects: 6,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Cybersecurity Fundamentals',
        'Linux for Security Professionals',
        'Network Security & Protocols',
        'Web Application Security',
        'Vulnerability Assessment',
        'Penetration Testing Methodology',
        'Social Engineering Techniques',
        'Malware Analysis',
        'Digital Forensics',
        'Security Reporting'
      ],
      skills: ['Ethical Hacking', 'Penetration Testing', 'Kali Linux', 'Metasploit', 'Wireshark', 'OWASP'],
      careerOutcomes: ['Penetration Tester', 'Security Analyst', 'Ethical Hacker', 'Security Consultant'],
      salaryRange: '$75,000 - $150,000'
    },
    {
      id: 20,
      title: 'Cybersecurity Analyst Bootcamp',
      level: 'Beginner to Intermediate',
      rating: 4.7,
      students: 9200,
      duration: '14 weeks',
      price: 189,
      instructor: 'Sarah Williams',
      description: 'Comprehensive cybersecurity training covering threat analysis, incident response, and security operations.',
      trending: true,
      modules: 18,
      projects: 5,
      certificate: true,
      jobGuarantee: true,
      roadmap: [
        'Security Fundamentals',
        'Risk Assessment',
        'Threat Intelligence',
        'Security Operations Center',
        'Incident Response',
        'Network Monitoring',
        'SIEM Tools & Techniques',
        'Compliance & Governance',
        'Security Policies',
        'Business Continuity'
      ],
      skills: ['Security Analysis', 'SIEM', 'Incident Response', 'Risk Management', 'Compliance'],
      careerOutcomes: ['Security Analyst', 'SOC Analyst', 'Security Specialist', 'Risk Analyst'],
      salaryRange: '$65,000 - $120,000'
    },
    {
      id: 21,
      title: 'Advanced Cybersecurity & Forensics',
      level: 'Advanced to Expert',
      rating: 4.9,
      students: 3800,
      duration: '18 weeks',
      price: 299,
      instructor: 'Dr. Rachel Chen',
      description: 'Expert-level cybersecurity course covering advanced threats, digital forensics, and security architecture.',
      trending: false,
      modules: 22,
      projects: 7,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Advanced Threat Hunting',
        'Malware Reverse Engineering',
        'Digital Forensics Techniques',
        'Memory Forensics',
        'Mobile Device Forensics',
        'Network Forensics',
        'Cryptography & PKI',
        'Security Architecture',
        'Zero Trust Security',
        'Research & Innovation'
      ],
      skills: ['Digital Forensics', 'Malware Analysis', 'Reverse Engineering', 'Cryptography', 'Security Architecture'],
      careerOutcomes: ['Security Architect', 'Forensics Investigator', 'Security Researcher', 'CISO'],
      salaryRange: '$100,000 - $200,000'
    }
  ],
  'devops': [
    {
      id: 22,
      title: 'Complete DevOps Engineering',
      level: 'Intermediate to Advanced',
      rating: 4.8,
      students: 8900,
      duration: '16 weeks',
      price: 199,
      instructor: 'Robert Wilson',
      description: 'Master modern DevOps practices from CI/CD to container orchestration. Learn industry-standard tools and methodologies.',
      trending: true,
      modules: 20,
      projects: 6,
      certificate: true,
      jobGuarantee: true,
      roadmap: [
        'DevOps Culture & Principles',
        'Linux Administration',
        'Version Control (Git)',
        'CI/CD Pipeline Design',
        'Docker Containerization',
        'Kubernetes Orchestration',
        'Infrastructure as Code',
        'Monitoring & Alerting',
        'Security & Compliance',
        'Cloud Platform Integration'
      ],
      skills: ['DevOps', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'AWS', 'Monitoring'],
      careerOutcomes: ['DevOps Engineer', 'Site Reliability Engineer', 'Platform Engineer', 'Cloud Engineer'],
      salaryRange: '$80,000 - $160,000'
    },
    {
      id: 23,
      title: 'Site Reliability Engineering (SRE)',
      level: 'Advanced',
      rating: 4.9,
      students: 4200,
      duration: '14 weeks',
      price: 219,
      instructor: 'Elena Rodriguez',
      description: 'Master SRE practices for building and maintaining large-scale reliable systems. Learn from Google SRE methodologies.',
      trending: true,
      modules: 16,
      projects: 5,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'SRE Fundamentals',
        'Service Level Objectives',
        'Error Budgets',
        'Incident Management',
        'Post-mortem Culture',
        'Capacity Planning',
        'Performance Engineering',
        'Reliability Patterns',
        'Chaos Engineering',
        'Automation & Tooling'
      ],
      skills: ['SRE', 'Reliability Engineering', 'Monitoring', 'Incident Response', 'Automation'],
      careerOutcomes: ['Site Reliability Engineer', 'Principal Engineer', 'Platform Architect'],
      salaryRange: '$100,000 - $200,000'
    }
  ],
  'game-development': [
    {
      id: 24,
      title: 'Unity Game Development Mastery',
      level: 'Beginner to Advanced',
      rating: 4.7,
      students: 7800,
      duration: '18 weeks',
      price: 179,
      instructor: 'Mark Thompson',
      description: 'Complete Unity game development course. Create 2D and 3D games, mobile games, and VR experiences.',
      trending: true,
      modules: 22,
      projects: 8,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'C# Programming for Games',
        'Unity Editor & Interface',
        '2D Game Development',
        '3D Game Development',
        'Physics & Collisions',
        'Animation Systems',
        'UI/UX for Games',
        'Audio Integration',
        'Mobile Game Development',
        'VR Game Development'
      ],
      skills: ['Unity', 'C#', 'Game Design', '3D Modeling', 'Animation', 'VR Development'],
      careerOutcomes: ['Game Developer', 'Unity Developer', 'VR Developer', 'Indie Game Developer'],
      salaryRange: '$60,000 - $130,000'
    },
    {
      id: 25,
      title: 'Unreal Engine 5 Development',
      level: 'Intermediate to Advanced',
      rating: 4.8,
      students: 5200,
      duration: '16 weeks',
      price: 199,
      instructor: 'Sarah Kim',
      description: 'Master Unreal Engine 5 for AAA game development. Learn advanced graphics, blueprints, and C++ programming.',
      trending: true,
      modules: 18,
      projects: 6,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Unreal Engine 5 Fundamentals',
        'Blueprint Visual Scripting',
        'C++ Programming in UE5',
        'Advanced Graphics & Lighting',
        'Nanite & Lumen Technologies',
        'Character Animation',
        'Multiplayer Networking',
        'Performance Optimization',
        'Console Development',
        'Publishing & Distribution'
      ],
      skills: ['Unreal Engine', 'C++', 'Blueprints', '3D Graphics', 'Game Optimization'],
      careerOutcomes: ['AAA Game Developer', 'Technical Artist', 'Engine Programmer', 'Graphics Programmer'],
      salaryRange: '$70,000 - $150,000'
    },
    {
      id: 26,
      title: 'Mobile Game Development',
      level: 'Beginner to Intermediate',
      rating: 4.5,
      students: 6100,
      duration: '12 weeks',
      price: 139,
      instructor: 'James Chen',
      description: 'Create mobile games for iOS and Android. Learn monetization strategies and user engagement techniques.',
      trending: false,
      modules: 14,
      projects: 5,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Mobile Game Design Principles',
        'Unity for Mobile',
        'Touch Controls & UI',
        'Performance Optimization',
        'In-App Purchases',
        'Advertisement Integration',
        'Analytics & User Tracking',
        'App Store Optimization',
        'User Retention Strategies',
        'Publishing & Marketing'
      ],
      skills: ['Mobile Game Development', 'Unity', 'Monetization', 'User Analytics', 'ASO'],
      careerOutcomes: ['Mobile Game Developer', 'Indie Developer', 'Game Designer'],
      salaryRange: '$55,000 - $110,000'
    }
  ],
  'blockchain': [
    {
      id: 27,
      title: 'Blockchain & Smart Contract Development',
      level: 'Intermediate to Advanced',
      rating: 4.7,
      students: 5800,
      duration: '14 weeks',
      price: 219,
      instructor: 'Lisa Wang',
      description: 'Master blockchain development with Solidity and Web3. Build DeFi applications and NFT marketplaces.',
      trending: true,
      modules: 18,
      projects: 6,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Blockchain Fundamentals',
        'Ethereum & Smart Contracts',
        'Solidity Programming',
        'Web3.js Integration',
        'DeFi Protocol Development',
        'NFT Marketplace Creation',
        'Security & Auditing',
        'Layer 2 Solutions',
        'Cross-chain Development',
        'DApp Deployment'
      ],
      skills: ['Blockchain', 'Solidity', 'Web3', 'DeFi', 'Smart Contracts', 'Ethereum'],
      careerOutcomes: ['Blockchain Developer', 'Smart Contract Developer', 'DeFi Developer', 'Web3 Engineer'],
      salaryRange: '$85,000 - $180,000'
    },
    {
      id: 28,
      title: 'Cryptocurrency & DeFi Mastery',
      level: 'Advanced',
      rating: 4.6,
      students: 3200,
      duration: '12 weeks',
      price: 189,
      instructor: 'Alex Kumar',
      description: 'Deep dive into DeFi protocols, yield farming, and cryptocurrency trading systems.',
      trending: true,
      modules: 15,
      projects: 4,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Cryptocurrency Economics',
        'DeFi Protocol Analysis',
        'Automated Market Makers',
        'Yield Farming Strategies',
        'Liquidity Mining',
        'DAO Governance',
        'Risk Management',
        'Portfolio Optimization',
        'Trading Bot Development',
        'Regulatory Compliance'
      ],
      skills: ['DeFi', 'Cryptocurrency', 'Trading', 'Risk Management', 'Portfolio Management'],
      careerOutcomes: ['DeFi Analyst', 'Crypto Trader', 'Blockchain Consultant', 'Protocol Designer'],
      salaryRange: '$75,000 - $160,000'
    },
    {
      id: 33,
      title: 'Web3 Full-Stack Development',
      level: 'Intermediate to Advanced',
      rating: 4.8,
      students: 4200,
      duration: '16 weeks',
      price: 199,
      instructor: 'Marcus Chen',
      description: 'Build complete Web3 applications with React, Solidity, and modern blockchain tools. Create DeFi protocols, NFT marketplaces, and DAOs.',
      trending: true,
      modules: 18,
      projects: 6,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Web3 Development Fundamentals',
        'Ethereum & Smart Contract Basics',
        'Advanced Solidity Programming',
        'Frontend Web3 Integration',
        'DeFi Protocol Development',
        'NFT Marketplace Creation',
        'DAO Governance Systems',
        'Layer 2 Solutions',
        'Cross-chain Development',
        'Production Deployment'
      ],
      skills: ['Solidity', 'Web3.js', 'Ethers.js', 'React', 'DeFi', 'NFTs', 'Smart Contracts'],
      careerOutcomes: ['Web3 Developer', 'Blockchain Full-Stack Developer', 'DeFi Engineer', 'Smart Contract Developer'],
      salaryRange: '$90,000 - $180,000'
    }
  ],
  'iot-embedded': [
    {
      id: 34,
      title: 'IoT Systems Development',
      level: 'Beginner to Advanced',
      rating: 4.7,
      students: 6800,
      duration: '14 weeks',
      price: 179,
      instructor: 'Dr. Sarah Wilson',
      description: 'Complete IoT development course covering embedded programming, sensors, connectivity, and cloud integration. Build real-world IoT projects.',
      trending: true,
      modules: 16,
      projects: 7,
      certificate: true,
      jobGuarantee: true,
      roadmap: [
        'IoT Architecture & Protocols',
        'Embedded C/C++ Programming',
        'Arduino & Raspberry Pi',
        'Sensor Integration & Calibration',
        'Wireless Communication (WiFi, Bluetooth)',
        'MQTT & IoT Messaging',
        'Cloud IoT Platforms (AWS IoT, Azure)',
        'Edge Computing & Analytics',
        'IoT Security & Privacy',
        'Industrial IoT Applications'
      ],
      skills: ['Arduino', 'Raspberry Pi', 'C/C++', 'MQTT', 'IoT Protocols', 'Embedded Systems'],
      careerOutcomes: ['IoT Developer', 'Embedded Systems Engineer', 'IoT Solutions Architect', 'Edge Computing Engineer'],
      salaryRange: '$70,000 - $140,000'
    },
    {
      id: 35,
      title: 'Industrial IoT & Automation',
      level: 'Intermediate to Advanced',
      rating: 4.6,
      students: 3500,
      duration: '12 weeks',
      price: 159,
      instructor: 'Michael Rodriguez',
      description: 'Specialized course on Industrial IoT, SCADA systems, PLC programming, and industrial automation protocols.',
      trending: true,
      modules: 14,
      projects: 5,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Industrial IoT Architecture',
        'PLC Programming & Logic',
        'SCADA Systems Design',
        'Industrial Communication Protocols',
        'OPC UA & Modbus',
        'HMI Development',
        'Predictive Maintenance',
        'Industrial Cybersecurity',
        'Digital Twin Implementation',
        'Industry 4.0 Integration'
      ],
      skills: ['PLC Programming', 'SCADA', 'Industrial Protocols', 'OPC UA', 'HMI', 'Automation'],
      careerOutcomes: ['Industrial Automation Engineer', 'SCADA Engineer', 'Control Systems Engineer', 'IIoT Specialist'],
      salaryRange: '$75,000 - $130,000'
    }
  ],
  'ar-vr-metaverse': [
    {
      id: 36,
      title: 'Unity AR/VR Development',
      level: 'Beginner to Advanced',
      rating: 4.8,
      students: 5200,
      duration: '16 weeks',
      price: 189,
      instructor: 'Jessica Park',
      description: 'Master AR/VR development with Unity. Create immersive experiences for mobile AR, VR headsets, and mixed reality devices.',
      trending: true,
      modules: 18,
      projects: 6,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Unity 3D Fundamentals',
        'C# Programming for Unity',
        'AR Foundation & ARCore/ARKit',
        'VR SDK Integration (Oculus, OpenXR)',
        'Spatial UI/UX Design',
        'Hand Tracking & Gesture Recognition',
        'Multiplayer VR Experiences',
        'Performance Optimization',
        'Mixed Reality Development',
        'Publishing & Distribution'
      ],
      skills: ['Unity', 'C#', 'ARCore', 'ARKit', 'VR SDKs', 'Spatial Computing', '3D Development'],
      careerOutcomes: ['AR/VR Developer', 'Unity Developer', 'Mixed Reality Engineer', 'Spatial Computing Developer'],
      salaryRange: '$80,000 - $150,000'
    },
    {
      id: 37,
      title: 'Metaverse & Web3D Development',
      level: 'Intermediate to Advanced',
      rating: 4.7,
      students: 2800,
      duration: '14 weeks',
      price: 219,
      instructor: 'David Kim',
      description: 'Build metaverse experiences using WebXR, Three.js, and blockchain integration. Create virtual worlds with NFT integration and virtual economies.',
      trending: true,
      modules: 16,
      projects: 5,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'WebXR & Browser-based VR/AR',
        'Three.js & 3D Web Development',
        'A-Frame VR Framework',
        'Metaverse Architecture Design',
        'Avatar Systems & Animation',
        'Virtual Economy Design',
        'NFT Integration in Virtual Worlds',
        'Social VR Features',
        'Cross-platform Compatibility',
        'Metaverse Deployment'
      ],
      skills: ['WebXR', 'Three.js', 'A-Frame', 'Virtual Worlds', 'NFT Integration', 'Web3D'],
      careerOutcomes: ['Metaverse Developer', 'Web3D Engineer', 'Virtual World Architect', 'WebXR Developer'],
      salaryRange: '$85,000 - $160,000'
    }
  ],
  'quantum-computing': [
    {
      id: 38,
      title: 'Quantum Computing Fundamentals',
      level: 'Intermediate to Advanced',
      rating: 4.5,
      students: 1800,
      duration: '12 weeks',
      price: 249,
      instructor: 'Dr. Alan Thompson',
      description: 'Introduction to quantum computing concepts, quantum algorithms, and programming with Qiskit. Explore quantum supremacy and near-term applications.',
      trending: true,
      modules: 14,
      projects: 4,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Quantum Mechanics for Computing',
        'Quantum Gates & Circuits',
        'Qiskit Programming',
        'Quantum Algorithms (Grover, Shor)',
        'Quantum Machine Learning',
        'Variational Quantum Eigensolver',
        'Quantum Approximate Optimization',
        'Quantum Error Correction',
        'NISQ Device Programming',
        'Quantum Computing Applications'
      ],
      skills: ['Quantum Computing', 'Qiskit', 'Quantum Algorithms', 'Linear Algebra', 'Quantum Mechanics'],
      careerOutcomes: ['Quantum Software Engineer', 'Quantum Research Scientist', 'Quantum Algorithm Developer'],
      salaryRange: '$100,000 - $200,000'
    }
  ],
  'robotics-automation': [
    {
      id: 39,
      title: 'ROS Robotics Development',
      level: 'Intermediate to Advanced',
      rating: 4.6,
      students: 4200,
      duration: '16 weeks',
      price: 199,
      instructor: 'Dr. Elena Rodriguez',
      description: 'Master robotics programming with ROS (Robot Operating System). Build autonomous robots, implement SLAM, and develop navigation systems.',
      trending: true,
      modules: 18,
      projects: 6,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'ROS Fundamentals & Architecture',
        'Robot Kinematics & Dynamics',
        'Sensor Integration (LIDAR, Cameras)',
        'SLAM (Simultaneous Localization & Mapping)',
        'Path Planning & Navigation',
        'Computer Vision for Robotics',
        'Manipulation & Grasping',
        'ROS2 & Modern Robotics',
        'Simulation with Gazebo',
        'Real Robot Implementation'
      ],
      skills: ['ROS', 'Python', 'C++', 'SLAM', 'Computer Vision', 'Robot Navigation', 'Sensor Fusion'],
      careerOutcomes: ['Robotics Engineer', 'Autonomous Systems Developer', 'ROS Developer', 'Robotics Research Engineer'],
      salaryRange: '$85,000 - $160,000'
    },
    {
      id: 40,
      title: 'Autonomous Vehicle Systems',
      level: 'Advanced to Expert',
      rating: 4.7,
      students: 2100,
      duration: '18 weeks',
      price: 279,
      instructor: 'Dr. James Wilson',
      description: 'Comprehensive course on autonomous vehicle development covering perception, planning, control, and safety systems for self-driving cars.',
      trending: true,
      modules: 20,
      projects: 5,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Autonomous Vehicle Architecture',
        'Sensor Fusion & Perception',
        'Deep Learning for AV',
        'LIDAR Point Cloud Processing',
        'Path Planning & Trajectory Generation',
        'Vehicle Control Systems',
        'Localization & HD Mapping',
        'Safety & Verification',
        'V2X Communication',
        'Autonomous Vehicle Testing'
      ],
      skills: ['Autonomous Vehicles', 'Computer Vision', 'LIDAR', 'Path Planning', 'Control Systems', 'Safety Systems'],
      careerOutcomes: ['Autonomous Vehicle Engineer', 'Self-Driving Car Developer', 'Perception Engineer', 'AV Safety Engineer'],
      salaryRange: '$110,000 - $220,000'
    }
  ],
  'edge-computing-5g': [
    {
      id: 46,
      title: 'Edge Computing Fundamentals & Architecture',
      level: 'Intermediate',
      rating: 4.6,
      students: 3500,
      duration: '12 weeks',
      price: 169,
      instructor: 'Dr. Maria Santos',
      description: 'Master edge computing concepts, distributed systems, and real-time processing at the network edge. Learn to deploy and manage edge infrastructure.',
      trending: true,
      modules: 14,
      projects: 5,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Edge Computing Architecture',
        'Distributed Systems Design',
        'Container Orchestration at Edge',
        'Real-time Data Processing',
        'Edge Security & Privacy',
        'IoT Integration',
        'Network Optimization',
        'Multi-access Edge Computing',
        'Edge AI/ML Deployment',
        'Performance Monitoring'
      ],
      skills: ['Edge Computing', 'Kubernetes', 'Container Orchestration', 'Real-time Processing', 'Distributed Systems'],
      careerOutcomes: ['Edge Computing Engineer', 'Distributed Systems Engineer', 'IoT Solutions Architect'],
      salaryRange: '$85,000 - $155,000'
    },
    {
      id: 47,
      title: '5G/6G Network Engineering',
      level: 'Advanced',
      rating: 4.7,
      students: 2200,
      duration: '16 weeks',
      price: 249,
      instructor: 'Prof. Ahmed Hassan',
      description: 'Comprehensive course on 5G network architecture, network slicing, and emerging 6G technologies. Master next-generation wireless communications.',
      trending: true,
      modules: 18,
      projects: 4,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        '5G Network Architecture',
        'Network Slicing & Virtualization',
        'mmWave & Massive MIMO',
        'Network Function Virtualization',
        'Software Defined Networking',
        'Edge Computing Integration',
        '6G Research & Technologies',
        'Network Security & Privacy',
        'Performance Optimization',
        'Future Wireless Systems'
      ],
      skills: ['5G Networks', '6G Research', 'Network Slicing', 'NFV', 'SDN', 'mmWave Technology'],
      careerOutcomes: ['5G Network Engineer', 'Wireless Systems Engineer', '6G Research Engineer', 'Network Architect'],
      salaryRange: '$95,000 - $180,000'
    },
    {
      id: 48,
      title: 'Smart Cities & IoT Infrastructure',
      level: 'Intermediate to Advanced',
      rating: 4.5,
      students: 4100,
      duration: '14 weeks',
      price: 189,
      instructor: 'Dr. Lisa Chen',
      description: 'Build smart city solutions using IoT, edge computing, and 5G networks. Design scalable urban infrastructure for the future.',
      trending: false,
      modules: 16,
      projects: 6,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Smart City Architecture',
        'IoT Sensor Networks',
        'Data Collection & Processing',
        'Urban Analytics & Insights',
        'Traffic Management Systems',
        'Smart Energy Grids',
        'Environmental Monitoring',
        'Public Safety Systems',
        'Citizen Engagement Platforms',
        'Sustainability & Efficiency'
      ],
      skills: ['Smart Cities', 'IoT', 'Urban Planning', 'Data Analytics', 'Sensor Networks', 'Public Infrastructure'],
      careerOutcomes: ['Smart City Engineer', 'IoT Systems Architect', 'Urban Technology Consultant'],
      salaryRange: '$80,000 - $145,000'
    }
  ],
  'space-technology': [
    {
      id: 49,
      title: 'Satellite Systems Engineering',
      level: 'Advanced',
      rating: 4.8,
      students: 1800,
      duration: '18 weeks',
      price: 299,
      instructor: 'Dr. Robert Kumar',
      description: 'Comprehensive satellite engineering course covering orbital mechanics, communication systems, and mission design. Industry-standard software and tools.',
      trending: true,
      modules: 20,
      projects: 4,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Orbital Mechanics & Dynamics',
        'Satellite Subsystems Design',
        'Communication Systems',
        'Attitude Determination & Control',
        'Propulsion Systems',
        'Thermal Management',
        'Power Systems Design',
        'Ground Station Operations',
        'Mission Planning & Operations',
        'Satellite Constellation Management'
      ],
      skills: ['Satellite Engineering', 'Orbital Mechanics', 'RF Engineering', 'Mission Design', 'Space Communications'],
      careerOutcomes: ['Satellite Engineer', 'Mission Analyst', 'RF Engineer', 'Space Systems Engineer'],
      salaryRange: '$95,000 - $175,000'
    },
    {
      id: 50,
      title: 'CubeSat Development & Deployment',
      level: 'Intermediate',
      rating: 4.6,
      students: 2400,
      duration: '12 weeks',
      price: 199,
      instructor: 'Sarah Williams',
      description: 'Hands-on CubeSat development course. Design, build, and deploy small satellites for research and commercial applications.',
      trending: true,
      modules: 14,
      projects: 5,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'CubeSat Standards & Specifications',
        'Mechanical Design & Structure',
        'Electronic Systems Integration',
        'Software & Firmware Development',
        'Communication Protocols',
        'Payload Integration',
        'Testing & Validation',
        'Launch Integration',
        'Ground Operations',
        'Data Analysis & Processing'
      ],
      skills: ['CubeSat Design', 'Small Satellites', 'Embedded Systems', 'Space Engineering', 'Project Management'],
      careerOutcomes: ['CubeSat Engineer', 'Small Satellite Developer', 'Space Technology Specialist'],
      salaryRange: '$75,000 - $140,000'
    },
    {
      id: 51,
      title: 'Mars Exploration Technology',
      level: 'Expert',
      rating: 4.9,
      students: 900,
      duration: '20 weeks',
      price: 399,
      instructor: 'Dr. Jennifer Martinez',
      description: 'Advanced course on Mars exploration technologies, rover systems, and interplanetary mission design. Learn from real Mars mission case studies.',
      trending: true,
      modules: 22,
      projects: 3,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Mars Environment & Challenges',
        'Interplanetary Trajectory Design',
        'Entry, Descent & Landing',
        'Rover Design & Navigation',
        'Autonomous Operations',
        'Scientific Instrumentation',
        'Sample Collection & Analysis',
        'Communication with Earth',
        'Life Support Systems',
        'Future Mars Missions'
      ],
      skills: ['Mars Exploration', 'Rover Systems', 'Autonomous Navigation', 'Space Exploration', 'Planetary Science'],
      careerOutcomes: ['Planetary Engineer', 'Mars Mission Specialist', 'Space Exploration Engineer'],
      salaryRange: '$110,000 - $200,000'
    }
  ],
  'biotechnology-health': [
    {
      id: 52,
      title: 'Digital Health & Telemedicine Platforms',
      level: 'Intermediate',
      rating: 4.7,
      students: 5200,
      duration: '14 weeks',
      price: 179,
      instructor: 'Dr. Emily Johnson',
      description: 'Build secure, scalable telemedicine and digital health platforms. Master healthcare compliance, data security, and patient care technologies.',
      trending: true,
      modules: 16,
      projects: 5,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Healthcare System Architecture',
        'HIPAA Compliance & Security',
        'Electronic Health Records',
        'Telemedicine Platforms',
        'Patient Data Management',
        'Medical Device Integration',
        'Clinical Decision Support',
        'Health Analytics & AI',
        'Mobile Health Applications',
        'Regulatory Requirements'
      ],
      skills: ['Digital Health', 'Telemedicine', 'HIPAA Compliance', 'Healthcare IT', 'Medical Data Security'],
      careerOutcomes: ['Health IT Developer', 'Digital Health Engineer', 'Medical Software Developer'],
      salaryRange: '$85,000 - $160,000'
    },
    {
      id: 53,
      title: 'Bioinformatics & Genomics',
      level: 'Advanced',
      rating: 4.8,
      students: 2800,
      duration: '16 weeks',
      price: 229,
      instructor: 'Prof. Michael Chen',
      description: 'Master computational biology, genomics analysis, and bioinformatics tools. Analyze genetic data and contribute to personalized medicine.',
      trending: true,
      modules: 18,
      projects: 4,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Molecular Biology Fundamentals',
        'Genomics Data Analysis',
        'Sequence Alignment & Assembly',
        'Variant Calling & Annotation',
        'Phylogenetic Analysis',
        'Protein Structure Prediction',
        'Machine Learning in Biology',
        'Database Management',
        'Visualization Techniques',
        'Research Applications'
      ],
      skills: ['Bioinformatics', 'Genomics', 'Python', 'R', 'Machine Learning', 'Data Analysis'],
      careerOutcomes: ['Bioinformatics Scientist', 'Computational Biologist', 'Genomics Analyst'],
      salaryRange: '$90,000 - $170,000'
    },
    {
      id: 54,
      title: 'Medical Device Software Development',
      level: 'Advanced',
      rating: 4.6,
      students: 1600,
      duration: '18 weeks',
      price: 279,
      instructor: 'Dr. Anna Rodriguez',
      description: 'Develop FDA-compliant medical device software. Learn regulatory requirements, testing procedures, and quality assurance for medical applications.',
      trending: false,
      modules: 20,
      projects: 3,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Medical Device Regulations',
        'FDA Software Guidelines',
        'Risk Management (ISO 14971)',
        'Software Life Cycle Processes',
        'Verification & Validation',
        'Quality Management Systems',
        'Cybersecurity for Medical Devices',
        'Usability Engineering',
        'Post-market Surveillance',
        'International Standards'
      ],
      skills: ['Medical Device Software', 'FDA Regulations', 'Quality Assurance', 'Risk Management', 'Compliance'],
      careerOutcomes: ['Medical Device Engineer', 'Regulatory Affairs Specialist', 'Quality Assurance Engineer'],
      salaryRange: '$95,000 - $180,000'
    }
  ],
  'green-technology': [
    {
      id: 55,
      title: 'Renewable Energy Systems Design',
      level: 'Intermediate to Advanced',
      rating: 4.7,
      students: 3800,
      duration: '14 weeks',
      price: 189,
      instructor: 'Dr. James Wilson',
      description: 'Design and optimize renewable energy systems including solar, wind, and energy storage. Master grid integration and energy efficiency.',
      trending: true,
      modules: 16,
      projects: 5,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Renewable Energy Fundamentals',
        'Solar Power System Design',
        'Wind Energy Systems',
        'Energy Storage Technologies',
        'Grid Integration & Management',
        'Power Electronics',
        'Energy Efficiency Optimization',
        'Economic Analysis',
        'Environmental Impact Assessment',
        'Future Energy Technologies'
      ],
      skills: ['Renewable Energy', 'Solar Power', 'Wind Energy', 'Energy Storage', 'Grid Integration'],
      careerOutcomes: ['Renewable Energy Engineer', 'Solar System Designer', 'Energy Consultant'],
      salaryRange: '$75,000 - $145,000'
    },
    {
      id: 56,
      title: 'Smart Grid & Energy Management',
      level: 'Advanced',
      rating: 4.8,
      students: 2100,
      duration: '16 weeks',
      price: 219,
      instructor: 'Dr. Linda Garcia',
      description: 'Build intelligent energy management systems and smart grid solutions. Master demand response, energy optimization, and grid modernization.',
      trending: true,
      modules: 18,
      projects: 4,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Smart Grid Architecture',
        'Advanced Metering Infrastructure',
        'Demand Response Systems',
        'Grid Automation & Control',
        'Energy Management Software',
        'Cybersecurity for Energy Systems',
        'Distributed Energy Resources',
        'Electric Vehicle Integration',
        'Data Analytics for Energy',
        'Grid Modernization'
      ],
      skills: ['Smart Grid', 'Energy Management', 'Grid Automation', 'Demand Response', 'Energy Analytics'],
      careerOutcomes: ['Smart Grid Engineer', 'Energy Management Specialist', 'Grid Modernization Consultant'],
      salaryRange: '$85,000 - $165,000'
    },
    {
      id: 57,
      title: 'Environmental Monitoring & Sustainability Tech',
      level: 'Intermediate',
      rating: 4.5,
      students: 4500,
      duration: '12 weeks',
      price: 159,
      instructor: 'Dr. Patricia Lee',
      description: 'Develop environmental monitoring systems and sustainability technologies. Learn IoT sensors, data analysis, and environmental impact assessment.',
      trending: false,
      modules: 14,
      projects: 6,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Environmental Sensing Technologies',
        'Air Quality Monitoring',
        'Water Quality Assessment',
        'Carbon Footprint Tracking',
        'IoT for Environmental Data',
        'Data Analysis & Visualization',
        'Sustainability Metrics',
        'Life Cycle Assessment',
        'Environmental Reporting',
        'Policy & Compliance'
      ],
      skills: ['Environmental Monitoring', 'IoT Sensors', 'Data Analysis', 'Sustainability', 'Environmental Compliance'],
      careerOutcomes: ['Environmental Engineer', 'Sustainability Analyst', 'Environmental Data Scientist'],
      salaryRange: '$70,000 - $135,000'
    }
  ],
  'neuromorphic-computing': [
    {
      id: 58,
      title: 'Brain-Computer Interface Development',
      level: 'Advanced to Expert',
      rating: 4.9,
      students: 1200,
      duration: '20 weeks',
      price: 349,
      instructor: 'Dr. Alex Petrov',
      description: 'Cutting-edge course on brain-computer interfaces, neural signal processing, and cognitive technologies. Work with real EEG/fMRI data.',
      trending: true,
      modules: 22,
      projects: 3,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Neuroscience Fundamentals',
        'Neural Signal Acquisition',
        'EEG/fMRI Signal Processing',
        'Feature Extraction & Classification',
        'Machine Learning for BCIs',
        'Real-time Processing Systems',
        'Invasive vs Non-invasive BCIs',
        'Neurofeedback Applications',
        'Ethical Considerations',
        'Future of BCIs'
      ],
      skills: ['Brain-Computer Interfaces', 'Neural Signal Processing', 'EEG Analysis', 'Machine Learning', 'Neurotechnology'],
      careerOutcomes: ['BCI Research Engineer', 'Neural Engineer', 'Neurotechnology Developer'],
      salaryRange: '$100,000 - $190,000'
    },
    {
      id: 59,
      title: 'Neuromorphic Computing Architecture',
      level: 'Expert',
      rating: 4.8,
      students: 800,
      duration: '18 weeks',
      price: 299,
      instructor: 'Prof. Rachel Kim',
      description: 'Advanced neuromorphic computing course covering spiking neural networks, memristive devices, and brain-inspired architectures.',
      trending: true,
      modules: 20,
      projects: 2,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Neuromorphic Computing Principles',
        'Spiking Neural Networks',
        'Memristive Device Physics',
        'Synaptic Computing Models',
        'Hardware Architecture Design',
        'Learning Algorithms',
        'Spike-based Processing',
        'Energy Efficiency Optimization',
        'Neuromorphic Chips',
        'Applications & Future Trends'
      ],
      skills: ['Neuromorphic Computing', 'Spiking Neural Networks', 'Hardware Design', 'Memristive Devices', 'Bio-inspired Computing'],
      careerOutcomes: ['Neuromorphic Engineer', 'Hardware Research Engineer', 'Cognitive Computing Specialist'],
      salaryRange: '$110,000 - $200,000'
    },
    {
      id: 60,
      title: 'Cognitive Enhancement Technologies',
      level: 'Advanced',
      rating: 4.6,
      students: 1500,
      duration: '14 weeks',
      price: 239,
      instructor: 'Dr. Maria Santos',
      description: 'Explore technologies for cognitive enhancement, neurofeedback systems, and ethical implications of brain augmentation technologies.',
      trending: false,
      modules: 16,
      projects: 4,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Cognitive Science Foundations',
        'Neurofeedback Systems',
        'Transcranial Stimulation',
        'Cognitive Training Applications',
        'Memory Enhancement Technologies',
        'Attention Training Systems',
        'Brain Training Games',
        'Ethical Neurotechnology',
        'Safety & Regulations',
        'Future Applications'
      ],
      skills: ['Cognitive Enhancement', 'Neurofeedback', 'Brain Training', 'Ethical Technology', 'Human Augmentation'],
      careerOutcomes: ['Cognitive Technology Developer', 'Neurofeedback Specialist', 'Human Performance Engineer'],
      salaryRange: '$85,000 - $165,000'
    },
    {
      id: 61,
      title: 'Advanced Quantum Machine Learning Research',
      level: 'Master\'s to PhD',
      rating: 4.9,
      students: 450,
      duration: '24 weeks',
      price: 499,
      instructor: 'Prof. Dr. Sarah Chen',
      description: 'Cutting-edge research-level course combining quantum computing with advanced machine learning. Explore quantum neural networks, variational quantum algorithms, and quantum advantage in ML.',
      trending: true,
      modules: 26,
      projects: 2,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Quantum Information Theory',
        'Quantum Neural Networks',
        'Variational Quantum Eigensolvers',
        'Quantum Approximate Optimization',
        'Quantum Generative Adversarial Networks',
        'Quantum Reinforcement Learning',
        'Quantum Feature Maps',
        'Quantum Kernel Methods',
        'NISQ Algorithm Design',
        'Quantum Error Correction for ML',
        'Quantum Supremacy Research',
        'Research Methodology & Publication'
      ],
      skills: ['Quantum ML', 'Research Methods', 'Quantum Algorithms', 'Academic Writing', 'Qiskit', 'Cirq'],
      careerOutcomes: ['Quantum Research Scientist', 'Quantum ML Engineer', 'Research Professor', 'Quantum Computing Researcher'],
      salaryRange: '$130,000 - $250,000'
    },
    {
      id: 62,
      title: 'Advanced AI Safety & Alignment Research',
      level: 'Master\'s to PhD',
      rating: 4.8,
      students: 320,
      duration: '20 weeks',
      price: 449,
      instructor: 'Dr. Michael Roberts',
      description: 'Master\'s level research course on AI safety, alignment, and interpretability. Study advanced techniques for building safe, aligned AI systems and contribute to cutting-edge research.',
      trending: true,
      modules: 22,
      projects: 3,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'AI Safety Fundamentals',
        'Value Alignment Problem',
        'Interpretability & Explainability',
        'Robustness & Adversarial Examples',
        'Constitutional AI',
        'Reward Modeling',
        'AI Governance & Policy',
        'Mechanistic Interpretability',
        'AI Risk Assessment',
        'Research Ethics',
        'Publication & Peer Review'
      ],
      skills: ['AI Safety', 'Research Ethics', 'Interpretability', 'AI Governance', 'Technical Writing', 'Python'],
      careerOutcomes: ['AI Safety Researcher', 'AI Ethics Consultant', 'AI Policy Advisor', 'Research Scientist'],
      salaryRange: '$140,000 - $280,000'
    },
    {
      id: 63,
      title: 'Advanced Distributed Systems Architecture Research',
      level: 'Master\'s to PhD',
      rating: 4.7,
      students: 280,
      duration: '22 weeks',
      price: 399,
      instructor: 'Prof. Lisa Wang',
      description: 'Research-oriented course on advanced distributed systems, consensus algorithms, and large-scale system design. Explore cutting-edge research in distributed computing.',
      trending: false,
      modules: 24,
      projects: 2,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Advanced Consensus Algorithms',
        'Distributed System Theory',
        'CAP Theorem & Trade-offs',
        'Byzantine Fault Tolerance',
        'Distributed Database Systems',
        'Blockchain Consensus Research',
        'Edge Computing Architecture',
        'Serverless Computing Research',
        'Performance Analysis',
        'System Verification',
        'Research Publication Process'
      ],
      skills: ['Distributed Systems', 'System Design', 'Research Methods', 'Performance Analysis', 'Go', 'Rust'],
      careerOutcomes: ['Systems Research Engineer', 'Principal Architect', 'Research Scientist', 'CTO'],
      salaryRange: '$150,000 - $300,000'
    },
    {
      id: 64,
      title: 'Advanced Biomedical AI & Computational Biology',
      level: 'Master\'s to PhD',
      rating: 4.9,
      students: 180,
      duration: '26 weeks',
      price: 549,
      instructor: 'Dr. Jennifer Martinez',
      description: 'Master\'s level course combining AI with computational biology and biomedical research. Develop novel ML algorithms for drug discovery, genomics, and personalized medicine.',
      trending: true,
      modules: 28,
      projects: 4,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Computational Biology Fundamentals',
        'Genomics & Proteomics Data',
        'Drug Discovery ML Pipeline',
        'Protein Structure Prediction',
        'Clinical Trial Design',
        'Biomedical Image Analysis',
        'Personalized Medicine AI',
        'Regulatory Compliance',
        'Bioinformatics Databases',
        'Research Collaboration',
        'Grant Writing & Funding',
        'Publication & Patent Process'
      ],
      skills: ['Biomedical AI', 'Computational Biology', 'Drug Discovery', 'Clinical Research', 'Python', 'R'],
      careerOutcomes: ['Biomedical Research Scientist', 'Drug Discovery Engineer', 'Clinical AI Specialist', 'Pharma Research Director'],
      salaryRange: '$120,000 - $220,000'
    },
    {
      id: 65,
      title: 'Advanced Cybersecurity Research & Cryptography',
      level: 'Master\'s to PhD',
      rating: 4.8,
      students: 240,
      duration: '20 weeks',
      price: 459,
      instructor: 'Prof. David Kim',
      description: 'Research-level cybersecurity and cryptography course. Study advanced cryptographic protocols, zero-knowledge proofs, and cutting-edge security research.',
      trending: true,
      modules: 22,
      projects: 3,
      certificate: true,
      jobGuarantee: false,
      roadmap: [
        'Advanced Cryptography Theory',
        'Zero-Knowledge Proofs',
        'Post-Quantum Cryptography',
        'Homomorphic Encryption',
        'Secure Multi-party Computation',
        'Advanced Attack Vectors',
        'Formal Verification',
        'Cryptographic Protocol Design',
        'Security Research Methods',
        'Vulnerability Research',
        'Academic Paper Writing'
      ],
      skills: ['Advanced Cryptography', 'Security Research', 'Zero-Knowledge Proofs', 'Formal Methods', 'C++', 'Rust'],
      careerOutcomes: ['Security Research Scientist', 'Cryptography Engineer', 'Security Architect', 'Academic Researcher'],
      salaryRange: '$130,000 - $260,000'
    }
  ]
}

// Floating background elements
const FloatingElement = ({ children, delay = 0, duration = 3 }: { children: React.ReactNode, delay?: number, duration?: number }) => (
  <motion.div
    className="absolute opacity-20"
    animate={{
      y: [0, -20, 0],
      x: [0, 10, -10, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay
    }}
  >
    {children}
  </motion.div>
)

export default function TechnologySubcategoryPage({ params }: { params: { subcategory: string } }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [mounted, setMounted] = useState(false)
  const [subcategoryId, setSubcategoryId] = useState<string>('')
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [showSkillTree, setShowSkillTree] = useState(false)
  const [showRoadmap, setShowRoadmap] = useState(false)

  // New hooks for enhanced features
  const { celebration, celebrate, hideCelebration } = useCelebration()
  const { isMobile } = useMobileDetection()

  useEffect(() => {
    setMounted(true)
    // Handle async params in useEffect
    Promise.resolve(params).then((resolvedParams) => {
      setSubcategoryId(resolvedParams.subcategory)
    })
  }, [params])

  // Find the subcategory data
  const subcategory = techSubcategories.find(sub => sub.id === subcategoryId)

  if (mounted && subcategoryId && !subcategory) {
    notFound()
  }

  // Get skills for this subcategory
  const skills = subcategorySkills[subcategoryId as keyof typeof subcategorySkills] || []

  const filteredSkills = skills.filter(skill =>
    skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!mounted || !subcategoryId) return null

  // Mock course data for preview modal
  const mockCourseData = skills.length > 0 ? {
    id: skills[0].id.toString(),
    title: skills[0].title,
    description: skills[0].description,
    instructor: {
      name: skills[0].instructor,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      credentials: 'Senior Software Engineer',
      rating: skills[0].rating
    },
    preview: {
      videoUrl: '',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop',
      duration: '3:45'
    },
    stats: {
      duration: skills[0].duration,
      students: skills[0].students,
      rating: skills[0].rating,
      reviews: Math.floor(skills[0].students * 0.3),
      level: skills[0].level
    },
    curriculum: {
      modules: skills[0].modules,
      lessons: skills[0].modules * 4,
      projects: skills[0].projects,
      quizzes: skills[0].modules * 2
    },
    skills: skills[0].skills,
    outcomes: skills[0].careerOutcomes.map(outcome => `Master ${outcome} skills`),
    requirements: ['Basic computer skills', 'High school diploma', 'Passion for learning'],
    pricing: {
      original: skills[0].price + 50,
      current: skills[0].price,
      discount: 20
    },
    highlights: [
      'Lifetime access to course materials',
      'Certificate of completion',
      'Project-based learning',
      'Expert instructor support'
    ],
    testimonials: [
      {
        name: 'John Smith',
        role: 'Software Developer',
        content: 'This course transformed my career. Highly recommended!',
        rating: 5
      },
      {
        name: 'Sarah Johnson',
        role: 'Tech Lead',
        content: 'Excellent content and practical examples.',
        rating: 5
      }
    ]
  } : null

  const handleCourseClick = (course: any) => {
    setSelectedCourse(mockCourseData)
  }

  const handleCelebration = (type: any, title: string, subtitle?: string) => {
    celebrate(type, title, subtitle)
  }

  return (
    <SwipeNavigation
      onNavigateBack={() => window.history.back()}
      className="min-h-screen relative overflow-hidden"
    >
      {/* Immersive Background */}
      <ImmersiveBackground
        variant={subcategoryId as any || 'technology'}
        intensity={isMobile ? 'medium' : 'high'}
      />

      <div className="relative z-10">
        {/* Sound Effects */}
        <SoundEffects />

        {/* Magnetic Cursor */}
        {!isMobile && <MagneticCursor />}

        {/* Floating Notifications */}
        <FloatingNotifications />

        {/* Celebration Effects */}
        <CelebrationEffects
          isVisible={celebration.isVisible}
          type={celebration.type}
          title={celebration.title}
          subtitle={celebration.subtitle}
          onComplete={hideCelebration}
        />

        {/* Course Preview Modal */}
        <CoursePreviewModal
          course={selectedCourse}
          isOpen={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />

        {/* Particle System */}
        <ParticleSystem particleCount={isMobile ? 15 : 30} subcategory={subcategoryId} />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingElement delay={0} duration={4}>
          <Code className="w-16 h-16 text-blue-400" style={{ top: '10%', left: '10%' }} />
        </FloatingElement>
        <FloatingElement delay={1} duration={5}>
          <Rocket className="w-12 h-12 text-purple-400" style={{ top: '20%', right: '15%' }} />
        </FloatingElement>
        <FloatingElement delay={2} duration={3.5}>
          <Zap className="w-14 h-14 text-yellow-400" style={{ bottom: '30%', left: '5%' }} />
        </FloatingElement>
        <FloatingElement delay={1.5} duration={4.5}>
          <Sparkles className="w-10 h-10 text-pink-400" style={{ bottom: '20%', right: '10%' }} />
        </FloatingElement>

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute w-72 h-72 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -50, 100, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '10%', left: '60%' }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 120, 0],
            y: [0, 80, -60, 0],
            scale: [1, 0.8, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          style={{ bottom: '10%', left: '10%' }}
        />
      </div>

      {/* Hero Section */}
      <motion.section
        className="relative py-20 px-4 sm:px-6 lg:px-8 z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <motion.div
            className="flex items-center gap-2 text-sm text-gray-300 mb-6"
            variants={itemVariants}
          >
            <Link href="/explore" className="hover:text-blue-400 transition-colors">Explore</Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/explore/technology" className="hover:text-blue-400 transition-colors">Technology</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-white">{subcategory.name}</span>
          </motion.div>

          <div className="text-center mb-12">
            {/* Animated Hero Icon */}
            <motion.div
              className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${subcategory.gradient} rounded-3xl mb-6 relative`}
              variants={floatingVariants}
              animate="animate"
            >
              <motion.div
                variants={pulseVariants}
                animate="animate"
              >
                {subcategory.icon}
              </motion.div>

              {/* Sparkle effects around icon */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    top: i === 0 ? '-10px' : i === 1 ? '-5px' : i === 2 ? 'calc(100% + 5px)' : 'calc(100% + 10px)',
                    left: i === 0 ? '20%' : i === 1 ? '80%' : i === 2 ? '10%' : '90%',
                  }}
                  variants={sparkleVariants}
                  animate="animate"
                  transition={{ delay: i * 0.5 }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </motion.div>
              ))}
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-6"
              variants={itemVariants}
            >
              {subcategory.name}
            </motion.h1>

            <motion.p
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              {subcategory.description}
            </motion.p>

            {/* Back Button with hover animation */}
            <motion.div
              className="mb-8"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  variant="outline"
                  className="gap-2 bg-white/10 border-white/20 hover:bg-white/20 text-white"
                  data-magnetic
                >
                  <Link href="/explore/technology">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Technology
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Animated Search Bar */}
            <motion.div
              className="max-w-2xl mx-auto relative mb-8"
              variants={itemVariants}
            >
              <motion.div
                className="relative"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder={`Search ${subcategory.name.toLowerCase()} skills...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm focus:border-blue-400 transition-all text-white placeholder-gray-400"
                />
              </motion.div>
            </motion.div>

            {/* Animated Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
              variants={containerVariants}
            >
              {[
                { value: `${subcategory.skillCount}+`, label: 'Available Skills', color: 'text-blue-400' },
                { value: '15k+', label: 'Active Learners', color: 'text-green-400' },
                { value: '50+', label: 'Expert Instructors', color: 'text-purple-400' },
                { value: '4.8/5', label: 'Average Rating', color: 'text-orange-400' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(255,255,255,0.15)"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className={`text-2xl font-bold ${stat.color}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Skills Overview */}
      <motion.section
        className="py-16 px-4 sm:px-6 lg:px-8 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Skills in {subcategory.name}
            </h2>
            <p className="text-xl text-gray-300">
              Master the essential technologies and frameworks in this field
            </p>
          </motion.div>

          {/* Animated Skills Tags */}
          <motion.div
            className="flex flex-wrap gap-3 justify-center mb-12"
            variants={containerVariants}
          >
            {subcategory.skills.map((skill, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgba(59, 130, 246, 0.3)",
                  borderColor: "rgba(59, 130, 246, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Badge
                  variant="secondary"
                  className="px-4 py-2 text-sm bg-white/10 border border-white/20 text-white hover:bg-blue-500/30 transition-all cursor-pointer"
                >
                  {skill}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Courses */}
      <motion.section
        className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12"
            variants={itemVariants}
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Featured {subcategory.name} Courses
              </h2>
              <p className="text-xl text-gray-300">
                Learn from industry experts and build real-world projects
              </p>
            </div>

            {/* Sort Options */}
            <motion.div
              className="flex gap-3 mt-6 md:mt-0"
              whileHover={{ scale: 1.02 }}
            >
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white backdrop-blur-sm"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Recently Updated</option>
                <option value="price">Price: Low to High</option>
              </select>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            <AnimatePresence>
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    y: -12,
                    rotateX: 5,
                    rotateY: 5,
                    scale: 1.02,
                    transition: {
                      duration: 0.3,
                      type: "spring",
                      stiffness: 300
                    }
                  }}
                  style={{
                    transformStyle: 'preserve-3d',
                    perspective: 1000
                  }}
                >
                  <MobileCard
                    onTap={() => handleCourseClick(skill)}
                    onSwipeLeft={() => handleCelebration('achievement', 'Added to Favorites!', `${skill.title} saved`)}
                    onSwipeRight={() => handleCelebration('course_complete', 'Quick Preview!', 'Swipe for actions')}
                  >
                    <Card
                      className="group hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-0 bg-white/10 backdrop-blur-sm border border-white/20 h-full transform-gpu"
                      data-magnetic
                      style={{
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(59, 130, 246, 0.1)'
                      }}
                    >
                      {/* Skill Image with gradient overlay */}
                      <div className={`relative h-48 bg-gradient-to-br ${subcategory.gradient} overflow-hidden`}>
                        <motion.div
                          className="absolute inset-0 bg-black/30"
                          whileHover={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                          transition={{ duration: 0.3 }}
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          {skill.trending && (
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Badge className="bg-red-500 text-white">
                                🔥 Trending
                              </Badge>
                            </motion.div>
                          )}
                          <Badge variant="secondary" className="bg-white/90 text-gray-800">
                            {skill.level}
                          </Badge>
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <Badge className="bg-blue-600 text-white">
                            {subcategory.name}
                          </Badge>
                        </div>

                        {/* Floating icon */}
                        <motion.div
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                          animate={{
                            y: [0, -10, 0],
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                            {subcategory.icon}
                          </div>
                        </motion.div>
                      </div>

                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <motion.div
                            className="flex items-center gap-1"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium text-white">{skill.rating}</span>
                          </motion.div>
                        </div>

                        <CardTitle className="text-xl group-hover:text-blue-400 transition-colors line-clamp-2 text-white">
                          {skill.title}
                        </CardTitle>

                        <CardDescription className="text-sm line-clamp-2 text-gray-300">
                          {skill.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Instructor */}
                        <div className="flex items-center gap-2">
                          <motion.div
                            className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            {skill.instructor[0]}
                          </motion.div>
                          <span className="text-sm text-gray-300">{skill.instructor}</span>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{skill.students.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{skill.duration}</span>
                          </div>
                        </div>

                        {/* Course Details */}
                        <div className="space-y-3">
                          {/* Modules and Projects */}
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <span>{(skill as any).modules || 10} Modules</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span>{(skill as any).projects || 3} Projects</span>
                            </div>
                          </div>

                          {/* Skills Tags */}
                          {(skill as any).skills && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-white">Skills You'll Learn:</h4>
                              <div className="flex flex-wrap gap-1">
                                {(skill as any).skills.slice(0, 4).map((skillName: string, idx: number) => (
                                  <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-200 border-blue-400/30">
                                      {skillName}
                                    </Badge>
                                  </motion.div>
                                ))}
                                {(skill as any).skills.length > 4 && (
                                  <Badge variant="secondary" className="text-xs bg-white/10 text-gray-300 border-white/20">
                                    +{(skill as any).skills.length - 4} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Career Outcomes */}
                          {(skill as any).careerOutcomes && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-white">Career Outcomes:</h4>
                              <div className="flex flex-wrap gap-1">
                                {(skill as any).careerOutcomes.slice(0, 2).map((career: string, idx: number) => (
                                  <Badge key={idx} variant="secondary" className="text-xs bg-purple-500/20 text-purple-200 border-purple-400/30">
                                    {career}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Learning Path Preview */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-white">Learning Roadmap:</h4>
                            <div className="flex flex-wrap gap-1">
                              {skill.roadmap.slice(0, 3).map((step, idx) => (
                                <motion.div
                                  key={idx}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <Badge variant="secondary" className="text-xs bg-white/10 text-gray-300 border-white/20">
                                    {step}
                                  </Badge>
                                </motion.div>
                              ))}
                              <Badge variant="secondary" className="text-xs bg-white/10 text-gray-300 border-white/20">
                                +{skill.roadmap.length - 3} more steps
                              </Badge>
                            </div>
                          </div>

                          {/* Job Guarantee & Certificate */}
                          <div className="flex gap-2">
                            {(skill as any).certificate && (
                              <Badge className="text-xs bg-yellow-500/20 text-yellow-200 border-yellow-400/30">
                                🏆 Certificate
                              </Badge>
                            )}
                            {(skill as any).jobGuarantee && (
                              <Badge className="text-xs bg-green-500/20 text-green-200 border-green-400/30">
                                💼 Job Guarantee
                              </Badge>
                            )}
                          </div>

                          {/* Salary Range */}
                          {(skill as any).salaryRange && (
                            <div className="pt-2 border-t border-white/10">
                              <div className="text-sm text-gray-300">
                                <span className="text-green-400 font-medium">💰 Salary: {(skill as any).salaryRange}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Price and CTA */}
                        <div className="flex justify-between items-center pt-2 border-t border-white/20">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <span className="text-lg font-bold text-green-400">${skill.price}</span>
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button size="sm" className="group-hover:bg-blue-600 transition-colors bg-blue-500">
                              <Play className="w-4 h-4 mr-1" />
                              Start Learning
                            </Button>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </MobileCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* No Results */}
          {filteredSkills.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-medium text-white mb-2">No courses found</h3>
              <p className="text-gray-300 mb-4">
                Try adjusting your search terms or browse our other technology categories
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                  <Link href="/explore/technology">Browse All Technology</Link>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Interactive Roadmap */}
      <motion.section
        className="py-16 px-4 sm:px-6 lg:px-8 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants}>
            <InteractiveRoadmap subcategory={subcategoryId} />
          </motion.div>
        </div>
      </motion.section>

      {/* Interactive Skill Tree */}
      <motion.section
        className="py-16 px-4 sm:px-6 lg:px-8 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Interactive Learning Path
            </h2>
            <p className="text-xl text-gray-300">
              Follow a structured progression through {subcategory.name.toLowerCase()} skills
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <SkillTree subcategory={subcategoryId} />
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            variants={itemVariants}
          >
            Ready to Master {subcategory.name}?
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 mb-8"
            variants={itemVariants}
          >
            Join thousands of learners and start building expertise in {subcategory.name.toLowerCase()}
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={containerVariants}
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                size="lg"
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                data-magnetic
              >
                <Link href="/auth/register">Start Learning Today</Link>
              </Button>
            </motion.div>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 py-3 bg-white/10 border-white/20 hover:bg-white/20 text-white"
                data-magnetic
              >
                <Link href="/dashboard/meetings">Join Study Group</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Certification Pathways Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <CertificationPathways subcategory={subcategoryId} />
        </div>
      </motion.section>

      {/* Industry-Specific Tracks Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <IndustryTracks subcategory={subcategoryId} />
        </div>
      </motion.section>

      {/* Final Achievement Stats */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              🚀 Comprehensive Learning Platform
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <motion.div
              variants={itemVariants}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              whileHover={{ scale: 1.05, rotateY: 5 }}
            >
              <div className="text-3xl font-bold text-blue-400 mb-2">40+</div>
              <div className="text-white font-medium mb-1">Advanced Courses</div>
              <div className="text-gray-400 text-sm">Cutting-edge curriculum</div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              whileHover={{ scale: 1.05, rotateY: 5 }}
            >
              <div className="text-3xl font-bold text-green-400 mb-2">12</div>
              <div className="text-white font-medium mb-1">Technology Tracks</div>
              <div className="text-gray-400 text-sm">Including emerging tech</div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              whileHover={{ scale: 1.05, rotateY: 5 }}
            >
              <div className="text-3xl font-bold text-purple-400 mb-2">4</div>
              <div className="text-white font-medium mb-1">Certification Pathways</div>
              <div className="text-gray-400 text-sm">Industry-recognized</div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              whileHover={{ scale: 1.05, rotateY: 5 }}
            >
              <div className="text-3xl font-bold text-yellow-400 mb-2">6</div>
              <div className="text-white font-medium mb-1">Industry Specializations</div>
              <div className="text-gray-400 text-sm">Real-world focused</div>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="p-8 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl border border-white/20"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              🎯 Your Learning Journey Awaits
            </h3>
            <p className="text-gray-300 text-lg mb-6 max-w-3xl mx-auto">
              Join thousands of learners advancing their careers with our comprehensive,
              industry-aligned technology education platform. From fundamentals to cutting-edge specializations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
                data-magnetic
                onClick={() => handleCelebration('course_complete', 'Welcome to Skill Circle!', 'Your learning journey begins now')}
              >
                Start Learning Today
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-3"
                data-magnetic
              >
                Explore All Tracks
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>
        </div>
      </SwipeNavigation>
    </div>
  )
}