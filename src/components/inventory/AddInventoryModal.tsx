import React, { useState } from 'react';
import { X, Boxes, Plus, Check } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface AddInventoryModalProps {
  onClose: () => void;
}

export const AddInventoryModal: React.FC<AddInventoryModalProps> = ({ onClose }) => {
  const { addInventoryItem } = useData();

  const [sku, setSku] = useState('');
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState<'iPhone' | 'Mac' | 'iPad' | 'Watch' | 'AirPods' | 'Accessories' | 'AppleCare+'>('iPhone');
  const [quantity, setQuantity] = useState(25);
  const [minReorderLevel, setMinReorderLevel] = useState(20);
  const [unitCost, setUnitCost] = useState(79900);
  const [warehouseLocation, setWarehouseLocation] = useState('Mumbai Central Hub (Bhiwandi)');
  const [serialBatch, setSerialBatch] = useState(`BAT-2026-Q3-${Math.floor(100 + Math.random() * 900)}`);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku || !productName) return;

    setSubmitting(true);
    let status: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
    if (quantity <= 0) status = 'Out of Stock';
    else if (quantity <= minReorderLevel) status = 'Low Stock';

    await addInventoryItem({
      sku: sku.trim().toUpperCase(),
      productName: productName.trim(),
      category,
      quantity: Number(quantity),
      minReorderLevel: Number(minReorderLevel),
      unitCost: Number(unitCost),
      warehouseLocation,
      status,
      lastAuditedAt: new Date().toISOString().split('T')[0],
      serialBatch
    });
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-100">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600 text-white">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Add New Inventory SKU</h2>
              <p className="text-xs text-slate-300">Apple Hardware Catalog Management</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Apple SKU Code *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={e => setSku(e.target.value)}
                placeholder="e.g. MYW93HN/A"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="iPhone">iPhone</option>
                <option value="Mac">MacBook / Mac Studio / iMac</option>
                <option value="iPad">iPad / iPad Pro</option>
                <option value="Watch">Apple Watch Series / Ultra</option>
                <option value="AirPods">AirPods Pro / Max</option>
                <option value="Accessories">Accessories (Cables, Adapters, Cases)</option>
                <option value="AppleCare+">AppleCare+ Pack</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Product Description *</label>
            <input
              type="text"
              required
              value={productName}
              onChange={e => setProductName(e.target.value)}
              placeholder="e.g. iPhone 16 Plus 128GB Ultramarine"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Stock Quantity (Units) *</label>
              <input
                type="number"
                min="0"
                required
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Min Reorder Level *</label>
              <input
                type="number"
                min="1"
                required
                value={minReorderLevel}
                onChange={e => setMinReorderLevel(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unit Cost in INR (₹) *</label>
              <input
                type="number"
                min="0"
                required
                value={unitCost}
                onChange={e => setUnitCost(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Warehouse Hub *</label>
              <select
                value={warehouseLocation}
                onChange={e => setWarehouseLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Mumbai Central Hub (Bhiwandi)">Mumbai Central Hub (Bhiwandi)</option>
                <option value="Delhi Regional Warehouse (Gurgaon)">Delhi Regional Warehouse (Gurgaon)</option>
                <option value="Bengaluru South Depot (Hosur Rd)">Bengaluru South Depot (Hosur Rd)</option>
                <option value="Chennai Depot (Sriperumbudur)">Chennai Depot (Sriperumbudur)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Batch / Lot Tracking ID</label>
              <input
                type="text"
                value={serialBatch}
                onChange={e => setSerialBatch(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
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
              className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              {submitting ? 'Creating SKU...' : 'Save to Inventory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
