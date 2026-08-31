import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Filter, 
  PlusCircle, 
  Download, 
  Eye, 
  Trash2, 
  Building2, 
  Calendar, 
  CheckCircle, 
  Lock, 
  FileText,
  FileCode,
  Tag,
  Share2,
  Sparkles
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { MISReport, ReportType } from '../../types';
import { PublishReportModal } from './PublishReportModal';
import { ReportDetailModal } from './ReportDetailModal';

export const ReportsView: React.FC = () => {
  const { reports, deleteReport } = useData();
  const { isMISAdmin, userRole } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<MISReport | null>(null);

  // Filter reports
  const filteredReports = reports.filter(r => {
    // Role access filter
    if (r.accessLevel === 'admin_only' && userRole !== 'super_admin') return false;
    if (r.accessLevel === 'mis_only' && !isMISAdmin) return false;
    if (r.accessLevel === 'managers_and_up' && userRole === 'employee') return false;

    // Search query
    const matchSearch = !searchQuery || 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reportingPeriod.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());

    // Type filter
    const matchType = selectedType === 'all' || r.reportType === selectedType;

    // Department filter
    const matchDept = selectedDept === 'all' || r.department === selectedDept;

    return matchSearch && matchType && matchDept;
  });

  const getReportTypeBadge = (type: ReportType) => {
    const colors: Record<string, string> = {
      daily_sales: 'bg-blue-50 text-blue-700 border-blue-200',
      monthly_sales: 'bg-purple-50 text-purple-700 border-purple-200',
      stock_inventory: 'bg-amber-50 text-amber-700 border-amber-200',
      dispatch_logistics: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      outstanding_tally: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      partner_performance: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      gst_compliance: 'bg-rose-50 text-rose-700 border-rose-200',
      operational: 'bg-slate-50 text-slate-700 border-slate-200'
    };
    return (
      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${colors[type] || 'bg-slate-100 text-slate-800'}`}>
        {type.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div id="mis-reports-section" className="space-y-6">
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">MIS Reports Repository</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official business, sales, stock, tally reconciliation, and operational reports published by MIS department.
          </p>
        </div>

        {isMISAdmin && (
          <button
            id="publish-report-btn"
            onClick={() => setIsPublishModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish New MIS Report</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="search-reports-input"
            type="text"
            placeholder="Search reports by title, period, author, or keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            id="filter-report-type"
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Report Types</option>
            <option value="daily_sales">Daily Sales Flash</option>
            <option value="monthly_sales">Monthly Performance</option>
            <option value="stock_inventory">Stock & Inventory</option>
            <option value="dispatch_logistics">Dispatch & Logistics</option>
            <option value="outstanding_tally">Outstanding & Tally</option>
            <option value="partner_performance">Partner Performance</option>
            <option value="gst_compliance">GST Compliance</option>
            <option value="operational">Operational Updates</option>
          </select>

          <select
            id="filter-report-dept"
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Departments</option>
            <option value="MIS & IT">MIS & IT</option>
            <option value="Sales & Distribution">Sales & Distribution</option>
            <option value="Inventory & Logistics">Inventory & Logistics</option>
            <option value="Finance & Accounts">Finance & Accounts</option>
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReports.length === 0 ? (
          <div className="col-span-full py-16 bg-white rounded-xl border border-slate-200 text-center p-8">
            <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">No reports matched your filters</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting search filters or publish a new report.</p>
          </div>
        ) : (
          filteredReports.map(report => (
            <div
              key={report.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  {getReportTypeBadge(report.reportType)}
                  <span className="text-[11px] text-slate-400 font-medium">
                    {new Date(report.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>

                <h3 
                  onClick={() => setSelectedReport(report)}
                  className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors line-clamp-2"
                >
                  {report.title}
                </h3>
                
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                  {report.description}
                </p>

                {report.summaryMetrics?.highlightText && (
                  <div className="mt-3 p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900 font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="line-clamp-1">{report.summaryMetrics.highlightText}</span>
                  </div>
                )}
              </div>

              <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">{report.reportingPeriod}</span>
                  <span className="block text-[10px] text-slate-400">By {report.uploadedBy}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-colors"
                    title="View details & data preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      // Simulated safe download trigger
                      const blob = new Blob([`KS ENTERPRISES (KMR) PVT LTD - MIS REPORT\nTitle: ${report.title}\nPeriod: ${report.reportingPeriod}\nPublished by: ${report.uploadedBy}\nSummary: ${report.description}`], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = report.fileName || `${report.id}.txt`;
                      a.click();
                    }}
                    className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                    title="Download Report File"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {isMISAdmin && (
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete report "${report.title}"?`)) {
                          deleteReport(report.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-300 transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Publish Modal */}
      {isPublishModalOpen && (
        <PublishReportModal onClose={() => setIsPublishModalOpen(false)} />
      )}

      {/* Detail & Download Modal */}
      {selectedReport && (
        <ReportDetailModal 
          report={selectedReport} 
          onClose={() => setSelectedReport(null)} 
        />
      )}
    </div>
  );
};
