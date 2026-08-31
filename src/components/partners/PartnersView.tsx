import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  PlusCircle, 
  Download, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Partner } from '../../types';
import { AddPartnerModal } from './AddPartnerModal';

export const PartnersView: React.FC = () => {
  const { partners, deletePartner } = useData();
  const { isMISAdmin, canEdit } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Filtered partners
  const filteredPartners = partners.filter(p => {
    const matchSearch = !searchQuery ||
      p.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.partnerCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.gstNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.assignedSalesperson.toLowerCase().includes(searchQuery.toLowerCase());

    const matchState = selectedState === 'all' || p.state === selectedState;
    const matchStatus = selectedStatus === 'all' || p.status === selectedStatus;

    return matchSearch && matchState && matchStatus;
  });

  const totalPartners = filteredPartners.length;
  const totalCreditLimit = filteredPartners.reduce((sum, p) => sum + p.creditLimit, 0);
  const totalOutstanding = filteredPartners.reduce((sum, p) => sum + p.outstandingAmount, 0);

  const totalPages = Math.max(1, Math.ceil(filteredPartners.length / pageSize));
  const paginatedPartners = filteredPartners.slice((page - 1) * pageSize, page * pageSize);

  const handleExportCSV = () => {
    const headers = ['Partner Code', 'Partner Name', 'GSTIN', 'Contact Person', 'Phone', 'Email', 'City', 'State', 'KAM Salesperson', 'Credit Limit (INR)', 'Outstanding (INR)', 'Terms', 'Status'];
    const rows = filteredPartners.map(p => [
      p.partnerCode,
      `"${p.partnerName}"`,
      p.gstNumber,
      `"${p.contactPerson}"`,
      p.phone,
      p.email,
      p.city,
      p.state,
      `"${p.assignedSalesperson}"`,
      p.creditLimit,
      p.outstandingAmount,
      p.paymentTerms,
      p.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KSE_Partners_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="partners-operations-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Authorized Partners & Dealers</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Apple Premium Resellers (APR), Apple Authorized Resellers (AAR), LFR chains, commercial B2B credit accounts, and GST compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="export-partners-csv-btn"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
            title="Export filtered partners to CSV"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          {canEdit('partners') && (
            <button
              id="add-partner-btn"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register New Dealer</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Authorized Dealers</span>
          <div className="text-lg font-bold text-slate-900 mt-1">
            {totalPartners} Partner Stores
          </div>
          <span className="text-xs text-slate-400">All registered regional accounts</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total Credit Limit Extended</span>
          <div className="text-lg font-bold text-slate-900 mt-1">
            ₹{(totalCreditLimit / 10000000).toFixed(2)} Crore
          </div>
          <span className="text-xs text-slate-400">Approved banking / credit line</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Current Outstanding Exposure</span>
          <div className="text-lg font-bold text-blue-600 mt-1">
            ₹{(totalOutstanding / 10000000).toFixed(2)} Crore
          </div>
          <span className="text-xs text-slate-400">
            {((totalOutstanding / (totalCreditLimit || 1)) * 100).toFixed(1)}% Credit Line Utilized
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="search-partners-input"
            type="text"
            placeholder="Search partner name, code, GSTIN, city, contact person, KAM..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedState}
            onChange={e => { setSelectedState(e.target.value); setPage(1); }}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All States / UT</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi NCR">Delhi NCR</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Gujarat">Gujarat</option>
            <option value="West Bengal">West Bengal</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => { setSelectedStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Account Statuses</option>
            <option value="Active">Active (Good Standing)</option>
            <option value="On Hold">Credit Hold / Overdue</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Partners Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Partner Name & Code</th>
                <th className="px-4 py-3">GSTIN Number</th>
                <th className="px-4 py-3">City & Contact</th>
                <th className="px-4 py-3">Account Manager (KAM)</th>
                <th className="px-4 py-3 text-right">Credit Limit</th>
                <th className="px-4 py-3 text-right">Outstanding</th>
                <th className="px-4 py-3">Terms</th>
                <th className="px-4 py-3 text-center">Status</th>
                {canEdit('partners') && <th className="px-4 py-3 text-center">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedPartners.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No authorized partners match your search filters.
                  </td>
                </tr>
              ) : (
                paginatedPartners.map(p => {
                  const utilPct = Math.min(100, Math.round((p.outstandingAmount / p.creditLimit) * 100));
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        <div>{p.partnerName}</div>
                        <div className="text-[10px] font-mono text-slate-400">{p.partnerCode}</div>
                      </td>

                      <td className="px-4 py-3 font-mono text-slate-700 whitespace-nowrap">
                        {p.gstNumber}
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{p.city}, {p.state}</div>
                        <div className="text-[10px] text-slate-400">{p.contactPerson} • {p.phone}</div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap text-slate-700 font-medium">
                        {p.assignedSalesperson}
                      </td>

                      <td className="px-4 py-3 text-right text-slate-600 font-semibold whitespace-nowrap">
                        ₹{(p.creditLimit / 100000).toFixed(1)}L
                      </td>

                      <td className="px-4 py-3 text-right font-bold text-slate-900 whitespace-nowrap">
                        <div>₹{(p.outstandingAmount / 100000).toFixed(1)}L</div>
                        <div className="w-16 ml-auto bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                          <div 
                            className={`h-full ${utilPct > 80 ? 'bg-red-500' : utilPct > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${utilPct}%` }}
                          />
                        </div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap text-slate-600 text-[11px]">
                        {p.paymentTerms}
                      </td>

                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                          p.status === 'On Hold' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {p.status}
                        </span>
                      </td>

                      {canEdit('partners') && (
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <button
                            onClick={() => {
                              if (confirm(`Remove dealer record for ${p.partnerName}?`)) {
                                deletePartner(p.id);
                              }
                            }}
                            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete Partner"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredPartners.length)} of {filteredPartners.length} partners
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-2.5 py-1 rounded bg-white border border-slate-300 disabled:opacity-40 font-medium"
              >
                Previous
              </button>
              <span className="px-2 font-bold text-slate-700">
                {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-2.5 py-1 rounded bg-white border border-slate-300 disabled:opacity-40 font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <AddPartnerModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
};
