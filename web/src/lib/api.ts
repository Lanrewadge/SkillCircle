import axios from 'axios';
import { User, Skill, Session, Match } from '@skill-circle/shared';

const isDevelopment = process.env.NODE_ENV === 'development';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for development when backend is not available
const mockUsers: User[] = [
  {
    id: '1',
    email: 'sarah@example.com',
    name: 'Sarah Chen',
    avatar: '/avatars/sarah.jpg',
    bio: 'Professional chef with 10+ years experience in Italian and Asian cuisine.',
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
    bio: 'Full-stack developer passionate about teaching modern web technologies.',
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
];

const mockSkills: Skill[] = [
  {
    id: '1',
    name: 'Italian Cooking',
    description: 'Learn authentic Italian recipes and techniques',
    categoryId: 'cooking',
    tags: ['pasta', 'pizza', 'sauce', 'traditional'],
    icon: '🍝',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2025-09-16'),
  },
  {
    id: '2',
    name: 'React Development',
    description: 'Modern React with hooks, context, and best practices',
    categoryId: 'programming',
    tags: ['javascript', 'frontend', 'web', 'components'],
    icon: '⚛️',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2025-09-16'),
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
  getAll: async () => {
    try {
      if (isDevelopment) {
        return await mockSkillsApi.getAll();
      }
      const response = await api.get('/skills');
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
      if (isDevelopment) {
        return await mockSkillsApi.search(query);
      }
      const response = await api.get(`/skills/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      if (isDevelopment) {
        return await mockSkillsApi.search(query);
      }
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