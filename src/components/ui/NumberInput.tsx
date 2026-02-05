interface NumberInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  step?: number;
  min?: number;
  max?: number;
  label?: string;
}

export function NumberInput({
  value,
  onChange,
  step = 1,
  min = 0,
  max,
  label,
}: NumberInputProps) {
  const displayValue = value ?? 0;

  function handleDecrement() {
    const next = displayValue - step;
    if (next < min) return;
    onChange(next);
  }

  function handleIncrement() {
    const next = displayValue + step;
    if (max !== undefined && next > max) return;
    onChange(next);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (raw === '') {
      onChange(null);
      return;
    }
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      if (parsed < min) {
        onChange(min);
      } else if (max !== undefined && parsed > max) {
        onChange(max);
      } else {
        onChange(parsed);
      }
    }
  }

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-surface-400">
          {label}
        </label>
      )}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={displayValue <= min}
          className="
            flex items-center justify-center w-10 h-10 rounded-xl
            bg-surface-700 text-surface-300
            hover:bg-surface-600 hover:text-surface-100
            active:scale-95
            transition-all duration-150
            disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100
            text-lg font-bold
          "
          aria-label="Decrease"
        >
          −
        </button>
        <input
          type="text"
          inputMode="decimal"
          value={value === null ? '' : value}
          onChange={handleInputChange}
          className="
            w-20 h-10 text-center text-lg font-bold rounded-xl
            bg-surface-800 border border-surface-700 text-surface-100
            outline-none
            focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30
            transition-colors duration-150
          "
        />
        <button
          type="button"
          onClick={handleIncrement}
          disabled={max !== undefined && displayValue >= max}
          className="
            flex items-center justify-center w-10 h-10 rounded-xl
            bg-surface-700 text-surface-300
            hover:bg-surface-600 hover:text-surface-100
            active:scale-95
            transition-all duration-150
            disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100
            text-lg font-bold
          "
          aria-label="Increase"
        >
          +
        </button>
      </div>
    </div>
  );
}
