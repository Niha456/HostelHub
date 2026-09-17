import React from 'react';
import { store } from '../../services/store';
import { StatusBadge } from '../common/StatusBadge';
import {
  Users,
  DoorClosed,
  CalendarCheck,
  AlertCircle,
  Clock,
  UserCheck,
  Ticket,
  Wrench,
  TrendingUp,
  AlertOctagon,
  ChevronRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';

interface WardenOverviewProps {
  onNavigateTab: (tab: string) => void;
}

export const WardenOverview: React.FC<WardenOverviewProps> = ({ onNavigateTab }) => {
  const stats = store.getStats();
  const rooms = store.rooms;
  const complaints = store.complaints;
  const outpasses = store.outpasses;
  const visitors = store.visitors;
  const emergencies = store.emergencies;

  const pendingComplaints = complaints.filter((c) => c.status === 'SUBMITTED');
  const pendingOutpasses = outpasses.filter((o) => o.status === 'PENDING');
  const pendingVisitors = visitors.filter((v) => v.status === 'PENDING');
  const activeEmergencies = emergencies.filter((e) => e.status === 'ACTIVE');

  return (
    <div className="space-y-6">
      {/* Top Banner with Active Emergency Warning if any */}
      {activeEmergencies.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-600 text-white shadow-lg flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-6 h-6 text-white" />
            <div>
              <h3 className="font-extrabold text-sm">URGENT: {activeEmergencies[0].emergencyType} EMERGENCY IN ROOM {activeEmergencies[0].studentRoom}</h3>
              <p className="text-xs text-rose-100">{activeEmergencies[0].message || 'Immediate warden intervention dispatched.'}</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('emergency')}
            className="px-4 py-2 rounded-xl bg-white text-rose-700 font-bold text-xs hover:bg-rose-50"
          >
            Review SOS Alert →
          </button>
        </div>
      )}

      {/* 4 Core Residence KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Hostellers */}
        <div
          onClick={() => onNavigateTab('students')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold">Registered Hostellers</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.totalStudents}</span>
            <span className="text-xs text-blue-600 font-bold">500 in Database</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Blocks A, B & C combined roster</p>
        </div>

        {/* Room Occupancy */}
        <div
          onClick={() => onNavigateTab('rooms')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold">Room Occupancy Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DoorClosed className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.occupancyRate}%</span>
            <span className="text-xs text-emerald-600 font-bold">Optimal</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{rooms.length} rooms mapped across 3 blocks</p>
        </div>

        {/* Night Roll Call Attendance */}
        <div
          onClick={() => onNavigateTab('attendance')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold">Night Attendance Avg</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.averageAttendance}%</span>
            <span className="text-xs text-purple-600 font-bold">Present</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{stats.studentsOutside} hostellers currently outside</p>
        </div>

        {/* Complaints in Queue & SLA */}
        <div
          onClick={() => onNavigateTab('complaints')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold">Complaints Queue</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.pendingComplaints}</span>
            <span className="text-xs text-rose-600 font-bold">{stats.slaViolations} Overdue</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Click to dispatch to technicians</p>
        </div>
      </div>

      {/* Action Queue Bar: Pending Approvals requiring Warden Decision */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="font-bold text-sm">Action Items Requiring Warden Approval</h3>
          </div>
          <span className="text-xs text-slate-400">
            {pendingOutpasses.length + pendingVisitors.length + pendingComplaints.length} pending requests
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => onNavigateTab('outpasses')}
            className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-between text-left transition-all"
          >
            <div className="flex items-center gap-2.5">
              <Ticket className="w-4 h-4 text-purple-400" />
              <div>
                <span className="text-xs font-bold block text-slate-200">Outpass Requests</span>
                <span className="text-[11px] text-slate-400">{pendingOutpasses.length} pending warden review</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs">
              {pendingOutpasses.length}
            </span>
          </button>

          <button
            onClick={() => onNavigateTab('visitors')}
            className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-between text-left transition-all"
          >
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-xs font-bold block text-slate-200">Visitor Passes</span>
                <span className="text-[11px] text-slate-400">{pendingVisitors.length} awaiting pass authorization</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs">
              {pendingVisitors.length}
            </span>
          </button>

          <button
            onClick={() => onNavigateTab('complaints')}
            className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-between text-left transition-all"
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-xs font-bold block text-slate-200">New Complaints</span>
                <span className="text-[11px] text-slate-400">{pendingComplaints.length} unassigned maintenance tickets</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs">
              {pendingComplaints.length}
            </span>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Quick Dispatch Queue & Room Occupancy Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Pending Complaints Requiring Staff Dispatch */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Complaints Awaiting Technician Assignment</h3>
              </div>
              <button
                onClick={() => onNavigateTab('complaints')}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold"
              >
                View Queue →
              </button>
            </div>

            <div className="space-y-3">
              {pendingComplaints.slice(0, 3).map((comp) => (
                <div
                  key={comp.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{comp.title}</span>
                      <StatusBadge priority={comp.priority} />
                    </div>
                    <p className="text-[11px] text-slate-600">{comp.description}</p>
                    <div className="text-[10px] text-slate-400 flex items-center gap-3">
                      <span>Room: <strong>{comp.studentRoom} ({comp.studentBlock})</strong></span>
                      <span>By: <strong>{comp.studentName}</strong></span>
                      <span>Category: <strong>{comp.category}</strong></span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      store.assignComplaintToStaff(comp.id, 'Ramesh Kumar', 'Electrician');
                    }}
                    className="flex-shrink-0 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-xs transition-colors"
                  >
                    Assign Ramesh
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4 flex justify-between items-center text-xs text-slate-500">
            <span>Automatic SLA deadlines computed on creation</span>
            <button
              onClick={() => onNavigateTab('problem-map')}
              className="text-blue-600 hover:underline font-semibold"
            >
              View Problem Heatmap →
            </button>
          </div>
        </div>

        {/* Right: Block Breakdown & Room Occupancy */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-sm">Hostel Block Occupancy Breakdown</h3>
              </div>
              <button
                onClick={() => onNavigateTab('rooms')}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold"
              >
                Room Matrix →
              </button>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Block A (Engineering Wings)', cap: 180, occ: 172, warden: 'Dr. Rajesh Kumar' },
                { name: 'Block B (Science & Architecture)', cap: 160, occ: 151, warden: 'Prof. Ananya Sen' },
                { name: 'Block C (Postgraduate Residence)', cap: 180, occ: 169, warden: 'Dr. K. Srinivas' },
              ].map((blk, idx) => {
                const pct = Math.round((blk.occ / blk.cap) * 100);
                return (
                  <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <strong className="text-slate-900">{blk.name}</strong>
                      <span className="font-mono text-slate-600 font-bold">{blk.occ}/{blk.cap} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          pct > 92 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Warden In-charge: {blk.warden}</span>
                      <span>{blk.cap - blk.occ} Vacant Beds Available</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4 flex justify-between items-center text-xs text-slate-500">
            <span>Overall Campus Capacity: 520 Beds</span>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-blue-600 hover:underline font-semibold"
            >
              Export Report PDF →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
