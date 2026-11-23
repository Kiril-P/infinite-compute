import { expect, test } from 'vitest';
import { runHomeRoute } from '../../test/home-route';
import { decodeSave, encodeSave } from '../persistence/save';
import { createGame } from './game';

function workstationGame() {
  const { game } = runHomeRoute();
  while (game.getState().cash < 2500) game.advance(100);
  const before = game.getState();
  game.dispatch({ type: 'transition-workstation' });
  expect(game.getState().workstation.reached).toBe(true);
  expect(game.getState().job).toEqual(before.job);
  expect(game.getState().home).toEqual(before.home);
  return game;
}

test('workstation opens Research on the real route and Jobs/Research share one finite budget', () => {
  const game = workstationGame();
  expect(game.getState().workstation.transitionMs).toBeLessThanOrEqual(1320000);
  expect(game.getState().workstation.research.points).toBe(5);
  for (const profile of ['balanced', 'throughput', 'research'] as const) {
    game.dispatch({ type: 'apply-profile', profile });
    game.advance(1000);
    const { allocation, compute } = game.getSnapshot();
    expect(allocation.jobs + allocation.research).toBeLessThanOrEqual(
      compute.effective + 1e-9,
    );
    expect(allocation.research).toBeGreaterThan(0);
  }
  game.dispatch({ type: 'apply-profile', profile: 'balanced' });
  const unlockedAt = game.getState().workstation.transitionMs!;
  while (game.getState().workstation.research.points < 25) game.advance(100);
  expect(game.getState().elapsedMs - unlockedAt).toBeLessThanOrEqual(120000);
  console.info(
    'Workstation pacing',
    JSON.stringify({
      researchMs: unlockedAt,
      firstPurchaseMs: game.getState().elapsedMs,
      waitMs: game.getState().elapsedMs - unlockedAt,
    }),
  );
  game.dispatch({ type: 'buy-research', id: 'wide-vectors' });
  expect(
    game.getState().workstation.research.tuning['wide-vectors']?.paid,
  ).toBe(25);
  const result = decodeSave(encodeSave(game.getState()));
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error);
  const resumed = createGame({ state: result.state });
  game.advance(10000);
  resumed.advance(10000);
  expect(resumed.getState()).toEqual(game.getState());
});

test('recompile refunds paid tuning once while preserving discoveries and saved profile intent', () => {
  const game = workstationGame();
  game.dispatch({ type: 'apply-profile', profile: 'research' });
  while (game.getState().workstation.research.points < 90) game.advance(100);
  game.dispatch({ type: 'buy-research', id: 'parallel-library' });
  game.dispatch({ type: 'buy-research', id: 'branch-cache' });
  game.dispatch({ type: 'buy-research', id: 'wide-vectors' });
  game.dispatch({ type: 'save-profile', profile: 'throughput' });
  game.dispatch({ type: 'prioritize-batch', id: 'logo' });
  const before = game.getState();
  game.dispatch({ type: 'recompile' });
  game.dispatch({ type: 'recompile' });
  const refunded = game.getState();
  expect(refunded.workstation.research.points).toBe(
    before.workstation.research.points + 50,
  );
  expect(refunded.workstation.research.discoveries).toContain(
    'parallel-library',
  );
  expect(refunded.workstation.research.tuning).toEqual({});
  expect(refunded.job?.bonus).toBe(0);
  expect(refunded.job?.attempted).toBe(true);
  game.dispatch({ type: 'apply-profile', profile: 'throughput' });
  expect(game.getSnapshot().research.missingTuning).toEqual([
    'branch-cache',
    'wide-vectors',
  ]);
  expect(game.getState().workstation.research.points).toBe(
    refunded.workstation.research.points,
  );
  expect(
    game.getSnapshot().jobs.find((job) => job.id === 'protein')!.blocker,
  ).toBeNull();
});

test('profiles restore owned enabled selections and compilation preserves an in-flight setup', () => {
  const game = workstationGame();
  game.dispatch({ type: 'apply-profile', profile: 'research' });
  while (game.getState().workstation.research.points < 150) game.advance(100);
  game.dispatch({ type: 'buy-research', id: 'parallel-library' });
  game.dispatch({ type: 'buy-research', id: 'wide-vectors' });
  const enhanced = game.getSnapshot().compute.graphics;
  game.dispatch({ type: 'set-tuning', id: 'wide-vectors', enabled: false });
  expect(game.getSnapshot().compute.graphics).toBeCloseTo(enhanced / 1.25);
  game.dispatch({ type: 'save-profile', profile: 'balanced' });
  game.dispatch({ type: 'set-tuning', id: 'wide-vectors', enabled: true });
  game.dispatch({ type: 'apply-profile', profile: 'balanced' });
  expect(game.getState().workstation.research.enabled).toEqual([]);
  expect(game.getState().workstation.research.tuning['wide-vectors']).toEqual({
    paid: 25,
  });
  game.dispatch({ type: 'set-auto-run', enabled: false });
  while (game.getState().job) game.advance(100);
  game.dispatch({ type: 'set-queue-policy', policy: 'selected' });
  game.dispatch({ type: 'select-job', id: 'protein' });
  game.dispatch({ type: 'start-job' });
  expect(game.getState().job?.setupRemainingMs).toBe(800);
  const ongoing = game.getState().job;
  game.dispatch({ type: 'buy-research', id: 'queue-compiler' });
  expect(game.getState().job).toEqual(ongoing);
  while (game.getState().job) game.advance(100);
  expect(game.getState().workstation.research.proteinMilestone).toBe(true);
  game.dispatch({ type: 'start-job' });
  expect(game.getState().job?.setupRemainingMs).toBe(480);
  const predicted = game
    .getSnapshot()
    .jobs.find((item) => item.id === 'protein')!.durationMs;
  const start = game.getState().elapsedMs;
  while (game.getState().job) game.advance(100);
  expect(game.getState().elapsedMs - start).toBe(predicted);
  expect(game.getState().home.queue.completed.protein).toBe(2);
  const decoded = decodeSave(encodeSave(game.getState()));
  expect(decoded.ok).toBe(true);
});
