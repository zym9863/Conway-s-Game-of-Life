import { describe, it, expect } from 'vitest';
import { createGrid, countNeighbors, nextGeneration } from './game';

describe('createGrid', () => {
  it('creates grid of correct dimensions filled with false', () => {
    const grid = createGrid(3, 4);
    expect(grid).toHaveLength(3);
    expect(grid[0]).toHaveLength(4);
    expect(grid.flat().every(c => c === false)).toBe(true);
  });
});

describe('countNeighbors', () => {
  it('counts neighbors in the middle', () => {
    const grid = createGrid(3, 3);
    grid[0][0] = true;
    grid[0][1] = true;
    grid[1][0] = true;
    expect(countNeighbors(grid, 1, 1)).toBe(3);
  });

  it('wraps around edges (toroidal)', () => {
    const grid = createGrid(3, 3);
    grid[2][2] = true;
    expect(countNeighbors(grid, 0, 0)).toBe(1);
  });

  it('does not count self', () => {
    const grid = createGrid(3, 3);
    grid[1][1] = true;
    expect(countNeighbors(grid, 1, 1)).toBe(0);
  });
});

describe('nextGeneration', () => {
  it('kills cell with fewer than 2 neighbors', () => {
    const grid = createGrid(3, 3);
    grid[1][1] = true;
    const next = nextGeneration(grid);
    expect(next[1][1]).toBe(false);
  });

  it('keeps cell alive with 2 or 3 neighbors', () => {
    const grid = createGrid(3, 3);
    grid[0][0] = true;
    grid[0][1] = true;
    grid[1][0] = true;
    grid[1][1] = true;
    const next = nextGeneration(grid);
    expect(next[0][0]).toBe(true);
    expect(next[1][1]).toBe(true);
  });

  it('revives dead cell with exactly 3 neighbors', () => {
    const grid = createGrid(3, 3);
    grid[0][0] = true;
    grid[0][1] = true;
    grid[1][0] = true;
    const next = nextGeneration(grid);
    expect(next[1][1]).toBe(true);
  });

  it('kills cell with more than 3 neighbors (overpopulation)', () => {
    const grid = createGrid(3, 3);
    grid[1][1] = true;
    grid[0][0] = true;
    grid[0][1] = true;
    grid[1][0] = true;
    grid[0][2] = true;
    const next = nextGeneration(grid);
    expect(next[1][1]).toBe(false);
  });

  it('blinker oscillates correctly', () => {
    const grid = createGrid(5, 5);
    grid[2][1] = true;
    grid[2][2] = true;
    grid[2][3] = true;
    const next = nextGeneration(grid);
    expect(next[1][2]).toBe(true);
    expect(next[2][2]).toBe(true);
    expect(next[3][2]).toBe(true);
    expect(next[2][1]).toBe(false);
    expect(next[2][3]).toBe(false);
  });
});
