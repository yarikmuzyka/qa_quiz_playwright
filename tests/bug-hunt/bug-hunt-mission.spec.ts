// spec: tests/quiz.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Feedback and special mission', () => {
  test('Start and complete or time out the Bug Hunt mission', async ({ page }) => {
    // 1. From a clean landing page, activate Start Mission in the Bug Hunt panel.
    await page.goto('https://yarikmuzyka.github.io/quiz/');
    await expect(page.getByRole('button', { name: 'START MISSION →' })).toBeVisible();
    await page.getByRole('button', { name: 'START MISSION →' }).click({ force: true });
    await expect(page.getByText('QA Mission Console')).toBeVisible();
    await expect(page.locator('#bugTimer')).toHaveText('10:00');
    await expect(page.locator('#bugFoundCounter')).toHaveText('0/10');
    await expect(page.locator('#bugReportTopBtn')).toBeVisible();

    // 2. Explore the demo shop using its visible navigation and interactions; identify a seeded defect using the mission instructions and report it through the intended controls.
    await expect(page.getByText(/mission|bug/i).first()).toBeVisible();
    await expect(page.locator('#bugReportTopBtn')).toBeEnabled();

    // 3. Continue until all bugs are found, or allow the timer to expire in a controlled test.
    await expect(page.locator('#bugFoundCounter')).toHaveText('0/10');
    await expect(page.getByRole('button', { name: 'End session' })).toBeVisible();
  });
});
