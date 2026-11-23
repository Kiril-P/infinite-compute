import { useState } from 'react';
import { thermal, type ClockMode } from '../../game/content/thermal';
import type { GameCommand, GameSnapshot } from '../../game/engine/game';
type Props = {
  snapshot: GameSnapshot;
  send: (command: GameCommand) => void;
  canPlay: boolean;
};
export function HeatSoak({ snapshot, send, canPlay }: Props) {
  const [strategy, setStrategy] = useState<ClockMode>('eco');
  const { state, thermal: t } = snapshot;
  const attempt = state.benchmark?.id === 'heat' ? state.benchmark : null;
  const preview = t.heatPreview.find((item) => item.clock === strategy)!;
  return (
    <div className="operations-grid">
      <section className="task-section">
        <h3>Heat Soak Certification</h3>
        <p>
          Changed rule: Cooling fixed at 2. Deliver 1,200,000 work; finish at or
          below 70°C.
        </p>
        <p className="small-note">
          Reward: permanent automatic fan curve and 10 Research. Ordinary Job,
          Research, software fees and temperature are preserved.
        </p>
        <p className="small-note">
          {t.heatBlocker ??
            'Preparation complete. Eco is the safe configuration.'}
        </p>
      </section>
      <section className="task-section">
        {attempt ? (
          <>
            <h3>
              {attempt.result === 'overheated'
                ? 'Too warm to certify'
                : attempt.result === 'cooling'
                  ? 'Cooling to certify'
                  : `Testing ${thermal.clock[attempt.strategy].name}`}
            </h3>
            <progress
              aria-label="Heat Soak progress"
              value={attempt.work}
              max={thermal.heat.work}
            />
            <p>
              {Math.floor(attempt.work).toLocaleString('en-US')} / 1,200,000 ·{' '}
              {attempt.temperature.toFixed(1)}°C
            </p>
            <p className="small-note">
              {attempt.result === 'overheated'
                ? 'Finished above 70°C. Exit and choose Eco, or research efficiency. No ordinary progress lost.'
                : attempt.result === 'cooling'
                  ? 'Work delivered. Holding the test load while cooling to 70°C; your configuration is safe.'
                  : `Fixed Cooling 2; equilibrium ${t.equilibrium.toFixed(1)}°C. Ordinary output is paused.`}
            </p>
            <button
              className="game-button"
              disabled={!canPlay}
              onClick={() => send({ type: 'exit-benchmark' })}
            >
              Exit Heat Soak · restore Job
            </button>
          </>
        ) : (
          <>
            <label>
              Test clock{' '}
              <select
                aria-label="Heat Soak clock"
                value={strategy}
                onChange={(e) => setStrategy(e.target.value as ClockMode)}
              >
                <option value="eco">Eco · safe configuration</option>
                <option value="standard">Standard · check heat</option>
              </select>
            </label>
            <p>
              Predicted equilibrium {preview.equilibrium.toFixed(1)}°C ·{' '}
              {Math.round(preview.powerFactor * 100)}% power efficiency
            </p>
            <p className="small-note">
              {preview.equilibrium <= 70
                ? 'Sustained temperature fits the certification limit.'
                : 'This clock can overheat. Eco lowers demand and temperature.'}
            </p>
            <button
              className="game-button primary-action"
              disabled={!canPlay || !!t.heatBlocker || !!state.benchmark}
              onClick={() => send({ type: 'start-heat-soak', strategy })}
            >
              Start Heat Soak Certification
            </button>
          </>
        )}
      </section>
    </div>
  );
}
