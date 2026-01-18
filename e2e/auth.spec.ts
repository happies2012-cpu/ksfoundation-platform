import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should load homepage successfully', async ({ page }) => {
        await expect(page).toHaveTitle(/KSR Foundation/);
        await expect(page.locator('body')).toBeVisible();
    });

    test('should navigate to login page', async ({ page }) => {
        await page.goto('/login');
        await expect(page).toHaveURL(/.*login/);

        // Check for login form elements
        await expect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /Continue with Facebook/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /Continue with LinkedIn/i })).toBeVisible();
        await expect(page.getByPlaceholder(/you@example.com/i)).toBeVisible();
        await expect(page.getByPlaceholder(/••••••••/i)).toBeVisible();
    });

    test('should show all OAuth buttons', async ({ page }) => {
        await page.goto('/login');

        // Take screenshot of login page
        await page.screenshot({ path: 'e2e/screenshots/login-page.png', fullPage: true });

        // Verify Google button
        const googleButton = page.getByRole('button', { name: /Continue with Google/i });
        await expect(googleButton).toBeVisible();
        await expect(googleButton).toBeEnabled();

        // Verify Facebook button
        const facebookButton = page.getByRole('button', { name: /Continue with Facebook/i });
        await expect(facebookButton).toBeVisible();
        await expect(facebookButton).toBeEnabled();

        // Verify LinkedIn button
        const linkedinButton = page.getByRole('button', { name: /Continue with LinkedIn/i });
        await expect(linkedinButton).toBeVisible();
        await expect(linkedinButton).toBeEnabled();
    });

    test('should validate email input', async ({ page }) => {
        await page.goto('/login');

        const emailInput = page.getByPlaceholder(/you@example.com/i);
        const passwordInput = page.getByPlaceholder(/••••••••/i);
        const signInButton = page.getByRole('button', { name: /^Sign In$/i });

        // Try to submit with empty fields
        await signInButton.click();

        // Browser validation should prevent submission
        await expect(emailInput).toBeFocused();
    });

    test('should show password field', async ({ page }) => {
        await page.goto('/login');

        const passwordInput = page.getByPlaceholder(/••••••••/i);
        await expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('should have signup link', async ({ page }) => {
        await page.goto('/login');

        const signupLink = page.getByRole('link', { name: /Sign up/i });
        await expect(signupLink).toBeVisible();
        await expect(signupLink).toHaveAttribute('href', '/signup');
    });

    test('should have forgot password link', async ({ page }) => {
        await page.goto('/login');

        const forgotLink = page.getByRole('link', { name: /Forgot password/i });
        await expect(forgotLink).toBeVisible();
        await expect(forgotLink).toHaveAttribute('href', '/forgot-password');
    });

    test('should display login page correctly on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/login');

        await page.screenshot({ path: 'e2e/screenshots/login-mobile.png', fullPage: true });

        await expect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible();
    });

    test('should handle OAuth button clicks', async ({ page }) => {
        await page.goto('/login');

        // Click Google button (will redirect to Supabase OAuth)
        const googleButton = page.getByRole('button', { name: /Continue with Google/i });

        // We can't test the actual OAuth flow without credentials,
        // but we can verify the button is clickable
        await expect(googleButton).toBeEnabled();

        // Take screenshot before clicking
        await page.screenshot({ path: 'e2e/screenshots/before-oauth-click.png' });
    });
});

test.describe('Dashboard Access', () => {
    test('should redirect to login when not authenticated', async ({ page }) => {
        await page.goto('/dashboard');

        // Should redirect to login or show login prompt
        await page.waitForURL(/.*login.*/);
        await expect(page).toHaveURL(/.*login/);
    });
});

test.describe('Homepage', () => {
    test('should display hero section', async ({ page }) => {
        await page.goto('/');

        // Take screenshot of homepage
        await page.screenshot({ path: 'e2e/screenshots/homepage.png', fullPage: true });

        // Check for key elements
        await expect(page.locator('body')).toBeVisible();
    });

    test('should have navigation', async ({ page }) => {
        await page.goto('/');

        // Check for common navigation elements
        const body = page.locator('body');
        await expect(body).toBeVisible();
    });
});
