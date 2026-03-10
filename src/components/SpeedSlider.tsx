interface Props {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export function SpeedSlider({ speed, onSpeedChange }: Props) {
  const genPerSecond = Math.round(1000 / speed);
  
  return (
    <div className="speed-slider">
      <label>
        <span>Speed:</span>
        <input
          type="range"
          min={50}
          max={1000}
          step={50}
          value={1050 - speed}
          onChange={e => onSpeedChange(1050 - Number(e.target.value))}
        />
        <span className="speed-value">{genPerSecond} gen/s</span>
      </label>
    </div>
  );
}
