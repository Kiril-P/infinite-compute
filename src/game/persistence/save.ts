import {
  newOperations,
  thermal,
  type OperationsState,
} from '../content/thermal';
import {
  newWorkstation,
  profiles,
  researchNodes,
  type WorkstationState,
  type ResearchId,
} from '../content/workstation';
import {
  gameMessages,
  home as homeContent,
  jobs,
  newHome,
  newQueue,
  type JobId,
} from '../content/home';
import { opening } from '../content/opening';
import { newSoftware } from '../content/software';
import { journalEntries } from '../content/journal';
import { legacyJournal, isCriticalMessage } from '../engine/journal';
import { computeFor, type GameState } from '../engine/game';
import { thermalFactors } from '../engine/thermal';

export const SAVE_KEY = 'infinite-compute.save';
export const BACKUP_KEY = 'infinite-compute.backup';
export const REJECTED_KEY = 'infinite-compute.rejected-save';
export type SaveStorage = Pick<Storage, 'getItem' | 'setItem'>;
type Result = { ok: true; state: GameState } | { ok: false; error: string };

const record = (value: unknown): Record<string, unknown> | null =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
const number = (
  value: unknown,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
): value is number =>
  typeof value === 'number' &&
  Number.isFinite(value) &&
  value >= min &&
  value <= max;
const integer = (
  value: unknown,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
): value is number => number(value, min, max) && Number.isInteger(value);
const mode = (value: unknown) => value === 'timing' || value === 'decision';

function validOperations(
  value: unknown,
  reached: boolean,
  discoveries: string[],
): value is OperationsState {
  const ops = record(value);
  if (
    !ops ||
    !integer(ops.power, 0, 2) ||
    !['eco', 'standard'].includes(ops.clock as string) ||
    !number(ops.temperature, 30, 200) ||
    typeof ops.heatObserved !== 'boolean' ||
    typeof ops.fanCurve !== 'boolean' ||
    !integer(ops.cooldownMs, 0, 60000) ||
    ops.cooldownMs % 100 !== 0
  )
    return false;
  if (ops.window !== null) {
    const w = record(ops.window);
    if (
      !w ||
      !number(w.startTemperature, 55, 72) ||
      w.requiredPlan !== (w.startTemperature < 64 ? 'steady' : 'precool') ||
      !mode(w.mode) ||
      !integer(w.elapsedMs, 0, 14900) ||
      w.elapsedMs % 100 !== 0 ||
      !integer(w.adjustments, 0, 2) ||
      typeof w.preparing !== 'boolean' ||
      !['steady', 'precool'].includes(w.requiredPlan as string) ||
      !discoveries.includes('thermal-model')
    )
      return false;
    if (w.preparing) {
      if (
        w.mode !== 'decision' ||
        w.elapsedMs !== 0 ||
        w.adjustments !== 0 ||
        ops.cooldownMs !== 0
      )
        return false;
    } else if (
      w.elapsedMs + ops.cooldownMs !== 60000 ||
      (w.adjustments === 0 && w.elapsedMs > 6000) ||
      (w.adjustments === 1 && (w.elapsedMs < 3000 || w.elapsedMs > 11000)) ||
      (w.adjustments === 2 && w.elapsedMs < 8000)
    )
      return false;
  }
  if (
    ops.fanCurve &&
    (!ops.heatObserved || !discoveries.includes('thermal-model'))
  )
    return false;
  if (
    !reached &&
    (ops.power !== 0 ||
      ops.clock !== 'standard' ||
      ops.temperature !== 30 ||
      ops.heatObserved ||
      ops.fanCurve ||
      ops.window !== null ||
      ops.cooldownMs !== 0)
  )
    return false;
  return true;
}

function validWorkstation(
  value: unknown,
  elapsedMs: number,
): value is WorkstationState {
  const w = record(value),
    r = record(w?.research);
  if (
    !w ||
    typeof w.reached !== 'boolean' ||
    (w.transitionMs !== null &&
      (!integer(w.transitionMs, 0, elapsedMs) || w.transitionMs % 100 !== 0)) ||
    w.reached !== (w.transitionMs !== null) ||
    !r ||
    !integer(r.points, 0, 1e12) ||
    !integer(r.earned, 0, 1e12) ||
    !number(r.progress, 0, 1) ||
    r.progress >= 1 ||
    typeof r.proteinMilestone !== 'boolean' ||
    typeof r.profile !== 'string' ||
    !Object.hasOwn(profiles, r.profile)
  )
    return false;
  const tuning = record(r.tuning),
    saved = record(r.savedProfiles);
  const ids = (
    value: unknown,
    kind: 'discovery' | 'tuning',
  ): value is ResearchId[] =>
    Array.isArray(value) &&
    new Set(value).size === value.length &&
    value.every(
      (id) =>
        typeof id === 'string' &&
        Object.hasOwn(researchNodes, id) &&
        researchNodes[id as ResearchId].kind === kind,
    );
  if (
    !ids(r.discoveries, 'discovery') ||
    !ids(r.enabled, 'tuning') ||
    !tuning ||
    !saved
  )
    return false;
  if (!validOperations(w.operations, w.reached, r.discoveries)) return false;
  let spent = 0;
  for (const id of r.discoveries) {
    const node = researchNodes[id];
    if (node.requires && !r.discoveries.includes(node.requires)) return false;
    spent += node.cost;
  }
  for (const [id, value] of Object.entries(tuning)) {
    const paid = record(value);
    if (
      !Object.hasOwn(researchNodes, id) ||
      researchNodes[id as ResearchId].kind !== 'tuning' ||
      !paid ||
      paid.paid !== researchNodes[id as ResearchId].cost
    )
      return false;
    const requirement = researchNodes[id as ResearchId].requires;
    if (requirement && !r.discoveries.includes(requirement)) return false;
    spent += paid.paid as number;
  }
  if (
    r.points + spent !== r.earned ||
    !r.enabled.every((id) => Object.hasOwn(tuning, id))
  )
    return false;
  for (const [id, value] of Object.entries(saved)) {
    const profile = record(value);
    if (
      !Object.hasOwn(profiles, id) ||
      !profile ||
      !['selected', 'cash', 'value', 'milestone'].includes(
        profile.queue as string,
      ) ||
      !ids(profile.tuning, 'tuning') ||
      !['eco', 'standard'].includes(profile.clock as string)
    )
      return false;
  }
  if (w.reached)
    return (
      r.earned >= 5 &&
      (!r.proteinMilestone || r.discoveries.includes('parallel-library'))
    );
  return (
    r.earned === 0 &&
    r.progress === 0 &&
    !r.proteinMilestone &&
    r.profile === 'balanced' &&
    Object.keys(saved).length === 0
  );
}

function validState(value: unknown): value is GameState {
  const s = record(value);
  if (
    !s ||
    !integer(s.seed, 0, 4294967295) ||
    !integer(s.rng, 0, 4294967295) ||
    !integer(s.elapsedMs) ||
    s.elapsedMs % 100 !== 0 ||
    !number(s.pendingMs, 0, 99.999999999) ||
    !integer(s.cash, 0, 1e12) ||
    !integer(s.completedJobs, 0, 1e9) ||
    !mode(s.inputMode)
  )
    return false;
  if (!validWorkstation(s.workstation, s.elapsedMs)) return false;
  const work = s.workstation;
  const home = record(s.home);
  if (
    !home ||
    typeof home.reached !== 'boolean' ||
    typeof home.wideBus !== 'boolean' ||
    !integer(home.storage, 0, work.reached ? 6 : home.reached ? 4 : 1) ||
    !integer(
      home.gpu,
      0,
      home.reached && home.storage >= 2 ? (work.reached ? 6 : 4) : 0,
    ) ||
    !integer(home.cooling, 0, home.gpu > 0 ? (work.reached ? 5 : 3) : 0) ||
    typeof home.selectedJob !== 'string' ||
    !Object.hasOwn(jobs, home.selectedJob) ||
    (home.transitionMs !== null &&
      !integer(home.transitionMs, 0, s.elapsedMs)) ||
    home.reached !== (home.transitionMs !== null)
  )
    return false;
  const queue = record(home.queue),
    completed = record(queue?.completed);
  if (
    !queue ||
    typeof queue.unlocked !== 'boolean' ||
    !['selected', 'cash', 'value', 'milestone'].includes(
      queue.policy as string,
    ) ||
    (queue.nextBatch !== null &&
      (typeof queue.nextBatch !== 'string' ||
        !Object.hasOwn(jobs, queue.nextBatch))) ||
    !completed ||
    !Object.entries(completed).every(
      ([id, count]) =>
        Object.hasOwn(jobs, id) && integer(count, 0, s.completedJobs as number),
    ) ||
    (!queue.unlocked &&
      (queue.policy !== 'selected' || queue.nextBatch !== null))
  )
    return false;
  const software = record(home.software);
  if (
    !software ||
    !['free', 'lease', 'owned'].includes(software.plan as string) ||
    !['ownsPermanent', 'active', 'offered', 'promotionalScore'].every(
      (key) => typeof software[key] === 'boolean',
    ) ||
    !integer(software.renewalMs, 0, 60000) ||
    software.renewalMs % 100 !== 0 ||
    (!home.reached &&
      (software.plan !== 'free' ||
        software.offered ||
        software.promotionalScore ||
        software.ownsPermanent)) ||
    (software.plan === 'free' &&
      (software.active || software.renewalMs !== 0)) ||
    (software.plan === 'owned' &&
      (!software.active ||
        !software.ownsPermanent ||
        software.renewalMs !== 0)) ||
    (software.plan === 'lease' &&
      (software.ownsPermanent || software.renewalMs === 0)) ||
    (software.plan !== 'free' && !software.offered)
  )
    return false;
  const hardware = record(s.hardware),
    automation = record(s.automation),
    milestones = record(s.milestones),
    settings = record(s.settings);
  if (
    !hardware ||
    !integer(hardware.cpu, 0, work.reached ? 16 : home.reached ? 12 : 6) ||
    !integer(hardware.ram, 0, work.reached ? 12 : home.reached ? 8 : 6) ||
    !automation ||
    typeof automation.unlocked !== 'boolean' ||
    typeof automation.enabled !== 'boolean' ||
    (automation.enabled && !automation.unlocked)
  )
    return false;
  if (
    (work.reached &&
      (!queue.unlocked ||
        hardware.cpu < 12 ||
        hardware.ram < 8 ||
        home.storage < 4 ||
        home.gpu < 4 ||
        home.cooling < 3 ||
        (work.transitionMs as number) < (home.transitionMs as number))) ||
    work.research.proteinMilestone !==
      ((completed.protein as number) ?? 0) > 0 ||
    (work.operations.fanCurve &&
      (hardware.cpu < 14 ||
        hardware.ram < 10 ||
        home.cooling < 4 ||
        work.operations.power < 1)) ||
    (home.wideBus &&
      (hardware.cpu < 6 ||
        hardware.ram < 4 ||
        home.storage < 1 ||
        !automation.unlocked)) ||
    (home.reached && !home.wideBus) ||
    (home.storage > 0 && !automation.unlocked) ||
    (queue.unlocked &&
      (!home.reached ||
        hardware.cpu < 8 ||
        hardware.ram < 5 ||
        home.storage < 2))
  )
    return false;
  if (
    !settings ||
    typeof settings.sound !== 'boolean' ||
    typeof settings.motionPaused !== 'boolean' ||
    !number(settings.volume, 0, 1)
  )
    return false;
  if (
    !milestones ||
    !['firstJobMs', 'firstPurchaseMs', 'automationMs'].every(
      (key) =>
        milestones[key] === null ||
        (integer(milestones[key], 0, s.elapsedMs as number) &&
          (milestones[key] as number) % 100 === 0),
    )
  )
    return false;
  if (
    s.completedJobs > 0 !== (milestones.firstJobMs !== null) ||
    hardware.cpu + hardware.ram > 0 !== (milestones.firstPurchaseMs !== null) ||
    automation.unlocked !== (milestones.automationMs !== null)
  )
    return false;
  if (typeof s.message !== 'string' || !Object.hasOwn(gameMessages, s.message))
    return false;
  const journal = record(s.journal);
  if (
    !journal ||
    !Array.isArray(journal.entries) ||
    journal.entries.length > Object.keys(journalEntries).length ||
    !integer(journal.holdMs, 0, 10000) ||
    journal.holdMs % 100 !== 0 ||
    !Array.isArray(journal.pending)
  )
    return false;
  const historyIds = new Set<string>();
  for (const value of journal.entries) {
    const entry = record(value);
    if (
      !entry ||
      typeof entry.id !== 'string' ||
      !Object.hasOwn(journalEntries, entry.id) ||
      historyIds.has(entry.id) ||
      (entry.at !== null &&
        (!integer(entry.at, 0, s.elapsedMs) || entry.at % 100 !== 0))
    )
      return false;
    historyIds.add(entry.id);
  }
  if (
    !historyIds.has('opening') ||
    !historyIds.has(s.message) ||
    new Set(journal.pending).size !== journal.pending.length ||
    !journal.pending.every(
      (id) =>
        typeof id === 'string' &&
        id !== s.message &&
        isCriticalMessage(id) &&
        historyIds.has(id),
    )
  )
    return false;
  if (s.job !== null) {
    const job = record(s.job);
    if (
      !job ||
      typeof job.id !== 'string' ||
      !Object.hasOwn(jobs, job.id) ||
      (job.id === 'logo' && home.gpu < 1) ||
      (job.id === 'protein' &&
        !work.research.discoveries.includes('parallel-library')) ||
      !number(job.work, 0, jobs[job.id as JobId].work - 1e-9) ||
      !number(job.setupRemainingMs, 0, jobs[job.id as JobId].setupMs) ||
      !integer(job.elapsedMs, 0, s.elapsedMs) ||
      job.elapsedMs % 100 !== 0 ||
      !mode(job.mode) ||
      (job.workload !== 'cache' && job.workload !== 'stream') ||
      typeof job.attempted !== 'boolean' ||
      ![0, 0.25, 0.5].includes(job.bonus as number) ||
      (!job.attempted && job.bonus !== 0)
    )
      return false;
  }
  if (s.benchmark !== null) {
    const benchmark = record(s.benchmark);
    if (
      !benchmark ||
      !['payroll', 'memory', 'heat'].includes(benchmark.id as string)
    )
      return false;
    if (benchmark.id === 'heat') {
      if (
        !['eco', 'standard'].includes(benchmark.strategy as string) ||
        !['running', 'overheated', 'cooling'].includes(
          benchmark.result as string,
        ) ||
        !number(benchmark.temperature, 30, 200) ||
        !number(benchmark.work, 0, thermal.heat.work) ||
        !work.reached ||
        !work.operations.heatObserved ||
        work.operations.fanCurve ||
        !work.research.discoveries.includes('thermal-model') ||
        hardware.cpu < 14 ||
        hardware.ram < 10 ||
        home.cooling < 4 ||
        work.operations.power < 1 ||
        (benchmark.result === 'running' &&
          benchmark.work === thermal.heat.work) ||
        (benchmark.result === 'overheated' &&
          (benchmark.work !== thermal.heat.work ||
            benchmark.temperature <= 70)) ||
        (benchmark.result === 'cooling' &&
          (benchmark.work !== thermal.heat.work ||
            benchmark.temperature <= 70 ||
            thermalFactors(s as GameState).equilibrium > 70))
      )
        return false;
      return true;
    }
    if (benchmark.strategy !== 'pages' && benchmark.strategy !== 'whole')
      return false;
    const target = (
      benchmark.id === 'payroll' ? opening.payroll : homeContent.memory
    ).strategies[benchmark.strategy];
    if (!number(benchmark.work, 0, target.work - 1e-9)) return false;
    if (benchmark.id === 'payroll') {
      if (
        automation.unlocked ||
        hardware.cpu < 3 ||
        hardware.ram < 2 ||
        4 + 4 * hardware.ram < target.memory
      )
        return false;
    } else if (
      !home.reached ||
      !automation.unlocked ||
      queue.unlocked ||
      hardware.cpu < 8 ||
      hardware.ram < 5 ||
      home.storage < 2 ||
      (4 + 4 * hardware.ram < target.memory && benchmark.work !== 0)
    )
      return false;
  }
  return true;
}

export function encodeSave(state: GameState): string {
  return JSON.stringify({
    schemaVersion: 8,
    gameVersion: '0.3.0',
    savedAt: new Date().toISOString(),
    state,
  });
}

export function decodeSave(raw: string): Result {
  if (raw.length > 1000000)
    return { ok: false, error: 'Save exceeds the supported size.' };
  try {
    const envelope = record(JSON.parse(raw));
    if (
      !envelope ||
      ![1, 2, 3, 4, 5, 6, 7, 8].includes(envelope.schemaVersion as number)
    )
      return {
        ok: false,
        error: 'Unsupported save version. Keep this file for recovery.',
      };
    if (envelope.schemaVersion === 1) {
      const legacy = record(envelope.state);
      const hardware = record(legacy?.hardware);
      const job = legacy?.job === null ? null : record(legacy?.job);
      if (
        !legacy ||
        legacy.home !== undefined ||
        !hardware ||
        !integer(hardware.cpu, 0, 6) ||
        !integer(hardware.ram, 0, 6) ||
        (legacy.job !== null && (!job || job.id !== 'household-ledger'))
      )
        return {
          ok: false,
          error:
            'Legacy save failed validation. The original has been preserved.',
        };
      envelope.state = {
        ...legacy,
        home: newHome(),
        job: job ? { ...job, setupRemainingMs: 0 } : null,
      };
    }
    if ((envelope.schemaVersion as number) < 3) {
      const previous = record(envelope.state),
        previousHome = record(previous?.home);
      if (!previous || !previousHome)
        return { ok: false, error: 'Save data failed validation.' };
      const benchmark =
        previous.benchmark === null ? null : record(previous.benchmark);
      if (previous.benchmark !== null && !benchmark)
        return { ok: false, error: 'Save data failed validation.' };
      envelope.state = {
        ...previous,
        home: { ...previousHome, queue: newQueue() },
        benchmark: benchmark ? { ...benchmark, id: 'payroll' } : null,
      };
    }
    if ((envelope.schemaVersion as number) < 4) {
      const previous = record(envelope.state),
        previousHome = record(previous?.home);
      if (!previous || !previousHome)
        return { ok: false, error: 'Save data failed validation.' };
      envelope.state = {
        ...previous,
        home: { ...previousHome, gpu: 0, cooling: 0 },
      };
    }
    if ((envelope.schemaVersion as number) < 5) {
      const previous = record(envelope.state),
        previousHome = record(previous?.home);
      if (!previous || !previousHome)
        return { ok: false, error: 'Save data failed validation.' };
      envelope.state = {
        ...previous,
        home: { ...previousHome, software: newSoftware() },
      };
    }
    if ((envelope.schemaVersion as number) < 6) {
      const previous = record(envelope.state);
      if (!previous)
        return { ok: false, error: 'Save data failed validation.' };
      envelope.state = {
        ...previous,
        journal: legacyJournal(previous as GameState),
      };
    }
    if ((envelope.schemaVersion as number) < 7) {
      const previous = record(envelope.state);
      if (!previous)
        return { ok: false, error: 'Save data failed validation.' };
      envelope.state = { ...previous, workstation: newWorkstation() };
    }
    if ((envelope.schemaVersion as number) < 8) {
      const previous = record(envelope.state),
        work = record(previous?.workstation),
        research = record(work?.research),
        saved = record(research?.savedProfiles);
      if (!previous || !work || !research || !saved)
        return { ok: false, error: 'Save data failed validation.' };
      const profiles = Object.fromEntries(
        Object.entries(saved).map(([id, value]) => [
          id,
          { ...record(value), clock: 'standard' },
        ]),
      );
      envelope.state = {
        ...previous,
        workstation: {
          ...work,
          operations: newOperations(),
          research: { ...research, savedProfiles: profiles },
        },
      };
    }
    if (
      typeof envelope.gameVersion !== 'string' ||
      typeof envelope.savedAt !== 'string' ||
      !Number.isFinite(Date.parse(envelope.savedAt)) ||
      !validState(envelope.state)
    )
      return {
        ok: false,
        error: 'Save data failed validation. The original has been preserved.',
      };
    return { ok: true, state: envelope.state };
  } catch {
    return {
      ok: false,
      error: 'Save is not valid JSON. The original has been preserved.',
    };
  }
}

export type LoadedSave = {
  status: 'new' | 'loaded' | 'recovered' | 'invalid' | 'unavailable';
  state: GameState | null;
  message: string;
  rejected: string | null;
};

export function loadSave(storage: SaveStorage): LoadedSave {
  try {
    const primary = storage.getItem(SAVE_KEY);
    const backup = storage.getItem(BACKUP_KEY);
    if (primary === null && backup === null)
      return {
        status: 'new',
        state: null,
        message: 'New game',
        rejected: null,
      };
    if (primary !== null) {
      const parsed = decodeSave(primary);
      if (parsed.ok)
        return {
          status: 'loaded',
          state: parsed.state,
          message: 'Save restored',
          rejected: null,
        };
    }
    if (backup !== null) {
      const parsed = decodeSave(backup);
      if (parsed.ok)
        return {
          status: 'recovered',
          state: parsed.state,
          message: 'Recovered the last valid backup. Export it from Settings.',
          rejected: primary,
        };
    }
    return {
      status: 'invalid',
      state: null,
      message:
        'The saved game could not be read. Export the original, import a valid save, or explicitly start a new game.',
      rejected: primary ?? backup,
    };
  } catch {
    return {
      status: 'unavailable',
      state: null,
      message:
        'Storage is unavailable. Progress stays in this tab; export it before closing.',
      rejected: null,
    };
  }
}

export function persistSave(
  storage: SaveStorage,
  state: GameState,
): { ok: true } | { ok: false; error: string } {
  try {
    const previous = storage.getItem(SAVE_KEY);
    if (previous !== null)
      storage.setItem(
        decodeSave(previous).ok ? BACKUP_KEY : REJECTED_KEY,
        previous,
      );
    storage.setItem(SAVE_KEY, encodeSave(state));
    return { ok: true };
  } catch {
    return {
      ok: false,
      error:
        'Unsaved — storage write failed. Your progress is still in memory. Export or retry saving.',
    };
  }
}

// A useful read-only save summary for import confirmation; no engine mutation occurs here.
export function saveSummary(state: GameState) {
  return `$${state.cash} · CPU ${state.hardware.cpu} · RAM ${state.hardware.ram} · ${state.completedJobs} Jobs · ${computeFor(state).effective.toFixed(2)} Compute/s`;
}
