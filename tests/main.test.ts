import { expect, test } from '@playwright/test';

test('index page has expected name', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('Chase Courington')).toBeVisible();
});
