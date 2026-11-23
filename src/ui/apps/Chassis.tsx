import { workstation } from '../../game/content/workstation';
import { workstationBlocker } from '../../game/engine/research';
import {
  storageCap,
  storageCost as getStorageCost,
} from '../../game/engine/game';
import { home } from '../../game/content/home';
import {
  homeBlocker,
  type GameCommand,
  type GameSnapshot,
} from '../../game/engine/game';
import { money } from '../../app/game-content';

type Props = {
  snapshot: GameSnapshot;
  send: (command: GameCommand) => void;
  canPlay: boolean;
};
export function Chassis({ snapshot, send, canPlay }: Props) {
  const { state } = snapshot;
  const parts = state.home;
  const cap = storageCap(state);
  const storageCost = getStorageCost(state);
  const blocker = homeBlocker(state);
  const locked = !canPlay || !!state.benchmark;
  return (
    <div className="chassis-grid">
      <section className="task-section">
        <h3>
          Storage · {parts.storage}/{cap}
        </h3>
        <p>
          Feeds the Job queue. Setup time ÷{1 + parts.storage}; the first drive
          unlocks the family photograph.
        </p>
        <button
          className="game-button"
          disabled={locked || parts.storage >= cap || state.cash < storageCost}
          onClick={() => send({ type: 'buy-storage' })}
        >
          {parts.storage >= cap
            ? 'Storage at chassis limit'
            : `Buy Storage · ${money(storageCost)}`}
        </button>
        <p className="small-note">
          {state.workstation.reached
            ? 'Storage 6 fills the workstation drive bays.'
            : parts.reached
              ? 'Storage 2 prepares graphics; Storage 4 is the next chassis breakpoint.'
              : 'The Home-PC chassis opens the next drive slots.'}
        </p>
      </section>
      <section className="task-section">
        {parts.reached ? (
          <>
            <h3>
              {state.workstation.reached
                ? 'Workstation online'
                : 'Workstation chassis'}
            </h3>
            <p>
              {state.workstation.reached
                ? 'Research shares delivered capacity with Jobs. Previous work and automation stay intact.'
                : '×10 CPU and GPU scale. Opens Research and larger component slots.'}
            </p>
            {!state.workstation.reached && (
              <>
                <p className="small-note">
                  {workstationBlocker(state) ?? 'All parts ready.'}
                </p>
                <button
                  className="game-button primary-action"
                  disabled={
                    locked ||
                    !!workstationBlocker(state) ||
                    state.cash < workstation.transitionCost
                  }
                  onClick={() => send({ type: 'transition-workstation' })}
                >
                  Move into Workstation · {money(workstation.transitionCost)}
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <h3>
              {parts.reached
                ? 'Home PC online'
                : parts.wideBus
                  ? 'Home-PC chassis'
                  : 'Wide bus'}
            </h3>
            <p>
              {parts.reached
                ? 'All previous work survived the move. The household spreadsheet now fits into a fraction of a second.'
                : parts.wideBus
                  ? 'A larger desk, display and chassis. ×100 base CPU scale; CPU/RAM caps 12/8. Keeps Jobs and auto-run.'
                  : '×1.5 raw Compute. CPU 6, RAM 4 and Storage 1 prepare the bus and Home-PC chassis.'}
            </p>
            {!parts.reached && (
              <>
                <p className="small-note">
                  {blocker ?? 'Parts ready.'} {money(state.cash)} /{' '}
                  {money(parts.wideBus ? home.transitionCost : home.busCost)}
                </p>
                <button
                  className="game-button primary-action"
                  disabled={
                    locked ||
                    !!blocker ||
                    state.cash <
                      (parts.wideBus ? home.transitionCost : home.busCost)
                  }
                  onClick={() =>
                    send({
                      type: parts.wideBus ? 'transition-home' : 'buy-wide-bus',
                    })
                  }
                >
                  {parts.wideBus ? 'Move into Home PC' : 'Install Wide bus'}
                </button>
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}
