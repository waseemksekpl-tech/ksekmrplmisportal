import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  ChevronDown, 
  ShieldAlert, 
  FileText, 
  PlusCircle, 
  Layers, 
  Check, 
  Building2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onOpenQuickPublish?: () => void;
  activeView?: string;
  setActiveView?: (view: string) => void;
  onNavigate?: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onOpenSearch,
  onOpenQuickPublish,
  activeView,
  setActiveView,
  onNavigate
}) => {
  const { currentUser, logout, isMISAdmin, userRole } = useAuth();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useData();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNav = (view: string) => {
    if (onNavigate) onNavigate(view);
    else if (setActiveView) setActiveView(view);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header id="app-header" className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left / Search trigger */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          id="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div 
          onClick={onOpenSearch}
          className="flex items-center space-x-3 bg-slate-100 hover:bg-slate-200/70 px-3.5 py-2 rounded-md w-64 sm:w-80 md:w-96 border border-slate-200 transition-colors cursor-pointer group"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
          <span className="text-xs text-slate-500 truncate flex-1">Search sales, partners, or inventory records...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-300 rounded shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right section: Badge, Notifications, Distributor tag, and User menu */}
      <div className="flex items-center space-x-3 sm:space-x-5">
        {/* Distributor Panel Tag */}
        <div className="hidden sm:flex items-center px-3 py-1 bg-slate-100 border border-slate-200 rounded text-[11px] font-bold text-slate-600 uppercase tracking-wide">
          DISTRIBUTOR PANEL
        </div>

        {/* Quick Publish if MIS Admin */}
        {isMISAdmin && onOpenQuickPublish && (
          <button
            id="quick-publish-report-btn"
            onClick={onOpenQuickPublish}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Publish</span>
          </button>
        )}

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            id="notifications-bell-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute 1.5 top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            )}
          </button>

          {showNotifications && (
            <div id="notifications-dropdown-menu" className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Internal Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No active notifications.
                  </div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer text-xs ${!n.isRead ? 'bg-blue-50/40' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-900">{n.title}</span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            id="user-profile-menu-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {currentUser?.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
            </div>
            <span className="text-xs font-semibold text-slate-800 hidden md:inline">
              {currentUser?.displayName?.split(' ')[0]}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          </button>

          {showUserMenu && (
            <div id="user-dropdown-menu" className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="font-bold text-slate-900">{currentUser?.displayName}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser?.email}</p>
                <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider mt-1">
                  {userRole.replace(/_/g, ' ')}
                </p>
              </div>

              <button
                onClick={() => {
                  handleNav('settings');
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Portal Settings</span>
              </button>

              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-slate-100"
              >
                <LogOut className="w-3.5 h-3.5 text-red-500" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
