import { expect, test } from '@playwright/test';
import { boot, finishJob, openApp, savedState } from './opening.helpers';

test('hidden time pauses progress and sound remains opt-in with working mute', async ({
  page,
}) => {
  await boot(page);
  await page.evaluate(() => {
    Reflect.set(window, 'observedOscillators', 0);
    const create = AudioContext.prototype.createOscillator;
    AudioContext.prototype.createOscillator = function () {
      Reflect.set(
        window,
        'observedOscillators',
        Number(Reflect.get(window, 'observedOscillators')) + 1,
      );
      return create.call(this);
    };
  });
  await page.getByRole('button', { name: 'Start Job', exact: true }).click();
  await page.clock.runFor(4000);
  const before = await savedState(page);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', {
      value: true,
      configurable: true,
    });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.clock.runFor(60000);
  expect(await savedState(page)).toEqual(before);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', {
      value: false,
      configurable: true,
    });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.clock.runFor(8000);
  await expect(
    page.getByRole('region', { name: 'Global status' }),
  ).toContainText('$8');
  expect(
    await page.evaluate(() => Reflect.get(window, 'observedOscillators')),
  ).toBe(0);
  await openApp(page, 'Settings');
  await page.getByRole('button', { name: 'Sound & motion' }).click();
  await page
    .getByRole('checkbox', { name: 'Sound feedback', exact: true })
    .check();
  await finishJob(page);
  await expect
    .poll(() => page.evaluate(() => Reflect.get(window, 'observedOscillators')))
    .toBe(1);
  await openApp(page, 'Settings');
  await page
    .getByRole('checkbox', { name: 'Sound feedback', exact: true })
    .uncheck();
  await finishJob(page);
  expect(
    await page.evaluate(() => Reflect.get(window, 'observedOscillators')),
  ).toBe(1);
});
