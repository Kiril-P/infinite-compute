import {
  profiles,
  researchNodes,
  workstation,
  type DiscoveryId,
  type ProfileId,
  type ResearchId,
  type TuningId,
} from '../content/workstation';
import type { GameState } from './game';

export function workstationBlocker(state: GameState): string | null {
  if (state.workstation.reached) return 'Workstation already installed.';
  if (!state.home.queue.unlocked) return 'Pass Memory Pressure Test first.';
  if (
    state.hardware.cpu < 12 ||
    state.hardware.ram < 8 ||
    state.home.storage < 4 ||
    state.home.gpu < 4 ||
    state.home.cooling < 3
  )
    return `Needs CPU 12, RAM 8, Storage 4, GPU 4 and Cooling 3 (owned ${state.hardware.cpu}, ${state.hardware.ram}, ${state.home.storage}, ${state.home.gpu}, ${state.home.cooling}).`;
  return null;
}
export function researchEffects(state: GameState) {
  const r = state.workstation.research;
  const enabled = (id: TuningId) => !!r.tuning[id] && r.enabled.includes(id);
  return {
    memory: enabled('efficient-pages') ? 1.1 : 1,
    research: enabled('research-notebook') ? 1.2 : 1,
    power: r.discoveries.includes('open-interconnect') ? 0.85 : 1,
    cpu: enabled('branch-cache') ? 1.15 : 1,
    gpu: enabled('wide-vectors') ? 1.25 : 1,
    setup: r.discoveries.includes('queue-compiler') ? 0.6 : 1,
  };
}
export function allocate(
  state: GameState,
  capacity: { cpu: number; graphics: number; effective: number },
  graphicsShare: number,
  processing: boolean,
) {
  const available = capacity.effective;
  if (state.benchmark)
    return { available, jobs: 0, research: 0, benchmark: available };
  const share = state.workstation.reached
    ? profiles[state.workstation.research.profile].share
    : 0;
  const jobs = processing
    ? (capacity.cpu + capacity.graphics * graphicsShare) * (1 - share)
    : 0;
  return {
    available,
    jobs,
    research: state.workstation.reached ? Math.max(0, available - jobs) : 0,
    benchmark: 0,
  };
}
export function earnResearch(state: GameState, points: number) {
  state.workstation.research.points += points;
  state.workstation.research.earned += points;
}
export function advanceResearch(state: GameState, work: number) {
  if (!state.workstation.reached || state.benchmark) return;
  const research = state.workstation.research;
  research.progress +=
    (work / workstation.workPerResearch) * researchEffects(state).research;
  const earned = Math.floor(research.progress + 1e-12);
  if (earned > 0) {
    research.progress = Math.max(0, research.progress - earned);
    earnResearch(state, earned);
  }
}
export function researchBlocker(
  state: GameState,
  id: ResearchId,
): string | null {
  const r = state.workstation.research,
    node = researchNodes[id];
  if (!state.workstation.reached)
    return 'Install the workstation to open Research.';
  if (
    node.kind === 'discovery'
      ? r.discoveries.includes(id as DiscoveryId)
      : !!r.tuning[id as TuningId]
  )
    return 'Already owned.';
  if (node.requires && !r.discoveries.includes(node.requires))
    return `Discover ${researchNodes[node.requires].name} first.`;
  if (r.points < node.cost)
    return `Needs ${node.cost} Research; ${r.points} available.`;
  return null;
}
export function buyResearch(state: GameState, id: ResearchId) {
  if (researchBlocker(state, id) || state.benchmark) return false;
  const r = state.workstation.research,
    node = researchNodes[id];
  r.points -= node.cost;
  if (node.kind === 'discovery') r.discoveries.push(id as DiscoveryId);
  else {
    r.tuning[id as TuningId] = { paid: node.cost };
    r.enabled.push(id as TuningId);
  }
  return true;
}
export function recompile(state: GameState) {
  if (!state.workstation.reached || state.benchmark) return false;
  const r = state.workstation.research;
  const refund = Object.values(r.tuning).reduce(
    (total, item) => total + item.paid,
    0,
  );
  if (!refund) return false;
  if (state.job) {
    state.job.attempted = true;
    state.job.bonus = 0;
  }
  state.workstation.operations.window = null;
  r.points += refund;
  r.tuning = {};
  r.enabled = [];
  return true;
}
export function saveProfile(state: GameState, profile: ProfileId) {
  if (!state.workstation.reached || state.benchmark) return false;
  state.workstation.research.savedProfiles[profile] = {
    queue: state.home.queue.policy,
    clock: state.workstation.operations.clock,
    tuning: [...state.workstation.research.enabled],
  };
  return true;
}
export function applyProfile(state: GameState, profile: ProfileId) {
  if (!state.workstation.reached || state.benchmark) return false;
  const r = state.workstation.research;
  r.profile = profile;
  const saved = r.savedProfiles[profile];
  if (saved) {
    state.home.queue.policy = saved.queue;
    if (state.workstation.operations.clock !== saved.clock)
      state.workstation.operations.window = null;
    state.workstation.operations.clock = saved.clock;
    r.enabled = saved.tuning.filter((id) => r.tuning[id]);
  }
  return true;
}
export function researchSummary(state: GameState) {
  const r = state.workstation.research;
  return {
    nodes: (Object.keys(researchNodes) as ResearchId[]).map((id) => ({
      id,
      ...researchNodes[id],
      blocker: researchBlocker(state, id),
      owned:
        researchNodes[id].kind === 'discovery'
          ? r.discoveries.includes(id as DiscoveryId)
          : !!r.tuning[id as TuningId],
    })),
    refund: Object.values(r.tuning).reduce(
      (total, item) => total + item.paid,
      0,
    ),
    missingTuning: (r.savedProfiles[r.profile]?.tuning ?? []).filter(
      (id) => !r.tuning[id],
    ),
  };
}
