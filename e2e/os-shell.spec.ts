import { expect, test } from '@playwright/test';
import { boot, openApp } from './opening.helpers';

test('production startup, keyboard application focus and reload are clean', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('requestfailed', (request) => errors.push(request.url()));
  await boot(page);
  await expect(page).toHaveTitle('Infinite Compute');
  await expect(
    page.getByRole('region', { name: 'Global status' }),
  ).toContainText('1.00/s');
  await expect(
    page.getByText(
      'Background directive: explain existence. Supporting document: not found.',
    ),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Open Job Runner' }).press('Enter');
  await expect(
    page.getByRole('heading', { name: 'Job Runner', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('button', { name: 'Start Job', exact: true }),
  ).toBeFocused();
  await openApp(page, 'Hardware Manager');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Inspect CPU' })).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await expect(
    page.getByRole('button', { name: 'Inspect RAM' }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Inspect CPU' })).toBeFocused();
  await openApp(page, 'Settings');
  await page.getByRole('button', { name: 'Sound & motion' }).click();
  await expect(
    page.getByRole('combobox', { name: 'Development speed' }),
  ).toHaveCount(0);
  await openApp(page, 'Job Runner');
  await page.screenshot({ path: testInfo.outputPath('os-shell.png') });
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Saved locally' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Start Job', exact: true }),
  ).toBeEnabled();
  expect(errors).toEqual([]);
});
