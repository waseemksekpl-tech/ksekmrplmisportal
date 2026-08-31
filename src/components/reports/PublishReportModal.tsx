import React, { useState } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Upload, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Paperclip,
  Building2
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ReportType, AccessLevel } from '../../types';

interface PublishReportModalProps {
  onClose: () => void;
}

export const PublishReportModal: React.FC<PublishReportModalProps> = ({ onClose }) => {
  const { addReport } = useData();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [reportType, setReportType] = useState<ReportType>('daily_sales');
  const [reportingPeriod, setReportingPeriod] = useState(
    new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
  );
  const [department, setDepartment] = useState('MIS & IT');
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('all_authorized');
  const [description, setDescription] = useState('');
  const [highlightText, setHighlightText] = useState('');
  const [revenueValue, setRevenueValue] = useState('');
  const [unitsValue, setUnitsValue] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setSubmitting(true);
    await addReport({
      title,
      description,
      reportType,
      reportingPeriod,
      department,
      accessLevel,
      status: 'published',
      uploadedBy: currentUser?.displayName || 'MIS Admin',
      authorUid: currentUser?.uid || 'mis_admin',
      fileName: fileName || `${title.replace(/\s+/g, '_')}_${Date.now().toString().slice(-4)}.xlsx`,
      fileSize: fileSize || '2.4 MB',
      fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      summaryMetrics: {
        totalRevenue: revenueValue ? Number(revenueValue) : undefined,
        totalUnits: unitsValue ? Number(unitsValue) : undefined,
        highlightText: highlightText || undefined
      }
    });
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-100">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600 text-white">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Publish MIS Report</h2>
              <p className="text-xs text-slate-300">KS ENTERPRISES (KMR) PRIVATE LIMITED — MIS Control</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Report Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Daily Sales & Dispatch Flash — 29 Aug 2026"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Report Type *
              </label>
              <select
                value={reportType}
                onChange={e => setReportType(e.target.value as ReportType)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily_sales">Daily Sales Flash</option>
                <option value="monthly_sales">Monthly Performance</option>
                <option value="stock_inventory">Stock & Inventory MIS</option>
                <option value="dispatch_logistics">Dispatch & Logistics</option>
                <option value="outstanding_tally">Outstanding & Tally Reconciliation</option>
                <option value="partner_performance">Partner / Dealer Sales</option>
                <option value="gst_compliance">GST Summary & Audit</option>
                <option value="operational">Operational Bulletin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reporting Period *
              </label>
              <input
                type="text"
                required
                value={reportingPeriod}
                onChange={e => setReportingPeriod(e.target.value)}
                placeholder="e.g. 29 Aug 2026 or August 2026"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="MIS & IT">MIS & IT</option>
                <option value="Sales & Distribution">Sales & Distribution</option>
                <option value="Inventory & Logistics">Inventory & Logistics</option>
                <option value="Finance & Accounts">Finance & Accounts</option>
                <option value="Executive Management">Executive Management</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Access Permission Level *
              </label>
              <select
                value={accessLevel}
                onChange={e => setAccessLevel(e.target.value as AccessLevel)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all_authorized">All Authorized Employees</option>
                <option value="managers_and_up">Managers & Above</option>
                <option value="mis_only">MIS Department Only</option>
                <option value="admin_only">Super Admin Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Executive Summary / Key Findings *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide a concise briefing on the figures, key trends, achievements, or operational notes..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Headline Highlight
              </label>
              <input
                type="text"
                value={highlightText}
                onChange={e => setHighlightText(e.target.value)}
                placeholder="e.g. ₹1.45 Cr daily billing"
                className="w-full px-2.5 py-1.5 text-xs bg-white rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Total Revenue (₹)
              </label>
              <input
                type="number"
                value={revenueValue}
                onChange={e => setRevenueValue(e.target.value)}
                placeholder="e.g. 14500000"
                className="w-full px-2.5 py-1.5 text-xs bg-white rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Total Quantity (Units)
              </label>
              <input
                type="number"
                value={unitsValue}
                onChange={e => setUnitsValue(e.target.value)}
                placeholder="e.g. 165"
                className="w-full px-2.5 py-1.5 text-xs bg-white rounded border border-slate-300"
              />
            </div>
          </div>

          {/* File attachment area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Attach Excel / CSV / PDF Data File
            </label>
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer relative"
            >
              <input
                type="file"
                id="report-file-input"
                onChange={handleFileInput}
                accept=".xlsx,.xls,.csv,.pdf"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="w-7 h-7 text-slate-400 mx-auto mb-2" />
              {fileName ? (
                <div className="text-xs font-bold text-blue-600 flex items-center justify-center gap-2">
                  <Paperclip className="w-4 h-4" />
                  <span>{fileName} ({fileSize})</span>
                </div>
              ) : (
                <>
                  <p className="text-xs font-medium text-slate-700">
                    Click to browse or drag and drop report file
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Supports .xlsx, .csv, .pdf (Max 25MB)
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? 'Publishing...' : 'Publish to Portal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
