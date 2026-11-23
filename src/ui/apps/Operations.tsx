import { thermal, type ClockMode } from '../../game/content/thermal';
import type { GameCommand, GameSnapshot } from '../../game/engine/game';
import { money } from '../../app/game-content';
type Props = {
  snapshot: GameSnapshot;
  send: (command: GameCommand) => void;
  canPlay: boolean;
};
export function Operations({ snapshot, send, canPlay }: Props) {
  const { state, thermal: t } = snapshot,
    ops = state.workstation.operations;
  const cost = thermal.power.cost(ops.power),
    locked = !canPlay || !!state.benchmark;
  return (
    <div className="operations-grid">
      <section className="task-section">
        <h3>
          Power supply · {ops.power}/{thermal.power.cap}
        </h3>
        <p>
          {t.demand.toFixed(0)} W requested / {t.supply} W available ·{' '}
          {Math.round(t.powerFactor * 100)}% power efficiency
        </p>
        <button
          className="game-button"
          disabled={
            locked || ops.power === thermal.power.cap || state.cash < cost
          }
          onClick={() => send({ type: 'buy-power' })}
        >
          {ops.power === thermal.power.cap
            ? 'Power at chassis limit'
            : `Buy Power · ${money(cost)}`}
        </button>
        <p className="small-note">
          +150 W per upgrade. Power 1 prepares Heat Soak; Power 2 fills the
          supply bay. Eco reduces demand immediately.
        </p>
        <label>
          Clock{' '}
          <select
            aria-label="Operating clock"
            value={ops.clock}
            disabled={locked}
            onChange={(e) =>
              send({ type: 'set-clock', clock: e.target.value as ClockMode })
            }
          >
            <option value="standard">Standard · 100% clock / draw</option>
            <option value="eco">
              Eco · {thermal.clock.eco.speed * 100}% clock /{' '}
              {thermal.clock.eco.draw * 100}% draw
            </option>
          </select>
        </label>
      </section>
      <section className="task-section">
        <h3>
          {t.temperature.toFixed(1)}°C ·{' '}
          {t.temperature >= 70
            ? 'Throttled'
            : t.temperature >= 60
              ? 'Warm'
              : 'Safe'}
        </h3>
        <progress aria-label="Temperature" value={t.temperature} max={100} />
        <p>
          {Math.round(t.thermalFactor * 100)}% thermal efficiency · tending
          toward {t.equilibrium.toFixed(1)}°C
        </p>
        <p className="small-note">
          Warning 60°C; throttling above 70°C, reaching 50% at 90°C. Eco or more
          Cooling lowers temperature. Progress and parts stay intact.
        </p>
        <p className="small-note">
          {ops.fanCurve
            ? 'Automatic fan curve active: +15 cooling response.'
            : ops.heatObserved
              ? 'Warm state observed. Heat Soak preparation is available.'
              : 'Standard clock will demonstrate warming before Heat Soak.'}
        </p>
      </section>
    </div>
  );
}
