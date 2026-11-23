import { expect, test } from '@playwright/test';
import { createGame } from '../src/game/engine/game';
import { encodeSave, SAVE_KEY } from '../src/game/persistence/save';
import { boot, openApp, savedState } from './opening.helpers';

test('software prices, renewal suspension, cancellation and cosmetic scores are usable without scrolling', async ({
  page,
}, testInfo) => {
  const state = createGame().getState();
  state.hardware = { cpu: 8, ram: 5 };
  state.cash = 1600;
  state.completedJobs = 1;
  state.milestones.firstJobMs = 0;
  state.milestones.firstPurchaseMs = 0;
  state.milestones.automationMs = 0;
  state.automation = { unlocked: true, enabled: false };
  state.home = {
    ...state.home,
    reached: true,
    wideBus: true,
    storage: 2,
    gpu: 1,
    transitionMs: 0,
  };
  await page.addInitScript(
    ({ key, raw }) => {
      if (!sessionStorage.getItem('software-fixture')) {
        localStorage.setItem(key, raw);
        sessionStorage.setItem('software-fixture', 'set');
      }
    },
    { key: SAVE_KEY, raw: encodeSave(state) },
  );
  await boot(page);
  await openApp(page, 'Shop');
  await expect(
    page.getByText('$1,000 now · $600 / 60s', { exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('software-offer.png') });
  await page
    .getByRole('button', { name: 'Start subscription · $1,000', exact: true })
    .press('Enter');
  await page.clock.runFor(30000);
  const partial = await savedState(page);
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Saved locally' }),
  ).toBeVisible();
  expect(await savedState(page)).toEqual(partial);
  await openApp(page, 'Shop');
  await page.clock.runFor(30000);
  expect((await savedState(page)).cash).toBe(0);
  await page.clock.runFor(60000);
  await expect(
    page.getByRole('heading', { name: 'Subscription suspended', exact: true }),
  ).toBeVisible();
  await page.setViewportSize({ width: 640, height: 480 });
  const region = page.getByRole('region', { name: 'Shop', exact: true });
  for (const button of await region.getByRole('button').all())
    await expect(button).toBeInViewport({ ratio: 1 });
  const bounds = await region.boundingBox();
  for (const control of await region
    .locator('button:visible, p:visible')
    .all()) {
    const box = await control.boundingBox();
    expect(
      box!.y + box!.height,
      (await control.textContent()) ?? '',
    ).toBeLessThanOrEqual(bounds!.y + bounds!.height - 4);
  }
  await page.screenshot({
    path: testInfo.outputPath('software-suspended-640x480.png'),
  });
  await page
    .getByRole('button', {
      name: 'Use free edition · cancel fees',
      exact: true,
    })
    .click();
  const actual = (await savedState(page)).cash;
  await page
    .getByRole('button', { name: 'Promotional score', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Enable promotional score', exact: true })
    .click();
  await expect(
    page.getByText(/Promotional score: .* cosmetic ×10/),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Restore useful view', exact: true })
    .click();
  await page.clock.runFor(60000);
  expect((await savedState(page)).cash).toBe(actual);
  expect((await savedState(page)).automation.unlocked).toBe(true);
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollHeight === innerHeight && scrollY === 0,
    ),
  ).toBe(true);
  await openApp(page, 'Task Manager');
  await page
    .getByRole('button', { name: 'Enable auto-run', exact: true })
    .click();
  await page.clock.runFor(6000);
  await openApp(page, 'Shop');
  expect((await savedState(page)).cash).toBeGreaterThan(0);
});
