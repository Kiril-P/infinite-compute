import { expect, test } from 'vitest';
import { runWorkstationRoute } from '../../test/workstation-route';
import { decodeSave, encodeSave } from '../persistence/save';

test.each(['baseline', 'inefficient'] as const)(
  '%s Workstation route reaches thermal mastery and all eight choices without active boosts or paid software',
  (route) => {
    const { game, trace } = runWorkstationRoute(route),
      state = game.getState();
    console.info(JSON.stringify({ route, trace }));
    expect(state.workstation.operations.fanCurve).toBe(true);
    expect(game.getSnapshot().research.nodes).toHaveLength(8);
    expect(game.getSnapshot().research.nodes.every((node) => node.owned)).toBe(
      true,
    );
    expect(state.cash).toBeGreaterThanOrEqual(0);
    expect(state.home.software.plan).toBe('free');
    expect(decodeSave(encodeSave(state)).ok).toBe(true);
    if (route === 'baseline') {
      expect(state.workstation.transitionMs).toBeLessThanOrEqual(1320000);
      expect(trace[1]!.at - trace[0]!.at).toBeLessThanOrEqual(120000);
      expect(Math.max(...trace.map((step) => step.wait))).toBeLessThanOrEqual(
        180000,
      );
    }
  },
);
