import { User, SkillLevel } from '../types';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateCoordinates = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

export const validateSkillLevel = (level: string): level is SkillLevel => {
  return ['beginner', 'intermediate', 'advanced', 'expert'].includes(level);
};

export const validateHourlyRate = (rate: number): boolean => {
  return rate >= 0 && rate <= 1000; // Reasonable limits
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

export const validateUserProfile = (user: Partial<User>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!user.name || user.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (user.email && !validateEmail(user.email)) {
    errors.push('Invalid email format');
  }
  
  if (user.bio && user.bio.length > 500) {
    errors.push('Bio must be less than 500 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};