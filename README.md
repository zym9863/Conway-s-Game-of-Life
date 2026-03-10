简体中文 | [English](./README-EN.md)

# Conway's Game of Life

一个基于 React + TypeScript + Vite 实现的康威生命游戏（Conway's Game of Life）。

## 项目简介

康威生命游戏是一种元胞自动机，由英国数学家约翰·康威于 1970 年发明。它是一种零玩家游戏，意味着它的演化是由其初始状态决定的，不需要任何后续输入。

### 规则

1. 活细胞周围如果有 2 或 3 个活细胞，下一代仍然存活
2. 死细胞周围如果有 3 个活细胞，下一代变成活细胞
3. 其他情况下，细胞死亡或保持死亡状态

## 功能特性

- **交互式网格**：30×50 的可点击网格，支持鼠标拖动绘制细胞
- **播放控制**：播放/暂停、单步执行、重置游戏
- **随机生成**：一键生成随机细胞分布
- **速度调节**：可调整游戏运行速度
- **预设图案**：内置多种经典生命游戏图案
  - Glider（滑翔机）
  - Pulsar（脉冲星）
  - Gosper Glider Gun（高斯帕滑翔机炮）
  - Lightweight Spaceship（轻型飞船）
  - Beacon（信标）

## 技术栈

- [React](https://react.dev/) 19 - UI 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Vite](https://vite.dev/) - 构建工具
- [Vitest](https://vitest.dev/) - 测试框架

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 运行测试

```bash
pnpm test
```

### 监听模式运行测试

```bash
pnpm test:watch
```

## 项目结构

```
src/
├── components/        # React 组件
│   ├── Controls.tsx   # 游戏控制按钮
│   ├── GameCanvas.tsx # 游戏画布组件
│   ├── PatternPicker.tsx  # 图案选择器
│   └── SpeedSlider.tsx    # 速度滑块
├── hooks/
│   └── useGameOfLife.ts   # 游戏状态管理 Hook
├── game.ts            # 游戏核心逻辑
├── types.ts           # TypeScript 类型定义
├── patterns.ts        # 预设图案数据
├── App.tsx            # 主应用组件
└── main.tsx          # 入口文件
```

## 许可证

MIT
