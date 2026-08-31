import React, { useState } from 'react';
import { X, Building2, Plus, Check } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface AddPartnerModalProps {
  onClose: () => void;
}

export const AddPartnerModal: React.FC<AddPartnerModalProps> = ({ onClose }) => {
  const { addPartner } = useData();

  const [partnerName, setPartnerName] = useState('');
  const [partnerCode, setPartnerCode] = useState(`APR-${Math.floor(100 + Math.random() * 900)}`);
  const [gstNumber, setGstNumber] = useState('27AAACK' + Math.floor(1000 + Math.random() * 9000) + 'A1Z0');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('+91 98');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [assignedSalesperson, setAssignedSalesperson] = useState('Rajesh Mehta (KAM)');
  const [creditLimit, setCreditLimit] = useState(10000000);
  const [outstandingAmount, setOutstandingAmount] = useState(0);
  const [paymentTerms, setPaymentTerms] = useState('30 Days Net');
  const [status, setStatus] = useState<'Active' | 'On Hold' | 'Inactive'>('Active');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName || !gstNumber) return;

    setSubmitting(true);
    await addPartner({
      partnerName: partnerName.trim(),
      partnerCode: partnerCode.trim().toUpperCase(),
      gstNumber: gstNumber.trim().toUpperCase(),
      contactPerson: contactPerson.trim() || 'Procurement Team',
      phone: phone.trim() || '+91 90000 00000',
      email: email.trim() || `${partnerCode.toLowerCase()}@partner.in`,
      city,
      state,
      assignedSalesperson,
      creditLimit: Number(creditLimit),
      outstandingAmount: Number(outstandingAmount),
      paymentTerms,
      status,
      lastTransactionDate: new Date().toISOString().split('T')[0]
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
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Register Authorized Dealer Account</h2>
              <p className="text-xs text-slate-300">Apple Reseller Partner Master</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company / Partner Name *</label>
              <input
                type="text"
                required
                value={partnerName}
                onChange={e => setPartnerName(e.target.value)}
                placeholder="e.g. Maple Digital Technology Pvt Ltd"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Partner Dealer Code *</label>
              <input
                type="text"
                required
                value={partnerCode}
                onChange={e => setPartnerCode(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-mono uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">GSTIN Number *</label>
              <input
                type="text"
                required
                value={gstNumber}
                onChange={e => setGstNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Key Account Manager (KAM)</label>
              <input
                type="text"
                value={assignedSalesperson}
                onChange={e => setAssignedSalesperson(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person</label>
              <input
                type="text"
                value={contactPerson}
                onChange={e => setContactPerson(e.target.value)}
                placeholder="e.g. Sunil Joshi"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="procurement@dealer.in"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
              <select
                value={state}
                onChange={e => setState(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Gujarat">Gujarat</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Telangana">Telangana</option>
                <option value="Punjab">Punjab</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Approved Credit Limit (₹) *</label>
              <input
                type="number"
                min="0"
                required
                value={creditLimit}
                onChange={e => setCreditLimit(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Payment Terms</label>
              <select
                value={paymentTerms}
                onChange={e => setPaymentTerms(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="Immediate / Advance">Immediate / Advance</option>
                <option value="15 Days Net">15 Days Net</option>
                <option value="30 Days Net">30 Days Net</option>
                <option value="45 Days PDC">45 Days PDC</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Account Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-semibold"
              >
                <option value="Active">Active</option>
                <option value="On Hold">On Hold</option>
                <option value="Inactive">Inactive</option>
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
              {submitting ? 'Creating...' : 'Register Partner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
