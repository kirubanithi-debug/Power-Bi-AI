import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Building2, Mail, Calendar, Key } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100">User Profile</h1>
        <p className="text-xs text-slate-400">Account credentials, permissions & organization settings</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6">
        <div className="flex items-center space-x-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-lg">
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">{user?.username}</h2>
            <p className="text-xs text-slate-400">{user?.email || 'analyst@acme.com'}</p>
            <span className="inline-block mt-2 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Role: {user?.profile?.role || 'ANALYST'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-500 flex items-center gap-1.5"><Building2 className="w-4 h-4 text-blue-400" /> Organization</span>
            <div className="font-semibold text-slate-200">{user?.profile?.company?.name || 'Acme Analytics Enterprise'}</div>
          </div>
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-500 flex items-center gap-1.5"><Shield className="w-4 h-4 text-indigo-400" /> Department</span>
            <div className="font-semibold text-slate-200">{user?.profile?.department || 'Business Intelligence & Strategy'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
