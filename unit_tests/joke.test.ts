import { describe, it, expect, beforeEach } from 'vitest';
import { isCSVorJSON as isCSVorJSONRead, validateAndExecuteJokeSelection } from '../src/joke.ts';
import { isCSVorJSON as isCSVorJSONWrite } from '../src/writeJoke.ts';
import * as dotenv from 'dotenv';

dotenv.config();

describe('joke.isCSVorJSONRead', () => {
  
  const csvPath: string = process.env.CSV_PATH!;
  const jsonPath: string = process.env.JSON_PATH!;

  it('Returns CSV path when user selects 1', () => {
    expect(isCSVorJSONRead('1')).toBe(csvPath);
  });

  it('Returns JSON path when user selects 2', () => {
    expect(isCSVorJSONRead('2')).toBe(jsonPath);
  });

  it('Returns "end" when user types anything else', () => {
    expect(isCSVorJSONRead('3')).toBe('end');
    expect(isCSVorJSONRead('abc')).toBe('end');
    expect(isCSVorJSONRead('')).toBe('end');
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

  it('Returns the joke when user inputs a valid joke number', () => {
    expect(validateAndExecuteJokeSelection('1', jokes)).toBeTruthy;
  });

  it('Returns falsy when user inputs an invalid joke number', () => {
    expect(validateAndExecuteJokeSelection('4', jokes)).toBeFalsy;
    expect(validateAndExecuteJokeSelection('-1', jokes)).toBeFalsy;
    expect(validateAndExecuteJokeSelection('abc', jokes)).toBeFalsy;
  });
});

describe('writeJoke.isCSVorJSONWrite', () => {
  
  const csvPath: string = process.env.CSV_PATH!;
  const jsonPath: string = process.env.JSON_PATH!;

  it('Returns CSV path when user selects 1', () => {
    expect(isCSVorJSONWrite('1')).toBe(csvPath);
  });

  it('Returns JSON path when user selects 2', () => {
    expect(isCSVorJSONWrite('2')).toBe(jsonPath);
  });

  it('Returns "end" when user types anything else', () => {
    expect(isCSVorJSONWrite('3')).toBe('end');
    expect(isCSVorJSONWrite('abc')).toBe('end');
    expect(isCSVorJSONWrite('')).toBe('end');
    expect(isCSVorJSONWrite(' ')).toBe('end');
  });
});

