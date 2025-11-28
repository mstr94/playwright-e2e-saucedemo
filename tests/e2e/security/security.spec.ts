import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Feature: Security & Access Control', () => {

    const sqlPayloads = [
    "' OR '1'='1",
    "' OR 1=1--",
    "' OR '1'='1'--",
    "' OR ''='",
    "' OR 1=1#",
    "' OR 1=1/*",
    "' OR TRUE--",
    "'; DROP TABLE users;--",
    `" OR ""="`,
    `admin'--`,
    `admin' OR '1'='1`,
    `admin" OR "1"="1`,
    `') OR ('1'='1`,
    `anything' UNION SELECT * FROM users--`,
  ];

  test('Access products page without login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('Access cart page without login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/cart.html');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('Access checkout pages without login', async ({ page }) => {
    const protectedPages = [
      '/checkout-step-one.html',
      '/checkout-step-two.html',
      '/checkout-complete.html'
    ];

    for (const path of protectedPages) {
      await page.goto(`https://www.saucedemo.com${path}`);
      await expect(page).toHaveURL('https://www.saucedemo.com/');
    }
  });

  test('Application rejects SQL injection payloads safely', async ({ page }) => {
    const login = new LoginPage(page);

    for (const payload of sqlPayloads) {
      await login.goto();

      await login.login(payload, payload);

      await expect(login.errorMessage).toBeVisible();
      await expect(login.errorMessage).toContainText(/do not match|invalid/i);
      await expect(page).toHaveURL(/saucedemo\.com\/$/);
    }
  });

  test('Session should be invalidated after logout', async ({ context, page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    const cookiesBefore = await context.cookies();
    expect(cookiesBefore.find(c => c.name === 'session-username')).toBeTruthy();

    await page.locator('#react-burger-menu-btn').click();
    await page.locator('#logout_sidebar_link').click();

    const cookiesAfter = await context.cookies();
    expect(cookiesAfter.find(c => c.name === 'session-username')).toBeFalsy();
  });
});
