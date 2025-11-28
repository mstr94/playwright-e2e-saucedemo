import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';

test.describe('Feature: Product sorting', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    inventoryPage = new InventoryPage(page);
  });

  test('Sort A to Z', async () => {
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.getAllNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('Sort Z to A', async () => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getAllNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('Sort Price Low to High', async () => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getAllPricesAsNumbers();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('Sort Price High to Low', async () => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getAllPricesAsNumbers();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test('Default sort is A to Z', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    const inv = new InventoryPage(page);
    const names = await inv.getAllNames();
    const expectedDefault = [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)'
    ];
    expect(names).toEqual(expectedDefault);
  });
});
