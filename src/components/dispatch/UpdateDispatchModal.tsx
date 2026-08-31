import React, { useState } from 'react';
import { X, Truck, CheckCircle2, Clock, Check } from 'lucide-react';
import { DispatchRecord } from '../../types';
import { useData } from '../../context/DataContext';

interface UpdateDispatchModalProps {
  dispatch: DispatchRecord;
  onClose: () => void;
}

export const UpdateDispatchModal: React.FC<UpdateDispatchModalProps> = ({ dispatch, onClose }) => {
  const { updateDispatchStatus } = useData();
  const [status, setStatus] = useState<DispatchRecord['status']>(dispatch.status);
  const [remarks, setRemarks] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateDispatchStatus(dispatch.id, status, remarks);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Update Logistics Status</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <p className="font-bold text-slate-900">{dispatch.dispatchId} — {dispatch.partnerName}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{dispatch.itemsDescription} ({dispatch.quantity} units)</p>
            <p className="text-[11px] text-blue-600 font-mono mt-1 font-semibold">
              Carrier: {dispatch.carrier} • AWB: {dispatch.trackingNumber}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Current Shipment Status *
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-bold"
            >
              <option value="Pending">Pending (Picking in Hub)</option>
              <option value="Processing">Processing (Packing & E-Way Bill Generated)</option>
              <option value="Dispatched">Dispatched (Handed to Carrier)</option>
              <option value="In Transit">In Transit (Vehicle En Route)</option>
              <option value="Delivered">Delivered (POD Signed)</option>
              <option value="Cancelled">Cancelled / Recalled</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Update Status Note / Delivery POD Remark
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="e.g. Delivered successfully, received by store manager Mr. Sunil (Signed POD #9821)"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
            />
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
              {saving ? 'Updating...' : 'Confirm Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
