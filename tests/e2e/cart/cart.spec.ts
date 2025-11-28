import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';

test.describe('Feature: Shopping Cart', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
  });

  test('Add a single product to cart', async () => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await expect(await inventoryPage.getBadgeCount()).toBe(1);
  });

  test('Add multiple products to cart', async () => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.addToCartByName('Sauce Labs Bolt T-Shirt');
    await inventoryPage.addToCartByName('Sauce Labs Onesie');
    await expect(await inventoryPage.getBadgeCount()).toBe(3);

    await inventoryPage.openCart();
    await cartPage.goto();
    const items = await cartPage.getCartItemNames();
    expect(items).toContain('Sauce Labs Backpack');
    expect(items).toContain('Sauce Labs Bolt T-Shirt');
    expect(items).toContain('Sauce Labs Onesie');
  });

  test('Remove product from cart on products page', async () => {
    await inventoryPage.addToCartByName('Sauce Labs Bike Light');
    await expect(await inventoryPage.getBadgeCount()).toBe(1);

    await inventoryPage.removeFromCartByName('Sauce Labs Bike Light');
    await expect(await inventoryPage.getBadgeCount()).toBe(0);
  });

  test('Remove product inside cart', async ({ page }) => {
    await inventoryPage.addToCartByName('Sauce Labs Fleece Jacket');
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.openCart();
    await cartPage.goto();

    await cartPage.removeItemByName('Sauce Labs Backpack');
    const items = await cartPage.getCartItemNames();
    expect(items).not.toContain('Sauce Labs Backpack');
    expect(items).toContain('Sauce Labs Fleece Jacket');
    await expect(await inventoryPage.getBadgeCount()).toBe(1);
  });

  test('Cart persists after page refresh', async ({ page }) => {
     await inventoryPage.addToCartByName('Sauce Labs Fleece Jacket');
    await inventoryPage.addToCartByName('Sauce Labs Backpack');

    await page.reload();
    await expect(await inventoryPage.getBadgeCount()).toBe(2);

    await inventoryPage.openCart();
    await cartPage.goto();
    const items = await cartPage.getCartItemNames();
    expect(items.length).toBe(2);
    expect(items[0]).toContain('Sauce Labs Fleece Jacket');
    expect(items[1]).toContain('Sauce Labs Backpack');
  });
});
