import React from 'react';
import { store } from '../../services/store';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Users,
  AlertCircle,
  Clock,
  ShieldCheck,
  DoorClosed,
} from 'lucide-react';

export const ReportsAnalytics: React.FC = () => {
  const stats = store.getStats();

  const handleExportCSV = (reportType: string) => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (reportType === 'students') {
      csvContent += 'ID,Name,Room,Block,Department,Attendance,Status,Phone\n';
      store.students.forEach((s) => {
        csvContent += `"${s.studentId}","${s.name}","${s.room}","${s.block}","${s.department}","${s.attendancePercentage}%","${s.status}","${s.phone}"\n`;
      });
    } else if (reportType === 'complaints') {
      csvContent += 'TicketID,Title,Category,Priority,Status,Room,Student,AssignedStaff,Deadline\n';
      store.complaints.forEach((c) => {
        csvContent += `"${c.id}","${c.title}","${c.category}","${c.priority}","${c.status}","${c.studentRoom}","${c.studentName}","${c.assignedStaffName || 'None'}","${c.slaDeadline}"\n`;
      });
    } else {
      csvContent += 'PassID,Student,Room,Destination,Status,Departure,CurfewReturn\n';
      store.outpasses.forEach((o) => {
        csvContent += `"${o.id}","${o.studentName}","${o.studentRoom}","${o.destination}","${o.status}","${o.fromDateTime}","${o.toDateTime}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hostelhub_${reportType}_audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    store.showToast('success', `Exported ${reportType.toUpperCase()} report successfully.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            Hostel Operations Analytics & Compliance Auditing
          </h2>
          <p className="text-xs text-slate-500">
            Export monthly attendance reports, maintenance SLA compliance records, and security gate movements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportCSV('students')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Hosteller Roster</span>
          </button>
          <button
            onClick={() => handleExportCSV('complaints')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Maintenance SLA Log</span>
          </button>
        </div>
      </div>

      {/* Analytical KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block uppercase">Overall Attendance Avg</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-slate-900">{stats.averageAttendance}%</span>
            <span className="text-xs text-emerald-600 font-bold">+2.4% vs last term</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Calculated over 500 residents</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block uppercase">Maintenance Resolution Rate</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-slate-900">{stats.resolvedRate}%</span>
            <span className="text-xs text-emerald-600 font-bold">Within SLA</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{stats.pendingComplaints} tickets currently open</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block uppercase">Active Gate Movements Today</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-slate-900">142</span>
            <span className="text-xs text-blue-600 font-bold">Scans</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Outpasses and visitor passes combined</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block uppercase">Active Room Utilization</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-slate-900">{stats.occupancyRate}%</span>
            <span className="text-xs text-purple-600 font-bold">Optimal</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">492 out of 520 beds occupied</p>
        </div>
      </div>

      {/* Category Breakdown & Audit Report Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900">Complaints Volume by Infrastructure Category</h3>
          <div className="space-y-2.5 text-xs">
            {[
              { cat: 'Electrical (Fans, Switches, Ballasts)', count: 18, pct: 45, color: 'bg-blue-600' },
              { cat: 'Plumbing (Faucets, Drains, Flush Valves)', count: 12, pct: 30, color: 'bg-cyan-600' },
              { cat: 'Air Conditioning & Ventilation', count: 6, pct: 15, color: 'bg-indigo-600' },
              { cat: 'Carpentry & Furniture', count: 4, pct: 10, color: 'bg-amber-600' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-800">
                  <span>{item.cat}</span>
                  <span className="font-mono font-bold text-slate-900">{item.count} tickets ({item.pct}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Report Downloads */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900">Campus Compliance & Audit Downloads</h3>
          <div className="space-y-2.5">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <div>
                <strong className="text-slate-900 block">Biometric Attendance Audit (30-Day Ledger)</strong>
                <span className="text-[11px] text-slate-500">Includes roll call absences and curfew infringements</span>
              </div>
              <button
                onClick={() => handleExportCSV('students')}
                className="px-3 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 font-bold text-slate-800 text-[11px]"
              >
                Download CSV
              </button>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <div>
                <strong className="text-slate-900 block">Outpass & Night Travel Log</strong>
                <span className="text-[11px] text-slate-500">Parent verification timestamps and gate security scan logs</span>
              </div>
              <button
                onClick={() => handleExportCSV('outpasses')}
                className="px-3 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 font-bold text-slate-800 text-[11px]"
              >
                Download CSV
              </button>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <div>
                <strong className="text-slate-900 block">Technician Performance & SLA Auditing</strong>
                <span className="text-[11px] text-slate-500">Average resolution turnaround and overdue breach count</span>
              </div>
              <button
                onClick={() => handleExportCSV('complaints')}
                className="px-3 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 font-bold text-slate-800 text-[11px]"
              >
                Download CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
