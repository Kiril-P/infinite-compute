import { heatBlocker } from '../game/engine/thermal';
import { workstation } from '../game/content/workstation';
import { workstationBlocker } from '../game/engine/research';
import { home } from '../game/content/home';
import { homeBlocker, memoryBlocker } from '../game/engine/game';
import { opening } from '../game/content/opening';
import type { GameSnapshot } from '../game/engine/game';
import type { ApplicationId } from './navigation';
import type { ObjectiveSummary } from './shell-content';

export const applications: {
  id: ApplicationId;
  title: string;
  glyph: string;
}[] = [
  { id: 'job-runner', title: 'Job Runner', glyph: '>_' },
  { id: 'hardware-manager', title: 'Hardware Manager', glyph: '▦' },
  { id: 'task-manager', title: 'Task Manager', glyph: '≡' },
  { id: 'research-lab', title: 'Research Lab', glyph: 'λ' },
  { id: 'shop', title: 'Shop', glyph: '$' },
  { id: 'settings', title: 'Settings', glyph: '⚙' },
];
export const money = (amount: number) =>
  `$${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
export const seconds = (value: number) => `${Math.max(0, Math.ceil(value))}s`;

export function currentObjective({
  state,
  hardware,
}: GameSnapshot): ObjectiveSummary {
  let outcome: string, description: string, note: string;
  let applicationId: ApplicationId = 'job-runner';
  if (state.completedJobs === 0) {
    outcome = 'Complete your first Job';
    description = 'Household spreadsheet · 12 work · $8 plus an optional bonus';
    note = '0 / 1 completed · reward: Cash';
  } else if (state.hardware.cpu + state.hardware.ram === 0) {
    outcome = 'Buy your first CPU';
    description = `${money(state.cash)} / $20 · +0.5 raw Compute per second`;
    note = 'Faster work · Hardware Manager';
    applicationId = 'hardware-manager';
  } else if (state.hardware.cpu < 3 || state.hardware.ram < 2) {
    outcome = 'Prepare Safe Mode Payroll';
    description = `CPU ${state.hardware.cpu}/3 · RAM ${state.hardware.ram}/2 · Next CPU ${money(hardware[0]!.cost)}, RAM ${money(hardware[1]!.cost)}`;
    note = 'Reward: basic auto-run';
    applicationId = 'hardware-manager';
  } else if (!state.automation.unlocked) {
    outcome = 'Pass Safe Mode Payroll';
    description =
      state.benchmark?.id === 'payroll'
        ? `${Math.floor(state.benchmark.work)} / ${opening.payroll.strategies[state.benchmark.strategy].work} work · bonuses disabled`
        : 'Choose Small pages: 12 MB, 300 work, no timing assistance';
    note = 'Reward: auto-run every following Job';
    applicationId = 'task-manager';
  } else if (!state.home.reached && homeBlocker(state)) {
    outcome = 'Prepare a Home PC';
    description = `CPU ${state.hardware.cpu}/6 · RAM ${state.hardware.ram}/4 · Storage ${state.home.storage}/1`;
    note = 'Storage opens photographs; then the Wide bus and chassis';
    applicationId = 'hardware-manager';
  } else if (!state.home.reached) {
    outcome = state.home.wideBus
      ? 'Move into the Home PC chassis'
      : 'Install the Wide bus';
    description = `${money(state.cash)} / ${money(state.home.wideBus ? home.transitionCost : home.busCost)} · CPU/RAM/Storage ready`;
    note = state.home.wideBus
      ? 'Keeps all progress · ×100 base CPU scale'
      : '×1.5 raw Compute · prepares the next chassis';
    applicationId = 'hardware-manager';
  } else if (!state.home.queue.unlocked) {
    const blocker = memoryBlocker(state);
    outcome = blocker
      ? 'Prepare Memory Pressure Test'
      : 'Pass Memory Pressure Test';
    description =
      blocker ??
      (state.benchmark
        ? `${Math.floor(state.benchmark.work).toLocaleString('en-US')} work · ordinary Job preserved`
        : 'Small pages uses 24 MB. Oversized working sets stall.');
    note = 'Reward: Batch Queue policy';
    applicationId = blocker ? 'hardware-manager' : 'task-manager';
  } else if (state.home.gpu < 1) {
    outcome = 'Install your first GPU';
    description = `${money(state.cash)} / ${money(home.parts.gpu.cost(0))} · Home PC / Storage 2 ready`;
    note = 'Unlocks spinning logos · Hardware → Graphics & cooling';
    applicationId = 'hardware-manager';
  } else if (state.home.cooling < state.home.gpu - 1) {
    outcome = 'Restore graphics airflow';
    description = `Cooling ${state.home.cooling} / ${state.home.gpu - 1} · each fan supports another GPU`;
    note = 'Restore lost graphics output · CPU capacity is unchanged';
    applicationId = 'hardware-manager';
  } else if (!state.workstation.reached) {
    outcome = workstationBlocker(state)
      ? 'Prepare the Workstation'
      : 'Move into the Workstation';
    description = `CPU ${state.hardware.cpu}/12 · RAM ${state.hardware.ram}/8 · Storage ${state.home.storage}/4 · GPU ${state.home.gpu}/4 · Cooling ${state.home.cooling}/3`;
    note = `${money(workstation.transitionCost)} · unlocks Research; keeps all work`;
    applicationId = 'hardware-manager';
  } else if (
    !state.workstation.research.discoveries.includes('parallel-library')
  ) {
    outcome = 'Discover Parallel Library';
    description = `${state.workstation.research.points} / 40 Research · opens protein work units`;
    note = 'Jobs and Research share your machine';
    applicationId = 'research-lab';
  } else if (
    !state.workstation.research.discoveries.includes('thermal-model')
  ) {
    outcome = 'Discover Thermal Model';
    description = `${state.workstation.research.points} / 70 Research · learn safe thermal control`;
    note = 'Optional overclocking, then Heat Soak';
    applicationId = 'research-lab';
  } else if (!state.workstation.operations.fanCurve) {
    const blocked = heatBlocker(state);
    outcome = blocked ? 'Prepare Heat Soak' : 'Pass Heat Soak Certification';
    description =
      blocked ??
      'Task Manager → Heat Soak. Eco keeps the fixed cooling limit safe.';
    note = 'Permanent automatic fan curve · +10 Research';
    applicationId =
      blocked && state.workstation.operations.heatObserved
        ? 'hardware-manager'
        : 'task-manager';
  } else {
    outcome = 'Tune the lab';
    description =
      'Profiles balance Jobs and Research. Explore the remaining discoveries.';
    note = 'Automatic fan curve keeps cooling efficient';
    applicationId = 'research-lab';
  }
  return {
    title: 'Current Objective',
    outcome,
    description,
    note,
    action: `Open ${applications.find((app) => app.id === applicationId)!.title}`,
    command: { type: 'focus-application', applicationId },
  };
}
