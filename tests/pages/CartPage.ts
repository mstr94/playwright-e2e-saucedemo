import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartBadge: Locator;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly removeButtons: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('.inventory_item_name');
    this.removeButtons = page.locator('[data-test^="remove-"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/cart.html');
  }

  async getBadgeCount(): Promise<number> {
    await this.cartBadge.waitFor({ state: 'visible', timeout: 5000 }).catch(() => null);
    if (await this.cartBadge.isVisible()) {
      return parseInt(await this.cartBadge.textContent() || '0');
    }
    return 0;
  }

  async getCartItemNames() {
    return await this.cartItemNames.allTextContents();
  }

  async removeItemByName(productName: string) {
    const kebabName = productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+$/, '');

    const removeButton = this.page.locator(`[id="remove-${kebabName}"]`);
    await removeButton.click();
  }
}
