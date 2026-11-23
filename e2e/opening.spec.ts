import { expect, test } from '@playwright/test';
import { boot, buy, finishJob, openApp, savedState } from './opening.helpers';

test('first purchase, partial-job reload, Payroll isolation and auto-run use the real UI', async ({
  page,
}, testInfo) => {
  await boot(page);
  await finishJob(page);
  await expect(
    page.getByText(
      'The household accounts balance. The existence question remains outstanding.',
    ),
  ).toBeVisible();
  await buy(page, 'CPU');
  expect((await savedState(page)).milestones.firstPurchaseMs).toBe(24000);
  for (const part of ['CPU', 'RAM', 'CPU', 'RAM'] as const)
    await buy(page, part);
  await openApp(page, 'Job Runner');
  await page.getByRole('button', { name: 'Start Job', exact: true }).click();
  await page.clock.runFor(2000);
  await openApp(page, 'Task Manager');
  await page
    .getByRole('combobox', { name: 'Payroll strategy' })
    .selectOption('whole');
  await expect(
    page.getByText('Needs 16 MB; buy RAM 3 or choose Small pages.'),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Start Safe Mode Payroll' }),
  ).toBeDisabled();
  await page
    .getByRole('combobox', { name: 'Payroll strategy' })
    .selectOption('pages');
  await page.getByRole('button', { name: 'Start Safe Mode Payroll' }).click();
  const paused = (await savedState(page)).job;
  await page.clock.runFor(60000);
  expect((await savedState(page)).job).toEqual(paused);
  const before = await savedState(page);
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Saved locally' }),
  ).toBeVisible();
  expect(await savedState(page)).toEqual(before);
  await openApp(page, 'Task Manager');
  await page.screenshot({ path: testInfo.outputPath('payroll-running.png') });
  await page.clock.runFor(60000);
  await expect(
    page.getByText('Passed · basic auto-run is permanently unlocked.'),
  ).toBeVisible();
  const passed = await savedState(page);
  expect(passed.milestones.automationMs).toBeGreaterThanOrEqual(180000);
  expect(passed.milestones.automationMs).toBeLessThanOrEqual(300000);
  await page.getByRole('button', { name: 'Pause auto-run' }).click();
  await page.clock.runFor(12000);
  expect((await savedState(page)).job).toBeNull();
  await page.getByRole('button', { name: 'Enable auto-run' }).click();
  await page.clock.runFor(12000);
  expect((await savedState(page)).completedJobs).toBeGreaterThan(
    passed.completedJobs,
  );
  await page.screenshot({
    path: testInfo.outputPath('automation-unlocked.png'),
  });
});
