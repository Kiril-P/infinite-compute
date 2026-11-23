import { expect, test } from '@playwright/test';

test('hardware inspection animates the machine and respects motion controls', async ({
  page,
}, testInfo) => {
  const imageRequests: string[] = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'image') imageRequests.push(request.url());
  });
  await page.goto('/');
  await expect(
    page.getByRole('button', { name: 'Saved locally' }),
  ).toBeVisible();
  const computer = page
    .getByRole('region', { name: 'Job Runner' })
    .getByRole('img');
  await expect(computer).toHaveAccessibleName(/Beige PC.*Case closed/);

  await page
    .getByRole('button', { name: 'Hardware Manager', exact: true })
    .press('Space');
  await expect(computer).toHaveAccessibleName(/CPU selected/);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Inspect CPU' })).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await expect(
    page.getByRole('button', { name: 'Inspect RAM' }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(computer).toHaveAccessibleName(/RAM selected/);
  const caseView = page
    .getByRole('region', { name: 'Hardware Manager' })
    .getByRole('img');
  await expect(caseView).toHaveAccessibleName(/RAM selected/);
  await expect(caseView).toBeInViewport({ ratio: 1 });

  const animationStates = () =>
    caseView.evaluate((element) =>
      element
        .getAnimations({ subtree: true })
        .filter(
          (animation) => animation.effect?.getTiming().iterations === Infinity,
        )
        .map((animation) => animation.playState),
    );
  const reduced = testInfo.project.use.reducedMotion === 'reduce';
  if (reduced) {
    await expect.poll(animationStates).toEqual([]);
    await expect(
      page.getByRole('button', { name: 'Pause animation' }),
    ).toBeHidden();
  } else {
    await expect.poll(animationStates).toContain('running');
    await page.getByRole('button', { name: 'Pause animation' }).press('Space');
    await expect.poll(animationStates).toEqual(['paused']);
  }
  await page.screenshot({
    path: testInfo.outputPath('machine-ram-inspection.png'),
  });

  // Selection remains usable with motion disabled; it never changes economy values.
  await page.getByRole('button', { name: 'Inspect CPU' }).press('Enter');
  await expect(computer).toHaveAccessibleName(/CPU selected/);
  if (!reduced) {
    await page.getByRole('button', { name: 'Pause animation' }).press('Space');
    await expect.poll(animationStates).toContain('running');
  }
  await page.getByRole('button', { name: 'Open Job Runner' }).press('Enter');
  await expect(computer).toHaveAccessibleName(/Case closed/);
  await expect(
    page.getByRole('region', { name: 'Global status' }),
  ).toContainText('$0');
  await expect(
    page.getByRole('region', { name: 'Global status' }),
  ).toContainText('Standby');
  expect(imageRequests.every((url) => url.endsWith('/computer.svg'))).toBe(
    true,
  );
});
