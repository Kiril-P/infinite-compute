import {
  thermal,
  type ClockMode,
  type ThermalPlan,
  type HeatAttempt,
} from '../content/thermal';
import {
  thermalFactors,
  thermalSummary,
  heatBlocker,
  startThermalWindow,
  chooseThermalPlan,
  adjustThermalWindow,
  advanceOperations,
  advanceTemperature,
} from './thermal';
import {
  newWorkstation,
  workstation,
  type WorkstationState,
  type ResearchId,
  type ProfileId,
  type TuningId,
} from '../content/workstation';
import {
  allocate,
  advanceResearch,
  earnResearch,
  researchEffects,
  researchSummary,
  workstationBlocker,
  buyResearch,
  recompile,
  applyProfile,
  saveProfile,
} from './research';
import {
  newJournal,
  recordEntry,
  recordMessage,
  advanceJournal,
  type JournalState,
} from './journal';
import type { MessageId } from '../content/journal';
import {
  gameMessages,
  home,
  jobs,
  newHome,
  type HomeState,
  type JobId,
  type QueuePolicy,
} from '../content/home';
import {
  hardwareCost,
  opening,
  type HardwareId,
  type InputMode,
  type Strategy,
} from '../content/opening';
import { software, type SoftwarePlan } from '../content/software';

export type Job = {
  id: JobId;
  setupRemainingMs: number;
  work: number;
  elapsedMs: number;
  mode: InputMode;
  workload: Strategy;
  attempted: boolean;
  bonus: 0 | 0.25 | 0.5;
};

export type GameState = {
  journal: JournalState;
  seed: number;
  rng: number;
  elapsedMs: number;
  pendingMs: number;
  cash: number;
  hardware: Record<HardwareId, number>;
  home: HomeState;
  workstation: WorkstationState;
  completedJobs: number;
  job: Job | null;
  inputMode: InputMode;
  settings: { sound: boolean; volume: number; motionPaused: boolean };
  benchmark:
    | {
        id: 'payroll' | 'memory';
        strategy: PayrollStrategy;
        work: number;
      }
    | HeatAttempt
    | null;
  automation: { unlocked: boolean; enabled: boolean };
  message: keyof typeof gameMessages;
  milestones: {
    firstJobMs: number | null;
    firstPurchaseMs: number | null;
    automationMs: number | null;
  };
};

export type PayrollStrategy = keyof typeof opening.payroll.strategies;

export type GameCommand =
  | { type: 'buy-power' }
  | { type: 'set-clock'; clock: ClockMode }
  | { type: 'start-thermal-window' }
  | { type: 'choose-thermal-plan'; plan: ThermalPlan }
  | { type: 'adjust-thermal-window' }
  | { type: 'start-heat-soak'; strategy: ClockMode }
  | { type: 'transition-workstation' }
  | { type: 'buy-research'; id: ResearchId }
  | { type: 'recompile' }
  | { type: 'apply-profile'; profile: ProfileId }
  | { type: 'save-profile'; profile: ProfileId }
  | { type: 'set-tuning'; id: TuningId; enabled: boolean }
  | { type: 'inspect-case' }
  | { type: 'set-software'; plan: SoftwarePlan }
  | { type: 'inspect-software' }
  | { type: 'retry-software' }
  | { type: 'set-promotional-score'; enabled: boolean }
  | { type: 'configure'; settings: Partial<GameState['settings']> }
  | { type: 'start-job' }
  | { type: 'start-memory-test'; strategy: PayrollStrategy }
  | { type: 'set-queue-policy'; policy: QueuePolicy }
  | { type: 'prioritize-batch'; id: JobId }
  | { type: 'select-job'; id: JobId }
  | { type: 'buy-storage' }
  | { type: 'buy-home-part'; part: 'gpu' | 'cooling' }
  | { type: 'buy-wide-bus' }
  | { type: 'transition-home' }
  | { type: 'start-benchmark'; strategy: PayrollStrategy }
  | { type: 'exit-benchmark' }
  | { type: 'set-auto-run'; enabled: boolean }
  | { type: 'attempt-timing' }
  | { type: 'choose-strategy'; strategy: Strategy }
  | { type: 'set-input-mode'; mode: InputMode }
  | { type: 'buy-hardware'; part: HardwareId };

export type GameEvent = { type: string; at: number; detail: string };

export function computeFor(state: GameState) {
  const effects = researchEffects(state);
  const thermals = thermalFactors(state);
  const scale = state.workstation.reached ? workstation.computeScale : 1;
  const cpu =
    (1 + 0.5 * state.hardware.cpu) *
    (state.home.reached ? home.cpuScale : 1) *
    (state.home.wideBus ? 1.5 : 1) *
    scale *
    effects.cpu;
  const graphics =
    state.home.gpu * 150 * (state.home.wideBus ? 1.5 : 1) * scale * effects.gpu;
  const airflowFactor = Math.max(
    0.7,
    1 /
      (1 +
        0.15 *
          Math.max(
            0,
            state.home.gpu -
              (state.benchmark?.id === 'heat'
                ? thermal.heat.cooling
                : state.home.cooling) -
              1,
          )),
  );
  const memoryFactor = Math.min(
    1,
    effects.memory *
      Math.max(
        0.7,
        1 - 0.05 * Math.max(0, state.hardware.cpu - state.hardware.ram - 1),
      ),
  );
  const operationFactor =
    thermals.speed * thermals.powerFactor * thermals.thermalFactor;
  return {
    raw: (cpu + graphics) * thermals.speed,
    powerFactor: thermals.powerFactor,
    thermalFactor: thermals.thermalFactor,
    cpu: cpu * memoryFactor * operationFactor,
    graphics: graphics * airflowFactor * memoryFactor * operationFactor,
    airflowFactor,
    memoryFactor,
    effective:
      (cpu + graphics * airflowFactor) * memoryFactor * operationFactor,
    memory: 4 + 4 * state.hardware.ram,
  };
}

export function jobCompute(state: GameState, id: JobId) {
  const capacity = computeFor(state);
  return allocate(state, capacity, graphicsCompatibility(id), true).jobs;
}
function graphicsCompatibility(id: JobId) {
  return id === 'logo' || id === 'protein' ? 1 : 0.15;
}
export function liveAllocation(state: GameState) {
  return allocate(
    state,
    computeFor(state),
    graphicsCompatibility(state.job?.id ?? 'household-ledger'),
    !!state.job && state.job.setupRemainingMs <= 0,
  );
}
export function jobSetupMs(state: GameState, id: JobId) {
  return (
    (jobs[id].setupMs / (1 + state.home.storage)) * researchEffects(state).setup
  );
}
export function storageCost(state: GameState) {
  return (
    home.storageCost(state.home.storage, state.home.reached) *
    (state.workstation.reached ? workstation.priceScale : 1)
  );
}
export function storageCap(state: GameState) {
  return state.workstation.reached ? 6 : state.home.reached ? 4 : 1;
}
export function homePartCost(state: GameState, part: 'gpu' | 'cooling') {
  return (
    home.parts[part].cost(state.home[part]) *
    (state.workstation.reached ? workstation.priceScale : 1)
  );
}
export function homePartCap(state: GameState, part: 'gpu' | 'cooling') {
  return home.parts[part].cap + (state.workstation.reached ? 2 : 0);
}
export function jobPayout(state: GameState, id: JobId, bonus = 0) {
  return Math.round(
    jobs[id].reward *
      (1 + bonus) *
      (state.home.software.active ? software.multiplier : 1),
  );
}
export function homePartBlocker(
  state: GameState,
  part: 'gpu' | 'cooling',
): string | null {
  if (!state.home.reached || state.home.storage < 2)
    return 'Needs Home PC and Storage 2.';
  if (part === 'cooling' && state.home.gpu < 1)
    return 'Install the first GPU to add cooling.';
  return null;
}

export function jobBlocker(state: GameState, id: JobId): string | null {
  if (
    id === 'protein' &&
    !state.workstation.research.discoveries.includes('parallel-library')
  )
    return 'Discover Parallel Library in Research Lab.';
  if (id === 'logo' && state.home.gpu < 1)
    return 'Install GPU 1 to render spinning logos.';
  if (id === 'photo' && state.home.storage < 1)
    return 'Buy Storage 1 to decode photographs.';
  if (id === 'wonder' && !state.home.reached)
    return 'The peripheral needs a Home PC.';
  const needed = jobs[id].memory;
  if (computeFor(state).memory < needed)
    return `Needs ${needed} MB RAM; you have ${computeFor(state).memory} MB.`;
  return null;
}
export function homeBlocker(state: GameState): string | null {
  if (!state.automation.unlocked) return 'Complete Safe Mode Payroll first.';
  if (
    state.hardware.cpu < 6 ||
    state.hardware.ram < 4 ||
    state.home.storage < 1
  )
    return `Needs CPU 6, RAM 4 and Storage 1 (owned ${state.hardware.cpu}, ${state.hardware.ram}, ${state.home.storage}).`;
  return null;
}
export function componentCost(state: GameState, part: HardwareId) {
  return Math.ceil(
    hardwareCost(part, state.hardware[part]) *
      (state.home.reached ? home.priceScale : 1) *
      (state.workstation.reached ? workstation.priceScale : 1),
  );
}
export function componentCap(state: GameState, part: HardwareId) {
  if (state.workstation.reached) return part === 'cpu' ? 16 : 12;
  return state.home.reached
    ? part === 'cpu'
      ? 12
      : 8
    : opening.hardware[part].cap;
}
export function jobDurationMs(state: GameState, id: JobId) {
  const item = jobs[id];
  return (
    Math.ceil(jobSetupMs(state, id) / 100) * 100 +
    Math.max(100, Math.ceil((item.work / jobCompute(state, id)) * 10) * 100)
  );
}

export function memoryBlocker(state: GameState): string | null {
  if (state.home.queue.unlocked)
    return 'Memory Pressure Test already completed.';
  if (
    !state.home.reached ||
    state.hardware.cpu < 8 ||
    state.hardware.ram < 5 ||
    state.home.storage < 2
  )
    return `Needs Home PC, CPU 8, RAM 5 and Storage 2 (owned ${state.hardware.cpu}, ${state.hardware.ram}, ${state.home.storage}).`;
  return null;
}
export function benchmarkRules(state: GameState) {
  return state.benchmark?.id === 'heat'
    ? thermal.heat
    : state.benchmark?.id === 'memory'
      ? home.memory
      : opening.payroll;
}
export function queueChoice(state: GameState): JobId {
  if (state.home.queue.nextBatch) return state.home.queue.nextBatch;
  if (!state.home.queue.unlocked || state.home.queue.policy === 'selected')
    return state.home.selectedJob;
  const available = (Object.keys(jobs) as JobId[]).filter(
    (id) => !jobBlocker(state, id),
  );
  const score = (id: JobId) =>
    state.home.queue.policy === 'value'
      ? jobPayout(state, id)
      : state.home.queue.policy === 'milestone'
        ? (state.home.queue.completed[id] ? 0 : 1e6) +
          jobPayout(state, id) / jobDurationMs(state, id)
        : jobPayout(state, id) / jobDurationMs(state, id);
  return available.sort((a, b) => score(b) - score(a))[0] ?? 'household-ledger';
}

export function payrollBlocker(
  state: GameState,
  strategy: PayrollStrategy,
): string | null {
  if (state.automation.unlocked) return 'Safe Mode Payroll already completed.';
  if (state.hardware.cpu < 3 || state.hardware.ram < 2)
    return `Needs CPU 3 and RAM 2 (owned: CPU ${state.hardware.cpu}, RAM ${state.hardware.ram}).`;
  const memory = opening.payroll.strategies[strategy].memory;
  if (computeFor(state).memory < memory)
    return `Needs ${memory} MB; buy RAM 3 or choose Small pages.`;
  return null;
}

function newState(seed: number): GameState {
  return {
    journal: newJournal(),
    seed: seed >>> 0,
    rng: seed >>> 0,
    elapsedMs: 0,
    pendingMs: 0,
    cash: 0,
    hardware: { cpu: 0, ram: 0 },
    home: newHome(),
    workstation: newWorkstation(),
    completedJobs: 0,
    job: null,
    inputMode: 'timing',
    settings: { sound: false, volume: 0.2, motionPaused: false },
    benchmark: null,
    automation: { unlocked: false, enabled: false },
    message: 'opening',
    milestones: { firstJobMs: null, firstPurchaseMs: null, automationMs: null },
  };
}

export function createGame({
  seed = 1,
  state: restored,
}: { seed?: number; state?: GameState } = {}) {
  // Hydration accepts validated state only; the persistence module owns validation.
  const state = restored ? structuredClone(restored) : newState(seed);
  let events: GameEvent[] = [];
  const emit = (type: string, detail: string) =>
    events.push({ type, at: state.elapsedMs, detail });
  const announce = (id: MessageId) => {
    const display = recordMessage(state.journal, id, state.elapsedMs);
    if (display) state.message = display;
  };
  const remember = (id: Parameters<typeof recordEntry>[1]) =>
    recordEntry(state.journal, id, state.elapsedMs);
  const offerSoftware = () => {
    if (!state.home.software.offered) {
      state.home.software.offered = true;
      announce('softwareOffer');
      emit('software-offered', 'Renewal Systems');
    }
  };
  const renewSoftware = () => {
    const plan = state.home.software;
    const wasActive = plan.active;
    plan.active = state.cash >= software.renewalCost;
    if (plan.active) state.cash -= software.renewalCost;
    plan.renewalMs = software.intervalMs;
    if (!plan.active && wasActive) announce('softwareSuspended');
    if (plan.active && !wasActive) announce('softwareResumed');
    emit('software-renewal', plan.active ? 'Paid $600' : 'Suspended; no debt');
  };
  const startJob = () => {
    if (state.job || state.benchmark) return;
    state.rng = (Math.imul(state.rng, 1664525) + 1013904223) >>> 0;
    const preferred = queueChoice(state);
    const id = jobBlocker(state, preferred) ? 'household-ledger' : preferred;
    if (id === state.home.queue.nextBatch) state.home.queue.nextBatch = null;
    state.job = {
      id,
      setupRemainingMs: jobSetupMs(state, id),
      work: 0,
      elapsedMs: 0,
      mode: state.inputMode,
      workload: state.rng % 2 === 0 ? 'cache' : 'stream',
      attempted: false,
      bonus: 0,
    };
    emit('job-started', id);
  };
  return {
    getState: (): GameState => structuredClone(state),
    getSnapshot() {
      return {
        state: structuredClone(state),
        compute: computeFor(state),
        allocation: liveAllocation(state),
        research: researchSummary(state),
        thermal: thermalSummary(state),
        cursor: state.job ? (state.job.elapsedMs % 2400) / 2400 : 0,
        queueChoice: queueChoice(state),
        jobs: (Object.keys(jobs) as JobId[]).map((id) => ({
          ...jobs[id],
          reward: jobPayout(state, id),
          durationMs: jobDurationMs(state, id),
          compute: jobCompute(state, id),
          blocker: jobBlocker(state, id),
        })),
        hardware: (['cpu', 'ram'] as const).map((id) => ({
          id,
          ...opening.hardware[id],
          level: state.hardware[id],
          cost: componentCost(state, id),
          cap: componentCap(state, id),
          breakpoint: state.home.reached
            ? state.home.queue.unlocked
              ? id === 'cpu'
                ? 12
                : 8
              : id === 'cpu'
                ? 8
                : 5
            : opening.hardware[id].breakpoint,
          next: state.home.reached
            ? state.home.queue.unlocked
              ? 'Prepare the workstation'
              : 'Prepare Memory Pressure Test'
            : opening.hardware[id].next,
          nextChassis: state.home.reached
            ? id === 'cpu'
              ? 'CPU 12'
              : 'RAM 8'
            : id === 'cpu'
              ? 'CPU 6'
              : 'RAM 4',
        })),
      };
    },
    dispatch(command: GameCommand): GameEvent[] {
      events = [];
      if (
        state.benchmark &&
        command.type !== 'exit-benchmark' &&
        command.type !== 'set-auto-run' &&
        command.type !== 'configure'
      )
        return events;
      switch (command.type) {
        case 'buy-power': {
          const ops = state.workstation.operations,
            cost = thermal.power.cost(ops.power);
          if (
            !state.workstation.reached ||
            ops.power >= thermal.power.cap ||
            state.cash < cost
          )
            break;
          state.cash -= cost;
          ops.power++;
          announce('power');
          emit('hardware-bought', `power:${ops.power}`);
          break;
        }
        case 'set-clock':
          if (state.workstation.reached) {
            state.workstation.operations.clock = command.clock;
            state.workstation.operations.window = null;
            emit('clock-changed', command.clock);
          }
          break;
        case 'start-thermal-window':
          if (startThermalWindow(state)) emit('thermal-window', 'Started');
          break;
        case 'choose-thermal-plan': {
          const result = chooseThermalPlan(state, command.plan);
          if (result === false) announce('thermalMiss');
          if (result !== null)
            emit('thermal-plan', result ? 'Accepted' : 'Boost ended');
          break;
        }
        case 'adjust-thermal-window': {
          const result = adjustThermalWindow(state);
          if (result === false) announce('thermalMiss');
          if (result !== null)
            emit('thermal-adjustment', result ? 'Cooled 4°C' : 'Boost ended');
          break;
        }
        case 'start-heat-soak':
          if (!heatBlocker(state)) {
            state.benchmark = {
              id: 'heat',
              strategy: command.strategy,
              work: 0,
              temperature: state.workstation.operations.temperature,
              result: 'running',
            };
            emit('benchmark-started', 'Heat Soak Certification');
          }
          break;
        case 'transition-workstation':
          if (
            workstationBlocker(state) ||
            state.cash < workstation.transitionCost
          )
            break;
          state.cash -= workstation.transitionCost;
          state.workstation.reached = true;
          state.workstation.transitionMs = state.elapsedMs;
          earnResearch(state, 5);
          announce('workstation');
          emit('era-transition', 'Workstation');
          break;
        case 'buy-research':
          if (buyResearch(state, command.id)) {
            if (command.id === 'thermal-model') announce('thermalModel');
            if (command.id === 'open-interconnect') announce('interconnect');
            if (command.id === 'parallel-library') announce('parallelLibrary');
            if (command.id === 'queue-compiler') announce('queueCompiler');
            emit('research-bought', command.id);
          }
          break;
        case 'recompile':
          if (recompile(state)) {
            announce('recompiled');
            emit('recompiled', 'Tuning refunded; discoveries retained.');
          }
          break;
        case 'apply-profile':
          if (applyProfile(state, command.profile))
            emit('profile-applied', command.profile);
          break;
        case 'save-profile':
          if (saveProfile(state, command.profile))
            emit('profile-saved', command.profile);
          break;
        case 'set-tuning': {
          const research = state.workstation.research;
          if (!research.tuning[command.id]) break;
          research.enabled = research.enabled.filter((id) => id !== command.id);
          if (command.enabled) research.enabled.push(command.id);
          emit('tuning-changed', command.id);
          break;
        }
        case 'inspect-case':
          if (remember('case-curious')) emit('achievement', 'case-curious');
          break;
        case 'inspect-software':
          if (state.home.reached) offerSoftware();
          break;
        case 'set-promotional-score':
          if (state.home.reached) {
            state.home.software.promotionalScore = command.enabled;
            if (command.enabled) announce('promotionalScore');
            emit(
              'promotional-score',
              command.enabled
                ? 'Cosmetic score enabled'
                : 'Useful view restored',
            );
          }
          break;
        case 'set-software': {
          const plan = state.home.software;
          if (!state.home.reached || plan.plan === command.plan) break;
          const cost =
            command.plan === 'free'
              ? 0
              : command.plan === 'lease'
                ? software.entryCost
                : plan.ownsPermanent
                  ? 0
                  : software.permanentCost;
          if (
            state.cash < cost ||
            (command.plan === 'lease' && plan.ownsPermanent)
          )
            break;
          offerSoftware();
          state.cash -= cost;
          plan.plan = command.plan;
          plan.active = command.plan !== 'free';
          plan.ownsPermanent ||= command.plan === 'owned';
          plan.renewalMs = command.plan === 'lease' ? software.intervalMs : 0;
          announce(
            command.plan === 'free'
              ? 'softwareCancelled'
              : command.plan === 'lease'
                ? 'softwareLease'
                : 'softwareOwned',
          );
          emit('software-plan', command.plan);
          break;
        }
        case 'retry-software':
          if (
            state.home.software.plan === 'lease' &&
            !state.home.software.active &&
            state.cash >= software.renewalCost
          )
            renewSoftware();
          break;
        case 'buy-home-part': {
          const level = state.home[command.part];
          const cost = homePartCost(state, command.part);
          if (
            homePartBlocker(state, command.part) ||
            level >= homePartCap(state, command.part) ||
            state.cash < cost
          )
            break;
          state.cash -= cost;
          state.home[command.part]++;
          announce(command.part);
          if (command.part === 'gpu') offerSoftware();
          emit('hardware-bought', `${command.part}:${level + 1}`);
          break;
        }
        case 'start-memory-test':
          if (!memoryBlocker(state)) {
            state.benchmark = {
              id: 'memory',
              strategy: command.strategy,
              work: 0,
            };
            emit('benchmark-started', 'Memory Pressure Test');
          }
          break;
        case 'set-queue-policy':
          if (state.home.queue.unlocked) {
            state.home.queue.policy = command.policy;
            emit('queue-policy', command.policy);
          }
          break;
        case 'prioritize-batch': {
          if (
            !state.home.queue.unlocked ||
            !state.job ||
            state.job.attempted ||
            jobBlocker(state, command.id)
          )
            break;
          state.job.attempted = true;
          const best = Math.max(
            ...(Object.keys(jobs) as JobId[])
              .filter((id) => !jobBlocker(state, id))
              .map((id) => jobPayout(state, id) / jobDurationMs(state, id)),
          );
          state.job.bonus =
            jobPayout(state, command.id) / jobDurationMs(state, command.id) >=
            best - 1e-9
              ? 0.5
              : 0;
          state.home.queue.nextBatch = command.id;
          emit('batch-prioritized', `${command.id}: bonus ${state.job.bonus}`);
          break;
        }
        case 'select-job':
          state.home.selectedJob = command.id;
          emit('job-selected', command.id);
          break;
        case 'buy-storage': {
          const cost = storageCost(state);
          if (
            !state.automation.unlocked ||
            state.home.storage >= storageCap(state) ||
            state.cash < cost
          )
            break;
          state.cash -= cost;
          state.home.storage++;
          announce('storage');
          emit('storage-bought', `${state.home.storage}`);
          break;
        }
        case 'buy-wide-bus':
          if (
            state.home.wideBus ||
            homeBlocker(state) ||
            state.cash < home.busCost
          )
            break;
          state.cash -= home.busCost;
          state.home.wideBus = true;
          announce('bus');
          emit('wide-bus', 'Raw Compute ×1.5');
          break;
        case 'transition-home':
          if (
            state.home.reached ||
            homeBlocker(state) ||
            !state.home.wideBus ||
            state.cash < home.transitionCost
          )
            break;
          state.cash -= home.transitionCost;
          state.home.reached = true;
          state.home.transitionMs = state.elapsedMs;
          state.home.selectedJob = 'wonder';
          announce('transition');
          remember('home-kept');
          remember('desk-expanded');
          emit('era-transition', 'Home PC');
          break;
        case 'configure':
          state.settings = { ...state.settings, ...command.settings };
          state.settings.volume = Math.max(
            0,
            Math.min(1, state.settings.volume),
          );
          emit('settings', 'Updated');
          break;
        case 'start-job':
          startJob();
          break;
        case 'set-auto-run':
          if (state.automation.unlocked) {
            state.automation.enabled = command.enabled;
            if (command.enabled) startJob();
            emit('auto-run', command.enabled ? 'enabled' : 'paused');
          }
          break;
        case 'start-benchmark':
          if (!payrollBlocker(state, command.strategy)) {
            state.benchmark = {
              id: 'payroll',
              strategy: command.strategy,
              work: 0,
            };
            emit('benchmark-started', command.strategy);
          }
          break;
        case 'exit-benchmark':
          if (state.benchmark) {
            state.benchmark = null;
            emit('benchmark-exited', 'Ordinary work restored.');
          }
          break;
        case 'set-input-mode':
          state.inputMode = command.mode;
          emit('input-mode', command.mode);
          break;
        case 'attempt-timing': {
          const job = state.job;
          if (!job || job.attempted || job.mode !== 'timing') break;
          const cursor = (job.elapsedMs % 2400) / 2400;
          job.attempted = true;
          job.bonus =
            cursor >= 0.38 && cursor <= 0.62
              ? 0.5
              : cursor >= 0.27 && cursor <= 0.73
                ? 0.25
                : 0;
          emit('bonus', `${job.bonus}`);
          break;
        }
        case 'choose-strategy': {
          const job = state.job;
          if (!job || job.attempted || job.mode !== 'decision') break;
          job.attempted = true;
          job.bonus = job.workload === command.strategy ? 0.5 : 0;
          emit('bonus', `${job.bonus}`);
          break;
        }
        case 'buy-hardware': {
          const level = state.hardware[command.part];
          const cost = componentCost(state, command.part);
          if (level >= componentCap(state, command.part) || state.cash < cost)
            break;
          state.cash -= cost;
          state.hardware[command.part]++;
          if (state.milestones.firstPurchaseMs === null) {
            state.milestones.firstPurchaseMs = state.elapsedMs;
            announce('firstPurchase');
          }
          emit('hardware-bought', `${command.part}:${level + 1}`);
          break;
        }
      }
      return events;
    },
    advance(elapsedMs: number): GameEvent[] {
      if (!Number.isFinite(elapsedMs) || elapsedMs < 0 || elapsedMs > 60000)
        throw new RangeError(
          'Advance accepts 0–60000 milliseconds; callers split longer intervals.',
        );
      events = [];
      state.pendingMs += elapsedMs;
      while (state.pendingMs >= 100) {
        state.pendingMs -= 100;
        state.elapsedMs += 100;
        const nextMessage = advanceJournal(state.journal);
        if (nextMessage) state.message = nextMessage;
        if (state.benchmark) {
          const benchmark = state.benchmark;
          if (benchmark.id === 'heat') {
            if (benchmark.result === 'overheated') continue;
            advanceTemperature(state);
            benchmark.work = Math.min(
              thermal.heat.work,
              benchmark.work + computeFor(state).effective / 10,
            );
            if (benchmark.work >= thermal.heat.work) {
              if (benchmark.temperature > thermal.heat.maximumTemperature)
                benchmark.result =
                  thermalFactors(state).equilibrium <=
                  thermal.heat.maximumTemperature
                    ? 'cooling'
                    : 'overheated';
              else {
                state.benchmark = null;
                state.workstation.operations.fanCurve = true;
                earnResearch(state, thermal.heat.researchReward);
                announce('fanCurve');
                emit('benchmark-completed', 'Heat Soak: automatic fan curve.');
              }
            }
            continue;
          }
          const target = (
            benchmark.id === 'memory' ? home.memory : opening.payroll
          ).strategies[benchmark.strategy];
          state.benchmark.work +=
            computeFor(state).memory >= target.memory
              ? computeFor(state).effective / 10
              : 0;
          if (state.benchmark.work + 1e-9 >= target.work) {
            state.benchmark = null;
            if (benchmark.id === 'payroll') {
              state.automation = { unlocked: true, enabled: true };
              state.milestones.automationMs = state.elapsedMs;
              announce('payroll');
              remember('queue-owned');
              emit(
                'benchmark-completed',
                'Safe Mode Payroll: auto-run unlocked.',
              );
            } else {
              state.home.queue.unlocked = true;
              announce('memory');
              remember('memory-mastered');
              emit(
                'benchmark-completed',
                'Memory Pressure Test: queue policy unlocked.',
              );
            }
          }
          continue;
        }
        const operations = advanceOperations(state);
        if (operations.warm) announce('warm');
        if (operations.miss) announce('thermalMiss');
        if (state.automation.enabled && !state.job) startJob();
        if (state.home.gpu > 0) offerSoftware();
        if (state.home.software.plan === 'lease') {
          state.home.software.renewalMs -= 100;
          if (state.home.software.renewalMs <= 0) renewSoftware();
        }
        advanceResearch(state, liveAllocation(state).research / 10);
        if (!state.job) continue;
        state.job.elapsedMs += 100;
        if (state.job.setupRemainingMs > 0) {
          state.job.setupRemainingMs = Math.max(
            0,
            state.job.setupRemainingMs - 100,
          );
          continue;
        }
        const item = jobs[state.job.id];
        state.job.work += jobCompute(state, state.job.id) / 10;
        if (state.job.work + 1e-9 >= item.work) {
          const reward = jobPayout(state, state.job.id, state.job.bonus);
          state.cash += reward;
          state.completedJobs++;
          state.home.queue.completed[state.job.id] =
            (state.home.queue.completed[state.job.id] ?? 0) + 1;
          if (
            state.job.id === 'protein' &&
            !state.workstation.research.proteinMilestone
          ) {
            state.workstation.research.proteinMilestone = true;
            earnResearch(state, 5);
            announce('proteinMilestone');
          }
          if (state.job.id === 'photo') remember('photo-restored');
          if (state.job.id === 'logo') remember('graphics-news');
          if (state.job.id === 'wonder') announce('wonder');
          state.job = null;
          if (state.milestones.firstJobMs === null) {
            state.milestones.firstJobMs = state.elapsedMs;
            announce('firstJob');
            remember('first-result');
          }
          emit('job-completed', `${reward}`);
          if (state.automation.enabled) startJob();
        }
      }
      return events;
    },
  };
}

export type Game = ReturnType<typeof createGame>;
export type GameSnapshot = ReturnType<Game['getSnapshot']>;
