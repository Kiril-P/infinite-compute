import { home } from '../../game/content/home';
import {
  homePartBlocker,
  homePartCap,
  homePartCost,
  type GameCommand,
  type GameSnapshot,
} from '../../game/engine/game';
import { money } from '../../app/game-content';
import { MachineVisual } from '../components/MachineVisual';

export function Graphics({
  snapshot,
  send,
  canPlay,
  selected,
  onInspect,
}: {
  snapshot: GameSnapshot;
  send: (command: GameCommand) => void;
  canPlay: boolean;
  selected: 'gpu' | 'cooling';
  onInspect: (part: 'gpu' | 'cooling') => void;
}) {
  const { state, compute } = snapshot;
  const part = home.parts[selected],
    level = state.home[selected];
  const cap = homePartCap(state, selected),
    cost = homePartCost(state, selected);
  const blocker = homePartBlocker(state, selected);
  return (
    <div className="graphics-app">
      <div className="machine-inspector">
        <MachineVisual
          view={selected}
          detail
          era={state.workstation.reached ? 'workstation' : 'home'}
          hardware={state.hardware}
          homeParts={state.home}
          temperature={snapshot.thermal.temperature}
          fanCurve={state.workstation.operations.fanCurve}
          activity={
            state.benchmark ? 'benchmark' : state.job ? 'working' : 'idle'
          }
        />
        <span className="inspection-caption">
          {part.name} · {level}/{cap}
        </span>
      </div>
      <section className="task-section graphics-controls">
        <div className="button-row">
          <button
            className="game-button"
            aria-pressed={selected === 'gpu'}
            onClick={() => onInspect('gpu')}
          >
            Inspect GPU
          </button>
          {state.home.gpu > 0 && (
            <button
              className="game-button"
              aria-pressed={selected === 'cooling'}
              onClick={() => onInspect('cooling')}
            >
              Inspect Cooling
            </button>
          )}
        </div>
        <h3>
          {part.name} · {level}/{cap}
        </h3>
        <p>
          {selected === 'gpu' && state.workstation.reached
            ? '+1,500 base GPU/s before bus, tuning and bottlenecks. Logos and protein use all graphics capacity.'
            : part.effect}
        </p>
        <p className="graphics-readout">
          Graphics {compute.graphics.toFixed(1)}/s · airflow{' '}
          {Math.round(compute.airflowFactor * 100)}%
        </p>
        <p className="small-note">
          {blocker ??
            (state.workstation.reached
              ? `Workstation slots: ${level} / ${cap}.`
              : part.breakpoint)}
        </p>
        <button
          className="game-button primary-action"
          disabled={
            !canPlay ||
            !!state.benchmark ||
            !!blocker ||
            level >= cap ||
            state.cash < cost
          }
          onClick={() => send({ type: 'buy-home-part', part: selected })}
        >
          {level >= cap
            ? `${part.name} at chassis limit`
            : `Buy ${part.name} · ${money(cost)}`}
        </button>
        {compute.airflowFactor < 1 && (
          <p className="small-note">
            GPU {state.home.gpu} exceeds supported airflow. Cooling{' '}
            {state.home.gpu - 1} restores 100%; CPU output is unaffected.
          </p>
        )}
      </section>
    </div>
  );
}
