import type { Locator, Page } from '@playwright/test';

export type QuestionCount = 10 | 50 | 100;

export class QuestionCountDialog {
  readonly title: Locator;
  readonly closeButton: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByText(/— question count$/);
    this.closeButton = page.getByRole('button', { name: '✕' });
  }

  countButton(count: QuestionCount): Locator {
    const label: Record<QuestionCount, string> = {
      10: '10 quick round',
      50: '50 standard',
      100: '100 deep dive',
    };
    return this.page.getByRole('button', { name: label[count], exact: true });
  }

  async selectCount(count: QuestionCount): Promise<void> {
    await this.countButton(count).click();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }
}
