import type { Page } from '@playwright/test';

export class QuizPage {
  get progress() {
    return this.page.getByText(/^\d+ \/ \d+$/);
  }

  get correctCounter() {
    return this.page.getByText(/^\d+ ✓$/, { exact: true });
  }

  get incorrectCounter() {
    return this.page.getByText(/^\d+ ✗$/, { exact: true });
  }

  get answerButtons() {
    return this.page.getByRole('button', { name: /^\[ \] [A-D] / });
  }

  get selectedAnswerButton() {
    return this.page.getByRole('button', { name: /^\[x\] [A-D] / });
  }

  get answeredOptionButtons() {
    return this.page.getByRole('button', { name: /^\[.*\] [A-D] / });
  }

  get submitButton() {
    return this.page.getByRole('button', { name: '$ submit →' });
  }

  get finishButton() {
    return this.page.getByRole('button', { name: 'Finish', exact: true });
  }

  get nextQuestionButton() {
    return this.page.getByRole('button', { name: /^\$ (?:next|view report) →$/ });
  }

  get answerFeedback() {
    return this.page.locator('body');
  }

  get resultStatus() {
    return this.page.getByText(/PASSED|FAILED/);
  }

  get resultTotal() {
    return this.page.locator('#resTotal');
  }

  get resultWrong() {
    return this.page.locator('#resWrong');
  }

  get resultCorrect() {
    return this.page.locator('#resCorrect');
  }

  get resultSkipped() {
    return this.page.locator('#resSkipped');
  }

  get resultPercent() {
    return this.page.locator('#resultPercent');
  }

  get homeButton() {
    return this.page.getByRole('button', { name: '← Home' });
  }

  get challengeFriendButton() {
    return this.page.getByRole('button', { name: '$ challenge --friend ↗' });
  }

  constructor(private readonly page: Page) {}

  async selectFirstAnswer(): Promise<void> {
    await this.answerButtons.first().click();
  }

  async submitAnswer(): Promise<void> {
    await this.submitButton.click();
  }

  async advanceToNextQuestion(): Promise<void> {
    await this.nextQuestionButton.click();
  }

  async finishRound(): Promise<void> {
    await this.finishButton.click();
  }

  async openChallengeDialog(): Promise<void> {
    await this.challengeFriendButton.click();
  }

  async returnHome(): Promise<void> {
    await this.homeButton.click();
  }
}
