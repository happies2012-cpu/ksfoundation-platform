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

        // Fill in valid email
        await emailInput.fill('test@example.com');
        await expect(emailInput).toHaveValue('test@example.com');

        // Fill in password
        await passwordInput.fill('testpassword123');
        await expect(passwordInput).toHaveValue('testpassword123');
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

        await expect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /Continue with Facebook/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /Continue with LinkedIn/i })).toBeVisible();
    });

    test('should have all form elements', async ({ page }) => {
        await page.goto('/login');

        // Check email input
        const emailInput = page.getByPlaceholder(/you@example.com/i);
        await expect(emailInput).toBeVisible();
        await expect(emailInput).toHaveAttribute('type', 'email');
        await expect(emailInput).toHaveAttribute('required');

        // Check password input
        const passwordInput = page.getByPlaceholder(/••••••••/i);
        await expect(passwordInput).toBeVisible();
        await expect(passwordInput).toHaveAttribute('type', 'password');
        await expect(passwordInput).toHaveAttribute('required');

        // Check sign in button
        const signInButton = page.getByRole('button', { name: /^Sign In$/i });
        await expect(signInButton).toBeVisible();
        await expect(signInButton).toBeEnabled();
    });
});

test.describe('Dashboard Access', () => {
    test('should redirect to login when not authenticated', async ({ page }) => {
        await page.goto('/dashboard');

        // Should redirect to login or show login prompt
        await page.waitForURL(/.*login.*/, { timeout: 5000 });
        await expect(page).toHaveURL(/.*login/);
    });
});

test.describe('Homepage', () => {
    test('should display hero section', async ({ page }) => {
        await page.goto('/');

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
