// spec: tests/quiz.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Feedback and special mission', () => {
  test('Submit feedback with a rating and optional comment', async ({ page }) => {
    // 1. Open the feedback dialog from the landing page.
    await page.goto('https://yarikmuzyka.github.io/quiz/');
    await page.getByRole('button', { name: '--feedback' }).click();
    await expect(page.getByText('Leave feedback')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'What you liked, what could be better...' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send →' })).toBeVisible();
    await expect(page.getByRole('button', { name: '✕' })).toBeVisible();
    await expect(page.getByText('★')).toHaveCount(5);

    // 2. Try to submit without selecting a rating or entering a comment.
    await page.getByRole('button', { name: 'Send →' }).click();
    await expect(page.getByText('Leave feedback')).toBeHidden();

    // 3. Select a rating, enter a short comment, and submit.
    await page.getByRole('button', { name: '--feedback' }).click();
    await page.getByText('★').nth(4).click();
    const comment = page.getByRole('textbox', { name: 'What you liked, what could be better...' });
    await comment.fill('The quiz is clear and useful.');
    await expect(comment).toHaveValue('The quiz is clear and useful.');
    await page.getByRole('button', { name: 'Send →' }).click();
    await expect(page.getByText('Leave feedback')).toBeHidden();

    // 4. Reopen the feedback dialog and close it without submitting.
    await page.getByRole('button', { name: '--feedback' }).click();
    await expect(page.getByText('Leave feedback')).toBeVisible();
    await page.getByRole('button', { name: '✕' }).click();
    await expect(page.getByText('Leave feedback')).toBeHidden();
  });
});
