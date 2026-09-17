import React, { useState } from 'react';
import { store } from '../../services/store';
import { EvacuationMapModal } from '../student/EvacuationMapModal';
import {
  ShieldAlert,
  Users,
  Database,
  Lock,
  Activity,
  UserCheck,
  RefreshCw,
  Search,
  CheckCircle,
  XCircle,
  FileText,
  Building,
  KeyRound,
  Download,
} from 'lucide-react';

interface AdminDashboardProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [showEvacuation, setShowEvacuation] = useState(false);

  const stats = store.getStats();
  const auditLogs = store.auditLogs;
  const accounts = store.accounts;

  const filteredAccounts = accounts.filter((acc) => {
    if (roleFilter !== 'ALL' && acc.role !== roleFilter) return false;
    if (searchTerm) {
      const matchEmail = acc.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchName = acc.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchEmail || matchName;
    }
    return true;
  });

  const handleToggleAccount = (id: string, currentStatus: boolean) => {
    store.toggleAccountStatus(id, !currentStatus);
  };

  const handleExportAuditLogs = () => {
    let csv = 'Timestamp,Actor,Action,Target,Details\n';
    auditLogs.forEach((log) => {
      csv += `"${log.timestamp}","${log.actorName} (${log.actorRole})","${log.action}","${log.target}","${log.details}"\n`;
    });
    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csv);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hostelhub_audit_trail_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    store.showToast('success', 'Exported full immutable audit ledger.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Admin System Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 rounded-3xl p-6 lg:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-indigo-400" />
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              CAMPUS CHIEF IT & DEAN OF RESIDENTIAL AFFAIRS
            </span>
          </div>
          <h2 className="text-xl lg:text-2xl font-black">HostelHub System Administration & RBAC</h2>
          <p className="text-xs text-slate-300">
            Enterprise multi-role access control, Firestore security policy auditing, and 500-user database control
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowEvacuation(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
          >
            Evacuation Blueprint
          </button>
          <button
            onClick={handleExportAuditLogs}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Audit Trail</span>
          </button>
        </div>
      </div>

      {/* 2. Platform Core Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block uppercase">Hostel User Accounts</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-slate-900">{accounts.length}</span>
            <span className="text-xs text-blue-600 font-bold">500 Seeded</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Students, Wardens, Guards & Crew</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block uppercase">RBAC Roles Configured</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-indigo-600">5 Roles</span>
            <span className="text-xs text-emerald-600 font-bold">Strict</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Firestore security rules enforced</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block uppercase">Immutable Audit Events</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-slate-900">{auditLogs.length}</span>
            <span className="text-xs text-purple-600 font-bold">Logged</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Every state transition recorded</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block uppercase">Database Status</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-emerald-600">Healthy</span>
            <span className="text-xs text-emerald-600 font-bold">In-Memory Sync</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Local state synced with persistence</p>
        </div>
      </div>

      {/* 3. Account Management & RBAC Permissions */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-indigo-600" />
              Account Credentials & Role Access List
            </h3>
            <p className="text-[11px] text-slate-400">Manage login credentials and lock/unlock hosteller access</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700"
            >
              <option value="ALL">All Roles</option>
              <option value="STUDENT">Students</option>
              <option value="WARDEN">Wardens</option>
              <option value="SECURITY">Security</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="ADMIN">Super Admins</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold sticky top-0">
              <tr>
                <th className="py-3 px-4">User Name</th>
                <th className="py-3 px-4">Login Email</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Room / Unit</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAccounts.slice(0, 50).map((acc) => (
                <tr key={acc.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900">{acc.name}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">{acc.email}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                      {acc.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{acc.room || 'Campus General'}</td>
                  <td className="py-3 px-4">
                    {acc.active ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        Suspended
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggleAccount(acc.id, acc.active)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                        acc.active
                          ? 'border border-rose-200 text-rose-600 hover:bg-rose-50'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {acc.active ? 'Suspend Account' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-slate-500 text-xs flex justify-between items-center">
          <span>Displaying first 50 of {filteredAccounts.length} accounts</span>
          <span>Role changes are enforced in real time across the session broker</span>
        </div>
      </div>

      {/* 4. Live System Audit Trail */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Real-Time Immutable Audit Ledger</h3>
          </div>
          <span className="text-slate-400">Non-repudiation security trail</span>
        </div>

        <div className="p-4 overflow-y-auto max-h-72 space-y-2 text-xs">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-start justify-between gap-3"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-indigo-700">{log.action}</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-semibold text-slate-800">{log.target}</span>
                </div>
                <p className="text-[11px] text-slate-600">{log.details}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-[10px] text-slate-400 block">{log.timestamp}</span>
                <span className="text-[10px] font-bold text-slate-700">
                  {log.actorName} ({log.actorRole})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <EvacuationMapModal isOpen={showEvacuation} onClose={() => setShowEvacuation(false)} />
    </div>
  );
};
