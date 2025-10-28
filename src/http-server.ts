/**
 * Quran MCP HTTP/SSE Server for Cloudflare Workers
 * Provides streamable HTTP server with Server-Sent Events (SSE) support
 * Enables universal MCP compatibility with any AI agent via HTTP
 */

import { executeTool } from './shared/tool-executor.js';
import { tools } from './shared/tools-definition.js';

// CORS headers for cross-origin requests
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// SSE headers for streaming
const SSE_HEADERS = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  ...CORS_HEADERS,
};

// JSON headers
const JSON_HEADERS = {
  'Content-Type': 'application/json',
  ...CORS_HEADERS,
};

/**
 * Send SSE message
 */
function sendSSEMessage(data: any, event?: string): string {
  let message = '';
  if (event) {
    message += `event: ${event}\n`;
  }
  message += `data: ${JSON.stringify(data)}\n\n`;
  return message;
}

/**
 * Handle OPTIONS preflight requests
 */
function handleOptions(): Response {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

/**
 * Handle GET / - Server info and documentation
 */
function handleRoot(): Response {
  const info = {
    name: 'Quran MCP Server',
    version: '2.0.0',
    description: 'Streamable HTTP/SSE server for Islamic resources - Quran, Hadith, Tafsir, and Recitations',
    transport: 'http+sse',
    endpoints: {
      '/': 'Server information (this page)',
      '/health': 'Health check endpoint',
      '/tools': 'List all available tools',
      '/sse': 'SSE endpoint for streaming MCP protocol',
      '/api/call': 'POST - Call a tool with JSON body',
    },
    documentation: 'https://github.com/Prince77-7/quranMCP',
    features: [
      'Search Quran by keywords/phrases',
      'Search Hadith collections',
      'Get Tafsir (commentary)',
      'Audio recitations',
      'Multiple translations',
      'Topic-based search',
    ],
    tools_count: tools.length,
  };

  return new Response(JSON.stringify(info, null, 2), {
    status: 200,
    headers: JSON_HEADERS,
  });
}

/**
 * Handle GET /health - Health check
 */
function handleHealth(): Response {
  return new Response(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }), {
    status: 200,
    headers: JSON_HEADERS,
  });
}

/**
 * Handle GET /tools - List all tools
 */
function handleListTools(): Response {
  return new Response(JSON.stringify({ tools }, null, 2), {
    status: 200,
    headers: JSON_HEADERS,
  });
}

/**
 * Handle POST /api/call - Call a tool
 */
async function handleCallTool(request: Request): Promise<Response> {
  try {
    const body = await request.json() as { tool: string; arguments: any };
    const { tool, arguments: args } = body;

    if (!tool) {
      return new Response(
        JSON.stringify({ error: 'Missing "tool" parameter', code: 'INVALID_REQUEST' }),
        { status: 400, headers: JSON_HEADERS }
      );
    }

    const result = await executeTool(tool, args || {});

    if (result.success) {
      return new Response(
        JSON.stringify({ success: true, data: result.data }),
        { status: 200, headers: JSON_HEADERS }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, error: result.error }),
        { status: 400, headers: JSON_HEADERS }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          message: (error as Error).message,
          code: 'INTERNAL_ERROR',
        },
      }),
      { status: 500, headers: JSON_HEADERS }
    );
  }
}

/**
 * Handle GET /sse - Server-Sent Events endpoint for streaming MCP protocol
 */
function handleSSE(request: Request): Response {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  // Send initial connection message
  writer.write(encoder.encode(sendSSEMessage({
    type: 'connection',
    status: 'connected',
    server: 'Quran MCP Server',
    version: '2.0.0',
    tools_count: tools.length,
  }, 'connection')));

  // Send tools list
  writer.write(encoder.encode(sendSSEMessage({
    type: 'tools',
    tools: tools,
  }, 'tools')));

  // Keep connection alive with heartbeat
  const heartbeatInterval = setInterval(() => {
    writer.write(encoder.encode(sendSSEMessage({
      type: 'heartbeat',
      timestamp: new Date().toISOString(),
    }, 'heartbeat')));
  }, 30000); // Every 30 seconds

  // Handle client disconnect
  request.signal.addEventListener('abort', () => {
    clearInterval(heartbeatInterval);
    writer.close();
  });

  return new Response(readable, {
    status: 200,
    headers: SSE_HEADERS,
  });
}

/**
 * Handle POST /sse/call - Call tool via SSE (for streaming responses)
 */
async function handleSSECall(request: Request): Promise<Response> {
  try {
    const body = await request.json() as { tool: string; arguments: any; stream?: boolean };
    const { tool, arguments: args, stream = true } = body;

    if (!tool) {
      return new Response(
        JSON.stringify({ error: 'Missing "tool" parameter', code: 'INVALID_REQUEST' }),
        { status: 400, headers: JSON_HEADERS }
      );
    }

    // If streaming is requested, use SSE
    if (stream) {
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();
      const encoder = new TextEncoder();

      // Execute tool and stream result
      (async () => {
        try {
          // Send start event
          await writer.write(encoder.encode(sendSSEMessage({
            type: 'start',
            tool,
            timestamp: new Date().toISOString(),
          }, 'start')));

          // Execute tool
          const result = await executeTool(tool, args || {});

          // Send result
          if (result.success) {
            await writer.write(encoder.encode(sendSSEMessage({
              type: 'result',
              success: true,
              data: result.data,
            }, 'result')));
          } else {
            await writer.write(encoder.encode(sendSSEMessage({
              type: 'error',
              success: false,
              error: result.error,
            }, 'error')));
          }

          // Send end event
          await writer.write(encoder.encode(sendSSEMessage({
            type: 'end',
            timestamp: new Date().toISOString(),
          }, 'end')));
        } catch (error) {
          await writer.write(encoder.encode(sendSSEMessage({
            type: 'error',
            error: {
              message: (error as Error).message,
              code: 'INTERNAL_ERROR',
            },
          }, 'error')));
        } finally {
          await writer.close();
        }
      })();

      return new Response(readable, {
        status: 200,
        headers: SSE_HEADERS,
      });
    } else {
      // Non-streaming response
      const result = await executeTool(tool, args || {});
      return new Response(
        JSON.stringify(result),
        { status: result.success ? 200 : 400, headers: JSON_HEADERS }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          message: (error as Error).message,
          code: 'INTERNAL_ERROR',
        },
      }),
      { status: 500, headers: JSON_HEADERS }
    );
  }
}

/**
 * Main request handler for Cloudflare Workers
 */
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Handle OPTIONS preflight
    if (method === 'OPTIONS') {
      return handleOptions();
    }

    // Route requests
    if (method === 'GET') {
      if (path === '/' || path === '') {
        return handleRoot();
      } else if (path === '/health') {
        return handleHealth();
      } else if (path === '/tools') {
        return handleListTools();
      } else if (path === '/sse') {
        return handleSSE(request);
      }
    } else if (method === 'POST') {
      if (path === '/api/call') {
        return handleCallTool(request);
      } else if (path === '/sse/call') {
        return handleSSECall(request);
      }
    }

    // 404 Not Found
    return new Response(
      JSON.stringify({ error: 'Not Found', path, method }),
      { status: 404, headers: JSON_HEADERS }
    );
  },
};

