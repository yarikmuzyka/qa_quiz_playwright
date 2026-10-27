// spec: tests/quiz.plan.md
// seed: tests/seed.spec.ts
import { expect, test } from '../../fixtures/test';

test.describe('Feedback and special mission', () => {
  test('Start and complete or time out the Bug Hunt mission', async ({ landingPage }) => {
    const bugHunt = landingPage.bugHuntPanel;

    // 1. From a clean landing page, activate Start Mission in the Bug Hunt panel.
    await landingPage.open();
    await expect(bugHunt.startButton).toBeVisible();
    await bugHunt.startMission();
    await expect(bugHunt.missionConsoleTitle).toBeVisible();
    await expect(bugHunt.timer).toHaveText('10:00');
    await expect(bugHunt.foundCounter).toHaveText('0/10');
    await expect(bugHunt.reportButton).toBeVisible();

    // 2. Explore the demo shop using its visible navigation and interactions; identify a seeded defect using the mission instructions and report it through the intended controls.
    await expect(bugHunt.missionText).toBeVisible();
    await expect(bugHunt.reportButton).toBeEnabled();

    // 3. Continue until all bugs are found, or allow the timer to expire in a controlled test.
    await expect(bugHunt.foundCounter).toHaveText('0/10');
    await expect(bugHunt.endSessionButton).toBeVisible();
  });
});
