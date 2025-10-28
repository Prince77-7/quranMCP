# Quran MCP Server 🕌

A comprehensive **Model Context Protocol (MCP)** server providing AI assistants with access to Islamic resources including the Quran, Tafsir, Hadith, and recitations.

## 🌟 Features

### 📖 Quran Access
- **Arabic Text**: Original Quranic text in Arabic
- **Multiple Translations**: English translations from renowned scholars (Asad, Sahih International, Pickthall, Yusuf Ali, Hilali & Khan)
- **Full Surah Retrieval**: Get complete chapters with or without translations
- **Random Verse**: Daily inspiration feature

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

## 🚀 Installation

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn

### Setup

1. **Clone or download this repository**

2. **Install dependencies**:
```bash
npm install
```

3. **Build the project**:
```bash
npm run build
```

## 📋 Usage

### With Claude Desktop

Add this configuration to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "quran": {
      "command": "node",
      "args": [
        "/ABSOLUTE/PATH/TO/quranMCP/dist/index.js"
      ]
    }
  }
}
```

Replace `/ABSOLUTE/PATH/TO/quranMCP` with the actual path to this project.

### Standalone Usage

Run the server directly:
```bash
npm start
```

Or use the MCP Inspector for testing:
```bash
npm run inspector
```

## 🛠️ Available Tools

### Quran Tools

#### `get_quran_verse`
Get a verse with Arabic text and translation.
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

## 📚 Example Queries for Claude

Once configured, you can ask Claude:

- "Show me Ayat al-Kursi (verse 2:255) with translation and tafsir"
- "Get me a random verse from the Quran for today"
- "What does Surah Al-Fatiha say?"
- "Show me hadith number 1 from Sahih Bukhari"
- "Give me a random hadith about prayer"
- "Get the audio recitation URL for Surah Yasin"
- "List all available Quran translations"
- "What is the information about Surah Al-Baqarah?"

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

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- Additional Tafsir sources
- More Hadith collections
- Additional translations
- Search functionality
- Thematic indexing
- Juz/Hizb navigation

## 📄 License

MIT License - feel free to use this in your projects!

## 🙏 Acknowledgments

- All the scholars and organizations who made these Islamic resources freely available
- The Model Context Protocol team at Anthropic
- The open-source community

## 📞 Support

For issues, questions, or suggestions, please open an issue on the repository.

---

**Made with ❤️ for the Muslim community and AI enthusiasts**

