# QA Quiz — End-to-End Test Plan

## Application Overview

Functional and UX coverage for https://yarikmuzyka.github.io/quiz/, a bilingual QA interview-preparation app with 14 topic quizzes, a mock interview mode, challenge links, feedback, score history, and a timed Bug Hunt mission. Each scenario starts from a fresh browser context with application storage cleared, unless explicitly validating persistence or joining a challenge by URL. The public landing page showed 14 topics and 1044+ questions. Bug Hunt launch could not be inspected during planning because its start button repeatedly timed out and the page remained on the landing screen; its scenario is marked for follow-up verification.

## Test Scenarios

### 1. Landing page, localization, and topic selection

**Seed:** `tests/seed.spec.ts`

#### 1.1. Render a fresh landing page and switch languages

**File:** `tests/landing/landing-and-localization.spec.ts`

**Steps:**
  1. Open https://yarikmuzyka.github.io/quiz/ in a fresh browser context with local storage cleared.
    - expect: The page title is “QA Quiz — interview prep for QA engineers”.
    - expect: The landing page shows a best score placeholder, zero sessions played, and 0/14 topics covered.
    - expect: The page lists 14 topic buttons grouped into five topic categories and includes full-suite, challenge-a-friend, feedback, and Bug Hunt entry points.
  2. Click the language toggle once, then click it again.
    - expect: The language toggles between English and Ukrainian on each click.
    - expect: Landing-page labels, category titles, actions, and supporting text update to the selected language without changing the topic set or progress.
    - expect: The language toggle label matches the active locale; no broken or untranslated key is displayed.
  3. Reload the page after selecting Ukrainian.
    - expect: The app opens without an error and displays the expected initial or documented persisted state.
    - expect: The locale is retained or resets consistently with the product's persistence behavior.

#### 1.2. Open a topic and verify supported question-count options

**File:** `tests/landing/topic-round-setup.spec.ts`

**Steps:**
  1. From the fresh landing page, select the testing-theory topic.
    - expect: A topic-specific question-count dialog opens and names the selected topic.
    - expect: The dialog offers the supported 10-question quick, 50-question standard, and 100-question advanced round options.
  2. Close the dialog without starting a round, then open the topic again and choose the 10-question option.
    - expect: Closing returns to the landing page without starting a quiz or changing session progress.
    - expect: Selecting an option starts the intended topic round, and the header shows question 1 of 10 with zero correct and incorrect answers.
  3. Return to the landing page, select a topic with fewer questions than the advanced-round limit, and inspect its count options.
    - expect: Count choices that exceed the available question pool are disabled or otherwise unavailable.
    - expect: A valid count remains selectable; the app does not start a round with more questions than the selected topic can provide.

### 2. Topic quiz, scoring, and results

**Seed:** `tests/seed.spec.ts`

#### 2.1. Answer a topic question correctly and review results

**File:** `tests/quiz/topic-answer-and-results.spec.ts`

**Steps:**
  1. Start a 10-question testing-theory round from a clean state.
    - expect: The first question, four answer choices, progress counter, score counters, and Finish action are visible.
  2. Select an answer without submitting it, then inspect the question state.
    - expect: The chosen answer is visibly selected but the score has not changed.
    - expect: The submit-answer action is available only after an answer is selected.
  3. Submit the selected answer, then try to select another option before moving on.
    - expect: Correctness feedback and an explanation are displayed for the submitted answer.
    - expect: The appropriate correct or incorrect counter increments exactly once.
    - expect: Answer choices are disabled after submission and the next-question action becomes available.
    - expect: A submitted response cannot be changed or counted again.
  4. Advance through the round until all 10 questions have been answered.
    - expect: The question index advances exactly once per accepted answer.
    - expect: The counters remain consistent with submitted answers and never exceed the number answered.
    - expect: The completed round displays a result summary with score, pass/fail status, and answered-question totals.
  5. Return to the landing page.
    - expect: The topic progress and session/best-score metrics update consistently with the completed run.
    - expect: The topic status reflects its result and can be selected again.

#### 2.2. Validate unanswered questions, incorrect answers, and early finish

**File:** `tests/quiz/answer-validation-and-early-finish.spec.ts`

**Steps:**
  1. Start a 10-question topic round and attempt to submit before choosing an answer.
    - expect: No answer is recorded and no score counter changes while no option is selected.
    - expect: The app gives clear guidance or keeps the submit action unavailable.
  2. Select an incorrect answer and submit it.
    - expect: The incorrect answer is clearly identified and the correct answer or explanation is provided.
    - expect: The incorrect counter increments once and the answer is locked against duplicate submission.
  3. Finish the round before answering all questions.
    - expect: The result summary reports attempted, correct, incorrect, and pending questions consistently.
    - expect: The result percentage is calculated from the documented scoring rule and pending questions are not counted as correct.
    - expect: The user can return to the landing page without a crash or duplicate session record.

#### 2.3. Configure a mock interview and enforce selection and count boundaries

**File:** `tests/quiz/mock-interview-topic-selection.spec.ts`

**Steps:**
  1. From a fresh landing page, launch the full-suite/mock interview entry point.
    - expect: A topic-selection dialog lists the available topics and their question counts.
    - expect: The Next action is disabled while no topic is selected, with guidance to choose at least one topic.
  2. Use Select all, then Clear; select only testing theory.
    - expect: Select all marks every listed topic and updates the selected-topic and available-question totals.
    - expect: Clear removes all selections and returns Next to its disabled state.
    - expect: Selecting one topic enables Next and displays the correct selection count and question availability.
  3. Advance to question-count selection for the one-topic selection.
    - expect: The available count choices reflect the selected pool; the 100-question option is unavailable when the selected topic does not contain 100 questions.
    - expect: The selection can be closed without unintentionally starting an interview.
  4. Start a supported interview length and complete at least one question.
    - expect: The interview starts with only questions from the selected topic(s), and progress and scoring behave like a normal quiz.
    - expect: The interview result and return-to-home behavior are available.

### 3. Challenge links and sharing

**Seed:** `tests/seed.spec.ts`

#### 3.1. Create a challenge link from a completed quiz

**File:** `tests/challenge/create-challenge.spec.ts`

**Steps:**
  1. Complete at least one question in a topic round and open the result action to challenge a friend.
    - expect: A challenge dialog opens and shows the topic, question count, and creator score.
    - expect: The nickname field and start-challenge action are visible.
  2. Leave the nickname blank and start challenge creation.
    - expect: The app either clearly validates a required nickname or uses its documented default nickname; it does not fail silently.
    - expect: Challenge creation produces a visible confirmation and a non-empty URL containing challenge data when defaults are permitted.
  3. Use the copy-link action and inspect the displayed URL.
    - expect: The URL corresponds to the selected topic and question set and is usable to open the same quiz on a separate clean context.
    - expect: Copy feedback is shown, or a clear error is shown if clipboard access is unavailable.
  4. Close the dialog and open the generated challenge URL in a separate fresh context.
    - expect: The invitee sees the matching challenge setup and can begin without inheriting the creator's browser storage.
    - expect: Invalid or missing challenge data produces a safe, understandable fallback rather than a broken screen.

#### 3.2. Create a new challenge directly from the landing page

**File:** `tests/challenge/create-from-home.spec.ts`

**Steps:**
  1. Click the landing-page challenge-a-friend action from a fresh state.
    - expect: A challenge setup flow opens without requiring a previously completed quiz.
    - expect: A topic or question set can be selected or is clearly preconfigured.
  2. Complete the required setup and create an invite.
    - expect: A shareable challenge link is displayed and can be copied or shared.
    - expect: The invitee flow loads the intended question set and reports results for comparison.

### 4. Feedback and special mission

**Seed:** `tests/seed.spec.ts`

#### 4.1. Submit feedback with a rating and optional comment

**File:** `tests/feedback/feedback-dialog.spec.ts`

**Steps:**
  1. Open the feedback dialog from the landing page.
    - expect: The feedback dialog has a title, a five-star rating control, an optional comment field, a submit action, and a close action.
  2. Try to submit without selecting a rating or entering a comment.
    - expect: The app clearly indicates any required rating validation and does not show a false success state.
  3. Select a rating, enter a short comment, and submit.
    - expect: The selected rating is visually represented.
    - expect: The comment is accepted as optional text, and a clear success confirmation or actionable submission error is shown.
    - expect: The dialog closes or provides a clear way to finish after submission.
  4. Reopen the feedback dialog and close it without submitting.
    - expect: The dialog closes cleanly and no feedback-success state is shown for the abandoned form.

#### 4.2. Start and complete or time out the Bug Hunt mission

**File:** `tests/bug-hunt/bug-hunt-mission.spec.ts`

**Steps:**
  1. From a clean landing page, activate Start Mission in the Bug Hunt panel.
    - expect: The mission opens promptly rather than hanging or leaving the button unresponsive.
    - expect: The demo shop, mission instructions, visible 10-minute timer, and 0/10 bug counter are presented.
  2. Explore the demo shop using its visible navigation and interactions; identify a seeded defect using the mission instructions and report it through the intended controls.
    - expect: Shop interactions are usable and each correctly identified seeded bug advances the counter once.
    - expect: Unrelated actions or duplicate reports do not inflate the bug count.
    - expect: The timer remains visible and decreases while the mission is active.
  3. Continue until all bugs are found, or allow the timer to expire in a controlled test.
    - expect: Finding all 10 bugs shows a completion summary with the correct count and elapsed time.
    - expect: Timer expiry ends or clearly marks the mission as timed out and reports the number of bugs found.
    - expect: The user can leave or restart the mission without stale timer state.
