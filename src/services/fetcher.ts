/**
 * HTTP fetcher service for the Quran MCP Server
 * Handles all external API calls with error handling and retries
 */

import { QuranMCPError } from '../types/index.js';

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

const DEFAULT_TIMEOUT = 10000; // 10 seconds
const DEFAULT_RETRIES = 3;

/**
 * Fetch with timeout support
 */
async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const timeout = options.timeout || DEFAULT_TIMEOUT;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': 'Quran-MCP-Server/1.0',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new QuranMCPError(
        `Request timeout after ${timeout}ms`,
        'TIMEOUT_ERROR',
        408
      );
    }
    throw error;
  }
}

/**
 * Fetch with retry logic
 */
async function fetchWithRetry(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const retries = options.retries || DEFAULT_RETRIES;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options);
      
      if (!response.ok) {
        throw new QuranMCPError(
          `HTTP ${response.status}: ${response.statusText}`,
          'HTTP_ERROR',
          response.status
        );
      }

      return response;
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on client errors (4xx)
      if (error instanceof QuranMCPError && error.statusCode && error.statusCode < 500) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      if (attempt < retries - 1) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new QuranMCPError(
    `Failed after ${retries} attempts: ${lastError?.message}`,
    'FETCH_ERROR'
  );
}

/**
 * Fetch JSON data from URL
 */
export async function fetchJSON<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  try {
    const response = await fetchWithRetry(url, options);
    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof QuranMCPError) {
      throw error;
    }
    throw new QuranMCPError(
      `Failed to fetch JSON from ${url}: ${(error as Error).message}`,
      'JSON_PARSE_ERROR'
    );
  }
}

/**
 * Check if URL is accessible (for audio files, etc.)
 */
export async function checkURL(url: string): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(url, {
      method: 'HEAD',
      timeout: 5000,
      retries: 1,
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Build URL with query parameters
 */
export function buildURL(base: string, params: Record<string, string | number>): string {
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });
  return url.toString();
}

