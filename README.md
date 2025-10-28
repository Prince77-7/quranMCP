# Quran MCP Server 🕌 - Revolutionary Islamic AI Assistant

[![npm version](https://badge.fury.io/js/%40quranmcp%2Fserver.svg)](https://www.npmjs.com/package/@quranmcp/server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A **revolutionary** Model Context Protocol (MCP) server that gives AI assistants powerful access to Islamic resources. The first MCP server with **intelligent keyword search** for Quran and Hadith - no more needing exact verse numbers!

## ✨ What Makes This Revolutionary?

### 🔍 **Intelligent Search** (NEW!)
- **Search Quran by Keywords**: Find verses about "patience", "prayer", "mercy" without knowing verse numbers
- **Search Hadith by Topics**: Discover hadiths about "charity", "fasting", "manners" instantly
- **Topic-Based Discovery**: AI understands common Islamic topics and finds relevant content
- **Natural Language Queries**: Ask "find verses about patience" and get instant results

### 📖 Comprehensive Quran Access
- **Arabic Text**: Original Quranic text in Arabic
- **Multiple Translations**: English translations from renowned scholars (Asad, Sahih International, Pickthall, Yusuf Ali, Hilali & Khan)
- **Full Surah Retrieval**: Get complete chapters with or without translations
- **Random Verse**: Daily inspiration feature
- **Verse-by-Verse Access**: Traditional reference-based lookup

### 📚 Tafsir (Commentary)
- **Multiple Sources**: Access to various Tafsir collections
  - Tafsir Ibn Kathir (English & Arabic)
  - Maarif-ul-Quran
  - Tafsir al-Tabari (Arabic)
  - Tafsir al-Qurtubi (Arabic)
- **Verse-by-verse Explanations**: Detailed scholarly commentary

### 📜 Hadith Collections
- **Six Major Collections**:
  - Sahih Bukhari (7,563 hadiths)
  - Sahih Muslim (7,563 hadiths)
  - Sunan Abu Dawud (5,274 hadiths)
  - Jami' at-Tirmidhi (3,956 hadiths)
  - Sunan an-Nasa'i (5,758 hadiths)
  - Sunan Ibn Majah (4,341 hadiths)
- **Random Hadith**: Daily hadith feature

### 🎵 Audio Recitations
- **Multiple Reciters**: Choose from renowned Quran reciters
  - Maher Al-Muaiqly
  - Abdul Basit
  - Abdurrahman As-Sudais
  - Mishary Rashid Alafasy
  - Mahmoud Khalil Al-Hussary
- **High-Quality Audio**: MP3 format in various bitrates
- **Playlist Generation**: M3U playlists for full Surahs

### ⚡ Performance Features
- **Intelligent Caching**: LRU cache with TTL to minimize API calls
- **Error Handling**: Comprehensive error handling with meaningful messages
- **Type Safety**: Full TypeScript implementation with strict mode
- **Validation**: Input validation for all parameters

## 🚀 Installation - Just Copy & Paste!

### Step 1: Add to Your AI Agent

**Claude Desktop** - Add this to your config file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "quran": {
      "command": "npx",
      "args": ["@quranmcp/server"]
    }
  }
}
```

### Step 2: Restart Claude

### Step 3: Done! 🎉

Ask: **"Search the Quran for verses about patience"**

---

**Works with any MCP-compatible AI agent** - just use the same JSON configuration!

## 🛠️ Available Tools (18 Total)

### 🔍 NEW! Search Tools (Revolutionary)

#### `search_quran`
**Search the Quran by keywords or phrases** - Find verses without knowing exact references!
```json
{
  "query": "patience",
  "translation": "en.sahih",
  "max_results": 20
}
```

**Example Queries:**
- "patience" - Find all verses about patience
- "those who believe" - Find verses with this phrase
- "prayer" - Discover verses about prayer
- "mercy forgiveness" - Multiple keywords

#### `search_hadith`
**Search Hadith collections by keywords** - Discover hadiths about any topic!
```json
{
  "query": "charity",
  "collections": ["bukhari", "muslim"],
  "max_results": 20
}
```

**Example Queries:**
- "prayer times" - Find hadiths about prayer
- "fasting ramadan" - Hadiths about fasting
- "parents" - Hadiths about treating parents

#### `search_quran_by_topic`
**Search by predefined Islamic topics** - AI-optimized topic search!
```json
{
  "topic": "patience",
  "translation": "en.sahih",
  "max_results": 10
}
```

**Available Topics:** prayer, patience, charity, faith, paradise, hell, prophet, allah, mercy, justice, knowledge, family, death, creation, guidance

#### `search_hadith_by_topic`
**Search Hadith by Islamic topics** - Topic-based hadith discovery!
```json
{
  "topic": "prayer",
  "collections": ["bukhari"],
  "max_results": 10
}
```

**Available Topics:** prayer, fasting, charity, hajj, faith, prophet, companions, knowledge, manners, family, marriage, death, jihad, repentance

### 📖 Quran Tools

#### `get_quran_verse`
Get a specific verse with Arabic text and translation.
```json
{
  "surah": 1,
  "ayah": 1,
  "translation": "en.asad"
}
```

#### `get_full_surah`
Get all verses of a complete Surah.
```json
{
  "surah": 1,
  "include_translation": true,
  "translation": "en.asad"
}
```

#### `get_random_verse`
Get a random verse for daily inspiration.
```json
{
  "include_translation": true,
  "translation": "en.asad"
}
```

### Tafsir Tools

#### `get_tafsir`
Get commentary/explanation for a verse.
```json
{
  "surah": 2,
  "ayah": 255,
  "tafsir": "en-tafisr-ibn-kathir"
}
```

#### `list_tafsir_sources`
List all available Tafsir sources.

### Hadith Tools

#### `get_hadith`
Get a specific Hadith from a collection.
```json
{
  "collection": "bukhari",
  "hadith_number": 1
}
```

#### `get_random_hadith`
Get a random Hadith.
```json
{
  "collection": "bukhari"
}
```

#### `list_hadith_collections`
List all available Hadith collections.

### Recitation Tools

#### `get_recitation_url`
Get audio URL for a verse recitation.
```json
{
  "surah": 1,
  "ayah": 1,
  "reciter": "Maher_AlMuaiqly_64kbps"
}
```

#### `list_reciters`
List all available reciters.

### Information Tools

#### `get_surah_info`
Get information about a Surah.
```json
{
  "surah": 1
}
```

#### `list_surahs`
List all 114 Surahs with their information.

#### `list_translations`
List all available translations.

#### `get_cache_stats`
Get cache statistics for monitoring.

## 💬 Example Queries for AI Assistants

Once configured, you can ask your AI assistant natural language questions:

### 🔍 Search Queries (NEW!)
- **"Find verses about patience in the Quran"**
- **"Search for hadiths about charity"**
- **"Show me Quranic verses about prayer"**
- **"Find hadiths about treating parents"**
- **"What does the Quran say about mercy?"**
- **"Search for verses containing 'those who believe'"**
- **"Find hadiths about fasting in Ramadan"**

### 📖 Traditional Queries
- "Show me Ayat al-Kursi (verse 2:255) with translation and tafsir"
- "Get me a random verse from the Quran for today"
- "What does Surah Al-Fatiha say?"
- "Show me hadith number 1 from Sahih Bukhari"
- "Give me a random hadith"
- "Get the audio recitation URL for Surah Yasin"
- "List all available Quran translations"
- "What is the information about Surah Al-Baqarah?"

### 🎯 AI Understanding
The AI assistant now understands it can:
- Search by keywords instead of requiring exact verse numbers
- Find content by topic without knowing references
- Discover related verses and hadiths through natural language
- Combine search with traditional lookup for comprehensive study

## 🏗️ Architecture

```
quranMCP/
├── src/
│   ├── index.ts              # Main MCP server
│   ├── types/                # TypeScript type definitions
│   │   └── index.ts
│   ├── constants/            # Constants and validation
│   │   └── index.ts
│   ├── services/             # Core services
│   │   ├── cache.ts          # Caching layer
│   │   └── fetcher.ts        # HTTP client
│   └── tools/                # Tool implementations
│       ├── quran.ts          # Quran text & translations
│       ├── tafsir.ts         # Tafsir commentary
│       ├── hadith.ts         # Hadith collections
│       └── recitation.ts     # Audio recitations
├── dist/                     # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Development

### Build
```bash
npm run build
```

### Watch Mode
```bash
npm run dev
```

### Testing with MCP Inspector
```bash
npm run inspector
```

## 📊 Data Sources

This server aggregates data from multiple trusted Islamic resources:

- **Tafsir**: [spa5k/tafsir_api](https://github.com/spa5k/tafsir_api)
- **Hadith**: [fawazahmed0/hadith-api](https://github.com/fawazahmed0/hadith-api)
- **Quran Arabic**: [fawazahmed0/quran-api](https://github.com/fawazahmed0/quran-api)
- **Quran Translations**: [AlQuran Cloud API](https://alquran.cloud/api)
- **Recitations**: [EveryAyah.com](https://everyayah.com)

## 🎯 Why This MCP Server is Revolutionary

### Before This Server:
- ❌ Had to know exact Surah and Ayah numbers
- ❌ Couldn't search by keywords or topics
- ❌ Required manual lookup in external resources
- ❌ Limited to reference-based queries

### With This Server:
- ✅ **Natural language search** - "find verses about patience"
- ✅ **Keyword-based discovery** - Search entire Quran and Hadith collections
- ✅ **Topic-aware AI** - AI understands Islamic topics and finds relevant content
- ✅ **Universal compatibility** - Works with any MCP-compatible AI agent
- ✅ **Zero-install option** - Use with NPX instantly
- ✅ **Intelligent caching** - Fast responses with smart caching
- ✅ **18 powerful tools** - Comprehensive Islamic resource access

### Real-World Impact:
- **Students**: Discover verses and hadiths for research without memorizing references
- **Educators**: Quickly find relevant Islamic texts for teaching
- **Researchers**: Search across multiple sources simultaneously
- **Daily Users**: Get instant answers to Islamic questions
- **Developers**: Build Islamic AI applications with ease

## 🤝 Contributing

Contributions are welcome! This is an open-source project for the Muslim community.

**Priority Areas:**
- Additional Tafsir sources (more languages)
- More Hadith collections
- Additional translations (Urdu, Arabic, French, etc.)
- Enhanced search algorithms
- Thematic indexing improvements
- Juz/Hizb navigation
- Performance optimizations

**How to Contribute:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📦 Package Information

- **NPM Package:** [@quranmcp/server](https://www.npmjs.com/package/@quranmcp/server)
- **Version:** 2.0.0
- **License:** MIT
- **Repository:** [GitHub](https://github.com/Prince77-7/quranMCP)
- **Size:** 34.3 kB (compressed)
- **Node.js:** >= 18.0.0

## 📄 License

MIT License - feel free to use this in your projects!

## 🙏 Acknowledgments

- All the scholars and organizations who made these Islamic resources freely available
- The Model Context Protocol team at Anthropic
- The open-source community

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/Prince77-7/quranMCP/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Prince77-7/quranMCP/discussions)
- **NPM:** [@quranmcp/server](https://www.npmjs.com/package/@quranmcp/server)

## 📚 More Examples

See [EXAMPLES.md](EXAMPLES.md) for detailed usage examples.

---

**Made with ❤️ for the Muslim community and AI enthusiasts**

**Status:** 🟢 Live on NPM | ✅ Ready to Use | 🚀 Revolutionary Search Enabled

