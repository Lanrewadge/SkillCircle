export interface Session {
  id: string;
  matchId: string;
  teacherId: string;
  learnerId: string;
  skillId: string;
  scheduledAt: Date;
  duration: number; // in minutes
  status: SessionStatus;
  meetingType: 'in-person' | 'online';
  location?: SessionLocation;
  price: number;
  currency: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionLocation {
  type: 'address' | 'video_call';
  address?: string;
  latitude?: number;
  longitude?: number;
  meetingUrl?: string;
  instructions?: string;
}

export interface SessionReview {
  id: string;
  sessionId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number; // 1-5
  comment?: string;
  skills: {
    communication: number;
    knowledge: number;
    patience: number;
    punctuality: number;
  };
  wouldRecommend: boolean;
  createdAt: Date;
}

export type SessionStatus = 
  | 'scheduled' 
  | 'confirmed' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'no_show';

export interface PaymentRecord {
  id: string;
  sessionId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  stripePaymentIntentId?: string;
  refundAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type PaymentStatus = 
  | 'pending' 
  | 'succeeded' 
  | 'failed' 
  | 'cancelled' 
  | 'refunded';