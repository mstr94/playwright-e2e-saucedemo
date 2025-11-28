import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly inventoryItems: Locator;
  readonly inventoryItemNames: Locator;
  readonly inventoryItemPrices: Locator;
  readonly inventoryItemImages: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryItems = page.locator('.inventory_item');
    this.inventoryItemNames = page.locator('.inventory_item_name');
    this.inventoryItemPrices = page.locator('.inventory_item_price');
    this.inventoryItemImages = page.locator('.inventory_item_img img');
    this.sortDropdown = page.locator('.product_sort_container');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async addToCartByName(productName: string) {
    const kebabName = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
    await this.page.locator(`[id="add-to-cart-${kebabName}"]`).click();
  }

  async removeFromCartByName(productName: string) {
    const kebabName = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
    await this.page.locator(`[id="remove-${kebabName}"]`).click();
  }

  async openCart() {
    await this.page.locator('.shopping_cart_link').click();
  }

  async getBadgeCount(): Promise<number> {
    await this.cartBadge.waitFor({ state: 'visible', timeout: 5000 }).catch(() => null);
    if (await this.cartBadge.isVisible()) {
      return parseInt(await this.cartBadge.textContent() || '0', 10);
    }
    return 0;
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption({ value: option });
  }

  async getItemCount() { return await this.inventoryItems.count(); }
  async getAllNames() { return await this.inventoryItemNames.allTextContents(); }
  async getAllPrices() { return await this.inventoryItemPrices.allTextContents(); }
  async getAllPricesAsNumbers(): Promise<number[]> {
    const prices = await this.getAllPrices();
    return prices.map(p => parseFloat(p.replace('$', '')));
  }

  async getAllImageSrcs() {
    return await this.inventoryItemImages.evaluateAll(imgs =>
      imgs.map(img => (img as HTMLImageElement).src)
    );
  }

  async checkImagesLoad(): Promise<void> {
    const images = this.inventoryItemImages;
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const imgLocator = images.nth(i);

      await imgLocator.scrollIntoViewIfNeeded();

      const handle = await imgLocator.elementHandle();
    if (!handle) {
      throw new Error(`Nie znaleziono elementu img dla indexu ${i}`);
    }

    // Wymuszenie ładowania obrazka - obsługa lazy load
    await handle.evaluate((el: HTMLElement) => {
      const img = el as HTMLImageElement;

      // Jeśli ma data-src / data-lazy / data-original
      const dataSrc =
        img.getAttribute("data-src") ||
        img.getAttribute("data-lazy") ||
        img.getAttribute("data-original");

      if ((!img.src || img.src === window.location.href) && dataSrc) {
        img.src = dataSrc;
      }

      // Czasem loading="lazy" blokuje ładowanie w headless
      if (img.hasAttribute("loading")) {
        img.removeAttribute("loading");
      }
    });

    // Czekaj aż obrazek się załaduje
    try {
      await this.page.waitForFunction(
        (el) => {
          const img = el as HTMLImageElement;
          return img.complete && img.naturalWidth > 0 && img.naturalHeight > 0;
        },
        handle,
        { timeout: 7000 }
      );
    } catch {
      const info = await handle.evaluate((el: HTMLElement) => {
        const img = el as HTMLImageElement;
        return {
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          src: img.src,
          dataset: { ...img.dataset }
        };
      });

      throw new Error(
        `❌ Image failed to load (index ${i}): ${info.src}\n` +
        `Details: ${JSON.stringify(info, null, 2)}`
      );
    }

    const final = await handle.evaluate((el: HTMLElement) => {
      const img = el as HTMLImageElement;
      return {
        complete: img.complete,
        w: img.naturalWidth,
        h: img.naturalHeight,
        src: img.src
      };
    });

    expect(
      final.complete && final.w > 0 && final.h > 0,
      `❌ Image seems broken: ${final.src}`
    ).toBe(true);

    await handle.dispose();
  }
}
}