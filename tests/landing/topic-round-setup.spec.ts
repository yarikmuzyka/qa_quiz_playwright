// spec: tests/quiz.plan.md
// seed: tests/seed.spec.ts
import { expect, test } from '../../fixtures/test';

test.describe('Landing page, localization, and topic selection', () => {
  test('Open a topic and verify supported question-count options', async ({
    landingPage,
    quizPage,
  }) => {
    // 1. From the fresh landing page, select the testing-theory topic.
    await landingPage.open();
    await expect(landingPage.title).toHaveTitle('QA Quiz — interview prep for QA engineers');
    await landingPage.openTopic('testing-theory');
    await expect(landingPage.questionCountDialog.title).toHaveText(
      'Testing Theory — question count',
    );
    await expect(landingPage.questionCountDialog.countButton(10)).toBeVisible();
    await expect(landingPage.questionCountDialog.countButton(50)).toBeVisible();
    await expect(landingPage.questionCountDialog.countButton(100)).toBeVisible();

    // 2. Close the dialog without starting a round, then open the topic again and choose the 10-question option.
    await landingPage.questionCountDialog.close();
    await expect(landingPage.questionCountDialog.title).toBeHidden();
    await expect(landingPage.topicButton('testing-theory')).toBeVisible();
    await landingPage.openTopic('testing-theory');
    await landingPage.questionCountDialog.selectCount(10);
    await expect(quizPage.progress).toHaveText('1 / 10');
    await expect(quizPage.correctCounter).toHaveText('0 ✓');
    await expect(quizPage.incorrectCounter).toHaveText('0 ✗');

    // 3. Return to the landing page, select a topic with fewer questions than the advanced-round limit, and inspect its count options.
    await quizPage.finishRound();
    await quizPage.returnHome();
    await landingPage.openTopic('ai-in-testing');
    await expect(landingPage.questionCountDialog.title).toHaveText(
      'AI in Testing — question count',
    );
    await expect(landingPage.questionCountDialog.countButton(100)).toBeEnabled();
    const quickRound = landingPage.questionCountDialog.countButton(10);
    const standardRound = landingPage.questionCountDialog.countButton(50);
    const quickRoundEnabled = await quickRound.isEnabled();
    const selectedRound = quickRoundEnabled ? quickRound : standardRound;
    const questionCount = quickRoundEnabled ? 10 : 50;
    await expect(selectedRound).toBeEnabled();
    await landingPage.questionCountDialog.selectCount(questionCount);
    await expect(quizPage.progress).toHaveText(`1 / ${questionCount}`);
    await expect(quizPage.correctCounter).toHaveText('0 ✓');
    await expect(quizPage.incorrectCounter).toHaveText('0 ✗');
  });
});
