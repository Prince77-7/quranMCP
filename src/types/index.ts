/**
 * Type definitions for the Quran MCP Server
 * Provides comprehensive type safety for all Islamic resources
 */

// Quran structure types
export interface QuranVerse {
  surah: number;
  ayah: number;
  text: string;
  translation?: string;
}

export interface SurahInfo {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

// Tafsir types
export interface TafsirResponse {
  surah: number;
  ayah: number;
  text: string;
  tafsir_name: string;
  language?: string;
}

export interface TafsirSource {
  slug: string;
  name: string;
  language: string;
  author: string;
}

// Hadith types
export interface HadithResponse {
  hadithNumber: number;
  collection: string;
  book?: string;
  chapter?: string;
  text: string;
  grade?: string;
  narrator?: string;
}

export interface HadithCollection {
  name: string;
  slug: string;
  totalHadiths: number;
}

// Recitation types
export interface RecitationInfo {
  surah: number;
  ayah: number;
  reciter: string;
  url: string;
  format: 'mp3';
}

export interface Reciter {
  name: string;
  slug: string;
  bitrate: string;
}

// API Response types
export interface AlQuranCloudResponse {
  code: number;
  status: string;
  data: {
    number: number;
    text: string;
    surah: {
      number: number;
      name: string;
      englishName: string;
      englishNameTranslation: string;
      numberOfAyahs: number;
      revelationType: string;
    };
    numberInSurah: number;
    juz: number;
    manzil: number;
    page: number;
    ruku: number;
    hizbQuarter: number;
    sajda: boolean;
  };
}

// Cache types
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Error types
export class QuranMCPError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'QuranMCPError';
  }
}

// Tool parameter types
export interface GetTafsirParams {
  surah: number;
  ayah: number;
  tafsir?: string;
}

export interface GetHadithParams {
  collection: string;
  hadithNumber: number;
}

export interface GetQuranParams {
  surah: number;
  ayah?: number;
  translation?: string;
}

export interface GetRecitationParams {
  surah: number;
  ayah: number;
  reciter?: string;
}

export interface SearchQuranParams {
  query: string;
  language?: 'arabic' | 'english';
  translation?: string;
}

