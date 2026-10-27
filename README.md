# Практика Playwright + TypeScript

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
