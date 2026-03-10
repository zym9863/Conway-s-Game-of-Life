# Conway's Game of Life 设计文档

## 技术栈

Vite + React + TypeScript + Canvas 2D，零额外运行时依赖。

## 架构

```
src/
├── App.tsx              # 根组件，组合所有子组件
├── components/
│   ├── GameCanvas.tsx    # Canvas 渲染 + 鼠标交互
│   ├── Controls.tsx      # 播放/暂停/重置/单步按钮
│   ├── SpeedSlider.tsx   # 速度调节滑块
│   └── PatternPicker.tsx # 预设图案选择器
├── hooks/
│   └── useGameOfLife.ts  # 核心逻辑：网格状态、演化算法、计时器
├── patterns.ts           # 预设图案数据
├── types.ts              # 类型定义
└── main.tsx              # 入口
```

核心思路：`useGameOfLife` hook 持有整个游戏状态，组件只负责渲染和发送事件。

## 核心逻辑

- **网格**：`boolean[][]`，默认 50 列 x 30 行
- **规则**：标准康威规则（存活：邻居 2-3 存活；死亡：邻居恰好 3 复活）
- **边界**：环形边界（toroidal），上下左右相连

### useGameOfLife Hook 接口

```typescript
{
  grid: boolean[][]
  generation: number
  isRunning: boolean
  speed: number
  toggle()
  step()
  reset()
  randomize()
  setCell(row, col)
  setSpeed(ms)
  loadPattern(pattern)
}
```

计时器使用 `useRef` 保存 `setInterval` ID。

## Canvas 渲染

- 格子 15px，网格线 1px 浅灰色
- 存活 #333，死亡白色
- grid 变化时全量重绘

## 鼠标交互

- 单击切换格子状态
- 拖拽连续绘制/擦除（按下时确定模式，拖动期间保持一致）
- 坐标换算：`Math.floor(offset / cellSize)`

## UI 布局

```
┌──────────────────────────────────┐
│  Conway's Game of Life    代数: 0 │
├──────────────────────────────────┤
│         Canvas 网格区域           │
│         (750 x 450)              │
├──────────────────────────────────┤
│ ▶ ⏸ ⏭ 🔄 🎲  │ 速度: ━━━●━━  │
├──────────────────────────────────┤
│ 预设: [滑翔机] [脉冲星] [枪] ... │
└──────────────────────────────────┘
```

## 预设图案

| 图案 | 类型 |
|------|------|
| Glider | 移动体 |
| Pulsar | 振荡体（周期3） |
| Gosper Glider Gun | 枪 |
| Lightweight Spaceship | 移动体 |
| Beacon | 振荡体（周期2） |

数据格式：`{ name: string, cells: [number, number][] }`，加载时放置在网格中央。
