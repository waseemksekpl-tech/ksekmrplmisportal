import React, { useState } from 'react';
import { X, TrendingUp, DollarSign, Check } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

interface AddSaleModalProps {
  onClose: () => void;
}

export const AddSaleModal: React.FC<AddSaleModalProps> = ({ onClose }) => {
  const { addSaleRecord, partners, inventory } = useData();
  const { currentUser } = useAuth();

  const [invoiceNumber, setInvoiceNumber] = useState(`KSE/2026/INV-${Math.floor(1000 + Math.random() * 9000)}`);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [partnerName, setPartnerName] = useState(partners[0]?.partnerName || 'Unicorn Infosolutions Pvt Ltd');
  const [partnerCode, setPartnerCode] = useState(partners[0]?.partnerCode || 'APR-UNI-01');
  const [productName, setProductName] = useState(inventory[0]?.productName || 'iPhone 16 Pro Max 256GB Desert Titanium');
  const [sku, setSku] = useState(inventory[0]?.sku || 'MYWL3HN/A');
  const [category, setCategory] = useState(inventory[0]?.category || 'iPhone');
  const [quantity, setQuantity] = useState(5);
  const [unitPrice, setUnitPrice] = useState(134900);
  const [salesperson, setSalesperson] = useState(currentUser?.displayName || 'Rajesh Mehta (KAM)');
  const [region, setRegion] = useState<'North' | 'South' | 'West' | 'East'>('West');
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Pending' | 'Partial'>('Paid');
  const [submitting, setSubmitting] = useState(false);

  const handlePartnerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = partners.find(p => p.partnerName === e.target.value);
    if (selected) {
      setPartnerName(selected.partnerName);
      setPartnerCode(selected.partnerCode);
    }
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = inventory.find(i => i.productName === e.target.value);
    if (selected) {
      setProductName(selected.productName);
      setSku(selected.sku);
      setCategory(selected.category);
      // Rough price estimation
      setUnitPrice(Math.round(selected.unitCost * 1.08));
    }
  };

  const totalAmount = quantity * unitPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceNumber || quantity <= 0) return;

    setSubmitting(true);
    await addSaleRecord({
      invoiceNumber,
      date,
      partnerName,
      partnerCode,
      productName,
      sku,
      category,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      totalAmount,
      salesperson,
      region,
      paymentStatus
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
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Generate Sales Invoice Record</h2>
              <p className="text-xs text-slate-300">Apple Hardware Distribution Billing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Invoice Number *</label>
              <input
                type="text"
                required
                value={invoiceNumber}
                onChange={e => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Invoice Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Partner / Dealer *</label>
              <select
                value={partnerName}
                onChange={handlePartnerChange}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {partners.map(p => (
                  <option key={p.id} value={p.partnerName}>
                    {p.partnerName} ({p.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Partner Code</label>
              <input
                type="text"
                disabled
                value={partnerCode}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-100 border border-slate-300 text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Apple Product *</label>
            <select
              value={productName}
              onChange={handleProductChange}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {inventory.map(i => (
                <option key={i.id} value={i.productName}>
                  {i.productName} — [SKU: {i.sku}] (Available: {i.quantity})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Quantity (Units) *</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unit Price (₹) *</label>
              <input
                type="number"
                min="0"
                required
                value={unitPrice}
                onChange={e => setUnitPrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Total Bill (₹)</label>
              <div className="w-full px-3 py-2 text-xs rounded-lg bg-slate-100 border border-slate-300 text-slate-900 font-extrabold flex items-center">
                ₹{totalAmount.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sales Manager</label>
              <input
                type="text"
                value={salesperson}
                onChange={e => setSalesperson(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Regional Zone</label>
              <select
                value={region}
                onChange={e => setRegion(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="West">West Zone</option>
                <option value="North">North Zone</option>
                <option value="South">South Zone</option>
                <option value="East">East Zone</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={e => setPaymentStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending (Credit)</option>
                <option value="Partial">Partial</option>
              </select>
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
              {submitting ? 'Saving...' : 'Record Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
