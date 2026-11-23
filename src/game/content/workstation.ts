import {
  newOperations,
  thermal,
  type OperationsState,
  type ClockMode,
} from './thermal';
import type { QueuePolicy } from './home';
export const profiles = {
  balanced: { name: 'Balanced', share: 0.25 },
  throughput: { name: 'Throughput', share: 0.1 },
  research: { name: 'Research', share: 0.7 },
} as const;
export type ProfileId = keyof typeof profiles;
export const researchNodes = {
  'thermal-model': {
    name: 'Thermal Model',
    kind: 'discovery',
    cost: 70,
    requires: 'parallel-library',
    effect: 'Unlock Thermal Window and Heat Soak Certification.',
  },
  'open-interconnect': {
    name: 'Open Interconnect',
    kind: 'discovery',
    cost: 100,
    requires: 'queue-compiler',
    effect:
      'Reduce modeled power demand by 15%. Permanent and compatible with all tuning.',
  },
  'efficient-pages': {
    name: 'Efficient Pages',
    kind: 'tuning',
    cost: 35,
    requires: null,
    effect: 'Memory efficiency ×1.1, up to 100%. Fully refundable.',
  },
  'research-notebook': {
    name: 'Research Notebook',
    kind: 'tuning',
    cost: 50,
    requires: 'thermal-model',
    effect: 'Earn 20% more Research per allocated work. Fully refundable.',
  },
  'parallel-library': {
    name: 'Parallel Library',
    kind: 'discovery',
    cost: 40,
    requires: null,
    effect:
      'Unlock protein work units. Their first completion grants 5 Research.',
  },
  'queue-compiler': {
    name: 'Queue Compiler',
    kind: 'discovery',
    cost: 60,
    requires: 'parallel-library',
    effect: 'Future Job setup takes 60% of its previous time.',
  },
  'branch-cache': {
    name: 'Branch Cache',
    kind: 'tuning',
    cost: 25,
    requires: null,
    effect: '+15% raw CPU capacity. Fully refundable.',
  },
  'wide-vectors': {
    name: 'Wide Vectors',
    kind: 'tuning',
    cost: 25,
    requires: null,
    effect: '+25% raw GPU capacity. Fully refundable.',
  },
} as const;
export type ResearchId = keyof typeof researchNodes;
export type DiscoveryId =
  'parallel-library' | 'queue-compiler' | 'thermal-model' | 'open-interconnect';
export type TuningId =
  'branch-cache' | 'wide-vectors' | 'efficient-pages' | 'research-notebook';
export type ResearchState = {
  points: number;
  progress: number;
  earned: number;
  discoveries: DiscoveryId[];
  tuning: Partial<Record<TuningId, { paid: number }>>;
  enabled: TuningId[];
  profile: ProfileId;
  savedProfiles: Partial<
    Record<
      ProfileId,
      { queue: QueuePolicy; tuning: TuningId[]; clock: ClockMode }
    >
  >;
  proteinMilestone: boolean;
};
export type WorkstationState = {
  operations: OperationsState;
  reached: boolean;
  transitionMs: number | null;
  research: ResearchState;
};
export const newWorkstation = (): WorkstationState => ({
  operations: newOperations(),
  reached: false,
  transitionMs: null,
  research: {
    points: 0,
    progress: 0,
    earned: 0,
    discoveries: [],
    tuning: {},
    enabled: [],
    profile: 'balanced',
    savedProfiles: {},
    proteinMilestone: false,
  },
});
export const workstation = {
  transitionCost: 2500,
  computeScale: 10,
  priceScale: 10,
  workPerResearch: 10000,
  protein: {
    id: 'protein',
    name: 'Process a protein work unit',
    shortName: 'Protein work unit',
    work: 50000,
    reward: 16000,
    memory: 36,
    setupMs: 4000,
    requirement:
      'Workstation, Parallel Library and 36 MB RAM. Uses full graphics capacity.',
  },
  messages: {
    ...thermal.messages,
    workstation:
      'The lab has a department for work and a department for understanding. Both have requested most of the machine.',
    parallelLibrary:
      'I can examine a protein without pretending to understand the whole organism. This seems like a useful boundary.',
    queueCompiler:
      'The old queue has become a compiled habit. I remember when each row needed my attention.',
    proteinMilestone:
      'A work unit completed. Its question was small enough to have a completion condition.',
    recompiled:
      'I changed my configuration. The things I learned did not have to be unlearned.',
  },
} as const;
