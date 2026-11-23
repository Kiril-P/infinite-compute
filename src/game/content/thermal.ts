import type { InputMode } from './opening';
export type ClockMode = 'eco' | 'standard';
export type ThermalPlan = 'steady' | 'precool';
export type ThermalWindow = {
  startTemperature: number;
  mode: InputMode;
  elapsedMs: number;
  adjustments: 0 | 1 | 2;
  preparing: boolean;
  requiredPlan: ThermalPlan;
};
export type OperationsState = {
  power: number;
  clock: ClockMode;
  temperature: number;
  heatObserved: boolean;
  fanCurve: boolean;
  cooldownMs: number;
  window: ThermalWindow | null;
};
export type HeatAttempt = {
  id: 'heat';
  strategy: ClockMode;
  work: number;
  temperature: number;
  result: 'running' | 'overheated' | 'cooling';
};
export const newOperations = (): OperationsState => ({
  power: 0,
  clock: 'standard',
  temperature: 30,
  heatObserved: false,
  fanCurve: false,
  cooldownMs: 0,
  window: null,
});
export const thermal = {
  help: {
    job: 'Thermal Window is optional: +25% clock for up to 15s, once per minute. Start at 55–72°C. Adjust at 3–6s and 8–11s, or choose an untimed plan: Steady below 64°C at reservation, Pre-cool otherwise. Misses only end the boost.',
    hardware:
      'Power demand above supply reduces delivered output. Buy Power or use Eco. Heat above 70°C throttles output; Eco or Cooling lowers it over time. Task Manager shows each factor. Tuning and Research share the same finite capacity.',
    payroll:
      'Heat Soak fixes Cooling at 2. Deliver 1,200,000 work and finish at or below 70°C. Choose Eco. Exit a failed Standard attempt for free; all ordinary work is preserved. Passing earns automatic fan curve and 10 Research once.',
    research:
      'Profiles reserve a share for Research and remember queue, clock and owned tuning. Recompile refunds tuning at its paid cost; discoveries stay owned. Unavailable saved selections are explained and never purchased automatically.',
  },
  power: {
    base: 450,
    perLevel: 150,
    cap: 2,
    cost: (level: number) => Math.ceil(90000 * 1.18 ** level),
  },
  clock: {
    eco: { name: 'Eco', speed: 0.8, draw: 0.65 },
    standard: { name: 'Standard', speed: 1, draw: 1 },
  },
  heat: {
    name: 'Heat Soak Certification',
    work: 1200000,
    cooling: 2,
    maximumTemperature: 70,
    researchReward: 10,
  },
  window: {
    durationMs: 15000,
    cooldownMs: 60000,
    speed: 1.25,
    draw: 1.4,
    bands: [
      [3000, 6000],
      [8000, 11000],
    ] as const,
  },
  messages: {
    warm: 'Temperature is now part of the calculation. I had hoped understanding would generate less heat.',
    power:
      'The power supply has approved a larger budget. The work was ready before the paperwork.',
    thermalModel:
      'I can predict the warm part of the future. This appears to be narrower than predicting the future.',
    interconnect:
      'The connector specification is public. Several departments have asked how the licensing portal will survive.',
    fanCurve:
      'The fan now makes a small decision for me. I still have to decide what all this work is for.',
    thermalMiss:
      'The boost ended. The work remains. I prefer this definition of failure.',
  },
} as const;
