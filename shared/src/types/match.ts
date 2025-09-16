export interface Match {
  id: string;
  learnerId: string;
  teacherId: string;
  skillId: string;
  status: MatchStatus;
  matchScore: number;
  distance: number; // in kilometers
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  skillId: string;
  message?: string;
  status: MatchRequestStatus;
  proposedSchedule?: ProposedSchedule[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProposedSchedule {
  date: Date;
  startTime: string;
  endTime: string;
  timezone: string;
  meetingType: 'in-person' | 'online';
  location?: {
    address: string;
    latitude: number;
    longitude: number;
  };
}

export type MatchStatus = 
  | 'pending' 
  | 'accepted' 
  | 'declined' 
  | 'expired' 
  | 'blocked';

export type MatchRequestStatus = 
  | 'pending' 
  | 'accepted' 
  | 'declined' 
  | 'cancelled';

export interface MatchingCriteria {
  skillId: string;
  userRole: 'teacher' | 'learner';
  location: {
    latitude: number;
    longitude: number;
  };
  maxDistance: number;
  preferredMeetingType: 'in-person' | 'online' | 'both';
  priceRange?: {
    min: number;
    max: number;
  };
  levelCompatibility?: SkillLevel[];
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';