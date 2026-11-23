import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import { createGame } from '../src/game/engine/game';
import {
  BACKUP_KEY,
  encodeSave,
  REJECTED_KEY,
  SAVE_KEY,
} from '../src/game/persistence/save';
import { boot, finishJob, openApp, savedState } from './opening.helpers';

test('export, invalid import, confirmation, reset and import preserve deliberate choices', async ({
  page,
}) => {
  await boot(page);
  await finishJob(page);
  await openApp(page, 'Settings');
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export save', exact: true }).click();
  const download = await downloadEvent;
  const raw = await readFile((await download.path())!, 'utf8');
  expect(JSON.parse(raw).state.cash).toBe(12);
  await page.getByRole('button', { name: 'New game', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Cancel', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Escape');
  expect((await savedState(page)).cash).toBe(12);
  await page.getByRole('button', { name: 'New game', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm replacement' }).click();
  expect((await savedState(page)).cash).toBe(0);
  await page.getByRole('textbox', { name: 'Saved game JSON' }).fill('{broken');
  await page.getByRole('button', { name: 'Review import' }).click();
  await expect(page.getByRole('alert')).toContainText('not valid JSON');
  await page.getByRole('textbox', { name: 'Saved game JSON' }).fill(raw);
  await page.getByRole('button', { name: 'Review import' }).click();
  await expect(page.getByRole('dialog')).toContainText('$12');
  await page.getByRole('button', { name: 'Confirm replacement' }).click();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Saved locally' }),
  ).toBeVisible();
  expect((await savedState(page)).cash).toBe(12);
});

test('valid backup recovers a corrupt primary and unreadable future saves remain exportable', async ({
  page,
}) => {
  const game = createGame();
  game.dispatch({ type: 'start-job' });
  game.advance(12000);
  const backup = encodeSave(game.getState());
  await page.addInitScript(
    ({ backup, primaryKey, backupKey }) => {
      if (!sessionStorage.getItem('fixture')) {
        sessionStorage.setItem('fixture', 'true');
        localStorage.setItem(primaryKey, '{broken');
        localStorage.setItem(backupKey, backup);
      }
    },
    { backup, primaryKey: SAVE_KEY, backupKey: BACKUP_KEY },
  );
  await boot(page);
  await openApp(page, 'Settings');
  await expect(
    page.getByText('Recovered the last valid backup. Export it from Settings.'),
  ).toBeVisible();
  expect((await savedState(page)).cash).toBe(8);
  expect(
    await page.evaluate((key) => localStorage.getItem(key), REJECTED_KEY),
  ).toBe('{broken');
  // Leave the game before replacing test storage so pagehide cannot save over the fixture.
  await page.goto('about:blank');
  await page.addInitScript(
    ({ primaryKey, backupKey }) => {
      localStorage.setItem(primaryKey, '{"schemaVersion":999}');
      localStorage.removeItem(backupKey);
    },
    { primaryKey: SAVE_KEY, backupKey: BACKUP_KEY },
  );
  await page.goto('/');
  await expect(
    page.getByRole('button', { name: 'Save recovery needed' }),
  ).toBeVisible();
  await page.clock.runFor(10000);
  expect(
    await page.evaluate((key) => localStorage.getItem(key), SAVE_KEY),
  ).toBe('{"schemaVersion":999}');
  const event = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export save', exact: true }).click();
  expect(await readFile((await (await event).path())!, 'utf8')).toBe(
    '{"schemaVersion":999}',
  );
});

test('two tabs transfer one writer and failed writes preserve the owning game', async ({
  page,
  context,
}) => {
  await boot(page);
  await finishJob(page);
  const other = await context.newPage();
  await other.goto('/');
  await expect(
    other.getByRole('button', { name: 'Paused · another tab' }),
  ).toBeVisible();
  await expect(
    other.getByRole('button', { name: 'New game', exact: true }),
  ).toBeDisabled();
  await page.evaluate((key) => {
    const write = Storage.prototype.setItem;
    Storage.prototype.setItem = function (name, value) {
      if (name === key)
        throw new DOMException('Quota exceeded', 'QuotaExceededError');
      write.call(this, name, value);
    };
  }, SAVE_KEY);
  await finishJob(page);
  await expect(
    page.getByRole('button', { name: 'Unsaved · open Settings' }),
  ).toBeVisible();
  await other.getByRole('button', { name: 'Take control in this tab' }).click();
  await expect(other.getByText(/The other tab could not save/)).toBeVisible();
  await openApp(page, 'Settings');
  const event = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export save', exact: true }).click();
  const raw = await readFile((await (await event).path())!, 'utf8');
  expect(JSON.parse(raw).state.cash).toBe(24);
  expect((await savedState(page)).cash).toBe(12);
  // Restore the actual browser Storage method from an untouched same-origin frame.
  await page.evaluate(() => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const clean = frame.contentWindow as Window & typeof globalThis;
    Storage.prototype.setItem = clean.Storage.prototype.setItem;
    frame.remove();
  });
  await page.getByRole('button', { name: 'Retry saving' }).click();
  await expect(
    page.getByRole('button', { name: 'Saved locally' }),
  ).toBeVisible();
  await other.getByRole('button', { name: 'Take control in this tab' }).click();
  await expect(
    other.getByRole('button', { name: 'Saved locally' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Paused · another tab' }),
  ).toBeVisible();
  expect((await savedState(other)).cash).toBe(24);
  await other.close();
  await page.getByRole('button', { name: 'Take control in this tab' }).click();
  await expect(
    page.getByRole('button', { name: 'Saved locally' }),
  ).toBeVisible();
});

test('initial storage-read failure never overwrites existing progress on retry', async ({
  page,
}) => {
  const game = createGame();
  game.dispatch({ type: 'start-job' });
  game.advance(12000);
  const raw = encodeSave(game.getState());
  await page.addInitScript(
    ({ key, raw }) => {
      localStorage.setItem(key, raw);
      const originalRead = Storage.prototype.getItem;
      Object.defineProperty(window, 'restoreStorageRead', {
        value: () => {
          Storage.prototype.getItem = originalRead;
        },
      });
      Storage.prototype.getItem = function () {
        throw new DOMException('Denied', 'SecurityError');
      };
    },
    { key: SAVE_KEY, raw },
  );
  await page.goto('/');
  await expect(
    page.getByRole('button', { name: 'Unsaved · open Settings' }),
  ).toBeVisible();
  await page.evaluate(() => {
    (
      window as unknown as { restoreStorageRead: () => void }
    ).restoreStorageRead();
  });
  await openApp(page, 'Settings');
  await page.getByRole('button', { name: 'Retry saving' }).click();
  await expect(
    page.getByText(/Export this session, then reload/),
  ).toBeVisible();
  expect(
    await page.evaluate((key) => localStorage.getItem(key), SAVE_KEY),
  ).toBe(raw);
});
