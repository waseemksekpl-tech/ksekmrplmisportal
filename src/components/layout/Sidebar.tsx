import React from 'react';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  TrendingUp, 
  Boxes, 
  Truck, 
  Building2, 
  Megaphone, 
  FolderLock, 
  UploadCloud, 
  BarChart3, 
  Users2, 
  ClipboardList, 
  Settings, 
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: string;
  onNavigate?: (view: string) => void;
  setActiveView?: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeView,
  onNavigate,
  setActiveView
}) => {
  const { canAccess, userRole, currentUser } = useAuth();
  const { reports, announcements, dispatches, inventory } = useData();

  const handleSelectView = (viewId: string) => {
    if (onNavigate) onNavigate(viewId);
    else if (setActiveView) setActiveView(viewId);
    onClose();
  };

  const lowStockCount = inventory.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock').length;
  const pendingDispatchCount = dispatches.filter(d => d.status === 'Pending' || d.status === 'Processing').length;
  const urgentAnnouncementCount = announcements.filter(a => a.priority === 'urgent').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      section: 'Core'
    },
    {
      id: 'reports',
      label: 'MIS Reports',
      icon: FileSpreadsheet,
      badge: reports.length > 0 ? reports.length.toString() : undefined,
      section: 'MIS Operations'
    },
    {
      id: 'sales',
      label: 'Sales Analytics',
      icon: TrendingUp,
      section: 'MIS Operations'
    },
    {
      id: 'inventory',
      label: 'Inventory Control',
      icon: Boxes,
      badge: lowStockCount > 0 ? `${lowStockCount} alerts` : undefined,
      badgeColor: lowStockCount > 0 ? 'bg-amber-100 text-amber-800 font-bold' : undefined,
      section: 'MIS Operations'
    },
    {
      id: 'dispatch',
      label: 'Dispatch Logs',
      icon: Truck,
      badge: pendingDispatchCount > 0 ? `${pendingDispatchCount}` : undefined,
      badgeColor: pendingDispatchCount > 0 ? 'bg-blue-100 text-blue-800 font-bold' : undefined,
      section: 'MIS Operations'
    },
    {
      id: 'partners',
      label: 'Partner Network',
      icon: Building2,
      section: 'MIS Operations'
    },
    {
      id: 'announcements',
      label: 'Circulars & Notices',
      icon: Megaphone,
      badge: urgentAnnouncementCount > 0 ? 'Urgent' : undefined,
      badgeColor: 'bg-red-500 text-white font-bold animate-pulse',
      section: 'Communication'
    },
    {
      id: 'documents',
      label: 'Company Documents',
      icon: FolderLock,
      section: 'Communication'
    },
    {
      id: 'publisher',
      label: 'Data Publisher (CSV/XLS)',
      icon: UploadCloud,
      section: 'Data Management'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users2,
      section: 'Administration'
    },
    {
      id: 'audit',
      label: 'Audit & System Logs',
      icon: ClipboardList,
      section: 'Administration'
    },
    {
      id: 'settings',
      label: 'Portal Administration',
      icon: Settings,
      section: 'Administration'
    }
  ];

  // Filter items by user role permissions
  const visibleItems = navItems.filter(item => canAccess(item.id));
  const sections = Array.from(new Set(visibleItems.map(item => item.section)));

  // Get user initials
  const initials = currentUser?.displayName 
    ? currentUser.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'KS';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-[#0F172A] text-slate-300 flex flex-col shrink-0 border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-blue-600 text-white font-black text-xs flex items-center justify-center">KS</span>
              KS ENTERPRISES
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
              MIS Portal • KMR
            </p>
          </div>
          <button
            id="close-sidebar-mobile-btn"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items list */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin scrollbar-thumb-slate-700">
          {sections.map(section => (
            <div key={section} className="space-y-1">
              <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {section}
              </p>
              <div className="space-y-1 mt-1.5">
                {visibleItems
                  .filter(item => item.section === section)
                  .map(item => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`nav-item-${item.id}`}
                        onClick={() => handleSelectView(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-colors cursor-pointer group ${
                          isActive
                            ? 'bg-blue-600 text-white font-medium shadow-xs'
                            : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold shrink-0 ${
                            item.badgeColor || (isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-300')
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer: User Profile Badge */}
        <div className="p-4 border-t border-slate-800 bg-[#0b1120]">
          <div className="flex items-center space-x-3 p-1">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{currentUser?.displayName || 'Super Admin'}</p>
              <p className="text-[10px] text-slate-400 truncate">{currentUser?.email || 'ks.kmr@internal.com'}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
