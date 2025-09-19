export interface RoadmapNode {
  id: string
  title: string
  description: string
  type: 'foundation' | 'core' | 'advanced' | 'optional' | 'practice'
  position: { x: number; y: number }
  connections: string[]
  status: 'pending' | 'in-progress' | 'completed' | 'skipped'
  estimatedTime: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  resources: {
    type: 'article' | 'video' | 'course' | 'book' | 'practice'
    title: string
    url: string
    duration?: string
  }[]
  prerequisites?: string[]
  skills: string[]
  importance: 'essential' | 'recommended' | 'optional'
}

export const devopsRoadmap: RoadmapNode[] = [
  // Foundation
  {
    id: 'linux-basics',
    title: 'Linux Fundamentals',
    description: 'Master Linux command line, file systems, and basic administration',
    type: 'foundation',
    position: { x: 0, y: 0 },
    connections: ['networking', 'scripting'],
    status: 'pending',
    estimatedTime: '40',
    difficulty: 'beginner',
    importance: 'essential',
    skills: ['Terminal', 'File Systems', 'Process Management', 'User Management'],
    resources: [
      {
        type: 'course',
        title: 'Linux Command Line Basics',
        url: '/courses/linux-basics',
        duration: '8 hours'
      },
      {
        type: 'practice',
        title: 'Linux Lab Exercises',
        url: '/practice/linux-lab',
        duration: '12 hours'
      }
    ]
  },
  {
    id: 'networking',
    title: 'Networking Concepts',
    description: 'TCP/IP, DNS, HTTP/HTTPS, Load Balancing, and network protocols',
    type: 'foundation',
    position: { x: 0, y: 1 },
    connections: ['security', 'monitoring'],
    status: 'pending',
    estimatedTime: '35',
    difficulty: 'beginner',
    importance: 'essential',
    skills: ['TCP/IP', 'DNS', 'HTTP/HTTPS', 'Load Balancing', 'Firewalls'],
    resources: [
      {
        type: 'video',
        title: 'Networking for DevOps',
        url: '/videos/networking-devops',
        duration: '6 hours'
      }
    ]
  },
  {
    id: 'scripting',
    title: 'Scripting Languages',
    description: 'Bash, Python, or Go for automation and tooling',
    type: 'foundation',
    position: { x: 0, y: 2 },
    connections: ['automation', 'iac'],
    status: 'pending',
    estimatedTime: '45',
    difficulty: 'intermediate',
    importance: 'essential',
    skills: ['Bash Scripting', 'Python', 'Go', 'Automation'],
    resources: [
      {
        type: 'course',
        title: 'Python for DevOps',
        url: '/courses/python-devops',
        duration: '15 hours'
      }
    ]
  },

  // Core Skills
  {
    id: 'git',
    title: 'Version Control (Git)',
    description: 'Git workflows, branching strategies, and collaboration',
    type: 'core',
    position: { x: 1, y: 0 },
    connections: ['ci-cd', 'collaboration'],
    status: 'pending',
    estimatedTime: '25',
    difficulty: 'beginner',
    importance: 'essential',
    skills: ['Git', 'GitHub/GitLab', 'Branching', 'Merging', 'Collaboration'],
    resources: [
      {
        type: 'course',
        title: 'Git Mastery',
        url: '/courses/git-mastery',
        duration: '8 hours'
      }
    ]
  },
  {
    id: 'ci-cd',
    title: 'CI/CD Pipelines',
    description: 'Jenkins, GitHub Actions, GitLab CI, automated testing and deployment',
    type: 'core',
    position: { x: 1, y: 1 },
    connections: ['containerization', 'testing'],
    status: 'pending',
    estimatedTime: '50',
    difficulty: 'intermediate',
    importance: 'essential',
    skills: ['Jenkins', 'GitHub Actions', 'GitLab CI', 'Pipeline Design', 'Automated Testing'],
    resources: [
      {
        type: 'course',
        title: 'CI/CD with Jenkins',
        url: '/courses/jenkins-cicd',
        duration: '12 hours'
      }
    ]
  },
  {
    id: 'containerization',
    title: 'Containerization',
    description: 'Docker fundamentals, container lifecycle, and best practices',
    type: 'core',
    position: { x: 1, y: 2 },
    connections: ['orchestration', 'microservices'],
    status: 'pending',
    estimatedTime: '40',
    difficulty: 'intermediate',
    importance: 'essential',
    skills: ['Docker', 'Containers', 'Images', 'Dockerfile', 'Registry'],
    resources: [
      {
        type: 'course',
        title: 'Docker Deep Dive',
        url: '/courses/docker-deep-dive',
        duration: '10 hours'
      }
    ]
  },
  {
    id: 'orchestration',
    title: 'Container Orchestration',
    description: 'Kubernetes fundamentals, pods, services, deployments',
    type: 'core',
    position: { x: 1, y: 3 },
    connections: ['service-mesh', 'monitoring'],
    status: 'pending',
    estimatedTime: '60',
    difficulty: 'advanced',
    importance: 'essential',
    skills: ['Kubernetes', 'Pods', 'Services', 'Deployments', 'Helm'],
    resources: [
      {
        type: 'course',
        title: 'Kubernetes Complete Guide',
        url: '/courses/kubernetes-guide',
        duration: '20 hours'
      }
    ]
  },
  {
    id: 'iac',
    title: 'Infrastructure as Code',
    description: 'Terraform, CloudFormation, Ansible for infrastructure automation',
    type: 'core',
    position: { x: 1, y: 4 },
    connections: ['cloud-platforms', 'configuration'],
    status: 'pending',
    estimatedTime: '45',
    difficulty: 'intermediate',
    importance: 'essential',
    skills: ['Terraform', 'CloudFormation', 'Ansible', 'Infrastructure Automation'],
    resources: [
      {
        type: 'course',
        title: 'Terraform Mastery',
        url: '/courses/terraform-mastery',
        duration: '15 hours'
      }
    ]
  },

  // Advanced
  {
    id: 'cloud-platforms',
    title: 'Cloud Platforms',
    description: 'AWS, Azure, or GCP services and architecture patterns',
    type: 'advanced',
    position: { x: 2, y: 0 },
    connections: ['security', 'cost-optimization'],
    status: 'pending',
    estimatedTime: '80',
    difficulty: 'advanced',
    importance: 'essential',
    skills: ['AWS', 'Azure', 'GCP', 'Cloud Architecture', 'Serverless'],
    resources: [
      {
        type: 'course',
        title: 'AWS for DevOps',
        url: '/courses/aws-devops',
        duration: '25 hours'
      }
    ]
  },
  {
    id: 'monitoring',
    title: 'Monitoring & Observability',
    description: 'Prometheus, Grafana, ELK Stack, distributed tracing',
    type: 'advanced',
    position: { x: 2, y: 1 },
    connections: ['alerting', 'performance'],
    status: 'pending',
    estimatedTime: '50',
    difficulty: 'advanced',
    importance: 'essential',
    skills: ['Prometheus', 'Grafana', 'ELK Stack', 'Monitoring', 'Alerting'],
    resources: [
      {
        type: 'course',
        title: 'Monitoring with Prometheus',
        url: '/courses/prometheus-monitoring',
        duration: '12 hours'
      }
    ]
  },
  {
    id: 'security',
    title: 'DevSecOps',
    description: 'Security scanning, compliance, secrets management',
    type: 'advanced',
    position: { x: 2, y: 2 },
    connections: ['compliance', 'governance'],
    status: 'pending',
    estimatedTime: '55',
    difficulty: 'advanced',
    importance: 'essential',
    skills: ['Security Scanning', 'Secrets Management', 'Compliance', 'SAST', 'DAST'],
    resources: [
      {
        type: 'course',
        title: 'DevSecOps Fundamentals',
        url: '/courses/devsecops',
        duration: '18 hours'
      }
    ]
  },
  {
    id: 'service-mesh',
    title: 'Service Mesh',
    description: 'Istio, Linkerd for microservices communication',
    type: 'advanced',
    position: { x: 2, y: 3 },
    connections: ['microservices', 'advanced-k8s'],
    status: 'pending',
    estimatedTime: '35',
    difficulty: 'advanced',
    importance: 'recommended',
    skills: ['Istio', 'Linkerd', 'Service Mesh', 'Microservices'],
    resources: [
      {
        type: 'course',
        title: 'Service Mesh with Istio',
        url: '/courses/istio-service-mesh',
        duration: '10 hours'
      }
    ]
  },

  // Practice
  {
    id: 'projects',
    title: 'Real-world Projects',
    description: 'Build end-to-end DevOps pipelines and infrastructure',
    type: 'practice',
    position: { x: 2, y: 4 },
    connections: [],
    status: 'pending',
    estimatedTime: '100',
    difficulty: 'advanced',
    importance: 'essential',
    skills: ['Project Management', 'Integration', 'Problem Solving', 'Best Practices'],
    resources: [
      {
        type: 'practice',
        title: 'DevOps Capstone Project',
        url: '/practice/devops-capstone',
        duration: '40 hours'
      }
    ]
  }
]

export const reactRoadmap: RoadmapNode[] = [
  {
    id: 'javascript-fundamentals',
    title: 'JavaScript ES6+',
    description: 'Modern JavaScript features essential for React development',
    type: 'foundation',
    position: { x: 0, y: 0 },
    connections: ['react-basics'],
    status: 'pending',
    estimatedTime: '30',
    difficulty: 'beginner',
    importance: 'essential',
    skills: ['ES6+', 'Arrow Functions', 'Destructuring', 'Promises', 'Async/Await'],
    resources: [
      {
        type: 'course',
        title: 'Modern JavaScript',
        url: '/courses/modern-javascript',
        duration: '12 hours'
      }
    ]
  },
  {
    id: 'react-basics',
    title: 'React Fundamentals',
    description: 'Components, JSX, props, and basic React concepts',
    type: 'foundation',
    position: { x: 0, y: 1 },
    connections: ['state-management'],
    status: 'pending',
    estimatedTime: '25',
    difficulty: 'beginner',
    importance: 'essential',
    skills: ['Components', 'JSX', 'Props', 'Virtual DOM'],
    resources: [
      {
        type: 'course',
        title: 'React Basics',
        url: '/courses/react-basics',
        duration: '8 hours'
      }
    ]
  },
  {
    id: 'state-management',
    title: 'State & Event Handling',
    description: 'useState, event handling, and controlled components',
    type: 'core',
    position: { x: 1, y: 0 },
    connections: ['hooks'],
    status: 'pending',
    estimatedTime: '20',
    difficulty: 'beginner',
    importance: 'essential',
    skills: ['useState', 'Event Handling', 'Forms', 'Controlled Components'],
    resources: [
      {
        type: 'course',
        title: 'React State Management',
        url: '/courses/react-state',
        duration: '6 hours'
      }
    ]
  },
  {
    id: 'hooks',
    title: 'React Hooks',
    description: 'useEffect, useContext, useReducer, and custom hooks',
    type: 'core',
    position: { x: 1, y: 1 },
    connections: ['advanced-patterns'],
    status: 'pending',
    estimatedTime: '35',
    difficulty: 'intermediate',
    importance: 'essential',
    skills: ['useEffect', 'useContext', 'useReducer', 'Custom Hooks'],
    resources: [
      {
        type: 'course',
        title: 'React Hooks Deep Dive',
        url: '/courses/react-hooks',
        duration: '12 hours'
      }
    ]
  },
  {
    id: 'routing',
    title: 'React Router',
    description: 'Client-side routing and navigation in React applications',
    type: 'core',
    position: { x: 1, y: 2 },
    connections: ['advanced-patterns'],
    status: 'pending',
    estimatedTime: '20',
    difficulty: 'intermediate',
    importance: 'essential',
    skills: ['React Router', 'Navigation', 'Route Parameters', 'Protected Routes'],
    resources: [
      {
        type: 'course',
        title: 'React Router Guide',
        url: '/courses/react-router',
        duration: '6 hours'
      }
    ]
  },
  {
    id: 'advanced-patterns',
    title: 'Advanced Patterns',
    description: 'Higher-order components, render props, compound components',
    type: 'advanced',
    position: { x: 2, y: 0 },
    connections: ['performance'],
    status: 'pending',
    estimatedTime: '30',
    difficulty: 'advanced',
    importance: 'recommended',
    skills: ['HOCs', 'Render Props', 'Compound Components', 'Advanced Patterns'],
    resources: [
      {
        type: 'course',
        title: 'Advanced React Patterns',
        url: '/courses/advanced-react',
        duration: '10 hours'
      }
    ]
  },
  {
    id: 'performance',
    title: 'Performance Optimization',
    description: 'React.memo, useMemo, useCallback, code splitting',
    type: 'advanced',
    position: { x: 2, y: 1 },
    connections: ['testing'],
    status: 'pending',
    estimatedTime: '25',
    difficulty: 'advanced',
    importance: 'essential',
    skills: ['React.memo', 'useMemo', 'useCallback', 'Code Splitting'],
    resources: [
      {
        type: 'course',
        title: 'React Performance',
        url: '/courses/react-performance',
        duration: '8 hours'
      }
    ]
  },
  {
    id: 'testing',
    title: 'Testing React Apps',
    description: 'Jest, React Testing Library, unit and integration tests',
    type: 'advanced',
    position: { x: 2, y: 2 },
    connections: ['projects'],
    status: 'pending',
    estimatedTime: '30',
    difficulty: 'intermediate',
    importance: 'essential',
    skills: ['Jest', 'React Testing Library', 'Unit Testing', 'Integration Testing'],
    resources: [
      {
        type: 'course',
        title: 'Testing React Applications',
        url: '/courses/react-testing',
        duration: '10 hours'
      }
    ]
  },
  {
    id: 'projects',
    title: 'Real-world Projects',
    description: 'Build complete React applications with modern practices',
    type: 'practice',
    position: { x: 2, y: 3 },
    connections: [],
    status: 'pending',
    estimatedTime: '80',
    difficulty: 'advanced',
    importance: 'essential',
    skills: ['Project Architecture', 'Best Practices', 'Real-world Applications'],
    resources: [
      {
        type: 'practice',
        title: 'React Portfolio Projects',
        url: '/practice/react-projects',
        duration: '30 hours'
      }
    ]
  }
]

// Medical Roadmaps
export const nursingRoadmap: RoadmapNode[] = [
  {
    id: 'anatomy-physiology',
    title: 'Anatomy & Physiology',
    description: 'Human body systems, structure, and function',
    type: 'foundation',
    position: { x: 0, y: 0 },
    connections: ['pathophysiology'],
    status: 'pending',
    estimatedTime: '120',
    difficulty: 'intermediate',
    importance: 'essential',
    skills: ['Body Systems', 'Anatomy', 'Physiology', 'Medical Terminology'],
    resources: [
      {
        type: 'course',
        title: 'Human Anatomy & Physiology',
        url: '/courses/anatomy-physiology',
        duration: '40 hours'
      }
    ]
  },
  {
    id: 'pharmacology',
    title: 'Pharmacology',
    description: 'Drug classifications, mechanisms, and nursing considerations',
    type: 'foundation',
    position: { x: 0, y: 1 },
    connections: ['medication-administration'],
    status: 'pending',
    estimatedTime: '80',
    difficulty: 'advanced',
    importance: 'essential',
    skills: ['Drug Classifications', 'Pharmacokinetics', 'Drug Interactions', 'Dosage Calculations'],
    resources: [
      {
        type: 'course',
        title: 'Nursing Pharmacology',
        url: '/courses/nursing-pharmacology',
        duration: '25 hours'
      }
    ]
  },
  {
    id: 'nursing-fundamentals',
    title: 'Nursing Fundamentals',
    description: 'Basic nursing skills, patient care, and nursing process',
    type: 'core',
    position: { x: 1, y: 0 },
    connections: ['clinical-skills'],
    status: 'pending',
    estimatedTime: '100',
    difficulty: 'intermediate',
    importance: 'essential',
    skills: ['Nursing Process', 'Patient Assessment', 'Care Planning', 'Documentation'],
    resources: [
      {
        type: 'course',
        title: 'Fundamentals of Nursing',
        url: '/courses/nursing-fundamentals',
        duration: '35 hours'
      }
    ]
  },
  {
    id: 'clinical-skills',
    title: 'Clinical Skills',
    description: 'Hands-on patient care skills and procedures',
    type: 'core',
    position: { x: 1, y: 1 },
    connections: ['specialized-care'],
    status: 'pending',
    estimatedTime: '150',
    difficulty: 'intermediate',
    importance: 'essential',
    skills: ['Vital Signs', 'IV Therapy', 'Wound Care', 'Patient Mobility'],
    resources: [
      {
        type: 'practice',
        title: 'Clinical Skills Lab',
        url: '/practice/clinical-skills',
        duration: '50 hours'
      }
    ]
  },
  {
    id: 'pathophysiology',
    title: 'Pathophysiology',
    description: 'Disease processes and their effects on body systems',
    type: 'advanced',
    position: { x: 2, y: 0 },
    connections: ['specialized-care'],
    status: 'pending',
    estimatedTime: '90',
    difficulty: 'advanced',
    importance: 'essential',
    skills: ['Disease Processes', 'Signs & Symptoms', 'Complications', 'Treatment Rationale'],
    resources: [
      {
        type: 'course',
        title: 'Pathophysiology for Nurses',
        url: '/courses/pathophysiology',
        duration: '30 hours'
      }
    ]
  },
  {
    id: 'specialized-care',
    title: 'Specialized Nursing',
    description: 'ICU, Emergency, Pediatric, or other specialty nursing',
    type: 'advanced',
    position: { x: 2, y: 1 },
    connections: ['leadership'],
    status: 'pending',
    estimatedTime: '200',
    difficulty: 'advanced',
    importance: 'recommended',
    skills: ['Critical Care', 'Emergency Nursing', 'Pediatric Care', 'Specialty Procedures'],
    resources: [
      {
        type: 'course',
        title: 'Specialty Nursing Care',
        url: '/courses/specialty-nursing',
        duration: '60 hours'
      }
    ]
  }
]

// Engineering Roadmaps
export const mechanicalEngineeringRoadmap: RoadmapNode[] = [
  {
    id: 'engineering-math',
    title: 'Engineering Mathematics',
    description: 'Calculus, differential equations, linear algebra, statistics',
    type: 'foundation',
    position: { x: 0, y: 0 },
    connections: ['physics'],
    status: 'pending',
    estimatedTime: '150',
    difficulty: 'intermediate',
    importance: 'essential',
    skills: ['Calculus', 'Differential Equations', 'Linear Algebra', 'Statistics'],
    resources: [
      {
        type: 'course',
        title: 'Engineering Mathematics',
        url: '/courses/engineering-math',
        duration: '50 hours'
      }
    ]
  },
  {
    id: 'physics',
    title: 'Engineering Physics',
    description: 'Mechanics, thermodynamics, fluid dynamics, heat transfer',
    type: 'foundation',
    position: { x: 0, y: 1 },
    connections: ['materials'],
    status: 'pending',
    estimatedTime: '120',
    difficulty: 'intermediate',
    importance: 'essential',
    skills: ['Mechanics', 'Thermodynamics', 'Fluid Dynamics', 'Heat Transfer'],
    resources: [
      {
        type: 'course',
        title: 'Engineering Physics',
        url: '/courses/engineering-physics',
        duration: '40 hours'
      }
    ]
  },
  {
    id: 'materials',
    title: 'Materials Science',
    description: 'Properties of materials, selection, and testing',
    type: 'core',
    position: { x: 1, y: 0 },
    connections: ['design'],
    status: 'pending',
    estimatedTime: '80',
    difficulty: 'intermediate',
    importance: 'essential',
    skills: ['Material Properties', 'Material Selection', 'Testing Methods', 'Failure Analysis'],
    resources: [
      {
        type: 'course',
        title: 'Materials Science for Engineers',
        url: '/courses/materials-science',
        duration: '25 hours'
      }
    ]
  },
  {
    id: 'design',
    title: 'Machine Design',
    description: 'Design principles, stress analysis, and mechanical components',
    type: 'core',
    position: { x: 1, y: 1 },
    connections: ['cad', 'manufacturing'],
    status: 'pending',
    estimatedTime: '100',
    difficulty: 'advanced',
    importance: 'essential',
    skills: ['Design Principles', 'Stress Analysis', 'Machine Elements', 'Safety Factors'],
    resources: [
      {
        type: 'course',
        title: 'Machine Design Fundamentals',
        url: '/courses/machine-design',
        duration: '35 hours'
      }
    ]
  },
  {
    id: 'cad',
    title: 'CAD/CAM',
    description: 'Computer-aided design and manufacturing software',
    type: 'core',
    position: { x: 1, y: 2 },
    connections: ['manufacturing'],
    status: 'pending',
    estimatedTime: '60',
    difficulty: 'intermediate',
    importance: 'essential',
    skills: ['SolidWorks', 'AutoCAD', '3D Modeling', 'Technical Drawings'],
    resources: [
      {
        type: 'course',
        title: 'CAD for Mechanical Engineers',
        url: '/courses/mechanical-cad',
        duration: '20 hours'
      }
    ]
  },
  {
    id: 'manufacturing',
    title: 'Manufacturing Processes',
    description: 'Machining, casting, welding, and modern manufacturing',
    type: 'advanced',
    position: { x: 2, y: 0 },
    connections: ['automation'],
    status: 'pending',
    estimatedTime: '90',
    difficulty: 'advanced',
    importance: 'essential',
    skills: ['Machining', 'Casting', 'Welding', 'Quality Control', 'Lean Manufacturing'],
    resources: [
      {
        type: 'course',
        title: 'Manufacturing Processes',
        url: '/courses/manufacturing',
        duration: '30 hours'
      }
    ]
  }
]

// Fashion Roadmaps
export const fashionDesignRoadmap: RoadmapNode[] = [
  {
    id: 'design-fundamentals',
    title: 'Design Fundamentals',
    description: 'Color theory, composition, and visual design principles',
    type: 'foundation',
    position: { x: 0, y: 0 },
    connections: ['fashion-history'],
    status: 'pending',
    estimatedTime: '40',
    difficulty: 'beginner',
    importance: 'essential',
    skills: ['Color Theory', 'Composition', 'Visual Balance', 'Design Principles'],
    resources: [
      {
        type: 'course',
        title: 'Design Fundamentals for Fashion',
        url: '/courses/design-fundamentals',
        duration: '15 hours'
      }
    ]
  },
  {
    id: 'fashion-history',
    title: 'Fashion History & Theory',
    description: 'Evolution of fashion, cultural influences, and design movements',
    type: 'foundation',
    position: { x: 0, y: 1 },
    connections: ['sketching'],
    status: 'pending',
    estimatedTime: '50',
    difficulty: 'beginner',
    importance: 'essential',
    skills: ['Fashion History', 'Cultural Context', 'Design Movements', 'Trend Analysis'],
    resources: [
      {
        type: 'course',
        title: 'History of Fashion',
        url: '/courses/fashion-history',
        duration: '18 hours'
      }
    ]
  },
  {
    id: 'sketching',
    title: 'Fashion Illustration',
    description: 'Technical drawing, fashion sketching, and digital illustration',
    type: 'core',
    position: { x: 1, y: 0 },
    connections: ['pattern-making'],
    status: 'pending',
    estimatedTime: '60',
    difficulty: 'intermediate',
    importance: 'essential',
    skills: ['Fashion Sketching', 'Technical Drawing', 'Digital Illustration', 'Croquis'],
    resources: [
      {
        type: 'course',
        title: 'Fashion Illustration Techniques',
        url: '/courses/fashion-illustration',
        duration: '20 hours'
      }
    ]
  },
  {
    id: 'textiles',
    title: 'Textiles & Materials',
    description: 'Fabric properties, selection, and sustainability considerations',
    type: 'core',
    position: { x: 1, y: 1 },
    connections: ['pattern-making', 'construction'],
    status: 'pending',
    estimatedTime: '45',
    difficulty: 'intermediate',
    importance: 'essential',
    skills: ['Fabric Types', 'Textile Properties', 'Sustainability', 'Material Selection'],
    resources: [
      {
        type: 'course',
        title: 'Textiles for Fashion Design',
        url: '/courses/fashion-textiles',
        duration: '16 hours'
      }
    ]
  },
  {
    id: 'pattern-making',
    title: 'Pattern Making',
    description: 'Creating patterns, grading, and technical specifications',
    type: 'core',
    position: { x: 1, y: 2 },
    connections: ['construction'],
    status: 'pending',
    estimatedTime: '80',
    difficulty: 'advanced',
    importance: 'essential',
    skills: ['Pattern Drafting', 'Pattern Grading', 'Technical Specs', 'Fit Analysis'],
    resources: [
      {
        type: 'course',
        title: 'Pattern Making Fundamentals',
        url: '/courses/pattern-making',
        duration: '28 hours'
      }
    ]
  },
  {
    id: 'construction',
    title: 'Garment Construction',
    description: 'Sewing techniques, finishing methods, and quality control',
    type: 'advanced',
    position: { x: 2, y: 0 },
    connections: ['collection-development'],
    status: 'pending',
    estimatedTime: '100',
    difficulty: 'advanced',
    importance: 'essential',
    skills: ['Sewing Techniques', 'Finishing Methods', 'Quality Control', 'Fitting'],
    resources: [
      {
        type: 'practice',
        title: 'Garment Construction Workshop',
        url: '/practice/garment-construction',
        duration: '35 hours'
      }
    ]
  },
  {
    id: 'collection-development',
    title: 'Collection Development',
    description: 'Creating cohesive collections, market research, and brand development',
    type: 'advanced',
    position: { x: 2, y: 1 },
    connections: ['fashion-business'],
    status: 'pending',
    estimatedTime: '70',
    difficulty: 'advanced',
    importance: 'essential',
    skills: ['Collection Planning', 'Market Research', 'Brand Development', 'Trend Forecasting'],
    resources: [
      {
        type: 'course',
        title: 'Fashion Collection Development',
        url: '/courses/collection-development',
        duration: '25 hours'
      }
    ]
  },
  {
    id: 'fashion-business',
    title: 'Fashion Business',
    description: 'Marketing, retail, production, and fashion entrepreneurship',
    type: 'advanced',
    position: { x: 2, y: 2 },
    connections: [],
    status: 'pending',
    estimatedTime: '60',
    difficulty: 'advanced',
    importance: 'recommended',
    skills: ['Fashion Marketing', 'Retail Strategy', 'Production Planning', 'Entrepreneurship'],
    resources: [
      {
        type: 'course',
        title: 'Fashion Business Essentials',
        url: '/courses/fashion-business',
        duration: '22 hours'
      }
    ]
  }
]

export const roadmapDatabase = {
  'devops': devopsRoadmap,
  'react': reactRoadmap,
  'nursing': nursingRoadmap,
  'mechanical-engineering': mechanicalEngineeringRoadmap,
  'fashion-design': fashionDesignRoadmap
}