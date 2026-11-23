import { expect, test, type Page } from '@playwright/test';
import { runHomeRoute } from '../src/test/home-route';
import { encodeSave, SAVE_KEY } from '../src/game/persistence/save';
import { boot, openApp, savedState } from './opening.helpers';

async function bounds(page: Page, name: string) {
  const region = page.getByRole('region', { name, exact: true });
  const bottom =
    (await region.boundingBox())!.y + (await region.boundingBox())!.height;
  for (const control of await region
    .locator('button:visible,p:visible,select:visible,label:visible')
    .all()) {
    const box = (await control.boundingBox())!;
    expect(
      box.y + box.height,
      (await control.textContent()) ?? 'control',
    ).toBeLessThanOrEqual(bottom - 3);
    await expect(control).toBeInViewport({ ratio: 1 });
  }
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollHeight === innerHeight &&
        document.documentElement.scrollWidth === innerWidth &&
        scrollY === 0,
    ),
  ).toBe(true);
}

test('Workstation transition, live Research, refundable tuning and profiles are usable and saved', async ({
  page,
}, testInfo) => {
  const { game } = runHomeRoute();
  while (game.getState().cash < 2500) game.advance(100);
  const before = game.getState();
  await page.addInitScript(
    ({ raw, key }) => {
      if (!sessionStorage.getItem('workstation-fixture')) {
        localStorage.setItem(key, raw);
        sessionStorage.setItem('workstation-fixture', 'set');
      }
    },
    { key: SAVE_KEY, raw: encodeSave(before) },
  );
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await boot(page);
  await openApp(page, 'Hardware Manager');
  await page
    .getByRole('button', { name: 'Storage & chassis', exact: true })
    .click();
  await page
    .getByRole('button', { name: /^Move into Workstation/ })
    .press('Enter');
  expect((await savedState(page)).job).toEqual(before.job);
  expect((await savedState(page)).workstation.research.points).toBe(5);
  await openApp(page, 'Research Lab');
  await bounds(page, 'Research Lab');
  await page
    .getByRole('button', { name: 'Operating Profiles', exact: true })
    .click();
  await page
    .getByRole('combobox', { name: 'Operating Profile', exact: true })
    .selectOption('research');
  await page
    .getByRole('button', { name: 'Apply profile', exact: true })
    .click();
  await page.clock.runFor(90000);
  await page
    .getByRole('button', { name: 'Discoveries & tuning', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Research Parallel Library', exact: true })
    .click();
  await page
    .getByRole('combobox', { name: 'Research node', exact: true })
    .selectOption('wide-vectors');
  await page
    .getByRole('button', { name: 'Research Wide Vectors', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Operating Profiles', exact: true })
    .click();
  await page
    .getByRole('combobox', { name: 'Operating Profile', exact: true })
    .selectOption('throughput');
  await page
    .getByRole('button', { name: 'Save current setup', exact: true })
    .click();
  const paid = await savedState(page);
  await page
    .getByRole('button', { name: 'Recompile Kernel · refund 25', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Apply profile', exact: true })
    .click();
  expect((await savedState(page)).workstation.research.points).toBe(
    paid.workstation.research.points + 25,
  );
  await expect(
    page.getByText(/Unavailable tuning: Wide Vectors/),
  ).toBeVisible();
  await page.setViewportSize({ width: 640, height: 480 });
  await bounds(page, 'Research Lab');
  await page.screenshot({ path: testInfo.outputPath('profiles-640x480.png') });
  await page
    .getByRole('button', { name: 'Discoveries & tuning', exact: true })
    .click();
  await bounds(page, 'Research Lab');
  await page.screenshot({ path: testInfo.outputPath('research-640x480.png') });
  await openApp(page, 'Task Manager');
  await page
    .getByRole('button', { name: 'Queue & capacity', exact: true })
    .click();
  await bounds(page, 'Task Manager');
  await page.screenshot({ path: testInfo.outputPath('capacity-640x480.png') });
  await openApp(page, 'Job Runner');
  await bounds(page, 'Job Runner');
  await expect(page.locator('#job-runner .machine-visual')).toHaveAttribute(
    'data-era',
    'workstation',
  );
  await page.screenshot({ path: testInfo.outputPath('lab-640x480.png') });
  const saved = await savedState(page);
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Saved locally', exact: true }),
  ).toBeVisible();
  expect(await savedState(page)).toEqual(saved);
  expect(errors).toEqual([]);
});
