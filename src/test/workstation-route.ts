import { runHomeRoute } from './home-route';
import type { GameCommand, GameState } from '../game/engine/game';
import type { ResearchId } from '../game/content/workstation';

export function runWorkstationRoute(
  route: 'baseline' | 'inefficient' = 'baseline',
) {
  const { game } = runHomeRoute(
    route === 'baseline' ? 'graphics-first' : 'cpu-first',
  );
  const trace: {
    action: string;
    at: number;
    wait: number;
    cash: number;
    research: number;
  }[] = [];
  function waitFor(
    action: string,
    command: GameCommand,
    done: (state: GameState) => boolean,
  ) {
    const start = game.getState().elapsedMs;
    while (!done(game.getState())) {
      game.dispatch(command);
      if (done(game.getState())) break;
      game.advance(100);
      if (game.getState().elapsedMs - start > 600000)
        throw new Error(`Workstation stalled: ${action}`);
    }
    const state = game.getState();
    trace.push({
      action,
      at: state.elapsedMs,
      wait: state.elapsedMs - start,
      cash: state.cash,
      research: state.workstation.research.points,
    });
  }
  const research = (id: ResearchId) =>
    waitFor(
      id,
      { type: 'buy-research', id },
      () =>
        game.getSnapshot().research.nodes.find((node) => node.id === id)!.owned,
    );
  function part(id: 'cpu' | 'ram', target: number) {
    while (game.getState().hardware[id] < target) {
      const next = game.getState().hardware[id] + 1;
      waitFor(
        `${id} ${next}`,
        { type: 'buy-hardware', part: id },
        (s) => s.hardware[id] >= next,
      );
    }
  }
  function homePart(id: 'gpu' | 'cooling', target: number) {
    while (game.getState().home[id] < target) {
      const next = game.getState().home[id] + 1;
      waitFor(
        `${id} ${next}`,
        { type: 'buy-home-part', part: id },
        (s) => s.home[id] >= next,
      );
    }
  }
  waitFor(
    'Workstation',
    { type: 'transition-workstation' },
    (s) => s.workstation.reached,
  );
  if (route === 'inefficient')
    game.dispatch({ type: 'apply-profile', profile: 'throughput' });
  research('parallel-library');
  research('wide-vectors');
  research('branch-cache');
  waitFor(
    'Power 1',
    { type: 'buy-power' },
    (s) => s.workstation.operations.power >= 1,
  );
  if (route === 'inefficient') {
    part('cpu', 16);
    homePart('gpu', 6);
  }
  part('cpu', 13);
  part('ram', 9);
  part('cpu', 14);
  part('ram', 10);
  homePart('cooling', 4);
  research('thermal-model');
  waitFor(
    'Heat Soak',
    { type: 'start-heat-soak', strategy: 'eco' },
    (s) => s.workstation.operations.fanCurve,
  );
  game.dispatch({ type: 'apply-profile', profile: 'research' });
  research('queue-compiler');
  research('efficient-pages');
  research('research-notebook');
  research('open-interconnect');
  return { game, trace };
}
