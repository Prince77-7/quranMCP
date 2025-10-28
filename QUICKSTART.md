# Quick Start Guide - Quran MCP Server

Get up and running with the Quran MCP Server in 5 minutes!

## Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **Claude Desktop**: Latest version (for desktop usage)
- **Terminal**: Basic command line knowledge

## Installation Steps

### 1. Navigate to Project Directory

```bash
cd /path/to/quranMCP
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `node-cache` - In-memory caching
- `zod` - Schema validation

### 3. Build the Project

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

### 4. Test the Server (Optional)

Test that everything works:

```bash
npm run inspector
```

This opens the MCP Inspector where you can test tools interactively.

## Configure Claude Desktop

### macOS Configuration

1. Open the Claude Desktop config file:
```bash
open ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

2. Add the Quran MCP server configuration:
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

**Important**: Replace `/ABSOLUTE/PATH/TO/quranMCP` with your actual path!

To get your absolute path, run this in the project directory:
```bash
pwd
```

### Windows Configuration

1. Open the config file at:
```
%APPDATA%\Claude\claude_desktop_config.json
```

2. Add the same configuration as above, but use Windows-style paths:
```json
{
  "mcpServers": {
    "quran": {
      "command": "node",
      "args": [
        "C:\\Users\\YourName\\path\\to\\quranMCP\\dist\\index.js"
      ]
    }
  }
}
```

### 5. Restart Claude Desktop

After saving the config file, completely quit and restart Claude Desktop.

## Verify Installation

Once Claude Desktop restarts, you should see a small 🔌 icon or indicator showing that the Quran MCP server is connected.

Try asking Claude:

> "Show me the first verse of the Quran with translation"

If everything is working, Claude will use the `get_quran_verse` tool to fetch and display the verse!

## First Queries to Try

### 1. Get a Verse
```
Show me Ayat al-Kursi (verse 2:255) with translation
```

### 2. Get Tafsir
```
What is the tafsir of Surah Al-Fatiha, verse 1?
```

### 3. Get a Hadith
```
Show me the first hadith from Sahih Bukhari
```

### 4. Get Recitation
```
Get me the audio recitation URL for Surah Al-Fatiha
```

### 5. Random Inspiration
```
Give me a random verse from the Quran for today
```

## Troubleshooting

### Server Not Connecting

**Problem**: Claude doesn't show the MCP server connected

**Solutions**:
1. Check that the path in `claude_desktop_config.json` is absolute and correct
2. Verify the build succeeded: check that `dist/index.js` exists
3. Check Claude Desktop logs:
   - macOS: `~/Library/Logs/Claude/`
   - Windows: `%APPDATA%\Claude\logs\`
4. Restart Claude Desktop completely (quit, don't just close window)

### Build Errors

**Problem**: `npm run build` fails

**Solutions**:
1. Ensure Node.js version is 18.0.0 or higher: `node --version`
2. Delete `node_modules` and reinstall: 
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. Check for TypeScript errors in the output

### Tool Execution Errors

**Problem**: Tools return errors when called

**Solutions**:
1. Check your internet connection (APIs require internet access)
2. Verify the parameters are correct (e.g., surah 1-114, valid ayah numbers)
3. Check the error message for specific issues
4. Try the MCP Inspector to test tools directly: `npm run inspector`

### Cache Issues

**Problem**: Getting stale or incorrect data

**Solution**: The cache automatically expires, but you can clear it by restarting the server (restart Claude Desktop).

## Development Mode

For development and testing:

### Watch Mode
Automatically rebuild on file changes:
```bash
npm run dev
```

### MCP Inspector
Interactive tool testing:
```bash
npm run inspector
```

### View Logs
The server logs to stderr, which you can see in Claude Desktop logs or when running in inspector mode.

## Next Steps

1. **Read the Full Documentation**: Check `README.md` for complete feature list
2. **Explore Examples**: See `EXAMPLES.md` for comprehensive usage examples
3. **Customize**: Modify default translations, reciters, etc. in `src/constants/index.ts`
4. **Contribute**: Add new features or improve existing ones

## Common Configuration Examples

### Multiple MCP Servers

You can run multiple MCP servers alongside the Quran server:

```json
{
  "mcpServers": {
    "quran": {
      "command": "node",
      "args": ["/path/to/quranMCP/dist/index.js"]
    },
    "other-server": {
      "command": "node",
      "args": ["/path/to/other-server/index.js"]
    }
  }
}
```

### Custom Server Name

Change "quran" to any name you prefer:

```json
{
  "mcpServers": {
    "islamic-resources": {
      "command": "node",
      "args": ["/path/to/quranMCP/dist/index.js"]
    }
  }
}
```

## Performance Tips

1. **Caching**: The server automatically caches responses. Frequently accessed verses load instantly.

2. **Batch Queries**: When studying multiple verses, ask for them in one query for better performance.

3. **Network**: Ensure stable internet connection for first-time fetches.

## Support

- **Issues**: Check existing issues or create a new one on GitHub
- **Questions**: Refer to `EXAMPLES.md` for usage patterns
- **Updates**: Pull latest changes and rebuild: `git pull && npm install && npm run build`

## Summary

You're now ready to use the Quran MCP Server! The server provides:

✅ Complete Quran text in Arabic  
✅ Multiple English translations  
✅ Scholarly Tafsir (commentary)  
✅ Authentic Hadith collections  
✅ Audio recitations  
✅ Fast caching for instant access  

Enjoy exploring Islamic knowledge with AI assistance! 🕌

