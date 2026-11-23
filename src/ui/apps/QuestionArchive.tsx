import { useState } from 'react';
import {
  journalEntries,
  archiveCopy,
  type JournalDefinition,
} from '../../game/content/journal';
import { gameMessages } from '../../game/content/home';
import type { GameState } from '../../game/engine/game';

export function QuestionArchive({ state }: { state: GameState }) {
  const [kind, setKind] = useState<JournalDefinition['kind']>('system');
  const [page, setPage] = useState(0);
  const available = state.journal.entries
    .filter((entry) => journalEntries[entry.id].kind === kind)
    .toReversed();
  const index = Math.min(page, Math.max(0, available.length - 1)),
    entry = available[index];
  const content = entry ? journalEntries[entry.id] : null;
  return (
    <div className="archive-app">
      <nav className="hardware-pages" aria-label="Archive categories">
        {(['system', 'news', 'achievement'] as const).map((id) => (
          <button
            className="game-button"
            key={id}
            aria-pressed={kind === id}
            onClick={() => {
              setKind(id);
              setPage(0);
            }}
          >
            {id === 'system'
              ? 'System history'
              : id === 'news'
                ? 'News'
                : 'Achievements'}
          </button>
        ))}
      </nav>
      <div className="archive-content">
        <article className="archive-entry">
          <p className="app-subtitle">
            {content
              ? content.era === 'beige'
                ? 'LOCAL MACHINE / 001'
                : content.era === 'workstation'
                  ? 'LAB SYSTEM / 003'
                  : 'DESKTOP SYSTEM / 002'
              : 'ARCHIVE'}
          </p>
          <h3>
            {content?.title ??
              (kind === 'news'
                ? 'No announcements yet'
                : 'No achievements yet')}
          </h3>
          <p>{content?.text ?? archiveCopy.empty}</p>
          {entry && (
            <p className="small-note">
              {entry.at === null
                ? 'Recovered from an older save · original time not recorded'
                : `${Math.floor(entry.at / 60000)}m ${Math.floor((entry.at % 60000) / 1000)}s after first boot`}
              {content?.kind === 'achievement'
                ? ' · Cosmetic · no economy effect'
                : ''}
              {content?.secret ? ' · Secret discovered' : ''}
            </p>
          )}
          <div className="button-row archive-pagination">
            <button
              className="game-button"
              disabled={index === 0}
              onClick={() => setPage(index - 1)}
            >
              Newer entry
            </button>
            <span>
              {available.length
                ? `${index + 1} of ${available.length} saved entries`
                : 'No saved entries'}
            </span>
            <button
              className="game-button"
              disabled={index >= available.length - 1}
              onClick={() => setPage(index + 1)}
            >
              Older entry
            </button>
          </div>
        </article>
        <aside className="archive-directive">
          <h3>Question Archive</h3>
          <p>{gameMessages.opening}</p>
          <p className="small-note">
            {state.milestones.firstJobMs !== null
              ? archiveCopy.artifactKept
              : archiveCopy.artifactWaiting}
          </p>
          <p className="small-note">{archiveCopy.estimate}</p>
        </aside>
      </div>
    </div>
  );
}
