import { expect, test } from '../../fixtures/test';

test.describe('Render a fresh landing page and switch languages', () => {
  test('Render a fresh landing page and switch languages', async ({ landingPage }) => {
    // 1. Open the landing page in a fresh browser context with local storage cleared.
    await landingPage.openWithClearedStorage();
    await expect(landingPage.title).toHaveTitle('QA Quiz — interview prep for QA engineers');
    await expect(landingPage.bestScoreLabel).toBeVisible();
    await expect(landingPage.bestScoreValue).toContainText('—');
    await expect(landingPage.sessionsPlayedLabel).toBeVisible();
    await expect(landingPage.sessionsPlayedValue).toContainText('0');
    await expect(landingPage.topicsCoveredCount).toBeVisible();
    await expect(landingPage.topicsCoveredLabel).toBeVisible();
    await expect(landingPage.topicButtons).toHaveCount(14);
    const initialTopics = await landingPage.topicButtons.allTextContents();
    for (const category of [
      'testing foundations',
      'automation & tools',
      'languages',
      'backend & data',
      'modern QA',
    ] as const) {
      await expect(landingPage.category(category)).toBeVisible();
    }
    await expect(landingPage.fullSuiteButton).toBeVisible();
    await expect(landingPage.challengeButton).toBeVisible();
    await expect(landingPage.feedbackButton).toBeVisible();
    await expect(landingPage.bugHuntPanel.title).toBeVisible();
    await expect(landingPage.bugHuntPanel.startButton).toBeVisible();

    // 2. Click the language toggle twice and verify each locale and the unchanged topic set and progress.
    await landingPage.toggleToUkrainian();
    await expect(landingPage.englishLanguageButton).toBeVisible();
    await expect(landingPage.ukrainianBestScoreLabel).toBeVisible();
    await expect(landingPage.ukrainianSessionsPlayedLabel).toBeVisible();
    await expect(landingPage.ukrainianTopicsCoveredLabel).toBeVisible();
    await expect(landingPage.ukrainianChallengeButton).toBeVisible();
    for (const category of [
      'основи тестування',
      'автоматизація та інструменти',
      'мови',
      'backend та дані',
      'modern QA',
    ] as const) {
      await expect(landingPage.category(category)).toBeVisible();
    }
    await expect(landingPage.topicButtons).toHaveCount(14);
    expect(await landingPage.topicButtons.allTextContents()).toEqual(initialTopics);
    await expect(landingPage.topicsCoveredCount).toBeVisible();
    await landingPage.toggleToEnglish();
    await expect(landingPage.ukrainianLanguageButton).toBeVisible();
    await expect(landingPage.bestScoreLabel).toBeVisible();
    await expect(landingPage.challengeButton).toBeVisible();
    await expect(landingPage.topicButtons).toHaveCount(14);
    expect(await landingPage.topicButtons.allTextContents()).toEqual(initialTopics);
    await expect(landingPage.topicsCoveredCount).toBeVisible();

    // 3. Select Ukrainian and reload the page, then verify the app and persisted locale and progress.
    await landingPage.toggleToUkrainian();
    await expect(landingPage.englishLanguageButton).toBeVisible();
    await landingPage.reload();
    await expect(landingPage.title).toHaveTitle('QA Quiz — interview prep for QA engineers');
    await expect(landingPage.englishLanguageButton).toBeVisible();
    await expect(landingPage.ukrainianBestScoreLabel).toBeVisible();
    await expect(landingPage.topicsCoveredCount).toBeVisible();
    await expect(landingPage.topicButtons).toHaveCount(14);
  });
});
