/**
 * Shared tool executor for both stdio and HTTP transports
 * Contains the core logic for executing MCP tools
 */

import { SURAH_INFO, getSurahInfo } from '../constants/index.js';
import { getAllCacheStats } from '../services/cache.js';
import { getHadith, getRandomHadith, listHadithCollections } from '../tools/hadith.js';
import {
  getFullSurah,
  getQuranVerse,
  getRandomVerse,
  listTranslations
} from '../tools/quran.js';
import {
  getRecitationURL,
  listReciters
} from '../tools/recitation.js';
import {
  searchHadith,
  searchHadithByTopic,
  searchQuran,
  searchQuranByTopic
} from '../tools/search.js';
import { getTafsir, listTafsirSources } from '../tools/tafsir.js';
import { QuranMCPError } from '../types/index.js';

export interface ToolExecutionResult {
  success: boolean;
  data?: any;
  error?: {
    message: string;
    code: string;
  };
}

/**
 * Execute a tool by name with given arguments
 */
export async function executeTool(name: string, args: any): Promise<ToolExecutionResult> {
  try {
    let result: any;

    switch (name) {
      case 'get_quran_verse': {
        const { surah, ayah, translation = 'en.asad' } = args;
        result = await getQuranVerse(surah, ayah, translation);
        break;
      }

      case 'get_tafsir': {
        const { surah, ayah, tafsir = 'en-tafisr-ibn-kathir' } = args;
        result = await getTafsir(surah, ayah, tafsir);
        break;
      }

      case 'get_hadith': {
        const { collection, hadith_number } = args;
        result = await getHadith(collection, hadith_number);
        break;
      }

      case 'get_recitation_url': {
        const { surah, ayah, reciter = 'Maher_AlMuaiqly_64kbps' } = args;
        result = await getRecitationURL(surah, ayah, reciter);
        break;
      }

      case 'get_full_surah': {
        const { surah, include_translation = false, translation = 'en.asad' } = args;
        result = await getFullSurah(surah, include_translation, translation);
        break;
      }

      case 'get_random_verse': {
        const { include_translation = true, translation = 'en.asad' } = args;
        result = await getRandomVerse(include_translation, translation);
        break;
      }

      case 'get_random_hadith': {
        const { collection } = args;
        result = await getRandomHadith(collection);
        break;
      }

      case 'get_surah_info': {
        const { surah } = args;
        result = getSurahInfo(surah);
        break;
      }

      case 'list_surahs': {
        result = SURAH_INFO;
        break;
      }

      case 'list_tafsir_sources': {
        result = listTafsirSources();
        break;
      }

      case 'list_hadith_collections': {
        result = listHadithCollections();
        break;
      }

      case 'list_translations': {
        result = listTranslations();
        break;
      }

      case 'list_reciters': {
        result = listReciters();
        break;
      }

      case 'get_cache_stats': {
        result = getAllCacheStats();
        break;
      }

      case 'search_quran': {
        const { query, translation = 'en.sahih', max_results = 20 } = args;
        result = await searchQuran(query, translation, max_results);
        break;
      }

      case 'search_hadith': {
        const { query, collections, max_results = 20 } = args;
        result = await searchHadith(query, collections, max_results);
        break;
      }

      case 'search_quran_by_topic': {
        const { topic, translation = 'en.sahih', max_results = 10 } = args;
        result = await searchQuranByTopic(topic, translation, max_results);
        break;
      }

      case 'search_hadith_by_topic': {
        const { topic, collections, max_results = 10 } = args;
        result = await searchHadithByTopic(topic, collections, max_results);
        break;
      }

      default:
        throw new QuranMCPError(
          `Unknown tool: ${name}`,
          'UNKNOWN_TOOL'
        );
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    if (error instanceof QuranMCPError) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    return {
      success: false,
      error: {
        message: (error as Error).message,
        code: 'INTERNAL_ERROR',
      },
    };
  }
}

