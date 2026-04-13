const { test, expect } = require('@playwright/test');
const {
  gotoApp,
  showDashboard,
  showHierarchy,
  usePersona
} = require('./helpers/nala');

test.describe('Core smoke', () => {
  test('registered persona can load dashboard and hierarchy', async ({ page }) => {
    await usePersona(page, 'registered');
    await gotoApp(page);

    await showDashboard(page);
    await expect(page.locator('.btn-continue-to-course')).toBeVisible();

    await showHierarchy(page);
    await expect(page.locator('.mtk-hierarchy')).toBeVisible();
    await expect(page.locator('[data-testid="lesson-0"]')).toBeVisible();
  });
});
