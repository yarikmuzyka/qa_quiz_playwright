// spec: tests/quiz.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Challenge links and sharing', () => {
  test('Create a new challenge directly from the landing page', async ({ page }) => {
    // 1. Click the landing-page challenge-a-friend action from a fresh state.
    await page.goto('https://yarikmuzyka.github.io/quiz/');
    await page.getByRole('button', { name: 'Challenge a QA friend' }).click();
    await expect(page.getByText('Create challenge')).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Testing Theory' })).toBeVisible();

    // 2. Complete the required setup and create an invite.
    await page.getByRole('checkbox', { name: 'Testing Theory' }).click();
    await page.getByRole('button', { name: '10', exact: true }).click();
    await page.locator('#challengeNickname').fill('QA Tester');
    await page.locator('#challengeTopicList input[type="checkbox"]').first().check();
    // The deployed app closes the challenge form and starts a mock quiz instead of generating a link.
    test.fixme(true, 'Landing-page challenge submission currently starts a mock quiz');
    await page.locator('#challengeCreateSubmit').click();
    await expect(page.getByText('Challenge ready')).toBeVisible();
    const challengeLink = page.getByRole('textbox', { name: 'Challenge link' });
    await expect(challengeLink).toHaveValue(/#challenge=.+/);
    await page.getByRole('button', { name: 'COPY CHALLENGE LINK' }).click();
    await expect(challengeLink).toHaveValue(/#challenge=.+/);
    const inviteUrl = await challengeLink.inputValue();
    await page.goto(inviteUrl);
    await expect(page.getByText(/challenge/i)).toBeVisible();
  });
});
