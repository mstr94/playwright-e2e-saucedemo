import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutStepOnePage } from '../../pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../../pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../../pages/CheckoutCompletePage';

test.describe('Feature: Checkout Process - happy path', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let stepOne: CheckoutStepOnePage;
  let stepTwo: CheckoutStepTwoPage;
  let complete: CheckoutCompletePage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    stepOne = new CheckoutStepOnePage(page);
    stepTwo = new CheckoutStepTwoPage(page);
    complete = new CheckoutCompletePage(page);

    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.addToCartByName('Sauce Labs Bolt T-Shirt');
    await inventoryPage.addToCartByName('Sauce Labs Onesie');
    await inventoryPage.openCart();
  });

  test('Begin checkout with items in cart', async ({ page }) => {
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/checkout-step-one/);
  });

  test('Missing checkout information', async ({ page }) => {
    await page.locator('[data-test="checkout"]').click();
    await stepOne.continueWithEmpty();
    await expect(stepOne.errorMessage).toContainText('First Name is required');
  });

  test('Continue checkout with valid data', async ({ page }) => {
    await page.locator('[data-test="checkout"]').click();
    await stepOne.fillInformation('John', 'Doe', '12345');
    await stepOne.continue();
    await expect(page).toHaveURL(/checkout-step-two/);
  });

  test('Verify order overview prices', async ({ page }) => {
    await page.locator('[data-test="checkout"]').click();
    await stepOne.fillInformation('John', 'Doe', '12345');
    await stepOne.continue();

    const itemTotal = await stepTwo.getItemTotal();
    const tax = await stepTwo.getTax();
    const total = await stepTwo.getTotal();

    expect(itemTotal).toBe(53.97);
    expect(tax).toBeCloseTo(4.32, 2);
    expect(total).toBeCloseTo(58.29, 2);
  });

  test('Finish checkout', async ({ page }) => {
    await page.locator('[data-test="checkout"]').click();
    await stepOne.fillInformation('Test', 'User', '00-001');
    await stepOne.continue();
    await stepTwo.finish();

    await expect(complete.header).toHaveText('Thank you for your order!');
    await expect(complete.text).toContainText('Your order has been dispatched');
    await expect(complete.ponyImage).toBeVisible();
  });
});
