import { type InputHTMLAttributes } from 'react';

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export function SearchInput({
  value,
  onClear,
  className = '',
  ...props
}: SearchInputProps) {
  const hasValue = value !== undefined && value !== '';

  return (
    <div className="relative">
      {/* Search icon */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
        <svg
          className="w-4 h-4 text-surface-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <input
        type="text"
        value={value}
        className={`
          w-full pl-10 pr-10 py-2.5 rounded-xl
          bg-surface-800 border border-surface-700
          text-surface-100 placeholder-surface-500
          text-sm
          outline-none
          transition-colors duration-150
          focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30
          ${className}
        `.trim()}
        {...props}
      />

      {/* Clear button */}
      {hasValue && (
        <button
          type="button"
          onClick={onClear}
          className="
            absolute inset-y-0 right-0 flex items-center pr-3.5
            text-surface-500 hover:text-surface-300
            transition-colors duration-150
          "
          aria-label="Clear search"
        >
          <span className="text-lg leading-none">&times;</span>
        </button>
      )}
    </div>
  );
}
