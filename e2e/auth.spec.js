import { test, expect } from '@playwright/test';

test.describe('Auth flow', () => {
  test('signin page renders form with email + password', async ({ page }) => {
    await page.goto('/signin');
    await expect(page.getByPlaceholder('Enter Email')).toBeVisible();
    await expect(page.getByPlaceholder('Enter Password')).toBeVisible();
  });

  test('signup page renders all three inputs', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.getByPlaceholder('Enter Email')).toBeVisible();
    await expect(page.getByPlaceholder('Enter Password')).toBeVisible();
    await expect(page.getByPlaceholder('Enter Username')).toBeVisible();
  });

  test('already-loggedin shown when token in localStorage', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'preset-token');
    });
    await page.goto('/signin');
    await expect(page.getByText(/already loggedin/i)).toBeVisible();
  });

  test('signin form submit triggers request to /users/login (network mocked)', async ({ page }) => {
    const requests = [];
    await page.route('**/users/login', async (route, request) => {
      requests.push(request.postDataJSON());
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ token: 'mock-token', user: { id: 1 } }),
      });
    });
    await page.goto('/signin');
    await page.getByPlaceholder('Enter Email').fill('test@example.com');
    await page.getByPlaceholder('Enter Password').fill('secret');
    await page.getByRole('button', { name: /Sign In/i }).click();
    // Wait for the request to be made
    await expect.poll(() => requests.length).toBe(1);
    expect(requests[0]).toEqual({ email: 'test@example.com', password: 'secret' });
  });
});