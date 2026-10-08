import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart2, Bot, User, Layers } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Power BI Analytics', path: '/powerbi', icon: BarChart2 },
    { name: 'AI Business Assistant', path: '/ai-assistant', icon: Bot },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between p-4 sticky top-0 h-screen">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 px-3 py-4 mb-6 border-b border-slate-800">
          <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-sm font-bold bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Power BI AI
            </h1>
            <p className="text-[10px] text-slate-400 tracking-wider">BUSINESS INTELLIGENCE</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-[11px] text-slate-400">
        <div className="font-semibold text-slate-300 mb-0.5">Django + Supabase + Power BI</div>
        <p className="text-[10px] text-slate-500">Connected to REST API Engine</p>
      </div>
    </aside>
  );
};

export default Sidebar;
