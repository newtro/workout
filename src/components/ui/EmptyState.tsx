interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <span className="text-6xl mb-4" role="img" aria-hidden="true">
        {icon}
      </span>
      <h3 className="text-xl font-bold text-surface-100 mb-2">{title}</h3>
      <p className="text-sm text-surface-400 max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
