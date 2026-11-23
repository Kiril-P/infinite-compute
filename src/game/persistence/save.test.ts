import { runHomeRoute } from '../../test/home-route';
import { expect, test } from 'vitest';
import { createGame } from '../engine/game';
import {
  decodeSave,
  encodeSave,
  loadSave,
  persistSave,
  SAVE_KEY,
  BACKUP_KEY,
} from './save';

test('a versioned save restores partial work and rejects malformed or future state', () => {
  const game = createGame({ seed: 91 });
  game.dispatch({ type: 'start-job' });
  game.advance(1234);
  game.dispatch({ type: 'attempt-timing' });
  const encoded = encodeSave(game.getState());
  const decoded = decodeSave(encoded);
  expect(decoded.ok).toBe(true);
  if (!decoded.ok) throw new Error(decoded.error);
  expect(decoded.state).toEqual(game.getState());
  for (const raw of [
    'broken',
    '{}',
    JSON.stringify({ ...JSON.parse(encoded), schemaVersion: 999 }),
    encoded.replace('"cash":0', '"cash":-1'),
    encoded.replace('"pendingMs":34', '"pendingMs":101'),
  ]) {
    expect(decodeSave(raw).ok).toBe(false);
  }
});

test('invalid primary saves recover a validated backup and failed writes retain the previous save', () => {
  const map = new Map<string, string>();
  const storage = {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
  };
  const initial = createGame().getState();
  expect(persistSave(storage, initial).ok).toBe(true);
  map.set(BACKUP_KEY, map.get(SAVE_KEY)!);
  map.set(SAVE_KEY, '{broken');
  const restored = loadSave(storage);
  expect(restored.status).toBe('recovered');
  expect(restored.state).toEqual(initial);
  const failing = {
    ...storage,
    setItem: () => {
      throw new Error('Quota exceeded');
    },
  };
  expect(persistSave(failing, initial).ok).toBe(false);
  expect(map.get(SAVE_KEY)).toBe('{broken');
  map.delete(BACKUP_KEY);
  expect(loadSave(storage).status).toBe('invalid');
});

test('schema 1 migrates a partially processed opening Job without rewriting earned state', () => {
  const game = createGame({ seed: 12 });
  game.dispatch({ type: 'start-job' });
  game.advance(3456);
  const state = game.getState();
  const { home: _home, ...legacy } = state;
  void _home;
  const { setupRemainingMs: _setup, ...oldJob } = legacy.job!;
  void _setup;
  const decoded = decodeSave(
    JSON.stringify({
      schemaVersion: 1,
      gameVersion: '0.1.0',
      savedAt: '2026-09-08T00:00:00Z',
      state: { ...legacy, job: oldJob },
    }),
  );
  expect(decoded.ok).toBe(true);
  if (!decoded.ok) throw new Error(decoded.error);
  expect(decoded.state).toEqual({ ...state, journal: expect.any(Object) });
});

test('schema 2 upgrades queue metadata while preserving a Home-PC selection', () => {
  const state = createGame().getState();
  state.hardware = { cpu: 6, ram: 4 };
  state.automation = { unlocked: true, enabled: true };
  state.milestones.firstPurchaseMs = 0;
  state.milestones.automationMs = 0;
  state.home = {
    ...state.home,
    reached: true,
    wideBus: true,
    storage: 1,
    selectedJob: 'wonder',
    transitionMs: 0,
  };
  const { queue: _queue, ...oldHome } = state.home;
  void _queue;
  const raw = JSON.stringify({
    schemaVersion: 2,
    gameVersion: '0.2.0',
    savedAt: '2026-09-08T00:00:00Z',
    state: { ...state, home: oldHome },
  });
  const result = decodeSave(raw);
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error);
  expect(result.state).toEqual({ ...state, journal: expect.any(Object) });
});

test('schema 3 migrates owned queue policy without fabricating graphics; schema 4 validates graphics bounds', () => {
  const state = createGame().getState();
  state.hardware = { cpu: 8, ram: 5 };
  state.milestones.firstPurchaseMs = 0;
  state.milestones.automationMs = 0;
  state.automation = { unlocked: true, enabled: false };
  state.home = {
    ...state.home,
    reached: true,
    storage: 2,
    wideBus: true,
    transitionMs: 0,
    queue: {
      ...state.home.queue,
      unlocked: true,
      policy: 'cash',
      nextBatch: 'wonder',
    },
  };
  const old = JSON.parse(encodeSave(state));
  old.schemaVersion = 3;
  delete old.state.home.gpu;
  delete old.state.home.cooling;
  const migrated = decodeSave(JSON.stringify(old));
  expect(migrated.ok).toBe(true);
  if (!migrated.ok) throw new Error(migrated.error);
  expect(migrated.state).toEqual({ ...state, journal: expect.any(Object) });
  const game = createGame({ state: { ...state, cash: 30000 } });
  game.dispatch({ type: 'buy-home-part', part: 'gpu' });
  game.dispatch({ type: 'buy-home-part', part: 'cooling' });
  const upgraded = game.getState();
  expect(decodeSave(encodeSave(upgraded))).toEqual({
    ok: true,
    state: upgraded,
  });
  for (const home of [
    { ...upgraded.home, gpu: 5 },
    { ...upgraded.home, cooling: 4 },
    { ...upgraded.home, gpu: 0 },
    { ...upgraded.home, storage: 1 },
    { ...upgraded.home, gpu: NaN },
  ]) {
    expect(decodeSave(encodeSave({ ...upgraded, home })).ok).toBe(false);
  }
});

test('schema 4 preserves installed graphics and migrates a free software edition; invalid renewals are rejected', () => {
  const state = createGame().getState();
  state.hardware = { cpu: 8, ram: 5 };
  state.cash = 10000;
  state.milestones.firstPurchaseMs = 0;
  state.milestones.automationMs = 0;
  state.automation = { unlocked: true, enabled: false };
  state.home = {
    ...state.home,
    reached: true,
    wideBus: true,
    storage: 2,
    gpu: 3,
    cooling: 2,
    transitionMs: 0,
  };
  const old = JSON.parse(encodeSave(state));
  old.schemaVersion = 4;
  delete old.state.home.software;
  expect(decodeSave(JSON.stringify(old))).toEqual({
    ok: true,
    state: { ...state, journal: expect.any(Object) },
  });
  const game = createGame({ state });
  game.dispatch({ type: 'set-software', plan: 'lease' });
  game.advance(12300);
  const current = game.getState();
  expect(decodeSave(encodeSave(current))).toEqual({ ok: true, state: current });
  for (const software of [
    { ...current.home.software, renewalMs: -1 },
    { ...current.home.software, renewalMs: 123 },
    { ...current.home.software, plan: 'free' as const },
    { ...current.home.software, ownsPermanent: true },
  ]) {
    expect(
      decodeSave(
        encodeSave({ ...current, home: { ...current.home, software } }),
      ).ok,
    ).toBe(false);
  }
});

test('schema 5 reconstructs known story times without inventing old Job history and schema 6 rejects damaged journals', () => {
  const state = createGame().getState();
  state.elapsedMs = 900000;
  state.completedJobs = 5;
  state.hardware = { cpu: 8, ram: 5 };
  state.milestones = {
    firstJobMs: 12000,
    firstPurchaseMs: 24000,
    automationMs: 240000,
  };
  state.automation = { unlocked: true, enabled: false };
  state.message = 'memory';
  state.home = {
    ...state.home,
    reached: true,
    wideBus: true,
    storage: 2,
    transitionMs: 540000,
    queue: { ...state.home.queue, unlocked: true },
    software: { ...state.home.software, offered: true },
  };
  const old = JSON.parse(encodeSave(state));
  old.schemaVersion = 5;
  delete old.state.journal;
  const result = decodeSave(JSON.stringify(old));
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error);
  expect(result.state.journal.entries).toEqual([
    { id: 'opening', at: 0 },
    { id: 'firstJob', at: 12000 },
    { id: 'first-result', at: 12000 },
    { id: 'firstPurchase', at: 24000 },
    { id: 'payroll', at: 240000 },
    { id: 'queue-owned', at: 240000 },
    { id: 'transition', at: 540000 },
    { id: 'home-kept', at: 540000 },
    { id: 'desk-expanded', at: 540000 },
    { id: 'memory', at: null },
    { id: 'memory-mastered', at: null },
    { id: 'softwareOffer', at: null },
  ]);
  expect(result.state.journal.pending).toEqual([]);
  expect(result.state.journal.holdMs).toBe(0);
  const raw = encodeSave(result.state);
  expect(decodeSave(raw)).toEqual(result);
  for (const mutate of [
    (value: Record<string, unknown>) => {
      value.holdMs = 10001;
    },
    (value: Record<string, unknown>) => {
      value.pending = ['wonder'];
    },
    (value: Record<string, unknown>) => {
      value.pending = ['payroll', 'payroll'];
    },
    (value: Record<string, unknown>) => {
      value.entries = [
        { id: 'opening', at: 0 },
        { id: 'opening', at: 0 },
      ];
    },
    (value: Record<string, unknown>) => {
      value.entries = [{ id: 'missing', at: 0 }];
    },
  ]) {
    const damaged = JSON.parse(raw);
    mutate(damaged.state.journal);
    expect(decodeSave(JSON.stringify(damaged)).ok).toBe(false);
  }
});

test('schema 6 migrates the saved Home session intact; malformed Research cannot mint a refund', () => {
  const state = runHomeRoute().game.getState();
  const envelope = JSON.parse(encodeSave(state));
  envelope.schemaVersion = 6;
  delete envelope.state.workstation;
  const migrated = decodeSave(JSON.stringify(envelope));
  expect(migrated).toEqual({ ok: true, state });
  for (const mutate of [
    (s: typeof state) => {
      s.workstation.research.points = 10;
    },
    (s: typeof state) => {
      s.workstation.research.tuning['branch-cache'] = { paid: 999 };
    },
    (s: typeof state) => {
      s.workstation.research.enabled = ['wide-vectors'];
    },
    (s: typeof state) => {
      s.workstation.research.progress = 1;
    },
    (s: typeof state) => {
      s.workstation.reached = true;
      s.workstation.transitionMs = 0;
    },
  ]) {
    const invalid = structuredClone(state);
    mutate(invalid);
    expect(decodeSave(encodeSave(invalid)).ok).toBe(false);
  }
});
