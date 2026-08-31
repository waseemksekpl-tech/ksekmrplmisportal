import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  FileSpreadsheet, 
  Boxes, 
  Truck, 
  Building2, 
  Megaphone, 
  FolderLock, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, itemId?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { reports, sales, inventory, dispatches, partners, announcements, documents } = useData();
  const { canAccess } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered from parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Search across modules guarded by permission
  const matchingReports = canAccess('reports') && cleanQuery
    ? reports.filter(r => 
        r.title.toLowerCase().includes(cleanQuery) || 
        r.description.toLowerCase().includes(cleanQuery) ||
        r.reportingPeriod.toLowerCase().includes(cleanQuery) ||
        r.reportType.toLowerCase().includes(cleanQuery)
      ).slice(0, 4)
    : [];

  const matchingInventory = canAccess('inventory') && cleanQuery
    ? inventory.filter(i => 
        i.productName.toLowerCase().includes(cleanQuery) ||
        i.sku.toLowerCase().includes(cleanQuery) ||
        i.category.toLowerCase().includes(cleanQuery) ||
        i.warehouseLocation.toLowerCase().includes(cleanQuery)
      ).slice(0, 4)
    : [];

  const matchingDispatches = canAccess('dispatch') && cleanQuery
    ? dispatches.filter(d => 
        d.dispatchId.toLowerCase().includes(cleanQuery) ||
        d.partnerName.toLowerCase().includes(cleanQuery) ||
        d.destination.toLowerCase().includes(cleanQuery) ||
        d.trackingNumber.toLowerCase().includes(cleanQuery)
      ).slice(0, 4)
    : [];

  const matchingPartners = canAccess('partners') && cleanQuery
    ? partners.filter(p => 
        p.partnerName.toLowerCase().includes(cleanQuery) ||
        p.partnerCode.toLowerCase().includes(cleanQuery) ||
        p.gstNumber.toLowerCase().includes(cleanQuery) ||
        p.city.toLowerCase().includes(cleanQuery)
      ).slice(0, 4)
    : [];

  const matchingAnnouncements = canAccess('announcements') && cleanQuery
    ? announcements.filter(a => 
        a.title.toLowerCase().includes(cleanQuery) ||
        a.content.toLowerCase().includes(cleanQuery)
      ).slice(0, 4)
    : [];

  const matchingSales = canAccess('sales') && cleanQuery
    ? sales.filter(s => 
        s.invoiceNumber.toLowerCase().includes(cleanQuery) ||
        s.partnerName.toLowerCase().includes(cleanQuery) ||
        s.productName.toLowerCase().includes(cleanQuery) ||
        s.sku.toLowerCase().includes(cleanQuery)
      ).slice(0, 4)
    : [];

  const matchingDocuments = canAccess('documents') && cleanQuery
    ? documents.filter(d => 
        d.name.toLowerCase().includes(cleanQuery) ||
        d.category.toLowerCase().includes(cleanQuery)
      ).slice(0, 4)
    : [];

  const totalResults = matchingReports.length + matchingInventory.length + matchingDispatches.length + matchingPartners.length + matchingAnnouncements.length + matchingSales.length + matchingDocuments.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-100">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden mt-10 sm:mt-16"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 border-b border-slate-200 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            placeholder="Search reports, Apple SKUs, dispatches, GST numbers, partners..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full py-4 pl-3 pr-10 text-sm bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-slate-600 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs text-slate-400 bg-slate-200 hover:bg-slate-300 rounded font-medium"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!cleanQuery ? (
            <div className="py-8 text-center text-slate-400">
              <p className="text-sm font-medium text-slate-600">Type a keyword to search authorized company records</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs">
                <span className="px-2 py-1 bg-slate-100 rounded text-slate-500">"iPhone 16 Pro"</span>
                <span className="px-2 py-1 bg-slate-100 rounded text-slate-500">"Daily Sales"</span>
                <span className="px-2 py-1 bg-slate-100 rounded text-slate-500">"Unicorn"</span>
                <span className="px-2 py-1 bg-slate-100 rounded text-slate-500">"Blue Dart"</span>
                <span className="px-2 py-1 bg-slate-100 rounded text-slate-500">"MacBook"</span>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              No matching records found for "{query}".
            </div>
          ) : (
            <div className="space-y-4">
              {/* Reports */}
              {matchingReports.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-blue-500" />
                    MIS Reports ({matchingReports.length})
                  </div>
                  <div className="space-y-1">
                    {matchingReports.map(r => (
                      <div
                        key={r.id}
                        onClick={() => { onNavigate('reports', r.id); onClose(); }}
                        className="p-2.5 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors border border-slate-100 flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-900 group-hover:text-blue-700">{r.title}</p>
                          <p className="text-[11px] text-slate-500">{r.reportingPeriod} • {r.uploadedBy}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inventory */}
              {matchingInventory.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <Boxes className="w-3.5 h-3.5 text-amber-500" />
                    Inventory & Stock ({matchingInventory.length})
                  </div>
                  <div className="space-y-1">
                    {matchingInventory.map(item => (
                      <div
                        key={item.id}
                        onClick={() => { onNavigate('inventory', item.id); onClose(); }}
                        className="p-2.5 rounded-lg hover:bg-amber-50 cursor-pointer transition-colors border border-slate-100 flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-900 group-hover:text-amber-800">{item.productName}</p>
                          <p className="text-[11px] text-slate-500">SKU: {item.sku} • Stock: <span className="font-semibold text-slate-700">{item.quantity} units</span> ({item.status})</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dispatches */}
              {matchingDispatches.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <Truck className="w-3.5 h-3.5 text-emerald-500" />
                    Dispatches & Logistics ({matchingDispatches.length})
                  </div>
                  <div className="space-y-1">
                    {matchingDispatches.map(d => (
                      <div
                        key={d.id}
                        onClick={() => { onNavigate('dispatch', d.id); onClose(); }}
                        className="p-2.5 rounded-lg hover:bg-emerald-50 cursor-pointer transition-colors border border-slate-100 flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-900 group-hover:text-emerald-800">{d.dispatchId} — {d.partnerName}</p>
                          <p className="text-[11px] text-slate-500">{d.destination} • {d.carrier} ({d.trackingNumber}) • {d.status}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Partners */}
              {matchingPartners.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <Building2 className="w-3.5 h-3.5 text-purple-500" />
                    Partners & Dealers ({matchingPartners.length})
                  </div>
                  <div className="space-y-1">
                    {matchingPartners.map(p => (
                      <div
                        key={p.id}
                        onClick={() => { onNavigate('partners', p.id); onClose(); }}
                        className="p-2.5 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors border border-slate-100 flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-900 group-hover:text-purple-800">{p.partnerName} ({p.partnerCode})</p>
                          <p className="text-[11px] text-slate-500">GST: {p.gstNumber} • {p.city} • Outstanding: ₹{(p.outstandingAmount / 100000).toFixed(1)}L</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Announcements */}
              {matchingAnnouncements.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <Megaphone className="w-3.5 h-3.5 text-rose-500" />
                    Announcements ({matchingAnnouncements.length})
                  </div>
                  <div className="space-y-1">
                    {matchingAnnouncements.map(a => (
                      <div
                        key={a.id}
                        onClick={() => { onNavigate('announcements', a.id); onClose(); }}
                        className="p-2.5 rounded-lg hover:bg-rose-50 cursor-pointer transition-colors border border-slate-100 flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-900 group-hover:text-rose-800">{a.title}</p>
                          <p className="text-[11px] text-slate-500">{a.targetAudience} • {a.priority.toUpperCase()}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Role permissions enforced on search queries</span>
          <span>Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
