import { expect, test } from '@playwright/test';
import { createGame } from '../src/game/engine/game';
import { encodeSave, SAVE_KEY } from '../src/game/persistence/save';
import { boot, openApp, savedState } from './opening.helpers';

test('graphics purchases, airflow recovery, specialized Job and live layers survive reload without scrolling', async ({
  page,
}, testInfo) => {
  const state = createGame().getState();
  state.hardware = { cpu: 8, ram: 5 };
  state.cash = 100000;
  state.milestones.firstPurchaseMs = 0;
  state.milestones.automationMs = 0;
  state.automation = { unlocked: true, enabled: false };
  state.home = {
    ...state.home,
    reached: true,
    wideBus: true,
    storage: 2,
    transitionMs: 0,
    queue: { ...state.home.queue, unlocked: true },
  };
  await page.addInitScript(
    ({ key, raw }) => {
      if (!sessionStorage.getItem('graphics-fixture')) {
        localStorage.setItem(key, raw);
        sessionStorage.setItem('graphics-fixture', 'set');
      }
    },
    { key: SAVE_KEY, raw: encodeSave(state) },
  );
  await boot(page);
  await openApp(page, 'Hardware Manager');
  await page
    .getByRole('button', { name: 'Graphics & cooling', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Inspect Cooling', exact: true }),
  ).toHaveCount(0);
  for (let i = 0; i < 3; i++)
    await page.getByRole('button', { name: /^Buy GPU ·/ }).click();
  await expect(
    page.getByText('Graphics 467.3/s · airflow 77%', { exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Inspect Cooling', exact: true })
    .click();
  await page.setViewportSize({ width: 640, height: 480 });
  const buy = page.getByRole('button', { name: /^Buy Cooling ·/ });
  await expect(buy).toBeInViewport({ ratio: 1 });
  await page.screenshot({ path: testInfo.outputPath('airflow-640x480.png') });
  await buy.press('Enter');
  await buy.press('Enter');
  const region = page.getByRole('region', {
    name: 'Hardware Manager',
    exact: true,
  });
  await expect(region.locator('.machine-visual')).toHaveAttribute(
    'data-gpu',
    '3',
  );
  await expect(region.locator('.machine-visual')).toHaveAttribute(
    'data-cooling',
    '2',
  );
  await expect(region.locator('.pc-case-fan')).toHaveCount(2);
  if (testInfo.project.name === 'chromium-desktop') {
    await page
      .getByRole('button', { name: 'Pause animation', exact: true })
      .click();
    await expect(region.locator('.pc-case-fan').first()).toHaveCSS(
      'animation-play-state',
      'paused',
    );
  } else
    await expect(region.locator('.pc-case-fan').first()).toHaveCSS(
      'animation-name',
      'none',
    );
  await page.screenshot({ path: testInfo.outputPath('cooling-640x480.png') });
  await openApp(page, 'Job Runner');
  await page.getByRole('combobox', { name: 'Next Job' }).selectOption('logo');
  await page.getByRole('button', { name: 'Start Job', exact: true }).click();
  for (const button of await page
    .getByRole('region', { name: 'Job Runner', exact: true })
    .getByRole('button')
    .all())
    await expect(button).toBeInViewport({ ratio: 1 });
  await page.screenshot({
    path: testInfo.outputPath('graphics-batch-640x480.png'),
  });
  await page.getByRole('button', { name: /^Spinning logo ·/ }).click();
  await expect(page.getByText('Bonus reserved: +50%')).toBeVisible();
  await page.clock.runFor(2000);
  const partial = await savedState(page);
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Saved locally' }),
  ).toBeVisible();
  expect(await savedState(page)).toEqual(partial);
  await page.clock.runFor(4000);
  await openApp(page, 'Settings');
  expect((await savedState(page)).cash).toBe(partial.cash + 2400);
  expect((await savedState(page)).home.queue.completed.logo).toBe(1);
  await openApp(page, 'Job Runner');
  await page.getByRole('combobox', { name: 'Next Job' }).selectOption('wonder');
  // The reserved next batch precedes the remembered selection, including while idle.
  await expect(
    page
      .getByRole('region', { name: 'Job Runner', exact: true })
      .getByRole('heading', { name: 'Spinning logo', exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollHeight === innerHeight && scrollY === 0,
    ),
  ).toBe(true);
});
