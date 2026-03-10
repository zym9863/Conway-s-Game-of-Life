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
