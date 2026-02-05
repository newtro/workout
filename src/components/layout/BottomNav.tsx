import { NavLink } from 'react-router';

interface TabItem {
  to: string;
  label: string;
  icon: string;
}

const tabs: TabItem[] = [
  { to: '/', label: 'Home', icon: '⌂' },
  { to: '/log', label: 'Log', icon: '🏋' },
  { to: '/history', label: 'History', icon: '⏱' },
  { to: '/progress', label: 'Progress', icon: '📊' },
  { to: '/exercises', label: 'Exercises', icon: '☰' },
];

export function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-900/95 backdrop-blur-md border-t border-surface-800">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-[3.5rem] ${
                isActive
                  ? 'text-brand-400'
                  : 'text-surface-500 hover:text-surface-300'
              }`
            }
          >
            <span className="text-xl leading-none">{tab.icon}</span>
            <span className="text-[10px] font-medium leading-none">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
