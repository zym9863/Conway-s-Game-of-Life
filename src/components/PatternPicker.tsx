import type { Pattern } from '../types';

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
