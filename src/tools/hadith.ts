/**
 * Hadith tools
 * Provides access to various Hadith collections
 */

import { API_ENDPOINTS, HADITH_COLLECTIONS } from '../constants/index.js';
import { hadithCacheService } from '../services/cache.js';
import { fetchJSON } from '../services/fetcher.js';
import { HadithResponse, QuranMCPError } from '../types/index.js';

/**
 * Get a specific Hadith from a collection
 */
export async function getHadith(
  collection: string,
  hadithNumber: number
): Promise<HadithResponse> {
  // Validate collection
  const collectionInfo = HADITH_COLLECTIONS.find(c => c.slug === collection);
  if (!collectionInfo) {
    throw new QuranMCPError(
      `Unknown hadith collection: ${collection}. Available collections: ${HADITH_COLLECTIONS.map(c => c.slug).join(', ')}`,
      'INVALID_COLLECTION'
    );
  }

  // Validate hadith number
  if (hadithNumber < 1 || hadithNumber > collectionInfo.totalHadiths) {
    throw new QuranMCPError(
      `Invalid hadith number: ${hadithNumber}. ${collectionInfo.name} has ${collectionInfo.totalHadiths} hadiths.`,
      'INVALID_HADITH_NUMBER'
    );
  }

  // Create cache key
  const cacheKey = `hadith:${collection}:${hadithNumber}`;

  // Try to get from cache or fetch
  return hadithCacheService.getOrSet(cacheKey, async () => {
    // Try English first, fallback to Arabic
    const endpoints = [
      `${API_ENDPOINTS.HADITH}/eng-${collection}/${hadithNumber}.json`,
      `${API_ENDPOINTS.HADITH}/ara-${collection}/${hadithNumber}.json`,
    ];

    let lastError: Error | null = null;

    for (const url of endpoints) {
      try {
        const data = await fetchJSON<any>(url);

        // Handle the actual API structure: { metadata: {...}, hadiths: [{text: "..."}] }
        let text = '';
        let book = undefined;
        let chapter = undefined;
        let grade = undefined;
        let narrator = undefined;

        if (data.hadiths && Array.isArray(data.hadiths) && data.hadiths.length > 0) {
          // Find the hadith with matching number
          const hadith = data.hadiths.find((h: any) => h.hadithnumber === hadithNumber) || data.hadiths[0];
          text = hadith.text || '';
          book = hadith.reference?.book;
          chapter = data.metadata?.section?.[book];
          grade = hadith.grades?.[0];
        } else {
          // Fallback to old structure
          text = data.text || data.hadith || '';
          book = data.book;
          chapter = data.chapter || data.chapterName;
          grade = data.grade;
          narrator = data.narrator;
        }

        return {
          hadithNumber,
          collection: collectionInfo.name,
          book,
          chapter,
          text,
          grade,
          narrator,
        };
      } catch (error) {
        lastError = error as Error;
        continue;
      }
    }

    throw new QuranMCPError(
      `Failed to fetch hadith: ${lastError?.message}`,
      'HADITH_FETCH_ERROR'
    );
  });
}

/**
 * List available Hadith collections
 */
export function listHadithCollections() {
  return HADITH_COLLECTIONS.map(collection => ({
    slug: collection.slug,
    name: collection.name,
    totalHadiths: collection.totalHadiths,
  }));
}

/**
 * Get random Hadith from a collection
 */
export async function getRandomHadith(collection?: string): Promise<HadithResponse> {
  // If no collection specified, pick a random one
  const selectedCollection = collection ||
    HADITH_COLLECTIONS[Math.floor(Math.random() * HADITH_COLLECTIONS.length)].slug;

  const collectionInfo = HADITH_COLLECTIONS.find(c => c.slug === selectedCollection);
  if (!collectionInfo) {
    throw new QuranMCPError(
      `Unknown hadith collection: ${selectedCollection}`,
      'INVALID_COLLECTION'
    );
  }

  // Get random hadith number
  const randomNumber = Math.floor(Math.random() * collectionInfo.totalHadiths) + 1;

  return getHadith(selectedCollection, randomNumber);
}

/**
 * Search Hadith by keyword (basic implementation)
 * Note: This is a simple implementation. For production, consider using a proper search API
 */
export async function searchHadith(
  query: string,
  collection?: string,
  limit: number = 10
): Promise<HadithResponse[]> {
  const results: HadithResponse[] = [];
  const searchCollection = collection || 'bukhari'; // Default to Bukhari

  const collectionInfo = HADITH_COLLECTIONS.find(c => c.slug === searchCollection);
  if (!collectionInfo) {
    throw new QuranMCPError(
      `Unknown hadith collection: ${searchCollection}`,
      'INVALID_COLLECTION'
    );
  }

  // Simple search: try random hadiths and filter by keyword
  // This is not efficient but works for demonstration
  const attempts = Math.min(50, collectionInfo.totalHadiths);
  const tried = new Set<number>();

  for (let i = 0; i < attempts && results.length < limit; i++) {
    const randomNum = Math.floor(Math.random() * collectionInfo.totalHadiths) + 1;

    if (tried.has(randomNum)) continue;
    tried.add(randomNum);

    try {
      const hadith = await getHadith(searchCollection, randomNum);
      if (hadith.text.toLowerCase().includes(query.toLowerCase())) {
        results.push(hadith);
      }
    } catch {
      // Skip failed fetches
      continue;
    }
  }

  return results;
}

