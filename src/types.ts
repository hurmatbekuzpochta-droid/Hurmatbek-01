/**
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Role {
  SUPER_ADMIN = "super_admin",
  EDITOR = "editor",
  MODERATOR = "moderator",
  USER = "user"
}

export enum Lang {
  UZ = "uz",
  RU = "ru",
  EN = "en"
}

export interface User {
  id: string;
  email: string;
  role: Role;
  subscriptionPlanId: string | null;
  subscriptionExpiresAt: string | null;
  isPremium: boolean;
  rememberMe?: boolean;
}

export interface SubscriptionPlan {
  id: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  priceUzS: number;
  durationMonths: number;
  status: "active" | "inactive";
}

export interface TVChannel {
  id: string;
  name: string;
  logo: string;
  category: string;
  streamUrl: string;
  poster: string;
  isPremium: boolean;
  isLive: boolean;
  viewsCount: number;
  orderIndex: number;
  isActive: boolean;
}

export interface Movie {
  id: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  slug: string;
  poster: string;
  backdrop: string;
  videoUrl: string;
  trailerUrl: string;
  year: number;
  genreUz: string;
  genreRu: string;
  genreEn: string;
  durationMinutes: number;
  rating: number;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEn: string;
  isPremium: boolean;
  isActive: boolean;
}

export interface Episode {
  id: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  videoUrl: string;
  durationMinutes: number;
}

export interface Season {
  id: string;
  seasonNumber: number;
  episodes: Episode[];
}

export interface Series {
  id: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  slug: string;
  poster: string;
  genresUz: string;
  genresRu: string;
  genresEn: string;
  year: number;
  isPremium: boolean;
  isActive: boolean;
  seasons: Season[];
}

export interface SportMatch {
  id: string;
  teamA: string;
  teamB: string;
  logoA: string;
  logoB: string;
  tournament: string;
  startTime: string;
  channelName: string;
  channelStreamUrl: string;
  isLive: boolean;
  score?: string;
  isPremium: boolean;
}

export interface NewsItem {
  id: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  contentUz: string;
  contentRu: string;
  contentEn: string;
  imageUrl: string;
  publishedAt: string;
}

export interface AdSetting {
  id: string;
  videoUrl: string;
  clickUrl: string;
  durationSeconds: number;
  isEnabled: boolean;
}

export interface SystemSettings {
  telegramBotLink: string;
  privacyPolicyUz: string;
  privacyPolicyRu: string;
  privacyPolicyEn: string;
  termsOfServiceUz: string;
  termsOfServiceRu: string;
  termsOfServiceEn: string;
}

export interface PaymentLog {
  id: string;
  userEmail: string;
  planName: string;
  amountUzS: number;
  paymentMethod: string;
  status: "success" | "pending" | "failed";
  createdAt: string;
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  level: "INFO" | "WARNING" | "CRITICAL";
  message: string;
  userEmail?: string;
  ipAddress: string;
}
