// User and Authentication Types
export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  profilePicture?: string;
  disabilityType: DisabilityType;
  countryOfResidence: string;
  nationality?: string;
  gender?: string;
  dateOfBirth?: string;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  createdAt: string;
  updatedAt: string;
  bio?: string;
  bloodGroup?: string;
  emergencyContact?: string;
}

export type DisabilityType =
  | 'physical'
  | 'visual'
  | 'hearing'
  | 'cognitive'
  | 'speech'
  | 'multiple'
  | 'other';

export type VerificationStatus =
  | 'unverified'
  | 'pending'
  | 'verified'
  | 'rejected';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  language: 'en' | 'ar';
  accessibilityMode: AccessibilityMode;
  themeMode: ThemeMode;
}

export type ThemeMode = 'light' | 'dark';

export type AccessibilityMode =
  | 'standard'
  | 'blind'
  | 'deaf'
  | 'motor-impaired';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Document Upload Types
export interface Document {
  id: string;
  userId: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  status: DocumentStatus;
  uploadedAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export type DocumentType =
  | 'id_proof'
  | 'disability_certificate'
  | 'insurance'
  | 'medical_report'
  | 'other';

export type DocumentStatus =
  | 'pending'
  | 'verified'
  | 'rejected';

// Care Module Types
export interface HealthcareProvider {
  id: string;
  name: string;
  type: ProviderType;
  address: string;
  phone: string;
  email?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  specialties?: string[];
  accessibilityFeatures?: string[];
  rating?: number;
}

export type ProviderType =
  | 'hospital'
  | 'clinic'
  | 'rehab_center'
  | 'pharmacy'
  | 'therapist';

// Community Module Types
export interface CommunityPost {
  id: string;
  userId: string;
  user: Pick<User, 'id' | 'username' | 'profilePicture'>;
  content: string;
  mediaUrls?: string[];
  likes: string[]; // userIds
  comments: CommunityComment[];
  createdAt: string;
  updatedAt: string;
}

export interface CommunityComment {
  id: string;
  userId: string;
  user: Pick<User, 'id' | 'username' | 'profilePicture'>;
  content: string;
  likes: string[]; // userIds
  createdAt: string;
  updatedAt: string;
}

// Programs Module Types
export interface BenefitProgram {
  id: string;
  title: string;
  description: string;
  type: 'government' | 'private';
  category: string;
  eligibility: string[];
  benefits: string[];
  applicationUrl?: string;
  deadline?: string;
  isActive: boolean;
  createdAt: string;
}

// Marketplace Types
export interface AssistiveDevice {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  vendor: {
    id: string;
    name: string;
    contact: string;
  };
  images: string[];
  specifications: Record<string, string>;
  reviews: DeviceReview[];
  subsidies?: Subsidies;
}

export interface DeviceReview {
  id: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Subsidies {
  governmentProgram?: string;
  percentage: number;
  maxAmount?: number;
}

// Education & Career Types
export interface EducationResource {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'training' | 'job_posting' | 'caregiver_guide' | 'protocol';
  duration?: string;
  level?: string;
  provider: string;
  cost?: number;
  currency?: string;
  url?: string;
  tags: string[];
}

// Service Request Types
export interface ServiceRequest {
  id: string;
  userId: string;
  type: ServiceRequestType;
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  location?: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  status: ServiceRequestStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export type ServiceRequestType =
  | 'airport_assistance'
  | 'mobility_support'
  | 'transportation'
  | 'medical_assistance'
  | 'general_support';

export type ServiceRequestStatus =
  | 'pending'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

// SOS Emergency Types
export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

export interface EmergencyAlert {
  id: string;
  userId: string;
  type: 'user_initiated' | 'auto_detected';
  message: string;
  location?: {
    lat: number;
    lng: number;
  };
  contacts?: EmergencyContact[];
  status: 'sent' | 'acknowledged' | 'resolved';
  createdAt: string;
}

// Admin Types
export interface AdminAction {
  id: string;
  adminId: string;
  actionType: AdminActionType;
  targetId: string;
  targetType: 'user' | 'document' | 'post' | 'program';
  details: string;
  timestamp: string;
}

export type AdminActionType =
  | 'approve_document'
  | 'reject_document'
  | 'suspend_user'
  | 'delete_post'
  | 'moderate_content';
