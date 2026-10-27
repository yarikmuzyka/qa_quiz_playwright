# Playwright test conventions

Read these conventions before generating, refactoring, or repairing tests.

## Structure and reuse

- Use the Page Object Model for new and modified test flows.
- Inspect existing tests, pages, components, fixtures, and Playwright configuration first.
- Keep page classes in `pages/`, reusable UI component classes in `components/`,
  and custom Playwright fixtures in `fixtures/test.ts`.
- Reuse and extend existing objects before adding another abstraction. Extract
  duplicated locators and workflows touched by the task; avoid unrelated rewrites.
- Use composition for dialogs and shared widgets. Do not introduce a generic
  BasePage, wrappers around every Playwright method, or unused infrastructure.

## Responsibilities

- Page Objects own locators, navigation, and meaningful UI actions such as
  `openTopic()`, `submitAnswer()`, and `finishRound()`.
- Define typed `readonly` locators and accept a Playwright `Page` in constructors.
- Keep scenario steps, expected business results, and assertions in spec files.
  Expose locators for `expect(locator)` assertions instead of returning snapshots
  of text or visibility. Small readiness checks inside actions are acceptable;
  do not hide scenario assertions inside a long workflow.
- Spec files must not duplicate raw selectors or interaction sequences. Introduce
  or extend the appropriate object when a scenario needs another UI action.
- Prefer explicit, typed parameters over arbitrary selector strings and boolean flags.
- Keep tests readable and explicit; do not hide the entire scenario in one method.

## Fixtures and isolation

- Provide Page Objects through test-scoped fixtures extending Playwright's `test`.
- Specs using these objects import `test` and `expect` from `fixtures/test.ts`
  using the correct relative path.
- Build objects with the standard `page` fixture. Do not share mutable pages,
  contexts, or Page Objects between tests or manually close fixture-owned browsers.
- Each scenario starts independently; never rely on another test's state.
- Reuse the configured `baseURL` when available. If introducing it, preserve the
  current application URL and use relative navigation in Page Objects.

## Reliability and verification

- Prefer role, label, and test-id locators scoped to the owning page/component.
  Use stable CSS only when semantic locators are unavailable.
- Use Playwright auto-waiting and web-first assertions. Never use fixed sleeps,
  `networkidle`, forced clicks, or swallowed exceptions to mask synchronization bugs.
- Do not infer dynamic quiz correctness from answer position. Control test data
  when appropriate or assert an observed, justified outcome.
- Preserve scenario coverage and expected behavior during extraction and repairs.
  Do not weaken assertions, change expected values without evidence, or skip a
  failing test merely to get a passing run. Report application defects or blockers.
- Run `npm run typecheck` and affected tests after implementation. Check available
  scripts/projects first. If execution is blocked, state what was not verified and why.
- Report the objects reused/created, duplication removed, and verification results.

## Example shape

```ts
// Example API; implement locators from the observed application before use.
import { test, expect } from '../../fixtures/test';

test('Start a topic round', async ({ landingPage, quizPage }) => {
  await landingPage.open();
  await landingPage.openTopic('testing-theory');
  await landingPage.questionCountDialog.selectCount(10);
  await expect(quizPage.progress).toHaveText('1 / 10');
});
```
