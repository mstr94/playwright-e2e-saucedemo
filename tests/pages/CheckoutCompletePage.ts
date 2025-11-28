import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
  readonly header: Locator;
  readonly text: Locator;
  readonly ponyImage: Locator;

  constructor(page: Page) {
    super(page);
    this.header = page.locator('.complete-header');
    this.text = page.locator('.complete-text');
    this.ponyImage = page.locator('img[alt="Pony Express"]');
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/checkout-complete.html');
  }
}
