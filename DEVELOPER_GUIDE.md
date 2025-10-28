# Developer Guide - Quran MCP Server

A comprehensive guide for developers working on the Quran MCP Server.

## 🎯 Modern Development Stack (November 2025)

This project uses the latest and greatest tools in the JavaScript/TypeScript ecosystem:

### Core Technologies
- **TypeScript 5.7+** - Latest TypeScript with strict mode
- **Node.js 20+** - LTS version with modern features
- **ES Modules** - Native ESM support
- **Vitest** - Next-generation testing framework (faster than Jest)
- **ESLint 8** - Latest linting with TypeScript support
- **Prettier 3** - Opinionated code formatting

### Developer Experience
- **VS Code Integration** - Optimized settings and extensions
- **GitHub Actions** - Automated CI/CD pipeline
- **Dependabot** - Automated dependency updates
- **Docker** - Containerization support
- **MCP Inspector** - Interactive tool testing

## 🚀 Quick Start for Developers

### 1. Clone and Setup

```bash
git clone https://github.com/yourusername/quran-mcp-server.git
cd quran-mcp-server
npm install
```

### 2. Development Commands

```bash
# Development with hot reload
npm run dev

# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Lint and fix
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check

# Full validation (lint + type-check + test + build)
npm run validate
```

### 3. VS Code Setup

Install recommended extensions:
- ESLint
- Prettier
- Vitest Explorer
- Error Lens
- GitLens

The project includes `.vscode/settings.json` with optimal configurations.

## 📁 Project Structure

```
quranMCP/
├── .github/                    # GitHub configuration
│   ├── workflows/             # CI/CD pipelines
│   ├── ISSUE_TEMPLATE/        # Issue templates
│   └── dependabot.yml         # Dependency automation
│
├── .vscode/                   # VS Code configuration
│   ├── settings.json          # Editor settings
│   └── extensions.json        # Recommended extensions
│
├── src/                       # Source code
│   ├── index.ts              # Main MCP server
│   ├── types/                # TypeScript types
│   ├── constants/            # Constants and validation
│   ├── services/             # Core services
│   │   ├── cache.ts         # Caching layer
│   │   ├── fetcher.ts       # HTTP client
│   │   └── __tests__/       # Service tests
│   └── tools/                # MCP tools
│       ├── quran.ts         # Quran tools
│       ├── tafsir.ts        # Tafsir tools
│       ├── hadith.ts        # Hadith tools
│       ├── recitation.ts    # Recitation tools
│       └── __tests__/       # Tool tests
│
├── dist/                      # Compiled output
├── coverage/                  # Test coverage reports
│
├── Configuration Files
├── .eslintrc.json            # ESLint configuration
├── .prettierrc.json          # Prettier configuration
├── tsconfig.json             # TypeScript configuration
├── vitest.config.ts          # Vitest configuration
├── Dockerfile                # Docker configuration
├── package.json              # Dependencies and scripts
│
└── Documentation
    ├── README.md             # Main documentation
    ├── API.md                # API reference
    ├── EXAMPLES.md           # Usage examples
    ├── QUICKSTART.md         # Quick start guide
    ├── CONTRIBUTING.md       # Contribution guidelines
    ├── DEVELOPER_GUIDE.md    # This file
    └── TESTING.md            # Testing guide
```

## 🧪 Testing Strategy

### Unit Tests

Located in `__tests__` directories next to source files.

```typescript
// src/tools/__tests__/quran.test.ts
import { describe, it, expect, vi } from 'vitest';
import { getQuranVerse } from '../quran.js';

describe('getQuranVerse', () => {
  it('should fetch verse with translation', async () => {
    // Test implementation
  });
});
```

### Running Tests

```bash
# Watch mode (recommended for development)
npm test

# Single run with coverage
npm run test:coverage

# UI mode (interactive)
npm run test:ui

# Integration tests
npm run test:integration
```

### Test Coverage

We aim for:
- **Lines**: 80%+
- **Functions**: 80%+
- **Branches**: 75%+
- **Statements**: 80%+

View coverage report: `open coverage/index.html`

## 🎨 Code Style

### Automatic Formatting

Code is automatically formatted on save (if using VS Code with recommended settings).

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

### Linting

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Import Organization

Imports are automatically organized by ESLint:

```typescript
// 1. Built-in modules
import { readFile } from 'fs/promises';

// 2. External modules
import { Server } from '@modelcontextprotocol/sdk';

// 3. Internal modules
import { fetchJSON } from '../services/fetcher.js';
import { QuranVerse } from '../types/index.js';
```

## 🔧 Adding New Features

### 1. Create a New Tool

```typescript
// src/tools/new-feature.ts

/**
 * New feature tool
 * Provides access to...
 */

import { fetchJSON } from '../services/fetcher.js';
import { cacheService } from '../services/cache.js';

/**
 * Get something from the API
 */
export async function getNewFeature(param: string): Promise<Result> {
  // Implementation
}
```

### 2. Add Tests

```typescript
// src/tools/__tests__/new-feature.test.ts

import { describe, it, expect } from 'vitest';
import { getNewFeature } from '../new-feature.js';

describe('New Feature', () => {
  it('should work correctly', async () => {
    const result = await getNewFeature('test');
    expect(result).toBeDefined();
  });
});
```

### 3. Register Tool in Server

```typescript
// src/index.ts

import { getNewFeature } from './tools/new-feature.js';

const tools: Tool[] = [
  // ... existing tools
  {
    name: 'new_feature',
    description: 'Description of new feature',
    inputSchema: {
      type: 'object',
      properties: {
        param: {
          type: 'string',
          description: 'Parameter description',
        },
      },
      required: ['param'],
    },
  },
];

// Add handler in CallToolRequestSchema
case 'new_feature': {
  const { param } = args as any;
  const result = await getNewFeature(param);
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}
```

### 4. Update Documentation

- Add to `API.md`
- Add examples to `EXAMPLES.md`
- Update `README.md` if needed

## 🐛 Debugging

### VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "program": "${workspaceFolder}/dist/index.js",
      "preLaunchTask": "npm: build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "sourceMaps": true
    }
  ]
}
```

### Console Debugging

```typescript
// Use console.error for debugging (console.log is suppressed)
console.error('Debug info:', data);
```

### MCP Inspector

```bash
npm run inspector
```

Opens interactive UI for testing tools.

## 📦 Building and Deployment

### Local Build

```bash
npm run build
```

Output: `dist/` directory

### Docker Build

```bash
# Build image
docker build -t quran-mcp-server .

# Run container
docker run -it quran-mcp-server
```

### Production Deployment

1. Build the project
2. Copy `dist/` and `package.json`
3. Run `npm ci --only=production`
4. Start with `node dist/index.js`

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

**CI Pipeline** (`.github/workflows/ci.yml`):
- Runs on push and PR
- Jobs: lint, type-check, test, build, integration
- Uploads coverage to Codecov

**Release Pipeline** (`.github/workflows/release.yml`):
- Runs on version tags
- Creates GitHub release
- Uploads build artifacts

### Running CI Locally

```bash
# Run all CI checks
npm run validate
```

## 🔐 Security Best Practices

### Code Security

- No `eval()` or `Function()` constructors
- Validate all inputs
- Use parameterized queries
- No sensitive data in logs
- Regular dependency updates (Dependabot)

### Dependency Management

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

## ⚡ Performance Optimization

### Caching Strategy

- Use appropriate TTL for different data types
- Monitor cache hit rates
- Clear cache when needed

### Profiling

```typescript
// Add timing logs
const start = Date.now();
const result = await fetchData();
console.error(`Fetch took ${Date.now() - start}ms`);
```

### Bundle Size

```bash
# Analyze bundle
npm run build
du -sh dist/
```

## 📊 Monitoring

### Cache Statistics

```typescript
import { getAllCacheStats } from './services/cache.js';

const stats = getAllCacheStats();
console.error('Cache stats:', stats);
```

### Error Tracking

All errors use `QuranMCPError` with error codes for easy tracking.

## 🤝 Contributing Workflow

1. Fork the repository
2. Create feature branch
3. Make changes
4. Write tests
5. Run `npm run validate`
6. Commit with conventional commits
7. Push and create PR
8. Wait for review

See `CONTRIBUTING.md` for details.

## 📚 Learning Resources

### MCP Protocol
- [MCP Documentation](https://modelcontextprotocol.io)
- [MCP SDK](https://github.com/modelcontextprotocol/sdk)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

### Testing
- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

### Code Quality
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

## 🎓 Advanced Topics

### Custom Cache Implementation

```typescript
// Implement custom cache strategy
class CustomCache<T> {
  // Implementation
}
```

### Performance Monitoring

```typescript
// Add performance metrics
import { performance } from 'perf_hooks';

const start = performance.now();
// ... operation
const duration = performance.now() - start;
```

### Error Recovery

```typescript
// Implement retry with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  // Implementation
}
```

## 🔮 Future Enhancements

Areas for contribution:
- [ ] GraphQL API support
- [ ] WebSocket transport
- [ ] Offline mode with local DB
- [ ] Full-text search
- [ ] Advanced caching strategies
- [ ] Performance benchmarks
- [ ] Load testing

---

**Happy Coding! 🚀**

