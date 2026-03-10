import { useRef, useEffect, useCallback } from 'react';
import type { Grid } from '../types';

const CELL_SIZE = 15;

interface Props {
  grid: Grid;
  onCellToggle: (row: number, col: number, alive: boolean) => void;
}

export function GameCanvas({ grid, onCellToggle }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const drawModeRef = useRef(true);

  const rows = grid.length;
  const cols = grid[0].length;
  const width = cols * CELL_SIZE;
  const height = rows * CELL_SIZE;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear with background
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, width, height);

    // Draw living cells with glow effect
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c]) {
          // Glow effect
          ctx.shadowColor = '#00fff2';
          ctx.shadowBlur = 8;
          ctx.fillStyle = '#00fff2';
          ctx.fillRect(c * CELL_SIZE + 1, r * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
          
          // Inner bright core
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(c * CELL_SIZE + 3, r * CELL_SIZE + 3, CELL_SIZE - 6, CELL_SIZE - 6);
        }
      }
    }

    // Draw grid lines with subtle color
    ctx.strokeStyle = '#1a1a25';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;
    for (let r = 0; r <= rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * CELL_SIZE);
      ctx.lineTo(width, r * CELL_SIZE);
      ctx.stroke();
    }
    for (let c = 0; c <= cols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * CELL_SIZE, 0);
      ctx.lineTo(c * CELL_SIZE, height);
      ctx.stroke();
    }
  }, [grid, rows, cols, width, height]);

  const getCell = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const col = Math.floor((e.clientX - rect.left) * scaleX / CELL_SIZE);
      const row = Math.floor((e.clientY - rect.top) * scaleY / CELL_SIZE);
      if (row >= 0 && row < rows && col >= 0 && col < cols) return { row, col };
      return null;
    },
    [rows, cols],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const cell = getCell(e);
      if (!cell) return;
      isDrawingRef.current = true;
      drawModeRef.current = !grid[cell.row][cell.col];
      onCellToggle(cell.row, cell.col, drawModeRef.current);
    },
    [getCell, grid, onCellToggle],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawingRef.current) return;
      const cell = getCell(e);
      if (!cell) return;
      onCellToggle(cell.row, cell.col, drawModeRef.current);
    },
    [getCell, onCellToggle],
  );

  const handleMouseUp = useCallback(() => {
    isDrawingRef.current = false;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ 
        cursor: 'crosshair', 
        display: 'block',
        borderRadius: '4px',
        border: '1px solid #2a2a3a',
      }}
    />
  );
}
