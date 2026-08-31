import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  PlusCircle, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Trash2, 
  Edit3, 
  KeyRound, 
  Lock, 
  Check, 
  X,
  Mail,
  Building
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { UserProfile, UserRole } from '../../types';
import { AddUserModal } from './AddUserModal';

export const UserManagementView: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useData();
  const { currentUser, isSuperAdmin, isMISAdmin } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedDept, setSelectedDept] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);

  const filteredUsers = users.filter(u => {
    const matchSearch = !searchQuery ||
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchRole = selectedRole === 'all' || u.role === selectedRole;
    const matchDept = selectedDept === 'all' || u.department === selectedDept;

    return matchSearch && matchRole && matchDept;
  });

  const getUserId = (u: UserProfile) => u.uid || u.id || '';

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Super Admin (Director)</span>;
      case 'mis_admin':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">MIS Admin (Publisher)</span>;
      case 'sales_manager':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Sales Head</span>;
      case 'logistics_manager':
        return <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Logistics Lead</span>;
      case 'accounts_manager':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Finance & Accounts</span>;
      case 'manager':
        return <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Operations Manager</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Authorized Staff</span>;
    }
  };

  const handleToggleStatus = (u: UserProfile) => {
    const id = getUserId(u);
    if (id === currentUser?.uid) {
      alert('You cannot suspend your own active session account.');
      return;
    }
    const newStatus = u.status === 'active' ? 'suspended' : 'active';
    updateUser(id, { status: newStatus });
  };

  return (
    <div id="user-management-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              User Access & Role-Based Access Control (RBAC)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage employee portal authentication, department security privileges, data publishing rights, and login credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMatrix(!showMatrix)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-slate-600" />
            <span>{showMatrix ? 'Hide Security Matrix' : 'View Permissions Matrix'}</span>
          </button>

          {(isSuperAdmin || isMISAdmin) && (
            <button
              id="add-user-btn"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Employee User</span>
            </button>
          )}
        </div>
      </div>

      {/* RBAC Permissions Matrix Accordion */}
      {showMatrix && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-blue-600" />
              Role Permissions Policy Map
            </h3>
            <span className="text-[11px] text-slate-500">Enforced on Client & Firestore Security Rules</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2">Role Title</th>
                  <th className="px-3 py-2 text-center">Dashboard</th>
                  <th className="px-3 py-2 text-center">Publish Reports</th>
                  <th className="px-3 py-2 text-center">Sales Invoices</th>
                  <th className="px-3 py-2 text-center">Stock Inventory</th>
                  <th className="px-3 py-2 text-center">Logistics Dispatch</th>
                  <th className="px-3 py-2 text-center">Partners & Credit</th>
                  <th className="px-3 py-2 text-center">Batch Import</th>
                  <th className="px-3 py-2 text-center">User Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-[11px]">
                <tr>
                  <td className="px-3 py-2 font-bold text-purple-700">Super Admin (Director)</td>
                  <td className="px-3 py-2 text-center text-emerald-600 font-bold">Full</td>
                  <td className="px-3 py-2 text-center text-emerald-600 font-bold">Full</td>
                  <td className="px-3 py-2 text-center text-emerald-600 font-bold">Full</td>
                  <td className="px-3 py-2 text-center text-emerald-600 font-bold">Full</td>
                  <td className="px-3 py-2 text-center text-emerald-600 font-bold">Full</td>
                  <td className="px-3 py-2 text-center text-emerald-600 font-bold">Full</td>
                  <td className="px-3 py-2 text-center text-emerald-600 font-bold">Full</td>
                  <td className="px-3 py-2 text-center text-emerald-600 font-bold">Full</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-bold text-blue-700">MIS Admin (Publisher)</td>
                  <td className="px-3 py-2 text-center text-emerald-600 font-bold">Full</td>
                  <td className="px-3 py-2 text-center text-emerald-600 font-bold">Full</td>
                  <td className="px-3 py-2 text-center text-emerald-600 font-bold">Full</td>
                  <td className="px-3 py-2 text-center text-emerald-600 font-bold">Full</td>
                  <td className="px-3 py-2 text-center text-emerald-600 font-bold">Full</td>
                  <td className="px-3 py-2 text-center text-emerald-600 font-bold">Full</td>
                  <td className="px-3 py-2 text-center text-emerald-600 font-bold">Full</td>
                  <td className="px-3 py-2 text-center text-emerald-600 font-bold">Full</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-bold text-emerald-700">Sales Manager</td>
                  <td className="px-3 py-2 text-center text-blue-600">View</td>
                  <td className="px-3 py-2 text-center text-slate-400">View</td>
                  <td className="px-3 py-2 text-center text-emerald-600 font-bold">Full</td>
                  <td className="px-3 py-2 text-center text-blue-600">View</td>
                  <td className="px-3 py-2 text-center text-blue-600">View</td>
                  <td className="px-3 py-2 text-center text-emerald-600 font-bold">Full</td>
                  <td className="px-3 py-2 text-center text-slate-300">No</td>
                  <td className="px-3 py-2 text-center text-slate-300">No</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-bold text-indigo-700">Logistics Manager</td>
                  <td className="px-3 py-2 text-center text-blue-600">View</td>
                  <td className="px-3 py-2 text-center text-slate-400">View</td>
                  <td className="px-3 py-2 text-center text-blue-600">View</td>
                  <td className="px-3 py-2 text-center text-emerald-600 font-bold">Full</td>
                  <td className="px-3 py-2 text-center text-emerald-600 font-bold">Full</td>
                  <td className="px-3 py-2 text-center text-blue-600">View</td>
                  <td className="px-3 py-2 text-center text-slate-300">No</td>
                  <td className="px-3 py-2 text-center text-slate-300">No</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-bold text-amber-700">Accounts & Finance</td>
                  <td className="px-3 py-2 text-center text-blue-600">View</td>
                  <td className="px-3 py-2 text-center text-slate-400">View</td>
                  <td className="px-3 py-2 text-center text-blue-600">View</td>
                  <td className="px-3 py-2 text-center text-blue-600">View</td>
                  <td className="px-3 py-2 text-center text-blue-600">View</td>
                  <td className="px-3 py-2 text-center text-emerald-600 font-bold">Full</td>
                  <td className="px-3 py-2 text-center text-slate-300">No</td>
                  <td className="px-3 py-2 text-center text-slate-300">No</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-bold text-slate-700">Authorized Employee</td>
                  <td className="px-3 py-2 text-center text-blue-600">View</td>
                  <td className="px-3 py-2 text-center text-slate-400">View</td>
                  <td className="px-3 py-2 text-center text-slate-300">No</td>
                  <td className="px-3 py-2 text-center text-blue-600">View</td>
                  <td className="px-3 py-2 text-center text-blue-600">View</td>
                  <td className="px-3 py-2 text-center text-slate-300">No</td>
                  <td className="px-3 py-2 text-center text-slate-300">No</td>
                  <td className="px-3 py-2 text-center text-slate-300">No</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="search-users-input"
            type="text"
            placeholder="Search employee by name, official email, or department..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="mis_admin">MIS Admin</option>
            <option value="sales_manager">Sales Manager</option>
            <option value="logistics_manager">Logistics Manager</option>
            <option value="accounts_manager">Accounts Manager</option>
            <option value="employee">Employee / Staff</option>
          </select>

          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Departments</option>
            <option value="Executive Management">Executive Management</option>
            <option value="MIS & Operations">MIS & Operations</option>
            <option value="Sales & Distribution">Sales & Distribution</option>
            <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
            <option value="Finance & Commercial">Finance & Commercial</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Employee Name & Email</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Assigned Role</th>
                <th className="px-4 py-3">Last Active</th>
                <th className="px-4 py-3 text-center">Status</th>
                {(isSuperAdmin || isMISAdmin) && <th className="px-4 py-3 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.map(u => {
                const uid = getUserId(u);
                return (
                  <tr key={uid || u.email} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <span>{u.displayName}</span>
                        {uid === currentUser?.uid && (
                          <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-bold">You</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" />
                        {u.email}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {u.department}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {getRoleBadge(u.role)}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-slate-500 text-[11px]">
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : 'Never logged in'}
                    </td>

                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {u.status === 'active' ? 'Active' : 'Suspended'}
                      </span>
                    </td>

                    {(isSuperAdmin || isMISAdmin) && (
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className={`p-1 rounded text-xs ${
                              u.status === 'active'
                                ? 'text-amber-600 hover:bg-amber-50'
                                : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={u.status === 'active' ? 'Suspend Access' : 'Activate User'}
                          >
                            {u.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                          </button>

                          {isSuperAdmin && uid !== currentUser?.uid && (
                            <button
                              onClick={() => {
                                if (confirm(`Permanently remove employee account "${u.displayName}"?`)) {
                                  deleteUser(uid);
                                }
                              }}
                              className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                              title="Delete User"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <AddUserModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
};
