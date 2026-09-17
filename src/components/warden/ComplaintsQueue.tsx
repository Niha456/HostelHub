import React, { useState } from 'react';
import { store } from '../../services/store';
import { StatusBadge } from '../common/StatusBadge';
import { Complaint, ComplaintCategory } from '../../types';
import {
  AlertCircle,
  Wrench,
  UserCheck,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  X,
  Camera,
} from 'lucide-react';

export const ComplaintsQueue: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Assignment Modal
  const [assignModal, setAssignModal] = useState<{ isOpen: boolean; complaint: Complaint | null }>({
    isOpen: false,
    complaint: null,
  });
  const [selectedStaffName, setSelectedStaffName] = useState('Ramesh Kumar');
  const [selectedStaffRole, setSelectedStaffRole] = useState('Electrician');

  const complaints = store.complaints;
  const staff = store.staff;

  const filtered = complaints.filter((c) => {
    if (filterCategory !== 'ALL' && c.category !== filterCategory) return false;
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
    if (searchTerm) {
      const matchTitle = c.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchId = c.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRoom = c.studentRoom.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStudent = c.studentName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchTitle || matchId || matchRoom || matchStudent;
    }
    return true;
  });

  const handleOpenAssign = (c: Complaint) => {
    setAssignModal({ isOpen: true, complaint: c });
    if (c.category === 'Electrical') {
      setSelectedStaffName('Ramesh Kumar');
      setSelectedStaffRole('Electrician');
    } else if (c.category === 'Plumbing') {
      setSelectedStaffName('Mohan Lal');
      setSelectedStaffRole('Plumber');
    } else if (c.category === 'AC') {
      setSelectedStaffName('Anil Verma');
      setSelectedStaffRole('HVAC Tech');
    } else {
      setSelectedStaffName('Ramesh Kumar');
      setSelectedStaffRole('Maintenance Staff');
    }
  };

  const handleConfirmAssign = () => {
    if (!assignModal.complaint) return;
    store.assignComplaintToStaff(assignModal.complaint.id, selectedStaffName, selectedStaffRole);
    setAssignModal({ isOpen: false, complaint: null });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            Maintenance & Complaints Dispatch Queue
          </h2>
          <p className="text-xs text-slate-500">
            Automated SLA countdowns, priority ranking and direct technician dispatch
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search complaints or tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Cleaning">Cleaning</option>
            <option value="AC">AC Unit</option>
            <option value="Furniture">Furniture</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Unassigned (Submitted)</option>
            <option value="ASSIGNED">Assigned to Staff</option>
            <option value="IN_PROGRESS">In Repair</option>
            <option value="RESOLVED">Resolved Tickets</option>
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="py-3 px-4">Ticket & Title</th>
                <th className="py-3 px-4">Location & Resident</th>
                <th className="py-3 px-4">Category & Priority</th>
                <th className="py-3 px-4">SLA Deadline</th>
                <th className="py-3 px-4">Status & Assignment</th>
                <th className="py-3 px-4 text-right">Dispatch Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((comp) => {
                const deadline = new Date(comp.slaDeadline);
                const isOverdue = deadline.getTime() < Date.now() && comp.status !== 'RESOLVED';
                return (
                  <tr key={comp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{comp.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{comp.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">
                        Room {comp.studentRoom} ({comp.studentBlock})
                      </span>
                      <span className="text-[11px] text-slate-500">{comp.studentName}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-slate-700">{comp.category}</span>
                        <StatusBadge priority={comp.priority} />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className={`flex items-center gap-1 ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                          {deadline.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      {isOverdue && (
                        <span className="text-[10px] text-rose-500 font-bold block uppercase">
                          SLA Breach
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <StatusBadge status={comp.status} />
                        {comp.assignedStaffName && (
                          <div className="text-[11px] text-blue-700 font-semibold flex items-center gap-1">
                            <UserCheck className="w-3 h-3" />
                            {comp.assignedStaffName}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {comp.status === 'SUBMITTED' ? (
                        <button
                          onClick={() => handleOpenAssign(comp)}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
                        >
                          Dispatch Staff
                        </button>
                      ) : comp.status === 'RESOLVED' ? (
                        <button
                          onClick={() => setSelectedComplaint(comp)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px]"
                        >
                          View Proof
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenAssign(comp)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-[11px]"
                        >
                          Reassign
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Assignment Modal */}
      {assignModal.isOpen && assignModal.complaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Assign Maintenance Technician</h3>
                <p className="text-xs text-slate-500">Ticket: {assignModal.complaint.id} ({assignModal.complaint.category})</p>
              </div>
              <button
                onClick={() => setAssignModal({ isOpen: false, complaint: null })}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block text-xs">{assignModal.complaint.title}</span>
                <p className="text-slate-600 text-[11px]">{assignModal.complaint.description}</p>
                <div className="text-[10px] text-slate-500 pt-1">
                  Location: <strong>{assignModal.complaint.location}</strong>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">Available Campus Technicians</label>
                <div className="space-y-2">
                  {staff.map((st) => {
                    const isSelected = selectedStaffName === st.name;
                    return (
                      <div
                        key={st.id}
                        onClick={() => {
                          setSelectedStaffName(st.name);
                          setSelectedStaffRole(st.role);
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-400 ring-1 ring-blue-500 font-bold'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={st.avatarUrl}
                            alt={st.name}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                          <div>
                            <span className="text-xs text-slate-900 block">{st.name}</span>
                            <span className="text-[10px] text-slate-500">{st.role} • {st.phone}</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Available
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
              <button
                onClick={() => setAssignModal({ isOpen: false, complaint: null })}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssign}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
              >
                Dispatch Task & Send Notification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolution Proof Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-emerald-50 text-emerald-950">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base">Resolution Verification Proof</h3>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{selectedComplaint.title}</h4>
                <p className="text-slate-500 text-xs mt-0.5">{selectedComplaint.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase mb-1">Before Repair</span>
                  <img
                    src={selectedComplaint.beforePhotoUrl || selectedComplaint.photoUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400'}
                    alt="Before"
                    className="w-full h-36 rounded-xl object-cover border border-slate-200"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase mb-1">After Repair</span>
                  <img
                    src={selectedComplaint.afterPhotoUrl || 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400'}
                    alt="After"
                    className="w-full h-36 rounded-xl object-cover border border-emerald-300 ring-2 ring-emerald-100"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-700 block">Technician Resolution Notes:</span>
                <p className="text-slate-600 text-xs mt-1">
                  {selectedComplaint.resolutionNotes || 'Tested and verified operational. Replaced damaged capacitor and rewired switch.'}
                </p>
                <div className="text-[10px] text-slate-400 mt-2">
                  Completed by: <strong>{selectedComplaint.assignedStaffName || 'Technician'}</strong>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close Proof
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
