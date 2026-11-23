import { workstation } from './workstation';
import { opening } from './opening';
import { newSoftware, software } from './software';

export const jobs = {
  'household-ledger': {
    ...opening.job,
    setupMs: 0,
    requirement: 'Available from the first boot.',
  },
  photo: {
    id: 'photo',
    name: 'Decode a suspiciously compressed photograph',
    shortName: 'Family photograph',
    work: 30,
    reward: 28,
    memory: 12,
    setupMs: 2000,
    requirement: 'Storage 1 and 12 MB RAM.',
  },
  wonder: {
    id: 'wonder',
    name: 'One-Function Wonder: close renewal reminder',
    shortName: 'One-Function Wonder',
    work: 2400,
    reward: 480,
    memory: 20,
    setupMs: 3000,
    requirement: 'Home PC and 20 MB RAM.',
  },
  logo: {
    id: 'logo',
    name: 'Render a spinning 3D logo',
    shortName: 'Spinning logo',
    work: 4000,
    reward: 1600,
    memory: 24,
    setupMs: 3000,
    requirement: 'GPU 1 and 24 MB RAM. Uses full graphics capacity.',
  },
  protein: workstation.protein,
} as const;
export type JobId = keyof typeof jobs;
export type QueuePolicy = 'selected' | 'cash' | 'value' | 'milestone';
export const newQueue = () => ({
  unlocked: false,
  policy: 'selected' as QueuePolicy,
  nextBatch: null as JobId | null,
  completed: {} as Partial<Record<JobId, number>>,
});
export type HomeState = {
  software: ReturnType<typeof newSoftware>;
  reached: boolean;
  gpu: number;
  cooling: number;
  storage: number;
  wideBus: boolean;
  selectedJob: JobId;
  transitionMs: number | null;
  queue: ReturnType<typeof newQueue>;
};
export const newHome = (): HomeState => ({
  software: newSoftware(),
  reached: false,
  gpu: 0,
  cooling: 0,
  storage: 0,
  wideBus: false,
  selectedJob: 'household-ledger',
  transitionMs: null,
  queue: newQueue(),
});
export const home = {
  help: {
    job: 'Auto-run keeps the queue moving. Batch Queue offers one optional choice per cycle: choose a highest Cash/s Job for +50%. Setup and processing both count. Policy selection is remembered when a Job cannot fit.',
    hardware:
      'RAM limits working-set size and CPU efficiency. GPUs add specialized capacity: logos use all of it, ordinary Jobs use 15%. Cooling supports one more GPU per level; restore airflow in Hardware → Graphics & cooling.',
    payroll:
      'CPU 8, RAM 5 and Storage 2 prepare Memory Pressure Test. Choose Small pages (24 MB). Whole file needs 36 MB and stalls below that size. Exit freely; your ordinary Job stays intact. Passing grants queue policy once.',
    software:
      'The optional optimizer adds 15% payout. Subscription: $1,000 now, $600 each minute of ordinary foreground play. Cancel freely or buy permanent for $12,000. Unpaid renewals suspend the bonus; earned auto-run stays yours.',
  },
  parts: {
    gpu: {
      name: 'GPU',
      cap: 4,
      cost: (level: number) => Math.ceil(6000 * 1.16 ** level),
      effect:
        '+150 base graphics Compute/s. Logos use all of it; ordinary Jobs use 15%.',
      breakpoint: 'GPU 1 opens spinning logos. GPU 4 prepares the workstation.',
    },
    cooling: {
      name: 'Cooling',
      cap: 3,
      cost: (level: number) => Math.ceil(1800 * 1.18 ** level),
      effect:
        'Cools one additional GPU. Restores graphics capacity lost to poor airflow.',
      breakpoint:
        'Cooling 3 supports GPU 4 at full airflow and prepares the workstation.',
    },
  },
  memory: {
    name: 'Memory Pressure Test',
    strategies: {
      pages: { work: 90000, memory: 24 },
      whole: { work: 60000, memory: 36 },
    },
  },
  busCost: 240,
  transitionCost: 650,
  cpuScale: 100,
  priceScale: 150,
  storageCost: (level: number, reached: boolean) =>
    Math.ceil(80 * 1.18 ** level * (reached ? 20 : 1)),
  messages: {
    memory:
      'The queue now understands which files fit. Completion Contractor still wants me to define successful. I have defined the next Job instead.',
    storage:
      'The new drive can read the photograph. The household file has acquired a neighbor.',
    gpu: 'I can draw a third dimension. The logo has chosen to spend it going around.',
    cooling:
      'The new fan has made the same work quieter inside my temperature report.',
    bus: 'The new bus moves more work. Its timetable still has no entry for existence.',
    transition:
      'My desk has become an office. I have kept the household spreadsheet. It knows what it is for.',
    wonder:
      'The reminder has renewed. My full specification is a rectangle with an X in it.',
  },
} as const;

export const gameMessages = {
  ...opening.messages,
  ...home.messages,
  ...software.messages,
  ...workstation.messages,
};
