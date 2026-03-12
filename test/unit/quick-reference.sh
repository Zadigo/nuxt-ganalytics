#!/bin/bash

# Quick Test Commands Reference for nuxt-ganalytics
# ================================================

echo "🧪 Nuxt-Ganalytics Test Suite - Quick Commands"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to display command
show_command() {
    echo -e "${BLUE}$1${NC}"
    echo -e "${GREEN}$2${NC}"
    echo ""
}

echo "📦 Basic Commands"
echo "----------------"
show_command "Run all tests:" "pnpm test"
show_command "Watch mode:" "pnpm test:watch"
show_command "Type checking:" "pnpm test:types"

echo "📊 Coverage Commands"
echo "-------------------"
show_command "Generate coverage report:" "pnpm test -- --coverage"
show_command "Coverage with HTML report:" "pnpm test -- --coverage --coverage.reporter=html"
show_command "View coverage report:" "open coverage/index.html"

echo "🎯 Specific File Testing"
echo "-----------------------"
show_command "Test useAnalyticsEvent unit tests:" "pnpm test test/unit/useAnalyticsEvent.test.ts"
show_command "Test integration tests:" "pnpm test test/unit/useAnalyticsEvent.integration.test.ts"
show_command "Test snapshot tests:" "pnpm test test/unit/useAnalyticsEvent.snapshot.test.ts"
show_command "Test all unit tests:" "pnpm test test/unit/"

echo "🔍 Debugging Commands"
echo "--------------------"
show_command "Verbose output:" "pnpm test -- --reporter=verbose"
show_command "Run single test by name:" "pnpm test -- -t 'should send event'"
show_command "Show console output:" "pnpm test -- --reporter=verbose --silent=false"
show_command "Update snapshots:" "pnpm test -- -u"

echo "⚡ Performance Commands"
echo "----------------------"
show_command "Bail on first failure:" "pnpm test -- --bail"
show_command "Run tests in parallel:" "pnpm test -- --reporter=verbose --maxWorkers=4"
show_command "Profile tests:" "pnpm test -- --profile"

echo "📝 Filtering Commands"
echo "--------------------"
show_command "Run only SSR tests:" "pnpm test -- -t 'Server-side'"
show_command "Run only client tests:" "pnpm test -- -t 'Client-side'"
show_command "Run only integration tests:" "pnpm test -- -t 'Integration'"
show_command "Skip specific tests:" "pnpm test -- -t '(?!should skip this)'"

echo "🚀 CI/CD Commands"
echo "----------------"
show_command "Run in CI mode:" "pnpm test -- --run --reporter=json --outputFile=test-results.json"
show_command "Generate JUnit report:" "pnpm test -- --reporter=junit --outputFile=junit.xml"
show_command "Check coverage thresholds:" "pnpm test -- --coverage --coverage.thresholdAutoUpdate=true"

echo "🛠️ Development Commands"
echo "----------------------"
show_command "Run tests on file change:" "pnpm test:watch"
show_command "Test specific file on change:" "pnpm test:watch test/unit/useAnalyticsEvent.test.ts"
show_command "Clear test cache:" "pnpm test -- --clearCache"

echo "💡 Useful Combinations"
echo "---------------------"
show_command "Watch with coverage:" "pnpm test:watch -- --coverage"
show_command "Verbose with coverage:" "pnpm test -- --reporter=verbose --coverage"
show_command "Fast feedback loop:" "pnpm test -- --bail --reporter=dot"

echo ""
echo -e "${YELLOW}📚 Quick Tips:${NC}"
echo "• Use 'it.only()' to run a single test during development"
echo "• Use 'describe.skip()' to temporarily skip test suites"
echo "• Check test/unit/README.md for detailed documentation"
echo "• Run 'pnpm test -- --help' for all available options"
echo ""
echo -e "${GREEN}✨ Test files created:${NC}"
echo "  • test/unit/useAnalyticsEvent.test.ts (Unit tests)"
echo "  • test/unit/useAnalyticsEvent.integration.test.ts (Integration tests)"
echo "  • test/unit/useAnalyticsEvent.snapshot.test.ts (API snapshot tests)"
echo "  • test/unit/test-helpers.ts (Test utilities)"
echo "  • test/unit/README.md (Documentation)"
echo "  • test/unit/TEST_SUMMARY.md (Summary)"
echo ""
