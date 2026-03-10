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
