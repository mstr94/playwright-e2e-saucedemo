import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Feature: User Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Successful login with valid credentials', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);
  });

  test('Login with empty username and password', async () => {
    await loginPage.loginWithEmptyFields();
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('Login with empty password', async () => {
    await loginPage.usernameInput.fill('standard_user');
    await loginPage.loginWithEmptyFields();
    await expect(loginPage.errorMessage).toContainText('Password is required');
  });

  test('Login with empty username', async () => {
    await loginPage.passwordInput.fill('secret_sauce');
    await loginPage.loginWithEmptyFields();
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('Login with invalid password', async () => {
    await loginPage.login('standard_user', 'wrong_pass');
    await expect(loginPage.errorMessage).toContainText('do not match');
  });

  test('Login with locked_out_user', async () => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
  });

  test('Login with problem_user – all product images are identical (visual regression)', async ({ page }) => {
    await loginPage.login('problem_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);

    const srcs = await page.locator('.inventory_item_img img').evaluateAll(
      imgs => imgs.map(img => img.getAttribute('src'))
    );

    const allSame = srcs.every(src => src === srcs[0]);
    expect(allSame, 'All product images should be the same for problem_user').toBe(true);
    expect(srcs[0]).toMatch(/404|dog|glitch/i);
  });

  test('Login as performance_glitch_user – slow load', async ({ page }) => {
    const start = Date.now();
    await loginPage.login('performance_glitch_user', 'secret_sauce');
    const loadTime = Date.now() - start;
    await expect(page).toHaveURL(/inventory/);
    expect(loadTime).toBeGreaterThan(3000);
  });
});
