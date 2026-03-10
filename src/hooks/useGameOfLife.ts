import { useState, useRef, useCallback, useEffect } from 'react';
import type { Grid, Pattern } from '../types';
import { createGrid, nextGeneration } from '../game';

const ROWS = 30;
const COLS = 50;

export function useGameOfLife() {
  const [grid, setGrid] = useState<Grid>(() => createGrid(ROWS, COLS));
  const [generation, setGeneration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(200);
  const intervalRef = useRef<number | null>(null);

  const step = useCallback(() => {
    setGrid(g => nextGeneration(g));
    setGeneration(g => g + 1);
  }, []);

  const toggle = useCallback(() => {
    setIsRunning(r => !r);
  }, []);

  const reset = useCallback(() => {
    setGrid(createGrid(ROWS, COLS));
    setGeneration(0);
    setIsRunning(false);
  }, []);

  const randomize = useCallback(() => {
    setGrid(
      Array.from({ length: ROWS }, () =>
        Array.from({ length: COLS }, () => Math.random() > 0.7)
      )
    );
    setGeneration(0);
    setIsRunning(false);
  }, []);

  const setCell = useCallback((row: number, col: number, alive: boolean) => {
    setGrid(g => {
      const newGrid = g.map(r => [...r]);
      newGrid[row][col] = alive;
      return newGrid;
    });
  }, []);

  const loadPattern = useCallback((pattern: Pattern) => {
    const newGrid = createGrid(ROWS, COLS);
    const centerRow = Math.floor(ROWS / 2);
    const centerCol = Math.floor(COLS / 2);
    pattern.cells.forEach(([r, c]) => {
      const row = centerRow + r;
      const col = centerCol + c;
      if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
        newGrid[row][col] = true;
      }
    });
    setGrid(newGrid);
    setGeneration(0);
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(step, speed);
    } else if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, speed, step]);

  return {
    grid, generation, isRunning, speed,
    toggle, step, reset, randomize, setCell, setSpeed, loadPattern,
  };
}
