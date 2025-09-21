const institutionalCourses = {
  // STEM Fields
  computerScience: {
    id: 'computer-science',
    title: 'Computer Science',
    category: 'STEM',
    description: 'Comprehensive study of algorithmic processes, computational systems, and the design of computer systems.',
    duration: '4 years',
    creditHours: 120,
    prerequisites: ['High School Mathematics', 'Basic Logic'],
    careerPaths: ['Software Developer', 'Data Scientist', 'AI Engineer', 'Systems Architect'],
    roadmap: {
      freshman: {
        year: 1,
        title: 'Foundation Year',
        courses: [
          {
            semester: 1,
            courses: [
              {
                code: 'CS101',
                title: 'Introduction to Programming',
                credits: 3,
                difficulty: 'beginner',
                topics: ['Programming Fundamentals', 'Variables', 'Control Structures', 'Functions'],
                encyclopedia: {
                  overview: 'Introduction to computational thinking and programming concepts using a modern programming language.',
                  learningObjectives: [
                    'Understand basic programming concepts',
                    'Write simple programs using variables and functions',
                    'Apply control structures for decision making',
                    'Debug and test basic programs'
                  ],
                  keyTopics: {
                    'Programming Fundamentals': {
                      definition: 'Basic concepts of how computers execute instructions and process data',
                      concepts: ['Algorithms', 'Pseudocode', 'Problem Decomposition', 'Abstraction'],
                      practicalApplications: ['Writing step-by-step solutions', 'Breaking down complex problems'],
                      assessmentMethods: ['Coding assignments', 'Problem-solving exercises']
                    },
                    'Variables and Data Types': {
                      definition: 'Storage containers that hold different types of data values',
                      concepts: ['Integer', 'Float', 'String', 'Boolean', 'Arrays'],
                      practicalApplications: ['Data storage', 'User input handling', 'Calculations'],
                      assessmentMethods: ['Programming exercises', 'Data manipulation tasks']
                    },
                    'Control Structures': {
                      definition: 'Programming constructs that control the flow of program execution',
                      concepts: ['If-else statements', 'Loops', 'Switch statements', 'Nested structures'],
                      practicalApplications: ['Decision making', 'Repetitive tasks', 'Game logic'],
                      assessmentMethods: ['Algorithm implementation', 'Flow control exercises']
                    }
                  },
                  prerequisites: ['Basic Mathematics', 'Logical Thinking'],
                  recommendedResources: [
                    'Think Python by Allen Downey',
                    'Codecademy Python Course',
                    'MIT 6.00.1x Introduction to Computer Science'
                  ]
                }
              },
              {
                code: 'MATH141',
                title: 'Calculus I',
                credits: 4,
                difficulty: 'intermediate',
                topics: ['Limits', 'Derivatives', 'Applications of Derivatives'],
                encyclopedia: {
                  overview: 'Fundamental concepts of differential calculus with applications to computer science.',
                  learningObjectives: [
                    'Understand limits and continuity',
                    'Master derivative calculations',
                    'Apply derivatives to optimization problems',
                    'Solve real-world problems using calculus'
                  ],
                  keyTopics: {
                    'Limits and Continuity': {
                      definition: 'Mathematical foundation for understanding rates of change',
                      concepts: ['Limit notation', 'One-sided limits', 'Infinite limits', 'Continuity'],
                      practicalApplications: ['Algorithm complexity analysis', 'Convergence in algorithms'],
                      assessmentMethods: ['Problem sets', 'Graphical analysis']
                    },
                    'Derivatives': {
                      definition: 'Rate of change and slope of tangent lines to curves',
                      concepts: ['Power rule', 'Product rule', 'Chain rule', 'Implicit differentiation'],
                      practicalApplications: ['Optimization algorithms', 'Machine learning gradients'],
                      assessmentMethods: ['Computational exercises', 'Application problems']
                    }
                  }
                }
              }
            ]
          },
          {
            semester: 2,
            courses: [
              {
                code: 'CS102',
                title: 'Object-Oriented Programming',
                credits: 3,
                difficulty: 'intermediate',
                topics: ['Classes', 'Objects', 'Inheritance', 'Polymorphism', 'Encapsulation'],
                encyclopedia: {
                  overview: 'Advanced programming paradigm focusing on objects, classes, and modular design.',
                  learningObjectives: [
                    'Design and implement classes and objects',
                    'Apply inheritance and polymorphism',
                    'Understand encapsulation principles',
                    'Build complex software systems'
                  ],
                  keyTopics: {
                    'Classes and Objects': {
                      definition: 'Blueprint for creating objects with shared attributes and behaviors',
                      concepts: ['Class definition', 'Object instantiation', 'Attributes', 'Methods'],
                      practicalApplications: ['Software modeling', 'Code reusability', 'System design'],
                      assessmentMethods: ['Class design projects', 'UML diagrams']
                    },
                    'Inheritance': {
                      definition: 'Mechanism for creating new classes based on existing classes',
                      concepts: ['Parent class', 'Child class', 'Method overriding', 'Super keyword'],
                      practicalApplications: ['Code reuse', 'Hierarchical modeling', 'Framework design'],
                      assessmentMethods: ['Inheritance hierarchies', 'Polymorphic implementations']
                    }
                  }
                }
              }
            ]
          }
        ]
      },
      sophomore: {
        year: 2,
        title: 'Core Development',
        courses: [
          {
            semester: 3,
            courses: [
              {
                code: 'CS201',
                title: 'Data Structures',
                credits: 3,
                difficulty: 'intermediate',
                topics: ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees', 'Hash Tables'],
                encyclopedia: {
                  overview: 'Fundamental data organization methods and their efficient manipulation.',
                  learningObjectives: [
                    'Implement fundamental data structures',
                    'Analyze time and space complexity',
                    'Choose appropriate data structures for problems',
                    'Optimize data access patterns'
                  ],
                  keyTopics: {
                    'Linear Data Structures': {
                      definition: 'Data structures where elements are stored sequentially',
                      concepts: ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Deques'],
                      practicalApplications: ['Memory management', 'Algorithm implementation', 'System design'],
                      assessmentMethods: ['Implementation projects', 'Complexity analysis']
                    },
                    'Tree Structures': {
                      definition: 'Hierarchical data structures with parent-child relationships',
                      concepts: ['Binary trees', 'BST', 'AVL trees', 'Heaps', 'Tree traversals'],
                      practicalApplications: ['Database indexing', 'File systems', 'Decision trees'],
                      assessmentMethods: ['Tree implementation', 'Traversal algorithms']
                    }
                  }
                }
              }
            ]
          }
        ]
      },
      junior: {
        year: 3,
        title: 'Advanced Topics',
        courses: [
          {
            semester: 5,
            courses: [
              {
                code: 'CS301',
                title: 'Algorithms',
                credits: 3,
                difficulty: 'advanced',
                topics: ['Sorting', 'Searching', 'Graph Algorithms', 'Dynamic Programming', 'Greedy Algorithms'],
                encyclopedia: {
                  overview: 'Design and analysis of efficient algorithms for computational problems.',
                  learningObjectives: [
                    'Design efficient algorithms',
                    'Analyze algorithmic complexity',
                    'Apply algorithmic paradigms',
                    'Solve optimization problems'
                  ],
                  keyTopics: {
                    'Algorithmic Paradigms': {
                      definition: 'General approaches to algorithm design and problem solving',
                      concepts: ['Divide and conquer', 'Dynamic programming', 'Greedy algorithms', 'Backtracking'],
                      practicalApplications: ['Optimization problems', 'Resource allocation', 'Path finding'],
                      assessmentMethods: ['Algorithm design', 'Complexity proofs']
                    },
                    'Graph Algorithms': {
                      definition: 'Algorithms for solving problems on graph data structures',
                      concepts: ['BFS', 'DFS', 'Shortest path', 'Minimum spanning tree', 'Network flow'],
                      practicalApplications: ['Social networks', 'Transportation', 'Internet routing'],
                      assessmentMethods: ['Graph problem solving', 'Implementation projects']
                    }
                  }
                }
              }
            ]
          }
        ]
      },
      senior: {
        year: 4,
        title: 'Specialization',
        courses: [
          {
            semester: 7,
            courses: [
              {
                code: 'CS401',
                title: 'Software Engineering',
                credits: 3,
                difficulty: 'advanced',
                topics: ['SDLC', 'Design Patterns', 'Testing', 'Project Management', 'Agile Methodologies'],
                encyclopedia: {
                  overview: 'Principles and practices for developing large-scale software systems.',
                  learningObjectives: [
                    'Apply software development methodologies',
                    'Design scalable software architectures',
                    'Implement testing strategies',
                    'Manage software projects effectively'
                  ],
                  keyTopics: {
                    'Software Development Life Cycle': {
                      definition: 'Systematic approach to software development from conception to maintenance',
                      concepts: ['Requirements analysis', 'Design', 'Implementation', 'Testing', 'Deployment'],
                      practicalApplications: ['Large software projects', 'Team collaboration', 'Quality assurance'],
                      assessmentMethods: ['Team projects', 'Process documentation']
                    },
                    'Design Patterns': {
                      definition: 'Reusable solutions to common software design problems',
                      concepts: ['Singleton', 'Observer', 'Factory', 'MVC', 'Decorator'],
                      practicalApplications: ['Code maintainability', 'Scalable architectures', 'Framework design'],
                      assessmentMethods: ['Pattern implementation', 'Architecture design']
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    }
  },

  mathematics: {
    id: 'mathematics',
    title: 'Mathematics',
    category: 'STEM',
    description: 'Pure and applied mathematics covering algebra, calculus, statistics, and advanced mathematical theory.',
    duration: '4 years',
    creditHours: 120,
    prerequisites: ['Advanced High School Mathematics'],
    careerPaths: ['Data Scientist', 'Actuary', 'Research Mathematician', 'Financial Analyst'],
    roadmap: {
      freshman: {
        year: 1,
        title: 'Mathematical Foundations',
        courses: [
          {
            semester: 1,
            courses: [
              {
                code: 'MATH101',
                title: 'Calculus I',
                credits: 4,
                difficulty: 'beginner',
                topics: ['Limits', 'Derivatives', 'Applications of Derivatives'],
                encyclopedia: {
                  overview: 'Introduction to differential calculus and its applications.',
                  learningObjectives: [
                    'Master the concept of limits',
                    'Calculate derivatives using various techniques',
                    'Apply derivatives to real-world problems',
                    'Understand the fundamental theorem of calculus'
                  ],
                  keyTopics: {
                    'Limits': {
                      definition: 'The value that a function approaches as the input approaches a certain value',
                      concepts: ['Limit notation', 'One-sided limits', 'Infinite limits', 'Limit laws'],
                      practicalApplications: ['Continuous functions', 'Rate of change', 'Optimization'],
                      assessmentMethods: ['Limit calculations', 'Graphical analysis', 'Word problems']
                    },
                    'Derivatives': {
                      definition: 'The rate of change of a function with respect to its variable',
                      concepts: ['Definition of derivative', 'Differentiation rules', 'Chain rule', 'Implicit differentiation'],
                      practicalApplications: ['Velocity and acceleration', 'Optimization problems', 'Related rates'],
                      assessmentMethods: ['Derivative calculations', 'Application problems', 'Proofs']
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    }
  },

  // Business Studies
  businessAdministration: {
    id: 'business-administration',
    title: 'Business Administration',
    category: 'Business',
    description: 'Comprehensive study of business principles, management, marketing, and entrepreneurship.',
    duration: '4 years',
    creditHours: 120,
    prerequisites: ['High School Diploma', 'Basic Mathematics'],
    careerPaths: ['Business Manager', 'Entrepreneur', 'Consultant', 'Project Manager'],
    roadmap: {
      freshman: {
        year: 1,
        title: 'Business Fundamentals',
        courses: [
          {
            semester: 1,
            courses: [
              {
                code: 'BUS101',
                title: 'Introduction to Business',
                credits: 3,
                difficulty: 'beginner',
                topics: ['Business Environment', 'Business Ethics', 'Entrepreneurship', 'Global Business'],
                encyclopedia: {
                  overview: 'Foundational understanding of business operations, ethics, and the global marketplace.',
                  learningObjectives: [
                    'Understand basic business concepts',
                    'Analyze business environments',
                    'Evaluate ethical business practices',
                    'Explore entrepreneurial opportunities'
                  ],
                  keyTopics: {
                    'Business Environment': {
                      definition: 'The combination of internal and external factors that influence business operations',
                      concepts: ['Economic factors', 'Political factors', 'Social factors', 'Technological factors'],
                      practicalApplications: ['Market analysis', 'Strategic planning', 'Risk assessment'],
                      assessmentMethods: ['Case studies', 'Environmental analysis', 'Business reports']
                    },
                    'Business Ethics': {
                      definition: 'Moral principles that guide business behavior and decision-making',
                      concepts: ['Corporate responsibility', 'Stakeholder theory', 'Ethical frameworks', 'Sustainability'],
                      practicalApplications: ['Decision making', 'Policy development', 'Reputation management'],
                      assessmentMethods: ['Ethical dilemma analysis', 'Case discussions', 'Policy papers']
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    }
  },

  // Liberal Arts
  psychology: {
    id: 'psychology',
    title: 'Psychology',
    category: 'Liberal Arts',
    description: 'Scientific study of mind and behavior across various contexts and applications.',
    duration: '4 years',
    creditHours: 120,
    prerequisites: ['High School Biology', 'Statistics recommended'],
    careerPaths: ['Clinical Psychologist', 'Counselor', 'Research Psychologist', 'HR Specialist'],
    roadmap: {
      freshman: {
        year: 1,
        title: 'Psychological Foundations',
        courses: [
          {
            semester: 1,
            courses: [
              {
                code: 'PSY101',
                title: 'General Psychology',
                credits: 3,
                difficulty: 'beginner',
                topics: ['History of Psychology', 'Research Methods', 'Biological Psychology', 'Sensation and Perception'],
                encyclopedia: {
                  overview: 'Introduction to the scientific study of behavior and mental processes.',
                  learningObjectives: [
                    'Understand major psychological perspectives',
                    'Learn basic research methods',
                    'Explore biological bases of behavior',
                    'Analyze cognitive processes'
                  ],
                  keyTopics: {
                    'History of Psychology': {
                      definition: 'Evolution of psychological thought and major theoretical perspectives',
                      concepts: ['Structuralism', 'Functionalism', 'Behaviorism', 'Cognitive revolution'],
                      practicalApplications: ['Understanding current theories', 'Research foundations', 'Clinical approaches'],
                      assessmentMethods: ['Historical analysis', 'Theory comparison', 'Timeline projects']
                    },
                    'Research Methods': {
                      definition: 'Scientific approaches to studying psychological phenomena',
                      concepts: ['Experimental design', 'Correlational studies', 'Case studies', 'Statistical analysis'],
                      practicalApplications: ['Conducting research', 'Evaluating studies', 'Evidence-based practice'],
                      assessmentMethods: ['Research proposals', 'Data analysis', 'Method critiques']
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    }
  },

  // Engineering
  mechanicalEngineering: {
    id: 'mechanical-engineering',
    title: 'Mechanical Engineering',
    category: 'Engineering',
    description: 'Design, development, and manufacturing of mechanical systems and devices.',
    duration: '4 years',
    creditHours: 128,
    prerequisites: ['Advanced Mathematics', 'Physics', 'Chemistry'],
    careerPaths: ['Design Engineer', 'Manufacturing Engineer', 'Project Manager', 'R&D Engineer'],
    roadmap: {
      freshman: {
        year: 1,
        title: 'Engineering Fundamentals',
        courses: [
          {
            semester: 1,
            courses: [
              {
                code: 'ENGR101',
                title: 'Introduction to Engineering',
                credits: 2,
                difficulty: 'beginner',
                topics: ['Engineering Design Process', 'Problem Solving', 'Engineering Ethics', 'CAD Basics'],
                encyclopedia: {
                  overview: 'Introduction to engineering thinking, design methodology, and professional practice.',
                  learningObjectives: [
                    'Understand the engineering design process',
                    'Develop problem-solving skills',
                    'Learn engineering communication',
                    'Explore engineering disciplines'
                  ],
                  keyTopics: {
                    'Engineering Design Process': {
                      definition: 'Systematic methodology for solving engineering problems',
                      concepts: ['Problem identification', 'Requirements analysis', 'Solution generation', 'Testing and iteration'],
                      practicalApplications: ['Product development', 'System design', 'Innovation'],
                      assessmentMethods: ['Design projects', 'Prototyping', 'Design reports']
                    },
                    'Problem Solving': {
                      definition: 'Analytical and creative approaches to engineering challenges',
                      concepts: ['Root cause analysis', 'Systems thinking', 'Optimization', 'Trade-off analysis'],
                      practicalApplications: ['Troubleshooting', 'Design optimization', 'Process improvement'],
                      assessmentMethods: ['Problem sets', 'Case studies', 'Solution presentations']
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    }
  },

  // Health Sciences
  medicine: {
    id: 'medicine',
    title: 'Medicine (MD)',
    category: 'Health Sciences',
    description: 'Comprehensive medical education to become a licensed physician.',
    duration: '8 years (4 years pre-med + 4 years medical school)',
    creditHours: 150,
    prerequisites: ['Biology', 'Chemistry', 'Physics', 'Mathematics', 'MCAT'],
    careerPaths: ['General Practitioner', 'Specialist Physician', 'Surgeon', 'Research Physician'],
    roadmap: {
      preMed: {
        year: '1-4',
        title: 'Pre-Medical Studies',
        courses: [
          {
            semester: 1,
            courses: [
              {
                code: 'BIOL101',
                title: 'General Biology',
                credits: 4,
                difficulty: 'intermediate',
                topics: ['Cell Biology', 'Genetics', 'Evolution', 'Ecology'],
                encyclopedia: {
                  overview: 'Foundation course in biological sciences essential for medical practice.',
                  learningObjectives: [
                    'Understand cellular structure and function',
                    'Master basic genetics principles',
                    'Comprehend evolutionary biology',
                    'Analyze biological systems'
                  ],
                  keyTopics: {
                    'Cell Biology': {
                      definition: 'Study of cellular structure, function, and processes',
                      concepts: ['Cell membrane', 'Organelles', 'Cell division', 'Metabolism'],
                      practicalApplications: ['Disease mechanisms', 'Drug targeting', 'Tissue engineering'],
                      assessmentMethods: ['Laboratory practicals', 'Microscopy exercises', 'Cell culture projects']
                    },
                    'Genetics': {
                      definition: 'Study of heredity and genetic variation',
                      concepts: ['DNA structure', 'Gene expression', 'Inheritance patterns', 'Mutations'],
                      practicalApplications: ['Genetic counseling', 'Personalized medicine', 'Gene therapy'],
                      assessmentMethods: ['Pedigree analysis', 'Genetic problem solving', 'Case studies']
                    }
                  }
                }
              },
              {
                code: 'CHEM101',
                title: 'General Chemistry',
                credits: 4,
                difficulty: 'intermediate',
                topics: ['Atomic Structure', 'Chemical Bonding', 'Thermodynamics', 'Kinetics'],
                encyclopedia: {
                  overview: 'Essential chemistry concepts for understanding biochemical processes in medicine.',
                  learningObjectives: [
                    'Master atomic and molecular structure',
                    'Understand chemical reactions and equilibrium',
                    'Apply thermodynamic principles',
                    'Analyze reaction mechanisms'
                  ],
                  keyTopics: {
                    'Chemical Bonding': {
                      definition: 'Forces that hold atoms together in molecules and compounds',
                      concepts: ['Ionic bonds', 'Covalent bonds', 'Hydrogen bonds', 'Van der Waals forces'],
                      practicalApplications: ['Drug-receptor interactions', 'Protein structure', 'Membrane transport'],
                      assessmentMethods: ['Molecular modeling', 'Bonding predictions', 'Structure-function analysis']
                    }
                  }
                }
              }
            ]
          }
        ]
      },
      medicalSchool: {
        year: '5-8',
        title: 'Medical School',
        courses: [
          {
            semester: 1,
            courses: [
              {
                code: 'MED101',
                title: 'Human Anatomy',
                credits: 6,
                difficulty: 'advanced',
                topics: ['Gross Anatomy', 'Histology', 'Embryology', 'Neuroanatomy'],
                encyclopedia: {
                  overview: 'Comprehensive study of human body structure and development.',
                  learningObjectives: [
                    'Master human anatomical systems',
                    'Understand tissue organization',
                    'Comprehend developmental biology',
                    'Integrate structure with function'
                  ],
                  keyTopics: {
                    'Gross Anatomy': {
                      definition: 'Study of body structures visible to the naked eye',
                      concepts: ['Organ systems', 'Anatomical positions', 'Body cavities', 'Regional anatomy'],
                      practicalApplications: ['Physical examination', 'Surgery', 'Medical imaging', 'Diagnosis'],
                      assessmentMethods: ['Cadaveric dissection', 'Practical examinations', 'Cross-sectional anatomy']
                    },
                    'Histology': {
                      definition: 'Microscopic study of tissues and organs',
                      concepts: ['Tissue types', 'Cellular organization', 'Organ architecture', 'Pathological changes'],
                      practicalApplications: ['Biopsy interpretation', 'Disease diagnosis', 'Tissue engineering'],
                      assessmentMethods: ['Microscopy identification', 'Histological analysis', 'Pathology correlation']
                    }
                  }
                }
              },
              {
                code: 'MED102',
                title: 'Physiology',
                credits: 6,
                difficulty: 'advanced',
                topics: ['Cardiovascular Physiology', 'Respiratory Physiology', 'Neurophysiology', 'Endocrinology'],
                encyclopedia: {
                  overview: 'Study of normal body functions and regulatory mechanisms.',
                  learningObjectives: [
                    'Understand organ system functions',
                    'Master physiological regulation',
                    'Analyze homeostatic mechanisms',
                    'Integrate multi-system responses'
                  ],
                  keyTopics: {
                    'Cardiovascular Physiology': {
                      definition: 'Function of heart and blood vessels in circulation',
                      concepts: ['Cardiac cycle', 'Blood pressure regulation', 'Circulation', 'Heart rhythm'],
                      practicalApplications: ['ECG interpretation', 'Blood pressure management', 'Heart disease treatment'],
                      assessmentMethods: ['ECG analysis', 'Hemodynamic calculations', 'Case-based scenarios']
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    }
  },

  nursing: {
    id: 'nursing',
    title: 'Nursing',
    category: 'Health Sciences',
    description: 'Comprehensive healthcare education focusing on patient care, health promotion, and clinical practice.',
    duration: '4 years',
    creditHours: 120,
    prerequisites: ['Biology', 'Chemistry', 'Anatomy & Physiology'],
    careerPaths: ['Registered Nurse', 'Nurse Practitioner', 'Clinical Nurse Specialist', 'Nurse Administrator'],
    roadmap: {
      freshman: {
        year: 1,
        title: 'Healthcare Foundations',
        courses: [
          {
            semester: 1,
            courses: [
              {
                code: 'NURS101',
                title: 'Foundations of Nursing',
                credits: 4,
                difficulty: 'beginner',
                topics: ['Nursing History', 'Professional Standards', 'Patient Care Basics', 'Health Assessment'],
                encyclopedia: {
                  overview: 'Introduction to nursing profession, healthcare systems, and basic patient care principles.',
                  learningObjectives: [
                    'Understand nursing history and philosophy',
                    'Learn professional nursing standards',
                    'Develop basic patient care skills',
                    'Practice health assessment techniques'
                  ],
                  keyTopics: {
                    'Nursing Philosophy': {
                      definition: 'Core beliefs and values that guide nursing practice and patient care',
                      concepts: ['Holistic care', 'Patient advocacy', 'Evidence-based practice', 'Cultural competence'],
                      practicalApplications: ['Patient interactions', 'Care planning', 'Ethical decision making'],
                      assessmentMethods: ['Philosophy papers', 'Case discussions', 'Reflective journals']
                    },
                    'Health Assessment': {
                      definition: 'Systematic collection of health data to determine patient status',
                      concepts: ['Physical examination', 'Health history', 'Vital signs', 'Documentation'],
                      practicalApplications: ['Patient evaluation', 'Care planning', 'Health monitoring'],
                      assessmentMethods: ['Skills demonstrations', 'Assessment scenarios', 'Documentation review']
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    }
  },

  // Additional Courses
  physics: {
    id: 'physics',
    title: 'Physics',
    category: 'STEM',
    description: 'Study of matter, energy, and the fundamental laws of the universe.',
    duration: '4 years',
    creditHours: 120,
    prerequisites: ['Advanced Mathematics', 'Calculus'],
    careerPaths: ['Research Physicist', 'Engineering Physicist', 'Data Scientist', 'Academia'],
    roadmap: {
      freshman: {
        year: 1,
        title: 'Classical Physics Foundation',
        courses: [
          {
            semester: 1,
            courses: [
              {
                code: 'PHYS101',
                title: 'Classical Mechanics',
                credits: 4,
                difficulty: 'intermediate',
                topics: ['Kinematics', 'Dynamics', 'Energy', 'Momentum', 'Rotational Motion'],
                encyclopedia: {
                  overview: 'Fundamental principles of motion and forces in classical physics.',
                  learningObjectives: [
                    'Master Newton\'s laws of motion',
                    'Understand energy conservation',
                    'Analyze momentum and collisions',
                    'Solve rotational dynamics problems'
                  ],
                  keyTopics: {
                    'Newton\'s Laws': {
                      definition: 'Three fundamental laws describing the relationship between forces and motion',
                      concepts: ['Inertia', 'Force equals mass times acceleration', 'Action-reaction pairs'],
                      practicalApplications: ['Engineering design', 'Vehicle dynamics', 'Sports physics'],
                      assessmentMethods: ['Problem solving', 'Laboratory experiments', 'Real-world applications']
                    },
                    'Energy Conservation': {
                      definition: 'Principle that energy cannot be created or destroyed, only transformed',
                      concepts: ['Kinetic energy', 'Potential energy', 'Work-energy theorem', 'Power'],
                      practicalApplications: ['Renewable energy', 'Mechanical systems', 'Thermodynamics'],
                      assessmentMethods: ['Energy calculations', 'System analysis', 'Efficiency studies']
                    }
                  }
                }
              }
            ]
          }
        ]
      },
      sophomore: {
        year: 2,
        title: 'Waves and Thermodynamics',
        courses: [
          {
            semester: 3,
            courses: [
              {
                code: 'PHYS201',
                title: 'Waves and Optics',
                credits: 4,
                difficulty: 'intermediate',
                topics: ['Wave Mechanics', 'Sound Waves', 'Light and Optics', 'Interference'],
                encyclopedia: {
                  overview: 'Study of wave phenomena including sound, light, and electromagnetic radiation.',
                  learningObjectives: [
                    'Understand wave properties and behavior',
                    'Master geometric and wave optics',
                    'Analyze interference and diffraction',
                    'Apply wave principles to real systems'
                  ],
                  keyTopics: {
                    'Wave Properties': {
                      definition: 'Characteristics that describe wave motion and behavior',
                      concepts: ['Wavelength', 'Frequency', 'Amplitude', 'Phase', 'Wave speed'],
                      practicalApplications: ['Communications', 'Medical imaging', 'Spectroscopy'],
                      assessmentMethods: ['Wave calculations', 'Laboratory measurements', 'Simulation projects']
                    }
                  }
                }
              }
            ]
          }
        ]
      },
      junior: {
        year: 3,
        title: 'Modern Physics',
        courses: [
          {
            semester: 5,
            courses: [
              {
                code: 'PHYS301',
                title: 'Quantum Mechanics',
                credits: 4,
                difficulty: 'advanced',
                topics: ['Quantum Theory', 'Wave Functions', 'Uncertainty Principle', 'Atomic Structure'],
                encyclopedia: {
                  overview: 'Introduction to quantum mechanical principles and their applications.',
                  learningObjectives: [
                    'Understand quantum mechanical postulates',
                    'Solve Schrödinger equation problems',
                    'Apply uncertainty principle',
                    'Analyze atomic and molecular systems'
                  ],
                  keyTopics: {
                    'Wave-Particle Duality': {
                      definition: 'Quantum mechanical principle that matter and energy exhibit both wave and particle properties',
                      concepts: ['De Broglie wavelength', 'Photoelectric effect', 'Complementarity'],
                      practicalApplications: ['Electron microscopy', 'Quantum computing', 'Laser technology'],
                      assessmentMethods: ['Mathematical derivations', 'Conceptual problems', 'Laboratory experiments']
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    }
  },

  chemistry: {
    id: 'chemistry',
    title: 'Chemistry',
    category: 'STEM',
    description: 'Study of matter, its properties, composition, and reactions.',
    duration: '4 years',
    creditHours: 120,
    prerequisites: ['Mathematics', 'Physics'],
    careerPaths: ['Research Chemist', 'Chemical Engineer', 'Pharmaceutical Scientist', 'Materials Scientist'],
    roadmap: {
      freshman: {
        year: 1,
        title: 'General Chemistry',
        courses: [
          {
            semester: 1,
            courses: [
              {
                code: 'CHEM101',
                title: 'General Chemistry I',
                credits: 4,
                difficulty: 'beginner',
                topics: ['Atomic Structure', 'Periodic Table', 'Chemical Bonding', 'Stoichiometry'],
                encyclopedia: {
                  overview: 'Foundation course covering fundamental chemical principles and concepts.',
                  learningObjectives: [
                    'Understand atomic structure and electron configuration',
                    'Master periodic trends and properties',
                    'Learn chemical bonding theories',
                    'Perform stoichiometric calculations'
                  ],
                  keyTopics: {
                    'Atomic Structure': {
                      definition: 'The arrangement of protons, neutrons, and electrons in atoms',
                      concepts: ['Electron configuration', 'Quantum numbers', 'Orbitals', 'Periodic trends'],
                      practicalApplications: ['Spectroscopy', 'Chemical reactivity prediction', 'Materials design'],
                      assessmentMethods: ['Electron configuration problems', 'Periodic trend analysis', 'Spectral interpretation']
                    },
                    'Chemical Bonding': {
                      definition: 'Forces that hold atoms together in molecules and compounds',
                      concepts: ['Ionic bonding', 'Covalent bonding', 'Metallic bonding', 'Intermolecular forces'],
                      practicalApplications: ['Drug design', 'Material properties', 'Crystal structure'],
                      assessmentMethods: ['Lewis structures', 'VSEPR theory', 'Bonding energy calculations']
                    }
                  }
                }
              }
            ]
          }
        ]
      },
      sophomore: {
        year: 2,
        title: 'Organic Chemistry',
        courses: [
          {
            semester: 3,
            courses: [
              {
                code: 'CHEM201',
                title: 'Organic Chemistry I',
                credits: 4,
                difficulty: 'intermediate',
                topics: ['Hydrocarbons', 'Functional Groups', 'Stereochemistry', 'Reaction Mechanisms'],
                encyclopedia: {
                  overview: 'Study of carbon-based compounds and their reactions.',
                  learningObjectives: [
                    'Understand organic molecular structure',
                    'Master functional group chemistry',
                    'Analyze stereochemical relationships',
                    'Predict reaction outcomes'
                  ],
                  keyTopics: {
                    'Functional Groups': {
                      definition: 'Specific arrangements of atoms that determine chemical behavior',
                      concepts: ['Alcohols', 'Carbonyls', 'Carboxylic acids', 'Amines'],
                      practicalApplications: ['Pharmaceutical synthesis', 'Polymer chemistry', 'Biochemistry'],
                      assessmentMethods: ['Structure identification', 'Synthesis planning', 'Mechanism problems']
                    }
                  }
                }
              }
            ]
          }
        ]
      },
      junior: {
        year: 3,
        title: 'Physical Chemistry',
        courses: [
          {
            semester: 5,
            courses: [
              {
                code: 'CHEM301',
                title: 'Physical Chemistry',
                credits: 4,
                difficulty: 'advanced',
                topics: ['Thermodynamics', 'Kinetics', 'Quantum Chemistry', 'Spectroscopy'],
                encyclopedia: {
                  overview: 'Application of physics and mathematics to understand chemical phenomena.',
                  learningObjectives: [
                    'Master chemical thermodynamics',
                    'Understand reaction kinetics',
                    'Apply quantum mechanical concepts',
                    'Interpret spectroscopic data'
                  ],
                  keyTopics: {
                    'Chemical Thermodynamics': {
                      definition: 'Study of energy changes in chemical reactions and processes',
                      concepts: ['Enthalpy', 'Entropy', 'Gibbs free energy', 'Equilibrium'],
                      practicalApplicationations: ['Process optimization', 'Phase diagrams', 'Electrochemistry'],
                      assessmentMethods: ['Thermodynamic calculations', 'Calorimetry experiments', 'Equilibrium analysis']
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    }
  },

  biology: {
    id: 'biology',
    title: 'Biology',
    category: 'STEM',
    description: 'Study of living organisms and their interactions with the environment.',
    duration: '4 years',
    creditHours: 120,
    prerequisites: ['Chemistry', 'Mathematics'],
    careerPaths: ['Research Biologist', 'Biotechnologist', 'Environmental Scientist', 'Medical Professional'],
    roadmap: {
      freshman: {
        year: 1,
        title: 'Biological Foundations',
        courses: [
          {
            semester: 1,
            courses: [
              {
                code: 'BIOL101',
                title: 'Cell Biology',
                credits: 4,
                difficulty: 'beginner',
                topics: ['Cell Structure', 'Metabolism', 'Cell Division', 'Genetics'],
                encyclopedia: {
                  overview: 'Fundamental study of cellular structure, function, and processes.',
                  learningObjectives: [
                    'Understand cell structure and organelles',
                    'Master metabolic pathways',
                    'Comprehend cell division processes',
                    'Analyze genetic mechanisms'
                  ],
                  keyTopics: {
                    'Cell Structure': {
                      definition: 'Organization and components of prokaryotic and eukaryotic cells',
                      concepts: ['Cell membrane', 'Nucleus', 'Mitochondria', 'Endoplasmic reticulum'],
                      practicalApplications: ['Drug delivery', 'Tissue engineering', 'Disease mechanisms'],
                      assessmentMethods: ['Microscopy exercises', 'Cell culture techniques', 'Organelle identification']
                    },
                    'Metabolism': {
                      definition: 'Chemical processes that maintain life in cells',
                      concepts: ['Glycolysis', 'Cellular respiration', 'Photosynthesis', 'Enzyme function'],
                      practicalApplications: ['Metabolic disorders', 'Biofuel production', 'Drug metabolism'],
                      assessmentMethods: ['Pathway analysis', 'Enzyme kinetics', 'Metabolic calculations']
                    }
                  }
                }
              }
            ]
          }
        ]
      },
      sophomore: {
        year: 2,
        title: 'Organismal Biology',
        courses: [
          {
            semester: 3,
            courses: [
              {
                code: 'BIOL201',
                title: 'Ecology',
                credits: 4,
                difficulty: 'intermediate',
                topics: ['Ecosystems', 'Population Dynamics', 'Biodiversity', 'Conservation'],
                encyclopedia: {
                  overview: 'Study of interactions between organisms and their environment.',
                  learningObjectives: [
                    'Understand ecosystem structure and function',
                    'Analyze population and community dynamics',
                    'Evaluate biodiversity and conservation',
                    'Assess environmental impacts'
                  ],
                  keyTopics: {
                    'Ecosystem Dynamics': {
                      definition: 'Flow of energy and cycling of nutrients in ecological systems',
                      concepts: ['Food webs', 'Energy flow', 'Nutrient cycles', 'Succession'],
                      practicalApplications: ['Conservation planning', 'Environmental restoration', 'Climate change'],
                      assessmentMethods: ['Field studies', 'Ecosystem modeling', 'Data analysis']
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    }
  },

  // Liberal Arts and Humanities
  englishLiterature: {
    id: 'english-literature',
    title: 'English Literature',
    category: 'Liberal Arts',
    description: 'Study of literary works, critical analysis, and creative writing.',
    duration: '4 years',
    creditHours: 120,
    prerequisites: ['High School English', 'Reading Proficiency'],
    careerPaths: ['Writer', 'Editor', 'Teacher', 'Literary Critic', 'Journalist'],
    roadmap: {
      freshman: {
        year: 1,
        title: 'Literary Foundations',
        courses: [
          {
            semester: 1,
            courses: [
              {
                code: 'ENG101',
                title: 'Introduction to Literature',
                credits: 3,
                difficulty: 'beginner',
                topics: ['Literary Analysis', 'Poetry', 'Fiction', 'Drama'],
                encyclopedia: {
                  overview: 'Introduction to literary genres, critical thinking, and analytical writing.',
                  learningObjectives: [
                    'Develop critical reading skills',
                    'Understand literary devices and techniques',
                    'Analyze themes and meanings',
                    'Write coherent literary analysis'
                  ],
                  keyTopics: {
                    'Literary Analysis': {
                      definition: 'Critical examination of literary works to understand meaning and significance',
                      concepts: ['Theme', 'Symbolism', 'Character development', 'Narrative structure'],
                      practicalApplications: ['Academic writing', 'Literary criticism', 'Cultural understanding'],
                      assessmentMethods: ['Essay writing', 'Close reading exercises', 'Discussion participation']
                    },
                    'Poetry Analysis': {
                      definition: 'Study of poetic forms, techniques, and meanings',
                      concepts: ['Meter', 'Rhyme scheme', 'Metaphor', 'Imagery'],
                      practicalApplications: ['Creative writing', 'Cultural interpretation', 'Language appreciation'],
                      assessmentMethods: ['Poem analysis', 'Comparative studies', 'Creative exercises']
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    }
  },

  history: {
    id: 'history',
    title: 'History',
    category: 'Liberal Arts',
    description: 'Study of past events, civilizations, and their impact on the present.',
    duration: '4 years',
    creditHours: 120,
    prerequisites: ['High School History', 'Reading Comprehension'],
    careerPaths: ['Historian', 'Museum Curator', 'Archivist', 'Teacher', 'Policy Analyst'],
    roadmap: {
      freshman: {
        year: 1,
        title: 'Historical Foundations',
        courses: [
          {
            semester: 1,
            courses: [
              {
                code: 'HIST101',
                title: 'Introduction to Historical Methods',
                credits: 3,
                difficulty: 'beginner',
                topics: ['Historical Research', 'Primary Sources', 'Historiography', 'Critical Analysis'],
                encyclopedia: {
                  overview: 'Introduction to historical research methods and critical thinking about the past.',
                  learningObjectives: [
                    'Master historical research techniques',
                    'Evaluate primary and secondary sources',
                    'Understand historiographical debates',
                    'Develop critical thinking skills'
                  ],
                  keyTopics: {
                    'Primary Source Analysis': {
                      definition: 'Examination of original documents and artifacts from historical periods',
                      concepts: ['Document authenticity', 'Bias identification', 'Contextual analysis', 'Corroboration'],
                      practicalApplications: ['Historical research', 'Museum work', 'Legal evidence', 'Cultural preservation'],
                      assessmentMethods: ['Source analysis papers', 'Research projects', 'Comparative studies']
                    },
                    'Historiography': {
                      definition: 'Study of how history has been written and interpreted over time',
                      concepts: ['Historical schools', 'Methodology changes', 'Perspective evolution', 'Scholarly debates'],
                      practicalApplications: ['Academic research', 'Historical revision', 'Cultural understanding'],
                      assessmentMethods: ['Historiographical essays', 'Comparative analysis', 'Research papers']
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    }
  },

  // Social Sciences
  sociology: {
    id: 'sociology',
    title: 'Sociology',
    category: 'Social Sciences',
    description: 'Study of society, social behavior, and social institutions.',
    duration: '4 years',
    creditHours: 120,
    prerequisites: ['High School Social Studies', 'Statistics recommended'],
    careerPaths: ['Social Researcher', 'Social Worker', 'Policy Analyst', 'Community Organizer'],
    roadmap: {
      freshman: {
        year: 1,
        title: 'Sociological Foundations',
        courses: [
          {
            semester: 1,
            courses: [
              {
                code: 'SOC101',
                title: 'Introduction to Sociology',
                credits: 3,
                difficulty: 'beginner',
                topics: ['Social Theory', 'Culture', 'Socialization', 'Social Institutions'],
                encyclopedia: {
                  overview: 'Introduction to sociological thinking and analysis of social phenomena.',
                  learningObjectives: [
                    'Understand major sociological theories',
                    'Analyze social structures and processes',
                    'Examine cultural diversity and change',
                    'Evaluate social institutions'
                  ],
                  keyTopics: {
                    'Social Theory': {
                      definition: 'Theoretical frameworks for understanding society and social behavior',
                      concepts: ['Functionalism', 'Conflict theory', 'Symbolic interactionism', 'Critical theory'],
                      practicalApplications: ['Social policy', 'Community development', 'Organizational analysis'],
                      assessmentMethods: ['Theory application papers', 'Case study analysis', 'Research projects']
                    },
                    'Culture and Society': {
                      definition: 'Shared beliefs, values, and practices that characterize groups',
                      concepts: ['Cultural norms', 'Values', 'Beliefs', 'Cultural change'],
                      practicalApplications: ['Cross-cultural communication', 'Marketing', 'Education policy'],
                      assessmentMethods: ['Cultural analysis projects', 'Ethnographic studies', 'Comparative research']
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    }
  },

  economics: {
    id: 'economics',
    title: 'Economics',
    category: 'Social Sciences',
    description: 'Study of production, distribution, and consumption of goods and services.',
    duration: '4 years',
    creditHours: 120,
    prerequisites: ['Mathematics', 'Statistics'],
    careerPaths: ['Economist', 'Financial Analyst', 'Policy Advisor', 'Business Consultant'],
    roadmap: {
      freshman: {
        year: 1,
        title: 'Economic Principles',
        courses: [
          {
            semester: 1,
            courses: [
              {
                code: 'ECON101',
                title: 'Microeconomics',
                credits: 3,
                difficulty: 'intermediate',
                topics: ['Supply and Demand', 'Market Structures', 'Consumer Theory', 'Producer Theory'],
                encyclopedia: {
                  overview: 'Study of individual economic units and market behavior.',
                  learningObjectives: [
                    'Understand market mechanisms',
                    'Analyze consumer and producer behavior',
                    'Evaluate market efficiency',
                    'Apply economic models to real situations'
                  ],
                  keyTopics: {
                    'Supply and Demand': {
                      definition: 'Fundamental model explaining price determination in markets',
                      concepts: ['Market equilibrium', 'Price elasticity', 'Shifts in curves', 'Surplus and shortage'],
                      practicalApplications: ['Price forecasting', 'Market analysis', 'Policy evaluation'],
                      assessmentMethods: ['Graph analysis', 'Problem solving', 'Case studies']
                    },
                    'Market Structures': {
                      definition: 'Different organizational characteristics of markets',
                      concepts: ['Perfect competition', 'Monopoly', 'Oligopoly', 'Monopolistic competition'],
                      practicalApplications: ['Antitrust policy', 'Business strategy', 'Regulatory analysis'],
                      assessmentMethods: ['Market analysis projects', 'Comparative studies', 'Policy proposals']
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    }
  }
};

module.exports = institutionalCourses;