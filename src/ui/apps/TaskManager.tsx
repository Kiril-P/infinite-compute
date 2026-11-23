import { WorkstationTasks } from './WorkstationTasks';
import { HomeTasks } from './HomeTasks';
import { jobs } from '../../game/content/home';
import { jobBlocker } from '../../game/engine/game';
import { useState } from 'react';
import { seconds } from '../../app/game-content';
import { opening } from '../../game/content/opening';
import {
  payrollBlocker,
  type GameCommand,
  type GameSnapshot,
  type PayrollStrategy,
} from '../../game/engine/game';

type Props = {
  snapshot: GameSnapshot;
  send: (command: GameCommand) => void;
  canPlay: boolean;
};
export function TaskManager({ snapshot, send, canPlay }: Props) {
  const { state, compute } = snapshot;
  const [strategy, setStrategy] = useState<PayrollStrategy>('pages');
  const blocker = payrollBlocker(state, strategy);
  if (state.workstation.reached)
    return (
      <WorkstationTasks snapshot={snapshot} send={send} canPlay={canPlay} />
    );
  if (state.home.reached)
    return <HomeTasks snapshot={snapshot} send={send} canPlay={canPlay} />;
  return (
    <div className="task-manager-content">
      <section className="task-section">
        <h3>{opening.payroll.name}</h3>
        <p>{opening.payroll.description}</p>
        {state.automation.unlocked ? (
          <p className="success-message">
            Passed · basic auto-run is permanently unlocked.
          </p>
        ) : state.benchmark?.id === 'payroll' ? (
          <>
            <progress
              aria-label="Payroll progress"
              value={state.benchmark.work}
              max={opening.payroll.strategies[state.benchmark.strategy].work}
            />
            <p>
              {Math.floor(state.benchmark.work)} /{' '}
              {opening.payroll.strategies[state.benchmark.strategy].work} work ·{' '}
              {seconds(
                (opening.payroll.strategies[state.benchmark.strategy].work -
                  state.benchmark.work) /
                  compute.effective,
              )}
            </p>
            <p className="small-note">
              Ordinary Job preserved. Bonuses and purchases paused.
            </p>
            <button
              className="game-button"
              disabled={!canPlay}
              onClick={() => send({ type: 'exit-benchmark' })}
            >
              Exit Payroll · restore ordinary work
            </button>
          </>
        ) : (
          <>
            <label>
              Processing strategy{' '}
              <select
                aria-label="Payroll strategy"
                value={strategy}
                onChange={(event) =>
                  setStrategy(
                    event.target.value === 'whole' ? 'whole' : 'pages',
                  )
                }
              >
                <option value="pages">Small pages</option>
                <option value="whole">Whole file</option>
              </select>
            </label>
            <p>{opening.payroll.strategies[strategy].description}</p>
            <p className="small-note">
              {blocker ??
                `${seconds(opening.payroll.strategies[strategy].work / compute.effective)} at your current Compute. Reward: auto-run.`}
            </p>
            <button
              className="game-button primary-action"
              disabled={!canPlay || !!blocker}
              onClick={() => send({ type: 'start-benchmark', strategy })}
            >
              Start Safe Mode Payroll
            </button>
          </>
        )}
      </section>
      <section className="task-section">
        <h3>Auto-run</h3>
        <p>
          {state.benchmark
            ? 'Waiting: Safe Mode Payroll owns Compute.'
            : state.automation.enabled
              ? `Next action: ${jobBlocker(state, state.home.selectedJob) ? 'household spreadsheet while waiting: ' + jobBlocker(state, state.home.selectedJob) : jobs[state.home.selectedJob].shortName}. Starts after this Job finishes.`
              : state.automation.unlocked
                ? 'Paused by you. Enable auto-run to repeat household Jobs.'
                : 'Unlock by completing Safe Mode Payroll. It never requires a timing bonus.'}
        </p>
        <button
          className="game-button"
          disabled={!canPlay || !state.automation.unlocked}
          aria-pressed={state.automation.enabled}
          onClick={() =>
            send({ type: 'set-auto-run', enabled: !state.automation.enabled })
          }
        >
          {state.automation.enabled ? 'Pause auto-run' : 'Enable auto-run'}
        </button>
        <p className="small-note">
          {compute.raw.toFixed(2)} raw ×{' '}
          {Math.round(compute.memoryFactor * 100)}% memory efficiency ={' '}
          {compute.effective.toFixed(2)} Compute/s.{' '}
          {state.benchmark
            ? 'All Compute assigned to Payroll.'
            : 'All Compute assigned to the foreground Job; no Research allocation yet.'}
        </p>
      </section>
    </div>
  );
}
