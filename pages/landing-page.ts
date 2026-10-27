import type { Locator, Page } from '@playwright/test';
import { BugHuntPanel } from '../components/bug-hunt-panel';
import { FeedbackDialog } from '../components/feedback-dialog';
import { MockInterviewDialog } from '../components/mock-interview-dialog';
import { QuestionCountDialog } from '../components/question-count-dialog';

export type TopicSlug = 'testing-theory' | 'ai-in-testing';
export type LandingCategory =
  | 'testing foundations'
  | 'automation & tools'
  | 'languages'
  | 'backend & data'
  | 'modern QA'
  | 'основи тестування'
  | 'автоматизація та інструменти'
  | 'мови'
  | 'backend та дані';

const categoryLabels: Record<LandingCategory, string> = {
  'testing foundations': 'testing foundations',
  'automation & tools': 'automation & tools',
  languages: 'languages',
  'backend & data': 'backend & data',
  'modern QA': 'modern QA',
  'основи тестування': 'основи тестування',
  'автоматизація та інструменти': 'автоматизація та інструменти',
  мови: 'мови',
  'backend та дані': 'backend та дані',
};

export class LandingPage {
  get title(): Page {
    return this.page;
  }

  get bestScoreLabel() {
    return this.page.getByText('best score', { exact: true });
  }

  get bestScoreValue() {
    return this.bestScoreLabel.locator('..');
  }

  get ukrainianBestScoreLabel() {
    return this.page.getByText('найкращий результат', { exact: true });
  }

  get sessionsPlayedLabel() {
    return this.page.getByText('sessions played', { exact: true });
  }

  get sessionsPlayedValue() {
    return this.sessionsPlayedLabel.locator('..');
  }

  get ukrainianSessionsPlayedLabel() {
    return this.page.getByText('сесій зіграно', { exact: true });
  }

  get topicsCoveredLabel() {
    return this.page.getByText('topics covered', { exact: true });
  }

  get ukrainianTopicsCoveredLabel() {
    return this.page.getByText('тем пройдено', { exact: true });
  }

  get topicsCoveredCount() {
    return this.page.getByText('0/14', { exact: true });
  }

  get topicProgress() {
    return this.page.getByText(/^\d+\/14$/);
  }

  get topicButtons() {
    return this.page.getByRole('button', { name: /\.spec/ });
  }

  get fullSuiteButton() {
    return this.page.getByRole('button', { name: /run --mock full-suite/ });
  }

  get challengeButton() {
    return this.page.getByRole('button', { name: 'Challenge a QA friend' });
  }

  get ukrainianChallengeButton() {
    return this.page.getByRole('button', { name: 'Кинути виклик QA другу' });
  }

  get feedbackButton() {
    return this.page.getByRole('button', { name: '--feedback' });
  }

  get englishLanguageButton() {
    return this.page.getByRole('button', { name: '--lang en' });
  }

  get ukrainianLanguageButton() {
    return this.page.getByRole('button', { name: '--lang uk' });
  }

  get mockTopicSummary() {
    return this.page.locator('#mockTopicSummary');
  }

  readonly questionCountDialog: QuestionCountDialog;
  readonly mockInterviewDialog: MockInterviewDialog;
  readonly feedbackDialog: FeedbackDialog;
  readonly bugHuntPanel: BugHuntPanel;

  constructor(private readonly page: Page) {
    this.questionCountDialog = new QuestionCountDialog(page);
    this.mockInterviewDialog = new MockInterviewDialog(page);
    this.feedbackDialog = new FeedbackDialog(page);
    this.bugHuntPanel = new BugHuntPanel(page);
  }

  async open(): Promise<void> {
    await this.page.goto('./');
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }

  async openWithClearedStorage(): Promise<void> {
    await this.page.addInitScript(() => {
      if (!sessionStorage.getItem('quiz-test-storage-cleared')) {
        localStorage.clear();
        sessionStorage.setItem('quiz-test-storage-cleared', 'true');
      }
    });
    await this.open();
  }

  topicButton(topic: TopicSlug): Locator {
    return {
      'testing-theory': this.page.getByRole('button', { name: /testing-theory\.spec/ }),
      'ai-in-testing': this.page.getByRole('button', { name: /ai-in-testing\.spec/ }),
    }[topic];
  }

  async openTopic(topic: TopicSlug): Promise<void> {
    await this.topicButton(topic).click();
  }

  category(name: LandingCategory): Locator {
    return this.page.getByText(categoryLabels[name], { exact: true });
  }

  async openMockInterview(): Promise<void> {
    await this.fullSuiteButton.click();
  }

  async openChallenge(): Promise<void> {
    await this.challengeButton.click();
  }

  async toggleToEnglish(): Promise<void> {
    await this.ukrainianLanguageButton.click();
  }

  async toggleToUkrainian(): Promise<void> {
    await this.englishLanguageButton.click();
  }

  async openFeedback(): Promise<void> {
    await this.feedbackButton.click();
  }
}
