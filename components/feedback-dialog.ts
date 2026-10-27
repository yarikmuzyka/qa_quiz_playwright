import type { Locator, Page } from '@playwright/test';

export class FeedbackDialog {
  readonly title: Locator;
  readonly comment: Locator;
  readonly sendButton: Locator;
  readonly closeButton: Locator;
  readonly stars: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByText('Leave feedback');
    this.comment = page.getByRole('textbox', {
      name: 'What you liked, what could be better...',
    });
    this.sendButton = page.getByRole('button', { name: 'Send →' });
    this.closeButton = page.getByRole('button', { name: '✕' });
    this.stars = page.getByText('★');
  }

  async selectRating(rating: 1 | 2 | 3 | 4 | 5): Promise<void> {
    await this.stars.nth(rating - 1).click();
  }

  async enterComment(comment: string): Promise<void> {
    await this.comment.fill(comment);
  }

  async submit(): Promise<void> {
    await this.sendButton.click();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }
}
