// spec: tests/quiz.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Landing page, localization, and topic selection', () => {
  test('Open a topic and verify supported question-count options', async ({ page }) => {
    // 1. From the fresh landing page, select the testing-theory topic.
    await page.goto('https://yarikmuzyka.github.io/quiz/');
    await expect(page).toHaveTitle('QA Quiz — interview prep for QA engineers');
    await page.getByRole('button', { name: '···· testing-theory.spec —' }).click();
    await expect(page.getByText('Testing Theory — question count')).toBeVisible();
    await expect(page.getByRole('button', { name: '10 quick round', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: '50 standard', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: '100 deep dive', exact: true })).toBeVisible();

    // 2. Close the dialog without starting a round, then open the topic again and choose the 10-question option.
    await page.getByRole('button', { name: '✕' }).click();
    await expect(page.getByText('Testing Theory — question count')).toBeHidden();
    await expect(page.getByRole('button', { name: '···· testing-theory.spec —' })).toBeVisible();
    await page.getByRole('button', { name: '···· testing-theory.spec —' }).click();
    await page.getByRole('button', { name: '10 quick round', exact: true }).click();
    await expect(page.getByText('1 / 10')).toBeVisible();
    await expect(page.getByText('0 ✓', { exact: true })).toBeVisible();
    await expect(page.getByText('0 ✗', { exact: true })).toBeVisible();

    // 3. Return to the landing page, select a topic with fewer questions than the advanced-round limit, and inspect its count options.
    await page.getByRole('button', { name: 'Finish' }).click();
    await page.getByRole('button', { name: '← Home' }).click();
    await page.getByRole('button', { name: '···· ai-in-testing.spec —' }).click();
    await expect(page.getByText('AI in Testing — question count')).toBeVisible();
    await expect(page.getByRole('button', { name: '100 deep dive', exact: true })).toBeEnabled();
    const quickRound = page.getByRole('button', { name: '10 quick round', exact: true });
    const standardRound = page.getByRole('button', { name: '50 standard', exact: true });
    const quickRoundEnabled = await quickRound.isEnabled();
    const selectedRound = quickRoundEnabled ? quickRound : standardRound;
    const questionCount = quickRoundEnabled ? 10 : 50;
    await expect(selectedRound).toBeEnabled();
    await selectedRound.click();
    await expect(page.getByText(`1 / ${questionCount}`)).toBeVisible();
    await expect(page.getByText('0 ✓', { exact: true })).toBeVisible();
    await expect(page.getByText('0 ✗', { exact: true })).toBeVisible();
  });
});
