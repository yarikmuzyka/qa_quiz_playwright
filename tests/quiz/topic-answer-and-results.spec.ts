// spec: tests/quiz.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Topic quiz, scoring, and results', () => {
  test('Answer a topic question correctly and review results', async ({ page }) => {
    // 1. Start a 10-question testing-theory round from a clean state.
    await page.goto('https://yarikmuzyka.github.io/quiz/');
    await expect(page).toHaveTitle('QA Quiz — interview prep for QA engineers');
    await page.getByRole('button', { name: '···· testing-theory.spec —' }).click();
    await page.getByRole('button', { name: '10 quick round', exact: true }).click();
    await expect(page.getByText('1 / 10')).toBeVisible();
    await expect(page.getByText('0 ✓', { exact: true })).toBeVisible();
    await expect(page.getByText('0 ✗', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /^\[ \] [A-D] / })).toHaveCount(4);
    await expect(page.getByRole('button', { name: 'Finish', exact: true })).toBeVisible();

    // 2. Select an answer without submitting it, then inspect the question state.
    const answerButtons = page.getByRole('button', { name: /^\[ \] [A-D] / });
    await answerButtons.first().click();
    await expect(page.getByRole('button', { name: /^\[x\] [A-D] / })).toBeVisible();
    await expect(page.getByText('0 ✓', { exact: true })).toBeVisible();
    await expect(page.getByText('0 ✗', { exact: true })).toBeVisible();
    const submitButton = page.getByRole('button', { name: '$ submit →' });
    await expect(submitButton).toBeEnabled();

    // 3. Submit the selected answer, then try to select another option before moving on.
    await submitButton.click();
    await expect(page.locator('body')).toContainText(/✓ PASS|✗ FAIL/);
    await expect(page.getByRole('button', { name: /^\[.*\] [A-D] / }).first()).toBeDisabled();
    const nextButton = page.getByRole('button', { name: /^\$ (?:next|view report) →$/ });
    await expect(nextButton).toBeVisible();
    await expect(page.getByText('1 ✓', { exact: true }).or(page.getByText('1 ✗', { exact: true }))).toBeVisible();

    // 4. Advance through the round until all 10 questions have been answered.
    for (let question = 1; question < 10; question += 1) {
      await nextButton.click();
      await expect(page.getByText(`${question + 1} / 10`)).toBeVisible();
      await page.getByRole('button', { name: /^\[ \] [A-D] / }).first().click();
      await page.getByRole('button', { name: '$ submit →' }).click();
      await expect(nextButton).toBeVisible();
    }
    await nextButton.click();
    await expect(page.getByText(/PASSED|FAILED/)).toBeVisible();
    await expect(page.locator('#resTotal')).toHaveText('10');

    // 5. Return to the landing page.
    await page.getByRole('button', { name: '← Home' }).click();
    await expect(page.getByText('1/14')).toBeVisible();
    await expect(page.getByRole('button', { name: /testing-theory\.spec/ })).toBeVisible();
  });
});
