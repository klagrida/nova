import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Admin/);
});

test('navigation works', async ({ page }) => {
  await page.goto('/');

  // Example: Click a link and verify navigation
  // await page.click('text=About');
  // await expect(page).toHaveURL(/.*about/);
});
