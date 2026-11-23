import { expect, test } from 'vitest';
import { createGame } from './game';

test('two attentive household Jobs buy the first CPU at 24 seconds', () => {
  const game = createGame({ seed: 7 });
  game.dispatch({ type: 'buy-hardware', part: 'cpu' });
  expect(game.getState().hardware.cpu).toBe(0);
  for (let cycle = 0; cycle < 2; cycle++) {
    game.dispatch({ type: 'start-job' });
    game.advance(1200);
    game.dispatch({ type: 'attempt-timing' });
    game.advance(10800);
  }
  expect(game.getState().cash).toBe(24);
  expect(game.getState().elapsedMs).toBe(24000);
  game.dispatch({ type: 'buy-hardware', part: 'cpu' });
  expect(game.getState().cash).toBe(4);
  expect(game.getState().hardware.cpu).toBe(1);
  expect(game.getSnapshot().compute.effective).toBe(1.5);
});

test('ignored bonuses buy a first CPU at 36 seconds and rapid input cannot improve a cycle', () => {
  const ignored = createGame();
  const spam = createGame();
  for (let cycle = 0; cycle < 3; cycle++) {
    ignored.dispatch({ type: 'start-job' });
    spam.dispatch({ type: 'start-job' });
    for (let i = 0; i < 120; i++) {
      spam.dispatch({ type: 'attempt-timing' });
      spam.dispatch({ type: 'start-job' });
      spam.advance(100);
    }
    ignored.advance(12000);
  }
  expect(ignored.getState().cash).toBe(24);
  expect(spam.getState().cash).toBe(24);
  ignored.dispatch({ type: 'buy-hardware', part: 'cpu' });
  expect(ignored.getState().milestones.firstPurchaseMs).toBe(36000);
});

test('decision mode has the same reward budget and changing mode cannot refresh an opportunity', () => {
  const game = createGame({ seed: 13 });
  game.dispatch({ type: 'set-input-mode', mode: 'decision' });
  game.dispatch({ type: 'start-job' });
  game.dispatch({
    type: 'choose-strategy',
    strategy: game.getState().job!.workload,
  });
  game.dispatch({ type: 'set-input-mode', mode: 'timing' });
  game.dispatch({ type: 'choose-strategy', strategy: 'stream' });
  game.dispatch({ type: 'attempt-timing' });
  expect(game.getState().job!.mode).toBe('decision');
  game.advance(12000);
  expect(game.getState().cash).toBe(12);
  game.dispatch({ type: 'start-job' });
  expect(game.getState().job!.mode).toBe('timing');
});

test('fixed ticks preserve seeded state across partitioned advances and resume', () => {
  const one = createGame({ seed: 42 });
  const split = createGame({ seed: 42 });
  one.dispatch({ type: 'start-job' });
  split.dispatch({ type: 'start-job' });
  one.advance(4173);
  for (const ms of [7, 333, 1, 2000, 1832]) split.advance(ms);
  expect(split.getState()).toEqual(one.getState());
  const resumed = createGame({ state: split.getState() });
  resumed.advance(9000);
  one.advance(9000);
  expect(resumed.getState()).toEqual(one.getState());
  const external = resumed.getState();
  external.cash = 999999;
  expect(resumed.getState().cash).toBe(8);
});

function preparePayroll(game: ReturnType<typeof createGame>) {
  game.dispatch({ type: 'set-input-mode', mode: 'decision' });
  for (const part of ['cpu', 'cpu', 'ram', 'cpu', 'ram'] as const) {
    const before = game.getState().hardware[part];
    while (game.getState().hardware[part] === before) {
      game.dispatch({ type: 'buy-hardware', part });
      if (game.getState().hardware[part] !== before) break;
      game.dispatch({ type: 'start-job' });
      game.dispatch({
        type: 'choose-strategy',
        strategy: game.getState().job!.workload,
      });
      while (game.getState().job) game.advance(100);
    }
  }
}

test('Safe Mode Payroll preserves ordinary work, disables bonuses, and grants auto-run once at 3–5 minutes', () => {
  const game = createGame({ seed: 10 });
  game.dispatch({ type: 'start-benchmark', strategy: 'pages' });
  expect(game.getState().benchmark).toBeNull();
  preparePayroll(game);
  game.dispatch({ type: 'start-job' });
  game.advance(300);
  const ordinaryJob = game.getState().job;
  const cash = game.getState().cash;
  game.dispatch({ type: 'start-benchmark', strategy: 'whole' });
  expect(game.getState().benchmark).toBeNull();
  game.dispatch({ type: 'start-benchmark', strategy: 'pages' });
  game.dispatch({ type: 'choose-strategy', strategy: ordinaryJob!.workload });
  game.dispatch({ type: 'buy-hardware', part: 'cpu' });
  game.advance(60000);
  expect(game.getState().job).toEqual(ordinaryJob);
  expect(game.getState().cash).toBe(cash);
  const resumed = createGame({ state: game.getState() });
  resumed.advance(60000);
  expect(resumed.getState().automation).toEqual({
    unlocked: true,
    enabled: true,
  });
  expect(resumed.getState().milestones.automationMs).toBeGreaterThanOrEqual(
    180000,
  );
  expect(resumed.getState().milestones.automationMs).toBeLessThanOrEqual(
    300000,
  );
  expect(resumed.getState().job).toEqual(ordinaryJob);
  resumed.dispatch({ type: 'start-benchmark', strategy: 'pages' });
  expect(resumed.getState().benchmark).toBeNull();
  resumed.advance(12000);
  expect(resumed.getState().completedJobs).toBeGreaterThan(
    game.getState().completedJobs,
  );
});

test('RAM-first preparation remains viable; whole-file Payroll exits safely and completes faster', () => {
  const game = createGame();
  game.dispatch({ type: 'set-input-mode', mode: 'decision' });
  for (const part of ['ram', 'ram', 'ram', 'cpu', 'cpu', 'cpu'] as const) {
    const level = game.getState().hardware[part];
    while (game.getState().hardware[part] === level) {
      game.dispatch({ type: 'buy-hardware', part });
      if (game.getState().hardware[part] !== level) break;
      game.dispatch({ type: 'start-job' });
      game.advance(12000);
    }
  }
  game.dispatch({ type: 'start-job' });
  game.advance(500);
  const job = game.getState().job;
  game.dispatch({ type: 'start-benchmark', strategy: 'whole' });
  game.advance(1000);
  game.dispatch({ type: 'exit-benchmark' });
  expect(game.getState().job).toEqual(job);
  game.dispatch({ type: 'start-benchmark', strategy: 'whole' });
  game.advance(60000);
  game.advance(36000);
  expect(game.getState().automation.unlocked).toBe(true);
  expect(game.getState().job).toEqual(job);
});

test('every opening CPU/RAM purchase order is nondecreasing in delivered Compute', () => {
  for (let cpu = 0; cpu <= 6; cpu++)
    for (let ram = 0; ram <= 6; ram++) {
      for (const part of ['cpu', 'ram'] as const) {
        const state = createGame().getState();
        state.hardware = { cpu, ram };
        state.cash = 10000;
        const game = createGame({ state });
        const before = game.getSnapshot().compute.effective;
        game.dispatch({ type: 'buy-hardware', part });
        expect(game.getSnapshot().compute.effective).toBeGreaterThanOrEqual(
          before,
        );
      }
    }
});
