import React from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Download, 
  Calendar, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  FileText,
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import { MISReport } from '../../types';

interface ReportDetailModalProps {
  report: MISReport;
  onClose: () => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ report, onClose }) => {
  const handleDownload = () => {
    const content = `=====================================================
KS ENTERPRISES (KMR) PRIVATE LIMITED
APPLE AUTHORIZED REGIONAL DISTRIBUTOR - MIS REPORT
=====================================================
Report ID: ${report.id}
Title: ${report.title}
Report Type: ${report.reportType.toUpperCase()}
Reporting Period: ${report.reportingPeriod}
Department: ${report.department}
Access Level: ${report.accessLevel}
Published By: ${report.uploadedBy}
Published Date: ${new Date(report.publishedAt).toLocaleString()}
-----------------------------------------------------
EXECUTIVE SUMMARY:
${report.description}
-----------------------------------------------------
METRICS SUMMARY:
- Total Revenue: ${report.summaryMetrics?.totalRevenue ? `₹${report.summaryMetrics.totalRevenue.toLocaleString('en-IN')}` : 'N/A'}
- Total Quantity: ${report.summaryMetrics?.totalUnits ? `${report.summaryMetrics.totalUnits.toLocaleString('en-IN')} Units` : 'N/A'}
- Highlights: ${report.summaryMetrics?.highlightText || 'Standard Operations'}
=====================================================
CONFIDENTIAL & PROPRIETARY. INTERNAL USE ONLY.
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = report.fileName || `${report.id}_MIS_Report.txt`;
    a.click();
    URL.revokeObjectURL(url);
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
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-blue-300 border border-slate-700">
                {report.reportType.replace('_', ' ')}
              </span>
              <h2 className="text-sm font-bold text-white mt-0.5">{report.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[11px] text-slate-500 block">Period</span>
              <strong className="text-slate-800">{report.reportingPeriod}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Published By</span>
              <strong className="text-slate-800">{report.uploadedBy}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Department</span>
              <strong className="text-slate-800">{report.department}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Published On</span>
              <strong className="text-slate-800">{new Date(report.publishedAt).toLocaleDateString()}</strong>
            </div>
          </div>

          {/* Key Metric Highlight */}
          {report.summaryMetrics && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {report.summaryMetrics.totalRevenue && (
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-center">
                  <span className="text-[11px] font-medium text-blue-700 block">Total Revenue</span>
                  <span className="text-base font-bold text-blue-950">
                    ₹{(report.summaryMetrics.totalRevenue / 100000).toFixed(2)} Lakh
                  </span>
                </div>
              )}
              {report.summaryMetrics.totalUnits && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-center">
                  <span className="text-[11px] font-medium text-emerald-700 block">Quantity Billed</span>
                  <span className="text-base font-bold text-emerald-950">
                    {report.summaryMetrics.totalUnits.toLocaleString('en-IN')} Units
                  </span>
                </div>
              )}
              {report.summaryMetrics.highlightText && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-center sm:col-span-1">
                  <span className="text-[11px] font-medium text-amber-700 block">Highlight</span>
                  <span className="text-xs font-bold text-amber-950 line-clamp-2">
                    {report.summaryMetrics.highlightText}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Executive Summary */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              Executive Summary & Briefing
            </h4>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {report.description}
            </div>
          </div>

          {/* File attachment box */}
          <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-lg bg-slate-800 text-blue-400">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate">{report.fileName || `${report.id}.xlsx`}</p>
                <p className="text-[11px] text-slate-400">{report.fileSize || '2.4 MB'} • Verified MIS Data Spreadsheet</p>
              </div>
            </div>

            <button
              id="modal-download-report-btn"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Confidential Company Record
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
