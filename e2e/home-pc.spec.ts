import { expect, test } from '@playwright/test';
import { createGame } from '../src/game/engine/game';
import { SAVE_KEY } from '../src/game/persistence/save';
import { boot, openApp, savedState } from './opening.helpers';

test('a legacy partial save migrates, preserves selected-job intent and visibly transforms into Home PC', async ({
  page,
}, testInfo) => {
  // A validated Phase 1 recovery fixture; the engine test independently plays the entire purchase route.
  const game = createGame({ seed: 20 });
  game.dispatch({ type: 'start-job' });
  game.advance(3400);
  const state = game.getState();
  const { home: _home, ...legacy } = state;
  void _home;
  const { setupRemainingMs: _setup, ...job } = legacy.job!;
  void _setup;
  const raw = JSON.stringify({
    schemaVersion: 1,
    gameVersion: '0.1.0',
    savedAt: '2026-09-08T00:00:00Z',
    state: {
      ...legacy,
      elapsedMs: 200000,
      cash: 2000,
      completedJobs: 14,
      hardware: { cpu: 6, ram: 4 },
      automation: { unlocked: true, enabled: true },
      milestones: {
        firstJobMs: 12000,
        firstPurchaseMs: 24000,
        automationMs: 195000,
      },
      job,
    },
  });
  await page.addInitScript(
    ({ key, raw }) => {
      if (!sessionStorage.getItem('legacy-fixture')) {
        localStorage.setItem(key, raw);
        sessionStorage.setItem('legacy-fixture', 'set');
      }
    },
    { key: SAVE_KEY, raw },
  );
  await boot(page);
  expect((await savedState(page)).job!.work).toBeCloseTo(3.4);
  await openApp(page, 'Hardware Manager');
  await page
    .getByRole('button', { name: 'Storage & chassis', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Buy Storage · $80', exact: true })
    .click();
  await openApp(page, 'Job Runner');
  await page.getByRole('combobox', { name: 'Next Job' }).selectOption('wonder');
  await expect(
    page
      .getByRole('region', { name: 'Job Runner', exact: true })
      .getByText(/The peripheral needs a Home PC/),
  ).toBeVisible();
  await page.clock.runFor(12000);
  expect((await savedState(page)).job!.id).toBe('household-ledger');
  expect((await savedState(page)).home.selectedJob).toBe('wonder');
  await page.getByRole('combobox', { name: 'Next Job' }).selectOption('photo');
  await page.clock.runFor(12000);
  expect((await savedState(page)).job!.id).toBe('photo');
  await openApp(page, 'Hardware Manager');
  await page
    .getByRole('button', { name: 'Install Wide bus', exact: true })
    .click();
  const before = (await savedState(page)).job;
  await page
    .getByRole('button', { name: 'Move into Home PC', exact: true })
    .click();
  expect((await savedState(page)).job).toEqual(before);
  await expect(
    page.getByRole('region', { name: 'Global status' }),
  ).toContainText('Home PC');
  await openApp(page, 'Job Runner');
  await expect(page.getByRole('img', { name: /^Home PC/ })).toBeVisible();
  await expect(
    page.getByText('Household file: 12s then → 0.1s now'),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Saved locally' }),
  ).toBeVisible();
  await expect(
    page.getByRole('region', { name: 'Global status' }),
  ).toContainText('Home PC');
  for (const size of [
    testInfo.project.use.viewport!,
    { width: 640, height: 480 },
    { width: 668, height: 862 },
  ]) {
    await page.setViewportSize(size);
    for (const app of ['Job Runner', 'Hardware Manager']) {
      await openApp(page, app);
      if (app === 'Hardware Manager')
        await page
          .getByRole('button', { name: 'Storage & chassis', exact: true })
          .click();
      await expect(
        page.getByRole('navigation', { name: 'Applications' }),
      ).toBeInViewport({ ratio: 1 });
      const controls = page
        .getByRole('region', { name: app, exact: true })
        .locator('button:visible, select:visible');
      for (const control of await controls.all())
        await expect(control).toBeInViewport({ ratio: 1 });
      expect(
        await page.evaluate(() => ({
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
        })),
      ).toEqual(size);
      await page.screenshot({
        path: testInfo.outputPath(
          `home-${app}-${size.width}x${size.height}.png`,
        ),
      });
    }
  }
});
