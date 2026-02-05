interface HeaderProps {
  title: string;
  actions?: React.ReactNode;
}

export function Header({ title, actions }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-surface-950/80 backdrop-blur-md border-b border-surface-800/50">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        <h1 className="text-xl sm:text-2xl font-bold text-surface-100 tracking-tight">
          {title}
        </h1>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
