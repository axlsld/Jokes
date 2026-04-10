import { describe, it, expect, beforeEach } from 'vitest';
import { isCSVorJSON } from '../src/joke.ts';

describe('joke.isCSVorJSON', () => {
  beforeEach (() => {
        process.env.CSV_PATH = '../csv/joke.csv';
    process.env.JSON_PATH = '../json/joke.json';
      });

  it('Returns CSV path when user selects 1', () => {
    expect(isCSVorJSON('1')).toBe(process.env.CSV_PATH);
  });

  it('Returns JSON path when user selects 2', () => {
    expect(isCSVorJSON('2')).toBe(process.env.JSON_PATH);
  });

  it('Returns "end" when user types anything else', () => {
    expect(isCSVorJSON('3')).toBe('end');
    expect(isCSVorJSON('abc')).toBe('end');
    expect(isCSVorJSON('')).toBe('end');
  });
});