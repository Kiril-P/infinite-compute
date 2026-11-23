import { createSynth } from '../audio/synth';
import {
  createGame,
  type GameCommand,
  type GameEvent,
  type GameState,
} from '../game/engine/game';
import {
  decodeSave,
  encodeSave,
  loadSave,
  persistSave,
  type SaveStorage,
} from '../game/persistence/save';

const LOCK = 'infinite-compute.writer';
const CHANNEL = 'infinite-compute.control';
export type SaveStatus =
  'loading' | 'saved' | 'unsaved' | 'read-only' | 'recovery';

export function createGameSession() {
  let game = createGame();
  let status: SaveStatus = 'loading';
  let notice = '';
  let original: string | null = null;
  let owner = false;
  let memoryOnly = false;
  let unreadStorage = false;
  let visible = true;
  let generation = 0;
  let active = false;
  let release: (() => void) | null = null;
  let request: AbortController | null = null;
  let channel: BroadcastChannel | null = null;
  let interval: ReturnType<typeof setInterval> | null = null;
  let lastTime = 0;
  let catchup = 0;
  let lastSave = 0;
  let speed = 1;
  let revision = 0;
  const listeners = new Set<() => void>();
  const trace: GameEvent[] = [];
  const synth = createSynth();
  const storage: SaveStorage = {
    getItem: (key) => localStorage.getItem(key),
    setItem: (key, value) => localStorage.setItem(key, value),
  };
  const snapshot = () => ({
    ...game.getSnapshot(),
    status,
    notice,
    original,
    canPlay: (owner || memoryOnly) && status !== 'recovery',
    canOwn: owner || memoryOnly,
    speed,
    revision,
  });
  let current = snapshot();
  const publish = () => {
    revision++;
    current = snapshot();
    listeners.forEach((fn) => fn());
  };
  const eventsReceived = (events: GameEvent[]) => {
    if (import.meta.env.DEV) {
      trace.push(...events);
      if (trace.length > 2000) trace.splice(0, trace.length - 2000);
    }
    const state = game.getState(),
      settings = state.settings;
    synth.play(
      events,
      settings.sound,
      settings.volume,
      state.workstation.reached
        ? 'workstation'
        : state.home.reached
          ? 'home'
          : 'beige',
    );
  };
  const save = () => {
    if (!owner || status === 'recovery') return status === 'recovery';
    if (unreadStorage) return false;
    const result = persistSave(storage, game.getState());
    status = result.ok ? 'saved' : 'unsaved';
    if (!result.ok) notice = result.error;
    else if (
      notice.startsWith('Unsaved') ||
      notice.startsWith('Storage is unavailable')
    )
      notice = '';
    lastSave = performance.now();
    return result.ok;
  };
  const tick = () => {
    const now = performance.now();
    if ((!owner && !memoryOnly) || status === 'recovery' || !visible) {
      lastTime = now;
      return;
    }
    catchup += Math.max(0, now - lastTime) * speed;
    lastTime = now;
    const chunk = Math.min(catchup, 60000);
    catchup -= chunk;
    if (chunk > 0) eventsReceived(game.advance(chunk));
    if (now - lastSave >= 2000) save();
    publish();
  };
  const relinquish = (force = false) => {
    if (!owner) return;
    tick();
    if (!save() && !force) {
      notice =
        'Unsaved: control stays here to protect your progress. Export a copy or retry saving before switching tabs.';
      channel?.postMessage('transfer-blocked');
      publish();
      return;
    }
    owner = false;
    status = 'read-only';
    notice = 'This tab is paused. Another tab controls the save.';
    catchup = 0;
    release?.();
    release = null;
    publish();
  };
  const hydrate = () => {
    const loaded = loadSave(storage);
    unreadStorage = loaded.status === 'unavailable';
    original = loaded.rejected;
    notice = ['invalid', 'recovered', 'unavailable'].includes(loaded.status)
      ? loaded.message
      : '';
    game = loaded.state
      ? createGame({ state: loaded.state })
      : createGame({ seed: 2026 });
    if (
      !loaded.state &&
      loaded.status === 'new' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    )
      game.dispatch({ type: 'set-input-mode', mode: 'decision' });
    status =
      loaded.status === 'invalid'
        ? 'recovery'
        : loaded.status === 'unavailable' || memoryOnly
          ? 'unsaved'
          : 'saved';
    catchup = 0;
    lastTime = performance.now();
    if (status === 'saved') save();
    if (memoryOnly)
      notice =
        'Automatic saving is unavailable in this browser. Export before closing.';
    publish();
  };
  const claim = () => {
    if (!active || owner || memoryOnly) return;
    request?.abort();
    request = new AbortController();
    const token = generation;
    const options: LockOptions = { signal: request.signal };
    status = 'read-only';
    notice =
      'Another tab may control this save. Take control here or close the other tab.';
    const loaded = loadSave(storage);
    if (loaded.state) game = createGame({ state: loaded.state });
    publish();
    void navigator.locks
      .request(LOCK, options, async (lock) => {
        if (!active || token !== generation) return;
        if (!lock) {
          status = 'read-only';
          notice =
            'Another tab controls this save. Take control here or close the other tab.';
          const loaded = loadSave(storage);
          if (loaded.state) game = createGame({ state: loaded.state });
          publish();
          return;
        }
        owner = true;
        await new Promise<void>((resolve) => {
          release = resolve;
          hydrate();
        });
      })
      .catch((error: unknown) => {
        if (
          !active ||
          token !== generation ||
          (error instanceof DOMException && error.name === 'AbortError')
        )
          return;
        owner = false;
        status = 'unsaved';
        memoryOnly = true;
        notice =
          'Save ownership is unavailable. Playing in memory only; export before closing.';
        lastTime = performance.now();
        publish();
      });
  };
  const visibility = () => {
    tick();
    if (document.hidden) {
      while (catchup > 0) {
        const chunk = Math.min(catchup, 60000);
        catchup -= chunk;
        eventsReceived(game.advance(chunk));
      }
      save();
    }
    visible = !document.hidden;
    lastTime = performance.now();
    catchup = 0;
    publish();
  };
  const pagehide = () => relinquish(true);
  const pageshow = () => {
    if (active && !owner && !memoryOnly) claim();
  };
  return {
    getSnapshot: () => current,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    connect() {
      const token = ++generation;
      active = true;
      visible = !document.hidden;
      lastTime = performance.now();
      if ('BroadcastChannel' in window) {
        channel = new BroadcastChannel(CHANNEL);
        channel.onmessage = (event: MessageEvent<unknown>) => {
          if (event.data === 'take-control' && owner) relinquish();
          if (event.data === 'transfer-blocked' && !owner) {
            notice =
              'The other tab could not save. Control remains there; export or retry saving in that tab first.';
            publish();
          }
        };
      }
      if (navigator.locks) claim();
      else {
        memoryOnly = true;
        hydrate();
      }
      interval = setInterval(tick, 100);
      document.addEventListener('visibilitychange', visibility);
      window.addEventListener('pagehide', pagehide);
      window.addEventListener('pageshow', pageshow);
      return () => {
        if (generation !== token) return;
        relinquish(true);
        active = false;
        generation++;
        request?.abort();
        request = null;
        if (interval) clearInterval(interval);
        channel?.close();
        channel = null;
        document.removeEventListener('visibilitychange', visibility);
        window.removeEventListener('pagehide', pagehide);
        window.removeEventListener('pageshow', pageshow);
        synth.close();
      };
    },
    send(command: GameCommand) {
      if (!current.canPlay) return;
      tick();
      if (
        game.getState().settings.sound ||
        (command.type === 'configure' && command.settings.sound)
      )
        void synth.enable().then((ok) => {
          if (!ok) {
            notice = 'Audio is unavailable. Visual feedback remains enabled.';
            publish();
          }
        });
      eventsReceived(game.dispatch(command));
      save();
      publish();
    },
    takeControl() {
      if (owner || memoryOnly) return;
      notice =
        'Waiting for the other tab to save and release control. If it cannot respond, close it and try again.';
      channel?.postMessage('take-control');
      claim();
      publish();
    },
    retrySave() {
      if (unreadStorage) {
        const loaded = loadSave(storage);
        if (loaded.status === 'new') {
          unreadStorage = false;
          save();
        } else
          notice =
            'Storage could not be read when this session started. Export this session, then reload or explicitly import it to choose which progress to keep.';
      } else save();
      publish();
    },
    exportSave: () =>
      status === 'recovery' && original
        ? original
        : encodeSave(game.getState()),
    replaceState(state: GameState) {
      if (!current.canOwn) return false;
      // Revalidate imports even if the confirmation screen already inspected the file.
      const checked = decodeSave(encodeSave(state));
      if (!checked.ok) return false;
      game = createGame({ state: checked.state });
      status = 'unsaved';
      notice = '';
      original = null;
      unreadStorage = false;
      catchup = 0;
      lastTime = performance.now();
      save();
      publish();
      return true;
    },
    reset() {
      if (current.canOwn) {
        const state = createGame({ seed: 2026 }).getState();
        this.replaceState(state);
      }
    },
    setSpeed(value: number) {
      if (import.meta.env.DEV && [1, 10, 60].includes(value)) {
        tick();
        speed = value;
        publish();
      }
    },
    exportTrace: () =>
      import.meta.env.DEV ? JSON.stringify(trace, null, 2) : '[]',
  };
}

export type GameSession = ReturnType<typeof createGameSession>;

// Engine changes must hydrate through save migrations, not retain an old React session.
if (import.meta.hot) import.meta.hot.accept(() => window.location.reload());
