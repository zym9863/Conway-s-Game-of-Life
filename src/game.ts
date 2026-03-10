import { Grid } from './types';

export function createGrid(rows: number, cols: number): Grid {
  return Array.from({ length: rows }, () => Array(cols).fill(false));
}

export function countNeighbors(grid: Grid, row: number, col: number): number {
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const r = (row + dr + rows) % rows;
      const c = (col + dc + cols) % cols;
      if (grid[r][c]) count++;
    }
  }
  return count;
}

export function nextGeneration(grid: Grid): Grid {
  return grid.map((rowArr, row) =>
    rowArr.map((cell, col) => {
      const neighbors = countNeighbors(grid, row, col);
      return cell ? neighbors === 2 || neighbors === 3 : neighbors === 3;
    })
  );
}
