// spec: tests/quiz.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Challenge links and sharing', () => {
  test('Create a challenge link from a completed quiz', async ({ page }) => {
    // 1. Complete at least one question in a topic round and open the result action to challenge a friend.
    await page.goto('https://yarikmuzyka.github.io/quiz/');
    await page.getByRole('button', { name: '···· testing-theory.spec —' }).click();
    await page.getByRole('button', { name: '10 quick round', exact: true }).click();
    await page.getByRole('button', { name: /^\[ \] [A-D] / }).first().click();
    await page.getByRole('button', { name: '$ submit →' }).click();
    await page.getByRole('button', { name: 'Finish', exact: true }).click();
    await page.getByRole('button', { name: '$ challenge --friend ↗' }).click();
    await expect(page.getByText('Create challenge')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Your nickname' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'START CHALLENGE →' })).toBeVisible();

    // 2. Leave the nickname blank and start challenge creation.
    await page.getByRole('button', { name: 'START CHALLENGE →' }).click();
    await expect(page.getByText('Challenge ready')).toBeVisible();
    const challengeLink = page.getByRole('textbox', { name: 'Challenge link' });
    await expect(challengeLink).toHaveValue(/#challenge=.+/);
    await expect(page.getByText('Testing Theory', { exact: true }).last()).toBeVisible();

    // 3. Use the copy-link action and inspect the displayed URL.
    await page.getByRole('button', { name: 'COPY CHALLENGE LINK' }).click();
    await expect(challengeLink).toHaveValue(/https:\/\/yarikmuzyka\.github\.io\/quiz\/#challenge=/);

    // 4. Close the dialog and open the generated challenge URL in a separate fresh context.
    const inviteUrl = await challengeLink.inputValue();
    await page.getByRole('button', { name: '✕' }).click();
    await page.goto(inviteUrl);
    await expect(page).toHaveURL(/#challenge=.+/);
  });
});
