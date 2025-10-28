/**
 * Unit tests for cache service
 */

import { describe, it, expect, beforeEach } from 'vitest';

import { quranCacheService, getAllCacheStats, clearAllCaches } from '../cache.js';

describe('Cache Service', () => {
  beforeEach(() => {
    clearAllCaches();
  });

  describe('CacheService', () => {
    it('should store and retrieve values', () => {
      quranCacheService.set('test-key', { data: 'test-value' });
      const result = quranCacheService.get('test-key');

      expect(result).toEqual({ data: 'test-value' });
    });

    it('should return undefined for non-existent keys', () => {
      const result = quranCacheService.get('non-existent');

      expect(result).toBeUndefined();
    });

    it('should delete values', () => {
      quranCacheService.set('test-key', { data: 'test-value' });
      quranCacheService.del('test-key');
      const result = quranCacheService.get('test-key');

      expect(result).toBeUndefined();
    });

    it('should flush all values', () => {
      quranCacheService.set('key1', { data: 'value1' });
      quranCacheService.set('key2', { data: 'value2' });
      
      quranCacheService.flush();
      
      expect(quranCacheService.get('key1')).toBeUndefined();
      expect(quranCacheService.get('key2')).toBeUndefined();
    });

    it('should get or set values', async () => {
      const fetchFn = vi.fn().mockResolvedValue({ data: 'fetched-value' });

      // First call should fetch
      const result1 = await quranCacheService.getOrSet('test-key', fetchFn);
      expect(result1).toEqual({ data: 'fetched-value' });
      expect(fetchFn).toHaveBeenCalledTimes(1);

      // Second call should use cache
      const result2 = await quranCacheService.getOrSet('test-key', fetchFn);
      expect(result2).toEqual({ data: 'fetched-value' });
      expect(fetchFn).toHaveBeenCalledTimes(1); // Still only called once
    });

    it('should return cache statistics', () => {
      quranCacheService.set('key1', { data: 'value1' });
      quranCacheService.get('key1'); // Hit
      quranCacheService.get('key2'); // Miss

      const stats = quranCacheService.getStats();

      expect(stats.keys).toBe(1);
      expect(stats.hits).toBeGreaterThan(0);
      expect(stats.misses).toBeGreaterThan(0);
    });
  });

  describe('getAllCacheStats', () => {
    it('should return stats for all caches', () => {
      const stats = getAllCacheStats();

      expect(stats).toHaveProperty('tafsir');
      expect(stats).toHaveProperty('hadith');
      expect(stats).toHaveProperty('quran');
      expect(stats).toHaveProperty('recitation');
    });
  });

  describe('clearAllCaches', () => {
    it('should clear all caches', () => {
      quranCacheService.set('test', { data: 'value' });
      
      clearAllCaches();
      
      expect(quranCacheService.get('test')).toBeUndefined();
    });
  });
});

