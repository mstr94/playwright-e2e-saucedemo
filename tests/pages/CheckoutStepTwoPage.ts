import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutStepTwoPage extends BasePage {
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.itemTotal = page.locator('.summary_subtotal_label');
    this.tax = page.locator('.summary_tax_label');
    this.total = page.locator('.summary_total_label');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/checkout-step-two.html');
  }

  async getItemTotal(): Promise<number> {
    const text = await this.itemTotal.textContent();
    return parseFloat(text!.replace('Item total: $', ''));
  }

  async getTax(): Promise<number> {
    const text = await this.tax.textContent();
    return parseFloat(text!.replace('Tax: $', ''));
  }

  async getTotal(): Promise<number> {
    const text = await this.total.textContent();
    return parseFloat(text!.replace('Total: $', ''));
  }

  async finish() {
    await this.finishButton.click();
  }
}
