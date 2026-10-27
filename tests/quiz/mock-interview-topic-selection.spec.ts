// spec: tests/quiz.plan.md
// seed: tests/seed.spec.ts
import { expect, test } from '../../fixtures/test';

test.describe('Topic quiz, scoring, and results', () => {
  test('Configure a mock interview and enforce selection and count boundaries', async ({
    landingPage,
    quizPage,
  }) => {
    // 1. From a fresh landing page, launch the full-suite/mock interview entry point.
    await landingPage.open();
    await landingPage.openMockInterview();
    const interviewDialog = landingPage.mockInterviewDialog;
    await expect(interviewDialog.topicsTitle).toBeVisible();
    await expect(interviewDialog.topicCheckboxes).toHaveCount(14);
    await expect(interviewDialog.nextButton).toBeDisabled();
    await expect(interviewDialog.selectionHint).toBeVisible();

    // 2. Use Select all, then Clear; select only testing theory.
    await interviewDialog.selectAllTopics();
    for (let index = 0; index < 14; index += 1) {
      await expect(interviewDialog.topicCheckboxes.nth(index)).toBeChecked();
    }
    await expect(interviewDialog.nextButton).toBeEnabled();
    await interviewDialog.clearTopics();
    for (let index = 0; index < 14; index += 1) {
      await expect(interviewDialog.topicCheckboxes.nth(index)).not.toBeChecked();
    }
    await expect(interviewDialog.nextButton).toBeDisabled();
    await interviewDialog.selectTestingTheory();
    await expect(interviewDialog.nextButton).toBeEnabled();

    // 3. Advance to question-count selection for the one-topic selection.
    await interviewDialog.continueToQuestionCount();
    await expect(interviewDialog.questionCountTitle).toBeVisible();
    await expect(interviewDialog.questionCountDialog.countButton(100)).toBeDisabled();
    await interviewDialog.questionCountDialog.close();
    await expect(interviewDialog.questionCountTitle).toBeHidden();

    // 4. Start a supported interview length and complete at least one question.
    await landingPage.openMockInterview();
    await landingPage.mockInterviewDialog.selectTestingTheory();
    await landingPage.mockInterviewDialog.continueToQuestionCount();
    await landingPage.mockInterviewDialog.questionCountDialog.selectCount(10);
    await expect(quizPage.progress).toHaveText('1 / 10');
    await expect(quizPage.answerButtons).toHaveCount(4);
    await quizPage.selectFirstAnswer();
    await quizPage.submitAnswer();
    await expect(quizPage.correctCounter).toBeVisible();
    await expect(quizPage.incorrectCounter).toBeVisible();
    await quizPage.finishRound();
    await expect(quizPage.resultStatus).toBeVisible();
    await quizPage.returnHome();
    await expect(landingPage.mockTopicSummary).toContainText('1/14 topics');
  });
});
