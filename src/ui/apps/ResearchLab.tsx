import { useState } from 'react';
import {
  profiles,
  researchNodes,
  type ProfileId,
  type ResearchId,
  type TuningId,
} from '../../game/content/workstation';
import type { GameCommand, GameSnapshot } from '../../game/engine/game';

type Props = {
  snapshot: GameSnapshot;
  send: (command: GameCommand) => void;
  canPlay: boolean;
};
export function ResearchLab({ snapshot, send, canPlay }: Props) {
  const [page, setPage] = useState<'discoveries' | 'profiles'>('discoveries');
  const [selected, setSelected] = useState<ResearchId>('parallel-library');
  const [profile, setProfile] = useState<ProfileId>('balanced');
  const { state, research, allocation } = snapshot;
  const r = state.workstation.research;
  const node = research.nodes.find((item) => item.id === selected)!;
  const locked = !canPlay || !!state.benchmark || !state.workstation.reached;
  return (
    <div className="research-app">
      <div className="app-pages" aria-label="Research pages">
        <button
          className="game-button"
          aria-pressed={page === 'discoveries'}
          onClick={() => setPage('discoveries')}
        >
          Discoveries & tuning
        </button>
        <button
          className="game-button"
          aria-pressed={page === 'profiles'}
          onClick={() => setPage('profiles')}
        >
          Operating Profiles
        </button>
      </div>
      {page === 'discoveries' ? (
        <div className="research-grid">
          <section className="task-section research-budget">
            <h3>{r.points} Research</h3>
            <p>
              {(
                (allocation.research / 10000) *
                snapshot.thermal.researchRateMultiplier
              ).toFixed(2)}{' '}
              Research/s · {profiles[r.profile].name}
            </p>
            <progress
              aria-label="Next Research point"
              value={r.progress}
              max={1}
            />
            <p className="small-note">
              10,000 work earns{' '}
              {snapshot.thermal.researchRateMultiplier.toFixed(1)} points. Setup
              and standby lend unused Job capacity to Research.
            </p>
            <p className="small-note">
              {r.earned} earned · {research.refund} refundable
            </p>
          </section>
          <section className="task-section research-node">
            <label>
              Inspect{' '}
              <select
                aria-label="Research node"
                value={selected}
                onChange={(e) => setSelected(e.target.value as ResearchId)}
              >
                {research.nodes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                    {item.owned ? ' · owned' : ''}
                  </option>
                ))}
              </select>
            </label>
            <h3>{node.name}</h3>
            <p>{node.effect}</p>
            <p className="small-note">
              {node.kind === 'discovery'
                ? 'Permanent discovery'
                : 'Refundable tuning'}{' '}
              · {node.cost} Research
            </p>
            <button
              className="game-button primary-action"
              disabled={locked || !!node.blocker}
              onClick={() => send({ type: 'buy-research', id: node.id })}
            >
              {node.owned ? 'Owned' : `Research ${node.name}`}
            </button>
            {node.blocker && !node.owned && (
              <p className="small-note">{node.blocker}</p>
            )}
          </section>
        </div>
      ) : (
        <div className="research-grid">
          <section className="task-section">
            <h3>Operating Profile · {profiles[r.profile].name}</h3>
            <label>
              Profile{' '}
              <select
                aria-label="Operating Profile"
                value={profile}
                onChange={(e) => setProfile(e.target.value as ProfileId)}
              >
                {Object.entries(profiles).map(([id, p]) => (
                  <option key={id} value={id}>
                    {p.name} · {p.share * 100}% Research
                  </option>
                ))}
              </select>
            </label>
            <div className="button-row">
              <button
                className="game-button"
                disabled={locked}
                onClick={() => send({ type: 'apply-profile', profile })}
              >
                Apply profile
              </button>
              <button
                className="game-button"
                disabled={locked}
                onClick={() => send({ type: 'save-profile', profile })}
              >
                Save current setup
              </button>
            </div>
            <p className="small-note">
              {r.savedProfiles[profile]
                ? `Saved queue: ${r.savedProfiles[profile].queue}, ${r.savedProfiles[profile].clock} clock. Owned tuning restores on apply.`
                : 'No saved setup. Applying keeps current queue and tuning.'}
            </p>
            {research.missingTuning.length > 0 && (
              <p className="small-note" role="status">
                Unavailable tuning:{' '}
                {research.missingTuning
                  .map((id) => researchNodes[id].name)
                  .join(', ')}
                . Rebuy explicitly to use it.
              </p>
            )}
          </section>
          <section className="task-section">
            <h3>Kernel tuning</h3>
            <div className="tuning-switches">
              {(Object.keys(r.tuning) as TuningId[]).map((id) => (
                <label key={id}>
                  <input
                    type="checkbox"
                    checked={r.enabled.includes(id)}
                    disabled={locked}
                    onChange={(e) =>
                      send({
                        type: 'set-tuning',
                        id,
                        enabled: e.target.checked,
                      })
                    }
                  />
                  {researchNodes[id].name}
                </label>
              ))}
            </div>
            <p className="small-note">
              Refunds tuning only. Discoveries stay owned. Consumes this Job’s
              bonus opportunity.
            </p>
            <button
              className="game-button"
              disabled={locked || research.refund === 0}
              onClick={() => send({ type: 'recompile' })}
            >
              Recompile Kernel · refund {research.refund}
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
