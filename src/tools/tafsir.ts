/**
 * Tafsir (Quranic commentary) tools
 * Provides access to various Tafsir sources
 */

import { fetchJSON } from '../services/fetcher.js';
import { tafsirCacheService } from '../services/cache.js';
import { 
  API_ENDPOINTS, 
  TAFSIR_SOURCES, 
  isValidSurah, 
  isValidAyah,
  getSurahInfo 
} from '../constants/index.js';
import { TafsirResponse, QuranMCPError } from '../types/index.js';

/**
 * Get Tafsir for a specific verse
 */
export async function getTafsir(
  surah: number,
  ayah: number,
  tafsirSlug: string = 'en-tafisr-ibn-kathir'
): Promise<TafsirResponse> {
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

  // Check if tafsir source exists
  const tafsirSource = TAFSIR_SOURCES.find(t => t.slug === tafsirSlug);
  if (!tafsirSource) {
    throw new QuranMCPError(
      `Unknown tafsir source: ${tafsirSlug}. Available sources: ${TAFSIR_SOURCES.map(t => t.slug).join(', ')}`,
      'INVALID_TAFSIR_SOURCE'
    );
  }

  // Create cache key
  const cacheKey = `tafsir:${tafsirSlug}:${surah}:${ayah}`;

  // Try to get from cache or fetch
  return tafsirCacheService.getOrSet(cacheKey, async () => {
    const url = `${API_ENDPOINTS.TAFSIR}/${tafsirSlug}/${surah}/${ayah}.json`;
    
    try {
      const data = await fetchJSON<any>(url);
      
      return {
        surah,
        ayah,
        text: data.text || data.tafsir || '',
        tafsir_name: tafsirSource.name,
        language: tafsirSource.language,
      };
    } catch (error) {
      if (error instanceof QuranMCPError) {
        throw error;
      }
      throw new QuranMCPError(
        `Failed to fetch tafsir: ${(error as Error).message}`,
        'TAFSIR_FETCH_ERROR'
      );
    }
  });
}

/**
 * List available Tafsir sources
 */
export function listTafsirSources() {
  return TAFSIR_SOURCES.map(source => ({
    slug: source.slug,
    name: source.name,
    language: source.language,
    author: source.author,
  }));
}

/**
 * Get Tafsir for multiple verses (range)
 */
export async function getTafsirRange(
  surah: number,
  startAyah: number,
  endAyah: number,
  tafsirSlug: string = 'en-tafisr-ibn-kathir'
): Promise<TafsirResponse[]> {
  if (startAyah > endAyah) {
    throw new QuranMCPError(
      'Start ayah must be less than or equal to end ayah',
      'INVALID_RANGE'
    );
  }

  const results: TafsirResponse[] = [];
  
  for (let ayah = startAyah; ayah <= endAyah; ayah++) {
    try {
      const tafsir = await getTafsir(surah, ayah, tafsirSlug);
      results.push(tafsir);
    } catch (error) {
      // Continue with other verses even if one fails
      console.error(`Failed to fetch tafsir for ${surah}:${ayah}:`, error);
    }
  }

  return results;
}

