import { expect, type Page } from '@playwright/test';
import type { GameState } from '../src/game/engine/game';
import { SAVE_KEY } from '../src/game/persistence/save';

export async function boot(page: Page) {
  await page.clock.install({ time: new Date('2026-09-08T08:00:00Z') });
  await page.clock.pauseAt(new Date('2026-09-08T08:00:01Z'));
  await page.goto('/');
  await expect(
    page.getByRole('button', { name: 'Saved locally' }),
  ).toBeVisible();
}
export async function savedState(page: Page): Promise<GameState> {
  return page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!).state,
    SAVE_KEY,
  );
}
export async function openApp(page: Page, name: string) {
  await page
    .getByRole('navigation', { name: 'Applications' })
    .getByRole('button', { name, exact: true })
    .press('Enter');
  await expect(page.getByRole('heading', { name, exact: true })).toBeFocused();
}
export async function finishJob(page: Page) {
  await openApp(page, 'Job Runner');
  await page
    .getByRole('combobox', { name: 'Bonus mode' })
    .selectOption('decision');
  await page.getByRole('button', { name: 'Start Job', exact: true }).click();
  const repeated = await page
    .getByText('These cells are used repeatedly.', { exact: false })
    .isVisible();
  await page
    .getByRole('button', {
      name: repeated ? 'Keep in cache' : 'Stream once',
      exact: true,
    })
    .click();
  await expect(page.getByText('Bonus reserved: +50%')).toBeVisible();
  // Advance precisely to the next completion through the browser clock, never a production game shortcut.
  const state = await savedState(page);
  const efficiency = Math.max(
    0.7,
    1 - 0.05 * Math.max(0, state.hardware.cpu - state.hardware.ram - 1),
  );
  const ms =
    Math.ceil((12 / ((1 + 0.5 * state.hardware.cpu) * efficiency)) * 10) * 100;
  await page.clock.runFor(ms);
  await expect(
    page.getByRole('button', { name: 'Start Job', exact: true }),
  ).toBeVisible();
}
export async function buy(page: Page, part: 'CPU' | 'RAM') {
  await openApp(page, 'Hardware Manager');
  await page.getByRole('button', { name: `Inspect ${part}` }).click();
  const purchase = page.getByRole('button', {
    name: new RegExp(`^Buy ${part}`),
  });
  while (await purchase.isDisabled()) {
    await finishJob(page);
    await openApp(page, 'Hardware Manager');
  }
  await purchase.click();
}
