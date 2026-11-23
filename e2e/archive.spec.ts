import { expect, test } from '@playwright/test';
import { createGame } from '../src/game/engine/game';
import { encodeSave, SAVE_KEY } from '../src/game/persistence/save';
import { boot, openApp, savedState } from './opening.helpers';

test('Question Archive migrates reliable history, keeps paged content in view and records a cosmetic secret once', async ({
  page,
}, testInfo) => {
  const state = createGame().getState();
  state.elapsedMs = 900000;
  state.completedJobs = 5;
  state.hardware = { cpu: 8, ram: 5 };
  state.milestones = {
    firstJobMs: 12000,
    firstPurchaseMs: 24000,
    automationMs: 240000,
  };
  state.automation = { unlocked: true, enabled: false };
  state.message = 'memory';
  state.home = {
    ...state.home,
    reached: true,
    wideBus: true,
    storage: 2,
    transitionMs: 540000,
    queue: { ...state.home.queue, unlocked: true, completed: { photo: 1 } },
  };
  const legacy = JSON.parse(encodeSave(state));
  legacy.schemaVersion = 5;
  delete legacy.state.journal;
  await page.addInitScript(
    ({ key, raw }) => {
      if (!sessionStorage.getItem('archive-fixture')) {
        localStorage.setItem(key, raw);
        sessionStorage.setItem('archive-fixture', 'set');
      }
    },
    { key: SAVE_KEY, raw: JSON.stringify(legacy) },
  );
  await boot(page);
  await openApp(page, 'Settings');
  await page
    .getByRole('button', { name: 'Question Archive', exact: true })
    .click();
  const settings = page.getByRole('region', { name: 'Settings', exact: true });
  await expect(
    settings.getByRole('heading', {
      name: 'Completion Contractor',
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    settings.getByText(
      'Recovered from an older save · original time not recorded',
      { exact: true },
    ),
  ).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('question-archive.png') });
  await page.setViewportSize({ width: 640, height: 480 });
  for (const category of ['System history', 'News', 'Achievements']) {
    await page.getByRole('button', { name: category, exact: true }).click();
    const bounds = await settings.boundingBox();
    for (const control of await settings
      .locator('button:visible,p:visible')
      .all()) {
      const box = await control.boundingBox();
      expect(
        box!.y + box!.height,
        (await control.textContent()) ?? '',
      ).toBeLessThanOrEqual(bounds!.y + bounds!.height - 4);
    }
    await page.screenshot({
      path: testInfo.outputPath(
        `archive-${category.replace(' ', '-')}-640x480.png`,
      ),
    });
  }
  await openApp(page, 'Hardware Manager');
  await page
    .getByRole('button', { name: 'Inspect RAM', exact: true })
    .press('Enter');
  const inspected = await savedState(page);
  expect(inspected.cash).toBe(state.cash);
  expect(inspected.hardware).toEqual(state.hardware);
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Saved locally' }),
  ).toBeVisible();
  await openApp(page, 'Settings');
  await page
    .getByRole('button', { name: 'Question Archive', exact: true })
    .click();
  await page.getByRole('button', { name: 'Achievements', exact: true }).click();
  await expect(
    settings.getByRole('heading', {
      name: 'Warranty sticker: ignored',
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    settings.getByText(/Cosmetic · no economy effect · Secret discovered/),
  ).toBeVisible();
  expect(
    (await savedState(page)).journal.entries.filter(
      (entry) => entry.id === 'case-curious',
    ),
  ).toHaveLength(1);
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollHeight === innerHeight && scrollY === 0,
    ),
  ).toBe(true);
});
