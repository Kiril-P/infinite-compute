import type { NavigationCommand } from './navigation';

export type ObjectiveSummary = {
  title: string;
  outcome: string;
  description: string;
  action: string;
  note: string;
  command: NavigationCommand;
};

export type StatusSummary = {
  label: string;
  value: string;
  note: string;
};

export const shellContent = {
  name: 'Infinite Compute',
  machine: {
    label: 'Beige PC.',
    caseLabel: 'Open computer case.',
    screenName: 'LOCAL / 001',
    prompt: '>',
    pause: 'Pause animation',
    descriptions: {
      desktop: 'Case closed. Terminal waiting for a Job.',
      cpu: 'Case open. CPU selected.',
      ram: 'Case open. RAM selected.',
      gpu: 'Case open. Graphics cards selected.',
      cooling: 'Case open. Cooling fans selected.',
    },
    activityDescriptions: {
      idle: 'Terminal waiting for a Job.',
      working: 'Processing a Job.',
      benchmark: 'Running an isolated Benchmark.',
    },
    activityScreens: {
      working: ['Household ledger', 'Processing records.'],
      benchmark: ['Safe Mode Payroll', 'Assistance disabled.'],
    },
    screens: {
      desktop: ['Ready.', 'No active Job.'],
      cpu: ['Hardware / CPU', 'Inspecting processor.'],
      ram: ['Hardware / RAM', 'Inspecting memory.'],
      gpu: ['Hardware / GPU', 'Graphics capacity.'],
      cooling: ['Hardware / fans', 'Airflow inspection.'],
    },
    captions: { cpu: 'CPU / inspection', ram: 'RAM / inspection' },
  },
} as const;
