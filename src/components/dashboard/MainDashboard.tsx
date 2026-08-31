import React from 'react';
import { 
  TrendingUp, 
  Boxes, 
  Truck, 
  Building2, 
  FileSpreadsheet, 
  AlertTriangle, 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  Clock, 
  Download, 
  ExternalLink, 
  Megaphone, 
  UploadCloud,
  ChevronRight,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

interface MainDashboardProps {
  onNavigate: (view: string, itemId?: string) => void;
  onOpenQuickPublish?: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  onNavigate,
  onOpenQuickPublish = () => onNavigate('publisher')
}) => {
  const { currentUser, isMISAdmin, userRole } = useAuth();
  const { 
    reports, 
    announcements, 
    sales, 
    inventory, 
    dispatches, 
    partners 
  } = useData();

  // Metrics calculations
  const totalSalesRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalSalesUnits = sales.reduce((sum, s) => sum + s.quantity, 0);
  
  // Today's sales (simulated with latest date 2026-08-28)
  const todaySales = sales.filter(s => s.date === '2026-08-28');
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.totalAmount, 0);
  const todayUnits = todaySales.reduce((sum, s) => sum + s.quantity, 0);

  const totalStockUnits = inventory.reduce((sum, i) => sum + i.quantity, 0);
  const totalStockValue = inventory.reduce((sum, i) => sum + (i.quantity * i.unitCost), 0);
  const lowStockItems = inventory.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock');

  const pendingDispatches = dispatches.filter(d => d.status === 'Pending' || d.status === 'Processing');
  const completedDispatches = dispatches.filter(d => d.status === 'Delivered');

  const activePartnersCount = partners.filter(p => p.status === 'Active').length;
  const totalOutstanding = partners.reduce((sum, p) => sum + p.outstandingAmount, 0);

  // Urgent announcement banner
  const urgentAnnouncement = announcements.find(a => a.priority === 'urgent');

  // Chart data: Daily sales trend
  const dailySalesTrendData = [
    { day: '23 Aug', revenue: 1746500, units: 35, target: 2000000 },
    { day: '24 Aug', revenue: 1194000, units: 60, target: 2000000 },
    { day: '25 Aug', revenue: 570000, units: 300, target: 1500000 },
    { day: '26 Aug', revenue: 9390500, units: 95, target: 8000000 },
    { day: '27 Aug', revenue: 5685000, units: 150, target: 5000000 },
    { day: '28 Aug', revenue: 12163500, units: 115, target: 10000000 },
  ];

  // Category performance
  const categoryMap: Record<string, number> = {};
  sales.forEach(s => {
    categoryMap[s.category] = (categoryMap[s.category] || 0) + s.totalAmount;
  });
  const categoryData = Object.keys(categoryMap).map(cat => ({
    name: cat,
    value: categoryMap[cat]
  }));

  const COLORS = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2', '#4f46e5'];

  // Warehouse breakdown
  const warehouseMap: Record<string, number> = {};
  inventory.forEach(i => {
    const hubName = i.warehouseLocation.split('(')[0].trim();
    warehouseMap[hubName] = (warehouseMap[hubName] || 0) + i.quantity;
  });
  const warehouseData = Object.keys(warehouseMap).map(wh => ({
    name: wh.replace('Hub', '').replace('Regional Warehouse', 'Delhi').replace('Depot', '').trim(),
    units: warehouseMap[wh]
  }));

  return (
    <div id="main-dashboard-view" className="space-y-6">
      {/* Top Welcome & Operational Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              Operational Dashboard
            </h2>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
              FY 2026-27 (Q2)
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Apple Authorized Regional Distribution Metrics • Real-time Data Feed
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-left md:text-right border-l md:border-l-0 md:border-r border-slate-200 pl-3 md:pl-0 md:pr-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Synced</p>
            <p className="text-xs font-bold text-slate-700 uppercase mt-0.5">Aug 28, 2026 | 09:42 AM</p>
          </div>

          {isMISAdmin && (
            <div className="flex items-center gap-2">
              <button
                id="dashboard-publish-report-btn"
                onClick={onOpenQuickPublish}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish Report</span>
              </button>
              <button
                id="dashboard-import-csv-btn"
                onClick={() => onNavigate('publisher')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
              >
                <UploadCloud className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">Import CSV</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Urgent Announcement Alert Banner */}
      {urgentAnnouncement && (
        <div 
          onClick={() => onNavigate('announcements', urgentAnnouncement.id)}
          className="bg-slate-50 border-2 border-dashed border-slate-300 p-4 rounded-xl flex items-center justify-between gap-4 cursor-pointer hover:border-slate-400 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold shrink-0">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-600 text-white">
                  URGENT NOTICE
                </span>
                <span className="text-xs font-bold text-slate-900">{urgentAnnouncement.title}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 line-clamp-1">{urgentAnnouncement.content}</p>
            </div>
          </div>
          <button className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 shrink-0">
            Read Circular
          </button>
        </div>
      )}

      {/* Primary KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div 
          onClick={() => onNavigate('sales')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">TOTAL REVENUE (MTD)</p>
              <div className="p-1.5 rounded-md bg-blue-50 text-blue-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-1">₹4.82 Cr</p>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
            <span className="text-emerald-600 font-medium flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12.4% vs last mo
            </span>
            <span>Target: ₹5.00 Cr</span>
          </div>
        </div>

        {/* Current Stock */}
        <div 
          onClick={() => onNavigate('inventory')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">ACTIVE STOCK UNITS</p>
              <div className="p-1.5 rounded-md bg-amber-50 text-amber-600">
                <Boxes className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalStockUnits.toLocaleString('en-IN')}</p>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
            <span className="text-slate-600 font-medium">Val: ₹{(totalStockValue / 10000000).toFixed(2)} Cr</span>
            {lowStockItems.length > 0 ? (
              <span className="text-amber-600 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {lowStockItems.length} Low
              </span>
            ) : (
              <span className="text-emerald-600 font-medium">Optimal</span>
            )}
          </div>
        </div>

        {/* Pending Dispatches */}
        <div 
          onClick={() => onNavigate('dispatch')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">PENDING DISPATCHES</p>
              <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-600">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-1">{pendingDispatches.length} Orders</p>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
            <span className="text-slate-600 font-medium">{completedDispatches.length} Delivered Today</span>
            <span className="text-emerald-600 font-medium">99.2% SLA</span>
          </div>
        </div>

        {/* Authorized Partners */}
        <div 
          onClick={() => onNavigate('partners')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">AUTHORISED PARTNERS</p>
              <div className="p-1.5 rounded-md bg-purple-50 text-purple-600">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-1">{partners.length} Active</p>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
            <span className="text-slate-600 font-medium">{partners.filter(p => p.tier === 'Platinum' || p.tier === 'Diamond').length} Tier-1 Dealers</span>
            <span className="text-slate-500">Regional Tier</span>
          </div>
        </div>
      </div>

      {/* Two Column Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Sales Trend Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h4 className="font-bold text-slate-800 uppercase text-xs tracking-widest">
                Weekly Sales Trend (iPhone / Mac / iPad)
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Billed revenue vs target over last 7 days</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-3 h-3 rounded bg-blue-600 inline-block"></span> Actual
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-400">
                <span className="w-3 h-0.5 bg-slate-400 inline-block"></span> Target
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailySalesTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={val => `₹${(val / 100000).toFixed(0)}L`} 
                />
                <Tooltip 
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" name="Billed Revenue" />
                <Area type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1.5} fill="none" name="Daily Target" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Donut Chart (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between p-6">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-bold text-slate-800 uppercase text-xs tracking-widest">
                Category Share
              </h4>
              <span className="text-[11px] font-semibold text-slate-400">Apple Portfolio</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">Revenue split across product lines</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`₹${(Number(value) / 100000).toFixed(1)} Lakh`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-3 border-t border-slate-100">
            {categoryData.slice(0, 4).map((c, i) => (
              <div key={c.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                <span className="text-slate-600 truncate">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Published Reports & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent MIS Reports (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-blue-600" />
              <h4 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Recent MIS Reports</h4>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All ({reports.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {reports.slice(0, 4).map(report => (
              <div
                key={report.id}
                onClick={() => onNavigate('reports', report.id)}
                className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {report.reportType.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {report.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{report.description}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                    <span>Period: <strong className="text-slate-600">{report.reportingPeriod}</strong></span>
                    <span>•</span>
                    <span>By: {report.uploadedBy}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {report.fileName && (
                    <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200 font-medium">
                      {report.fileSize}
                    </span>
                  )}
                  <button 
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Open Report"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Announcements Bulletin (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-slate-700" />
              <h4 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Internal Circulars</h4>
            </div>
            <button
              onClick={() => onNavigate('announcements')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              All Notices →
            </button>
          </div>

          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
            {announcements.slice(0, 3).map(ann => (
              <div 
                key={ann.id}
                onClick={() => onNavigate('announcements', ann.id)}
                className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    ann.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    ann.priority === 'important' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {ann.priority}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(ann.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{ann.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{ann.content}</p>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <button
              onClick={() => onNavigate('announcements')}
              className="text-xs font-semibold text-slate-700 hover:text-blue-600"
            >
              Post or Browse Company Notices →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
