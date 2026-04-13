const { test, expect } = require('@playwright/test');
const {
  getSubscriptionIds,
  gotoApp,
  showDashboard,
  usePersona
} = require('./helpers/nala');

test.describe('Purchase modal', () => {
  test('registered users can open and dismiss the premium shipping modal', async ({ page }) => {
    await usePersona(page, 'registered');
    await gotoApp(page);
    await showDashboard(page);

    const ids = await getSubscriptionIds(page);
    expect(ids).toContain('premium-course');

    await page.locator('[data-subscription-id="premium-course"]').click();

    await expect(page.locator('.wc-purchase-modal')).toBeVisible();
    await expect(page.locator('#wc-purchase-modal-title')).toHaveText(/premium shipping details/i);
    await expect(page.locator('#wc-shipping-country')).toHaveValue('US');

    const modalLoaded = await page.evaluate(() => {
      return Boolean(window.WCPurchaseModal && typeof window.WCPurchaseModal.showPremiumShippingModal === 'function');
    });
    expect(modalLoaded).toBeTruthy();

    await page.locator('[data-action="cancel"]').click();
    await expect(page.locator('.wc-purchase-modal')).toHaveCount(0);
  });
});
