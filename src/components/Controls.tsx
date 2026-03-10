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
