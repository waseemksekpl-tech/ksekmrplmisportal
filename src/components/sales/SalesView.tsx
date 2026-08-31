import React, { useState } from 'react';
import { 
  TrendingUp, 
  Search, 
  Filter, 
  PlusCircle, 
  Download, 
  Trash2, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { SaleRecord } from '../../types';
import { AddSaleModal } from './AddSaleModal';

export const SalesView: React.FC = () => {
  const { sales, deleteSaleRecord } = useData();
  const { isMISAdmin, canEdit } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Filtered sales
  const filteredSales = sales.filter(s => {
    const matchSearch = !searchQuery ||
      s.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.salesperson.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchRegion = selectedRegion === 'all' || s.region === selectedRegion;
    const matchStatus = selectedStatus === 'all' || s.paymentStatus === selectedStatus;

    return matchSearch && matchCategory && matchRegion && matchStatus;
  });

  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalUnits = filteredSales.reduce((sum, s) => sum + s.quantity, 0);
  const pendingCollection = filteredSales.filter(s => s.paymentStatus !== 'Paid').reduce((sum, s) => sum + s.totalAmount, 0);

  const totalPages = Math.max(1, Math.ceil(filteredSales.length / pageSize));
  const paginatedSales = filteredSales.slice((page - 1) * pageSize, page * pageSize);

  const handleExportCSV = () => {
    const headers = ['Invoice Number', 'Date', 'Partner Name', 'Product Name', 'SKU', 'Category', 'Quantity', 'Unit Price', 'Total Amount', 'Salesperson', 'Region', 'Payment Status'];
    const rows = filteredSales.map(s => [
      s.invoiceNumber,
      s.date,
      `"${s.partnerName}"`,
      `"${s.productName}"`,
      s.sku,
      s.category,
      s.quantity,
      s.unitPrice,
      s.totalAmount,
      `"${s.salesperson}"`,
      s.region,
      s.paymentStatus
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KSE_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="sales-operations-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sales & Distribution Records</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Primary billing, Apple hardware distribution invoices, dealer orders, and revenue tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="export-sales-csv-btn"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
            title="Export filtered sales to CSV"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          {canEdit('sales') && (
            <button
              id="add-sale-invoice-btn"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Sales Invoice</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Filtered Sales Revenue</span>
          <div className="text-lg font-bold text-slate-900 mt-1">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-slate-400">Total ₹{(totalRevenue / 100000).toFixed(2)} Lakh</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Units Billed</span>
          <div className="text-lg font-bold text-slate-900 mt-1">
            {totalUnits.toLocaleString('en-IN')} Units
          </div>
          <span className="text-xs text-slate-400">Across {filteredSales.length} Invoices</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Outstanding / Pending Payment</span>
          <div className="text-lg font-bold text-amber-600 mt-1">
            ₹{pendingCollection.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-slate-400">Credit period pending</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="search-sales-input"
            type="text"
            placeholder="Search invoice number, partner, SKU, product, salesperson..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedCategory}
            onChange={e => { setSelectedCategory(e.target.value); setPage(1); }}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="iPhone">iPhone</option>
            <option value="Mac">Mac</option>
            <option value="iPad">iPad</option>
            <option value="Watch">Apple Watch</option>
            <option value="AirPods">AirPods</option>
            <option value="Accessories">Accessories</option>
            <option value="AppleCare+">AppleCare+</option>
          </select>

          <select
            value={selectedRegion}
            onChange={e => { setSelectedRegion(e.target.value); setPage(1); }}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Regions</option>
            <option value="West">West Zone</option>
            <option value="North">North Zone</option>
            <option value="South">South Zone</option>
            <option value="East">East Zone</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => { setSelectedStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Payment Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending (Credit)</option>
            <option value="Partial">Partial</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Invoice & Date</th>
                <th className="px-4 py-3">Partner / Dealer</th>
                <th className="px-4 py-3">Product & SKU</th>
                <th className="px-4 py-3 text-center">Qty</th>
                <th className="px-4 py-3 text-right">Unit Price</th>
                <th className="px-4 py-3 text-right">Total Amount</th>
                <th className="px-4 py-3">Salesperson / Zone</th>
                <th className="px-4 py-3 text-center">Status</th>
                {canEdit('sales') && <th className="px-4 py-3 text-center">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedSales.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No sales invoices match your search filters.
                  </td>
                </tr>
              ) : (
                paginatedSales.map(sale => (
                  <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                      <div>{sale.invoiceNumber}</div>
                      <div className="text-[10px] font-normal text-slate-400">{sale.date}</div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{sale.partnerName}</div>
                      <div className="text-[10px] text-slate-400">{sale.partnerCode}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900 line-clamp-1">{sale.productName}</div>
                      <div className="text-[10px] text-slate-400">{sale.sku} • {sale.category}</div>
                    </td>

                    <td className="px-4 py-3 text-center font-bold text-slate-800">
                      {sale.quantity}
                    </td>

                    <td className="px-4 py-3 text-right text-slate-600">
                      ₹{sale.unitPrice.toLocaleString('en-IN')}
                    </td>

                    <td className="px-4 py-3 text-right font-bold text-slate-900 whitespace-nowrap">
                      ₹{sale.totalAmount.toLocaleString('en-IN')}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-slate-700">{sale.salesperson}</div>
                      <div className="text-[10px] text-slate-400">{sale.region} Zone</div>
                    </td>

                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sale.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                        sale.paymentStatus === 'Partial' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {sale.paymentStatus}
                      </span>
                    </td>

                    {canEdit('sales') && (
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => {
                            if (confirm(`Delete invoice record ${sale.invoiceNumber}?`)) {
                              deleteSaleRecord(sale.id);
                            }
                          }}
                          className="p-1 rounded text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete Invoice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredSales.length)} of {filteredSales.length} invoices
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
        <AddSaleModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
};
