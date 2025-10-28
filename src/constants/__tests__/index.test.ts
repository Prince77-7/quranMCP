/**
 * Unit tests for constants and validation
 */

import { describe, it, expect } from 'vitest';

import {
  SURAH_INFO,
  isValidSurah,
  isValidAyah,
  getSurahInfo,
  formatSurahNumber,
  formatAyahNumber,
} from '../index.js';

describe('Constants', () => {
  describe('SURAH_INFO', () => {
    it('should have 114 surahs', () => {
      expect(SURAH_INFO).toHaveLength(114);
    });

    it('should have correct structure', () => {
      const firstSurah = SURAH_INFO[0];
      
      expect(firstSurah).toHaveProperty('number');
      expect(firstSurah).toHaveProperty('name');
      expect(firstSurah).toHaveProperty('ayahs');
      expect(firstSurah).toHaveProperty('type');
    });

    it('should have Al-Fatiha as first surah', () => {
      expect(SURAH_INFO[0].name).toBe('Al-Fatihah');
      expect(SURAH_INFO[0].ayahs).toBe(7);
    });

    it('should have An-Nas as last surah', () => {
      expect(SURAH_INFO[113].name).toBe('An-Nas');
      expect(SURAH_INFO[113].ayahs).toBe(6);
    });
  });

  describe('isValidSurah', () => {
    it('should return true for valid surah numbers', () => {
      expect(isValidSurah(1)).toBe(true);
      expect(isValidSurah(57)).toBe(true);
      expect(isValidSurah(114)).toBe(true);
    });

    it('should return false for invalid surah numbers', () => {
      expect(isValidSurah(0)).toBe(false);
      expect(isValidSurah(115)).toBe(false);
      expect(isValidSurah(-1)).toBe(false);
    });
  });

  describe('isValidAyah', () => {
    it('should return true for valid ayah numbers', () => {
      expect(isValidAyah(1, 1)).toBe(true);
      expect(isValidAyah(1, 7)).toBe(true);
      expect(isValidAyah(2, 286)).toBe(true);
    });

    it('should return false for invalid ayah numbers', () => {
      expect(isValidAyah(1, 0)).toBe(false);
      expect(isValidAyah(1, 8)).toBe(false); // Al-Fatiha has only 7 verses
      expect(isValidAyah(2, 287)).toBe(false); // Al-Baqarah has 286 verses
    });

    it('should return false for invalid surah', () => {
      expect(isValidAyah(115, 1)).toBe(false);
    });
  });

  describe('getSurahInfo', () => {
    it('should return correct surah info', () => {
      const info = getSurahInfo(1);
      
      expect(info).toBeDefined();
      expect(info?.name).toBe('Al-Fatihah');
      expect(info?.ayahs).toBe(7);
    });

    it('should return undefined for invalid surah', () => {
      const info = getSurahInfo(115);
      
      expect(info).toBeUndefined();
    });
  });

  describe('formatSurahNumber', () => {
    it('should format surah numbers with leading zeros', () => {
      expect(formatSurahNumber(1)).toBe('001');
      expect(formatSurahNumber(12)).toBe('012');
      expect(formatSurahNumber(114)).toBe('114');
    });
  });

  describe('formatAyahNumber', () => {
    it('should format ayah numbers with leading zeros', () => {
      expect(formatAyahNumber(1)).toBe('001');
      expect(formatAyahNumber(12)).toBe('012');
      expect(formatAyahNumber(286)).toBe('286');
    });
  });
});

