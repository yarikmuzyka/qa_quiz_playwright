import type { Locator, Page } from '@playwright/test';
import { QuestionCountDialog } from './question-count-dialog';

export class MockInterviewDialog {
  readonly topicsTitle: Locator;
  readonly questionCountTitle: Locator;
  readonly questionCountDialog: QuestionCountDialog;
  readonly topicCheckboxes: Locator;
  readonly nextButton: Locator;
  readonly selectAllButton: Locator;
  readonly clearButton: Locator;
  readonly selectionHint: Locator;
  readonly testingTheoryCheckbox: Locator;

  constructor(private readonly page: Page) {
    this.topicsTitle = page.getByText('Mock Interview — topics');
    this.questionCountTitle = page.getByText('Mock Interview — question count');
    this.questionCountDialog = new QuestionCountDialog(page);
    this.topicCheckboxes = page.getByRole('checkbox');
    this.nextButton = page.getByRole('button', { name: 'Next →' });
    this.selectAllButton = page.getByRole('button', { name: 'select all' });
    this.clearButton = page.getByRole('button', { name: 'clear' });
    this.selectionHint = page.getByText('Choose at least one topic');
    this.testingTheoryCheckbox = page.getByRole('checkbox', {
      name: 'Testing Theory 55',
    });
  }

  async selectAllTopics(): Promise<void> {
    await this.selectAllButton.click();
  }

  async clearTopics(): Promise<void> {
    await this.clearButton.click();
  }

  async selectTestingTheory(): Promise<void> {
    await this.testingTheoryCheckbox.click();
  }

  async continueToQuestionCount(): Promise<void> {
    await this.nextButton.click();
  }
}
