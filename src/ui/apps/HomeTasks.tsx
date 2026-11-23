import { Capacity } from './Capacity';
import { useState } from 'react';
import { home, jobs, type QueuePolicy } from '../../game/content/home';
import {
  memoryBlocker,
  type GameCommand,
  type GameSnapshot,
  type PayrollStrategy,
} from '../../game/engine/game';
import { seconds } from '../../app/game-content';

type Props = {
  snapshot: GameSnapshot;
  send: (command: GameCommand) => void;
  canPlay: boolean;
};
export function HomeTasks({ snapshot, send, canPlay }: Props) {
  const [strategy, setStrategy] = useState<PayrollStrategy>('pages');
  const { state, compute } = snapshot;
  const attempt = state.benchmark?.id === 'memory' ? state.benchmark : null;
  const target = home.memory.strategies[attempt?.strategy ?? strategy];
  const blocker = memoryBlocker(state);
  const stalled = compute.memory < target.memory;
  if (state.home.queue.unlocked)
    return (
      <div className="home-task-grid">
        <section className="task-section">
          <h3>Batch Queue policy</h3>
          <label>
            Priority{' '}
            <select
              aria-label="Queue policy"
              value={state.home.queue.policy}
              disabled={!canPlay}
              onChange={(event) =>
                send({
                  type: 'set-queue-policy',
                  policy: event.target.value as QueuePolicy,
                })
              }
            >
              <option value="selected">Selected Job</option>
              <option value="cash">Fastest Cash</option>
              <option value="value">Largest payout</option>
              <option value="milestone">Unfinished Job first</option>
            </select>
          </label>
          <p>
            {state.automation.enabled
              ? `Next action: ${jobs[snapshot.queueChoice].shortName}.`
              : 'Auto-run paused by you. Policy is remembered.'}
          </p>
          <button
            className="game-button"
            disabled={!canPlay}
            onClick={() =>
              send({ type: 'set-auto-run', enabled: !state.automation.enabled })
            }
          >
            {state.automation.enabled ? 'Pause auto-run' : 'Enable auto-run'}
          </button>
          <p className="small-note">
            {state.workstation.reached
              ? 'Thermal Window replaces manual batch choices. Policy keeps the queue moving.'
              : 'Job Runner offers one optional batch choice per cycle. Its Cash/s includes setup and processing time.'}
          </p>
        </section>
        {state.workstation.reached ? (
          <Capacity snapshot={snapshot} />
        ) : (
          <section className="task-section">
            <h3>Memory Pressure · passed</h3>
            <p>{home.messages.memory}</p>
            <p className="small-note">
              {compute.effective.toFixed(1)} Compute/s · {compute.memory} MB ·{' '}
              setup ÷{state.home.storage + 1}. Oversized selections fall back to
              the household file; no work is lost.
            </p>
          </section>
        )}
      </div>
    );
  return (
    <div className="home-task-grid">
      <section className="task-section">
        <h3>{home.memory.name}</h3>
        <p>
          Changed rule: oversized working sets stall completely. Keep the pages
          within RAM to feed the CPU.
        </p>
        <p className="small-note">
          CPU {state.hardware.cpu}/8 · RAM {state.hardware.ram}/5 · Storage{' '}
          {state.home.storage}/2. Reward: permanent Batch Queue policy.
        </p>
        <button
          className="game-button"
          disabled={!canPlay}
          onClick={() =>
            send({ type: 'set-auto-run', enabled: !state.automation.enabled })
          }
        >
          {state.automation.enabled ? 'Pause auto-run' : 'Enable auto-run'}
        </button>
        <div
          className="memory-path"
          aria-label={`CPU connected to ${compute.memory} MB RAM`}
        >
          <span>CPU</span>
          <b>→</b>
          <span>{compute.memory} MB</span>
          <b>→</b>
          <span>{stalled ? 'WAIT' : 'QUEUE'}</span>
        </div>
      </section>
      <section className="task-section">
        {attempt ? (
          <>
            <h3>{stalled ? 'Waiting for memory' : 'Processing pages'}</h3>
            <progress
              aria-label="Memory Pressure progress"
              value={attempt.work}
              max={target.work}
            />
            <p>
              {stalled
                ? `Needs ${target.memory} MB; only ${compute.memory} MB installed. Exit and choose Small pages or buy RAM 8.`
                : `${Math.floor(attempt.work).toLocaleString('en-US')} / ${target.work.toLocaleString('en-US')} work · ${seconds((target.work - attempt.work) / compute.effective)}`}
            </p>
            <button
              className="game-button"
              disabled={!canPlay}
              onClick={() => send({ type: 'exit-benchmark' })}
            >
              Exit Memory Pressure · restore Job
            </button>
          </>
        ) : (
          <>
            <label>
              Working set{' '}
              <select
                aria-label="Memory strategy"
                value={strategy}
                onChange={(event) =>
                  setStrategy(event.target.value as PayrollStrategy)
                }
              >
                <option value="pages">Small pages</option>
                <option value="whole">Whole file</option>
              </select>
            </label>
            <p>
              {target.memory} MB · {target.work.toLocaleString('en-US')} work.{' '}
              {stalled
                ? 'This configuration will stall. Small pages fits RAM 5.'
                : `${seconds(target.work / compute.effective)} at current Compute.`}
            </p>
            {blocker && <p className="small-note">{blocker}</p>}
            <button
              className="game-button primary-action"
              disabled={!canPlay || !!blocker}
              onClick={() => send({ type: 'start-memory-test', strategy })}
            >
              Start Memory Pressure Test
            </button>
          </>
        )}
        <p className="small-note">
          No fee. Ordinary Job preserved; purchases and bonuses pause. Exit,
          adjust, retry.
        </p>
      </section>
    </div>
  );
}
