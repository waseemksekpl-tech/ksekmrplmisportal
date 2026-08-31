import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { LoginView } from './components/auth/LoginView';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DemoBanner } from './components/common/DemoBanner';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';

// Views
import { MainDashboard } from './components/dashboard/MainDashboard';
import { SalesView } from './components/sales/SalesView';
import { InventoryView } from './components/inventory/InventoryView';
import { DispatchView } from './components/dispatch/DispatchView';
import { PartnersView } from './components/partners/PartnersView';
import { ReportsView } from './components/reports/ReportsView';
import { AnnouncementsView } from './components/announcements/AnnouncementsView';
import { DocumentsView } from './components/documents/DocumentsView';
import { DataPublisherView } from './components/publisher/DataPublisherView';
import { UserManagementView } from './components/users/UserManagementView';
import { AuditLogsView } from './components/audit/AuditLogsView';
import { SettingsView } from './components/settings/SettingsView';

const PortalLayout: React.FC = () => {
  const { currentUser, canAccess } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Keyboard shortcut Ctrl+K / Cmd+K for global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!currentUser) {
    return <LoginView />;
  }

  const renderActiveView = () => {
    // Check permission
    if (!canAccess(activeView)) {
      return (
        <div className="bg-white p-8 rounded-xl border border-red-200 text-center max-w-lg mx-auto mt-12 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 font-bold text-lg">
            !
          </div>
          <h2 className="text-base font-bold text-slate-900">Access Restricted</h2>
          <p className="text-xs text-slate-500 mt-1">
            Your current security role does not have authorization to view this module. Please contact your department manager or MIS Admin.
          </p>
          <button
            onClick={() => setActiveView('dashboard')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      );
    }

    switch (activeView) {
      case 'dashboard':
        return <MainDashboard onNavigate={setActiveView} />;
      case 'sales':
        return <SalesView />;
      case 'inventory':
        return <InventoryView />;
      case 'dispatch':
        return <DispatchView />;
      case 'partners':
        return <PartnersView />;
      case 'reports':
        return <ReportsView />;
      case 'announcements':
        return <AnnouncementsView />;
      case 'documents':
        return <DocumentsView />;
      case 'publisher':
        return <DataPublisherView />;
      case 'users':
        return <UserManagementView />;
      case 'audit':
        return <AuditLogsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <MainDashboard onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Top Demo Simulation Banner */}
      <DemoBanner />

      {/* Main App Container */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Navigation */}
        <Sidebar
          activeView={activeView}
          onNavigate={(view) => {
            setActiveView(view);
            setSidebarOpen(false);
          }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header */}
          <Header
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onOpenSearch={() => setSearchOpen(true)}
            onNavigate={setActiveView}
          />

          {/* Main View Area */}
          <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
            {renderActiveView()}
          </main>

          {/* Corporate Footer */}
          <footer className="px-6 py-4 border-t border-slate-200 bg-white text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
            <div>
              <strong>KS ENTERPRISES (KMR) PRIVATE LIMITED</strong> • Internal MIS Management Portal
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span>CIN: U51909MH2018PTC304891</span>
              <span>•</span>
              <span>GSTIN: 27AAACK1928K1Z3</span>
              <span>•</span>
              <span>ISO 9001:2015 Certified Operations</span>
            </div>
          </footer>
        </div>
      </div>

      {/* Global Cross-Module Search Modal */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={(view) => {
          setActiveView(view);
          setSearchOpen(false);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <PortalLayout />
      </DataProvider>
    </AuthProvider>
  );
}
