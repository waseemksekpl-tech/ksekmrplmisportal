import React, { useState } from 'react';
import { X, UserPlus, Check } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { UserRole } from '../../types';

interface AddUserModalProps {
  onClose: () => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ onClose }) => {
  const { addUser } = useData();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Sales & Distribution');
  const [role, setRole] = useState<UserRole>('employee');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName || !email) return;

    setSubmitting(true);
    await addUser({
      uid: 'emp_' + Math.random().toString(36).substring(2, 9),
      displayName: displayName.trim(),
      email: email.trim().toLowerCase(),
      department,
      role,
      status: 'active',
      createdAt: new Date().toISOString()
    });
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-100">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600 text-white">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Create Employee Account</h2>
              <p className="text-xs text-slate-300">Grant Portal Access & Assign RBAC Role</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Employee Name *</label>
            <input
              type="text"
              required
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="e.g. Vikramaditya Rao"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Official Company Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@ksenterprises.co.in"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Department *</label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Executive Management">Executive Management</option>
                <option value="MIS & Operations">MIS & Operations</option>
                <option value="Sales & Distribution">Sales & Distribution</option>
                <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
                <option value="Finance & Commercial">Finance & Commercial</option>
                <option value="Customer Care & DOA">Customer Care & DOA</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Security Role *</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              >
                <option value="employee">Authorized Employee (Viewer)</option>
                <option value="sales_manager">Sales Head (Sales & Partners Edit)</option>
                <option value="logistics_manager">Logistics Lead (Inventory & Dispatch Edit)</option>
                <option value="accounts_manager">Finance & Accounts (Billing Edit)</option>
                <option value="mis_admin">MIS Admin (Full Data Publishing)</option>
                <option value="super_admin">Super Admin (Director Level)</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
            Upon creation, the user will be able to log in securely with their company credentials or select their profile during demo role testing.
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
              {submitting ? 'Creating User...' : 'Create Employee Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
