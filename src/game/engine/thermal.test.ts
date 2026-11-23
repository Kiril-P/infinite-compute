import { expect, test } from 'vitest';
import { runHomeRoute } from '../../test/home-route';
import { createGame } from './game';
import { decodeSave, encodeSave } from '../persistence/save';

function warmWorkstation() {
  const { game } = runHomeRoute();
  while (game.getState().cash < 2500) game.advance(100);
  game.dispatch({ type: 'transition-workstation' });
  game.dispatch({ type: 'set-auto-run', enabled: false });
  game.advance(60000);
  game.advance(60000);
  game.dispatch({ type: 'buy-research', id: 'parallel-library' });
  game.dispatch({ type: 'buy-research', id: 'thermal-model' });
  const state = game.getState();
  state.cash = 1e7;
  return createGame({ state });
}

test('power and heat explain mixed losses and Eco plus upgrades recover without destroying work', () => {
  const game = warmWorkstation();
  for (let i = 0; i < 4; i++)
    game.dispatch({ type: 'buy-hardware', part: 'cpu' });
  for (let i = 0; i < 2; i++)
    game.dispatch({ type: 'buy-home-part', part: 'gpu' });
  game.advance(60000);
  game.advance(60000);
  const constrained = game.getSnapshot();
  expect(constrained.compute.powerFactor).toBeLessThan(1);
  expect(constrained.compute.thermalFactor).toBeLessThan(1);
  expect(constrained.compute.memoryFactor).toBeLessThan(1);
  expect(
    constrained.allocation.jobs + constrained.allocation.research,
  ).toBeLessThanOrEqual(constrained.compute.effective + 1e-9);
  const cash = game.getState().cash;
  game.dispatch({ type: 'set-clock', clock: 'eco' });
  game.advance(60000);
  game.advance(60000);
  expect(game.getSnapshot().compute.thermalFactor).toBe(1);
  expect(game.getState().cash).toBeGreaterThanOrEqual(cash);
  game.dispatch({ type: 'buy-power' });
  game.dispatch({ type: 'buy-power' });
  expect(game.getSnapshot().compute.powerFactor).toBe(1);
  expect(decodeSave(encodeSave(game.getState())).ok).toBe(true);
});

test('Heat Soak isolates ordinary state, persists failure, and grants the safe fan-curve reward once', () => {
  const game = warmWorkstation();
  for (let i = 0; i < 2; i++) {
    game.dispatch({ type: 'buy-hardware', part: 'cpu' });
    game.dispatch({ type: 'buy-hardware', part: 'ram' });
  }
  game.dispatch({ type: 'buy-home-part', part: 'cooling' });
  game.dispatch({ type: 'buy-power' });
  game.dispatch({ type: 'select-job', id: 'protein' });
  game.dispatch({ type: 'start-job' });
  game.dispatch({ type: 'set-software', plan: 'lease' });
  const ordinary = game.getState();
  game.dispatch({ type: 'start-heat-soak', strategy: 'standard' });
  expect(game.getState().benchmark?.id).toBe('heat');
  game.advance(30000);
  const loaded = decodeSave(encodeSave(game.getState()));
  expect(loaded.ok).toBe(true);
  if (!loaded.ok) throw new Error(loaded.error);
  const resumed = createGame({ state: loaded.state });
  for (let i = 0; i < 3; i++) {
    game.advance(60000);
    resumed.advance(60000);
  }
  expect(resumed.getState()).toEqual(game.getState());
  expect(game.getState().benchmark).toMatchObject({
    id: 'heat',
    result: 'overheated',
  });
  expect(game.getState().job).toEqual(ordinary.job);
  expect(game.getState().workstation.research).toEqual(
    ordinary.workstation.research,
  );
  expect(game.getState().home.software).toEqual(ordinary.home.software);
  expect(game.getState().workstation.operations.temperature).toBe(
    ordinary.workstation.operations.temperature,
  );
  game.dispatch({ type: 'exit-benchmark' });
  game.dispatch({ type: 'start-heat-soak', strategy: 'eco' });
  for (let i = 0; i < 3000 && game.getState().benchmark; i++) game.advance(100);
  expect(game.getState().benchmark).toBeNull();
  expect(game.getState().workstation.operations.fanCurve).toBe(true);
  expect(game.getState().workstation.research.points).toBe(
    ordinary.workstation.research.points + 10,
  );
  expect(game.getState().job).toEqual(ordinary.job);
  expect(game.getState().home.software).toEqual(ordinary.home.software);
  expect(game.getState().workstation.operations.temperature).toBe(
    ordinary.workstation.operations.temperature,
  );
  const rewarded = game.getState();
  game.dispatch({ type: 'start-heat-soak', strategy: 'eco' });
  expect(game.getState()).toEqual(rewarded);
});

test('Thermal Window accepts two broad adjustments, matches an untimed plan, and repeated input only ends the boost', () => {
  const timing = warmWorkstation();
  const decision = createGame({ state: timing.getState() });
  timing.dispatch({ type: 'set-input-mode', mode: 'timing' });
  decision.dispatch({ type: 'set-input-mode', mode: 'decision' });
  timing.dispatch({ type: 'start-thermal-window' });
  decision.dispatch({ type: 'start-thermal-window' });
  const plan = decision.getSnapshot().thermal.requiredPlan;
  decision.dispatch({ type: 'choose-thermal-plan', plan });
  for (const ms of [4000, 5000]) {
    timing.advance(ms);
    decision.advance(ms);
    timing.dispatch({ type: 'adjust-thermal-window' });
    expect(timing.getState().workstation.operations.temperature).toBeCloseTo(
      decision.getState().workstation.operations.temperature,
    );
    expect(timing.getSnapshot().compute.effective).toBeCloseTo(
      decision.getSnapshot().compute.effective,
    );
  }
  timing.advance(6000);
  decision.advance(6000);
  expect(timing.getState().workstation.operations.window).toBeNull();
  expect(timing.getState().workstation.research).toEqual(
    decision.getState().workstation.research,
  );
  timing.advance(60000);
  timing.dispatch({ type: 'start-thermal-window' });
  timing.advance(4000);
  timing.dispatch({ type: 'adjust-thermal-window' });
  const earned = timing.getState();
  timing.dispatch({ type: 'adjust-thermal-window' });
  expect(timing.getState().workstation.operations.window).toBeNull();
  expect(timing.getState().workstation.research).toEqual(
    earned.workstation.research,
  );
  expect(timing.getState().cash).toBe(earned.cash);
  timing.dispatch({ type: 'start-thermal-window' });
  expect(timing.getState().workstation.operations.window).toBeNull();
});

test('Research Notebook improves conversion without changing allocation and its paid tuning stays refundable', () => {
  const game = warmWorkstation();
  const baseline = createGame({ state: game.getState() });
  const before = game.getState().workstation.research;
  game.dispatch({ type: 'buy-research', id: 'research-notebook' });
  expect(game.getSnapshot().allocation).toEqual(
    baseline.getSnapshot().allocation,
  );
  game.advance(10000);
  baseline.advance(10000);
  const boosted = game.getState().workstation.research,
    normal = baseline.getState().workstation.research;
  const normalGain =
    normal.earned - before.earned + normal.progress - before.progress;
  const boostedGain =
    boosted.earned - before.earned + boosted.progress - before.progress;
  expect(boostedGain).toBeCloseTo(normalGain * 1.2, 8);
  game.dispatch({ type: 'recompile' });
  expect(game.getState().workstation.research.points).toBe(boosted.points + 50);
  expect(game.getState().workstation.research.discoveries).toContain(
    'thermal-model',
  );
  expect(decodeSave(encodeSave(game.getState())).ok).toBe(true);
});

test('schema7 migrates Research and saved profile intent without granting thermal mastery', () => {
  const game = warmWorkstation();
  game.dispatch({ type: 'save-profile', profile: 'research' });
  const state = game.getState(),
    envelope = JSON.parse(encodeSave(state));
  envelope.schemaVersion = 7;
  delete envelope.state.workstation.operations;
  delete envelope.state.workstation.research.savedProfiles.research.clock;
  const result = decodeSave(JSON.stringify(envelope));
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error);
  expect(result.state.home).toEqual(state.home);
  expect(result.state.job).toEqual(state.job);
  expect(result.state.journal).toEqual(state.journal);
  expect(result.state.workstation.research).toEqual(state.workstation.research);
  expect(result.state.workstation.operations).toMatchObject({
    power: 0,
    clock: 'standard',
    temperature: 30,
    fanCurve: false,
    heatObserved: false,
    window: null,
  });
  for (const change of [
    (s: typeof state) => {
      s.workstation.operations.temperature = 999;
    },
    (s: typeof state) => {
      s.workstation.operations.power = 3;
    },
    (s: typeof state) => {
      s.workstation.operations.cooldownMs = -100;
    },
    (s: typeof state) => {
      s.workstation.operations.fanCurve = true;
    },
  ]) {
    const invalid = structuredClone(state);
    change(invalid);
    expect(decodeSave(encodeSave(invalid)).ok).toBe(false);
  }
});

test('Eco Heat Soak remains a free safe solution after a hot, fully populated workstation', () => {
  const game = warmWorkstation();
  game.dispatch({ type: 'buy-research', id: 'branch-cache' });
  game.dispatch({ type: 'buy-research', id: 'wide-vectors' });
  expect(game.getState().workstation.research.enabled).toHaveLength(2);
  for (let i = 0; i < 4; i++)
    game.dispatch({ type: 'buy-hardware', part: 'cpu' });
  for (let i = 0; i < 2; i++)
    game.dispatch({ type: 'buy-home-part', part: 'gpu' });
  game.advance(60000);
  game.advance(60000);
  expect(game.getState().workstation.operations.temperature).toBeGreaterThan(
    75,
  );
  for (let i = 0; i < 4; i++)
    game.dispatch({ type: 'buy-hardware', part: 'ram' });
  for (let i = 0; i < 2; i++)
    game.dispatch({ type: 'buy-home-part', part: 'cooling' });
  game.dispatch({ type: 'buy-power' });
  game.dispatch({ type: 'start-heat-soak', strategy: 'eco' });
  for (let i = 0; i < 1800; i++) {
    const attempt = game.getState().benchmark;
    if (attempt?.id !== 'heat' || attempt.result !== 'running') break;
    game.advance(100);
  }
  expect(game.getState().benchmark).toMatchObject({
    id: 'heat',
    result: 'cooling',
  });
  const loaded = decodeSave(encodeSave(game.getState()));
  expect(loaded.ok).toBe(true);
  if (!loaded.ok) throw new Error(loaded.error);
  const resumed = createGame({ state: loaded.state });
  for (let i = 0; i < 1800 && game.getState().benchmark; i++) {
    game.advance(100);
    resumed.advance(100);
  }
  expect(resumed.getState()).toEqual(game.getState());
  expect(game.getState().workstation.operations.fanCurve).toBe(true);
});
