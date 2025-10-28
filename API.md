# API Reference - Quran MCP Server

Complete reference for all available tools and their parameters.

## Table of Contents

- [Quran Tools](#quran-tools)
- [Tafsir Tools](#tafsir-tools)
- [Hadith Tools](#hadith-tools)
- [Recitation Tools](#recitation-tools)
- [Information Tools](#information-tools)
- [Utility Tools](#utility-tools)
- [Error Codes](#error-codes)

---

## Quran Tools

### `get_quran_verse`

Get a specific Quran verse with Arabic text and translation.

**Parameters:**
- `surah` (number, required): Surah number (1-114)
- `ayah` (number, required): Ayah (verse) number within the surah
- `translation` (string, optional): Translation identifier (default: "en.asad")

**Available Translations:**
- `en.asad` - Muhammad Asad
- `en.sahih` - Sahih International
- `en.pickthall` - Pickthall
- `en.yusufali` - Yusuf Ali
- `en.hilali` - Hilali & Khan

**Returns:**
```typescript
{
  arabic: {
    surah: number,
    ayah: number,
    text: string
  },
  translation: {
    surah: number,
    ayah: number,
    text: string,
    translation: string
  }
}
```

**Example:**
```json
{
  "surah": 1,
  "ayah": 1,
  "translation": "en.asad"
}
```

---

### `get_full_surah`

Get all verses of a complete Surah (chapter).

**Parameters:**
- `surah` (number, required): Surah number (1-114)
- `include_translation` (boolean, optional): Include translation (default: false)
- `translation` (string, optional): Translation identifier (default: "en.asad")

**Returns:**
```typescript
Array<{
  surah: number,
  ayah: number,
  text: string,
  translation?: string
}>
```

**Example:**
```json
{
  "surah": 1,
  "include_translation": true,
  "translation": "en.sahih"
}
```

---

### `get_random_verse`

Get a random verse from the Quran for daily inspiration.

**Parameters:**
- `include_translation` (boolean, optional): Include translation (default: true)
- `translation` (string, optional): Translation identifier (default: "en.asad")

**Returns:**
```typescript
{
  arabic: {
    surah: number,
    ayah: number,
    text: string
  },
  translation?: {
    surah: number,
    ayah: number,
    text: string,
    translation: string
  },
  surahInfo: {
    number: number,
    name: string,
    ayahs: number,
    type: string
  }
}
```

**Example:**
```json
{
  "include_translation": true,
  "translation": "en.asad"
}
```

---

## Tafsir Tools

### `get_tafsir`

Get Tafsir (commentary/explanation) for a specific verse.

**Parameters:**
- `surah` (number, required): Surah number (1-114)
- `ayah` (number, required): Ayah number
- `tafsir` (string, optional): Tafsir source identifier (default: "en-tafisr-ibn-kathir")

**Available Tafsir Sources:**
- `en-tafisr-ibn-kathir` - Tafsir Ibn Kathir (English)
- `en-tafsir-maarif-ul-quran` - Maarif-ul-Quran (English)
- `ar-tafsir-al-tabari` - Tafsir al-Tabari (Arabic)
- `ar-tafsir-al-qurtubi` - Tafsir al-Qurtubi (Arabic)
- `ar-tafsir-ibn-kathir` - Tafsir Ibn Kathir (Arabic)

**Returns:**
```typescript
{
  surah: number,
  ayah: number,
  text: string,
  tafsir_name: string,
  language: string
}
```

**Example:**
```json
{
  "surah": 2,
  "ayah": 255,
  "tafsir": "en-tafisr-ibn-kathir"
}
```

---

### `list_tafsir_sources`

List all available Tafsir sources.

**Parameters:** None

**Returns:**
```typescript
Array<{
  slug: string,
  name: string,
  language: string,
  author: string
}>
```

---

## Hadith Tools

### `get_hadith`

Get a specific Hadith from a collection.

**Parameters:**
- `collection` (string, required): Hadith collection identifier
- `hadith_number` (number, required): Hadith number within the collection

**Available Collections:**
- `bukhari` - Sahih Bukhari (7,563 hadiths)
- `muslim` - Sahih Muslim (7,563 hadiths)
- `abudawud` - Sunan Abu Dawud (5,274 hadiths)
- `tirmidhi` - Jami' at-Tirmidhi (3,956 hadiths)
- `nasai` - Sunan an-Nasa'i (5,758 hadiths)
- `ibnmajah` - Sunan Ibn Majah (4,341 hadiths)

**Returns:**
```typescript
{
  hadithNumber: number,
  collection: string,
  book?: string,
  chapter?: string,
  text: string,
  grade?: string,
  narrator?: string
}
```

**Example:**
```json
{
  "collection": "bukhari",
  "hadith_number": 1
}
```

---

### `get_random_hadith`

Get a random Hadith from a collection.

**Parameters:**
- `collection` (string, optional): Hadith collection identifier (random if not specified)

**Returns:** Same as `get_hadith`

**Example:**
```json
{
  "collection": "muslim"
}
```

---

### `list_hadith_collections`

List all available Hadith collections.

**Parameters:** None

**Returns:**
```typescript
Array<{
  slug: string,
  name: string,
  totalHadiths: number
}>
```

---

## Recitation Tools

### `get_recitation_url`

Get audio recitation URL for a specific verse.

**Parameters:**
- `surah` (number, required): Surah number (1-114)
- `ayah` (number, required): Ayah number
- `reciter` (string, optional): Reciter identifier (default: "Maher_AlMuaiqly_64kbps")

**Available Reciters:**
- `Maher_AlMuaiqly_64kbps` - Maher Al-Muaiqly (64kbps)
- `Abdul_Basit_Murattal_192kbps` - Abdul Basit (192kbps)
- `Abdurrahmaan_As-Sudais_192kbps` - Abdurrahman As-Sudais (192kbps)
- `Mishary_Rashid_Alafasy_128kbps` - Mishary Rashid Alafasy (128kbps)
- `Husary_128kbps` - Mahmoud Khalil Al-Hussary (128kbps)

**Returns:**
```typescript
{
  surah: number,
  ayah: number,
  reciter: string,
  url: string,
  format: string
}
```

**Example:**
```json
{
  "surah": 1,
  "ayah": 1,
  "reciter": "Abdul_Basit_Murattal_192kbps"
}
```

---

### `list_reciters`

List all available Quran reciters.

**Parameters:** None

**Returns:**
```typescript
Array<{
  slug: string,
  name: string,
  bitrate: string
}>
```

---

## Information Tools

### `get_surah_info`

Get information about a specific Surah.

**Parameters:**
- `surah` (number, required): Surah number (1-114)

**Returns:**
```typescript
{
  number: number,
  name: string,
  ayahs: number,
  type: string  // "Meccan" or "Medinan"
}
```

**Example:**
```json
{
  "surah": 2
}
```

---

### `list_surahs`

List all 114 Surahs of the Quran.

**Parameters:** None

**Returns:**
```typescript
Array<{
  number: number,
  name: string,
  ayahs: number,
  type: string
}>
```

---

### `list_translations`

List all available Quran translations.

**Parameters:** None

**Returns:**
```typescript
Array<{
  slug: string,
  name: string,
  language: string
}>
```

---

## Utility Tools

### `get_cache_stats`

Get cache statistics for monitoring server performance.

**Parameters:** None

**Returns:**
```typescript
{
  tafsir: {
    keys: number,
    hits: number,
    misses: number,
    ksize: number,
    vsize: number
  },
  hadith: { /* same structure */ },
  quran: { /* same structure */ },
  recitation: { /* same structure */ }
}
```

---

## Error Codes

The server returns structured errors with the following codes:

### Validation Errors

- `INVALID_SURAH`: Surah number out of range (must be 1-114)
- `INVALID_AYAH`: Ayah number out of range for the specified Surah
- `INVALID_RANGE`: Invalid range specified (start > end)
- `INVALID_TRANSLATION`: Unknown translation identifier
- `INVALID_TAFSIR_SOURCE`: Unknown Tafsir source identifier
- `INVALID_COLLECTION`: Unknown Hadith collection
- `INVALID_HADITH_NUMBER`: Hadith number out of range for collection
- `INVALID_RECITER`: Unknown reciter identifier

### API Errors

- `TIMEOUT_ERROR`: Request timeout (default: 10 seconds)
- `HTTP_ERROR`: HTTP error from external API
- `FETCH_ERROR`: Failed to fetch data after retries
- `JSON_PARSE_ERROR`: Failed to parse JSON response
- `INVALID_API_RESPONSE`: API returned invalid data

### Resource Errors

- `QURAN_FETCH_ERROR`: Failed to fetch Quran text
- `TRANSLATION_FETCH_ERROR`: Failed to fetch translation
- `TAFSIR_FETCH_ERROR`: Failed to fetch Tafsir
- `HADITH_FETCH_ERROR`: Failed to fetch Hadith
- `SURAH_INFO_NOT_FOUND`: Surah information not found
- `RANDOM_VERSE_ERROR`: Failed to get random verse

### Server Errors

- `UNKNOWN_TOOL`: Tool name not recognized
- `INTERNAL_ERROR`: Unexpected server error

---

## Rate Limiting & Caching

The server implements intelligent caching to minimize API calls:

- **Quran Text**: Cached for 24 hours
- **Translations**: Cached for 24 hours
- **Tafsir**: Cached for 2 hours
- **Hadith**: Cached for 2 hours
- **Recitation URLs**: Cached for 24 hours

Cache is automatically managed with LRU eviction when the maximum of 10,000 keys is reached.

---

## Response Times

Typical response times:

- **Cached Data**: < 1ms
- **First Fetch**: 100-500ms (depends on external API)
- **With Retry**: Up to 3 seconds (if retries needed)

---

## Best Practices

1. **Use Caching**: Frequently accessed verses are cached automatically
2. **Batch Requests**: When possible, request full Surahs instead of individual verses
3. **Handle Errors**: Always check for error responses and handle gracefully
4. **Validate Input**: Ensure Surah and Ayah numbers are valid before calling
5. **Choose Appropriate Translation**: Different translations suit different purposes
6. **Monitor Cache**: Use `get_cache_stats` to monitor performance

---

## Data Sources

All data is fetched from trusted Islamic resources:

- **Tafsir**: [spa5k/tafsir_api](https://github.com/spa5k/tafsir_api)
- **Hadith**: [fawazahmed0/hadith-api](https://github.com/fawazahmed0/hadith-api)
- **Quran Arabic**: [fawazahmed0/quran-api](https://github.com/fawazahmed0/quran-api)
- **Translations**: [AlQuran Cloud API](https://alquran.cloud/api)
- **Recitations**: [EveryAyah.com](https://everyayah.com)

