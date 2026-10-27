import { expect, test } from '../fixtures/test';

test.describe('Example generated test', () => {
  test('Open the landing page', async ({ landingPage }) => {
    // 1. Open the landing page.
    await landingPage.open();

    // 2. Verify the page title.
    await expect(landingPage.title).toHaveTitle('QA Quiz — interview prep for QA engineers');
  });
});
