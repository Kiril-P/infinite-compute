import { expect, test } from 'vitest';
import { createGame } from './game';
import { decodeSave, encodeSave } from '../persistence/save';

function prepared() {
  const state = createGame().getState();
  state.hardware = { cpu: 8, ram: 5 };
  state.cash = 13000;
  state.milestones.firstPurchaseMs = 0;
  state.milestones.automationMs = 0;
  state.automation = { unlocked: true, enabled: false };
  state.home = {
    ...state.home,
    reached: true,
    wideBus: true,
    storage: 2,
    gpu: 1,
    transitionMs: 0,
  };
  return state;
}

test('lease has the advertised payout, preserves its renewal clock on reload, and cancellation has no debt', () => {
  const game = createGame({ state: prepared() });
  game.dispatch({ type: 'set-software', plan: 'lease' });
  expect(game.getState().cash).toBe(12000);
  game.dispatch({ type: 'select-job', id: 'logo' });
  game.dispatch({ type: 'start-job' });
  game.advance(6000);
  expect(game.getState().cash).toBe(13840);
  const save = decodeSave(encodeSave(game.getState()));
  expect(save.ok).toBe(true);
  if (!save.ok) throw new Error(save.error);
  const resumed = createGame({ state: save.state });
  resumed.advance(54000);
  expect(resumed.getState().cash).toBe(13240);
  resumed.dispatch({ type: 'set-software', plan: 'free' });
  resumed.advance(60000);
  expect(resumed.getState().cash).toBe(13240);
  expect(resumed.getState().home.software.plan).toBe('free');
  expect(resumed.getState().automation.unlocked).toBe(true);
});

test('unaffordable renewal suspends only the benefit and permanent ownership can be reactivated for free', () => {
  const game = createGame({ state: { ...prepared(), cash: 1000 } });
  game.dispatch({ type: 'set-software', plan: 'lease' });
  game.advance(60000);
  expect(game.getState().cash).toBe(0);
  expect(game.getState().home.software.active).toBe(false);
  game.dispatch({ type: 'select-job', id: 'logo' });
  game.dispatch({ type: 'start-job' });
  game.advance(6000);
  expect(game.getState().cash).toBe(1600);
  game.dispatch({ type: 'retry-software' });
  game.dispatch({ type: 'retry-software' });
  expect(game.getState().cash).toBe(1000);
  expect(game.getState().home.software.active).toBe(true);
  const owned = createGame({ state: prepared() });
  owned.dispatch({ type: 'set-software', plan: 'owned' });
  expect(owned.getState().cash).toBe(1000);
  owned.dispatch({ type: 'set-software', plan: 'free' });
  owned.dispatch({ type: 'set-software', plan: 'owned' });
  owned.advance(60000);
  expect(owned.getState().cash).toBe(1000);
  expect(owned.getState().home.software.ownsPermanent).toBe(true);
});

test('Benchmarks freeze renewal charges and promotional scoring never changes useful output', () => {
  const game = createGame({ state: prepared() });
  game.dispatch({ type: 'set-software', plan: 'lease' });
  game.advance(20000);
  const lease = game.getState().home.software;
  game.dispatch({ type: 'start-memory-test', strategy: 'pages' });
  game.advance(60000);
  expect(game.getState().home.software).toEqual(lease);
  expect(game.getState().cash).toBe(12000);
  game.dispatch({ type: 'exit-benchmark' });
  game.advance(40000);
  expect(game.getState().cash).toBe(11400);
  const actual = game.getSnapshot().compute,
    jobs = game.getSnapshot().jobs;
  game.dispatch({ type: 'set-promotional-score', enabled: true });
  expect(game.getSnapshot().compute).toEqual(actual);
  expect(game.getSnapshot().jobs).toEqual(jobs);
  game.dispatch({ type: 'set-promotional-score', enabled: false });
  expect(game.getState().home.software.promotionalScore).toBe(false);
});
