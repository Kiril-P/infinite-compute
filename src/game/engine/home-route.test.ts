import { expect, test } from 'vitest';
import { runHomeRoute } from '../../test/home-route';
import { decodeSave, encodeSave } from '../persistence/save';

test.each(['graphics-first', 'cpu-first'] as const)(
  'Home PC is recoverable through the free edition with %s purchases',
  (order) => {
    const { game, trace } = runHomeRoute(order),
      state = game.getState();
    const find = (action: string) =>
      trace.find((point) => point.action === action)!.at;
    expect(find('Payroll')).toBeGreaterThanOrEqual(180000);
    expect(find('Payroll')).toBeLessThanOrEqual(300000);
    expect(find('Home PC')).toBeGreaterThanOrEqual(480000);
    expect(find('Home PC')).toBeLessThanOrEqual(600000);
    expect(state.home).toMatchObject({
      reached: true,
      gpu: 4,
      cooling: 3,
      storage: 4,
      queue: { unlocked: true },
      software: { plan: 'free' },
    });
    expect(state.hardware).toEqual({ cpu: 12, ram: 8 });
    expect(state.automation).toEqual({ unlocked: true, enabled: true });
    expect(state.cash).toBeGreaterThanOrEqual(0);
    expect(state.elapsedMs).toBeLessThan(2400000);
    expect(decodeSave(encodeSave(state))).toEqual({ ok: true, state });
    console.info(
      JSON.stringify({
        order,
        payrollMs: find('Payroll'),
        homeMs: find('Home PC'),
        memoryMs: find('Memory Pressure'),
        readyMs: state.elapsedMs,
        longestWaitMs: Math.max(...trace.map((p) => p.wait)),
        trace,
      }),
    );
  },
);
