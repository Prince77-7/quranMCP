/**
 * Caching service for the Quran MCP Server
 * Implements in-memory LRU cache with TTL to reduce API calls
 *
 * Note: Lazy initialization for Cloudflare Workers compatibility
 */

import NodeCache from 'node-cache';

// Cache configuration
const CACHE_CONFIG = {
  stdTTL: 3600, // 1 hour default TTL
  checkperiod: 600, // Check for expired keys every 10 minutes
  useClones: false, // Don't clone objects for better performance
  maxKeys: 10000, // Maximum number of keys to store
};

// Lazy-initialized cache instances for Cloudflare Workers compatibility
let tafsirCache: NodeCache | null = null;
let hadithCache: NodeCache | null = null;
let quranCache: NodeCache | null = null;
let recitationCache: NodeCache | null = null;
let searchCache: NodeCache | null = null;

// Initialize caches lazily
function getTafsirCache() {
  if (!tafsirCache) {
    tafsirCache = new NodeCache({ ...CACHE_CONFIG, stdTTL: 7200 });
  }
  return tafsirCache;
}

function getHadithCache() {
  if (!hadithCache) {
    hadithCache = new NodeCache({ ...CACHE_CONFIG, stdTTL: 7200 });
  }
  return hadithCache;
}

function getQuranCache() {
  if (!quranCache) {
    quranCache = new NodeCache({ ...CACHE_CONFIG, stdTTL: 86400 });
  }
  return quranCache;
}

function getRecitationCache() {
  if (!recitationCache) {
    recitationCache = new NodeCache({ ...CACHE_CONFIG, stdTTL: 86400 });
  }
  return recitationCache;
}

function getSearchCache() {
  if (!searchCache) {
    searchCache = new NodeCache({ ...CACHE_CONFIG, stdTTL: 1800 });
  }
  return searchCache;
}

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

// Lazy-initialized cache service instances
let tafsirCacheServiceInstance: CacheService<any> | null = null;
let hadithCacheServiceInstance: CacheService<any> | null = null;
let quranCacheServiceInstance: CacheService<any> | null = null;
let recitationCacheServiceInstance: CacheService<any> | null = null;
let searchCacheServiceInstance: CacheService<any> | null = null;

// Export cache services for different data types (lazy-initialized)
export const tafsirCacheService = {
  get: (key: string) => {
    if (!tafsirCacheServiceInstance) tafsirCacheServiceInstance = new CacheService(getTafsirCache());
    return tafsirCacheServiceInstance.get(key);
  },
  set: (key: string, value: any, ttl?: number) => {
    if (!tafsirCacheServiceInstance) tafsirCacheServiceInstance = new CacheService(getTafsirCache());
    return tafsirCacheServiceInstance.set(key, value, ttl);
  },
  del: (key: string) => {
    if (!tafsirCacheServiceInstance) tafsirCacheServiceInstance = new CacheService(getTafsirCache());
    return tafsirCacheServiceInstance.del(key);
  },
  flush: () => {
    if (!tafsirCacheServiceInstance) tafsirCacheServiceInstance = new CacheService(getTafsirCache());
    return tafsirCacheServiceInstance.flush();
  },
  getStats: () => {
    if (!tafsirCacheServiceInstance) tafsirCacheServiceInstance = new CacheService(getTafsirCache());
    return tafsirCacheServiceInstance.getStats();
  },
  getOrSet: async <R>(key: string, fetchFn: () => Promise<R>, ttl?: number) => {
    if (!tafsirCacheServiceInstance) tafsirCacheServiceInstance = new CacheService(getTafsirCache());
    return tafsirCacheServiceInstance.getOrSet(key, fetchFn, ttl);
  },
};

export const hadithCacheService = {
  get: (key: string) => {
    if (!hadithCacheServiceInstance) hadithCacheServiceInstance = new CacheService(getHadithCache());
    return hadithCacheServiceInstance.get(key);
  },
  set: (key: string, value: any, ttl?: number) => {
    if (!hadithCacheServiceInstance) hadithCacheServiceInstance = new CacheService(getHadithCache());
    return hadithCacheServiceInstance.set(key, value, ttl);
  },
  del: (key: string) => {
    if (!hadithCacheServiceInstance) hadithCacheServiceInstance = new CacheService(getHadithCache());
    return hadithCacheServiceInstance.del(key);
  },
  flush: () => {
    if (!hadithCacheServiceInstance) hadithCacheServiceInstance = new CacheService(getHadithCache());
    return hadithCacheServiceInstance.flush();
  },
  getStats: () => {
    if (!hadithCacheServiceInstance) hadithCacheServiceInstance = new CacheService(getHadithCache());
    return hadithCacheServiceInstance.getStats();
  },
  getOrSet: async <R>(key: string, fetchFn: () => Promise<R>, ttl?: number) => {
    if (!hadithCacheServiceInstance) hadithCacheServiceInstance = new CacheService(getHadithCache());
    return hadithCacheServiceInstance.getOrSet(key, fetchFn, ttl);
  },
};

export const quranCacheService = {
  get: (key: string) => {
    if (!quranCacheServiceInstance) quranCacheServiceInstance = new CacheService(getQuranCache());
    return quranCacheServiceInstance.get(key);
  },
  set: (key: string, value: any, ttl?: number) => {
    if (!quranCacheServiceInstance) quranCacheServiceInstance = new CacheService(getQuranCache());
    return quranCacheServiceInstance.set(key, value, ttl);
  },
  del: (key: string) => {
    if (!quranCacheServiceInstance) quranCacheServiceInstance = new CacheService(getQuranCache());
    return quranCacheServiceInstance.del(key);
  },
  flush: () => {
    if (!quranCacheServiceInstance) quranCacheServiceInstance = new CacheService(getQuranCache());
    return quranCacheServiceInstance.flush();
  },
  getStats: () => {
    if (!quranCacheServiceInstance) quranCacheServiceInstance = new CacheService(getQuranCache());
    return quranCacheServiceInstance.getStats();
  },
  getOrSet: async <R>(key: string, fetchFn: () => Promise<R>, ttl?: number) => {
    if (!quranCacheServiceInstance) quranCacheServiceInstance = new CacheService(getQuranCache());
    return quranCacheServiceInstance.getOrSet(key, fetchFn, ttl);
  },
};

export const recitationCacheService = {
  get: (key: string) => {
    if (!recitationCacheServiceInstance) recitationCacheServiceInstance = new CacheService(getRecitationCache());
    return recitationCacheServiceInstance.get(key);
  },
  set: (key: string, value: any, ttl?: number) => {
    if (!recitationCacheServiceInstance) recitationCacheServiceInstance = new CacheService(getRecitationCache());
    return recitationCacheServiceInstance.set(key, value, ttl);
  },
  del: (key: string) => {
    if (!recitationCacheServiceInstance) recitationCacheServiceInstance = new CacheService(getRecitationCache());
    return recitationCacheServiceInstance.del(key);
  },
  flush: () => {
    if (!recitationCacheServiceInstance) recitationCacheServiceInstance = new CacheService(getRecitationCache());
    return recitationCacheServiceInstance.flush();
  },
  getStats: () => {
    if (!recitationCacheServiceInstance) recitationCacheServiceInstance = new CacheService(getRecitationCache());
    return recitationCacheServiceInstance.getStats();
  },
  getOrSet: async <R>(key: string, fetchFn: () => Promise<R>, ttl?: number) => {
    if (!recitationCacheServiceInstance) recitationCacheServiceInstance = new CacheService(getRecitationCache());
    return recitationCacheServiceInstance.getOrSet(key, fetchFn, ttl);
  },
};

export const searchCacheService = {
  get: (key: string) => {
    if (!searchCacheServiceInstance) searchCacheServiceInstance = new CacheService(getSearchCache());
    return searchCacheServiceInstance.get(key);
  },
  set: (key: string, value: any, ttl?: number) => {
    if (!searchCacheServiceInstance) searchCacheServiceInstance = new CacheService(getSearchCache());
    return searchCacheServiceInstance.set(key, value, ttl);
  },
  del: (key: string) => {
    if (!searchCacheServiceInstance) searchCacheServiceInstance = new CacheService(getSearchCache());
    return searchCacheServiceInstance.del(key);
  },
  flush: () => {
    if (!searchCacheServiceInstance) searchCacheServiceInstance = new CacheService(getSearchCache());
    return searchCacheServiceInstance.flush();
  },
  getStats: () => {
    if (!searchCacheServiceInstance) searchCacheServiceInstance = new CacheService(getSearchCache());
    return searchCacheServiceInstance.getStats();
  },
  getOrSet: async <R>(key: string, fetchFn: () => Promise<R>, ttl?: number) => {
    if (!searchCacheServiceInstance) searchCacheServiceInstance = new CacheService(getSearchCache());
    return searchCacheServiceInstance.getOrSet(key, fetchFn, ttl);
  },
};

/**
 * Get all cache statistics
 */
export function getAllCacheStats() {
  return {
    tafsir: getTafsirCache().getStats(),
    hadith: getHadithCache().getStats(),
    quran: getQuranCache().getStats(),
    recitation: getRecitationCache().getStats(),
    search: getSearchCache().getStats(),
  };
}

/**
 * Clear all caches
 */
export function clearAllCaches() {
  getTafsirCache().flushAll();
  getHadithCache().flushAll();
  getQuranCache().flushAll();
  getRecitationCache().flushAll();
  getSearchCache().flushAll();
}

