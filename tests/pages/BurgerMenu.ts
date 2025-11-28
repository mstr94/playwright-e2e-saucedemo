import { Page, Locator } from '@playwright/test';

export class BurgerMenu {
  readonly page: Page;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly resetLink: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.resetLink = page.locator('#reset_sidebar_link');
    this.closeButton = page.locator('#react-burger-cross-btn');
  }

  async open() {
    await this.menuButton.click();
    await this.logoutLink.waitFor({ state: 'visible' });
  }

  async logout() {
    await this.open();
    await this.logoutLink.click();
  }

  async resetAppState() {
    await this.open();
    await this.resetLink.click();
    await this.closeButton.click();
  }
}
