import React, { useState } from 'react';
import { X, Boxes, Plus, Minus, History, Check } from 'lucide-react';
import { InventoryItem } from '../../types';
import { useData } from '../../context/DataContext';

interface AdjustStockModalProps {
  item: InventoryItem;
  onClose: () => void;
}

export const AdjustStockModal: React.FC<AdjustStockModalProps> = ({ item, onClose }) => {
  const { updateInventoryStock } = useData();
  const [quantity, setQuantity] = useState(item.quantity);
  const [reason, setReason] = useState('Physical stock audit reconciliation');
  const [saving, setSaving] = useState(false);

  const delta = quantity - item.quantity;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity < 0) return;
    setSaving(true);
    await updateInventoryStock(item.id, quantity, reason);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Adjust Inventory Stock Count</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs font-bold text-slate-900">{item.productName}</p>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">SKU: {item.sku} • {item.warehouseLocation}</p>
            <div className="mt-2 text-xs flex items-center justify-between">
              <span className="text-slate-500">Current Recorded Stock:</span>
              <strong className="text-slate-900">{item.quantity} Units</strong>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              New Physical Count (Units) *
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(0, q - 10))}
                className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                -10
              </button>
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(0, q - 1))}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="0"
                required
                value={quantity}
                onChange={e => setQuantity(Math.max(0, Number(e.target.value)))}
                className="w-full text-center font-bold text-lg py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setQuantity(q => q + 1)}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setQuantity(q => q + 10)}
                className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                +10
              </button>
            </div>
            {delta !== 0 && (
              <p className={`text-xs mt-1.5 text-center font-semibold ${delta > 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {delta > 0 ? `+${delta} units addition` : `${delta} units write-off`}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Audit Reason / Movement Justification *
            </label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
            >
              <option value="Physical stock audit reconciliation">Physical stock audit reconciliation</option>
              <option value="Inward shipment GRN received from Apple India">Inward shipment GRN received from Apple India</option>
              <option value="Damage / DOA return replacement">Damage / DOA return replacement</option>
              <option value="Inter-warehouse hub stock transfer">Inter-warehouse hub stock transfer</option>
              <option value="Manual stock variance adjustment">Manual stock variance adjustment</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Updating...' : 'Confirm Stock Adjustment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
