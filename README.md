# QA Quiz — Playwright Tests

End-to-end tests for [QA Quiz](https://yarikmuzyka.github.io/quiz/), built with Playwright and TypeScript. Scenarios cover localization, quiz flows, challenges, feedback, and Bug Hunt.

The project explores AI-assisted test planning, generation, and repair through Playwright MCP agents in VS Code. Running the tests requires neither MCP nor an AI subscription.

The `main` branch contains the original generated tests. The [ai_page_object_refactoring](https://github.com/yarikmuzyka/qa_quiz_playwright/tree/ai_page_object_refactoring) branch organizes tests into Page Objects, reusable components, and fixtures.

## Setup

Requires Node.js 22+ (LTS) and npm.

```bash
npm ci
npx playwright install
```

## Run

```bash
npm test                  # Chromium, headless
npx playwright test      # Chromium and WebKit
npm run test:headed       # Visible Chromium browser
npm run test:ui           # Interactive test runner
npm run test:debug        # Step-by-step debugging
npm run typecheck         # TypeScript validation
npm run report            # Latest HTML report
```

Run a specific test file:

```bash
npm test -- tests/landing/topic-round-setup.spec.ts
```

Failed tests retry twice in CI; local retries are disabled. Screenshots are captured on failure; traces are recorded on the first retry. Tests navigate directly to the deployed application.

Note: `npm run test:all` currently includes Firefox, which is not configured. Use `npx playwright test` to run both configured browsers.

## Structure

```text
tests/          Test specs with inline locators and UI actions
specs/          Test planning documentation
.github/agents/ Planner, Generator, and Healer instructions
playwright.config.ts  Browser projects, retries, and reporting
tsconfig.json         TypeScript configuration
```

Tests import `test` and `expect` directly from `@playwright/test`. Add scenarios under `tests/` using the `*.spec.ts` naming convention. The seed file at `tests/seed.spec.ts` is a placeholder for test generation.
