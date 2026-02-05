import { type InputHTMLAttributes, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, className = '', id, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-surface-400"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`
          w-full px-3.5 py-2.5 rounded-xl
          bg-surface-800 border border-surface-700
          text-surface-100 placeholder-surface-500
          text-sm
          outline-none
          transition-colors duration-150
          focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `.trim()}
        {...props}
      />
    </div>
  );
}
