export interface Skill {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  tags: string[];
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  parentId?: string;
  children?: SkillCategory[];
  skills?: Skill[];
}

export const SKILL_CATEGORIES = {
  COOKING: 'cooking',
  TECHNOLOGY: 'technology',
  LANGUAGES: 'languages',
  MUSIC: 'music',
  ARTS_CRAFTS: 'arts-crafts',
  SPORTS_FITNESS: 'sports-fitness',
  TRADES: 'trades',
  SCIENCE: 'science',
  BUSINESS: 'business',
  LIFESTYLE: 'lifestyle'
} as const;

export type SkillCategoryType = typeof SKILL_CATEGORIES[keyof typeof SKILL_CATEGORIES];

export interface SkillSearchFilters {
  categoryId?: string;
  level?: SkillLevel[];
  priceRange?: {
    min: number;
    max: number;
  };
  location?: {
    latitude: number;
    longitude: number;
    radius: number; // in kilometers
  };
  meetingType?: ('in-person' | 'online')[];
  availability?: {
    dayOfWeek: number;
    timeRange: {
      start: string;
      end: string;
    };
  };
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';