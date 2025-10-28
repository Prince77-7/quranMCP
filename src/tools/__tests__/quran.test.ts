/**
 * Unit tests for Quran tools
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

import { quranCacheService } from '../../services/cache.js';
import { getQuranArabic, getQuranTranslation, getQuranVerse, listTranslations } from '../quran.js';

// Mock the fetcher
vi.mock('../../services/fetcher.js', () => ({
  fetchJSON: vi.fn(),
}));

describe('Quran Tools', () => {
  beforeEach(() => {
    // Clear cache before each test
    quranCacheService.flush();
    vi.clearAllMocks();
  });

  describe('getQuranArabic', () => {
    it('should fetch Arabic text for a valid verse', async () => {
      const { fetchJSON } = await import('../../services/fetcher.js');
      vi.mocked(fetchJSON).mockResolvedValueOnce({
        text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      });

      const result = await getQuranArabic(1, 1);

      expect(result).toEqual({
        surah: 1,
        ayah: 1,
        text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      });
    });

    it('should throw error for invalid surah number', async () => {
      await expect(getQuranArabic(115, 1)).rejects.toThrow('Invalid surah number');
    });

    it('should throw error for invalid ayah number', async () => {
      await expect(getQuranArabic(1, 100)).rejects.toThrow('Invalid ayah number');
    });

    it('should use cache for repeated requests', async () => {
      const { fetchJSON } = await import('../../services/fetcher.js');
      vi.mocked(fetchJSON).mockResolvedValueOnce({
        text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      });

      // First call
      await getQuranArabic(1, 1);
      
      // Second call should use cache
      await getQuranArabic(1, 1);

      // fetchJSON should only be called once
      expect(fetchJSON).toHaveBeenCalledTimes(1);
    });
  });

  describe('getQuranTranslation', () => {
    it('should fetch translation for a valid verse', async () => {
      const { fetchJSON } = await import('../../services/fetcher.js');
      vi.mocked(fetchJSON).mockResolvedValueOnce({
        code: 200,
        data: {
          text: 'In the name of God, The Most Gracious, The Dispenser of Grace:',
        },
      });

      const result = await getQuranTranslation(1, 1, 'en.asad');

      expect(result).toEqual({
        surah: 1,
        ayah: 1,
        text: 'In the name of God, The Most Gracious, The Dispenser of Grace:',
        translation: 'Muhammad Asad',
      });
    });

    it('should throw error for invalid translation', async () => {
      await expect(getQuranTranslation(1, 1, 'invalid')).rejects.toThrow('Unknown translation');
    });
  });

  describe('getQuranVerse', () => {
    it('should fetch both Arabic and translation', async () => {
      const { fetchJSON } = await import('../../services/fetcher.js');
      
      vi.mocked(fetchJSON)
        .mockResolvedValueOnce({
          text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        })
        .mockResolvedValueOnce({
          code: 200,
          data: {
            text: 'In the name of God, The Most Gracious, The Dispenser of Grace:',
          },
        });

      const result = await getQuranVerse(1, 1, 'en.asad');

      expect(result.arabic.text).toBe('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ');
      expect(result.translation.text).toBe('In the name of God, The Most Gracious, The Dispenser of Grace:');
    });
  });

  describe('listTranslations', () => {
    it('should return all available translations', () => {
      const translations = listTranslations();

      expect(translations).toHaveLength(5);
      expect(translations[0]).toHaveProperty('slug');
      expect(translations[0]).toHaveProperty('name');
      expect(translations[0]).toHaveProperty('language');
    });
  });
});

