/**
 * TypeScript type definitions for Food Share Application
 */

// User Types
export enum UserRole {
  DONOR = 'donor',
  RECEIVER = 'receiver',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  address: string;
  verified: boolean;
  profileImage?: string;
  bio?: string;
  rating?: number;
  totalDonations?: number;
  totalReservations?: number;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

// Donation Types
export enum FoodType {
  VEGETABLES = 'vegetables',
  FRUITS = 'fruits',
  GRAINS = 'grains',
  DAIRY = 'dairy',
  MEAT = 'meat',
  BAKERY = 'bakery',
  COOKED = 'cooked',
  PACKAGED = 'packaged',
  OTHER = 'other',
}

export enum DonationStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  PICKED_UP = 'picked_up',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export interface IDonation {
  _id?: string;
  title: string;
  description: string;
  foodType: FoodType[];
  quantity: number;
  unit: 'kg' | 'pieces' | 'liters' | 'boxes' | 'plates';
  pickupLocation: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  availableFrom: Date;
  availableUntil: Date;
  status: DonationStatus;
  donorId: string;
  images?: string[];
  allergens?: string[];
  expiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Reservation Types
export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PICKED_UP = 'picked_up',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
}

export interface IReservation {
  _id?: string;
  donationId: string;
  receiverId: string;
  status: ReservationStatus;
  reservedAt: Date;
  pickupDate?: Date;
  pickupTime?: string;
  notes?: string;
  cancelReason?: string;
  cancelledAt?: Date;
  completedAt?: Date;
  rating?: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Message Types
export interface IMessage {
  _id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  readAt?: Date;
  relatedDonationId?: string;
  relatedReservationId?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Audit Log Types
export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  VERIFY = 'verify',
  RESERVE = 'reserve',
  CANCEL = 'cancel',
  APPROVE = 'approve',
  REJECT = 'reject',
  REPORT = 'report',
}

export interface IAuditLog {
  _id?: string;
  action: AuditAction;
  userId: string;
  targetId: string;
  targetType: 'user' | 'donation' | 'reservation' | 'message';
  changes?: {
    before?: Record<string, any>;
    after?: Record<string, any>;
  };
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failure';
  errorMessage?: string;
  timestamp: Date;
}

// Conversation Types (for grouped messages)
export interface IConversation {
  _id?: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
}
