import { expect, test } from '@playwright/test';
import { runHomeRoute } from '../src/test/home-route';
import { createGame } from '../src/game/engine/game';
import { encodeSave, SAVE_KEY } from '../src/game/persistence/save';
import { boot, openApp, savedState } from './opening.helpers';

test('untimed Thermal Window, Heat Soak failure/reload/recovery and power controls fit the OS', async ({
  page,
}, testInfo) => {
  const initial = runHomeRoute().game;
  while (initial.getState().cash < 2500) initial.advance(100);
  initial.dispatch({ type: 'transition-workstation' });
  initial.dispatch({ type: 'set-auto-run', enabled: false });
  initial.advance(60000);
  initial.advance(60000);
  initial.dispatch({ type: 'buy-research', id: 'parallel-library' });
  initial.dispatch({ type: 'buy-research', id: 'thermal-model' });
  const state = initial.getState();
  state.cash = 1e7;
  const game = createGame({ state });
  for (let i = 0; i < 2; i++) {
    game.dispatch({ type: 'buy-hardware', part: 'cpu' });
    game.dispatch({ type: 'buy-hardware', part: 'ram' });
  }
  game.dispatch({ type: 'buy-home-part', part: 'cooling' });
  game.dispatch({ type: 'buy-power' });
  game.dispatch({ type: 'set-software', plan: 'lease' });
  await page.addInitScript(
    ({ key, raw }) => {
      if (!sessionStorage.getItem('thermal-fixture')) {
        localStorage.setItem(key, raw);
        sessionStorage.setItem('thermal-fixture', 'set');
      }
    },
    { key: SAVE_KEY, raw: encodeSave(game.getState()) },
  );
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await boot(page);
  await page
    .getByRole('combobox', { name: 'Thermal interaction' })
    .selectOption('decision');
  await page
    .getByRole('button', { name: 'Start Thermal Window', exact: true })
    .press('Enter');
  await page
    .getByRole('button', { name: 'Pre-cool curve', exact: true })
    .press('Enter');
  await page.clock.runFor(15000);
  await expect(
    page.getByRole('button', { name: 'Start Thermal Window', exact: true }),
  ).toBeDisabled();
  await page.getByRole('button', { name: 'Start Job', exact: true }).click();
  const ordinary = await savedState(page);
  // Starting the Job flushes the live state; the periodic save can lag by two seconds.
  expect(ordinary.workstation.operations.window).toBeNull();
  await openApp(page, 'Task Manager');
  await page.getByRole('button', { name: 'Heat Soak', exact: true }).click();
  await page
    .getByRole('combobox', { name: 'Heat Soak clock', exact: true })
    .selectOption('standard');
  await page
    .getByRole('button', { name: 'Start Heat Soak Certification', exact: true })
    .click();
  await page.clock.runFor(30000);
  const partial = await savedState(page);
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Saved locally', exact: true }),
  ).toBeVisible();
  expect(await savedState(page)).toEqual(partial);
  await openApp(page, 'Task Manager');
  await page.getByRole('button', { name: 'Heat Soak', exact: true }).click();
  await page.clock.runFor(120000);
  await expect(
    page.getByRole('heading', { name: 'Too warm to certify', exact: true }),
  ).toBeVisible();
  const failed = await savedState(page);
  expect(failed.job).toEqual(ordinary.job);
  expect(failed.workstation.research).toEqual(ordinary.workstation.research);
  expect(failed.workstation.operations).toEqual(
    ordinary.workstation.operations,
  );
  expect(failed.home.software).toEqual(ordinary.home.software);
  await page.setViewportSize({ width: 640, height: 480 });
  await page.screenshot({
    path: testInfo.outputPath('heat-failure-640x480.png'),
  });
  await page
    .getByRole('button', { name: 'Exit Heat Soak · restore Job', exact: true })
    .press('Enter');
  await page
    .getByRole('combobox', { name: 'Heat Soak clock', exact: true })
    .selectOption('eco');
  await page
    .getByRole('button', { name: 'Start Heat Soak Certification', exact: true })
    .press('Enter');
  await page.clock.runFor(120000);
  expect((await savedState(page)).workstation.operations.fanCurve).toBe(true);
  await expect(
    page.getByRole('button', {
      name: 'Start Heat Soak Certification',
      exact: true,
    }),
  ).toBeDisabled();
  await page.screenshot({
    path: testInfo.outputPath('heat-passed-640x480.png'),
  });
  for (const app of [
    'Job Runner',
    'Research Lab',
    'Task Manager',
    'Hardware Manager',
  ]) {
    await openApp(page, app);
    if (app === 'Task Manager')
      await page
        .getByRole('button', { name: 'Power & temperature', exact: true })
        .click();
    if (app === 'Hardware Manager')
      await page
        .getByRole('button', { name: 'Power supply', exact: true })
        .click();
    const region = page.getByRole('region', { name: app, exact: true }),
      box = (await region.boundingBox())!;
    for (const control of await region
      .locator('button:visible,p:visible,select:visible,label:visible')
      .all()) {
      const controlBox = (await control.boundingBox())!;
      expect(
        controlBox.y + controlBox.height,
        (await control.textContent()) ?? 'control',
      ).toBeLessThanOrEqual(box.y + box.height - 3);
      expect(controlBox.x + controlBox.width).toBeLessThanOrEqual(
        box.x + box.width - 3,
      );
      await expect(control).toBeInViewport({ ratio: 1 });
    }
    await page.screenshot({
      path: testInfo.outputPath(`${app.replaceAll(' ', '-')}-640x480.png`),
    });
  }
  await page
    .getByRole('combobox', { name: 'Operating clock', exact: true })
    .selectOption('eco');
  await page.clock.runFor(60000);
  expect(
    (await savedState(page)).workstation.operations.temperature,
  ).toBeLessThan(70);
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollHeight === innerHeight &&
        document.documentElement.scrollWidth === innerWidth &&
        scrollY === 0,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});
