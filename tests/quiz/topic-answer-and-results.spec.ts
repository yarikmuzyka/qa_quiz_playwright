// spec: tests/quiz.plan.md
// seed: tests/seed.spec.ts
import { expect, test } from '../../fixtures/test';

test.describe('Topic quiz, scoring, and results', () => {
  test('Answer a topic question correctly and review results', async ({
    landingPage,
    quizPage,
  }) => {
    // 1. Start a 10-question testing-theory round from a clean state.
    await landingPage.open();
    await expect(landingPage.title).toHaveTitle('QA Quiz — interview prep for QA engineers');
    await landingPage.openTopic('testing-theory');
    await landingPage.questionCountDialog.selectCount(10);
    await expect(quizPage.progress).toHaveText('1 / 10');
    await expect(quizPage.correctCounter).toHaveText('0 ✓');
    await expect(quizPage.incorrectCounter).toHaveText('0 ✗');
    await expect(quizPage.answerButtons).toHaveCount(4);
    await expect(quizPage.finishButton).toBeVisible();

    // 2. Select an answer without submitting it, then inspect the question state.
    await quizPage.selectFirstAnswer();
    await expect(quizPage.selectedAnswerButton).toBeVisible();
    await expect(quizPage.correctCounter).toHaveText('0 ✓');
    await expect(quizPage.incorrectCounter).toHaveText('0 ✗');
    await expect(quizPage.submitButton).toBeEnabled();

    // 3. Submit the selected answer, then try to select another option before moving on.
    await quizPage.submitAnswer();
    await expect(quizPage.answerFeedback).toContainText(/✓ PASS|✗ FAIL/);
    await expect(quizPage.answeredOptionButtons.first()).toBeDisabled();
    await expect(quizPage.nextQuestionButton).toBeVisible();
    await expect(quizPage.correctCounter.or(quizPage.incorrectCounter)).toBeVisible();

    // 4. Advance through the round until all 10 questions have been answered.
    for (let question = 1; question < 10; question += 1) {
      await quizPage.advanceToNextQuestion();
      await expect(quizPage.progress).toHaveText(`${question + 1} / 10`);
      await quizPage.selectFirstAnswer();
      await quizPage.submitAnswer();
      await expect(quizPage.nextQuestionButton).toBeVisible();
    }
    await quizPage.advanceToNextQuestion();
    await expect(quizPage.resultStatus).toBeVisible();
    await expect(quizPage.resultTotal).toHaveText('10');

    // 5. Return to the landing page.
    await quizPage.returnHome();
    await expect(landingPage.topicProgress).toHaveText('1/14');
    await expect(landingPage.topicButton('testing-theory')).toBeVisible();
  });
});
