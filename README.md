# Практика Playwright + TypeScript

Навчальний проєкт для практики автоматизації тестування з Playwright та TypeScript.

## Як створено тести

Тести повністю згенеровані AI-агентами у VS Code через Playwright MCP. MCP надає агентам інструменти для дослідження сайту та взаємодії з браузером; код тестів створює AI.

Для роботи налаштовано три агенти: **Planner** — підготовка тест-плану, **Generator** — генерація тестів, **Healer** — аналіз і виправлення падінь.

Мета проєкту — дослідити цей процес і практикувати перевірку та розуміння згенерованих тестів. Для запуску готових тестів MCP та AI-підписка не потрібні.

## Встановлення

Потрібен Node.js 22 або новіший підтримуваний LTS.

```bash
npm ci
npx playwright install
```

## Запуск

```bash
npm test                  # Тести у Chromium
npm run test:all          # Chromium, Firefox, WebKit
npm run test:headed       # Тести з відкритими браузерами
npm run test:ui           # Інтерактивний інтерфейс Playwright
npm run test:debug        # Покрокове налагодження
npm run typecheck         # Перевірка TypeScript
npm run report            # HTML-звіт останнього запуску
```

Окремий браузер або файл:

```bash
npm test -- --project=chromium
npm test -- tests/example.spec.ts --project=chromium
```

Генерація тесту через запис дій у браузері:

```bash
npm run codegen -- https://example.com
```

## Структура

- `tests/example.spec.ts` — перший тест із локальною HTML-сторінкою, локаторами, кліком і перевірками.
- `playwright.config.ts` — браузери, повторні спроби в CI та звіти.
- `tsconfig.json` — сувора перевірка типів TypeScript.

Додавай нові тести у `tests/` з назвою `*.spec.ts`.
Playwright автоматично запускає TypeScript-тести, але перевірку типів потрібно запускати окремо через `npm run typecheck`.
