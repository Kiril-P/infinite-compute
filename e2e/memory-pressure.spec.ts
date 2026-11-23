import { expect, test } from '@playwright/test';
import { createGame } from '../src/game/engine/game';
import { encodeSave, SAVE_KEY } from '../src/game/persistence/save';
import { boot, openApp, savedState } from './opening.helpers';

test('Memory Pressure diagnoses a stall, survives reload, and unlocks a one-shot Batch Queue', async ({
  page,
}, testInfo) => {
  const state = createGame().getState();
  state.hardware = { cpu: 8, ram: 5 };
  state.automation = { unlocked: true, enabled: true };
  state.milestones.firstPurchaseMs = 0;
  state.milestones.automationMs = 0;
  state.home = {
    ...state.home,
    reached: true,
    wideBus: true,
    storage: 2,
    selectedJob: 'wonder',
    transitionMs: 0,
  };
  const prepared = createGame({ state });
  prepared.advance(1300);
  const raw = encodeSave(prepared.getState());
  await page.addInitScript(
    ({ key, raw }) => {
      if (!sessionStorage.getItem('memory-fixture')) {
        localStorage.setItem(key, raw);
        sessionStorage.setItem('memory-fixture', 'set');
      }
    },
    { key: SAVE_KEY, raw },
  );
  await boot(page);
  const ordinary = (await savedState(page)).job;
  await openApp(page, 'Task Manager');
  await page
    .getByRole('button', { name: 'Pause auto-run', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Enable auto-run', exact: true })
    .click();
  await page
    .getByRole('combobox', { name: 'Memory strategy' })
    .selectOption('whole');
  await page
    .getByRole('button', { name: 'Start Memory Pressure Test' })
    .click();
  await page.clock.runFor(10000);
  await expect(
    page.getByRole('heading', { name: 'Waiting for memory' }),
  ).toBeVisible();
  expect((await savedState(page)).benchmark!.work).toBe(0);
  expect((await savedState(page)).job).toEqual(ordinary);
  await page.screenshot({ path: testInfo.outputPath('memory-stalled.png') });
  await page
    .getByRole('button', { name: 'Exit Memory Pressure · restore Job' })
    .click();
  await page
    .getByRole('combobox', { name: 'Memory strategy' })
    .selectOption('pages');
  await page
    .getByRole('button', { name: 'Start Memory Pressure Test' })
    .click();
  await page.clock.runFor(60000);
  const during = await savedState(page);
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Saved locally' }),
  ).toBeVisible();
  expect(await savedState(page)).toEqual(during);
  await openApp(page, 'Task Manager');
  await page.clock.runFor(73400);
  await expect(
    page.getByRole('heading', { name: 'Memory Pressure · passed' }),
  ).toBeVisible();
  await page
    .getByRole('combobox', { name: 'Queue policy' })
    .selectOption('cash');
  await openApp(page, 'Job Runner');
  await page.setViewportSize({ width: 640, height: 480 });
  for (const button of await page
    .getByRole('region', { name: 'Job Runner', exact: true })
    .getByRole('button')
    .all())
    await expect(button).toBeInViewport({ ratio: 1 });
  await page.screenshot({
    path: testInfo.outputPath('batch-queue-640x480.png'),
  });
  await page.getByRole('button', { name: /^One-Function Wonder ·/ }).click();
  await expect(page.getByText('Bonus reserved: +50%')).toBeVisible();
  const chosen = await savedState(page);
  expect(chosen.home.queue.nextBatch).toBe('wonder');
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Saved locally' }),
  ).toBeVisible();
  expect((await savedState(page)).home.queue).toEqual(chosen.home.queue);
  await openApp(page, 'Task Manager');
  await expect(
    page.getByRole('combobox', { name: 'Queue policy' }),
  ).toHaveValue('cash');
  await expect(
    page.getByRole('button', { name: 'Pause auto-run' }),
  ).toBeInViewport({ ratio: 1 });
  await page.screenshot({
    path: testInfo.outputPath('queue-policy-640x480.png'),
  });
});
