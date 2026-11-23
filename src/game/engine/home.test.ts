import { decodeSave, encodeSave } from '../persistence/save';
import { expect, test } from 'vitest';
import { createGame } from './game';

function openingGame() {
  const game = createGame({ seed: 20 });
  game.dispatch({ type: 'set-input-mode', mode: 'decision' });
  for (const part of ['cpu', 'cpu', 'ram', 'cpu', 'ram'] as const) {
    const level = game.getState().hardware[part];
    while (game.getState().hardware[part] === level) {
      game.dispatch({ type: 'buy-hardware', part });
      if (game.getState().hardware[part] !== level) break;
      game.dispatch({ type: 'start-job' });
      game.dispatch({
        type: 'choose-strategy',
        strategy: game.getState().job!.workload,
      });
      while (game.getState().job) game.advance(100);
    }
  }
  game.dispatch({ type: 'start-benchmark', strategy: 'pages' });
  game.advance(60000);
  game.advance(60000);
  return game;
}

test('Storage and a Wide bus carry the original machine into Home PC without losing auto-run or work', () => {
  const game = openingGame();
  game.dispatch({ type: 'transition-home' });
  expect(game.getState().home?.reached).toBe(false);
  function earnUntil(action: () => void, done: () => boolean) {
    while (!done()) {
      action();
      if (!done()) game.advance(1000);
      if (game.getState().elapsedMs > 900000)
        throw new Error('Home-PC route stalled');
    }
  }
  earnUntil(
    () => game.dispatch({ type: 'buy-storage' }),
    () => game.getState().home.storage === 1,
  );
  game.dispatch({ type: 'select-job', id: 'photo' });
  for (const [part, target] of [
    ['cpu', 6],
    ['ram', 4],
  ] as const) {
    earnUntil(
      () => game.dispatch({ type: 'buy-hardware', part }),
      () => game.getState().hardware[part] === target,
    );
  }
  earnUntil(
    () => game.dispatch({ type: 'buy-wide-bus' }),
    () => game.getState().home.wideBus,
  );
  earnUntil(
    () => game.dispatch({ type: 'transition-home' }),
    () => game.getState().home.reached,
  );
  const state = game.getState();
  expect(state.automation).toEqual({ unlocked: true, enabled: true });
  expect(state.home.transitionMs).toBeGreaterThanOrEqual(480000);
  expect(state.home.transitionMs).toBeLessThanOrEqual(600000);
  expect(state.completedJobs).toBeGreaterThan(10);
  const resumed = createGame({ state });
  resumed.dispatch({ type: 'transition-home' });
  expect(resumed.getState()).toEqual(state);
  expect(
    game.getSnapshot().jobs.find((job) => job.id === 'household-ledger')!
      .durationMs,
  ).toBe(100);
});

test('Memory Pressure isolates an oversized stall, exits safely, and awards queue policy once through Small pages', () => {
  const state = createGame().getState();
  state.hardware = { cpu: 8, ram: 5 };
  state.milestones.firstPurchaseMs = 0;
  state.milestones.automationMs = 0;
  state.automation = { unlocked: true, enabled: true };
  state.home = {
    ...state.home,
    reached: true,
    wideBus: true,
    storage: 2,
    selectedJob: 'wonder',
    transitionMs: 0,
  };
  const game = createGame({ state });
  game.advance(2300);
  const ordinary = game.getState().job;
  game.dispatch({ type: 'start-memory-test', strategy: 'whole' });
  game.advance(10000);
  expect(game.getState().benchmark?.work).toBe(0);
  expect(game.getState().job).toEqual(ordinary);
  game.dispatch({ type: 'exit-benchmark' });
  expect(game.getState().job).toEqual(ordinary);
  game.dispatch({ type: 'start-memory-test', strategy: 'pages' });
  game.advance(60000);
  const saved = decodeSave(encodeSave(game.getState()));
  expect(saved.ok).toBe(true);
  if (!saved.ok) throw new Error(saved.error);
  const resumed = createGame({ state: saved.state });
  resumed.advance(60000);
  resumed.advance(13400);
  expect(resumed.getState().home.queue.unlocked).toBe(true);
  expect(resumed.getState().automation).toEqual({
    unlocked: true,
    enabled: true,
  });
  expect(resumed.getState().job).toEqual(ordinary);
  resumed.dispatch({ type: 'start-memory-test', strategy: 'pages' });
  expect(resumed.getState().benchmark).toBeNull();
  resumed.dispatch({ type: 'set-queue-policy', policy: 'cash' });
  resumed.dispatch({ type: 'prioritize-batch', id: 'wonder' });
  resumed.dispatch({ type: 'prioritize-batch', id: 'household-ledger' });
  expect(resumed.getState().job!.bonus).toBe(0.5);
  expect(resumed.getState().home.queue.nextBatch).toBe('wonder');
  resumed.advance(10000);
  expect(resumed.getState().job!.id).toBe('wonder');
});

test('graphics hardware unlocks specialized work and cooling recovers its disclosed airflow penalty', () => {
  const state = createGame().getState();
  state.hardware = { cpu: 8, ram: 5 };
  state.cash = 30000;
  state.automation = { unlocked: true, enabled: false };
  state.home = {
    ...state.home,
    reached: true,
    wideBus: true,
    storage: 2,
    transitionMs: 0,
  };
  const game = createGame({ state });
  game.dispatch({ type: 'buy-home-part', part: 'gpu' });
  expect(game.getState().home.gpu).toBe(1);
  expect(game.getState().cash).toBe(24000);
  const first = game.getSnapshot().jobs.find((job) => job.id === 'logo')!;
  expect(first.blocker).toBeNull();
  game.dispatch({ type: 'buy-home-part', part: 'gpu' });
  game.dispatch({ type: 'buy-home-part', part: 'gpu' });
  expect(game.getSnapshot().compute.airflowFactor).toBeLessThan(1);
  const constrained = game
    .getSnapshot()
    .jobs.find((job) => job.id === 'logo')!.durationMs;
  game.dispatch({ type: 'buy-home-part', part: 'cooling' });
  game.dispatch({ type: 'buy-home-part', part: 'cooling' });
  expect(game.getSnapshot().compute.airflowFactor).toBe(1);
  const ready = game.getSnapshot().jobs.find((job) => job.id === 'logo')!;
  expect(ready.durationMs).toBeLessThan(constrained);
  const cash = game.getState().cash;
  game.dispatch({ type: 'select-job', id: 'logo' });
  game.dispatch({ type: 'start-job' });
  game.advance(ready.durationMs);
  expect(game.getState().cash - cash).toBe(1600);
  expect(game.getState().job).toBeNull();
});
