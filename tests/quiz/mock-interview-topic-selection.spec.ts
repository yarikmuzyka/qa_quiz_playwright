// spec: tests/quiz.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Topic quiz, scoring, and results', () => {
  test('Configure a mock interview and enforce selection and count boundaries', async ({ page }) => {
    // 1. From a fresh landing page, launch the full-suite/mock interview entry point.
    await page.goto('https://yarikmuzyka.github.io/quiz/');
    await page.getByRole('button', { name: /run --mock full-suite/ }).click();
    await expect(page.getByText('Mock Interview — topics')).toBeVisible();
    const checkboxes = page.getByRole('checkbox');
    await expect(checkboxes).toHaveCount(14);
    const nextButton = page.getByRole('button', { name: 'Next →' });
    await expect(nextButton).toBeDisabled();
    await expect(page.getByText('Choose at least one topic')).toBeVisible();

    // 2. Use Select all, then Clear; select only testing theory.
    await page.getByRole('button', { name: 'select all' }).click();
    for (let index = 0; index < 14; index += 1) {
      await expect(checkboxes.nth(index)).toBeChecked();
    }
    await expect(nextButton).toBeEnabled();
    await page.getByRole('button', { name: 'clear' }).click();
    for (let index = 0; index < 14; index += 1) {
      await expect(checkboxes.nth(index)).not.toBeChecked();
    }
    await expect(nextButton).toBeDisabled();
    await page.getByRole('checkbox', { name: 'Testing Theory 55' }).click();
    await expect(nextButton).toBeEnabled();

    // 3. Advance to question-count selection for the one-topic selection.
    await nextButton.click();
    await expect(page.getByText('Mock Interview — question count')).toBeVisible();
    await expect(page.getByRole('button', { name: '100 deep dive', exact: true })).toBeDisabled();
    await page.getByRole('button', { name: '✕' }).click();
    await expect(page.getByText('Mock Interview — question count')).toBeHidden();

    // 4. Start a supported interview length and complete at least one question.
    await page.getByRole('button', { name: /run --mock full-suite/ }).click();
    await page.getByRole('checkbox', { name: 'Testing Theory 55' }).click();
    await page.getByRole('button', { name: 'Next →' }).click();
    await page.getByRole('button', { name: '10 quick round', exact: true }).click();
    await expect(page.getByText('1 / 10')).toBeVisible();
    await expect(page.getByRole('button', { name: /^\[ \] [A-D] / })).toHaveCount(4);
    await page.getByRole('button', { name: /^\[ \] [A-D] / }).first().click();
    await page.getByRole('button', { name: '$ submit →' }).click();
    await expect(page.getByText('1 ✓', { exact: true }).or(page.getByText('1 ✗', { exact: true }))).toBeVisible();
    await page.getByRole('button', { name: 'Finish' }).click();
    await expect(page.getByText(/PASSED|FAILED/)).toBeVisible();
    await page.getByRole('button', { name: '← Home' }).click();
    await expect(page.locator('#mockTopicSummary')).toContainText('1/14 topics');
  });
});
