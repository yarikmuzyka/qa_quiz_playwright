// spec: tests/quiz.plan.md
// seed: tests/seed.spec.ts
import { expect, test } from '../../fixtures/test';

test.describe('Topic quiz, scoring, and results', () => {
  test('Validate unanswered questions, answer locking, and early finish', async ({
    landingPage,
    quizPage,
  }) => {
    // 1. Start a 10-question topic round and attempt to submit before choosing an answer.
    await landingPage.open();
    await landingPage.openTopic('testing-theory');
    await landingPage.questionCountDialog.selectCount(10);
    await expect(quizPage.progress).toHaveText('1 / 10');
    await expect(quizPage.correctCounter).toHaveText('0 ✓');
    await expect(quizPage.incorrectCounter).toHaveText('0 ✗');
    await expect(quizPage.submitButton).toHaveCount(0);

    // 2. Select an answer and submit it; validate feedback and that the response is locked.
    await quizPage.selectFirstAnswer();
    await quizPage.submitAnswer();
    await expect(quizPage.correctCounter).toBeVisible();
    await expect(quizPage.incorrectCounter).toBeVisible();
    const correctCountMatch = (await quizPage.correctCounter.textContent())?.match(/^(\d+) ✓$/);
    const incorrectCountMatch = (await quizPage.incorrectCounter.textContent())?.match(/^(\d+) ✗$/);
    if (!correctCountMatch || !incorrectCountMatch) {
      throw new Error('Submitted answer counters have an unexpected format');
    }
    const correctCount = Number(correctCountMatch[1]);
    const incorrectCount = Number(incorrectCountMatch[1]);
    expect(correctCount + incorrectCount).toBe(1);
    await expect(quizPage.answeredOptionButtons.first()).toBeDisabled();

    // 3. Finish the round before answering all questions.
    await quizPage.finishRound();
    await expect(quizPage.resultStatus).toBeVisible();
    await expect(quizPage.resultTotal).toHaveText('1');
    await expect(quizPage.resultWrong).toHaveText(String(incorrectCount));
    await expect(quizPage.resultCorrect).toHaveText(String(correctCount));
    await expect(quizPage.resultSkipped).toHaveText('9');
    await expect(quizPage.resultPercent).toHaveText(`${correctCount * 10}%`);
    await quizPage.returnHome();
    await expect(landingPage.topicProgress).toHaveText('1/14');
  });
});
