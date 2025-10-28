/**
 * Shared tools definition for both stdio and HTTP transports
 * Defines all available MCP tools with their schemas
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const tools: Tool[] = [
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
  {
    name: 'search_quran',
    description: 'Search the Quran by keywords or phrases. This powerful tool allows you to find verses containing specific words or concepts without knowing the exact surah and ayah numbers. Perfect for finding verses about specific topics like "patience", "prayer", "mercy", etc. The AI agent can use natural language queries to search through the entire Quran.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query - keywords or phrases to search for in the Quran. Can be single words like "patience" or phrases like "those who believe". Minimum 2 characters.',
        },
        translation: {
          type: 'string',
          description: 'Translation to search in (default: en.sahih). Options: en.asad, en.sahih, en.pickthall, en.yusufali, en.hilali',
          default: 'en.sahih',
        },
        max_results: {
          type: 'number',
          description: 'Maximum number of results to return (default: 20, max: 50)',
          default: 20,
          maximum: 50,
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'search_hadith',
    description: 'Search Hadith collections by keywords or phrases. Find hadiths about specific topics without knowing exact hadith numbers. Search across all major collections (Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasai, Ibn Majah) or specific ones. Perfect for queries like "prayer times", "charity", "manners", etc.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query - keywords or phrases to search for in hadiths. Minimum 2 characters.',
        },
        collections: {
          type: 'array',
          description: 'Specific collections to search in (optional). If not specified, searches all collections. Options: bukhari, muslim, abudawud, tirmidhi, nasai, ibnmajah',
          items: {
            type: 'string',
            enum: ['bukhari', 'muslim', 'abudawud', 'tirmidhi', 'nasai', 'ibnmajah'],
          },
        },
        max_results: {
          type: 'number',
          description: 'Maximum number of results to return (default: 20, max: 50)',
          default: 20,
          maximum: 50,
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'search_quran_by_topic',
    description: 'Search the Quran by common Islamic topics. This tool uses predefined topic mappings to find relevant verses. Topics include: prayer, patience, charity, faith, paradise, hell, prophet, allah, mercy, justice, knowledge, family, death, creation, guidance. The AI understands these topics and can suggest them to users.',
    inputSchema: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'Topic to search for. Common topics: prayer, patience, charity, faith, paradise, hell, prophet, allah, mercy, justice, knowledge, family, death, creation, guidance',
        },
        translation: {
          type: 'string',
          description: 'Translation to search in (default: en.sahih)',
          default: 'en.sahih',
        },
        max_results: {
          type: 'number',
          description: 'Maximum number of results to return (default: 10)',
          default: 10,
        },
      },
      required: ['topic'],
    },
  },
  {
    name: 'search_hadith_by_topic',
    description: 'Search Hadith collections by common Islamic topics. Uses predefined topic mappings for better results. Topics include: prayer, fasting, charity, hajj, faith, prophet, companions, knowledge, manners, family, marriage, death, jihad, repentance. The AI can suggest these topics to users based on their questions.',
    inputSchema: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'Topic to search for. Common topics: prayer, fasting, charity, hajj, faith, prophet, companions, knowledge, manners, family, marriage, death, jihad, repentance',
        },
        collections: {
          type: 'array',
          description: 'Specific collections to search in (optional)',
          items: {
            type: 'string',
            enum: ['bukhari', 'muslim', 'abudawud', 'tirmidhi', 'nasai', 'ibnmajah'],
          },
        },
        max_results: {
          type: 'number',
          description: 'Maximum number of results to return (default: 10)',
          default: 10,
        },
      },
      required: ['topic'],
    },
  },
];

