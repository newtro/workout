interface Tab {
  key: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (key: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex bg-surface-800/50 rounded-xl p-1">
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`
              flex-1 px-4 py-2 rounded-lg text-sm font-semibold
              transition-all duration-200 ease-out
              ${
                isActive
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
                  : 'text-surface-400 hover:text-surface-200'
              }
            `.trim()}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
