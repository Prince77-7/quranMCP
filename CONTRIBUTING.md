# Contributing to Quran MCP Server

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## 🌟 Ways to Contribute

- 🐛 Report bugs
- ✨ Suggest new features
- 📝 Improve documentation
- 🔧 Submit bug fixes
- ⚡ Add new features
- 🧪 Write tests
- 🎨 Improve code quality

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or pnpm
- Git
- A code editor (VS Code recommended)

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/quran-mcp-server.git
   cd quran-mcp-server
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Run tests**
   ```bash
   npm test
   ```

## 📋 Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or changes
- `chore/` - Maintenance tasks

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update documentation as needed

### 3. Write Tests

- Add unit tests for new features
- Ensure all tests pass: `npm test`
- Aim for high code coverage: `npm run test:coverage`

### 4. Lint and Format

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### 5. Type Check

```bash
npm run type-check
```

### 6. Validate Everything

```bash
# Run all checks
npm run validate
```

This runs: lint, type-check, tests, and build.

### 7. Commit Your Changes

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add new translation source"
git commit -m "fix: resolve cache invalidation issue"
git commit -m "docs: update API documentation"
```

Commit types:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Maintenance tasks
- `perf:` - Performance improvements
- `ci:` - CI/CD changes

### 8. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 🧪 Testing Guidelines

### Writing Tests

- Place tests in `__tests__` directories next to the code
- Name test files: `*.test.ts`
- Use descriptive test names
- Test both success and error cases
- Mock external dependencies

### Test Structure

```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
  });

  it('should do something specific', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

## 📝 Code Style Guidelines

### TypeScript

- Use strict TypeScript
- Avoid `any` types
- Use interfaces for object shapes
- Use type aliases for unions
- Export types that are used externally

### Naming Conventions

- **Files**: `kebab-case.ts`
- **Classes**: `PascalCase`
- **Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Interfaces**: `PascalCase` (no `I` prefix)
- **Types**: `PascalCase`

### Code Organization

- One export per file (when possible)
- Group related functionality
- Keep files under 300 lines
- Extract complex logic into separate functions

### Comments

- Use JSDoc for public APIs
- Explain "why", not "what"
- Keep comments up-to-date
- Remove commented-out code

### Error Handling

- Use custom error classes
- Provide meaningful error messages
- Include error codes
- Handle errors at appropriate levels

## 🔍 Code Review Process

### What We Look For

- ✅ Code quality and readability
- ✅ Test coverage
- ✅ Documentation updates
- ✅ Performance implications
- ✅ Security considerations
- ✅ Breaking changes (if any)

### Review Timeline

- Initial review: Within 2-3 days
- Follow-up reviews: Within 1-2 days
- Merge: After approval and CI passes

## 📚 Documentation

### When to Update Docs

- Adding new features
- Changing existing behavior
- Adding new tools
- Modifying APIs
- Fixing bugs that affect usage

### Documentation Files

- `README.md` - Main documentation
- `API.md` - API reference
- `EXAMPLES.md` - Usage examples
- `QUICKSTART.md` - Getting started guide
- Code comments - Inline documentation

## 🐛 Reporting Bugs

### Before Reporting

1. Check existing issues
2. Try the latest version
3. Verify it's reproducible

### Bug Report Should Include

- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Error messages/logs
- Screenshots (if applicable)

## ✨ Suggesting Features

### Feature Request Should Include

- Clear description
- Use case
- Benefits
- Possible implementation
- Alternatives considered

## 🔒 Security

### Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities.

Instead, email: security@quran-mcp-server.com (or create a private security advisory)

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

## 💬 Getting Help

- 📖 Read the documentation
- 💬 Ask in GitHub Discussions
- 🐛 Open an issue
- 📧 Contact maintainers

## 🎯 Priority Areas

We especially welcome contributions in:

- [ ] Additional Tafsir sources
- [ ] More language translations
- [ ] Search functionality
- [ ] Performance optimizations
- [ ] Test coverage improvements
- [ ] Documentation enhancements

## ✅ Checklist Before Submitting PR

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] Linting passes
- [ ] Type checking passes
- [ ] Build succeeds
- [ ] No new warnings

---

**Thank you for contributing to Quran MCP Server! 🕌**

