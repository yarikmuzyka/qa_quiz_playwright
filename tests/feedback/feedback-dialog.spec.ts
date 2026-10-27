// spec: tests/quiz.plan.md
// seed: tests/seed.spec.ts
import { expect, test } from '../../fixtures/test';

test.describe('Feedback and special mission', () => {
  test('Submit feedback with a rating and optional comment', async ({ landingPage }) => {
    const feedbackDialog = landingPage.feedbackDialog;

    // 1. Open the feedback dialog from the landing page.
    await landingPage.open();
    await landingPage.openFeedback();
    await expect(feedbackDialog.title).toBeVisible();
    await expect(feedbackDialog.comment).toBeVisible();
    await expect(feedbackDialog.sendButton).toBeVisible();
    await expect(feedbackDialog.closeButton).toBeVisible();
    await expect(feedbackDialog.stars).toHaveCount(5);

    // 2. Try to submit without selecting a rating or entering a comment.
    await feedbackDialog.submit();
    await expect(feedbackDialog.title).toBeHidden();

    // 3. Select a rating, enter a short comment, and submit.
    await landingPage.openFeedback();
    await feedbackDialog.selectRating(5);
    await feedbackDialog.enterComment('The quiz is clear and useful.');
    await expect(feedbackDialog.comment).toHaveValue('The quiz is clear and useful.');
    await feedbackDialog.submit();
    await expect(feedbackDialog.title).toBeHidden();

    // 4. Reopen the feedback dialog and close it without submitting.
    await landingPage.openFeedback();
    await expect(feedbackDialog.title).toBeVisible();
    await feedbackDialog.close();
    await expect(feedbackDialog.title).toBeHidden();
  });
});
