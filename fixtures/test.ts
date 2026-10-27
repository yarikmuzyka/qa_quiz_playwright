import { test as base, expect } from '@playwright/test';
import { ChallengePage } from '../pages/challenge-page';
import { LandingPage } from '../pages/landing-page';
import { QuizPage } from '../pages/quiz-page';

type PageFixtures = {
  challengePage: ChallengePage;
  landingPage: LandingPage;
  quizPage: QuizPage;
};

export const test = base.extend<PageFixtures>({
  challengePage: async ({ page }, use) => {
    await use(new ChallengePage(page));
  },
  landingPage: async ({ page }, use) => {
    await use(new LandingPage(page));
  },
  quizPage: async ({ page }, use) => {
    await use(new QuizPage(page));
  },
});

export { expect };
