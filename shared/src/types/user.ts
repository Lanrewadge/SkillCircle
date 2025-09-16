export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    country: string;
  };
  isTeacher: boolean;
  isLearner: boolean;
  rating: number;
  reviewCount: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  userId: string;
  skills: UserSkill[];
  availability: Availability[];
  preferences: UserPreferences;
  socialLinks?: SocialLinks;
}

export interface UserSkill {
  id: string;
  skillId: string;
  userId: string;
  role: 'teacher' | 'learner';
  level: SkillLevel;
  experience?: string;
  hourlyRate?: number;
  currency?: string;
  certifications?: string[];
}

export interface Availability {
  id: string;
  dayOfWeek: number; // 0-6, Sunday = 0
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  timezone: string;
}

export interface UserPreferences {
  maxDistance: number; // in kilometers
  preferredMeetingType: 'in-person' | 'online' | 'both';
  languagePreferences: string[];
  ageRange?: {
    min: number;
    max: number;
  };
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  website?: string;
  instagram?: string;
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';