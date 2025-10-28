# Quran MCP Server - HTTP/SSE API Documentation

## 🌐 Deployed Server

**Production URL:** https://quran-mcp-server.corpimco.workers.dev

The Quran MCP Server is now available as a **streamable HTTP/SSE server** deployed on Cloudflare Workers, making it universally accessible to any AI agent or application that can make HTTP requests.

---

## 📡 Available Endpoints

### 1. **GET /** - Server Information
Returns server metadata and available endpoints.

```bash
curl https://quran-mcp-server.corpimco.workers.dev/
```

**Response:**
```json
{
  "name": "Quran MCP Server",
  "version": "2.0.0",
  "description": "Streamable HTTP/SSE server for Islamic resources",
  "transport": "http+sse",
  "endpoints": {
    "/": "Server information",
    "/health": "Health check",
    "/tools": "List all available tools",
    "/sse": "SSE streaming endpoint",
    "/api/call": "POST - Call a tool"
  }
}
```

---

### 2. **GET /health** - Health Check
Simple health check endpoint.

```bash
curl https://quran-mcp-server.corpimco.workers.dev/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-28T02:10:00.000Z"
}
```

---

### 3. **GET /tools** - List All Tools
Returns all 18 available tools with their schemas.

```bash
curl https://quran-mcp-server.corpimco.workers.dev/tools
```

**Response:**
```json
{
  "tools": [
    {
      "name": "get_quran_verse",
      "description": "Get a Quran verse with Arabic text and English translation",
      "inputSchema": { ... }
    },
    {
      "name": "search_quran",
      "description": "Search the Quran by keywords or phrases",
      "inputSchema": { ... }
    },
    ...
  ]
}
```

---

### 4. **POST /api/call** - Execute a Tool (REST API)
Call any tool with JSON body. Returns the result immediately.

**Request Format:**
```json
{
  "tool": "tool_name",
  "arguments": {
    "param1": "value1",
    "param2": "value2"
  }
}
```

**Example 1: Get a Quran Verse**
```bash
curl -X POST https://quran-mcp-server.corpimco.workers.dev/api/call \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "get_quran_verse",
    "arguments": {
      "surah": 1,
      "ayah": 1
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "arabic": {
      "surah": 1,
      "ayah": 1,
      "text": "بِسۡمِ اِ۬للَّهِ اِ۬لرَّحۡمَٰنِ اِ۬لرَّحِيمِ"
    },
    "translation": {
      "surah": 1,
      "ayah": 1,
      "text": "In the name of God, The Most Gracious, The Dispenser of Grace:",
      "translation": "Muhammad Asad"
    }
  }
}
```

**Example 2: Search Quran**
```bash
curl -X POST https://quran-mcp-server.corpimco.workers.dev/api/call \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "search_quran",
    "arguments": {
      "query": "patience",
      "max_results": 5
    }
  }'
```

**Example 3: Get Hadith**
```bash
curl -X POST https://quran-mcp-server.corpimco.workers.dev/api/call \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "get_hadith",
    "arguments": {
      "collection": "bukhari",
      "hadith_number": 1
    }
  }'
```

**Example 4: Search Hadith**
```bash
curl -X POST https://quran-mcp-server.corpimco.workers.dev/api/call \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "search_hadith",
    "arguments": {
      "query": "prayer",
      "max_results": 5
    }
  }'
```

---

### 5. **GET /sse** - Server-Sent Events Stream
Opens a persistent SSE connection for real-time streaming. Includes heartbeat every 30 seconds.

```bash
curl -N https://quran-mcp-server.corpimco.workers.dev/sse
```

**Response Stream:**
```
data: {"type":"connected","message":"SSE connection established"}

data: {"type":"heartbeat","timestamp":"2025-10-28T02:10:00.000Z"}

data: {"type":"heartbeat","timestamp":"2025-10-28T02:10:30.000Z"}
```

---

### 6. **POST /sse/call** - Execute Tool with Streaming
Call a tool with optional streaming response via SSE.

**Request Format:**
```json
{
  "tool": "tool_name",
  "arguments": { ... },
  "stream": true
}
```

**Example:**
```bash
curl -X POST https://quran-mcp-server.corpimco.workers.dev/sse/call \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "search_quran",
    "arguments": {
      "query": "mercy",
      "max_results": 3
    },
    "stream": true
  }'
```

---

## 🛠️ All 18 Available Tools

### Quran Access Tools
1. **get_quran_verse** - Get a specific verse with Arabic and translation
2. **get_full_surah** - Get all verses of a complete Surah
3. **get_random_verse** - Get a random verse for daily inspiration
4. **get_surah_info** - Get information about a Surah
5. **list_surahs** - List all 114 Surahs
6. **list_translations** - List all available translations

### Search Tools (Most Powerful!)
7. **search_quran** - Search Quran by keywords/phrases
8. **search_hadith** - Search Hadith collections by keywords
9. **search_quran_by_topic** - Search Quran by predefined topics
10. **search_hadith_by_topic** - Search Hadith by predefined topics

### Hadith Tools
11. **get_hadith** - Get a specific Hadith
12. **get_random_hadith** - Get a random Hadith
13. **list_hadith_collections** - List all Hadith collections

### Tafsir Tools
14. **get_tafsir** - Get Tafsir (commentary) for a verse
15. **list_tafsir_sources** - List all Tafsir sources

### Audio Recitation Tools
16. **get_recitation_url** - Get audio URL for verse recitation
17. **list_reciters** - List all available reciters

### System Tools
18. **get_cache_stats** - Get cache statistics

---

## 🔌 Integration Examples

### JavaScript/TypeScript
```typescript
async function searchQuran(query: string) {
  const response = await fetch('https://quran-mcp-server.corpimco.workers.dev/api/call', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tool: 'search_quran',
      arguments: { query, max_results: 10 }
    })
  });
  
  const result = await response.json();
  return result.data;
}
```

### Python
```python
import requests

def search_quran(query: str):
    response = requests.post(
        'https://quran-mcp-server.corpimco.workers.dev/api/call',
        json={
            'tool': 'search_quran',
            'arguments': {'query': query, 'max_results': 10}
        }
    )
    return response.json()['data']
```

### cURL
```bash
# Simple verse lookup
curl -X POST https://quran-mcp-server.corpimco.workers.dev/api/call \
  -H "Content-Type: application/json" \
  -d '{"tool":"get_quran_verse","arguments":{"surah":2,"ayah":255}}'

# Search for verses about patience
curl -X POST https://quran-mcp-server.corpimco.workers.dev/api/call \
  -H "Content-Type: application/json" \
  -d '{"tool":"search_quran","arguments":{"query":"patience","max_results":5}}'
```

---

## 🤖 Using with AI Agents

### Claude Desktop / Any MCP Client
Add this to your MCP configuration:

```json
{
  "mcpServers": {
    "quran-http": {
      "url": "https://quran-mcp-server.corpimco.workers.dev",
      "transport": "http"
    }
  }
}
```

### Custom AI Agent Integration
Your AI agent can now make HTTP POST requests to call any tool:

```
POST https://quran-mcp-server.corpimco.workers.dev/api/call
Content-Type: application/json

{
  "tool": "search_quran",
  "arguments": {
    "query": "user's search query here",
    "max_results": 10
  }
}
```

---

## ✅ NPM Version Still Works!

The **stdio/NPM version** continues to work perfectly for local MCP clients:

```bash
# Install
npm install -g @quranmcp/server

# Run
npx @quranmcp/server
```

**Both versions use the same shared codebase**, so all 18 tools work identically in both HTTP and stdio transports!

---

## 🚀 Deployment Details

- **Platform:** Cloudflare Workers (Free Tier)
- **Account:** corpimco@pm.me
- **URL:** https://quran-mcp-server.corpimco.workers.dev
- **Transport:** HTTP + Server-Sent Events (SSE)
- **CORS:** Enabled for all origins
- **Caching:** In-memory with lazy initialization

---

## 📝 Error Handling

All endpoints return consistent error format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

Common error codes:
- `INVALID_REQUEST` - Missing or invalid parameters
- `TOOL_NOT_FOUND` - Unknown tool name
- `API_ERROR` - External API failure
- `INTERNAL_ERROR` - Server error

---

## 🎯 Next Steps

1. ✅ **HTTP/SSE server deployed** - https://quran-mcp-server.corpimco.workers.dev
2. ✅ **NPM version still works** - `npx @quranmcp/server`
3. ✅ **All 18 tools functional** in both transports
4. ✅ **Universal compatibility** - Works with any AI agent

**Ready to use!** 🎉

