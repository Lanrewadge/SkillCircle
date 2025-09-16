import { SkillCategory } from '../types/skill';

export const DEFAULT_SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'cooking',
    name: 'Cooking & Culinary',
    description: 'Learn cooking techniques, cuisines, and culinary arts',
    icon: '👨‍🍳',
    color: '#FF6B6B',
    children: [
      {
        id: 'baking',
        name: 'Baking & Pastry',
        description: 'Bread, cakes, pastries, and desserts',
        icon: '🧁',
        color: '#FF8E8E'
      },
      {
        id: 'international-cuisine',
        name: 'International Cuisine',
        description: 'Italian, Asian, Mexican, and world cuisines',
        icon: '🌍',
        color: '#FFB3B3'
      }
    ]
  },
  {
    id: 'technology',
    name: 'Technology & Programming',
    description: 'Learn coding, software development, and tech skills',
    icon: '💻',
    color: '#4ECDC4',
    children: [
      {
        id: 'web-development',
        name: 'Web Development',
        description: 'HTML, CSS, JavaScript, React, and more',
        icon: '🌐',
        color: '#6EEEE8'
      },
      {
        id: 'mobile-development',
        name: 'Mobile Development',
        description: 'iOS, Android, React Native, Flutter',
        icon: '📱',
        color: '#8AF5F0'
      },
      {
        id: 'data-science',
        name: 'Data Science & AI',
        description: 'Python, machine learning, data analysis',
        icon: '📊',
        color: '#A6FFF8'
      }
    ]
  },
  {
    id: 'languages',
    name: 'Languages',
    description: 'Learn new languages and improve communication',
    icon: '🗣️',
    color: '#45B7D1',
    children: [
      {
        id: 'english',
        name: 'English',
        description: 'Conversational and business English',
        icon: '🇺🇸',
        color: '#67C5E5'
      },
      {
        id: 'spanish',
        name: 'Spanish',
        description: 'Learn Spanish for travel or business',
        icon: '🇪🇸',
        color: '#89D3F9'
      }
    ]
  },
  {
    id: 'music',
    name: 'Music & Audio',
    description: 'Learn instruments, music theory, and audio production',
    icon: '🎵',
    color: '#96CEB4',
    children: [
      {
        id: 'piano',
        name: 'Piano',
        description: 'Classical and modern piano techniques',
        icon: '🎹',
        color: '#B8E6C8'
      },
      {
        id: 'guitar',
        name: 'Guitar',
        description: 'Acoustic and electric guitar lessons',
        icon: '🎸',
        color: '#DAFEDA'
      }
    ]
  },
  {
    id: 'arts-crafts',
    name: 'Arts & Crafts',
    description: 'Creative skills and artistic techniques',
    icon: '🎨',
    color: '#FFEAA7',
    children: [
      {
        id: 'painting',
        name: 'Painting',
        description: 'Oil, acrylic, watercolor techniques',
        icon: '🖌️',
        color: '#FFF2BB'
      },
      {
        id: 'pottery',
        name: 'Pottery & Ceramics',
        description: 'Wheel throwing and hand building',
        icon: '🏺',
        color: '#FFFACF'
      }
    ]
  },
  {
    id: 'sports-fitness',
    name: 'Sports & Fitness',
    description: 'Physical activities and fitness training',
    icon: '⚽',
    color: '#FF7675',
    children: [
      {
        id: 'yoga',
        name: 'Yoga',
        description: 'Hatha, Vinyasa, and meditation',
        icon: '🧘',
        color: '#FF9999'
      },
      {
        id: 'martial-arts',
        name: 'Martial Arts',
        description: 'Karate, Brazilian Jiu-Jitsu, Muay Thai',
        icon: '🥋',
        color: '#FFBBBB'
      }
    ]
  },
  {
    id: 'trades',
    name: 'Trades & Craftsmanship',
    description: 'Practical skills and traditional trades',
    icon: '🔧',
    color: '#6C5CE7',
    children: [
      {
        id: 'woodworking',
        name: 'Woodworking',
        description: 'Furniture making and carpentry',
        icon: '🪚',
        color: '#8B7BEB'
      },
      {
        id: 'electrical',
        name: 'Electrical Work',
        description: 'Basic electrical repairs and installation',
        icon: '⚡',
        color: '#B09AEF'
      }
    ]
  },
  {
    id: 'science',
    name: 'Science & Education',
    description: 'Academic subjects and scientific knowledge',
    icon: '🔬',
    color: '#00B894',
    children: [
      {
        id: 'mathematics',
        name: 'Mathematics',
        description: 'Algebra, calculus, statistics',
        icon: '🧮',
        color: '#33C6A8'
      },
      {
        id: 'chemistry',
        name: 'Chemistry',
        description: 'Organic and inorganic chemistry',
        icon: '⚗️',
        color: '66D4BC'
      }
    ]
  },
  {
    id: 'business',
    name: 'Business & Finance',
    description: 'Entrepreneurship, marketing, and financial skills',
    icon: '💼',
    color: '#FDCB6E',
    children: [
      {
        id: 'marketing',
        name: 'Digital Marketing',
        description: 'SEO, social media, content marketing',
        icon: '📈',
        color: '#FED782'
      },
      {
        id: 'accounting',
        name: 'Accounting',
        description: 'Bookkeeping and financial management',
        icon: '📊',
        color: '#FFE396'
      }
    ]
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle & Personal',
    description: 'Personal development and life skills',
    icon: '🌱',
    color: '#E17055',
    children: [
      {
        id: 'gardening',
        name: 'Gardening',
        description: 'Plants, vegetables, and landscaping',
        icon: '🌿',
        color: '🌿'
      },
      {
        id: 'photography',
        name: 'Photography',
        description: 'Digital and film photography techniques',
        icon: '📸',
        color: '#F39C12'
      }
    ]
  }
];