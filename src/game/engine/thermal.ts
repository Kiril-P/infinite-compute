import { thermal, type ClockMode, type ThermalPlan } from '../content/thermal';
import type { GameState } from './game';
import { researchEffects } from './research';

export function thermalFactors(state: GameState, preview?: ClockMode) {
  const ops = state.workstation.operations;
  const attempt = state.benchmark?.id === 'heat' ? state.benchmark : null;
  const active =
    !!ops.window && !ops.window.preparing && !state.benchmark && !preview;
  const clock = thermal.clock[preview ?? attempt?.strategy ?? ops.clock];
  const speed = active ? thermal.window.speed : clock.speed;
  const demand =
    (80 +
      12 * state.hardware.cpu +
      50 * state.home.gpu +
      8 * state.home.cooling) *
    (active ? thermal.window.draw : clock.draw) *
    researchEffects(state).power;
  const supply = thermal.power.base + thermal.power.perLevel * ops.power;
  const cooling =
    attempt || preview ? thermal.heat.cooling : state.home.cooling;
  const denominator =
    30 + 10 * cooling + (!attempt && !preview && ops.fanCurve ? 15 : 0);
  const temperature = attempt?.temperature ?? ops.temperature;
  return {
    speed: state.workstation.reached ? speed : 1,
    demand,
    supply,
    cooling,
    temperature,
    equilibrium: 30 + (5 * demand) / denominator,
    powerFactor: state.workstation.reached
      ? Math.max(0.5, Math.min(1, supply / demand))
      : 1,
    thermalFactor: state.workstation.reached
      ? Math.max(0.5, Math.min(1, 1 - (temperature - 70) / 40))
      : 1,
  };
}
export function heatBlocker(state: GameState): string | null {
  const ops = state.workstation.operations;
  if (ops.fanCurve)
    return 'Heat Soak already passed. Automatic fan curve is permanent.';
  if (!state.workstation.research.discoveries.includes('thermal-model'))
    return 'Discover Thermal Model first.';
  if (!ops.heatObserved)
    return 'Observe ordinary temperature reach 60°C first. Standard clock warms the machine.';
  if (
    state.hardware.cpu < 14 ||
    state.hardware.ram < 10 ||
    state.home.cooling < 4 ||
    ops.power < 1
  )
    return `Needs CPU 14, RAM 10, Cooling 4 and Power 1 (owned ${state.hardware.cpu}, ${state.hardware.ram}, ${state.home.cooling}, ${ops.power}).`;
  return null;
}
export function thermalWindowBlocker(state: GameState): string | null {
  const ops = state.workstation.operations;
  if (!state.workstation.research.discoveries.includes('thermal-model'))
    return 'Discover Thermal Model to unlock this optional boost.';
  if (state.benchmark) return 'Waiting: the Benchmark owns the machine.';
  if (ops.window) return 'Thermal Window already reserved.';
  if (ops.cooldownMs > 0)
    return `Next window in ${Math.ceil(ops.cooldownMs / 1000)}s.`;
  if (ops.temperature < 55)
    return 'Warm to 55°C on Standard clock to start a window.';
  if (ops.temperature > 72)
    return 'Cool to 72°C on Eco clock before starting a window.';
  return null;
}
export function startThermalWindow(state: GameState) {
  if (thermalWindowBlocker(state)) return false;
  const ops = state.workstation.operations;
  ops.window = {
    startTemperature: ops.temperature,
    mode: state.inputMode,
    elapsedMs: 0,
    adjustments: 0,
    preparing: state.inputMode === 'decision',
    requiredPlan: ops.temperature < 64 ? 'steady' : 'precool',
  };
  if (!ops.window.preparing) ops.cooldownMs = thermal.window.cooldownMs;
  return true;
}
export function chooseThermalPlan(state: GameState, plan: ThermalPlan) {
  const ops = state.workstation.operations,
    w = ops.window;
  if (!w || !w.preparing || state.benchmark) return null;
  ops.cooldownMs = thermal.window.cooldownMs;
  if (plan !== w.requiredPlan) {
    ops.window = null;
    return false;
  }
  w.preparing = false;
  return true;
}
export function adjustThermalWindow(state: GameState) {
  const ops = state.workstation.operations,
    w = ops.window;
  if (!w || w.preparing || w.mode !== 'timing' || state.benchmark) return null;
  const band =
    w.adjustments === 2 ? undefined : thermal.window.bands[w.adjustments];
  if (
    !band ||
    w.elapsedMs < band[0] ||
    w.elapsedMs > band[1] ||
    ops.temperature < 55 ||
    ops.temperature > 75
  ) {
    ops.window = null;
    return false;
  }
  w.adjustments++;
  ops.temperature -= 4;
  return true;
}
export function advanceTemperature(state: GameState) {
  if (!state.workstation.reached) return;
  const factors = thermalFactors(state);
  const next =
    factors.temperature + (factors.equilibrium - factors.temperature) / 200;
  if (state.benchmark?.id === 'heat') state.benchmark.temperature = next;
  else state.workstation.operations.temperature = next;
}
export function advanceOperations(state: GameState) {
  if (!state.workstation.reached || state.benchmark)
    return { warm: false, miss: false };
  const ops = state.workstation.operations;
  advanceTemperature(state);
  const warm = !ops.heatObserved && ops.temperature >= 60;
  if (warm) ops.heatObserved = true;
  ops.cooldownMs = Math.max(0, ops.cooldownMs - 100);
  const w = ops.window;
  let miss = false;
  if (w && !w.preparing) {
    w.elapsedMs += 100;
    if (
      w.mode === 'decision' &&
      w.adjustments < 2 &&
      w.elapsedMs >= (w.adjustments === 0 ? 4000 : 9000)
    ) {
      w.adjustments++;
      ops.temperature -= 4;
    }
    const band =
      w.adjustments === 2 ? undefined : thermal.window.bands[w.adjustments];
    if ((band && w.elapsedMs > band[1]) || ops.temperature > 75) {
      ops.window = null;
      miss = true;
    } else if (w.elapsedMs >= thermal.window.durationMs) ops.window = null;
  }
  return { warm, miss };
}
export function thermalSummary(state: GameState) {
  const ops = state.workstation.operations;
  return {
    ...thermalFactors(state),
    windowBlocker: thermalWindowBlocker(state),
    heatBlocker: heatBlocker(state),
    requiredPlan:
      ops.window?.requiredPlan ??
      ((ops.temperature < 64 ? 'steady' : 'precool') as ThermalPlan),
    researchRateMultiplier: researchEffects(state).research,
    heatPreview: (['eco', 'standard'] as const).map((clock) => ({
      clock,
      ...thermalFactors(state, clock),
    })),
  };
}
