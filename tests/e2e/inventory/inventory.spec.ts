import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';

test.describe('Feature: Products list', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    inventoryPage = new InventoryPage(page);
  });

  test('Display of all products', async () => {
    const count = await inventoryPage.getItemCount();
    await expect(count).toBe(6);
  });

  test('Product names are correct', async () => {
    const names = await inventoryPage.getAllNames();
    expect(names.length).toBe(6);
    const expectedNames = [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)'
    ];
    expectedNames.forEach(name => {
      expect(names).toContain(name);
    });
  });

  test('Product prices are correct', async () => {
    const prices = await inventoryPage.getAllPrices();
    expect(prices.length).toBe(6);
    prices.forEach(price => {
      expect(price).toMatch(/^\$\d+\.\d{2}$/);
    });
  });

  test('Product images load correctly', async () => {
    await inventoryPage.checkImagesLoad();
  });

  test('problem_user sees identical product images (visual glitch)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('problem_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);

    const srcs = await page.locator('.inventory_item_img img').evaluateAll(imgs =>
      imgs.map(img => img.getAttribute('src'))
    );

    const allSame = srcs.every(src => src === srcs[0]);
    expect(allSame).toBe(true);
    expect(srcs[0]).toMatch(/sl-404|dog|glitch/i); 
  });
});
