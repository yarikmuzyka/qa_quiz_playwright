// spec: tests/quiz.plan.md
// seed: tests/seed.spec.ts
import { expect, test } from '../../fixtures/test';

test.describe('Challenge links and sharing', () => {
  test('Create a new challenge directly from the landing page', async ({ landingPage, challengePage }) => {
    // 1. Click the landing-page challenge-a-friend action from a fresh state.
    await landingPage.open();
    await landingPage.openChallenge();
    await expect(challengePage.dialog.createTitle).toBeVisible();
    await expect(challengePage.dialog.testingTheoryCheckbox).toBeVisible();

    // 2. Complete the required setup and create an invite.
    await challengePage.dialog.selectTestingTheory();
    await challengePage.dialog.selectTenQuestions();
    await challengePage.dialog.enterNickname('QA Tester');
    await challengePage.dialog.selectFirstLandingTopic();
    // Keep the intended invite assertions below so a mock-quiz fallback is reported as an application failure.
    await challengePage.dialog.createFromLanding();
    await expect(challengePage.dialog.challengeReadyTitle).toBeVisible();
    await expect(challengePage.dialog.challengeLink).toHaveValue(/#challenge=.+/);
    await challengePage.dialog.copyChallengeLink();
    await expect(challengePage.dialog.challengeLink).toHaveValue(/#challenge=.+/);
    const inviteUrl = await challengePage.dialog.challengeLink.inputValue();
    await challengePage.openInvite(inviteUrl);
    await expect(challengePage.challengeInviteText).toBeVisible();
  });
});
