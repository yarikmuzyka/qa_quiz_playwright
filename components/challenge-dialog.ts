import type { Locator, Page } from '@playwright/test';

export class ChallengeDialog {
  readonly createTitle: Locator;
  readonly challengeReadyTitle: Locator;
  readonly testingTheoryLabel: Locator;
  readonly testingTheoryCheckbox: Locator;
  readonly tenQuestionButton: Locator;
  readonly nickname: Locator;
  readonly startButton: Locator;
  readonly challengeLink: Locator;
  readonly copyLinkButton: Locator;
  readonly closeButton: Locator;
  readonly createFromLandingButton: Locator;

  constructor(private readonly page: Page) {
    this.createTitle = page.getByText('Create challenge');
    this.challengeReadyTitle = page.getByText('Challenge ready');
    this.testingTheoryLabel = page.getByText('Testing Theory', { exact: true }).last();
    this.testingTheoryCheckbox = page.getByRole('checkbox', {
      name: 'Testing Theory',
    });
    this.tenQuestionButton = page.getByRole('button', { name: '10', exact: true });
    this.nickname = page.locator('#challengeNickname');
    this.startButton = page.getByRole('button', { name: 'START CHALLENGE →' });
    this.challengeLink = page.getByRole('textbox', { name: 'Challenge link' });
    this.copyLinkButton = page.getByRole('button', { name: 'COPY CHALLENGE LINK' });
    this.closeButton = page.getByRole('button', { name: '✕' });
    this.createFromLandingButton = page.locator('#challengeCreateSubmit');
  }

  async selectFirstLandingTopic(): Promise<void> {
    await this.page.locator('#challengeTopicList input[type="checkbox"]').first().check();
  }

  async selectTestingTheory(): Promise<void> {
    await this.testingTheoryCheckbox.click();
  }

  async selectTenQuestions(): Promise<void> {
    await this.tenQuestionButton.click();
  }

  async enterNickname(nickname: string): Promise<void> {
    await this.nickname.fill(nickname);
  }

  async startChallenge(): Promise<void> {
    await this.startButton.click();
  }

  async copyChallengeLink(): Promise<void> {
    await this.copyLinkButton.click();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }

  async createFromLanding(): Promise<void> {
    await this.createFromLandingButton.click();
  }
}
