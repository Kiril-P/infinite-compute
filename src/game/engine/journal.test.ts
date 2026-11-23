import { expect, test } from 'vitest';
import { createGame } from './game';
import { decodeSave, encodeSave } from '../persistence/save';

test('critical story enters saved history before display, survives reload and cannot be replaced by repeated Jobs', () => {
  const state = createGame().getState();
  state.cash = 100000;
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
  game.dispatch({ type: 'buy-home-part', part: 'gpu' });
  expect(
    game
      .getState()
      .journal.entries.some((entry) => entry.id === 'softwareOffer'),
  ).toBe(true);
  expect(game.getState().message).toBe('opening');
  const saved = decodeSave(encodeSave(game.getState()));
  expect(saved.ok).toBe(true);
  if (!saved.ok) throw new Error(saved.error);
  const resumed = createGame({ state: saved.state });
  resumed.advance(10000);
  expect(resumed.getState().message).toBe('softwareOffer');
  resumed.advance(5000);
  expect(resumed.getState().message).toBe('softwareOffer');
  expect(
    resumed.getState().journal.entries.filter((entry) => entry.id === 'wonder'),
  ).toHaveLength(1);
});

test('secret case inspection is saved once and changes no economy or progression', () => {
  const game = createGame(),
    before = game.getSnapshot();
  game.dispatch({ type: 'inspect-case' });
  game.dispatch({ type: 'inspect-case' });
  expect(
    game
      .getState()
      .journal.entries.filter((entry) => entry.id === 'case-curious'),
  ).toHaveLength(1);
  expect(game.getSnapshot().compute).toEqual(before.compute);
  expect(game.getSnapshot().jobs).toEqual(before.jobs);
  expect(game.getState().cash).toBe(before.state.cash);
  expect(game.getState().automation).toEqual(before.state.automation);
});
