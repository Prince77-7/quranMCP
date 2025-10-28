/**
 * Quran text and translation tools
 * Provides access to Arabic text and various translations
 */

import { fetchJSON } from '../services/fetcher.js';
import { quranCacheService } from '../services/cache.js';
import {
  API_ENDPOINTS,
  TRANSLATIONS,
  isValidSurah,
  isValidAyah,
  getSurahInfo
} from '../constants/index.js';
import { QuranVerse, AlQuranCloudResponse, QuranMCPError } from '../types/index.js';

/**
 * Get Arabic text of a verse
 */
export async function getQuranArabic(
  surah: number,
  ayah: number
): Promise<QuranVerse> {
  // Validate inputs
  if (!isValidSurah(surah)) {
    throw new QuranMCPError(
      `Invalid surah number: ${surah}. Must be between 1 and 114.`,
      'INVALID_SURAH'
    );
  }

  if (!isValidAyah(surah, ayah)) {
    const surahInfo = getSurahInfo(surah);
    throw new QuranMCPError(
      `Invalid ayah number: ${ayah}. Surah ${surah} has ${surahInfo?.ayahs} ayahs.`,
      'INVALID_AYAH'
    );
  }

  // Create cache key
  const cacheKey = `quran:arabic:${surah}:${ayah}`;

  // Try to get from cache or fetch
  return quranCacheService.getOrSet(cacheKey, async () => {
    const url = `${API_ENDPOINTS.QURAN_ARABIC}/ara-quransoosinonun/${surah}/${ayah}.json`;
    
    try {
      const data = await fetchJSON<any>(url);
      
      return {
        surah,
        ayah,
        text: data.text || data.verse || '',
      };
    } catch (error) {
      if (error instanceof QuranMCPError) {
        throw error;
      }
      throw new QuranMCPError(
        `Failed to fetch Arabic text: ${(error as Error).message}`,
        'QURAN_FETCH_ERROR'
      );
    }
  });
}

/**
 * Get translation of a verse
 */
export async function getQuranTranslation(
  surah: number,
  ayah: number,
  translationSlug: string = 'en.asad'
): Promise<QuranVerse> {
  // Validate inputs
  if (!isValidSurah(surah)) {
    throw new QuranMCPError(
      `Invalid surah number: ${surah}. Must be between 1 and 114.`,
      'INVALID_SURAH'
    );
  }

  if (!isValidAyah(surah, ayah)) {
    const surahInfo = getSurahInfo(surah);
    throw new QuranMCPError(
      `Invalid ayah number: ${ayah}. Surah ${surah} has ${surahInfo?.ayahs} ayahs.`,
      'INVALID_AYAH'
    );
  }

  // Validate translation
  const translation = TRANSLATIONS.find(t => t.slug === translationSlug);
  if (!translation) {
    throw new QuranMCPError(
      `Unknown translation: ${translationSlug}. Available translations: ${TRANSLATIONS.map(t => t.slug).join(', ')}`,
      'INVALID_TRANSLATION'
    );
  }

  // Create cache key
  const cacheKey = `quran:translation:${translationSlug}:${surah}:${ayah}`;

  // Try to get from cache or fetch
  return quranCacheService.getOrSet(cacheKey, async () => {
    const url = `${API_ENDPOINTS.QURAN_ENGLISH}/${surah}:${ayah}/${translationSlug}`;
    
    try {
      const response = await fetchJSON<AlQuranCloudResponse>(url);
      
      if (response.code !== 200 || !response.data) {
        throw new QuranMCPError(
          'Invalid response from translation API',
          'INVALID_API_RESPONSE'
        );
      }

      return {
        surah,
        ayah,
        text: response.data.text,
        translation: translation.name,
      };
    } catch (error) {
      if (error instanceof QuranMCPError) {
        throw error;
      }
      throw new QuranMCPError(
        `Failed to fetch translation: ${(error as Error).message}`,
        'TRANSLATION_FETCH_ERROR'
      );
    }
  });
}

/**
 * Get both Arabic and translation for a verse
 */
export async function getQuranVerse(
  surah: number,
  ayah: number,
  translationSlug: string = 'en.asad'
): Promise<{ arabic: QuranVerse; translation: QuranVerse }> {
  const [arabic, translation] = await Promise.all([
    getQuranArabic(surah, ayah),
    getQuranTranslation(surah, ayah, translationSlug),
  ]);

  return { arabic, translation };
}

/**
 * Get full Surah (all verses)
 */
export async function getFullSurah(
  surah: number,
  includeTranslation: boolean = false,
  translationSlug: string = 'en.asad'
): Promise<QuranVerse[]> {
  if (!isValidSurah(surah)) {
    throw new QuranMCPError(
      `Invalid surah number: ${surah}. Must be between 1 and 114.`,
      'INVALID_SURAH'
    );
  }

  const surahInfo = getSurahInfo(surah);
  if (!surahInfo) {
    throw new QuranMCPError(
      `Could not find info for surah ${surah}`,
      'SURAH_INFO_NOT_FOUND'
    );
  }

  const verses: QuranVerse[] = [];

  for (let ayah = 1; ayah <= surahInfo.ayahs; ayah++) {
    try {
      if (includeTranslation) {
        const verse = await getQuranVerse(surah, ayah, translationSlug);
        verses.push({
          surah,
          ayah,
          text: verse.arabic.text,
          translation: verse.translation.text,
        });
      } else {
        const verse = await getQuranArabic(surah, ayah);
        verses.push(verse);
      }
    } catch (error) {
      console.error(`Failed to fetch verse ${surah}:${ayah}:`, error);
    }
  }

  return verses;
}

/**
 * List available translations
 */
export function listTranslations() {
  return TRANSLATIONS.map(t => ({
    slug: t.slug,
    name: t.name,
    language: t.language,
  }));
}

/**
 * Get random verse
 */
export async function getRandomVerse(
  includeTranslation: boolean = true,
  translationSlug: string = 'en.asad'
): Promise<{ arabic: QuranVerse; translation?: QuranVerse; surahInfo: any }> {
  // Pick random surah
  const randomSurah = Math.floor(Math.random() * 114) + 1;
  const surahInfo = getSurahInfo(randomSurah);
  
  if (!surahInfo) {
    throw new QuranMCPError('Failed to get random verse', 'RANDOM_VERSE_ERROR');
  }

  // Pick random ayah from that surah
  const randomAyah = Math.floor(Math.random() * surahInfo.ayahs) + 1;

  const arabic = await getQuranArabic(randomSurah, randomAyah);
  
  if (includeTranslation) {
    const translation = await getQuranTranslation(randomSurah, randomAyah, translationSlug);
    return { arabic, translation, surahInfo };
  }

  return { arabic, surahInfo };
}

