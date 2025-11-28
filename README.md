# Playwright E2E – SauceDemo (100 % coverage + edge cases)

![Playwright Tests](https://github.com/mstr94/playwright-e2e-saucedemo/actions/workflows/playwright.yml/badge.svg?branch=main)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-latest-45ba4b?logo=playwright)

Public demo / personal playground showcasing modern end-to-end test automation in 2025.

### What’s already done (full SauceDemo coverage)
- Clean Page Object Model (Login / Inventory / Cart / Checkout / BurgerMenu)
- Gherkin-style, human-readable tests
- Complete user flows: login → inventory → sorting → cart → checkout (with tax calculation) → logout
- All built-in users covered:
  - `standard_user`
  - `locked_out_user`
  - `problem_user` (visual glitch – all images identical)
  - `performance_glitch_user`
- Security tests: direct URL access, SQLi & XSS attempts, session invalidation on logout
- Universal add/remove by product name (kebab-case ID generation – no hard-coded locators)
- CI/CD: GitHub Actions (sharded, video recording, trace viewer, public HTML report on GitHub Pages)

### Live HTML report (latest run)
https://mstr94.github.io/playwright-e2e-saucedemo/

### Why this repo exists
Portfolio piece + personal sandbox.  
I’ll keep adding crazy edge cases, visual testing, API interception, accessibility checks, component testing, load testing with Playwright, etc. whenever I have free time.

Goal: always have a live, green, public project I can show any recruiter in 30 seconds and immediately stand out.

### Run locally
```bash
git clone https://github.com/mstr94/playwright-e2e-saucedemo.git
cd playwright-e2e-saucedemo
npm ci
npx playwright install --with-deps

npx playwright test          # headless
npx playwright test --headed # headed mode
npx playwright test --ui     # UI Mode (new hotness)
