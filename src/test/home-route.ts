import {
  createGame,
  type GameCommand,
  type GameState,
} from '../game/engine/game';

// A readable configuration-only route after Payroll; no save edits or developer clock.
export function runHomeRoute(
  order: 'graphics-first' | 'cpu-first' = 'graphics-first',
) {
  const game = createGame({ seed: 20 }),
    trace: { action: string; at: number; wait: number; cash: number }[] = [];
  game.dispatch({ type: 'set-input-mode', mode: 'decision' });
  function waitFor(
    action: string,
    command: GameCommand,
    done: (state: GameState) => boolean,
  ) {
    const start = game.getState().elapsedMs;
    while (!done(game.getState())) {
      game.dispatch(command);
      if (done(game.getState())) break;
      if (!game.getState().automation.unlocked && !game.getState().benchmark) {
        game.dispatch({ type: 'start-job' });
        const job = game.getState().job;
        if (job && !job.attempted)
          game.dispatch({ type: 'choose-strategy', strategy: job.workload });
      }
      game.advance(100);
      if (game.getState().elapsedMs > 2400000)
        throw new Error(`Home route stalled at ${action}`);
    }
    const state = game.getState();
    trace.push({
      action,
      at: state.elapsedMs,
      wait: state.elapsedMs - start,
      cash: state.cash,
    });
  }
  function parts(part: 'cpu' | 'ram', target: number) {
    while (game.getState().hardware[part] < target) {
      const next = game.getState().hardware[part] + 1;
      waitFor(
        `${part} ${next}`,
        { type: 'buy-hardware', part },
        (state) => state.hardware[part] >= next,
      );
    }
  }
  function homeParts(part: 'gpu' | 'cooling', target: number) {
    while (game.getState().home[part] < target) {
      const next = game.getState().home[part] + 1;
      waitFor(
        `${part} ${next}`,
        { type: 'buy-home-part', part },
        (state) => state.home[part] >= next,
      );
    }
  }
  function storage(target: number) {
    while (game.getState().home.storage < target) {
      const next = game.getState().home.storage + 1;
      waitFor(
        `Storage ${next}`,
        { type: 'buy-storage' },
        (state) => state.home.storage >= next,
      );
    }
  }
  parts('cpu', 2);
  parts('ram', 1);
  parts('cpu', 3);
  parts('ram', 2);
  game.dispatch({ type: 'start-benchmark', strategy: 'pages' });
  waitFor(
    'Payroll',
    { type: 'start-benchmark', strategy: 'pages' },
    (state) => state.automation.unlocked,
  );
  storage(1);
  game.dispatch({ type: 'select-job', id: 'photo' });
  parts('cpu', 6);
  parts('ram', 4);
  waitFor('Wide bus', { type: 'buy-wide-bus' }, (state) => state.home.wideBus);
  waitFor(
    'Home PC',
    { type: 'transition-home' },
    (state) => state.home.reached,
  );
  parts('cpu', 8);
  parts('ram', 5);
  storage(2);
  game.dispatch({ type: 'start-memory-test', strategy: 'pages' });
  waitFor(
    'Memory Pressure',
    { type: 'start-memory-test', strategy: 'pages' },
    (state) => state.home.queue.unlocked,
  );
  game.dispatch({ type: 'set-queue-policy', policy: 'cash' });
  if (order === 'cpu-first') {
    parts('cpu', 12);
    parts('ram', 8);
  }
  homeParts('gpu', 1);
  for (let level = 2; level <= 4; level++) {
    homeParts('gpu', level);
    homeParts('cooling', level - 1);
  }
  parts('cpu', 12);
  parts('ram', 8);
  storage(4);
  return { game, trace };
}
