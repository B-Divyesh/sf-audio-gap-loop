import type { Cadence } from './models';

export const DEFAULT_CADENCE: Cadence = {
  gapSeconds: 3,
  repetitions: 5,
  speed: 0.85,
  volume: 0.6
};

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

export function normalizeCadence(value: Partial<Cadence>): Cadence {
  return {
    gapSeconds: clamp(Number(value.gapSeconds), 1, 20),
    repetitions: Math.round(clamp(Number(value.repetitions), 1, 30)),
    speed: clamp(Number(value.speed), 0.6, 1.25),
    volume: clamp(Number(value.volume), 0, 1)
  };
}

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const rounded = Math.floor(seconds);
  return `${Math.floor(rounded / 60)}:${String(rounded % 60).padStart(2, '0')}`;
}

export function csvCell(value: string | number): string {
  const stringValue = String(value);
  return /[",\n]/.test(stringValue) ? `"${stringValue.replaceAll('"', '""')}"` : stringValue;
}
