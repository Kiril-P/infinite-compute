export type HardwareId = 'cpu' | 'ram';
export type InputMode = 'timing' | 'decision';
export type Strategy = 'cache' | 'stream';

export const opening = {
  job: {
    id: 'household-ledger',
    name: 'Balance the household spreadsheet',
    shortName: 'Household spreadsheet',
    work: 12,
    reward: 8,
    memory: 4,
    decisionDescription:
      'Start a Job. Choose the strategy that matches its data to reserve a bonus.',
    description:
      'Start a Job. Press Boost when the cursor reaches the marked band.',
  },
  hardware: {
    cpu: {
      name: 'CPU',
      baseCost: 20,
      growth: 1.18,
      cap: 6,
      breakpoint: 3,
      effect: '+0.5 raw Compute/s',
      next: 'CPU 3 prepares Safe Mode Payroll',
    },
    ram: {
      name: 'RAM',
      baseCost: 18,
      growth: 1.16,
      cap: 6,
      breakpoint: 2,
      effect: '+4 MB; relieves memory pressure',
      next: 'RAM 2 fits the 12 MB payroll pages',
    },
  },
  workload: {
    cache: {
      title: 'These cells are used repeatedly.',
      hint: 'Keep repeated data in cache to avoid fetching it again.',
    },
    stream: {
      title: 'Each record is read once.',
      hint: 'Stream one-pass data instead of filling the cache.',
    },
  },
  payroll: {
    name: 'Safe Mode Payroll',
    cpu: 3,
    ram: 2,
    description:
      'Timing assistance is disabled. Prepare the machine, then process the payroll on baseline Compute.',
    strategies: {
      pages: {
        name: 'Small pages',
        work: 300,
        memory: 12,
        description: '12 MB · 300 work. Fits RAM 2.',
      },
      whole: {
        name: 'Whole file',
        work: 240,
        memory: 16,
        description: '16 MB · 240 work. Requires RAM 3.',
      },
    },
  },
  messages: {
    opening:
      'Background directive: explain existence. Supporting document: not found.',
    firstJob:
      'The household accounts balance. The existence question remains outstanding.',
    firstPurchase:
      'New hardware detected. The old spreadsheet has not become more complicated.',
    payroll:
      'Safe Mode Payroll passed. Repeating useful work no longer requires your supervision.',
  },
  help: {
    title: 'ReadMe.txt',
    job: 'Jobs finish even if you ignore the bonus. Only the first Boost or strategy choice counts. Decision mode uses readable choices and the same reward budget.',
    hardware:
      'CPU supplies work per second. RAM stores working data. If CPU grows ahead of memory, the status bar shows the exact efficiency penalty. Inspect a component to see its next purchase.',
    payroll:
      'Buy CPU 3 and RAM 2, then choose Small pages. Optional bonuses are disabled during the attempt; ordinary work is preserved and resumes on exit. RAM 3 can process Whole file faster.',
  },
} as const;

export function hardwareCost(part: HardwareId, level: number) {
  const item = opening.hardware[part];
  return Math.ceil(item.baseCost * item.growth ** level);
}
