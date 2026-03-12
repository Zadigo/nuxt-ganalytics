# Quick Test Commands Reference

## 📦 Basic Commands
```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Type checking
pnpm test:types
```

## 📊 Coverage Commands
```bash
# Generate coverage report
pnpm test -- --coverage

# Coverage with HTML report
pnpm test -- --coverage --coverage.reporter=html

# View coverage report
open coverage/index.html
```

## 🎯 Specific File Testing
```bash
# Test useAnalyticsEvent unit tests
pnpm test test/unit/useAnalyticsEvent.test.ts

# Test integration tests
pnpm test test/unit/useAnalyticsEvent.integration.test.ts

# Test snapshot tests
pnpm test test/unit/useAnalyticsEvent.snapshot.test.ts

# Test all unit tests
pnpm test test/unit/
```

## 🔍 Debugging Commands
```bash
# Verbose output
pnpm test -- --reporter=verbose

# Run single test by name
pnpm test -- -t "should send event"

# Show console output
pnpm test -- --reporter=verbose --silent=false

# Update snapshots
pnpm test -- -u
```

## ⚡ Performance Commands
```bash
# Bail on first failure
pnpm test -- --bail

# Run tests in parallel
pnpm test -- --reporter=verbose --maxWorkers=4

# Profile tests
pnpm test -- --profile
```

## 📝 Filtering Commands
```bash
# Run only SSR tests
pnpm test -- -t "Server-side"

# Run only client tests
pnpm test -- -t "Client-side"

# Run only integration tests
pnpm test -- -t "Integration"
```

## 🚀 CI/CD Commands
```bash
# Run in CI mode
pnpm test -- --run --reporter=json --outputFile=test-results.json

# Generate JUnit report
pnpm test -- --reporter=junit --outputFile=junit.xml

# Check coverage thresholds
pnpm test -- --coverage --coverage.thresholdAutoUpdate=true
```

## 🛠️ Development Commands
```bash
# Run tests on file change
pnpm test:watch

# Test specific file on change
pnpm test:watch test/unit/useAnalyticsEvent.test.ts

# Clear test cache
pnpm test -- --clearCache
```

## 💡 Useful Combinations
```bash
# Watch with coverage
pnpm test:watch -- --coverage

# Verbose with coverage
pnpm test -- --reporter=verbose --coverage

# Fast feedback loop
pnpm test -- --bail --reporter=dot
```

## 📚 Quick Tips
- Use `it.only()` to run a single test during development
- Use `describe.skip()` to temporarily skip test suites
- Check `test/unit/README.md` for detailed documentation
- Run `pnpm test -- --help` for all available options

## ✨ Test Files Created
- `test/unit/useAnalyticsEvent.test.ts` - Unit tests (35+ test cases)
- `test/unit/useAnalyticsEvent.integration.test.ts` - Integration tests (20+ test cases)
- `test/unit/useAnalyticsEvent.snapshot.test.ts` - API snapshot tests (15+ test cases)
- `test/unit/test-helpers.ts` - Test utilities (20+ helper functions)
- `test/unit/README.md` - Comprehensive documentation
- `test/unit/TEST_SUMMARY.md` - Test suite summary
