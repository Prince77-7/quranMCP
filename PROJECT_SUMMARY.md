# Quran MCP Server - Project Summary

## 🎯 Project Overview

The **Quran MCP Server** is a comprehensive, production-ready Model Context Protocol (MCP) server that provides AI assistants with seamless access to Islamic resources. This server enables Claude and other MCP-compatible AI assistants to retrieve Quranic verses, scholarly commentary (Tafsir), authentic Hadith collections, and audio recitations.

## ✨ Key Features

### 1. **Comprehensive Quran Access**
- ✅ Complete Arabic text of all 114 Surahs
- ✅ 5 English translations from renowned scholars
- ✅ Verse-by-verse and full Surah retrieval
- ✅ Random verse feature for daily inspiration
- ✅ Surah metadata (names, revelation type, verse counts)

### 2. **Scholarly Tafsir (Commentary)**
- ✅ 5 Tafsir sources (English and Arabic)
- ✅ Ibn Kathir, Maarif-ul-Quran, Al-Tabari, Al-Qurtubi
- ✅ Verse-by-verse explanations
- ✅ Range queries for studying multiple verses

### 3. **Authentic Hadith Collections**
- ✅ 6 major Hadith collections (30,000+ hadiths)
- ✅ Sahih Bukhari, Sahih Muslim, and 4 Sunan collections
- ✅ Complete metadata (narrator, grade, book, chapter)
- ✅ Random hadith feature

### 4. **Audio Recitations**
- ✅ 5 world-renowned reciters
- ✅ Multiple bitrates (64kbps to 192kbps)
- ✅ Direct MP3 URLs for streaming
- ✅ Playlist generation support

### 5. **Enterprise-Grade Architecture**
- ✅ TypeScript with strict mode for type safety
- ✅ Intelligent LRU caching with TTL
- ✅ Comprehensive error handling
- ✅ Retry logic with exponential backoff
- ✅ Input validation for all parameters
- ✅ Modular, maintainable code structure

## 📊 Technical Specifications

### Technology Stack
- **Language**: TypeScript 5.x (strict mode)
- **Runtime**: Node.js 18+
- **Protocol**: Model Context Protocol (MCP) via stdio
- **SDK**: @modelcontextprotocol/sdk v1.0.4
- **Caching**: node-cache (in-memory LRU)
- **Validation**: Zod v3.23.8

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    MCP Client (Claude)                   │
└────────────────────┬────────────────────────────────────┘
                     │ JSON-RPC 2.0 over stdio
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   MCP Server (index.ts)                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Tool Request Handler                 │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   ┌────────┐  ┌─────────┐  ┌──────────┐
   │ Quran  │  │ Tafsir  │  │  Hadith  │
   │ Tools  │  │  Tools  │  │  Tools   │
   └────┬───┘  └────┬────┘  └────┬─────┘
        │           │            │
        └───────────┼────────────┘
                    ▼
        ┌───────────────────────┐
        │   Cache Service       │
        │   (LRU with TTL)      │
        └───────────┬───────────┘
                    ▼
        ┌───────────────────────┐
        │   Fetcher Service     │
        │   (HTTP with retry)   │
        └───────────┬───────────┘
                    ▼
        ┌───────────────────────┐
        │   External APIs       │
        │   (CDN & REST APIs)   │
        └───────────────────────┘
```

### File Structure

```
quranMCP/
├── src/
│   ├── index.ts                 # Main MCP server (14 tools)
│   ├── types/
│   │   └── index.ts            # TypeScript definitions
│   ├── constants/
│   │   └── index.ts            # Surah info, collections, validation
│   ├── services/
│   │   ├── cache.ts            # LRU caching layer
│   │   └── fetcher.ts          # HTTP client with retry
│   └── tools/
│       ├── quran.ts            # Quran text & translations
│       ├── tafsir.ts           # Tafsir commentary
│       ├── hadith.ts           # Hadith collections
│       └── recitation.ts       # Audio recitations
├── dist/                        # Compiled JavaScript
├── docs/
│   ├── README.md               # Main documentation
│   ├── QUICKSTART.md           # 5-minute setup guide
│   ├── EXAMPLES.md             # Usage examples
│   ├── API.md                  # Complete API reference
│   └── PROJECT_SUMMARY.md      # This file
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript config
├── .gitignore                  # Git ignore rules
└── .env.example                # Environment template
```

## 🛠️ Available Tools (14 Total)

### Quran Tools (3)
1. `get_quran_verse` - Get verse with Arabic + translation
2. `get_full_surah` - Get complete Surah
3. `get_random_verse` - Daily inspiration

### Tafsir Tools (2)
4. `get_tafsir` - Get commentary for a verse
5. `list_tafsir_sources` - List available Tafsir

### Hadith Tools (3)
6. `get_hadith` - Get specific hadith
7. `get_random_hadith` - Random hadith
8. `list_hadith_collections` - List collections

### Recitation Tools (2)
9. `get_recitation_url` - Get audio URL
10. `list_reciters` - List available reciters

### Information Tools (4)
11. `get_surah_info` - Surah metadata
12. `list_surahs` - All 114 Surahs
13. `list_translations` - Available translations
14. `get_cache_stats` - Performance monitoring

## 📈 Performance Characteristics

### Caching Strategy
- **Quran Text**: 24-hour TTL (rarely changes)
- **Translations**: 24-hour TTL
- **Tafsir**: 2-hour TTL
- **Hadith**: 2-hour TTL
- **Recitation URLs**: 24-hour TTL
- **Max Keys**: 10,000 (LRU eviction)

### Response Times
- **Cached**: < 1ms
- **First Fetch**: 100-500ms
- **With Retry**: Up to 3 seconds

### Error Handling
- Automatic retry with exponential backoff
- Timeout protection (10 seconds default)
- Comprehensive error codes
- Graceful degradation

## 🌐 Data Sources

All data is sourced from trusted Islamic resources:

1. **Tafsir API** - [spa5k/tafsir_api](https://github.com/spa5k/tafsir_api)
2. **Hadith API** - [fawazahmed0/hadith-api](https://github.com/fawazahmed0/hadith-api)
3. **Quran API** - [fawazahmed0/quran-api](https://github.com/fawazahmed0/quran-api)
4. **AlQuran Cloud** - [alquran.cloud/api](https://alquran.cloud/api)
5. **EveryAyah** - [everyayah.com](https://everyayah.com)

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Build the project
npm run build

# 3. Configure Claude Desktop
# Add to ~/Library/Application Support/Claude/claude_desktop_config.json:
{
  "mcpServers": {
    "quran": {
      "command": "node",
      "args": ["/absolute/path/to/quranMCP/dist/index.js"]
    }
  }
}

# 4. Restart Claude Desktop

# 5. Test with Claude
# Ask: "Show me the first verse of the Quran"
```

## 📚 Documentation

- **README.md** - Complete feature overview and setup
- **QUICKSTART.md** - 5-minute installation guide
- **EXAMPLES.md** - Comprehensive usage examples
- **API.md** - Full API reference with all parameters
- **PROJECT_SUMMARY.md** - This document

## 🎓 Example Queries

```
1. "Show me Ayat al-Kursi with translation and tafsir"
2. "Give me a random verse from the Quran"
3. "What does Surah Al-Fatiha say?"
4. "Show me hadith number 1 from Sahih Bukhari"
5. "Get the audio recitation of Surah Yasin"
6. "List all available Quran translations"
7. "What is the tafsir of verse 2:255?"
8. "Give me a random hadith about prayer"
```

## 🔒 Security & Reliability

- ✅ No authentication required (public APIs)
- ✅ Read-only operations (no data modification)
- ✅ Input validation on all parameters
- ✅ Rate limiting via caching
- ✅ Error boundaries and graceful failures
- ✅ No sensitive data storage

## 📊 Statistics

- **Total Lines of Code**: ~2,500
- **Total Tools**: 14
- **Supported Surahs**: 114
- **Supported Translations**: 5
- **Tafsir Sources**: 5
- **Hadith Collections**: 6 (30,000+ hadiths)
- **Reciters**: 5
- **Total Verses**: 6,236

## 🎯 Use Cases

1. **Personal Study** - Daily Quran reading with translation and tafsir
2. **Research** - Cross-reference verses, hadiths, and commentary
3. **Teaching** - Prepare lessons with authentic sources
4. **Memorization** - Access audio recitations for memorization
5. **Daily Inspiration** - Random verse and hadith features
6. **Comparative Study** - Compare different translations and tafsir

## 🔮 Future Enhancements

Potential areas for expansion:
- [ ] Additional Tafsir sources
- [ ] More Hadith collections
- [ ] Additional language translations
- [ ] Full-text search functionality
- [ ] Thematic indexing
- [ ] Juz and Hizb navigation
- [ ] Bookmark and favorites system
- [ ] Offline mode with local database

## 🤝 Contributing

The codebase is designed for easy extension:
- Modular tool structure
- Clear separation of concerns
- Comprehensive type definitions
- Well-documented code
- Consistent error handling

## 📄 License

MIT License - Free for personal and commercial use

## 🙏 Acknowledgments

- Anthropic for the Model Context Protocol
- All Islamic scholars and organizations who made these resources available
- The open-source community

---

**Built with ❤️ for the Muslim community and AI enthusiasts**

*"Read in the name of your Lord who created" - Quran 96:1*

