import React, { useState } from 'react';
import { 
  Building, 
  ShieldCheck, 
  Database, 
  Download, 
  RotateCcw, 
  CheckCircle2, 
  KeyRound, 
  Server, 
  Cpu, 
  FileText,
  Mail,
  MapPin,
  Clock
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { isFirebaseConfigured } from '../../lib/firebase';

export const SettingsView: React.FC = () => {
  const { resetToInitialDemoData, sales, inventory, dispatches, partners, reports } = useData();
  const { currentUser, userRole, isSuperAdmin, isMISAdmin } = useAuth();
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleBackupDownload = () => {
    const backupObj = {
      exportTimestamp: new Date().toISOString(),
      organization: 'KS ENTERPRISES (KMR) PRIVATE LIMITED',
      dataset: {
        sales,
        inventory,
        dispatches,
        partners,
        reports
      }
    };
    const jsonStr = JSON.stringify(backupObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KSE_MIS_Full_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to restore the official KS ENTERPRISES demo dataset? Any temporary records created will be reset to factory defaults.')) {
      resetToInitialDemoData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 4000);
    }
  };

  return (
    <div id="settings-management-section" className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-600" />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Corporate Profile & Portal Administration
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Authorized distributor profile, legal registration credentials, database sync status, and role access privileges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Registration Card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                KS ENTERPRISES (KMR) PRIVATE LIMITED
              </h2>
              <span className="text-xs text-blue-700 font-semibold">
                Apple Authorized Regional Commercial & Retail Distributor
              </span>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-blue-50 text-blue-800 border border-blue-200">
              Verified Enterprise
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block">Corporate Identification (CIN)</span>
              <strong className="text-slate-900 font-mono text-sm">U51909MH2018PTC304891</strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block">Principal GSTIN Number</span>
              <strong className="text-slate-900 font-mono text-sm">27AAACK1928K1Z3</strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block">Permanent Account Number (PAN)</span>
              <strong className="text-slate-900 font-mono text-sm">AAACK1928K</strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block">Authorized Distribution Tier</span>
              <strong className="text-slate-900 text-sm">Tier-1 Apple Authorized National</strong>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex items-start gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Head Office:</strong> Tower B, 8th Floor, Commercial Gateway Complex, Andheri-Kurla Road, Mumbai, Maharashtra 400059
              </div>
            </div>

            <div className="flex items-start gap-2 text-slate-700">
              <Building className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Central Logistics Hub:</strong> Logistics Park Phase 2, Unit 4B-4E, Bhiwandi, Thane, Maharashtra 421302
              </div>
            </div>

            <div className="flex items-start gap-2 text-slate-700">
              <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Internal MIS Contact:</strong> mis.admin@ksenterprises.co.in | contact@ksenterprises.co.in
              </div>
            </div>
          </div>
        </div>

        {/* Current Active Session & Security */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-200">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Active Operator Session
            </h3>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <span className="text-slate-500">Logged in Operator:</span>
                <p className="font-bold text-slate-900">{currentUser?.displayName}</p>
                <p className="text-slate-400 font-mono text-[11px]">{currentUser?.email}</p>
              </div>

              <div>
                <span className="text-slate-500">Security Clearance:</span>
                <p className="font-semibold text-blue-700 capitalize mt-0.5">
                  {userRole.replace(/_/g, ' ')}
                </p>
              </div>

              <div>
                <span className="text-slate-500">Session Mode:</span>
                <p className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Authenticated Company VPN
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500">
            Internal MIS Portal v2.6.4 (Production Build). Access is strictly restricted to authorized employees.
          </div>
        </div>
      </div>

      {/* Database Backup & Disaster Recovery */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Database Synchronization & Backups</h3>
          </div>
          <span className="text-xs text-slate-500">
            {isFirebaseConfigured() ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Firebase Firestore Connected
              </span>
            ) : (
              <span className="text-blue-700 font-semibold flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> Client Local Engine Active
              </span>
            )}
          </span>
        </div>

        <p className="text-xs text-slate-600">
          All changes made to sales invoices, inventory records, dispatch consignments, dealer accounts, reports, and announcements are stored locally and synced automatically with Firebase Firestore when enabled.
        </p>

        {resetSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Clean demo dataset restored successfully!
          </div>
        )}

        <div className="flex items-center gap-3 pt-2 flex-wrap">
          <button
            onClick={handleBackupDownload}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Full JSON Database Backup</span>
          </button>

          {(isSuperAdmin || isMISAdmin) && (
            <button
              onClick={handleResetData}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Reset to Clean Factory Dataset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
