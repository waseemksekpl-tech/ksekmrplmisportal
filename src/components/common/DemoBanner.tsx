import React, { useState } from 'react';
import { ShieldCheck, UserCheck, RefreshCw, X, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const DemoBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const { userRole, switchDemoRole, currentUser } = useAuth();
  const { resetToDefaultDemoData } = useData();
  const [seeding, setSeeding] = useState(false);

  if (dismissed) return null;

  const handleReset = async () => {
    setSeeding(true);
    await resetToDefaultDemoData();
    setTimeout(() => setSeeding(false), 600);
  };

  return (
    <div id="demo-banner-container" className="bg-slate-900 text-slate-100 px-4 py-2 text-xs border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-inner">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          DEMO DATA ACTIVE
        </span>
        <span className="text-slate-300">
          Viewing: <strong className="text-white">{currentUser?.displayName}</strong> ({currentUser?.email})
        </span>
        <span className="hidden md:inline text-slate-500">•</span>
        <span className="text-slate-400 hidden lg:inline">
          KS ENTERPRISES (KMR) PRIVATE LIMITED — Apple Authorized Regional Distributor Internal MIS
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-slate-400 font-medium">Switch Role:</span>
        <div className="inline-flex rounded-md bg-slate-800 p-0.5 border border-slate-700">
          <button
            id="role-super-admin-btn"
            onClick={() => switchDemoRole('super_admin')}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              userRole === 'super_admin' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
            title="Full Administrator access"
          >
            Super Admin
          </button>
          <button
            id="role-mis-admin-btn"
            onClick={() => switchDemoRole('mis_admin')}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              userRole === 'mis_admin' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
            title="MIS Department Lead (Publish Reports, CSV Imports)"
          >
            MIS Admin
          </button>
          <button
            id="role-manager-btn"
            onClick={() => switchDemoRole('manager')}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              userRole === 'manager' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
            title="Operations Manager (View Reports, Dispatches)"
          >
            Manager
          </button>
          <button
            id="role-employee-btn"
            onClick={() => switchDemoRole('employee')}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              userRole === 'employee' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
            title="Field Sales / Employee (Restricted View)"
          >
            Employee
          </button>
        </div>

        <button
          id="reload-demo-data-btn"
          onClick={handleReset}
          disabled={seeding}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-colors cursor-pointer"
          title="Reset tables to realistic Apple Regional Distributor data"
        >
          <RefreshCw className={`w-3 h-3 ${seeding ? 'animate-spin' : ''}`} />
          <span>{seeding ? 'Resetting...' : 'Reset Demo Data'}</span>
        </button>

        <button
          id="dismiss-demo-banner-btn"
          onClick={() => setDismissed(true)}
          className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors ml-1"
          title="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
