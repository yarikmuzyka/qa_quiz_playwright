import type { Locator, Page } from '@playwright/test';
import { ChallengeDialog } from '../components/challenge-dialog';

export class ChallengePage {
  readonly dialog: ChallengeDialog;
  readonly currentPage: Page;
  readonly challengeInviteText: Locator;

  constructor(private readonly page: Page) {
    this.currentPage = page;
    this.challengeInviteText = page.getByText(/challenge/i);
    this.dialog = new ChallengeDialog(page);
  }

  async openInvite(url: string): Promise<void> {
    await this.page.goto(url);
  }
}
