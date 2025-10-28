/**
 * Search tools for Quran and Hadith
 * Enables keyword and phrase-based searching across Islamic texts
 * Features intelligent fuzzy matching and helpful suggestions
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
  matchType?: 'exact' | 'fuzzy' | 'partial';
}

interface HadithSearchResult {
  hadithNumber: number;
  collection: string;
  collectionName: string;
  text: string;
  book?: string;
  chapter?: string;
  relevanceScore: number;
  matchType?: 'exact' | 'fuzzy' | 'partial';
}

/**
 * Calculate Levenshtein distance for fuzzy matching
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Calculate similarity score (0-1) between two strings
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const distance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
  return (longer.length - distance) / longer.length;
}

/**
 * Detect if text is Arabic
 */
function isArabic(text: string): boolean {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text);
}

/**
 * Normalize Arabic text by removing diacritics and normalizing characters
 * This helps with fuzzy matching in Arabic
 */
function normalizeArabic(text: string): string {
  if (!isArabic(text)) return text;

  return text
    // Remove diacritics (tashkeel)
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Normalize Alef variations
    .replace(/[إأآا]/g, 'ا')
    // Normalize Teh Marbuta
    .replace(/ة/g, 'ه')
    // Normalize Yeh variations
    .replace(/[يى]/g, 'ي')
    // Remove Tatweel (elongation)
    .replace(/ـ/g, '')
    .trim();
}

/**
 * Advanced relevance scoring with fuzzy matching
 * Supports both English and Arabic text with intelligent normalization
 */
function calculateRelevance(text: string, keywords: string[]): { score: number; matchType: 'exact' | 'fuzzy' | 'partial' } {
  const lowerText = text.toLowerCase();
  const isArabicText = isArabic(text);
  const normalizedText = isArabicText ? normalizeArabic(text) : lowerText;

  let score = 0;
  let bestMatchType: 'exact' | 'fuzzy' | 'partial' = 'partial';

  for (const keyword of keywords) {
    const lowerKeyword = keyword.toLowerCase();
    const isArabicKeyword = isArabic(keyword);
    const normalizedKeyword = isArabicKeyword ? normalizeArabic(keyword) : lowerKeyword;

    // Exact phrase match - highest score
    if (lowerText.includes(lowerKeyword) || normalizedText.includes(normalizedKeyword)) {
      score += 100;
      bestMatchType = 'exact';
      continue;
    }

    // Word-level matching with fuzzy logic
    const words = normalizedText.split(/\s+/);
    for (const word of words) {
      // Clean word (remove punctuation for non-Arabic, keep Arabic as-is)
      const cleanWord = isArabicText ? word : word.replace(/[^\w]/g, '');

      // Exact word match
      if (cleanWord === normalizedKeyword) {
        score += 50;
        if (bestMatchType !== 'exact') bestMatchType = 'fuzzy';
      }
      // Partial word match
      else if (cleanWord.includes(normalizedKeyword) || normalizedKeyword.includes(cleanWord)) {
        score += 25;
      }
      // Fuzzy match (similarity > 0.75 for Arabic, 0.8 for English)
      else {
        const similarity = calculateSimilarity(cleanWord, normalizedKeyword);
        const threshold = isArabicText ? 0.75 : 0.8;
        if (similarity > threshold) {
          score += Math.floor(similarity * 30);
          if (bestMatchType === 'partial') bestMatchType = 'fuzzy';
        }
      }
    }
  }

  return { score, matchType: bestMatchType };
}

/**
 * Search Quran by keywords or phrases with intelligent fuzzy matching
 * Features: parallel fetching, smart sampling, fuzzy matching, helpful suggestions
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
    const isArabicQuery = isArabic(query);

    // OPTIMIZED: Fetch ALL surahs in parallel for maximum speed
    const fetchSlug = isArabicQuery ? 'ar.alafasy' : translationSlug;

    // Fetch all 114 surahs in parallel (Cloudflare Workers can handle this)
    const allPromises = SURAH_INFO.map(async (surahInfo) => {
      try {
        const url = `https://api.alquran.cloud/v1/surah/${surahInfo.number}/${fetchSlug}`;
        const response = await fetchJSON<any>(url);

        if (response.code === 200 && response.data && response.data.ayahs) {
          const surahResults: SearchResult[] = [];
          for (const ayah of response.data.ayahs) {
            const { score, matchType } = calculateRelevance(ayah.text, keywords);

            if (score > 0) {
              surahResults.push({
                surah: surahInfo.number,
                ayah: ayah.numberInSurah,
                surahName: surahInfo.name,
                text: ayah.text,
                translation: isArabicQuery ? 'Arabic' : translation.name,
                relevanceScore: score,
                matchType,
              });
            }
          }
          return surahResults;
        }
      } catch (error) {
        // Continue searching other surahs even if one fails
        console.error(`Error searching surah ${surahInfo.number}:`, error);
      }
      return [];
    });

    // Wait for ALL requests to complete in parallel
    const allResults = await Promise.all(allPromises);

    // Flatten results
    for (const surahResults of allResults) {
      results.push(...surahResults);
    }

    // Sort by relevance and match type
    const sorted = results.sort((a, b) => {
      // Prioritize exact matches
      if (a.matchType === 'exact' && b.matchType !== 'exact') return -1;
      if (b.matchType === 'exact' && a.matchType !== 'exact') return 1;
      // Then by score
      return b.relevanceScore - a.relevanceScore;
    });

    const finalResults = sorted.slice(0, maxResults);

    // Add helpful message if no results or only fuzzy matches
    if (finalResults.length === 0) {
      console.log(`No results found for "${query}". Try different keywords or check spelling.`);
    } else if (finalResults.every(r => r.matchType !== 'exact')) {
      console.log(`No exact matches for "${query}". Showing ${finalResults.length} similar results.`);
    }

    return finalResults;
  });
}

/**
 * Search Hadith collections by keywords or phrases with intelligent fuzzy matching
 * Features: parallel fetching, smart sampling, fuzzy matching, helpful suggestions
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
    const isArabicQuery = isArabic(query);

    // AGGRESSIVE optimization: Much smaller sample size, more parallel requests
    const SAMPLE_SIZE = 50; // Reduced from 200 to 50 for speed
    const PARALLEL_REQUESTS = 10; // Increased from 5 to 10 for speed
    const MAX_COLLECTIONS = 2; // Only search first 2 collections by default

    // Limit collections for performance
    const limitedCollections = searchCollections.slice(0, MAX_COLLECTIONS);

    // Process all collections in parallel
    const collectionPromises = limitedCollections.map(async (collectionSlug) => {
      const collectionInfo = HADITH_COLLECTIONS.find(c => c.slug === collectionSlug);
      if (!collectionInfo) return [];

      const collectionResults: HadithSearchResult[] = [];
      const sampleSize = Math.min(SAMPLE_SIZE, collectionInfo.totalHadiths);
      const step = Math.max(1, Math.floor(collectionInfo.totalHadiths / sampleSize));

      // Create array of hadith numbers to search
      const hadithNumbers: number[] = [];
      for (let i = 1; i <= collectionInfo.totalHadiths && hadithNumbers.length < sampleSize; i += step) {
        hadithNumbers.push(i);
      }

      // Process ALL hadiths in parallel batches
      for (let i = 0; i < hadithNumbers.length; i += PARALLEL_REQUESTS) {
        const batch = hadithNumbers.slice(i, i + PARALLEL_REQUESTS);

        const batchPromises = batch.map(async (hadithNum) => {
          try {
            // Fetch Arabic if query is Arabic, otherwise fetch English
            const lang = isArabicQuery ? 'ara' : 'eng';
            const url = `${API_ENDPOINTS.HADITH}/${lang}-${collectionSlug}/${hadithNum}.json`;

            const data = await fetchJSON<any>(url);
            if (!data) return null;

            // Handle the actual API structure: { metadata: {...}, hadiths: [{text: "..."}] }
            let text = '';
            let book = undefined;
            let chapter = undefined;

            if (data.hadiths && Array.isArray(data.hadiths) && data.hadiths.length > 0) {
              // Find the hadith with matching number
              const hadith = data.hadiths.find((h: any) => h.hadithnumber === hadithNum) || data.hadiths[0];
              text = hadith.text || '';
              book = hadith.reference?.book;
              chapter = data.metadata?.section?.[book];
            } else {
              // Fallback to old structure
              text = data.text || data.hadith || '';
              book = data.book;
              chapter = data.chapter || data.chapterName;
            }

            if (!text || text.trim().length === 0) return null;

            const { score, matchType } = calculateRelevance(text, keywords);

            if (score > 0) {
              return {
                hadithNumber: hadithNum,
                collection: collectionSlug,
                collectionName: collectionInfo.name,
                text,
                book,
                chapter,
                relevanceScore: score,
                matchType,
              };
            }
          } catch {
            // Silently fail and continue
          }
          return null;
        });

        const batchResults = await Promise.all(batchPromises);
        collectionResults.push(...batchResults.filter(r => r !== null) as HadithSearchResult[]);

        // Early exit if we have enough high-quality results for this collection
        if (collectionResults.filter(r => r.matchType === 'exact').length >= maxResults) {
          break;
        }
      }

      return collectionResults;
    });

    // Wait for all collections to finish
    const allCollectionResults = await Promise.all(collectionPromises);
    results.push(...allCollectionResults.flat());

    // Sort by relevance and match type
    const sorted = results.sort((a, b) => {
      // Prioritize exact matches
      if (a.matchType === 'exact' && b.matchType !== 'exact') return -1;
      if (b.matchType === 'exact' && a.matchType !== 'exact') return 1;
      // Then by score
      return b.relevanceScore - a.relevanceScore;
    });

    const finalResults = sorted.slice(0, maxResults);

    // Add helpful message if no results or only fuzzy matches
    if (finalResults.length === 0) {
      console.log(`No hadiths found for "${query}". Try different keywords or check spelling.`);
    } else if (finalResults.every(r => r.matchType !== 'exact')) {
      console.log(`No exact matches for "${query}". Showing ${finalResults.length} similar hadiths.`);
    }

    return finalResults;
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

