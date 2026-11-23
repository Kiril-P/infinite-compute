import { expect, test } from '@playwright/test';
import { openApp } from './opening.helpers';

test('the dashboard never scrolls in a smaller browser panel', async ({
  page,
}, testInfo) => {
  for (const viewport of [
    { width: 800, height: 600 },
    { width: 640, height: 480 },
    { width: 668, height: 862 },
    { width: 960, height: 540 },
    { width: 1280, height: 650 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await expect(
      page.getByRole('button', { name: 'Saved locally' }),
    ).toBeVisible();

    const objective = page.getByRole('button', { name: 'Open Job Runner' });
    const hardware = page.getByRole('button', { name: 'Hardware Manager' });
    const jobHeading = page.getByRole('heading', {
      name: 'Job Runner',
      exact: true,
    });

    const dimensions = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    }));
    expect(dimensions).toEqual(viewport);
    for (const control of [
      page.getByRole('region', { name: 'Current Objective' }),
      page.getByRole('region', { name: 'Global status' }),
      page.getByRole('navigation', { name: 'Applications' }),
      page.getByRole('button', { name: 'Start Job', exact: true }),
      objective,
    ])
      await expect(control).toBeInViewport({ ratio: 1 });

    await page.mouse.wheel(0, 1200);
    await page.keyboard.press('PageDown');
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await page.screenshot({
      path: testInfo.outputPath(
        `dashboard-${viewport.width}x${viewport.height}.png`,
      ),
    });

    await hardware.press('Space');
    await expect(
      page.getByRole('heading', { name: 'Hardware Manager', exact: true }),
    ).toBeFocused();
    const inspector = page.getByRole('region', { name: 'Hardware Manager' });
    await expect(
      inspector.getByRole('term').filter({ hasText: /^CPU$/ }),
    ).toBeInViewport({
      ratio: 1,
    });
    await expect(
      inspector.getByRole('term').filter({ hasText: /^RAM$/ }),
    ).toBeInViewport({
      ratio: 1,
    });
    await page.screenshot({
      path: testInfo.outputPath(
        `hardware-${viewport.width}x${viewport.height}.png`,
      ),
    });

    await openApp(page, 'Settings');
    for (const title of ['Saved game', 'Sound & motion', 'ReadMe.txt']) {
      await page.getByRole('button', { name: title, exact: true }).click();
      const controls = page
        .getByRole('region', { name: 'Settings', exact: true })
        .locator(
          'button:visible, input:visible, select:visible, textarea:visible',
        );
      for (const control of await controls.all())
        await expect(control).toBeInViewport({ ratio: 1 });
    }
    await objective.press('Enter');
    await expect(jobHeading).toBeFocused();
    await expect(jobHeading).toBeInViewport({ ratio: 1 });
    if (viewport.width <= 1000) await expect(inspector).toBeHidden();
  }
});
