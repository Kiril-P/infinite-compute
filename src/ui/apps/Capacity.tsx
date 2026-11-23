import type { GameSnapshot } from '../../game/engine/game';
import { profiles } from '../../game/content/workstation';
export function Capacity({ snapshot }: { snapshot: GameSnapshot }) {
  const { compute, allocation, state } = snapshot;
  return (
    <section className="task-section capacity-readout">
      <h3>Capacity · {profiles[state.workstation.research.profile].name}</h3>
      <p>
        {compute.raw.toFixed(0)} raw → {compute.effective.toFixed(0)} delivered
        /s
      </p>
      <p className="small-note">
        Memory {Math.round(compute.memoryFactor * 100)}% · GPU airflow{' '}
        {Math.round(compute.airflowFactor * 100)}% · Power{' '}
        {Math.round(compute.powerFactor * 100)}% · Heat{' '}
        {Math.round(compute.thermalFactor * 100)}%.
      </p>
      <div
        className="allocation-bar"
        aria-label={`Jobs ${allocation.jobs.toFixed(0)}, Research ${allocation.research.toFixed(0)} Compute per second`}
      >
        <span
          style={{ width: `${(allocation.jobs / compute.effective) * 100}%` }}
        />
      </div>
      <p>
        Jobs {allocation.jobs.toFixed(0)}/s · Research{' '}
        {allocation.research.toFixed(0)}/s
      </p>
      <p className="small-note">
        Research reserves{' '}
        {profiles[state.workstation.research.profile].share * 100}%; borrows
        spare capacity. GPU: full for logos/protein,15% for older Jobs.
      </p>
    </section>
  );
}
