import { describe, it, expect, beforeEach, vi } from 'vitest';
import { isCSVorJSON as isCSVorJSONRead, validateAndExecuteJokeSelection } from '../src/joke-server.ts';
import { isCSVorJSON as isCSVorJSONWrite } from '../src/writeJoke.js';

describe('joke.isCSVorJSONRead', () => {
  beforeEach(() => {
    vi.stubEnv('CSV_PATH', 'path/to/jokes.csv');
    vi.stubEnv('JSON_PATH', 'path/to/jokes.json');
  });

  it('Returns CSV path when user selects 1', () => {
    expect(isCSVorJSONRead('1')).toBe('path/to/jokes.csv');
  });

  it('Returns JSON path when user selects 2', () => {
    expect(isCSVorJSONRead('2')).toBe('path/to/jokes.json');
  });

  it('Returns "end" when user types anything else', () => {
    expect(isCSVorJSONRead('3')).toBe('end');
    expect(isCSVorJSONRead('abc')).toBe('end');
    expect(isCSVorJSONRead('')).toBe('end');
  });

  it('throws an error when CSV_PATH is missing', () => {
    vi.stubEnv('CSV_PATH', '');
    expect(() => isCSVorJSONRead('1')).toThrow("No CSV_PATH in .env");
  });

  it('throws an error when JSON_PATH is missing', () => {
    vi.stubEnv('JSON_PATH', '');
    expect(() => isCSVorJSONRead('2')).toThrow("No JSON_PATH in .env");
  });
});

describe('joke.validateAndExecuteJokeSelection', () => {
  const jokes: [number, string][] = [
    [0, "Index 0"],
    [1, "Why don't scientists trust atoms? Because they make up everything!"],
    [2, "Why did the bicycle fall over? Because it was two-tired!"],
    [3, "What do you call fake spaghetti? An impasta!"]
  ];

  it('Returns false when user inputs 0', () => {
    expect(validateAndExecuteJokeSelection('0', jokes)).toBe(false);
  });

  it('Returns true when user inputs a valid joke number', () => {
    expect(validateAndExecuteJokeSelection('1', jokes)).toBeTruthy();
    expect(validateAndExecuteJokeSelection('1.0', jokes)).toBeTruthy();
    expect(validateAndExecuteJokeSelection('2', jokes)).toBeTruthy();
    expect(validateAndExecuteJokeSelection('1.0', jokes)).toBeTruthy();
  });

  it('Returns falsy when user inputs an invalid strings', () => {
    expect(validateAndExecuteJokeSelection('4', jokes)).toBeFalsy();
    expect(validateAndExecuteJokeSelection('-1', jokes)).toBeFalsy();
    expect(validateAndExecuteJokeSelection('abc', jokes)).toBeFalsy();
    expect(validateAndExecuteJokeSelection('1.5', jokes)).toBeFalsy();
  });
});

describe('writeJoke.isCSVorJSONWrite', () => {
  beforeEach(() => {
    vi.stubEnv('CSV_PATH', 'path/to/jokes.csv');
    vi.stubEnv('JSON_PATH', 'path/to/jokes.json');
  });

  it('Returns CSV path when user selects 1', () => {
    expect(isCSVorJSONWrite('1')).toBe('path/to/jokes.csv');
  });

  it('Returns JSON path when user selects 2', () => {
    expect(isCSVorJSONWrite('2')).toBe('path/to/jokes.json');
  });

  it('Returns "end" when user types anything else', () => {
    expect(isCSVorJSONWrite('3')).toBe('end');
    expect(isCSVorJSONWrite('abc')).toBe('end');
    expect(isCSVorJSONWrite('')).toBe('end');
    expect(isCSVorJSONWrite(' ')).toBe('end');
  });
});

