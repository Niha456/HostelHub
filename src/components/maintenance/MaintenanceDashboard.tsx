import React, { useState } from 'react';
import { store } from '../../services/store';
import { StatusBadge } from '../common/StatusBadge';
import { Complaint } from '../../types';
import { EvacuationMapModal } from '../student/EvacuationMapModal';
import {
  Wrench,
  CheckCircle2,
  Clock,
  Camera,
  AlertCircle,
  Upload,
  UserCheck,
  Search,
  Check,
} from 'lucide-react';

interface MaintenanceDashboardProps {
  activeTab?: string;
}

export const MaintenanceDashboard: React.FC<MaintenanceDashboardProps> = () => {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedTicket, setSelectedTicket] = useState<Complaint | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [afterPhotoUrl, setAfterPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600'
  );
  const [showEvacuation, setShowEvacuation] = useState(false);

  const complaints = store.complaints;
  // Current user technician
  const currentUser = store.currentUser || { name: 'Ramesh Kumar', role: 'Electrician' };

  const filtered = complaints.filter((c) => {
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
    return true;
  });

  const handleStartWork = (id: string) => {
    store.updateComplaintStatus(id, 'IN_PROGRESS');
  };

  const handleResolveTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !resolutionNotes.trim()) return;

    store.resolveComplaint(selectedTicket.id, resolutionNotes, afterPhotoUrl);
    setSelectedTicket(null);
    setResolutionNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Maintenance Crew Header */}
      <div className="bg-gradient-to-r from-blue-800 via-indigo-900 to-slate-900 rounded-3xl p-6 lg:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Wrench className="w-6 h-6 text-blue-400" />
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              CAMPUS ENGINEERING & MAINTENANCE CREW
            </span>
          </div>
          <h2 className="text-xl lg:text-2xl font-black">Technician Work Orders & SLA Tracker</h2>
          <p className="text-xs text-slate-300">
            Assigned tasks for Ramesh Kumar (Lead Electrician & HVAC) • Immediate SLA dispatch
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowEvacuation(true)}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all"
          >
            Evacuation Blueprint
          </button>
        </div>
      </div>

      {/* 2. KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block uppercase">Assigned Work Orders</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-slate-900">{complaints.length}</span>
            <span className="text-xs text-blue-600 font-bold">Total</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across all blocks & common halls</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block uppercase">In Repair (Work Started)</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-amber-600">
              {complaints.filter((c) => c.status === 'IN_PROGRESS').length}
            </span>
            <span className="text-xs text-amber-600 font-bold">Active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Under active physical repair</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block uppercase">Overdue SLA Warning</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-rose-600">1</span>
            <span className="text-xs text-rose-600 font-bold">Overdue</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Priority ticket SLA breach</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block uppercase">Resolved & Verified</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-emerald-600">
              {complaints.filter((c) => c.status === 'RESOLVED').length}
            </span>
            <span className="text-xs text-emerald-600 font-bold">Verified</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Proof uploaded and inspected</p>
        </div>
      </div>

      {/* 3. Work Orders List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Wrench className="w-4 h-4 text-blue-600" />
            Active Maintenance Work Orders
          </h3>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Work Orders</option>
            <option value="ASSIGNED">Assigned (Ready to Start)</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved / Completed</option>
          </select>
        </div>

        <div className="p-6 space-y-4">
          {filtered.map((comp) => {
            const deadline = new Date(comp.slaDeadline);
            const isOverdue = deadline.getTime() < Date.now() && comp.status !== 'RESOLVED';
            return (
              <div
                key={comp.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-600 text-xs">{comp.id}</span>
                      <span className="text-slate-300">•</span>
                      <h4 className="font-bold text-slate-900 text-sm">{comp.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{comp.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge priority={comp.priority} />
                    <StatusBadge status={comp.status} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 text-xs text-slate-600">
                  <div>
                    Location: <strong className="text-slate-900">Room {comp.studentRoom} ({comp.studentBlock})</strong>
                  </div>
                  <div>
                    Resident: <strong className="text-slate-900">{comp.studentName}</strong>
                  </div>
                  <div className={isOverdue ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                    SLA Deadline:{' '}
                    <strong>
                      {deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                      {deadline.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </strong>
                  </div>
                </div>

                {/* Attached student before photo */}
                {comp.photoUrl && (
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase mb-1">
                      Resident Attached Inspection Photo
                    </span>
                    <img
                      src={comp.photoUrl}
                      alt="Inspection"
                      className="w-48 h-32 rounded-xl object-cover border border-slate-200"
                    />
                  </div>
                )}

                {/* Technician Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-400">
                    Category: <strong>{comp.category}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    {comp.status === 'ASSIGNED' && (
                      <button
                        onClick={() => handleStartWork(comp.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors"
                      >
                        Start Repair Work
                      </button>
                    )}
                    {comp.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => setSelectedTicket(comp)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Complete & Upload Photo Proof</span>
                      </button>
                    )}
                    {comp.status === 'RESOLVED' && (
                      <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Completed & Verified by Staff</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">Complete Work Order #{selectedTicket.id}</h3>
              <button
                onClick={() => setSelectedTicket(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleResolveTicket} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Work Resolution Summary</label>
                <textarea
                  rows={3}
                  required
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Describe repair actions taken (e.g. replaced wiring choke, tested voltage output)..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">After-Repair Photo URL (Verification Proof)</label>
                <input
                  type="url"
                  required
                  value={afterPhotoUrl}
                  onChange={(e) => setAfterPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
                <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 h-36">
                  <img src={afterPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Confirm Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <EvacuationMapModal isOpen={showEvacuation} onClose={() => setShowEvacuation(false)} />
    </div>
  );
};
