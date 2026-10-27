import type { Locator, Page } from '@playwright/test';

export class BugHuntPanel {
  readonly title: Locator;
  readonly startButton: Locator;
  readonly missionConsoleTitle: Locator;
  readonly timer: Locator;
  readonly foundCounter: Locator;
  readonly reportButton: Locator;
  readonly endSessionButton: Locator;
  readonly missionText: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByText('Bug Hunt', { exact: true });
    this.startButton = page.getByRole('button', { name: 'START MISSION →' });
    this.missionConsoleTitle = page.getByText('QA Mission Console');
    this.timer = page.locator('#bugTimer');
    this.foundCounter = page.locator('#bugFoundCounter');
    this.reportButton = page.locator('#bugReportTopBtn');
    this.endSessionButton = page.getByRole('button', { name: 'End session' });
    this.missionText = page.getByText(/mission|bug/i).first();
  }

  async startMission(): Promise<void> {
    await this.startButton.press('Enter');
  }
}
