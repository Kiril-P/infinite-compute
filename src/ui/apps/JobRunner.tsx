import { ThermalWindow } from './ThermalWindow';
import { jobs, type JobId } from '../../game/content/home';
import {
  jobBlocker,
  benchmarkRules,
  jobCompute,
  jobPayout,
} from '../../game/engine/game';
import { money, seconds } from '../../app/game-content';
import { opening } from '../../game/content/opening';
import type { GameCommand, GameSnapshot } from '../../game/engine/game';
import { MachineVisual, type MachineView } from '../components/MachineVisual';

type Props = {
  view: MachineView;
  snapshot: GameSnapshot;
  send: (command: GameCommand) => void;
  canPlay: boolean;
};
export function JobRunner({ view, snapshot, send, canPlay }: Props) {
  const { state, cursor } = snapshot;
  const job = state.job;
  const waiting = jobBlocker(state, snapshot.queueChoice);
  const item =
    jobs[job?.id ?? (waiting ? 'household-ledger' : snapshot.queueChoice)];
  return (
    <>
      <p className="app-subtitle">LOCAL PROCESSING TERMINAL</p>
      <div className="job-workspace gameplay-workspace">
        <div className="machine-scene">
          <MachineVisual
            view={view}
            hardware={state.hardware}
            homeParts={state.home}
            researchShare={
              snapshot.allocation.research / snapshot.compute.effective
            }
            researchProgress={state.workstation.research.progress}
            temperature={snapshot.thermal.temperature}
            fanCurve={state.workstation.operations.fanCurve}
            era={
              state.workstation.reached
                ? 'workstation'
                : state.home.reached
                  ? 'home'
                  : 'beige'
            }
            jobLabel={
              state.benchmark ? benchmarkRules(state).name : item.shortName
            }
            activity={state.benchmark ? 'benchmark' : job ? 'working' : 'idle'}
            progress={job ? job.work / item.work : 0}
          />
        </div>
        <div className="job-controls">
          <h3>{item.shortName}</h3>
          <p className="job-facts">
            {item.work} work · {money(jobPayout(state, item.id))}
            {!state.workstation.reached && ' + up to 50%'}
          </p>
          {job ? (
            <>
              <progress
                aria-label="Job progress"
                value={job.work}
                max={item.work}
              />
              <p className="work-detail">
                {state.benchmark
                  ? `Paused for ${benchmarkRules(state).name}`
                  : job.setupRemainingMs > 0
                    ? `Preparing files · ${seconds(job.setupRemainingMs / 1000)}`
                    : seconds(
                        (item.work - job.work) / jobCompute(state, job.id),
                      )}{' '}
                · {Math.floor(job.work)} / {item.work} work
              </p>
              {state.workstation.reached ? null : job.attempted ? (
                <p className="bonus-result" role="status">
                  {job.bonus > 0
                    ? `Bonus reserved: +${job.bonus * 100}%`
                    : 'Baseline reward secured. Try the next Job.'}
                </p>
              ) : state.home.queue.unlocked ? (
                <div className="batch-choices">
                  <p>
                    Queue the highest Cash/s to reserve +50% this cycle. One
                    choice.
                  </p>
                  <div>
                    {snapshot.jobs
                      .filter((option) => !option.blocker)
                      .map((option) => (
                        <button
                          className="game-button"
                          key={option.id}
                          disabled={!canPlay || !!state.benchmark}
                          title={`${option.work} work, ${option.memory} MB, ${option.durationMs / 1000}s including setup`}
                          onClick={() =>
                            send({ type: 'prioritize-batch', id: option.id })
                          }
                        >
                          {option.shortName} ·{' '}
                          {money((option.reward / option.durationMs) * 1000)}/s
                        </button>
                      ))}
                  </div>
                </div>
              ) : job.mode === 'timing' ? (
                <>
                  <div className="timing-track" aria-hidden="true">
                    <span className="timing-target" />
                    <span
                      className="timing-cursor"
                      style={{ left: `${cursor * 100}%` }}
                    />
                  </div>
                  <button
                    className="game-button boost-button"
                    disabled={!canPlay || !!state.benchmark}
                    onClick={() => send({ type: 'attempt-timing' })}
                  >
                    Boost · aim for the marked band
                  </button>
                </>
              ) : (
                <div className="decision-controls">
                  <p>
                    {opening.workload[job.workload].title}{' '}
                    {opening.workload[job.workload].hint}
                  </p>
                  <div className="button-row">
                    <button
                      className="game-button"
                      disabled={!canPlay || !!state.benchmark}
                      onClick={() =>
                        send({ type: 'choose-strategy', strategy: 'cache' })
                      }
                    >
                      Keep in cache
                    </button>
                    <button
                      className="game-button"
                      disabled={!canPlay || !!state.benchmark}
                      onClick={() =>
                        send({ type: 'choose-strategy', strategy: 'stream' })
                      }
                    >
                      Stream once
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {!state.workstation.reached && (
                <p className="job-instruction">
                  {state.home.queue.unlocked
                    ? 'Start the queued Job. Batch Queue offers one optional prioritization decision.'
                    : state.inputMode === 'decision'
                      ? opening.job.decisionDescription
                      : opening.job.description}
                </p>
              )}
              <button
                className="game-button primary-action"
                disabled={!canPlay || !!state.benchmark}
                onClick={() => send({ type: 'start-job' })}
              >
                Start Job
              </button>
            </>
          )}
          {state.home.storage > 0 && state.home.queue.policy === 'selected' && (
            <label className="mode-control">
              Next Job{' '}
              <select
                aria-label="Next Job"
                value={state.home.selectedJob}
                disabled={!canPlay || !!state.benchmark}
                onChange={(event) =>
                  send({ type: 'select-job', id: event.target.value as JobId })
                }
              >
                {snapshot.jobs
                  .filter(
                    (option) =>
                      option.id !== 'protein' || state.workstation.reached,
                  )
                  .map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.shortName}
                      {option.blocker ? ' · requires preparation' : ''}
                    </option>
                  ))}
              </select>
            </label>
          )}
          {waiting && (
            <p className="small-note">
              {waiting} Household Jobs keep running until ready.
            </p>
          )}
          {state.workstation.reached && (
            <ThermalWindow snapshot={snapshot} send={send} canPlay={canPlay} />
          )}
          {!state.home.queue.unlocked && (
            <label className="mode-control">
              Bonus mode{' '}
              <select
                aria-label="Bonus mode"
                value={state.inputMode}
                disabled={!canPlay || !!state.benchmark}
                onChange={(event) =>
                  send({
                    type: 'set-input-mode',
                    mode:
                      event.target.value === 'decision' ? 'decision' : 'timing',
                  })
                }
              >
                <option value="timing">Timing</option>
                <option value="decision">Decision · no reflexes</option>
              </select>
            </label>
          )}
          {state.home.queue.unlocked &&
            state.home.queue.policy !== 'selected' && (
              <p className="small-note">
                Queue policy: {state.home.queue.policy}. Configure in Task
                Manager.
              </p>
            )}
          {job &&
            !state.home.queue.unlocked &&
            state.inputMode !== job.mode && (
              <p className="small-note">
                The new mode applies to the next Job.
              </p>
            )}
        </div>
      </div>
      <div className="app-statusline">
        <span>
          {state.home.reached
            ? 'Household file: 12s then → 0.1s now'
            : `${state.completedJobs} Jobs completed`}
        </span>
        <span>{state.automation.enabled ? 'Auto-run on' : 'Manual start'}</span>
      </div>
    </>
  );
}
