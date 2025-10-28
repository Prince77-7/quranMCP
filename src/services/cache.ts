/**
 * Caching service for the Quran MCP Server
 * Implements in-memory LRU cache with TTL to reduce API calls
 */

import NodeCache from 'node-cache';

// Cache configuration
const CACHE_CONFIG = {
  stdTTL: 3600, // 1 hour default TTL
  checkperiod: 600, // Check for expired keys every 10 minutes
  useClones: false, // Don't clone objects for better performance
  maxKeys: 10000, // Maximum number of keys to store
};

// Create cache instances for different data types
const tafsirCache = new NodeCache({ ...CACHE_CONFIG, stdTTL: 7200 }); // 2 hours for tafsir
const hadithCache = new NodeCache({ ...CACHE_CONFIG, stdTTL: 7200 }); // 2 hours for hadith
const quranCache = new NodeCache({ ...CACHE_CONFIG, stdTTL: 86400 }); // 24 hours for Quran text
const recitationCache = new NodeCache({ ...CACHE_CONFIG, stdTTL: 86400 }); // 24 hours for recitation URLs
const searchCache = new NodeCache({ ...CACHE_CONFIG, stdTTL: 1800 }); // 30 minutes for search results

/**
 * Generic cache wrapper with type safety
 */
class CacheService<T> {
  constructor(private cache: NodeCache) {}

  /**
   * Get value from cache
   */
  get(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  /**
   * Set value in cache
   */
  set(key: string, value: T, ttl?: number): boolean {
    return this.cache.set(key, value, ttl || 0);
  }

  /**
   * Delete value from cache
   */
  del(key: string): number {
    return this.cache.del(key);
  }

  /**
   * Clear all cache
   */
  flush(): void {
    this.cache.flushAll();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return this.cache.getStats();
  }

  /**
   * Get or set pattern - fetch from cache or execute function and cache result
   */
  async getOrSet<R extends T>(
    key: string,
    fetchFn: () => Promise<R>,
    ttl?: number
  ): Promise<R> {
    const cached = this.get(key);
    if (cached !== undefined) {
      return cached as R;
    }

    const value = await fetchFn();
    this.set(key, value, ttl);
    return value;
  }
}

// Export cache services for different data types
export const tafsirCacheService = new CacheService(tafsirCache);
export const hadithCacheService = new CacheService(hadithCache);
export const quranCacheService = new CacheService(quranCache);
export const recitationCacheService = new CacheService(recitationCache);
export const searchCacheService = new CacheService(searchCache);

/**
 * Get all cache statistics
 */
export function getAllCacheStats() {
  return {
    tafsir: tafsirCache.getStats(),
    hadith: hadithCache.getStats(),
    quran: quranCache.getStats(),
    recitation: recitationCache.getStats(),
    search: searchCache.getStats(),
  };
}

/**
 * Clear all caches
 */
export function clearAllCaches() {
  tafsirCache.flushAll();
  hadithCache.flushAll();
  quranCache.flushAll();
  recitationCache.flushAll();
  searchCache.flushAll();
}

