import axios from 'axios';
import { User, Skill, Session, Match } from '@skill-circle/shared';
import { handleApiError, showErrorToast, withErrorHandling, retryWithExponentialBackoff } from './error-handling';

const isDevelopment = false; // Force real API calls for testing integration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const apiError = handleApiError(error);

    // Handle specific error cases
    if (apiError.status === 401) {
      // Clear auth token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        window.location.href = '/auth';
      }
    }

    return Promise.reject(error);
  }
);

// Mock data for development when backend is not available
const mockUsers: User[] = [
  {
    id: '1',
    email: 'sarah@example.com',
    name: 'Sarah Chen',
    avatar: '/avatars/sarah.jpg',
    bio: 'Professional chef with 10+ years experience in Italian and Asian cuisine. I specialize in traditional pasta making, authentic pizza techniques, and fusion cooking that brings together the best of both worlds.',
    password: '',
    isTeacher: true,
    isLearner: false,
    rating: 4.9,
    reviewCount: 47,
    verified: true,
    latitude: 40.7128,
    longitude: -74.0060,
    address: '123 Culinary Ave',
    city: 'New York',
    country: 'USA',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2025-09-16'),
  },
  {
    id: '2',
    email: 'alex@example.com',
    name: 'Alex Rodriguez',
    avatar: '/avatars/alex.jpg',
    bio: 'Full-stack developer passionate about teaching modern web technologies. I love helping people break into tech and build amazing applications with React, Node.js, and cloud platforms.',
    password: '',
    isTeacher: true,
    isLearner: true,
    rating: 4.8,
    reviewCount: 32,
    verified: true,
    latitude: 34.0522,
    longitude: -118.2437,
    address: '456 Tech Blvd',
    city: 'Los Angeles',
    country: 'USA',
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2025-09-16'),
  },
  {
    id: '3',
    email: 'maria@example.com',
    name: 'Maria Gonzalez',
    avatar: '/avatars/maria.jpg',
    bio: 'Native Spanish speaker and certified language instructor. I make learning Spanish fun and practical with real-world conversations and cultural insights.',
    password: '',
    isTeacher: true,
    isLearner: false,
    rating: 4.7,
    reviewCount: 28,
    verified: true,
    latitude: 37.7749,
    longitude: -122.4194,
    address: '789 Language Lane',
    city: 'San Francisco',
    country: 'USA',
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date('2025-09-16'),
  },
  {
    id: '4',
    email: 'james@example.com',
    name: 'James Thompson',
    avatar: '/avatars/james.jpg',
    bio: 'Professional guitarist with 15 years of experience. I teach all styles from classical to rock, focusing on proper technique and music theory.',
    password: '',
    isTeacher: true,
    isLearner: false,
    rating: 4.9,
    reviewCount: 56,
    verified: true,
    latitude: 41.8781,
    longitude: -87.6298,
    address: '321 Music Row',
    city: 'Chicago',
    country: 'USA',
    createdAt: new Date('2023-02-28'),
    updatedAt: new Date('2025-09-16'),
  },
  {
    id: '5',
    email: 'emma@example.com',
    name: 'Emma Wilson',
    avatar: '/avatars/emma.jpg',
    bio: 'Yoga instructor and wellness coach. I help students develop mindfulness, flexibility, and strength through various yoga practices and meditation.',
    password: '',
    isTeacher: true,
    isLearner: true,
    rating: 4.8,
    reviewCount: 42,
    verified: true,
    latitude: 25.7617,
    longitude: -80.1918,
    address: '654 Wellness Way',
    city: 'Miami',
    country: 'USA',
    createdAt: new Date('2023-04-15'),
    updatedAt: new Date('2025-09-16'),
  },
  {
    id: '6',
    email: 'learner@example.com',
    name: 'David Park',
    avatar: '/avatars/david.jpg',
    bio: 'Enthusiastic learner always looking to pick up new skills. Currently interested in cooking, programming, and music.',
    password: '',
    isTeacher: false,
    isLearner: true,
    rating: 0,
    reviewCount: 0,
    verified: false,
    latitude: 47.6062,
    longitude: -122.3321,
    address: '987 Learning St',
    city: 'Seattle',
    country: 'USA',
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-09-16'),
  },
];

const mockSkills: Skill[] = [
  {
    id: '1',
    name: 'Italian Cooking',
    description: 'Learn authentic Italian recipes, pasta making, and traditional cooking techniques',
    categoryId: 'cooking',
    tags: ['pasta', 'pizza', 'sauce', 'traditional', 'mediterranean'],
    icon: '🍝',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2025-09-16'),
  },
  {
    id: '2',
    name: 'React Development',
    description: 'Modern React with hooks, context, state management, and best practices',
    categoryId: 'programming',
    tags: ['javascript', 'frontend', 'web', 'components', 'jsx'],
    icon: '⚛️',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2025-09-16'),
  },
  {
    id: '3',
    name: 'Spanish Language',
    description: 'Conversational Spanish, grammar, and cultural understanding',
    categoryId: 'languages',
    tags: ['conversation', 'grammar', 'culture', 'beginner-friendly'],
    icon: '🇪🇸',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2025-09-16'),
  },
  {
    id: '4',
    name: 'Guitar Playing',
    description: 'Learn guitar from beginner to advanced, all styles and techniques',
    categoryId: 'music',
    tags: ['acoustic', 'electric', 'theory', 'chords', 'fingerpicking'],
    icon: '🎸',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2025-09-16'),
  },
  {
    id: '5',
    name: 'Yoga & Meditation',
    description: 'Hatha, Vinyasa, and mindfulness meditation practices',
    categoryId: 'wellness',
    tags: ['mindfulness', 'flexibility', 'breathing', 'relaxation'],
    icon: '🧘',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2025-09-16'),
  },
  {
    id: '6',
    name: 'Node.js Backend',
    description: 'Server-side JavaScript, APIs, databases, and deployment',
    categoryId: 'programming',
    tags: ['backend', 'api', 'database', 'server', 'express'],
    icon: '🟢',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2025-09-16'),
  },
  {
    id: '7',
    name: 'Asian Cuisine',
    description: 'Thai, Chinese, Japanese cooking techniques and authentic flavors',
    categoryId: 'cooking',
    tags: ['stir-fry', 'noodles', 'sushi', 'spices', 'wok'],
    icon: '🥢',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2025-09-16'),
  },
];

const mockCategories = [
  { id: 'cooking', name: 'Cooking & Culinary', icon: '👨‍🍳', color: '#f59e0b' },
  { id: 'programming', name: 'Programming & Tech', icon: '💻', color: '#3b82f6' },
  { id: 'languages', name: 'Languages', icon: '🗣️', color: '#10b981' },
  { id: 'music', name: 'Music & Arts', icon: '🎵', color: '#8b5cf6' },
  { id: 'wellness', name: 'Health & Wellness', icon: '🌱', color: '#06b6d4' },
  { id: 'trades', name: 'Trades & Crafts', icon: '🔨', color: '#f97316' },
];

const mockSessions = [
  {
    id: '1',
    teacherId: '1',
    learnerId: '6',
    skillId: '1',
    title: 'Italian Pasta Making Basics',
    scheduledAt: new Date('2025-09-20T14:00:00'),
    duration: 120,
    status: 'scheduled',
    price: 75,
    location: 'Sarah\'s Kitchen Studio',
  },
  {
    id: '2',
    teacherId: '2',
    learnerId: '6',
    skillId: '2',
    title: 'React Hooks Deep Dive',
    scheduledAt: new Date('2025-09-18T16:00:00'),
    duration: 90,
    status: 'confirmed',
    price: 85,
    location: 'Virtual Session',
  },
  {
    id: '3',
    teacherId: '4',
    learnerId: '6',
    skillId: '4',
    title: 'Guitar Fundamentals',
    scheduledAt: new Date('2025-09-15T10:00:00'),
    duration: 60,
    status: 'completed',
    price: 60,
    location: 'Music Studio Downtown',
  },
];

const mockMessages = [
  {
    id: '1',
    conversationId: '1',
    senderId: '1',
    content: 'Hi! I see you\'re interested in learning Italian cooking. I\'d love to help you get started!',
    timestamp: new Date('2025-09-16T10:30:00'),
  },
  {
    id: '2',
    conversationId: '1',
    senderId: '6',
    content: 'That sounds amazing! I\'ve always wanted to learn how to make authentic pasta.',
    timestamp: new Date('2025-09-16T10:35:00'),
  },
  {
    id: '3',
    conversationId: '2',
    senderId: '2',
    content: 'Ready for our React session tomorrow? We\'ll be covering useState and useEffect in detail.',
    timestamp: new Date('2025-09-17T15:20:00'),
  },
];

// Mock API responses
const mockAuth = {
  login: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    const user = mockUsers.find(u => u.email === email);
    if (!user) throw new Error('Invalid credentials');
    return { user, token: 'mock-jwt-token' };
  },
  register: async (userData: Partial<User>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email!,
      name: userData.name!,
      avatar: null,
      bio: userData.bio || null,
      password: '',
      isTeacher: userData.isTeacher || false,
      isLearner: userData.isLearner || true,
      rating: 0,
      reviewCount: 0,
      verified: false,
      latitude: userData.latitude || 0,
      longitude: userData.longitude || 0,
      address: userData.address || '',
      city: userData.city || '',
      country: userData.country || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return { user: newUser, token: 'mock-jwt-token' };
  },
  profile: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUsers[0]; // Return first user as current user
  },
};

const mockSkillsApi = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockSkills;
  },
  search: async (query: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockSkills.filter(skill =>
      skill.name.toLowerCase().includes(query.toLowerCase()) ||
      skill.description.toLowerCase().includes(query.toLowerCase())
    );
  },
};

const mockTeachersApi = {
  getBySkill: async (skillId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUsers.filter(user => user.isTeacher);
  },
  search: async (query: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUsers.filter(user =>
      user.isTeacher && (
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.bio?.toLowerCase().includes(query.toLowerCase())
      )
    );
  },
};

const mockCategoriesApi = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCategories;
  },
  getSkillsByCategory: async (categoryId: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockSkills.filter(skill => skill.categoryId === categoryId);
  },
};

const mockSessionsApi = {
  getByUserId: async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockSessions.filter(session =>
      session.teacherId === userId || session.learnerId === userId
    );
  },
  create: async (sessionData: any) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const newSession = {
      id: Date.now().toString(),
      ...sessionData,
      status: 'scheduled',
      createdAt: new Date(),
    };
    return newSession;
  },
  update: async (sessionId: string, updates: any) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const session = mockSessions.find(s => s.id === sessionId);
    return session ? { ...session, ...updates } : null;
  },
};

const mockMessagesApi = {
  getConversations: async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [
      {
        id: '1',
        participantId: '1',
        participantName: 'Sarah Chen',
        participantAvatar: '/avatars/sarah.jpg',
        lastMessage: 'Hi! I see you\'re interested in learning Italian cooking...',
        lastMessageTime: new Date('2025-09-16T10:30:00'),
        unreadCount: 1,
      },
      {
        id: '2',
        participantId: '2',
        participantName: 'Alex Rodriguez',
        participantAvatar: '/avatars/alex.jpg',
        lastMessage: 'Ready for our React session tomorrow?',
        lastMessageTime: new Date('2025-09-17T15:20:00'),
        unreadCount: 0,
      },
    ];
  },
  getMessages: async (conversationId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockMessages.filter(msg => msg.conversationId === conversationId);
  },
  sendMessage: async (conversationId: string, content: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newMessage = {
      id: Date.now().toString(),
      conversationId,
      senderId: '6', // Current user
      content,
      timestamp: new Date(),
    };
    return newMessage;
  },
};

// API service functions
export const authApi = {
  login: async (email: string, password: string) => {
    try {
      if (isDevelopment) {
        return await mockAuth.login(email, password);
      }
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      // Fallback to mock in development
      if (isDevelopment) {
        return await mockAuth.login(email, password);
      }
      throw error;
    }
  },

  register: async (userData: Partial<User>) => {
    try {
      if (isDevelopment) {
        return await mockAuth.register(userData);
      }
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      if (isDevelopment) {
        return await mockAuth.register(userData);
      }
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Silent fail for mock
      console.log('Logout (mock)');
    }
  },

  profile: async () => {
    try {
      if (isDevelopment) {
        return await mockAuth.profile();
      }
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      if (isDevelopment) {
        return await mockAuth.profile();
      }
      throw error;
    }
  },
};

export const skillsApi = {
  getAll: async (params?: { search?: string; category?: string; difficulty?: string; page?: number; limit?: number }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.category) queryParams.append('category', params.category);
      if (params?.difficulty) queryParams.append('difficulty', params.difficulty);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const url = `/v1/skills${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      if (isDevelopment) {
        return await mockSkillsApi.getAll();
      }
      throw error;
    }
  },

  search: async (query: string) => {
    try {
      const response = await api.get(`/v1/skills?search=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      if (isDevelopment) {
        return await mockSkillsApi.search(query);
      }
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await api.get(`/v1/skills/${id}`);
      return response.data;
    } catch (error) {
      if (isDevelopment) {
        return await mockSkillsApi.getAll();
      }
      throw error;
    }
  },

  getRoadmap: async (id: string) => {
    try {
      const response = await api.get(`/v1/skills/${id}/roadmap`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const teachersApi = {
  getBySkill: async (skillId: string) => {
    try {
      if (isDevelopment) {
        return await mockTeachersApi.getBySkill(skillId);
      }
      const response = await api.get(`/teachers/skill/${skillId}`);
      return response.data;
    } catch (error) {
      if (isDevelopment) {
        return await mockTeachersApi.getBySkill(skillId);
      }
      throw error;
    }
  },

  search: async (query: string) => {
    try {
      if (isDevelopment) {
        return await mockTeachersApi.search(query);
      }
      const response = await api.get(`/teachers/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      if (isDevelopment) {
        return await mockTeachersApi.search(query);
      }
      throw error;
    }
  },
};

export const categoriesApi = {
  getAll: async () => {
    try {
      const response = await api.get('/v1/skills/categories');
      return response.data;
    } catch (error) {
      if (isDevelopment) {
        return await mockCategoriesApi.getAll();
      }
      throw error;
    }
  },

  getSkillsByCategory: async (categoryId: string) => {
    try {
      if (isDevelopment) {
        return await mockCategoriesApi.getSkillsByCategory(categoryId);
      }
      const response = await api.get(`/categories/${categoryId}/skills`);
      return response.data;
    } catch (error) {
      if (isDevelopment) {
        return await mockCategoriesApi.getSkillsByCategory(categoryId);
      }
      throw error;
    }
  },
};

export const sessionsApi = {
  getByUserId: async (userId: string) => {
    try {
      if (isDevelopment) {
        return await mockSessionsApi.getByUserId(userId);
      }
      const response = await api.get(`/sessions/user/${userId}`);
      return response.data;
    } catch (error) {
      if (isDevelopment) {
        return await mockSessionsApi.getByUserId(userId);
      }
      throw error;
    }
  },

  create: async (sessionData: any) => {
    try {
      if (isDevelopment) {
        return await mockSessionsApi.create(sessionData);
      }
      const response = await api.post('/sessions', sessionData);
      return response.data;
    } catch (error) {
      if (isDevelopment) {
        return await mockSessionsApi.create(sessionData);
      }
      throw error;
    }
  },

  update: async (sessionId: string, updates: any) => {
    try {
      if (isDevelopment) {
        return await mockSessionsApi.update(sessionId, updates);
      }
      const response = await api.patch(`/sessions/${sessionId}`, updates);
      return response.data;
    } catch (error) {
      if (isDevelopment) {
        return await mockSessionsApi.update(sessionId, updates);
      }
      throw error;
    }
  },
};

export const messagesApi = {
  getConversations: async (userId: string) => {
    try {
      if (isDevelopment) {
        return await mockMessagesApi.getConversations(userId);
      }
      const response = await api.get(`/conversations/user/${userId}`);
      return response.data;
    } catch (error) {
      if (isDevelopment) {
        return await mockMessagesApi.getConversations(userId);
      }
      throw error;
    }
  },

  getMessages: async (conversationId: string) => {
    try {
      if (isDevelopment) {
        return await mockMessagesApi.getMessages(conversationId);
      }
      const response = await api.get(`/conversations/${conversationId}/messages`);
      return response.data;
    } catch (error) {
      if (isDevelopment) {
        return await mockMessagesApi.getMessages(conversationId);
      }
      throw error;
    }
  },

  sendMessage: async (conversationId: string, content: string) => {
    try {
      if (isDevelopment) {
        return await mockMessagesApi.sendMessage(conversationId, content);
      }
      const response = await api.post(`/conversations/${conversationId}/messages`, { content });
      return response.data;
    } catch (error) {
      if (isDevelopment) {
        return await mockMessagesApi.sendMessage(conversationId, content);
      }
      throw error;
    }
  },
};

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth on 401
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);