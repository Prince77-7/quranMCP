# Changelog

All notable changes to the Quran MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-28

### 🎉 Initial Release

The first production-ready release of the Quran MCP Server - a comprehensive Model Context Protocol server for Islamic resources.

### ✨ Added

#### Core Features
- **MCP Server Implementation**: Full Model Context Protocol server using @modelcontextprotocol/sdk
- **14 Tools**: Complete set of tools for accessing Islamic resources
- **TypeScript**: Strict TypeScript implementation for type safety
- **Caching**: Intelligent LRU caching with TTL for optimal performance
- **Error Handling**: Comprehensive error handling with meaningful error codes

#### Quran Tools
- `get_quran_verse`: Retrieve verses with Arabic text and translation
- `get_full_surah`: Get complete Surahs with optional translations
- `get_random_verse`: Daily inspiration feature
- **5 Translations**: Muhammad Asad, Sahih International, Pickthall, Yusuf Ali, Hilali & Khan
- **114 Surahs**: Complete Quran with 6,236 verses

#### Tafsir Tools
- `get_tafsir`: Access scholarly commentary for verses
- `list_tafsir_sources`: List available Tafsir collections
- **5 Tafsir Sources**: Ibn Kathir (EN/AR), Maarif-ul-Quran, Al-Tabari, Al-Qurtubi
- **Multiple Languages**: English and Arabic Tafsir

#### Hadith Tools
- `get_hadith`: Retrieve specific hadiths from collections
- `get_random_hadith`: Random hadith feature
- `list_hadith_collections`: List available collections
- **6 Major Collections**: Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah
- **30,000+ Hadiths**: Complete authentic hadith collections

#### Recitation Tools
- `get_recitation_url`: Get audio URLs for verse recitations
- `list_reciters`: List available reciters
- **5 Renowned Reciters**: Maher Al-Muaiqly, Abdul Basit, As-Sudais, Alafasy, Al-Hussary
- **Multiple Bitrates**: 64kbps to 192kbps options

#### Information Tools
- `get_surah_info`: Get metadata about Surahs
- `list_surahs`: List all 114 Surahs
- `list_translations`: List available translations
- `get_cache_stats`: Monitor server performance

#### Services
- **Cache Service**: In-memory LRU cache with configurable TTL
  - Quran text: 24-hour cache
  - Translations: 24-hour cache
  - Tafsir: 2-hour cache
  - Hadith: 2-hour cache
  - Recitations: 24-hour cache
- **Fetcher Service**: HTTP client with retry logic and timeout protection
  - Exponential backoff retry strategy
  - 10-second timeout default
  - 3 retry attempts

#### Data Sources
- **Tafsir API**: spa5k/tafsir_api via jsDelivr CDN
- **Hadith API**: fawazahmed0/hadith-api via jsDelivr CDN
- **Quran Arabic**: fawazahmed0/quran-api via jsDelivr CDN
- **Translations**: AlQuran Cloud REST API
- **Recitations**: EveryAyah.com audio files

#### Documentation
- **README.md**: Comprehensive project documentation
- **QUICKSTART.md**: 5-minute setup guide
- **EXAMPLES.md**: Detailed usage examples
- **API.md**: Complete API reference
- **PROJECT_SUMMARY.md**: Technical overview
- **CHANGELOG.md**: This file

#### Development Tools
- **Build System**: TypeScript compiler with strict mode
- **Scripts**: build, dev, start, inspector
- **MCP Inspector**: Interactive testing tool
- **Type Definitions**: Complete TypeScript types

#### Configuration
- **package.json**: Project configuration and dependencies
- **tsconfig.json**: Strict TypeScript configuration
- **.gitignore**: Git ignore rules
- **.env.example**: Environment variable template

### 🏗️ Architecture

- **Modular Design**: Separation of concerns with clear module boundaries
- **Type Safety**: Full TypeScript with strict mode enabled
- **Error Boundaries**: Comprehensive error handling at all levels
- **Validation**: Input validation for all tool parameters
- **Performance**: Intelligent caching and retry strategies

### 📊 Statistics

- **Total Lines of Code**: ~2,500
- **Total Tools**: 14
- **Supported Surahs**: 114
- **Total Verses**: 6,236
- **Translations**: 5
- **Tafsir Sources**: 5
- **Hadith Collections**: 6
- **Total Hadiths**: 30,000+
- **Reciters**: 5

### 🔒 Security

- Read-only operations (no data modification)
- Input validation on all parameters
- No authentication required (public APIs)
- No sensitive data storage
- Rate limiting via caching

### 📝 Notes

This is the initial production release. The server has been designed with extensibility in mind, making it easy to add new features, data sources, and tools in future releases.

### 🙏 Credits

- **MCP Protocol**: Anthropic
- **Islamic Resources**: Various open-source projects and APIs
- **Community**: Muslim developers and scholars who made these resources available

---

## Future Releases

### Planned for v1.1.0
- [ ] Additional Tafsir sources
- [ ] More language translations
- [ ] Search functionality
- [ ] Thematic indexing

### Planned for v1.2.0
- [ ] Juz and Hizb navigation
- [ ] Bookmark system
- [ ] More Hadith collections
- [ ] Performance optimizations

### Planned for v2.0.0
- [ ] Offline mode with local database
- [ ] Full-text search
- [ ] Advanced filtering
- [ ] Custom collections

---

[1.0.0]: https://github.com/yourusername/quran-mcp-server/releases/tag/v1.0.0

