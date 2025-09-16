// User types
export * from './user';

// Skill types
export * from './skill';

// Match types
export * from './match';

// Session types
export * from './session';

// Message types
export * from './message';

// Common API types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates: LocationCoordinates;
}