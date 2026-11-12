import type { User, Experience } from "@prisma/client";
import { interestLabel } from "./interests.js";

export function publicUser(u: User) {
  return {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    cityResidence: u.cityResidence,
    origin: u.origin,
    languages: u.languages,
    profession: u.profession,
    bio: u.bio,
    avatarUrl: u.avatarUrl,
    interests: u.interests,
    interestLabels: u.interests.map(interestLabel),
    verified: u.verified,
    rating: u.rating,
    reviewsCount: u.reviewsCount,
    isLocalEnabled: u.isLocalEnabled,
  };
}

export function privateUser(u: User) {
  return {
    ...publicUser(u),
    email: u.email,
    phone: u.phone,
    gender: u.gender,
    birthDate: u.birthDate,
    activeMode: u.activeMode,
    documentStatus: u.documentStatus,
    onboardingStep: u.onboardingStep,
    countriesVisited: u.countriesVisited,
    localsMet: u.localsMet,
    passportLevel: u.passportLevel,
  };
}

export function experienceDto(e: Experience & { host?: User }) {
  return {
    id: e.id,
    title: e.title,
    city: e.city,
    location: e.location,
    startAt: e.startAt,
    priceCents: e.priceCents,
    imageUrl: e.imageUrl,
    tags: e.tags,
    tagLabels: e.tags.map(interestLabel),
    description: e.description,
    capacity: e.capacity,
    lovedByTourists: e.lovedByTourists,
    host: e.host ? publicUser(e.host) : undefined,
  };
}
