import { describe, expect, it } from 'vitest';
import { csvCell, formatTime, normalizeCadence } from './cadence';

describe('cadence helpers', () => {
  it('keeps every practice setting inside safe supported bounds', () => {
    expect(normalizeCadence({ gapSeconds: 99, repetitions: 0, speed: .2, volume: 4 })).toEqual({
      gapSeconds: 20,
      repetitions: 1,
      speed: .6,
      volume: 1
    });
  });

  it('formats player time without leaking invalid values', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(125.8)).toBe('2:05');
    expect(formatTime(Number.NaN)).toBe('0:00');
  });

  it('escapes CSV values that include punctuation or line breaks', () => {
    expect(csvCell('plain')).toBe('plain');
    expect(csvCell('say, "hello"')).toBe('"say, ""hello"""');
  });
});
