/**
 * Quran recitation tools
 * Provides access to audio recitations
 */

import { recitationCacheService } from '../services/cache.js';
import { 
  API_ENDPOINTS, 
  RECITERS,
  isValidSurah, 
  isValidAyah,
  getSurahInfo,
  formatSurahNumber,
  formatAyahNumber 
} from '../constants/index.js';
import { RecitationInfo, QuranMCPError } from '../types/index.js';

/**
 * Get recitation URL for a specific verse
 */
export async function getRecitationURL(
  surah: number,
  ayah: number,
  reciterSlug: string = 'Maher_AlMuaiqly_64kbps'
): Promise<RecitationInfo> {
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

  // Validate reciter
  const reciter = RECITERS.find(r => r.slug === reciterSlug);
  if (!reciter) {
    throw new QuranMCPError(
      `Unknown reciter: ${reciterSlug}. Available reciters: ${RECITERS.map(r => r.slug).join(', ')}`,
      'INVALID_RECITER'
    );
  }

  // Create cache key
  const cacheKey = `recitation:${reciterSlug}:${surah}:${ayah}`;

  // Try to get from cache or generate
  return recitationCacheService.getOrSet(cacheKey, async () => {
    // Format numbers with leading zeros
    const surahFormatted = formatSurahNumber(surah);
    const ayahFormatted = formatAyahNumber(ayah);

    // Build URL
    const url = `${API_ENDPOINTS.RECITATION}/${reciterSlug}/${surahFormatted}${ayahFormatted}.mp3`;

    return {
      surah,
      ayah,
      reciter: reciter.name,
      url,
      format: 'mp3',
    };
  });
}

/**
 * Get recitation URLs for a range of verses
 */
export async function getRecitationRange(
  surah: number,
  startAyah: number,
  endAyah: number,
  reciterSlug: string = 'Maher_AlMuaiqly_64kbps'
): Promise<RecitationInfo[]> {
  if (startAyah > endAyah) {
    throw new QuranMCPError(
      'Start ayah must be less than or equal to end ayah',
      'INVALID_RANGE'
    );
  }

  const results: RecitationInfo[] = [];
  
  for (let ayah = startAyah; ayah <= endAyah; ayah++) {
    try {
      const recitation = await getRecitationURL(surah, ayah, reciterSlug);
      results.push(recitation);
    } catch (error) {
      console.error(`Failed to get recitation for ${surah}:${ayah}:`, error);
    }
  }

  return results;
}

/**
 * Get recitation URL for full Surah
 */
export async function getSurahRecitation(
  surah: number,
  reciterSlug: string = 'Maher_AlMuaiqly_64kbps'
): Promise<RecitationInfo[]> {
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

  return getRecitationRange(surah, 1, surahInfo.ayahs, reciterSlug);
}

/**
 * List available reciters
 */
export function listReciters() {
  return RECITERS.map(r => ({
    slug: r.slug,
    name: r.name,
    bitrate: r.bitrate,
  }));
}

/**
 * Get playlist for a Surah (M3U format)
 */
export async function getSurahPlaylist(
  surah: number,
  reciterSlug: string = 'Maher_AlMuaiqly_64kbps'
): Promise<string> {
  const recitations = await getSurahRecitation(surah, reciterSlug);
  const surahInfo = getSurahInfo(surah);

  // Generate M3U playlist
  let playlist = '#EXTM3U\n';
  playlist += `#PLAYLIST:Surah ${surah} - ${surahInfo?.name}\n\n`;

  for (const recitation of recitations) {
    playlist += `#EXTINF:-1,Surah ${recitation.surah} Ayah ${recitation.ayah}\n`;
    playlist += `${recitation.url}\n`;
  }

  return playlist;
}

