// spec: tests/quiz.plan.md
// seed: tests/seed.spec.ts
import { expect, test } from '../../fixtures/test';

test.describe('Challenge links and sharing', () => {
  test('Create a challenge link from a completed quiz', async ({
    landingPage,
    quizPage,
    challengePage,
  }) => {
    // 1. Complete at least one question in a topic round and open the result action to challenge a friend.
    await landingPage.open();
    await landingPage.openTopic('testing-theory');
    await landingPage.questionCountDialog.selectCount(10);
    await quizPage.selectFirstAnswer();
    await quizPage.submitAnswer();
    await quizPage.finishRound();
    await quizPage.openChallengeDialog();
    await expect(challengePage.dialog.createTitle).toBeVisible();
    await expect(challengePage.dialog.nickname).toBeVisible();
    await expect(challengePage.dialog.startButton).toBeVisible();

    // 2. Leave the nickname blank and start challenge creation.
    await challengePage.dialog.startChallenge();
    await expect(challengePage.dialog.challengeReadyTitle).toBeVisible();
    await expect(challengePage.dialog.challengeLink).toHaveValue(/#challenge=.+/);
    await expect(challengePage.dialog.testingTheoryLabel).toBeVisible();

    // 3. Use the copy-link action and inspect the displayed URL.
    await challengePage.dialog.copyChallengeLink();
    await expect(challengePage.dialog.challengeLink).toHaveValue(
      /https:\/\/yarikmuzyka\.github\.io\/quiz\/#challenge=/,
    );

    // 4. Close the dialog and open the generated challenge URL in a separate fresh context.
    const inviteUrl = await challengePage.dialog.challengeLink.inputValue();
    await challengePage.dialog.close();
    await challengePage.openInvite(inviteUrl);
    await expect(challengePage.currentPage).toHaveURL(/#challenge=.+/);
  });
});
