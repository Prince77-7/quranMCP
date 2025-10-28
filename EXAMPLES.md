# Quran MCP Server - Usage Examples

This document provides comprehensive examples of how to use the Quran MCP Server with Claude or other MCP clients.

## Table of Contents
- [🔍 NEW! Search Queries](#-new-search-queries)
- [Basic Quran Queries](#basic-quran-queries)
- [Tafsir Queries](#tafsir-queries)
- [Hadith Queries](#hadith-queries)
- [Recitation Queries](#recitation-queries)
- [Advanced Queries](#advanced-queries)

## 🔍 NEW! Search Queries

### Search Quran by Keywords

**Query**: "Find verses about patience in the Quran"

**Tool Call**:
```json
{
  "tool": "search_quran",
  "arguments": {
    "query": "patience",
    "translation": "en.sahih",
    "max_results": 10
  }
}
```

**Response**:
```json
[
  {
    "surah": 2,
    "ayah": 153,
    "surahName": "Al-Baqarah",
    "text": "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.",
    "translation": "Sahih International",
    "relevanceScore": 15
  },
  {
    "surah": 3,
    "ayah": 200,
    "surahName": "Ali 'Imran",
    "text": "O you who have believed, persevere and endure and remain stationed and fear Allah that you may be successful.",
    "translation": "Sahih International",
    "relevanceScore": 10
  }
]
```

### Search Quran with Multiple Keywords

**Query**: "Find verses about prayer and patience together"

**Tool Call**:
```json
{
  "tool": "search_quran",
  "arguments": {
    "query": "prayer patience",
    "translation": "en.sahih",
    "max_results": 5
  }
}
```

### Search Quran by Phrase

**Query**: "Find verses containing 'those who believe'"

**Tool Call**:
```json
{
  "tool": "search_quran",
  "arguments": {
    "query": "those who believe",
    "translation": "en.sahih",
    "max_results": 20
  }
}
```

### Search Quran by Topic

**Query**: "Show me verses about mercy"

**Tool Call**:
```json
{
  "tool": "search_quran_by_topic",
  "arguments": {
    "topic": "mercy",
    "translation": "en.sahih",
    "max_results": 10
  }
}
```

**Available Topics:**
- prayer, patience, charity, faith, paradise, hell
- prophet, allah, mercy, justice, knowledge
- family, death, creation, guidance

### Search Hadith by Keywords

**Query**: "Find hadiths about charity"

**Tool Call**:
```json
{
  "tool": "search_hadith",
  "arguments": {
    "query": "charity",
    "collections": ["bukhari", "muslim"],
    "max_results": 10
  }
}
```

**Response**:
```json
[
  {
    "hadithNumber": 1411,
    "collection": "bukhari",
    "collectionName": "Sahih Bukhari",
    "text": "The Prophet said: 'Charity does not decrease wealth...'",
    "book": "Book of Zakat",
    "chapter": "Excellence of Charity",
    "relevanceScore": 20
  }
]
```

### Search Hadith by Topic

**Query**: "Find hadiths about prayer"

**Tool Call**:
```json
{
  "tool": "search_hadith_by_topic",
  "arguments": {
    "topic": "prayer",
    "collections": ["bukhari"],
    "max_results": 10
  }
}
```

**Available Topics:**
- prayer, fasting, charity, hajj, faith
- prophet, companions, knowledge, manners
- family, marriage, death, jihad, repentance

### Search All Hadith Collections

**Query**: "Search for hadiths about parents in all collections"

**Tool Call**:
```json
{
  "tool": "search_hadith",
  "arguments": {
    "query": "parents mother father",
    "max_results": 15
  }
}
```

Note: When `collections` is omitted, it searches all 6 major collections.

## Basic Quran Queries

### Get a Specific Verse

**Query**: "Show me the first verse of the Quran"

**Tool Call**:
```json
{
  "tool": "get_quran_verse",
  "arguments": {
    "surah": 1,
    "ayah": 1,
    "translation": "en.asad"
  }
}
```

**Response**:
```json
{
  "arabic": {
    "surah": 1,
    "ayah": 1,
    "text": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
  },
  "translation": {
    "surah": 1,
    "ayah": 1,
    "text": "In the name of God, The Most Gracious, The Dispenser of Grace:",
    "translation": "Muhammad Asad"
  }
}
```

### Get Ayat al-Kursi (The Throne Verse)

**Query**: "Show me Ayat al-Kursi with translation"

**Tool Call**:
```json
{
  "tool": "get_quran_verse",
  "arguments": {
    "surah": 2,
    "ayah": 255,
    "translation": "en.sahih"
  }
}
```

### Get a Complete Surah

**Query**: "Show me Surah Al-Fatiha with translation"

**Tool Call**:
```json
{
  "tool": "get_full_surah",
  "arguments": {
    "surah": 1,
    "include_translation": true,
    "translation": "en.asad"
  }
}
```

### Get Random Verse for Daily Inspiration

**Query**: "Give me a random verse from the Quran"

**Tool Call**:
```json
{
  "tool": "get_random_verse",
  "arguments": {
    "include_translation": true,
    "translation": "en.asad"
  }
}
```

## Tafsir Queries

### Get Tafsir for a Verse

**Query**: "What is the tafsir of verse 2:255?"

**Tool Call**:
```json
{
  "tool": "get_tafsir",
  "arguments": {
    "surah": 2,
    "ayah": 255,
    "tafsir": "en-tafisr-ibn-kathir"
  }
}
```

### Get Tafsir in Arabic

**Query**: "Show me the Arabic tafsir of Surah Al-Fatiha, verse 1"

**Tool Call**:
```json
{
  "tool": "get_tafsir",
  "arguments": {
    "surah": 1,
    "ayah": 1,
    "tafsir": "ar-tafsir-ibn-kathir"
  }
}
```

### List Available Tafsir Sources

**Query**: "What tafsir sources are available?"

**Tool Call**:
```json
{
  "tool": "list_tafsir_sources",
  "arguments": {}
}
```

## Hadith Queries

### Get a Specific Hadith

**Query**: "Show me the first hadith from Sahih Bukhari"

**Tool Call**:
```json
{
  "tool": "get_hadith",
  "arguments": {
    "collection": "bukhari",
    "hadith_number": 1
  }
}
```

**Response**:
```json
{
  "hadithNumber": 1,
  "collection": "Sahih Bukhari",
  "book": "Book of Revelation",
  "text": "Narrated 'Umar bin Al-Khattab: I heard Allah's Messenger saying, \"The reward of deeds depends upon the intentions...\"",
  "narrator": "Umar bin Al-Khattab"
}
```

### Get Random Hadith

**Query**: "Give me a random hadith from Sahih Muslim"

**Tool Call**:
```json
{
  "tool": "get_random_hadith",
  "arguments": {
    "collection": "muslim"
  }
}
```

### Get Hadith from Different Collections

**Query**: "Show me hadith 100 from Sunan Abu Dawud"

**Tool Call**:
```json
{
  "tool": "get_hadith",
  "arguments": {
    "collection": "abudawud",
    "hadith_number": 100
  }
}
```

## Recitation Queries

### Get Recitation URL for a Verse

**Query**: "Get me the audio recitation of Surah Al-Fatiha, verse 1"

**Tool Call**:
```json
{
  "tool": "get_recitation_url",
  "arguments": {
    "surah": 1,
    "ayah": 1,
    "reciter": "Maher_AlMuaiqly_64kbps"
  }
}
```

**Response**:
```json
{
  "surah": 1,
  "ayah": 1,
  "reciter": "Maher Al-Muaiqly",
  "url": "https://everyayah.com/data/Maher_AlMuaiqly_64kbps/001001.mp3",
  "format": "mp3"
}
```

### Get Recitation with Different Reciter

**Query**: "Get Abdul Basit's recitation of verse 2:255"

**Tool Call**:
```json
{
  "tool": "get_recitation_url",
  "arguments": {
    "surah": 2,
    "ayah": 255,
    "reciter": "Abdul_Basit_Murattal_192kbps"
  }
}
```

### List Available Reciters

**Query**: "Who are the available reciters?"

**Tool Call**:
```json
{
  "tool": "list_reciters",
  "arguments": {}
}
```

## Advanced Queries

### Comprehensive Verse Study

**Query**: "I want to study verse 2:255 in depth. Show me the Arabic text, translation, tafsir, and recitation"

**Multiple Tool Calls**:

1. Get the verse:
```json
{
  "tool": "get_quran_verse",
  "arguments": {
    "surah": 2,
    "ayah": 255,
    "translation": "en.asad"
  }
}
```

2. Get the tafsir:
```json
{
  "tool": "get_tafsir",
  "arguments": {
    "surah": 2,
    "ayah": 255,
    "tafsir": "en-tafisr-ibn-kathir"
  }
}
```

3. Get the recitation:
```json
{
  "tool": "get_recitation_url",
  "arguments": {
    "surah": 2,
    "ayah": 255,
    "reciter": "Maher_AlMuaiqly_64kbps"
  }
}
```

### Get Surah Information

**Query**: "Tell me about Surah Al-Baqarah"

**Tool Call**:
```json
{
  "tool": "get_surah_info",
  "arguments": {
    "surah": 2
  }
}
```

**Response**:
```json
{
  "number": 2,
  "name": "Al-Baqarah",
  "ayahs": 286,
  "type": "Medinan"
}
```

### List All Surahs

**Query**: "List all the Surahs in the Quran"

**Tool Call**:
```json
{
  "tool": "list_surahs",
  "arguments": {}
}
```

### Compare Translations

**Query**: "Show me verse 1:1 in different translations"

**Multiple Tool Calls**:

1. Muhammad Asad:
```json
{
  "tool": "get_quran_verse",
  "arguments": {
    "surah": 1,
    "ayah": 1,
    "translation": "en.asad"
  }
}
```

2. Sahih International:
```json
{
  "tool": "get_quran_verse",
  "arguments": {
    "surah": 1,
    "ayah": 1,
    "translation": "en.sahih"
  }
}
```

3. Pickthall:
```json
{
  "tool": "get_quran_verse",
  "arguments": {
    "surah": 1,
    "ayah": 1,
    "translation": "en.pickthall"
  }
}
```

### Daily Inspiration Routine

**Query**: "Give me a verse and a hadith for today"

**Multiple Tool Calls**:

1. Random verse:
```json
{
  "tool": "get_random_verse",
  "arguments": {
    "include_translation": true,
    "translation": "en.asad"
  }
}
```

2. Random hadith:
```json
{
  "tool": "get_random_hadith",
  "arguments": {}
}
```

## Tips for Best Results

1. **Be Specific**: When asking for verses, use the format "Surah X, Ayah Y" or reference well-known verses by name (e.g., "Ayat al-Kursi")

2. **Explore Options**: Use the `list_*` tools to discover available translations, tafsir sources, reciters, and collections

3. **Combine Tools**: For comprehensive study, combine multiple tools (verse + tafsir + recitation)

4. **Use Defaults**: If you don't specify a translation, tafsir, or reciter, sensible defaults are used

5. **Cache Awareness**: Frequently accessed verses are cached for faster retrieval

## Common Use Cases

### Morning Routine
- Get random verse for reflection
- Get random hadith for daily guidance
- Listen to recitation of a favorite Surah

### Study Session
- Read a Surah with translation
- Study the tafsir verse by verse
- Listen to recitation for proper pronunciation

### Research
- Compare different translations
- Read multiple tafsir sources
- Cross-reference with related hadiths

### Teaching
- Get complete Surahs for lessons
- Access authentic hadith collections
- Provide audio recitations for students

