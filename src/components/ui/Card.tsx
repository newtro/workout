interface CardProps {
  children: React.ReactNode;
  gradient?: boolean;
  className?: string;
}

export function Card({ children, gradient = false, className = '' }: CardProps) {
  if (gradient) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-brand-500 via-energy-500 to-fire-500 p-px">
        <div className={`bg-surface-900 rounded-2xl p-5 ${className}`}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-surface-900 rounded-2xl p-5 border border-surface-800 ${className}`}
    >
      {children}
    </div>
  );
}
