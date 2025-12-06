import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login form', async ({ page }) => {
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
    await page.getByLabel(/email/i).fill('admin@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Should redirect to dashboard or show success
    await expect(page).toHaveURL(/dashboard|home/);
    await expect(page.getByText(/welcome/i)).toBeVisible();
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
    await expect(page).toHaveURL(/signup|register/);
    await expect(page.getByRole('heading', { name: /sign up|create account/i })).toBeVisible();

    const uniqueEmail = `testuser-${Date.now()}@example.com`;
    await page.getByLabel('Email').fill(uniqueEmail);
    await page.getByLabel('Password', { exact: true }).fill('SecurePass123!');
    await page.getByLabel('Confirm Password').fill('SecurePass123!');
    await page.getByLabel('Display Name').fill('Test User');

    await page.getByRole('button', { name: /sign up|create account/i }).click();

    // Should show success message or redirect
    await expect(
      page.getByText(/check.*email|account created|welcome/i)
    ).toBeVisible();
  });

  test('should show error when passwords do not match', async ({ page }) => {
    await page.getByRole('link', { name: /sign up|create account/i }).click();
    await expect(page).toHaveURL(/signup|register/);
    await expect(page.getByRole('heading', { name: /sign up|create account/i })).toBeVisible();

    const uniqueEmail = `testuser-${Date.now()}@example.com`;
    await page.getByLabel('Email').fill(uniqueEmail);
    await page.getByLabel('Password', { exact: true }).fill('Password123!');
    await page.getByLabel('Confirm Password').fill('DifferentPass123!');

    await page.getByRole('button', { name: /sign up|create account/i }).click();

    await expect(page.getByText(/passwords.*match/i)).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.getByLabel(/email/i).fill('admin@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL(/dashboard|home/);

    // Logout
    await page.getByRole('button', { name: /sign out|logout/i }).click();

    // Should redirect to login
    await expect(page).toHaveURL(/login|signin|^\//);
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
  });

  test('should protect dashboard route when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');

    // Should redirect to login
    await expect(page).toHaveURL(/login|signin|^\//);
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
  });

  test('should persist session after page reload', async ({ page }) => {
    // Login
    await page.getByLabel(/email/i).fill('admin@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL(/dashboard|home/);
    await expect(page.getByRole('button', { name: /sign out|logout/i })).toBeVisible();

    // Reload page
    await page.reload();

    // Wait for page to fully load after reload
    await page.waitForLoadState('networkidle');

    // Should still be logged in
    await expect(page).toHaveURL(/dashboard|home/);
    await expect(page.getByRole('heading', { name: /admin dashboard|dashboard/i })).toBeVisible();
  });
});
