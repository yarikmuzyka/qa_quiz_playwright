// spec: tests/quiz.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Topic quiz, scoring, and results', () => {
  test('Validate unanswered questions, answer locking, and early finish', async ({ page }) => {
    // 1. Start a 10-question topic round and attempt to submit before choosing an answer.
    await page.goto('https://yarikmuzyka.github.io/quiz/');
    await page.getByRole('button', { name: '···· testing-theory.spec —' }).click();
    await page.getByRole('button', { name: '10 quick round', exact: true }).click();
    await expect(page.getByText('1 / 10')).toBeVisible();
    await expect(page.getByText('0 ✓', { exact: true })).toBeVisible();
    await expect(page.getByText('0 ✗', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: '$ submit →' })).toHaveCount(0);

    // 2. Select an answer and submit it; validate feedback and that the response is locked.
    await page.getByRole('button', { name: /^\[ \] [A-D] / }).first().click();
    await page.getByRole('button', { name: '$ submit →' }).click();
    const correctCounter = page.getByText('1 ✓', { exact: true });
    const incorrectCounter = page.getByText('1 ✗', { exact: true });
    await expect(correctCounter.or(incorrectCounter)).toBeVisible();
    await expect(page.locator('body')).toContainText(/✓ PASS|✗ FAIL/);
    await expect(page.getByRole('button', { name: /^\[.*\] [A-D] / }).first()).toBeDisabled();

    // 3. Finish the round before answering all questions.
    await page.getByRole('button', { name: 'Finish' }).click();
    await expect(page.getByText(/PASSED|FAILED/)).toBeVisible();
    await expect(page.locator('#resTotal')).toHaveText('1');
    await expect(page.locator('#resWrong')).toHaveText('1');
    await expect(page.locator('#resCorrect')).toHaveText('0');
    await expect(page.locator('#resSkipped')).toHaveText('9');
    await expect(page.locator('#resultPercent')).toHaveText('0%');
    await page.getByRole('button', { name: '← Home' }).click();
    await expect(page.getByText('1/14')).toBeVisible();
  });
});
