import type { GameEvent } from '../game/engine/game';

export function createSynth() {
  let context: AudioContext | null = null;
  let available = false;
  let lastJobCue = -Infinity;
  return {
    async enable() {
      try {
        context ??= new AudioContext();
        await context.resume();
        available = true;
      } catch {
        available = false;
      }
      return available;
    },
    play(
      events: GameEvent[],
      enabled: boolean,
      volume: number,
      era: 'beige' | 'home' | 'workstation' = 'beige',
    ) {
      if (!enabled || !available || !context || context.state !== 'running')
        return;
      const event = events.find((item) =>
        [
          'job-completed',
          'hardware-bought',
          'benchmark-completed',
          'era-transition',
          'research-bought',
          'thermal-adjustment',
        ].includes(item.type),
      );
      if (!event) return;
      const now = context.currentTime;
      if (event.type === 'job-completed') {
        if (now - lastJobCue < 1.2) return;
        lastJobCue = now;
      }
      const cues =
        era === 'workstation'
          ? [220, 523.25, 784]
          : era === 'home'
            ? [440, 660, 990]
            : [330, 550, 880];
      const frequency =
        cues[
          event.type === 'job-completed'
            ? 0
            : event.type === 'hardware-bought' ||
                event.type === 'research-bought' ||
                event.type === 'thermal-adjustment'
              ? 1
              : 2
        ]!;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = era !== 'beige' ? 'sine' : 'triangle';
      oscillator.frequency.setValueAtTime(frequency, now);
      oscillator.frequency.exponentialRampToValueAtTime(
        frequency * 1.5,
        now + 0.1,
      );
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(
        Math.max(0.001, volume * 0.15),
        now + 0.01,
      );
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.18);
      oscillator.onended = () => {
        oscillator.disconnect();
        gain.disconnect();
      };
    },
    close() {
      if (context) void context.close().catch(() => undefined);
      context = null;
      available = false;
      lastJobCue = -Infinity;
    },
  };
}
