import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Building2, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-slate-900/90 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
      <div className="flex items-center space-x-3">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5" />
          {user?.profile?.company?.name || 'Acme Analytics'}
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3 pl-4 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-200">{user?.username}</div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Shield className="w-2.5 h-2.5 text-emerald-400" />
              {user?.profile?.role || 'ANALYST'}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          title="Sign Out"
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
