export interface User {
  id: string;
  firstName: string;
  lastName: string;
  cityResidence: string | null;
  origin: string | null;
  languages: string[];
  profession: string | null;
  bio: string | null;
  avatarUrl: string | null;
  interests: string[];
  interestLabels: string[];
  verified: boolean;
  rating: number;
  reviewsCount: number;
  isLocalEnabled: boolean;
  email?: string;
  phone?: string | null;
  gender?: string | null;
  birthDate?: string | null;
  activeMode?: "TOURIST" | "LOCAL";
  documentStatus?: "NONE" | "PENDING" | "APPROVED" | "REJECTED";
  onboardingStep?: number;
  countriesVisited?: number;
  localsMet?: number;
  passportLevel?: number;
}

export interface Experience {
  id: string;
  title: string;
  city: string;
  location: string;
  startAt: string;
  priceCents: number;
  imageUrl: string;
  tags: string[];
  tagLabels: string[];
  description: string;
  capacity: number;
  lovedByTourists: boolean;
  host?: User;
}

export interface LocalCard extends User {
  age: number | null;
}

export interface Conversation {
  id: string;
  unlocked: boolean;
  other: User;
  lastMessage: { body: string; createdAt: string; mine: boolean } | null;
  updatedAt: string;
}

export interface Message {
  id: string;
  body: string;
  mine: boolean;
  createdAt: string;
}

export interface Mission {
  key: string;
  label: string;
  progress: number;
  target: number;
}

export interface Passport {
  level: number;
  levelTitle: string;
  localsMet: number;
  countriesVisited: number;
  missions: Mission[];
  stamps: { country: string; city: string; imageUrl: string; visitedAt: string }[];
}

export interface Booking {
  id: string;
  startAt: string;
  people: number;
  note: string;
  status: string;
  paid: boolean;
  experience: Experience;
}
