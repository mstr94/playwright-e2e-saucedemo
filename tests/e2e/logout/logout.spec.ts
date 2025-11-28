import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { BurgerMenu } from '../../pages/BurgerMenu';

test.describe('Feature: User logout', () => {
  let burgerMenu: BurgerMenu;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    burgerMenu = new BurgerMenu(page);
  });

  test('Successful logout', async ({ page }) => {
    await burgerMenu.logout();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('Back button after logout – should not access inventory', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await burgerMenu.logout();
    await page.goBack();

    await expect(page).toHaveURL('https://www.saucedemo.com/', { timeout: 10000 });

    await page.goto('https://www.saucedemo.com/inventory.html', { waitUntil: 'networkidle' });
    await page.goto('https://www.saucedemo.com/inventory.html', { waitUntil: 'networkidle' });
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('Reset App State clears cart', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await burgerMenu.resetAppState();

    await expect(page.locator('.shopping_cart_badge')).toBeHidden();
  });
});