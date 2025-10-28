/**
 * Quran MCP Server for Cloudflare Workers
 * Implements MCP Protocol 2025-03-26 with Streamable HTTP Transport
 *
 * Streamable HTTP Transport:
 * - Single endpoint /mcp for both GET and POST
 * - POST: Send JSON-RPC messages, receive JSON or SSE stream
 * - GET: Open SSE stream for server-initiated messages
 * - Session management with Mcp-Session-Id header (optional)
 *
 * Backward compatible with legacy REST endpoints
 */

import { executeTool } from './shared/tool-executor.js';
import { tools } from './shared/tools-definition.js';

// CORS headers for cross-origin requests
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, Mcp-Session-Id, Last-Event-ID',
  'Access-Control-Max-Age': '86400',
};

// JSON headers
const JSON_HEADERS = {
  'Content-Type': 'application/json',
  ...CORS_HEADERS,
};

// SSE headers (for future use if we implement SSE streaming)
// const SSE_HEADERS = {
//   'Content-Type': 'text/event-stream',
//   'Cache-Control': 'no-cache',
//   'Connection': 'keep-alive',
//   ...CORS_HEADERS,
// };

// JSON-RPC 2.0 types
interface JsonRpcRequest {
  jsonrpc: '2.0';
  id?: string | number | null;
  method: string;
  params?: any;
}

interface JsonRpcResponse {
  jsonrpc: '2.0';
  id: string | number | null;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

// MCP Protocol constants - Updated to 2025-03-26 Streamable HTTP
const MCP_VERSION = '2025-03-26';
const SERVER_INFO = {
  name: 'quran-mcp-server',
  version: '2.0.0',
  protocolVersion: MCP_VERSION,
};

/**
 * Create JSON-RPC 2.0 success response
 */
function createJsonRpcResponse(id: string | number | null, result: any): JsonRpcResponse {
  return {
    jsonrpc: '2.0',
    id,
    result,
  };
}

/**
 * Create JSON-RPC 2.0 error response
 */
function createJsonRpcError(
  id: string | number | null,
  code: number,
  message: string,
  data?: any
): JsonRpcResponse {
  return {
    jsonrpc: '2.0',
    id,
    error: {
      code,
      message,
      data,
    },
  };
}

/**
 * Handle MCP initialize request
 * Per 2025-03-26 spec: Returns server info and capabilities
 */
function handleMcpInitialize(id: string | number | null, _params: any): JsonRpcResponse {
  return createJsonRpcResponse(id, {
    protocolVersion: MCP_VERSION,
    serverInfo: SERVER_INFO,
    capabilities: {
      tools: {},
      logging: {},
    },
  });
}

/**
 * Handle MCP tools/list request
 */
function handleMcpToolsList(id: string | number | null): JsonRpcResponse {
  return createJsonRpcResponse(id, {
    tools: tools,
  });
}

/**
 * Handle MCP tools/call request
 */
async function handleMcpToolsCall(id: string | number | null, params: any): Promise<JsonRpcResponse> {
  try {
    const { name, arguments: args } = params;

    if (!name) {
      return createJsonRpcError(id, -32602, 'Invalid params: missing tool name');
    }

    const result = await executeTool(name, args || {});

    if (result.success) {
      return createJsonRpcResponse(id, {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result.data, null, 2),
          },
        ],
      });
    } else {
      return createJsonRpcError(
        id,
        -32000,
        result.error?.message || 'Tool execution failed',
        result.error
      );
    }
  } catch (error) {
    return createJsonRpcError(
      id,
      -32603,
      'Internal error',
      { message: (error as Error).message }
    );
  }
}

/**
 * Handle MCP JSON-RPC request
 */
async function handleMcpJsonRpc(request: JsonRpcRequest): Promise<JsonRpcResponse> {
  const { method, params } = request;

  // Get the id, preserving undefined vs null vs actual values
  // According to JSON-RPC 2.0: if id is missing, it's a notification (no response needed)
  // But MCP requires responses, so we treat missing id as id: 1
  const id = request.id !== undefined ? request.id : 1;

  // Validate JSON-RPC version
  if (request.jsonrpc !== '2.0') {
    return createJsonRpcError(id, -32600, 'Invalid Request: jsonrpc must be "2.0"');
  }

  // Route to appropriate handler
  switch (method) {
    case 'initialize':
      return handleMcpInitialize(id, params);

    case 'tools/list':
      return handleMcpToolsList(id);

    case 'tools/call':
      return await handleMcpToolsCall(id, params);

    case 'ping':
      return createJsonRpcResponse(id, {});

    default:
      return createJsonRpcError(id, -32601, `Method not found: ${method}`);
  }
}

/**
 * Handle POST /mcp - MCP JSON-RPC endpoint (Streamable HTTP 2025-03-26)
 *
 * Per spec:
 * - Client MUST include Accept header with application/json and text/event-stream
 * - For requests: Server returns either JSON or SSE stream
 * - For notifications/responses: Server returns 202 Accepted
 */
async function handleMcpPost(request: Request): Promise<Response> {
  try {
    const body = await request.json() as JsonRpcRequest | JsonRpcRequest[];

    // Handle batch requests (array of requests)
    if (Array.isArray(body)) {
      // Check if all are notifications/responses (no requests)
      const hasRequests = body.some(msg =>
        msg.method && msg.id !== undefined
      );

      if (!hasRequests) {
        // All notifications/responses - return 202 Accepted
        return new Response(null, {
          status: 202,
          headers: CORS_HEADERS,
        });
      }

      // Has requests - process and return JSON (we don't support SSE for now)
      const responses = await Promise.all(
        body.map(msg => handleMcpJsonRpc(msg))
      );

      return new Response(JSON.stringify(responses), {
        status: 200,
        headers: JSON_HEADERS,
      });
    }

    // Single message
    const message = body as JsonRpcRequest;

    // Check if it's a notification or response (no id or no method)
    if (!message.method || (message.method && message.id === undefined)) {
      // Notification or response - return 202 Accepted
      return new Response(null, {
        status: 202,
        headers: CORS_HEADERS,
      });
    }

    // It's a request - process and return JSON
    const response = await handleMcpJsonRpc(message);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: JSON_HEADERS,
    });

  } catch (error) {
    const errorResponse = createJsonRpcError(
      null,
      -32700,
      'Parse error',
      { message: (error as Error).message }
    );

    return new Response(JSON.stringify(errorResponse), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }
}

/**
 * Handle GET /mcp - Per 2025-03-26 spec: Return 405 Method Not Allowed
 *
 * The 2025-03-26 spec allows GET to open an SSE stream for server-initiated messages,
 * but this is optional. For simplicity, we return 405 to indicate we don't support
 * server-initiated messages via GET.
 *
 * Clients should use POST for all requests.
 */
function handleMcpGet(request: Request): Response {
  // Check if client is requesting SSE stream
  const acceptHeader = request.headers.get('Accept') || '';

  if (acceptHeader.includes('text/event-stream')) {
    // Client wants SSE stream, but we don't support server-initiated messages
    return new Response('Method Not Allowed: Server does not support SSE streams for server-initiated messages', {
      status: 405,
      headers: JSON_HEADERS,
    });
  }

  // Return server info for non-SSE requests
  const info = {
    name: 'Quran MCP Server',
    version: '2.0.0',
    description: 'MCP-compliant JSON-RPC 2.0 server for Islamic resources',
    protocol: 'Model Context Protocol (MCP)',
    protocolVersion: MCP_VERSION,
    transport: 'streamable-http',
    authentication: 'none',
    public: true,
    endpoint: '/mcp',
    methods: ['POST'],
    usage: {
      initialize: 'POST /mcp with {"jsonrpc":"2.0","id":1,"method":"initialize","params":{...}}',
      tools_list: 'POST /mcp with {"jsonrpc":"2.0","id":2,"method":"tools/list"}',
      tools_call: 'POST /mcp with {"jsonrpc":"2.0","id":3,"method":"tools/call","params":{...}}',
    },
    documentation: 'https://github.com/Prince77-7/quranMCP',
    tools_count: tools.length,
  };

  return new Response(JSON.stringify(info, null, 2), {
    status: 200,
    headers: JSON_HEADERS,
  });
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
    description: 'MCP-compliant JSON-RPC 2.0 server for Islamic resources - Quran, Hadith, Tafsir, and Recitations',
    protocol: 'Model Context Protocol (MCP)',
    protocolVersion: MCP_VERSION,
    transport: 'http',
    authentication: 'none',
    public: true,
    endpoints: {
      '/': 'Server information (this page)',
      '/health': 'Health check endpoint',
      '/mcp': 'POST - MCP JSON-RPC 2.0 endpoint (initialize, tools/list, tools/call)',
      '/tools': 'GET - List all available tools (legacy REST)',
      '/api/call': 'POST - Call a tool with JSON body (legacy REST)',
    },
    documentation: 'https://github.com/Prince77-7/quranMCP',
    features: [
      'MCP-compliant JSON-RPC 2.0 protocol',
      'Public access - no authentication required',
      'Search Quran by keywords/phrases',
      'Search Hadith collections',
      'Get Tafsir (commentary)',
      'Audio recitations',
      'Multiple translations',
      'Topic-based search',
    ],
    tools_count: tools.length,
    mcp_compatible: true,
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
      } else if (path === '/mcp') {
        // GET /mcp returns server info or 405 for SSE requests
        return handleMcpGet(request);
      }
    } else if (method === 'POST') {
      if (path === '/mcp') {
        // POST /mcp for MCP JSON-RPC 2.0 protocol
        return handleMcpPost(request);
      } else if (path === '/api/call') {
        // Legacy REST endpoint for backward compatibility
        return handleCallTool(request);
      }
    }

    // 404 Not Found
    return new Response(
      JSON.stringify({
        error: 'Not Found',
        path,
        method,
        hint: 'Use POST /mcp for MCP protocol or see / for documentation'
      }),
      { status: 404, headers: JSON_HEADERS }
    );
  },
};

