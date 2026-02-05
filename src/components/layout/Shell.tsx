import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

export function Shell() {
  return (
    <div className="min-h-screen bg-surface-950">
      <Sidebar />
      <main className="lg:ml-64 pb-20 lg:pb-0 min-h-screen">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
