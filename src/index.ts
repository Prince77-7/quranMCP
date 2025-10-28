#!/usr/bin/env node

/**
 * Quran MCP Server - Stdio Transport
 * A comprehensive Model Context Protocol server for Islamic resources
 *
 * Provides access to:
 * - Quran text (Arabic and translations)
 * - Tafsir (Quranic commentary)
 * - Hadith collections
 * - Quran recitations
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
// Import shared modules
import { executeTool } from './shared/tool-executor.js';
import { tools } from './shared/tools-definition.js';

// Create server instance
const server = new Server(
  {
    name: 'quran-mcp-server',
    version: '2.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  const result = await executeTool(name, args);

  if (result.success) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result.data, null, 2),
        },
      ],
    };
  } else {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: result.error?.message,
            code: result.error?.code,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Quran MCP Server running on stdio');
  console.error('Available tools:', tools.length);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

