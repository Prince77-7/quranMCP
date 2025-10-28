#!/usr/bin/env node

/**
 * Quran MCP Server
 * A comprehensive Model Context Protocol server for Islamic resources
 * 
 * Provides access to:
 * - Quran text (Arabic and translations)
 * - Tafsir (Quranic commentary)
 * - Hadith collections
 * - Quran recitations
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
// Import tools
import { getTafsir, listTafsirSources } from './tools/tafsir.js';
import { getHadith, listHadithCollections, getRandomHadith } from './tools/hadith.js';
import {
  getQuranVerse,
  getFullSurah,
  listTranslations,
  getRandomVerse
} from './tools/quran.js';
import {
  getRecitationURL,
  listReciters
} from './tools/recitation.js';
import { getAllCacheStats } from './services/cache.js';
import { SURAH_INFO, getSurahInfo } from './constants/index.js';
import { QuranMCPError } from './types/index.js';

// Create server instance
const server = new Server(
  {
    name: 'quran-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define all available tools
const tools: Tool[] = [
  {
    name: 'get_quran_verse',
    description: 'Get a Quran verse with both Arabic text and English translation. Returns the specified verse from the Quran.',
    inputSchema: {
      type: 'object',
      properties: {
        surah: {
          type: 'number',
          description: 'Surah number (1-114)',
          minimum: 1,
          maximum: 114,
        },
        ayah: {
          type: 'number',
          description: 'Ayah (verse) number within the surah',
          minimum: 1,
        },
        translation: {
          type: 'string',
          description: 'Translation to use (default: en.asad). Options: en.asad, en.sahih, en.pickthall, en.yusufali, en.hilali',
          default: 'en.asad',
        },
      },
      required: ['surah', 'ayah'],
    },
  },
  {
    name: 'get_tafsir',
    description: 'Get Tafsir (commentary/explanation) for a specific Quran verse. Provides scholarly interpretation and context.',
    inputSchema: {
      type: 'object',
      properties: {
        surah: {
          type: 'number',
          description: 'Surah number (1-114)',
          minimum: 1,
          maximum: 114,
        },
        ayah: {
          type: 'number',
          description: 'Ayah (verse) number',
          minimum: 1,
        },
        tafsir: {
          type: 'string',
          description: 'Tafsir source (default: en-tafisr-ibn-kathir). Use list_tafsir_sources to see all options.',
          default: 'en-tafisr-ibn-kathir',
        },
      },
      required: ['surah', 'ayah'],
    },
  },
  {
    name: 'get_hadith',
    description: 'Get a specific Hadith from a collection. Hadiths are sayings and actions of Prophet Muhammad (peace be upon him).',
    inputSchema: {
      type: 'object',
      properties: {
        collection: {
          type: 'string',
          description: 'Hadith collection name. Options: bukhari, muslim, abudawud, tirmidhi, nasai, ibnmajah',
          enum: ['bukhari', 'muslim', 'abudawud', 'tirmidhi', 'nasai', 'ibnmajah'],
        },
        hadith_number: {
          type: 'number',
          description: 'Hadith number within the collection',
          minimum: 1,
        },
      },
      required: ['collection', 'hadith_number'],
    },
  },
  {
    name: 'get_recitation_url',
    description: 'Get audio recitation URL for a specific Quran verse. Returns MP3 URL for listening to the verse.',
    inputSchema: {
      type: 'object',
      properties: {
        surah: {
          type: 'number',
          description: 'Surah number (1-114)',
          minimum: 1,
          maximum: 114,
        },
        ayah: {
          type: 'number',
          description: 'Ayah (verse) number',
          minimum: 1,
        },
        reciter: {
          type: 'string',
          description: 'Reciter name (default: Maher_AlMuaiqly_64kbps). Use list_reciters to see all options.',
          default: 'Maher_AlMuaiqly_64kbps',
        },
      },
      required: ['surah', 'ayah'],
    },
  },
  {
    name: 'get_full_surah',
    description: 'Get all verses of a complete Surah (chapter). Can include translations.',
    inputSchema: {
      type: 'object',
      properties: {
        surah: {
          type: 'number',
          description: 'Surah number (1-114)',
          minimum: 1,
          maximum: 114,
        },
        include_translation: {
          type: 'boolean',
          description: 'Whether to include English translation (default: false)',
          default: false,
        },
        translation: {
          type: 'string',
          description: 'Translation to use if include_translation is true (default: en.asad)',
          default: 'en.asad',
        },
      },
      required: ['surah'],
    },
  },
  {
    name: 'get_random_verse',
    description: 'Get a random verse from the Quran. Great for daily inspiration!',
    inputSchema: {
      type: 'object',
      properties: {
        include_translation: {
          type: 'boolean',
          description: 'Whether to include English translation (default: true)',
          default: true,
        },
        translation: {
          type: 'string',
          description: 'Translation to use (default: en.asad)',
          default: 'en.asad',
        },
      },
    },
  },
  {
    name: 'get_random_hadith',
    description: 'Get a random Hadith from a collection. Great for daily inspiration!',
    inputSchema: {
      type: 'object',
      properties: {
        collection: {
          type: 'string',
          description: 'Hadith collection (optional). If not specified, picks from any collection.',
          enum: ['bukhari', 'muslim', 'abudawud', 'tirmidhi', 'nasai', 'ibnmajah'],
        },
      },
    },
  },
  {
    name: 'get_surah_info',
    description: 'Get information about a Surah (chapter) including name, number of verses, and revelation type.',
    inputSchema: {
      type: 'object',
      properties: {
        surah: {
          type: 'number',
          description: 'Surah number (1-114)',
          minimum: 1,
          maximum: 114,
        },
      },
      required: ['surah'],
    },
  },
  {
    name: 'list_surahs',
    description: 'List all 114 Surahs of the Quran with their names and basic information.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'list_tafsir_sources',
    description: 'List all available Tafsir (commentary) sources with their languages and authors.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'list_hadith_collections',
    description: 'List all available Hadith collections.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'list_translations',
    description: 'List all available Quran translations.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'list_reciters',
    description: 'List all available Quran reciters for audio recitations.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_cache_stats',
    description: 'Get cache statistics for monitoring server performance.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_quran_verse': {
        const { surah, ayah, translation = 'en.asad' } = args as any;
        const result = await getQuranVerse(surah, ayah, translation);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_tafsir': {
        const { surah, ayah, tafsir = 'en-tafisr-ibn-kathir' } = args as any;
        const result = await getTafsir(surah, ayah, tafsir);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_hadith': {
        const { collection, hadith_number } = args as any;
        const result = await getHadith(collection, hadith_number);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_recitation_url': {
        const { surah, ayah, reciter = 'Maher_AlMuaiqly_64kbps' } = args as any;
        const result = await getRecitationURL(surah, ayah, reciter);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_full_surah': {
        const { surah, include_translation = false, translation = 'en.asad' } = args as any;
        const result = await getFullSurah(surah, include_translation, translation);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_random_verse': {
        const { include_translation = true, translation = 'en.asad' } = args as any;
        const result = await getRandomVerse(include_translation, translation);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_random_hadith': {
        const { collection } = args as any;
        const result = await getRandomHadith(collection);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_surah_info': {
        const { surah } = args as any;
        const result = getSurahInfo(surah);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'list_surahs': {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(SURAH_INFO, null, 2),
            },
          ],
        };
      }

      case 'list_tafsir_sources': {
        const result = listTafsirSources();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'list_hadith_collections': {
        const result = listHadithCollections();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'list_translations': {
        const result = listTranslations();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'list_reciters': {
        const result = listReciters();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_cache_stats': {
        const result = getAllCacheStats();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new QuranMCPError(
          `Unknown tool: ${name}`,
          'UNKNOWN_TOOL'
        );
    }
  } catch (error) {
    if (error instanceof QuranMCPError) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: error.message,
              code: error.code,
            }, null, 2),
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: (error as Error).message,
            code: 'INTERNAL_ERROR',
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('Quran MCP Server running on stdio');
  console.error('Available tools:', tools.length);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

