# Conway's Game of Life 实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 实现一个基于 Web 的康威生命游戏，支持手动绘制、播放控制、速度调节和预设图案。

**Architecture:** `useGameOfLife` hook 持有全部游戏状态，纯函数实现演化算法便于测试。Canvas 2D 渲染网格，React 组件管理 UI 交互。

**Tech Stack:** Vite + React + TypeScript + Canvas 2D + Vitest

---

### Task 1: 项目脚手架

**Step 1: 初始化 Vite 项目**

Run: `npm create vite@latest . -- --template react-ts`

清理默认文件：删除 `src/App.css` 中默认内容，清空 `src/App.tsx`。

**Step 2: 安装测试依赖**

Run: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`

**Step 3: 配置 Vitest**

修改 `vite.config.ts`：

```typescript
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
  },
})
```

创建 `src/test-setup.ts`：

```typescript
import '@testing-library/jest-dom'
```

**Step 4: 创建目录结构**

```bash
mkdir -p src/components src/hooks
```

**Step 5: 验证搭建成功**

Run: `npm run dev`
Expected: Vite 开发服务器正常启动。

**Step 6: 提交**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + TypeScript project with Vitest"
```

---

### Task 2: 类型定义与图案数据

**Step 1: 创建类型定义**

创建 `src/types.ts`：

```typescript
export type Grid = boolean[][];

export type Pattern = {
  name: string;
  cells: [number, number][];
};
```

**Step 2: 创建图案数据**

创建 `src/patterns.ts`：

```typescript
import { Pattern } from './types';

export const patterns: Pattern[] = [
  {
    name: 'Glider',
    cells: [
      [-1, 0], [0, 1], [1, -1], [1, 0], [1, 1],
    ],
  },
  {
    name: 'Pulsar',
    cells: [
      [-6,-4],[-6,-3],[-6,-2],[-6,2],[-6,3],[-6,4],
      [-4,-6],[-3,-6],[-2,-6],[-4,-1],[-3,-1],[-2,-1],
      [-4,1],[-3,1],[-2,1],[-4,6],[-3,6],[-2,6],
      [-1,-4],[-1,-3],[-1,-2],[-1,2],[-1,3],[-1,4],
      [1,-4],[1,-3],[1,-2],[1,2],[1,3],[1,4],
      [2,-6],[3,-6],[4,-6],[2,-1],[3,-1],[4,-1],
      [2,1],[3,1],[4,1],[2,6],[3,6],[4,6],
      [6,-4],[6,-3],[6,-2],[6,2],[6,3],[6,4],
    ],
  },
  {
    name: 'Gosper Glider Gun',
    cells: [
      [0,24],
      [1,22],[1,24],
      [2,12],[2,13],[2,20],[2,21],[2,34],[2,35],
      [3,11],[3,15],[3,20],[3,21],[3,34],[3,35],
      [4,0],[4,1],[4,10],[4,16],[4,20],[4,21],
      [5,0],[5,1],[5,10],[5,14],[5,16],[5,17],[5,22],[5,24],
      [6,10],[6,16],[6,24],
      [7,11],[7,15],
      [8,12],[8,13],
    ],
  },
  {
    name: 'Lightweight Spaceship',
    cells: [
      [0,1],[0,4],
      [1,0],
      [2,0],[2,4],
      [3,0],[3,1],[3,2],[3,3],
    ],
  },
  {
    name: 'Beacon',
    cells: [
      [-1,-1],[-1,0],[0,-1],[0,0],
      [1,1],[1,2],[2,1],[2,2],
    ],
  },
];
```

**Step 3: 提交**

```bash
git add src/types.ts src/patterns.ts
git commit -m "feat: add type definitions and preset pattern data"
```

---

### Task 3: 核心演化逻辑（TDD）

核心纯函数抽取到 `src/game.ts`，方便独立测试。

**Step 1: 编写失败测试**

创建 `src/game.test.ts`：

```typescript
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
    grid[2][2] = true; // bottom-right is neighbor of top-left via wrapping
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

  it('blinker oscillates correctly', () => {
    const grid = createGrid(5, 5);
    // Horizontal blinker
    grid[2][1] = true;
    grid[2][2] = true;
    grid[2][3] = true;
    const next = nextGeneration(grid);
    // Should become vertical
    expect(next[1][2]).toBe(true);
    expect(next[2][2]).toBe(true);
    expect(next[3][2]).toBe(true);
    expect(next[2][1]).toBe(false);
    expect(next[2][3]).toBe(false);
  });
});
```

**Step 2: 运行测试确认失败**

Run: `npx vitest run src/game.test.ts`
Expected: FAIL — `game.ts` 不存在。

**Step 3: 实现核心函数**

创建 `src/game.ts`：

```typescript
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
```

**Step 4: 运行测试确认通过**

Run: `npx vitest run src/game.test.ts`
Expected: 全部 PASS。

**Step 5: 提交**

```bash
git add src/game.ts src/game.test.ts
git commit -m "feat: implement core game logic with tests (createGrid, countNeighbors, nextGeneration)"
```

---

### Task 4: useGameOfLife Hook

**Step 1: 实现 Hook**

创建 `src/hooks/useGameOfLife.ts`：

```typescript
import { useState, useRef, useCallback, useEffect } from 'react';
import { Grid, Pattern } from '../types';
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
```

**Step 2: 提交**

```bash
git add src/hooks/useGameOfLife.ts
git commit -m "feat: implement useGameOfLife hook with state management and timer"
```

---

### Task 5: GameCanvas 组件

**Step 1: 实现 Canvas 渲染与鼠标交互**

创建 `src/components/GameCanvas.tsx`：

```tsx
import { useRef, useEffect, useCallback } from 'react';
import { Grid } from '../types';

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

    ctx.clearRect(0, 0, width, height);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c]) {
          ctx.fillStyle = '#333';
          ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }
    }

    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;
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
      const col = Math.floor((e.clientX - rect.left) / CELL_SIZE);
      const row = Math.floor((e.clientY - rect.top) / CELL_SIZE);
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
      style={{ cursor: 'crosshair', display: 'block' }}
    />
  );
}
```

**Step 2: 提交**

```bash
git add src/components/GameCanvas.tsx
git commit -m "feat: implement GameCanvas with rendering and mouse interaction"
```

---

### Task 6: UI 控制组件

**Step 1: Controls 组件**

创建 `src/components/Controls.tsx`：

```tsx
interface Props {
  isRunning: boolean;
  onToggle: () => void;
  onStep: () => void;
  onReset: () => void;
  onRandomize: () => void;
}

export function Controls({ isRunning, onToggle, onStep, onReset, onRandomize }: Props) {
  return (
    <div className="controls">
      <button onClick={onToggle}>{isRunning ? 'Pause' : 'Play'}</button>
      <button onClick={onStep} disabled={isRunning}>Step</button>
      <button onClick={onReset}>Reset</button>
      <button onClick={onRandomize}>Random</button>
    </div>
  );
}
```

**Step 2: SpeedSlider 组件**

创建 `src/components/SpeedSlider.tsx`：

```tsx
interface Props {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export function SpeedSlider({ speed, onSpeedChange }: Props) {
  return (
    <div className="speed-slider">
      <label>
        Speed: {Math.round(1000 / speed)} gen/s
        <input
          type="range"
          min={50}
          max={1000}
          step={50}
          value={1050 - speed}
          onChange={e => onSpeedChange(1050 - Number(e.target.value))}
        />
      </label>
    </div>
  );
}
```

**Step 3: PatternPicker 组件**

创建 `src/components/PatternPicker.tsx`：

```tsx
import { Pattern } from '../types';

interface Props {
  patterns: Pattern[];
  onSelect: (pattern: Pattern) => void;
}

export function PatternPicker({ patterns, onSelect }: Props) {
  return (
    <div className="pattern-picker">
      <span>Patterns: </span>
      {patterns.map(p => (
        <button key={p.name} onClick={() => onSelect(p)}>
          {p.name}
        </button>
      ))}
    </div>
  );
}
```

**Step 4: 提交**

```bash
git add src/components/Controls.tsx src/components/SpeedSlider.tsx src/components/PatternPicker.tsx
git commit -m "feat: implement Controls, SpeedSlider, and PatternPicker components"
```

---

### Task 7: App 组合与样式

**Step 1: 实现 App.tsx**

替换 `src/App.tsx`：

```tsx
import { useGameOfLife } from './hooks/useGameOfLife';
import { GameCanvas } from './components/GameCanvas';
import { Controls } from './components/Controls';
import { SpeedSlider } from './components/SpeedSlider';
import { PatternPicker } from './components/PatternPicker';
import { patterns } from './patterns';
import './App.css';

export default function App() {
  const game = useGameOfLife();

  return (
    <div className="app">
      <header className="header">
        <h1>Conway's Game of Life</h1>
        <span className="generation">Generation: {game.generation}</span>
      </header>
      <main className="canvas-container">
        <GameCanvas grid={game.grid} onCellToggle={game.setCell} />
      </main>
      <footer className="toolbar">
        <Controls
          isRunning={game.isRunning}
          onToggle={game.toggle}
          onStep={game.step}
          onReset={game.reset}
          onRandomize={game.randomize}
        />
        <SpeedSlider speed={game.speed} onSpeedChange={game.setSpeed} />
        <PatternPicker patterns={patterns} onSelect={game.loadPattern} />
      </footer>
    </div>
  );
}
```

**Step 2: 编写样式**

替换 `src/App.css`：

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  padding: 20px;
}

.app {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: inline-flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}

.header h1 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.generation {
  font-size: 14px;
  color: #666;
  font-variant-numeric: tabular-nums;
}

.canvas-container {
  padding: 12px;
  background: #fafafa;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  padding: 12px 20px;
  border-top: 1px solid #eee;
}

.controls, .pattern-picker {
  display: flex;
  gap: 6px;
  align-items: center;
}

.speed-slider {
  display: flex;
  align-items: center;
}

.speed-slider label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #555;
}

button {
  padding: 6px 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #333;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}

button:hover {
  background: #f0f0f0;
}

button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pattern-picker span {
  font-size: 13px;
  color: #555;
}

input[type='range'] {
  width: 120px;
}
```

**Step 3: 清理 `src/index.css`（如果存在默认内容则清空）**

替换 `src/index.css` 为空或最小重置即可，已在 App.css 中处理。

**Step 4: 提交**

```bash
git add src/App.tsx src/App.css
git commit -m "feat: compose App with all components and add styling"
```

---

### Task 8: 最终验证

**Step 1: 运行所有测试**

Run: `npx vitest run`
Expected: 全部 PASS。

**Step 2: 启动开发服务器并手动验证**

Run: `npm run dev`

验证清单：
- [ ] 网格正常渲染 50x30 格子
- [ ] 点击格子可切换状态
- [ ] 拖拽可连续绘制
- [ ] Play/Pause 正常工作
- [ ] Step 单步推进
- [ ] Reset 清空网格
- [ ] Random 随机填充
- [ ] 速度滑块可调节
- [ ] 5 个预设图案可加载且行为正确
- [ ] 边界环形包裹正常

**Step 3: 最终提交**

```bash
git add -A
git commit -m "chore: final cleanup and verification"
```
