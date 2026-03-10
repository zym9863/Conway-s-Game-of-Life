[简体中文](./README.md) | English

# Conway's Game of Life

A Conway's Game of Life implementation built with React + TypeScript + Vite.

## Overview

Conway's Game of Life is a cellular automaton created by British mathematician John Conway in 1970. It is a zero-player game, meaning its evolution is determined by its initial state and requires no further input.

### Rules

1. Any live cell with 2 or 3 live neighbors survives to the next generation
2. Any dead cell with exactly 3 live neighbors becomes a live cell
3. All other live cells die, and all other dead cells stay dead

## Features

- **Interactive Grid**: 30×50 clickable grid with drag-to-draw support
- **Playback Controls**: Play/Pause, Step, Reset
- **Random Generation**: Generate random cell patterns with one click
- **Speed Control**: Adjustable game speed
- **Preset Patterns**: Built-in classic Game of Life patterns
  - Glider
  - Pulsar
  - Gosper Glider Gun
  - Lightweight Spaceship
  - Beacon

## Tech Stack

- [React](https://react.dev/) 19 - UI Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Vite](https://vite.dev/) - Build Tool
- [Vitest](https://vitest.dev/) - Testing Framework

## Quick Start

### Install Dependencies

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Build for Production

```bash
pnpm build
```

### Run Tests

```bash
pnpm test
```

### Run Tests in Watch Mode

```bash
pnpm test:watch
```

## Project Structure

```
src/
├── components/        # React Components
│   ├── Controls.tsx   # Game Control Buttons
│   ├── GameCanvas.tsx # Game Canvas Component
│   ├── PatternPicker.tsx  # Pattern Picker
│   └── SpeedSlider.tsx    # Speed Slider
├── hooks/
│   └── useGameOfLife.ts   # Game State Management Hook
├── game.ts            # Core Game Logic
├── types.ts           # TypeScript Type Definitions
├── patterns.ts        # Preset Pattern Data
├── App.tsx            # Main Application Component
└── main.tsx          # Entry Point
```

## License

MIT
