import React, { useState } from 'react';
import { 
  Boxes, 
  Search, 
  Filter, 
  PlusCircle, 
  Download, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  Warehouse,
  History
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { InventoryItem } from '../../types';
import { AdjustStockModal } from './AdjustStockModal';
import { AddInventoryModal } from './AddInventoryModal';

export const InventoryView: React.FC = () => {
  const { inventory, deleteInventoryItem } = useData();
  const { isMISAdmin, canEdit } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Filter inventory
  const filteredItems = inventory.filter(item => {
    const matchSearch = !searchQuery ||
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.warehouseLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialBatch?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchWarehouse = selectedWarehouse === 'all' || item.warehouseLocation.includes(selectedWarehouse);
    const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;

    return matchSearch && matchCategory && matchWarehouse && matchStatus;
  });

  const totalSKUs = filteredItems.length;
  const totalUnits = filteredItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalValuation = filteredItems.reduce((sum, i) => sum + (i.quantity * i.unitCost), 0);
  const lowStockCount = filteredItems.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock').length;

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const paginatedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  const handleExportCSV = () => {
    const headers = ['SKU', 'Product Name', 'Category', 'Quantity', 'Min Level', 'Unit Cost (INR)', 'Total Value (INR)', 'Warehouse', 'Status', 'Last Audited', 'Batch'];
    const rows = filteredItems.map(i => [
      i.sku,
      `"${i.productName}"`,
      i.category,
      i.quantity,
      i.minReorderLevel,
      i.unitCost,
      i.quantity * i.unitCost,
      `"${i.warehouseLocation}"`,
      i.status,
      i.lastAuditedAt,
      i.serialBatch || 'N/A'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KSE_Inventory_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="inventory-operations-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Stock & Warehouse Inventory</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time Apple device quantities across regional central warehouses, minimum reorder thresholds, and serial batch tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="export-inventory-csv-btn"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
            title="Export filtered inventory to CSV"
          >
            <Download className="w-4 h-4" />
            <span>Export Stock CSV</span>
          </button>

          {canEdit('inventory') && (
            <button
              id="add-inventory-sku-btn"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New SKU Item</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Active SKUs</span>
          <div className="text-lg font-bold text-slate-900 mt-1">
            {totalSKUs} Hardware Lines
          </div>
          <span className="text-xs text-slate-400">Apple Certified Models</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total Stock On Hand</span>
          <div className="text-lg font-bold text-slate-900 mt-1">
            {totalUnits.toLocaleString('en-IN')} Units
          </div>
          <span className="text-xs text-slate-400">Available across all hubs</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Inventory Valuation (Cost)</span>
          <div className="text-lg font-bold text-slate-900 mt-1">
            ₹{(totalValuation / 10000000).toFixed(2)} Crore
          </div>
          <span className="text-xs text-slate-400">₹{totalValuation.toLocaleString('en-IN')}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Reorder / Stock Alerts</span>
          <div className="text-lg font-bold text-amber-600 mt-1 flex items-center gap-1.5">
            {lowStockCount > 0 && <AlertTriangle className="w-4 h-4 text-amber-500" />}
            {lowStockCount} SKUs Need Attention
          </div>
          <span className="text-xs text-slate-400">Below threshold level</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="search-inventory-input"
            type="text"
            placeholder="Search Apple model, SKU code, warehouse location, serial batch..."
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
            <option value="all">All Product Categories</option>
            <option value="iPhone">iPhone</option>
            <option value="Mac">MacBook / iMac</option>
            <option value="iPad">iPad</option>
            <option value="Watch">Apple Watch</option>
            <option value="AirPods">AirPods</option>
            <option value="Accessories">Accessories</option>
            <option value="AppleCare+">AppleCare+</option>
          </select>

          <select
            value={selectedWarehouse}
            onChange={e => { setSelectedWarehouse(e.target.value); setPage(1); }}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Warehouse Locations</option>
            <option value="Mumbai">Mumbai Central Hub</option>
            <option value="Delhi">Delhi Regional Warehouse</option>
            <option value="Bengaluru">Bengaluru South Depot</option>
            <option value="Chennai">Chennai Depot</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => { setSelectedStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Stock Statuses</option>
            <option value="In Stock">In Stock (Healthy)</option>
            <option value="Low Stock">Low Stock Alert</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Product Name & Category</th>
                <th className="px-4 py-3">Apple SKU</th>
                <th className="px-4 py-3">Warehouse Hub</th>
                <th className="px-4 py-3 text-center">Stock In Hand</th>
                <th className="px-4 py-3 text-center">Min Reorder</th>
                <th className="px-4 py-3 text-right">Unit Cost</th>
                <th className="px-4 py-3 text-right">Total Valuation</th>
                <th className="px-4 py-3 text-center">Status</th>
                {canEdit('inventory') && <th className="px-4 py-3 text-center">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No stock inventory items found.
                  </td>
                </tr>
              ) : (
                paginatedItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      <div>{item.productName}</div>
                      <div className="text-[10px] font-normal text-slate-400">{item.category} • Batch: {item.serialBatch || 'STD'}</div>
                    </td>

                    <td className="px-4 py-3 font-mono font-medium text-slate-700 whitespace-nowrap">
                      {item.sku}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                      {item.warehouseLocation}
                    </td>

                    <td className="px-4 py-3 text-center font-bold text-slate-900">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        item.quantity <= 0 ? 'bg-red-100 text-red-800' :
                        item.quantity <= item.minReorderLevel ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {item.quantity} Units
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center text-slate-500">
                      {item.minReorderLevel}
                    </td>

                    <td className="px-4 py-3 text-right text-slate-600">
                      ₹{item.unitCost.toLocaleString('en-IN')}
                    </td>

                    <td className="px-4 py-3 text-right font-bold text-slate-900 whitespace-nowrap">
                      ₹{(item.quantity * item.unitCost).toLocaleString('en-IN')}
                    </td>

                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'In Stock' ? 'bg-emerald-100 text-emerald-800' :
                        item.status === 'Low Stock' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    {canEdit('inventory') && (
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setAdjustItem(item)}
                            className="p-1 rounded text-blue-600 hover:bg-blue-50 font-medium"
                            title="Adjust Stock Count"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove SKU ${item.sku} (${item.productName})?`)) {
                                deleteInventoryItem(item.id);
                              }
                            }}
                            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete SKU"
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

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredItems.length)} of {filteredItems.length} SKUs
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

      {/* Adjust Stock Count Modal */}
      {adjustItem && (
        <AdjustStockModal item={adjustItem} onClose={() => setAdjustItem(null)} />
      )}

      {/* Add New Inventory SKU Modal */}
      {isAddModalOpen && (
        <AddInventoryModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
};
