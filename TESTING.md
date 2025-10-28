# Testing Guide - Quran MCP Server

This guide provides comprehensive testing procedures for the Quran MCP Server.

## Table of Contents
- [Quick Test](#quick-test)
- [MCP Inspector Testing](#mcp-inspector-testing)
- [Integration Testing with Claude](#integration-testing-with-claude)
- [Manual API Testing](#manual-api-testing)
- [Performance Testing](#performance-testing)
- [Error Testing](#error-testing)

---

## Quick Test

### 1. Build Verification

```bash
# Clean build
rm -rf dist/
npm run build

# Verify build output
ls -la dist/
# Should see: index.js, index.d.ts, and subdirectories
```

### 2. Server Start Test

```bash
# Start the server
node dist/index.js
```

**Expected Output:**
```
Quran MCP Server running on stdio
Available tools: 14
```

Press `Ctrl+C` to stop.

---

## MCP Inspector Testing

The MCP Inspector provides an interactive UI for testing all tools.

### Start Inspector

```bash
npm run inspector
```

This will:
1. Start the MCP server
2. Open a web interface (usually http://localhost:5173)
3. Show all available tools

### Test Each Tool Category

#### Quran Tools

**Test 1: Get Quran Verse**
```json
{
  "surah": 1,
  "ayah": 1,
  "translation": "en.asad"
}
```
✅ Should return Arabic text and translation

**Test 2: Get Full Surah**
```json
{
  "surah": 1,
  "include_translation": true,
  "translation": "en.sahih"
}
```
✅ Should return all 7 verses of Al-Fatiha

**Test 3: Get Random Verse**
```json
{
  "include_translation": true
}
```
✅ Should return a random verse with surah info

#### Tafsir Tools

**Test 4: Get Tafsir**
```json
{
  "surah": 2,
  "ayah": 255,
  "tafsir": "en-tafisr-ibn-kathir"
}
```
✅ Should return commentary for Ayat al-Kursi

**Test 5: List Tafsir Sources**
```json
{}
```
✅ Should return 5 tafsir sources

#### Hadith Tools

**Test 6: Get Hadith**
```json
{
  "collection": "bukhari",
  "hadith_number": 1
}
```
✅ Should return the first hadith from Bukhari

**Test 7: Get Random Hadith**
```json
{
  "collection": "muslim"
}
```
✅ Should return a random hadith from Muslim

**Test 8: List Hadith Collections**
```json
{}
```
✅ Should return 6 collections

#### Recitation Tools

**Test 9: Get Recitation URL**
```json
{
  "surah": 1,
  "ayah": 1,
  "reciter": "Maher_AlMuaiqly_64kbps"
}
```
✅ Should return MP3 URL

**Test 10: List Reciters**
```json
{}
```
✅ Should return 5 reciters

#### Information Tools

**Test 11: Get Surah Info**
```json
{
  "surah": 2
}
```
✅ Should return Al-Baqarah info (286 verses, Medinan)

**Test 12: List Surahs**
```json
{}
```
✅ Should return all 114 surahs

**Test 13: List Translations**
```json
{}
```
✅ Should return 5 translations

**Test 14: Get Cache Stats**
```json
{}
```
✅ Should return cache statistics

---

## Integration Testing with Claude

### Setup

1. Configure Claude Desktop (see QUICKSTART.md)
2. Restart Claude Desktop
3. Verify connection (look for 🔌 icon)

### Test Scenarios

#### Scenario 1: Basic Verse Retrieval
**Prompt:** "Show me the first verse of the Quran"

**Expected:**
- Claude calls `get_quran_verse` with surah=1, ayah=1
- Returns Arabic text and translation
- Claude formats it nicely

#### Scenario 2: Verse with Commentary
**Prompt:** "Show me verse 2:255 with its tafsir"

**Expected:**
- Claude calls `get_quran_verse` for the verse
- Claude calls `get_tafsir` for commentary
- Returns both verse and explanation

#### Scenario 3: Hadith Retrieval
**Prompt:** "Show me hadith number 1 from Sahih Bukhari"

**Expected:**
- Claude calls `get_hadith` with collection="bukhari", hadith_number=1
- Returns the hadith about intentions

#### Scenario 4: Audio Recitation
**Prompt:** "Get me the audio recitation of Surah Al-Fatiha"

**Expected:**
- Claude calls `get_recitation_url` for each verse
- Returns MP3 URLs

#### Scenario 5: Random Inspiration
**Prompt:** "Give me a random verse and hadith for today"

**Expected:**
- Claude calls `get_random_verse`
- Claude calls `get_random_hadith`
- Returns both

#### Scenario 6: Information Query
**Prompt:** "Tell me about Surah Al-Baqarah"

**Expected:**
- Claude calls `get_surah_info` with surah=2
- Returns name, verse count, revelation type

#### Scenario 7: List Query
**Prompt:** "What translations are available?"

**Expected:**
- Claude calls `list_translations`
- Returns all 5 translations

---

## Manual API Testing

### Using curl (for HTTP transport)

If you implement HTTP transport, test with:

```bash
# Test list tools
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list"
  }'

# Test get verse
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "get_quran_verse",
      "arguments": {
        "surah": 1,
        "ayah": 1,
        "translation": "en.asad"
      }
    }
  }'
```

---

## Performance Testing

### Cache Performance

**Test Cache Hit Rate:**

1. Start server with inspector
2. Call `get_quran_verse` for surah 1, ayah 1
3. Note the response time (should be ~200ms first time)
4. Call the same verse again
5. Note the response time (should be <1ms)
6. Check cache stats with `get_cache_stats`

**Expected Results:**
- First call: 100-500ms (network fetch)
- Subsequent calls: <1ms (cache hit)
- Cache hit rate: Should increase with repeated queries

### Load Testing

**Test Multiple Concurrent Requests:**

```bash
# Get 10 different verses rapidly
for i in {1..10}; do
  echo "Fetching verse $i"
  # Use inspector or Claude to fetch verse 1:$i
done
```

**Expected:**
- All requests should complete successfully
- Cache should store all 10 verses
- Memory usage should remain stable

---

## Error Testing

### Invalid Input Tests

**Test 1: Invalid Surah Number**
```json
{
  "surah": 115,
  "ayah": 1
}
```
❌ Should return `INVALID_SURAH` error

**Test 2: Invalid Ayah Number**
```json
{
  "surah": 1,
  "ayah": 100
}
```
❌ Should return `INVALID_AYAH` error

**Test 3: Invalid Translation**
```json
{
  "surah": 1,
  "ayah": 1,
  "translation": "invalid"
}
```
❌ Should return `INVALID_TRANSLATION` error

**Test 4: Invalid Hadith Collection**
```json
{
  "collection": "invalid",
  "hadith_number": 1
}
```
❌ Should return `INVALID_COLLECTION` error

**Test 5: Invalid Hadith Number**
```json
{
  "collection": "bukhari",
  "hadith_number": 99999
}
```
❌ Should return `INVALID_HADITH_NUMBER` error

### Network Error Tests

**Test Network Timeout:**
1. Disconnect internet
2. Try to fetch a verse not in cache
3. Should return timeout error after 10 seconds

**Test API Unavailability:**
1. Block access to external APIs (firewall/hosts file)
2. Try to fetch data
3. Should return fetch error after retries

---

## Regression Testing

After any code changes, run this checklist:

- [ ] Build succeeds without errors
- [ ] Server starts successfully
- [ ] All 14 tools are listed
- [ ] Can fetch a Quran verse
- [ ] Can fetch Tafsir
- [ ] Can fetch Hadith
- [ ] Can get recitation URL
- [ ] Cache is working (check stats)
- [ ] Error handling works (test invalid input)
- [ ] Claude Desktop integration works

---

## Automated Testing (Future)

For future releases, consider adding:

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

---

## Test Data

### Known Good Test Cases

**Verse Tests:**
- Surah 1, Ayah 1: "Bismillah" - shortest verse
- Surah 2, Ayah 255: "Ayat al-Kursi" - famous verse
- Surah 112: Complete short surah (4 verses)

**Hadith Tests:**
- Bukhari #1: Hadith about intentions
- Muslim #1: First hadith in Muslim collection

**Edge Cases:**
- Surah 1: Shortest surah (7 verses)
- Surah 2: Longest surah (286 verses)
- Surah 114: Last surah (6 verses)

---

## Troubleshooting Test Failures

### Build Fails
- Check Node.js version: `node --version` (need 18+)
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors in output

### Server Won't Start
- Check if port is in use
- Verify dist/index.js exists
- Check for syntax errors in logs

### Tools Return Errors
- Verify internet connection
- Check API endpoints are accessible
- Verify input parameters are valid
- Check cache isn't corrupted (restart server)

### Claude Integration Fails
- Verify config file path is absolute
- Check Claude Desktop logs
- Restart Claude Desktop completely
- Verify server is running (check Activity Monitor/Task Manager)

---

## Test Reporting

When reporting issues, include:

1. **Environment:**
   - OS and version
   - Node.js version
   - npm version

2. **Steps to Reproduce:**
   - Exact commands run
   - Input parameters used

3. **Expected vs Actual:**
   - What you expected to happen
   - What actually happened

4. **Logs:**
   - Server output
   - Error messages
   - Claude Desktop logs (if applicable)

5. **Cache Stats:**
   - Output of `get_cache_stats`

---

**Happy Testing! 🧪**

