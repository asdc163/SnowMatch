
export enum UserRole {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
}

export enum SkiLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  EXPERT = 'Expert',
}

// Major Ski Instructor Certification Bodies
export enum CertBody {
  CSIA = 'CSIA (Canada)',
  CASI = 'CASI (Canada - Snowboard)',
  BASI = 'BASI (UK)',
  NZSIA = 'NZSIA (New Zealand)',
  PSIA_AASI = 'PSIA-AASI (USA)',
  SIA = 'SIA (Japan)',
  APSI = 'APSI (Australia)',
  ISIA = 'ISIA (International)',
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  bio: string;
  photoUrl: string;
  location: string; // Base location
  email?: string; // Contact info
  gender?: string;
  nationality?: string;
}

export interface Student extends UserProfile {
  level: SkiLevel;
  lookingFor: string;
}

export interface Resort {
  id: string;
  name: string;
  region: string;
  country: string;
}

export interface Certification {
  body: CertBody;
  level: number;
  licenseNumber: string;
}

export interface Instructor extends UserProfile {
  certifications: Certification[];
  yearsExperience: number;
  hourlyRate: number;
  specialties: string[];
  languages: string[];
  rating: number;
  reviewCount: number;
  availableResorts: string[]; // List of Resort IDs they serve
}

export interface ChatMessage {
    id: string;
    senderId: string;
    content: string;
    timestamp: number;
}

export interface Match {
  id: string;
  studentId: string;
  instructorId: string;
  resortId: string;
  bookingDate: string;
  timestamp: number;
  // Booking Details
  status: 'pending' | 'accepted' | 'declined';
  learnerCount?: number;
  duration?: string;
  content?: string; // What they want to learn
  notes?: string;
  messages: ChatMessage[];
}
