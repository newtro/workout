type BadgeVariant = 'strength' | 'cardio' | 'hiit' | 'flexibility' | 'custom';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  strength: 'bg-brand-600/20 text-brand-400 border-brand-500/30',
  cardio: 'bg-ocean-600/20 text-ocean-400 border-ocean-500/30',
  hiit: 'bg-energy-600/20 text-energy-400 border-energy-500/30',
  flexibility: 'bg-success-600/20 text-success-400 border-success-500/30',
  custom: 'bg-fire-600/20 text-fire-400 border-fire-500/30',
};

export function Badge({ variant = 'strength', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
        border
        ${variantStyles[variant]}
        ${className}
      `.trim()}
    >
      {children}
    </span>
  );
}
