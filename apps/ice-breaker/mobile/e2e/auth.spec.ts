import { test, expect } from '@playwright/test';

test.describe('Authentication - Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login form on mobile', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByText(/valid email/i)).toBeVisible();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    await page.getByLabel(/email/i).fill('user@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Should redirect to game lobby or show success
    await expect(page).toHaveURL(/lobby|games|home/);
    await expect(page.getByText(/welcome|join.*game|create.*game/i)).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.getByLabel(/email/i).fill('wrong@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByText(/invalid.*credentials|incorrect.*password/i)).toBeVisible();
  });

  test('should navigate to sign up page', async ({ page }) => {
    await page.getByRole('link', { name: /sign up|create account/i }).click();

    await expect(page).toHaveURL(/signup|register/);
    await expect(page.getByRole('heading', { name: /sign up|create account/i })).toBeVisible();
  });

  test('should successfully sign up with valid data', async ({ page }) => {
    await page.getByRole('link', { name: /sign up|create account/i }).click();

    await page.getByLabel(/email/i).fill('newuser@example.com');
    await page.getByLabel(/^password/i).first().fill('SecurePass123!');
    await page.getByLabel(/confirm password/i).fill('SecurePass123!');
    await page.getByLabel(/display name|name/i).fill('Test User');

    await page.getByRole('button', { name: /sign up|create account/i }).click();

    // Should show success message or redirect
    await expect(
      page.getByText(/check.*email|account created|welcome/i)
    ).toBeVisible();
  });

  test('should show error when passwords do not match', async ({ page }) => {
    await page.getByRole('link', { name: /sign up|create account/i }).click();

    await page.getByLabel(/email/i).fill('newuser@example.com');
    await page.getByLabel(/^password/i).first().fill('Password123!');
    await page.getByLabel(/confirm password/i).fill('DifferentPass123!');

    await page.getByRole('button', { name: /sign up|create account/i }).click();

    await expect(page.getByText(/passwords.*match/i)).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.getByLabel(/email/i).fill('user@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL(/lobby|games|home/);

    // Open menu (mobile apps often have hamburger menus)
    const menuButton = page.getByRole('button', { name: /menu|navigation/i });
    if (await menuButton.isVisible()) {
      await menuButton.click();
    }

    // Logout
    await page.getByRole('button', { name: /sign out|logout/i }).click();

    // Should redirect to login
    await expect(page).toHaveURL(/login|signin|^\//);
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
  });

  test('should protect authenticated routes when not logged in', async ({ page }) => {
    await page.goto('/games');

    // Should redirect to login
    await expect(page).toHaveURL(/login|signin|^\//);
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
  });

  test('should persist session after page reload', async ({ page }) => {
    // Login
    await page.getByLabel(/email/i).fill('user@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL(/lobby|games|home/);

    // Reload page
    await page.reload();

    // Should still be logged in
    await expect(page).toHaveURL(/lobby|games|home/);
    await expect(page.getByText(/welcome|join.*game|create.*game/i)).toBeVisible();
  });

  test('should be touch-friendly on mobile devices', async ({ page }) => {
    // Check that interactive elements have adequate size for touch
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/password/i);
    const submitButton = page.getByRole('button', { name: /sign in/i });

    // All touch targets should be at least 44x44 pixels (WCAG guideline)
    const emailBox = await emailInput.boundingBox();
    const passwordBox = await passwordInput.boundingBox();
    const buttonBox = await submitButton.boundingBox();

    expect(emailBox?.height).toBeGreaterThanOrEqual(44);
    expect(passwordBox?.height).toBeGreaterThanOrEqual(44);
    expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
  });
});
