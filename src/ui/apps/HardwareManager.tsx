import { Operations } from './Operations';
import { useState } from 'react';
import { Chassis } from './Chassis';
import { Graphics } from './Graphics';
import { money } from '../../app/game-content';
import type { GameCommand, GameSnapshot } from '../../game/engine/game';
import { MachineVisual, type InspectedPart } from '../components/MachineVisual';

type Props = {
  selectedPart: InspectedPart;
  onInspect: (part: InspectedPart) => void;
  snapshot: GameSnapshot;
  send: (command: GameCommand) => void;
  canPlay: boolean;
};
export function HardwareManager({
  selectedPart,
  onInspect,
  snapshot,
  send,
  canPlay,
}: Props) {
  const [page, setPage] = useState<'parts' | 'chassis' | 'graphics' | 'power'>(
    'parts',
  );
  const { state, compute } = snapshot;
  const selected =
    snapshot.hardware.find((part) => part.id === selectedPart) ??
    snapshot.hardware[0]!;
  return (
    <>
      {state.automation.unlocked && (
        <nav className="hardware-pages" aria-label="Hardware pages">
          <button
            className="game-button"
            aria-pressed={page === 'parts'}
            onClick={() => {
              setPage('parts');
              onInspect('cpu');
            }}
          >
            CPU & RAM
          </button>
          <button
            className="game-button"
            aria-pressed={page === 'chassis'}
            onClick={() => setPage('chassis')}
          >
            Storage & chassis
          </button>
          {state.home.reached && (
            <button
              className="game-button"
              aria-pressed={page === 'graphics'}
              onClick={() => {
                setPage('graphics');
                onInspect('gpu');
              }}
            >
              Graphics & cooling
            </button>
          )}
          {state.workstation.reached && (
            <button
              className="game-button"
              aria-pressed={page === 'power'}
              onClick={() => setPage('power')}
            >
              Power supply
            </button>
          )}
        </nav>
      )}
      {page === 'power' && state.workstation.reached ? (
        <Operations snapshot={snapshot} send={send} canPlay={canPlay} />
      ) : page === 'chassis' && state.automation.unlocked ? (
        <Chassis snapshot={snapshot} send={send} canPlay={canPlay} />
      ) : page === 'graphics' && state.home.reached ? (
        <Graphics
          snapshot={snapshot}
          send={send}
          canPlay={canPlay}
          selected={selectedPart === 'cooling' ? 'cooling' : 'gpu'}
          onInspect={onInspect}
        />
      ) : (
        <div className="hardware-app">
          <p className="app-subtitle">HARDWARE INSPECTOR</p>
          <div className="hardware-summary">
            <div>
              <h3>
                {state.workstation.reached
                  ? 'Your Workstation'
                  : state.home.reached
                    ? 'Your Home PC'
                    : 'Your first machine'}
              </h3>
              <p className="muted">
                Select a component. Its next upgrade is shown below.
              </p>
            </div>
          </div>
          <div className="machine-inspector">
            <MachineVisual
              view={selectedPart}
              detail
              hardware={state.hardware}
              homeParts={state.home}
              temperature={snapshot.thermal.temperature}
              fanCurve={state.workstation.operations.fanCurve}
              era={
                state.workstation.reached
                  ? 'workstation'
                  : state.home.reached
                    ? 'home'
                    : 'beige'
              }
              activity={
                state.benchmark ? 'benchmark' : state.job ? 'working' : 'idle'
              }
            />
            <span className="inspection-caption">
              {selected.name} · level {selected.level}
            </span>
          </div>
          <dl className="hardware-list">
            {snapshot.hardware.map((part) => (
              <div key={part.id}>
                <dt>
                  <button
                    aria-label={`Inspect ${part.name}`}
                    aria-pressed={selectedPart === part.id}
                    onClick={() => onInspect(part.id)}
                  >
                    {part.name}
                  </button>
                </dt>
                <dd>
                  Level {part.level} ·{' '}
                  {part.id === 'cpu'
                    ? `${compute.cpu.toFixed(1)} delivered/s`
                    : `${compute.memory} MB`}
                </dd>
              </div>
            ))}
          </dl>
          <div className="hardware-purchase">
            <p>
              {selected.id === 'cpu' && state.home.reached
                ? state.workstation.reached
                  ? '+500 base CPU/s before bus, tuning and memory'
                  : '+50 base Compute/s before bus and memory'
                : selected.effect}
            </p>
            <button
              className="game-button primary-action"
              disabled={
                !canPlay ||
                !!state.benchmark ||
                state.cash < selected.cost ||
                selected.level >= selected.cap
              }
              onClick={() => send({ type: 'buy-hardware', part: selected.id })}
            >
              {selected.level >= selected.cap
                ? `${selected.name} at chassis limit`
                : `Buy ${selected.name} · ${money(selected.cost)}`}
            </button>
            <p className="small-note">
              {state.workstation.reached
                ? `Workstation slots: ${selected.level} / ${selected.cap}.`
                : selected.level >= selected.breakpoint
                  ? `${selected.name} ${selected.breakpoint} breakpoint reached. Next chassis preparation: ${selected.nextChassis}.`
                  : `${selected.next} · ${selected.breakpoint - selected.level} more purchases`}
            </p>
            {state.cash < selected.cost && (
              <p className="small-note">
                Need {money(selected.cost - state.cash)} more. Jobs keep paying.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
