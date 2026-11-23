import { thermal } from '../../game/content/thermal';
import { QuestionArchive } from './QuestionArchive';
import { useEffect, useRef, useState } from 'react';
import type { GameSession } from '../../app/game-session';
import { home } from '../../game/content/home';
import type { Navigate } from '../../app/navigation';
import { opening } from '../../game/content/opening';
import type { GameState } from '../../game/engine/game';
import { decodeSave, saveSummary } from '../../game/persistence/save';

function downloadText(name: string, text: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: 'application/json' }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

type Props = {
  onNavigate: Navigate;
  session: GameSession;
  snapshot: ReturnType<GameSession['getSnapshot']>;
};
export function Settings({ session, snapshot, onNavigate }: Props) {
  const [page, setPage] = useState<'save' | 'general' | 'help' | 'archive'>(
    'save',
  );
  const [topic, setTopic] = useState<
    'job' | 'hardware' | 'payroll' | 'software' | 'research'
  >('job');
  const [importText, setImportText] = useState('');
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState<
    { type: 'reset' } | { type: 'import'; state: GameState } | null
  >(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (confirmation) dialog.current?.showModal();
    else if (dialog.current?.open) dialog.current.close();
  }, [confirmation]);
  const selectedPage =
    snapshot.status === 'recovery' || snapshot.status === 'read-only'
      ? 'save'
      : page;
  const settings = snapshot.state.settings;
  const isWorkstation = snapshot.state.workstation.reached;
  const isHome = snapshot.state.home.reached;
  const helpTopic =
    (topic === 'software' && !isHome) ||
    (topic === 'research' && !isWorkstation)
      ? 'job'
      : topic;
  return (
    <div className="settings-content">
      <nav className="settings-pages" aria-label="Settings pages">
        {(['save', 'general', 'help', 'archive'] as const).map((item) => (
          <button
            className="game-button"
            key={item}
            aria-pressed={selectedPage === item}
            onClick={() => setPage(item)}
          >
            {item === 'save'
              ? 'Saved game'
              : item === 'general'
                ? 'Sound & motion'
                : item === 'help'
                  ? 'ReadMe.txt'
                  : 'Question Archive'}
          </button>
        ))}
      </nav>
      {selectedPage === 'archive' ? (
        <QuestionArchive state={snapshot.state} />
      ) : selectedPage === 'save' ? (
        <div className="save-grid">
          <section className="settings-section">
            <h3>Saved game · {snapshot.status}</h3>
            <p role="status">
              {snapshot.notice ||
                'Progress is saved in this browser. Export a copy before changing browsers.'}
            </p>
            {snapshot.status === 'read-only' && (
              <button
                className="game-button primary-action"
                onClick={() => session.takeControl()}
              >
                Take control in this tab
              </button>
            )}
            <div className="button-row">
              <button
                className="game-button"
                onClick={() =>
                  downloadText(
                    'infinite-compute-save.json',
                    session.exportSave(),
                  )
                }
              >
                Export save
              </button>
              <button
                className="game-button"
                disabled={!snapshot.canOwn}
                onClick={() => session.retrySave()}
              >
                Retry saving
              </button>
              <button
                className="game-button"
                disabled={!snapshot.canOwn}
                onClick={() => setConfirmation({ type: 'reset' })}
              >
                New game
              </button>
            </div>
          </section>
          <section className="settings-section">
            <label htmlFor="save-import">Import a saved game</label>
            <textarea
              id="save-import"
              aria-label="Saved game JSON"
              value={importText}
              rows={3}
              onChange={(event) => setImportText(event.target.value)}
              placeholder="Paste an exported save here"
            />
            <button
              className="game-button"
              disabled={!snapshot.canOwn || !importText.trim()}
              onClick={() => {
                const result = decodeSave(importText);
                if (result.ok) {
                  setError('');
                  setConfirmation({ type: 'import', state: result.state });
                } else setError(result.error);
              }}
            >
              Review import
            </button>
            {error && <p role="alert">{error}</p>}
          </section>
        </div>
      ) : selectedPage === 'general' ? (
        <div className="general-grid">
          <label>
            <input
              type="checkbox"
              checked={settings.sound}
              disabled={!snapshot.canPlay}
              onChange={(event) =>
                session.send({
                  type: 'configure',
                  settings: { sound: event.target.checked },
                })
              }
            />{' '}
            Sound feedback
          </label>
          <label>
            Volume{' '}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.volume}
              disabled={!snapshot.canPlay}
              onChange={(event) =>
                session.send({
                  type: 'configure',
                  settings: { volume: Number(event.target.value) },
                })
              }
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.motionPaused}
              disabled={!snapshot.canPlay}
              onChange={(event) =>
                session.send({
                  type: 'configure',
                  settings: { motionPaused: event.target.checked },
                })
              }
            />{' '}
            Pause ambient animation
          </label>
          <p>
            System reduced motion is always respected. Choose Decision mode in
            Job Runner for bonuses without reflex timing.
          </p>
          {import.meta.env.DEV && (
            <>
              <label>
                Development speed{' '}
                <select
                  aria-label="Development speed"
                  value={snapshot.speed}
                  onChange={(event) =>
                    session.setSpeed(Number(event.target.value))
                  }
                >
                  <option value="1">1× real time</option>
                  <option value="10">10×</option>
                  <option value="60">60×</option>
                </select>
              </label>
              <button
                className="game-button"
                onClick={() =>
                  downloadText(
                    'infinite-compute-trace.json',
                    session.exportTrace(),
                  )
                }
              >
                Export local development trace
              </button>
            </>
          )}
        </div>
      ) : (
        <section className="settings-section help-section">
          <h3>{opening.help.title}</h3>
          <div className="button-row">
            {(
              [
                'job',
                'hardware',
                'payroll',
                ...(isHome ? ['software' as const] : []),
                ...(isWorkstation ? ['research' as const] : []),
              ] as const
            ).map((item) => (
              <button
                className="game-button"
                aria-pressed={helpTopic === item}
                key={item}
                onClick={() => setTopic(item)}
              >
                {item === 'research'
                  ? 'Research & profiles'
                  : item === 'job'
                    ? 'Jobs'
                    : item === 'hardware'
                      ? 'Why am I slow?'
                      : item === 'software'
                        ? 'Software terms'
                        : isWorkstation
                          ? 'Heat Soak solution'
                          : isHome
                            ? 'Memory solution'
                            : 'Payroll solution'}
              </button>
            ))}
          </div>
          <p>
            {isWorkstation && helpTopic !== 'software'
              ? thermal.help[helpTopic]
              : isHome
                ? home.help[helpTopic === 'research' ? 'job' : helpTopic]
                : opening.help[
                    helpTopic === 'software' || helpTopic === 'research'
                      ? 'job'
                      : helpTopic
                  ]}
          </p>
          <p className="small-note">
            Memory efficiency: {Math.round(snapshot.compute.memoryFactor * 100)}
            %.{' '}
            {snapshot.compute.memoryFactor < 1
              ? 'RAM purchases recover the lost Compute.'
              : 'Memory is feeding the CPU.'}
            {isHome &&
              ` Graphics airflow: ${Math.round(snapshot.compute.airflowFactor * 100)}%.`}
          </p>
          <button
            className="game-button"
            onClick={() =>
              onNavigate({
                type: 'focus-application',
                applicationId:
                  helpTopic === 'research'
                    ? 'research-lab'
                    : helpTopic === 'job'
                      ? 'job-runner'
                      : helpTopic === 'hardware'
                        ? 'hardware-manager'
                        : helpTopic === 'software'
                          ? 'shop'
                          : 'task-manager',
              })
            }
          >
            Open related application
          </button>
        </section>
      )}
      <dialog
        ref={dialog}
        className="confirmation-dialog"
        onCancel={() => setConfirmation(null)}
        aria-labelledby="save-confirmation-title"
      >
        <h3 id="save-confirmation-title">
          {confirmation?.type === 'reset'
            ? 'Start a new game?'
            : 'Replace the current game?'}
        </h3>
        <p>
          {confirmation?.type === 'import'
            ? saveSummary(confirmation.state)
            : 'Current progress will be replaced. Export a copy first if you want to keep it.'}
        </p>
        <div className="button-row">
          <button
            className="game-button"
            autoFocus
            onClick={() => setConfirmation(null)}
          >
            Cancel
          </button>
          <button
            className="game-button"
            disabled={!snapshot.canOwn}
            onClick={() => {
              if (confirmation?.type === 'reset') session.reset();
              else if (confirmation) session.replaceState(confirmation.state);
              setConfirmation(null);
            }}
          >
            Confirm replacement
          </button>
        </div>
      </dialog>
    </div>
  );
}
