import { test, expect } from '@playwright/test';

test.describe('Render a fresh landing page and switch languages', () => {
  test('Render a fresh landing page and switch languages', async ({ page }) => {
    // 1. Open the landing page in a fresh browser context with local storage cleared.
    await page.addInitScript(() => {
      if (!sessionStorage.getItem('quiz-test-storage-cleared')) {
        localStorage.clear();
        sessionStorage.setItem('quiz-test-storage-cleared', 'true');
      }
    });
    await page.goto('https://yarikmuzyka.github.io/quiz/');

    await expect(page).toHaveTitle('QA Quiz — interview prep for QA engineers');
    await expect(page.getByText('best score', { exact: true })).toBeVisible();
    await expect(page.getByText('best score', { exact: true }).locator('..')).toContainText('—');
    await expect(page.getByText('sessions played', { exact: true })).toBeVisible();
    await expect(page.getByText('sessions played', { exact: true }).locator('..')).toContainText('0');
    await expect(page.getByText('0/14', { exact: true })).toBeVisible();
    await expect(page.getByText('topics covered', { exact: true })).toBeVisible();

    const topicButtons = page.getByRole('button', { name: /\.spec/ });
    await expect(topicButtons).toHaveCount(14);
    const initialTopics = await topicButtons.allTextContents();

    for (const category of [
      'testing foundations',
      'automation & tools',
      'languages',
      'backend & data',
      'modern QA',
    ]) {
      await expect(page.getByText(category, { exact: true })).toBeVisible();
    }
    await expect(page.getByRole('button', { name: /full-suite/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Challenge a QA friend' })).toBeVisible();
    await expect(page.getByRole('button', { name: '--feedback' })).toBeVisible();
    await expect(page.getByText('Bug Hunt', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'START MISSION →' })).toBeVisible();

    // 2. Click the language toggle twice and verify each locale and the unchanged topic set and progress.
    await page.getByRole('button', { name: '--lang en' }).click();
    await expect(page.getByRole('button', { name: '--lang uk' })).toBeVisible();
    await expect(page.getByText('найкращий результат', { exact: true })).toBeVisible();
    await expect(page.getByText('сесій зіграно', { exact: true })).toBeVisible();
    await expect(page.getByText('тем пройдено', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Кинути виклик QA другу' })).toBeVisible();
    for (const category of [
      'основи тестування',
      'автоматизація та інструменти',
      'мови',
      'backend та дані',
      'modern QA',
    ]) {
      await expect(page.getByText(category, { exact: true })).toBeVisible();
    }
    await expect(topicButtons).toHaveCount(14);
    expect(await topicButtons.allTextContents()).toEqual(initialTopics);
    await expect(page.getByText('0/14', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: '--lang uk' }).click();
    await expect(page.getByRole('button', { name: '--lang en' })).toBeVisible();
    await expect(page.getByText('best score', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Challenge a QA friend' })).toBeVisible();
    await expect(topicButtons).toHaveCount(14);
    expect(await topicButtons.allTextContents()).toEqual(initialTopics);
    await expect(page.getByText('0/14', { exact: true })).toBeVisible();

    // 3. Select Ukrainian and reload the page, then verify the app and persisted locale and progress.
    await page.getByRole('button', { name: '--lang en' }).click();
    await expect(page.getByRole('button', { name: '--lang uk' })).toBeVisible();
    await page.reload();

    await expect(page).toHaveTitle('QA Quiz — interview prep for QA engineers');
    await expect(page.getByRole('button', { name: '--lang uk' })).toBeVisible();
    await expect(page.getByText('найкращий результат', { exact: true })).toBeVisible();
    await expect(page.getByText('0/14', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /\.spec/ })).toHaveCount(14);
  });
});
