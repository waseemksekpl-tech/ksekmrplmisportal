import React, { useState } from 'react';
import { X, Truck, Plus, Check } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface AddDispatchModalProps {
  onClose: () => void;
}

export const AddDispatchModal: React.FC<AddDispatchModalProps> = ({ onClose }) => {
  const { addDispatchRecord, partners, inventory } = useData();

  const [dispatchId, setDispatchId] = useState(`DSP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [partnerName, setPartnerName] = useState(partners[0]?.partnerName || 'Unicorn Infosolutions Pvt Ltd');
  const [destination, setDestination] = useState(`${partners[0]?.city || 'Mumbai'}, ${partners[0]?.state || 'Maharashtra'}`);
  const [itemsDescription, setItemsDescription] = useState('20x iPhone 16 Pro, 10x Watch Series 10');
  const [quantity, setQuantity] = useState(30);
  const [carrier, setCarrier] = useState('Blue Dart Express Priority');
  const [trackingNumber, setTrackingNumber] = useState(`BD-${Math.floor(10000000 + Math.random() * 90000000)}`);
  const [status, setStatus] = useState<'Pending' | 'Processing' | 'Dispatched' | 'In Transit' | 'Delivered'>('Pending');
  const [expectedDelivery, setExpectedDelivery] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [remarks, setRemarks] = useState('High-value insured Apple hardware consignment');
  const [submitting, setSubmitting] = useState(false);

  const handlePartnerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = partners.find(p => p.partnerName === e.target.value);
    if (selected) {
      setPartnerName(selected.partnerName);
      setDestination(`${selected.city}, ${selected.state}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchId || !partnerName || quantity <= 0) return;

    setSubmitting(true);
    await addDispatchRecord({
      dispatchId,
      date,
      partnerName,
      destination,
      itemsDescription,
      quantity: Number(quantity),
      carrier,
      trackingNumber,
      status,
      expectedDelivery,
      remarks
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
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Schedule New Dispatch Order</h2>
              <p className="text-xs text-slate-300">Outward Logistics & Carrier Assignment</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Dispatch Number *</label>
              <input
                type="text"
                required
                value={dispatchId}
                onChange={e => setDispatchId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Dispatch Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Recipient Partner / Dealer *</label>
              <select
                value={partnerName}
                onChange={handlePartnerSelect}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              >
                {partners.map(p => (
                  <option key={p.id} value={p.partnerName}>
                    {p.partnerName} ({p.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Destination Address *</label>
              <input
                type="text"
                required
                value={destination}
                onChange={e => setDestination(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Consignment Items Summary *</label>
              <input
                type="text"
                required
                value={itemsDescription}
                onChange={e => setItemsDescription(e.target.value)}
                placeholder="e.g. 50x iPhone 16 Pro 256GB"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Total Units *</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Logistics Carrier *</label>
              <select
                value={carrier}
                onChange={e => setCarrier(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="Blue Dart Express Priority">Blue Dart Express Priority</option>
                <option value="Sequel Secure Logistics">Sequel Secure Logistics (Armored)</option>
                <option value="Safexpress Premium Cargo">Safexpress Premium Cargo</option>
                <option value="Company Dedicated Van">Company Dedicated Van (Local)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tracking Number / AWB *</label>
              <input
                type="text"
                required
                value={trackingNumber}
                onChange={e => setTrackingNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-mono font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Initial Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending (Picking in Hub)</option>
                <option value="Processing">Processing (Packing)</option>
                <option value="Dispatched">Dispatched (Handed to Carrier)</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Expected Delivery (ETA)</label>
              <input
                type="date"
                value={expectedDelivery}
                onChange={e => setExpectedDelivery(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Handling Remarks / E-Way Bill Details</label>
            <input
              type="text"
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="e.g. E-Way Bill #281920194829 verified"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
            />
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
              {submitting ? 'Scheduling...' : 'Save Dispatch Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
