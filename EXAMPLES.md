# Quran MCP Server - Usage Examples

This document provides comprehensive examples of how to use the Quran MCP Server with Claude or other MCP clients.

## Table of Contents
- [Basic Quran Queries](#basic-quran-queries)
- [Tafsir Queries](#tafsir-queries)
- [Hadith Queries](#hadith-queries)
- [Recitation Queries](#recitation-queries)
- [Advanced Queries](#advanced-queries)

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

