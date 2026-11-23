import { useEffect, useState, useSyncExternalStore } from 'react';
import { createGameSession } from './game-session';

export function useGame() {
  const [session] = useState(createGameSession);
  useEffect(() => session.connect(), [session]);
  const snapshot = useSyncExternalStore(session.subscribe, session.getSnapshot);
  return { session, snapshot };
}
