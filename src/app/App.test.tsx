import { fireEvent, render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';
import { App } from './App';

test('boots into the OS shell with a Current Objective and global status', () => {
  render(<App />);

  expect(
    screen.getByRole('heading', { name: 'Infinite Compute' }),
  ).toBeVisible();
  expect(
    screen.getByRole('region', { name: 'Current Objective' }),
  ).toBeVisible();
  expect(
    screen.getByRole('region', { name: 'Global status' }),
  ).toHaveTextContent('Cash');
  expect(screen.getByRole('region', { name: 'Job Runner' })).toBeVisible();
  expect(
    screen.getByRole('region', { name: 'Hardware Manager' }),
  ).toBeVisible();
});

test('application navigation and the Current Objective move keyboard focus to the target window', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'Hardware Manager' }));
  expect(
    screen.getByRole('heading', { name: 'Hardware Manager' }),
  ).toHaveFocus();
  expect(
    screen.getByRole('button', { name: 'Hardware Manager' }),
  ).toHaveAttribute('aria-pressed', 'true');

  fireEvent.click(screen.getByRole('button', { name: 'Open Job Runner' }));
  expect(screen.getByRole('heading', { name: 'Job Runner' })).toHaveFocus();
  expect(screen.getByRole('button', { name: 'Job Runner' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  expect(
    screen.getByRole('button', { name: 'Hardware Manager' }),
  ).toHaveAttribute('aria-pressed', 'false');
});

test('the computer opens for hardware inspection and responds to the selected part', () => {
  render(<App />);
  const computer = within(screen.getByRole('region', { name: 'Job Runner' }));
  expect(
    computer.getByRole('img', { name: /Beige PC.*Case closed/ }),
  ).toBeVisible();

  fireEvent.click(screen.getByRole('button', { name: 'Hardware Manager' }));
  expect(
    computer.getByRole('img', { name: /Beige PC.*CPU selected/ }),
  ).toBeVisible();
  expect(screen.getByRole('button', { name: 'Inspect CPU' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );

  fireEvent.click(screen.getByRole('button', { name: 'Inspect RAM' }));
  expect(
    computer.getByRole('img', { name: /Beige PC.*RAM selected/ }),
  ).toBeVisible();
  expect(screen.getByRole('button', { name: 'Inspect RAM' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );

  fireEvent.click(screen.getByRole('button', { name: 'Open Job Runner' }));
  expect(
    computer.getByRole('img', { name: /Beige PC.*Case closed/ }),
  ).toBeVisible();
});
