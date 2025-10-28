/**
 * Search tools for Quran and Hadith
 * Enables keyword and phrase-based searching across Islamic texts
 */

import { API_ENDPOINTS, HADITH_COLLECTIONS, SURAH_INFO, TRANSLATIONS } from '../constants/index.js';
import { searchCacheService } from '../services/cache.js';
import { fetchJSON } from '../services/fetcher.js';
import { QuranMCPError } from '../types/index.js';

interface SearchResult {
  surah: number;
  ayah: number;
  surahName: string;
  text: string;
  translation?: string;
  relevanceScore: number;
}

interface HadithSearchResult {
  hadithNumber: number;
  collection: string;
  collectionName: string;
  text: string;
  book?: string;
  chapter?: string;
  relevanceScore: number;
}

/**
 * Calculate relevance score based on keyword matches
 */
function calculateRelevance(text: string, keywords: string[]): number {
  const lowerText = text.toLowerCase();
  let score = 0;

  for (const keyword of keywords) {
    const lowerKeyword = keyword.toLowerCase();
    // Exact phrase match gets highest score
    if (lowerText.includes(lowerKeyword)) {
      score += 10;
    }
    // Word boundary matches
    const words = lowerText.split(/\s+/);
    for (const word of words) {
      if (word.includes(lowerKeyword)) {
        score += 5;
      }
    }
  }

  return score;
}

/**
 * Search Quran by keywords or phrases
 * This powerful tool allows AI agents to find verses containing specific words or concepts
 */
export async function searchQuran(
  query: string,
  translationSlug: string = 'en.sahih',
  maxResults: number = 20
): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) {
    throw new QuranMCPError(
      'Search query must be at least 2 characters long',
      'INVALID_SEARCH_QUERY'
    );
  }

  // Validate translation
  const translation = TRANSLATIONS.find(t => t.slug === translationSlug);
  if (!translation) {
    throw new QuranMCPError(
      `Unknown translation: ${translationSlug}. Available: ${TRANSLATIONS.map(t => t.slug).join(', ')}`,
      'INVALID_TRANSLATION'
    );
  }

  const cacheKey = `search:quran:${translationSlug}:${query}:${maxResults}`;

  return searchCacheService.getOrSet(cacheKey, async () => {
    const results: SearchResult[] = [];
    const keywords = query.toLowerCase().split(/\s+/).filter(k => k.length > 1);

    // Search through all surahs
    for (const surahInfo of SURAH_INFO) {
      // Fetch entire surah for searching
      try {
        const url = `https://api.alquran.cloud/v1/surah/${surahInfo.number}/${translationSlug}`;
        const response = await fetchJSON<any>(url);

        if (response.code === 200 && response.data && response.data.ayahs) {
          for (const ayah of response.data.ayahs) {
            const relevance = calculateRelevance(ayah.text, keywords);

            if (relevance > 0) {
              results.push({
                surah: surahInfo.number,
                ayah: ayah.numberInSurah,
                surahName: surahInfo.name,
                text: ayah.text,
                translation: translation.name,
                relevanceScore: relevance,
              });
            }
          }
        }
      } catch (error) {
        // Continue searching other surahs even if one fails
        console.error(`Error searching surah ${surahInfo.number}:`, error);
        continue;
      }
    }

    // Sort by relevance and limit results
    return results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults);
  });
}

/**
 * Search Hadith collections by keywords or phrases
 * Enables finding hadiths about specific topics without knowing exact numbers
 */
export async function searchHadith(
  query: string,
  collections?: string[],
  maxResults: number = 20
): Promise<HadithSearchResult[]> {
  if (!query || query.trim().length < 2) {
    throw new QuranMCPError(
      'Search query must be at least 2 characters long',
      'INVALID_SEARCH_QUERY'
    );
  }

  // Validate collections
  const searchCollections = collections && collections.length > 0
    ? collections
    : HADITH_COLLECTIONS.map(c => c.slug);

  for (const col of searchCollections) {
    if (!HADITH_COLLECTIONS.find(c => c.slug === col)) {
      throw new QuranMCPError(
        `Unknown collection: ${col}. Available: ${HADITH_COLLECTIONS.map(c => c.slug).join(', ')}`,
        'INVALID_COLLECTION'
      );
    }
  }

  const cacheKey = `search:hadith:${searchCollections.join(',')}:${query}:${maxResults}`;

  return searchCacheService.getOrSet(cacheKey, async () => {
    const results: HadithSearchResult[] = [];
    const keywords = query.toLowerCase().split(/\s+/).filter(k => k.length > 1);

    // Search through specified collections
    for (const collectionSlug of searchCollections) {
      const collectionInfo = HADITH_COLLECTIONS.find(c => c.slug === collectionSlug);
      if (!collectionInfo) continue;

      // Sample hadiths from the collection (search first 100 for performance)
      const sampleSize = Math.min(100, collectionInfo.totalHadiths);
      const step = Math.floor(collectionInfo.totalHadiths / sampleSize);

      for (let i = 1; i <= collectionInfo.totalHadiths; i += step) {
        try {
          const endpoints = [
            `${API_ENDPOINTS.HADITH}/eng-${collectionSlug}/${i}.json`,
            `${API_ENDPOINTS.HADITH}/ara-${collectionSlug}/${i}.json`,
          ];

          for (const url of endpoints) {
            try {
              const data = await fetchJSON<any>(url);
              const text = data.text || data.hadith || '';
              const relevance = calculateRelevance(text, keywords);

              if (relevance > 0) {
                results.push({
                  hadithNumber: i,
                  collection: collectionSlug,
                  collectionName: collectionInfo.name,
                  text,
                  book: data.book,
                  chapter: data.chapter || data.chapterName,
                  relevanceScore: relevance,
                });
                break; // Found in this language, no need to try other
              }
            } catch {
              continue; // Try next endpoint
            }
          }
        } catch (error) {
          continue; // Continue with next hadith
        }
      }
    }

    // Sort by relevance and limit results
    return results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults);
  });
}

/**
 * Search Quran by topic or theme
 * Uses common Islamic topics to find relevant verses
 */
export async function searchQuranByTopic(
  topic: string,
  translationSlug: string = 'en.sahih',
  maxResults: number = 10
): Promise<SearchResult[]> {
  // Map common topics to search terms
  const topicKeywords: Record<string, string> = {
    'prayer': 'prayer salah worship prostrate bow',
    'patience': 'patient patience persevere steadfast',
    'charity': 'charity alms poor needy spend',
    'faith': 'believe faith believer trust',
    'paradise': 'paradise garden heaven jannah',
    'hell': 'hell fire punishment hellfire',
    'prophet': 'prophet messenger muhammad',
    'allah': 'allah god lord',
    'mercy': 'mercy merciful compassion forgive',
    'justice': 'justice just fair equity',
    'knowledge': 'knowledge learn wisdom understand',
    'family': 'family parents children wife husband',
    'death': 'death die hereafter resurrection',
    'creation': 'creation create heavens earth',
    'guidance': 'guidance guide straight path',
  };

  const searchQuery = topicKeywords[topic.toLowerCase()] || topic;
  return searchQuran(searchQuery, translationSlug, maxResults);
}

/**
 * Search Hadith by topic or theme
 * Uses common Islamic topics to find relevant hadiths
 */
export async function searchHadithByTopic(
  topic: string,
  collections?: string[],
  maxResults: number = 10
): Promise<HadithSearchResult[]> {
  // Map common topics to search terms
  const topicKeywords: Record<string, string> = {
    'prayer': 'prayer salah worship prostrate',
    'fasting': 'fast fasting ramadan',
    'charity': 'charity sadaqah alms',
    'hajj': 'hajj pilgrimage kaaba',
    'faith': 'faith belief iman',
    'prophet': 'prophet messenger',
    'companions': 'companion sahaba',
    'knowledge': 'knowledge learn scholar',
    'manners': 'manner behavior conduct',
    'family': 'family parents children',
    'marriage': 'marriage wife husband',
    'death': 'death grave hereafter',
    'jihad': 'jihad struggle strive',
    'repentance': 'repent forgive sin',
  };

  const searchQuery = topicKeywords[topic.toLowerCase()] || topic;
  return searchHadith(searchQuery, collections, maxResults);
}

