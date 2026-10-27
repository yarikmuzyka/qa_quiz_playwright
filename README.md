# QA Quiz — Playwright Tests

End-to-end tests for [QA Quiz](https://yarikmuzyka.github.io/quiz/), built with Playwright and TypeScript using the Page Object Model. Scenarios cover localization, quiz flows, challenges, feedback, and Bug Hunt.

The project explores AI-assisted test planning, generation, and repair through Playwright MCP agents in VS Code. Running the tests requires neither MCP nor an AI subscription.

## Setup

Requires Node.js 22+ (LTS) and npm.

```bash
npm ci
npx playwright install
```

## Run

```bash
npm test                  # Chromium, headless
npm run test:all          # Chromium and WebKit
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

Failed tests retry twice. Screenshots are captured on failure; traces are recorded on the first retry. Tests run against the deployed application configured in `playwright.config.ts`.

## Structure

```text
pages/          Page Objects and user actions
components/     Reusable UI components
fixtures/       Test-scoped Page Object fixtures
tests/         Scenarios and assertions
.github/agents/ Planner, Generator, and Healer instructions
```

Import `test` and `expect` from `fixtures/test.ts`. Keep locators and UI actions in Page Objects, and scenario assertions in specs. See [AGENTS.md](AGENTS.md) for conventions and [tests/seed.spec.ts](tests/seed.spec.ts) for an example.
