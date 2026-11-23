import type { GameCommand, GameSnapshot } from '../../game/engine/game';
export function ThermalWindow({
  snapshot,
  send,
  canPlay,
}: {
  snapshot: GameSnapshot;
  send: (command: GameCommand) => void;
  canPlay: boolean;
}) {
  const { state, thermal: t } = snapshot,
    w = state.workstation.operations.window;
  const locked = !canPlay || !!state.benchmark;
  return (
    <div className="thermal-window">
      <p>
        Thermal Window · {t.temperature.toFixed(1)}°C ·{' '}
        {w && !w.preparing ? '125% clock' : 'optional boost'}
      </p>
      {w?.preparing ? (
        <>
          <p className="small-note">
            Reserved at {w.startTemperature.toFixed(1)}°C. Below 64°C: Steady;
            otherwise Pre-cool. Choose without a timer.
          </p>
          <div className="button-row">
            <button
              className="game-button"
              disabled={locked}
              onClick={() =>
                send({ type: 'choose-thermal-plan', plan: 'steady' })
              }
            >
              Steady curve
            </button>
            <button
              className="game-button"
              disabled={locked}
              onClick={() =>
                send({ type: 'choose-thermal-plan', plan: 'precool' })
              }
            >
              Pre-cool curve
            </button>
          </div>
        </>
      ) : w ? (
        <>
          <p className="small-note">
            {(w.elapsedMs / 1000).toFixed(1)} / 15s · {w.adjustments}/2
            adjustments.{' '}
            {w.mode === 'decision'
              ? 'Your plan controls both adjustments.'
              : w.adjustments === 0
                ? 'Adjust at 3–6s.'
                : w.adjustments === 1
                  ? 'Adjust again at 8–11s.'
                  : 'Both adjustments complete.'}
          </p>
          {w.mode === 'timing' && (
            <button
              className="game-button"
              disabled={locked || w.adjustments === 2}
              onClick={() => send({ type: 'adjust-thermal-window' })}
            >
              Adjust fans · cool 4°C
            </button>
          )}
        </>
      ) : (
        <>
          <div className="button-row">
            <button
              className="game-button"
              disabled={locked || !!t.windowBlocker}
              onClick={() => send({ type: 'start-thermal-window' })}
            >
              Start Thermal Window
            </button>
            <select
              aria-label="Thermal interaction"
              disabled={locked}
              value={state.inputMode}
              onChange={(e) =>
                send({
                  type: 'set-input-mode',
                  mode: e.target.value === 'decision' ? 'decision' : 'timing',
                })
              }
            >
              <option value="timing">Timed adjustments</option>
              <option value="decision">Untimed plan</option>
            </select>
          </div>
          <p className="small-note">
            {t.windowBlocker ??
              'Two broad adjustments keep the boost going. A miss only ends the boost.'}
          </p>
        </>
      )}
    </div>
  );
}
