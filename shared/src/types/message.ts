export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: MessageType;
  attachments?: MessageAttachment[];
  metadata?: MessageMetadata;
  readBy: MessageRead[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  id: string;
  participants: string[]; // user IDs
  type: ConversationType;
  title?: string;
  lastMessage?: Message;
  unreadCount: Record<string, number>; // userId -> count
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'file' | 'video' | 'audio';
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface MessageMetadata {
  sessionProposal?: {
    sessionId: string;
    date: Date;
    duration: number;
    location?: string;
  };
  systemAction?: {
    type: 'match_created' | 'session_confirmed' | 'payment_completed';
    data: Record<string, any>;
  };
}

export interface MessageRead {
  userId: string;
  readAt: Date;
}

export type MessageType = 
  | 'text' 
  | 'image' 
  | 'file' 
  | 'system' 
  | 'session_proposal';

export type ConversationType = 
  | 'direct' 
  | 'group' 
  | 'support';

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  isTyping: boolean;
  timestamp: Date;
}

export interface MessageNotification {
  id: string;
  userId: string;
  conversationId: string;
  messageId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}

export type NotificationType = 
  | 'new_message' 
  | 'new_match' 
  | 'session_reminder' 
  | 'payment_received' 
  | 'review_received';