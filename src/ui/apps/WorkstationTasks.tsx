import { useState } from 'react';
import type { GameCommand, GameSnapshot } from '../../game/engine/game';
import { HomeTasks } from './HomeTasks';
import { Operations } from './Operations';
import { HeatSoak } from './HeatSoak';
type Props = {
  snapshot: GameSnapshot;
  send: (command: GameCommand) => void;
  canPlay: boolean;
};
export function WorkstationTasks(props: Props) {
  const [page, setPage] = useState<'queue' | 'operations' | 'heat'>(
    'operations',
  );
  return (
    <div className="workstation-tasks">
      <nav className="hardware-pages" aria-label="Task Manager pages">
        {(
          [
            { id: 'queue', name: 'Queue & capacity' },
            { id: 'operations', name: 'Power & temperature' },
            { id: 'heat', name: 'Heat Soak' },
          ] as const
        ).map((item) => (
          <button
            className="game-button"
            key={item.id}
            aria-pressed={page === item.id}
            onClick={() => setPage(item.id)}
          >
            {item.name}
          </button>
        ))}
      </nav>
      {page === 'queue' ? (
        <HomeTasks {...props} />
      ) : page === 'operations' ? (
        <Operations {...props} />
      ) : (
        <HeatSoak {...props} />
      )}
    </div>
  );
}
