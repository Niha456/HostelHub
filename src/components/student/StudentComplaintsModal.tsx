import React, { useState } from 'react';
import { store } from '../../services/store';
import { Complaint, ComplaintCategory } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { X, Plus, AlertCircle, Clock, CheckCircle2, UserCheck, Search } from 'lucide-react';

interface StudentComplaintsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRaiseModal: () => void;
}

export const StudentComplaintsModal: React.FC<StudentComplaintsModalProps> = ({
  isOpen,
  onClose,
  onOpenRaiseModal,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isOpen) return null;

  const complaints = store.complaints;
  const filtered = complaints.filter((c) => {
    if (filterCategory !== 'ALL' && c.category !== filterCategory) return false;
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
    if (searchTerm) {
      const matchTitle = c.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDesc = c.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchId = c.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchTitle || matchDesc || matchId;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Complaints & Maintenance Log</h3>
              <p className="text-xs text-slate-500">Live SLA tracking, technician assignment & photo verification</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenRaiseModal();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Raise New</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/40 flex flex-wrap gap-2 items-center justify-between text-xs">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search complaints or ticket ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Cleaning">Cleaning</option>
              <option value="AC">Air Conditioning</option>
              <option value="Furniture">Furniture</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>

        {/* List of complaints */}
        <div className="p-6 overflow-y-auto space-y-3 text-xs">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p>No complaints match the filter criteria.</p>
            </div>
          ) : (
            filtered.map((comp) => {
              const deadlineDate = new Date(comp.slaDeadline);
              const isOverdue = deadlineDate.getTime() < Date.now() && comp.status !== 'RESOLVED';
              return (
                <div
                  key={comp.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-xs space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-600">{comp.id}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-bold text-slate-900 text-sm">{comp.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge priority={comp.priority} />
                      <StatusBadge status={comp.status} />
                    </div>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed">{comp.description}</p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <div className="flex items-center gap-3">
                      <span>Category: <strong className="text-slate-700">{comp.category}</strong></span>
                      <span>Location: <strong className="text-slate-700">{comp.location}</strong></span>
                      {comp.assignedStaffName && (
                        <span className="flex items-center gap-1 text-blue-700 font-semibold">
                          <UserCheck className="w-3.5 h-3.5" />
                          Assigned: {comp.assignedStaffName} ({comp.assignedStaffRole})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1 font-medium ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                        <Clock className="w-3.5 h-3.5" />
                        SLA: {deadlineDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {deadlineDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>

                  {/* Resolution Proof if resolved */}
                  {comp.status === 'RESOLVED' && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center justify-between">
                      <div>
                        <strong>Resolved by {comp.assignedStaffName || 'Technician'}:</strong> {comp.resolutionNotes || 'Fixed and tested successfully.'}
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold text-[10px]">
                        VERIFIED
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">Total {filtered.length} tickets recorded</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
