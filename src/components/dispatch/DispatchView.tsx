import React, { useState } from 'react';
import { 
  Truck, 
  Search, 
  Filter, 
  PlusCircle, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  PackageCheck, 
  Edit3, 
  Trash2,
  ExternalLink,
  MapPin
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { DispatchRecord } from '../../types';
import { AddDispatchModal } from './AddDispatchModal';
import { UpdateDispatchModal } from './UpdateDispatchModal';

export const DispatchView: React.FC = () => {
  const { dispatches, deleteDispatchRecord } = useData();
  const { isMISAdmin, canEdit } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCarrier, setSelectedCarrier] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDispatch, setSelectedDispatch] = useState<DispatchRecord | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Filter dispatches
  const filteredDispatches = dispatches.filter(d => {
    const matchSearch = !searchQuery ||
      d.dispatchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.carrier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.itemsDescription.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = selectedStatus === 'all' || d.status === selectedStatus;
    const matchCarrier = selectedCarrier === 'all' || d.carrier.includes(selectedCarrier);

    return matchSearch && matchStatus && matchCarrier;
  });

  const pendingCount = dispatches.filter(d => d.status === 'Pending' || d.status === 'Processing').length;
  const inTransitCount = dispatches.filter(d => d.status === 'Dispatched' || d.status === 'In Transit').length;
  const deliveredCount = dispatches.filter(d => d.status === 'Delivered').length;
  const totalUnitsDispatched = filteredDispatches.reduce((sum, d) => sum + d.quantity, 0);

  const totalPages = Math.max(1, Math.ceil(filteredDispatches.length / pageSize));
  const paginatedDispatches = filteredDispatches.slice((page - 1) * pageSize, page * pageSize);

  const handleExportCSV = () => {
    const headers = ['Dispatch ID', 'Date', 'Partner Name', 'Destination', 'Items Description', 'Quantity', 'Carrier', 'Tracking AWB', 'Status', 'Expected Delivery', 'Remarks'];
    const rows = filteredDispatches.map(d => [
      d.dispatchId,
      d.date,
      `"${d.partnerName}"`,
      `"${d.destination}"`,
      `"${d.itemsDescription}"`,
      d.quantity,
      `"${d.carrier}"`,
      d.trackingNumber,
      d.status,
      d.expectedDelivery,
      `"${d.remarks || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KSE_Dispatch_Logistics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: DispatchRecord['status']) => {
    switch (status) {
      case 'Delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case 'In Transit':
      case 'Dispatched':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Truck className="w-3 h-3" /> In Transit</span>;
      case 'Processing':
        return <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> Processing</span>;
      case 'Pending':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{status}</span>;
    }
  };

  return (
    <div id="dispatch-logistics-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dispatch & Logistics Operations</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tracking shipments from regional warehouse hubs to authorized Apple Premium Resellers, Large Format Retailers, and corporate partners.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="export-dispatch-csv-btn"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
            title="Export filtered dispatches to CSV"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          {canEdit('dispatch') && (
            <button
              id="schedule-dispatch-btn"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Schedule New Dispatch</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Warehouse Queue</span>
          <div className="text-lg font-bold text-amber-600 mt-1">
            {pendingCount} Orders Pending
          </div>
          <span className="text-xs text-slate-400">Picking / In packing stage</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Active Shipments In-Transit</span>
          <div className="text-lg font-bold text-blue-600 mt-1">
            {inTransitCount} Shipments Out
          </div>
          <span className="text-xs text-slate-400">Carrier vehicles on route</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Delivered Shipments</span>
          <div className="text-lg font-bold text-emerald-600 mt-1">
            {deliveredCount} Delivered
          </div>
          <span className="text-xs text-slate-400">POD verified on portal</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total Units Dispatched</span>
          <div className="text-lg font-bold text-slate-900 mt-1">
            {totalUnitsDispatched.toLocaleString('en-IN')} Units
          </div>
          <span className="text-xs text-slate-400">Across active log entries</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="search-dispatches-input"
            type="text"
            placeholder="Search dispatch ID, partner store, destination city, tracking AWB..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedStatus}
            onChange={e => { setSelectedStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Dispatch Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Dispatched">Dispatched</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
          </select>

          <select
            value={selectedCarrier}
            onChange={e => { setSelectedCarrier(e.target.value); setPage(1); }}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Express Carriers</option>
            <option value="Blue Dart">Blue Dart Express</option>
            <option value="Sequel">Sequel Secure Logistics</option>
            <option value="Safexpress">Safexpress Premium</option>
            <option value="Company Dedicated">Company Dedicated Van</option>
          </select>
        </div>
      </div>

      {/* Dispatches Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Dispatch ID & Date</th>
                <th className="px-4 py-3">Partner & Destination</th>
                <th className="px-4 py-3">Consignment Details</th>
                <th className="px-4 py-3 text-center">Units</th>
                <th className="px-4 py-3">Carrier & Tracking AWB</th>
                <th className="px-4 py-3">Expected ETA</th>
                <th className="px-4 py-3 text-center">Status</th>
                {canEdit('dispatch') && <th className="px-4 py-3 text-center">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedDispatches.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No dispatch consignments found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedDispatches.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                      <div>{item.dispatchId}</div>
                      <div className="text-[10px] font-normal text-slate-400">{item.date}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{item.partnerName}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" />
                        {item.destination}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900 line-clamp-1">{item.itemsDescription}</div>
                      {item.remarks && (
                        <div className="text-[10px] text-slate-400 line-clamp-1">{item.remarks}</div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center font-bold text-slate-900">
                      {item.quantity}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-slate-800">{item.carrier}</div>
                      <div className="font-mono text-[10px] text-blue-600 font-semibold">{item.trackingNumber}</div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                      {item.expectedDelivery}
                    </td>

                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>

                    {canEdit('dispatch') && (
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedDispatch(item)}
                            className="p-1 rounded text-blue-600 hover:bg-blue-50 font-medium"
                            title="Update Status / Tracking"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Cancel and delete dispatch record ${item.dispatchId}?`)) {
                                deleteDispatchRecord(item.id);
                              }
                            }}
                            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredDispatches.length)} of {filteredDispatches.length} records
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

      {/* Schedule Dispatch Modal */}
      {isAddModalOpen && (
        <AddDispatchModal onClose={() => setIsAddModalOpen(false)} />
      )}

      {/* Update Dispatch Status Modal */}
      {selectedDispatch && (
        <UpdateDispatchModal dispatch={selectedDispatch} onClose={() => setSelectedDispatch(null)} />
      )}
    </div>
  );
};
