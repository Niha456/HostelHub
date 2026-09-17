import React, { useState } from 'react';
import { store } from '../../services/store';
import { AttendanceRecord, AttendanceStatus } from '../../types';
import {
  CalendarCheck,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Users,
  ShieldCheck,
  Building2,
  AlertTriangle,
} from 'lucide-react';

export const NightRollCall: React.FC = () => {
  const [selectedBlock, setSelectedBlock] = useState('Block A');
  const [selectedFloor, setSelectedFloor] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]);

  const students = store.students;

  const filteredStudents = students.filter((s) => {
    if (s.block !== selectedBlock) return false;
    if (searchTerm) {
      const matchName = s.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchId = s.studentId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRoom = s.room.toLowerCase().includes(searchTerm.toLowerCase());
      return matchName || matchId || matchRoom;
    }
    return true;
  });

  const handleMark = (studentId: string, status: AttendanceStatus) => {
    store.markAttendanceRecord({
      studentId,
      date: dateStr,
      status,
      type: 'NIGHT_ROLL_CALL',
      markedBy: 'Warden Dr. Rajesh Kumar',
    });
  };

  const handleMarkAllPresent = () => {
    filteredStudents.forEach((s) => {
      store.markAttendanceRecord({
        studentId: s.id,
        date: dateStr,
        status: 'PRESENT',
        type: 'NIGHT_ROLL_CALL',
        markedBy: 'Warden Dr. Rajesh Kumar',
      });
    });
    store.showToast('success', `Marked all ${filteredStudents.length} students in ${selectedBlock} as Present!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-indigo-600" />
            Warden 10:00 PM Night Roll Call & Biometric Audit
          </h2>
          <p className="text-xs text-slate-500">
            Official mandatory resident headcount verifying bed presence, approved leaves, and unauthorized absence
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="date"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 font-bold focus:outline-none"
          />

          <div className="flex items-center gap-1">
            {['Block A', 'Block B', 'Block C'].map((blk) => (
              <button
                key={blk}
                onClick={() => setSelectedBlock(blk)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  selectedBlock === blk
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {blk}
              </button>
            ))}
          </div>

          <button
            onClick={handleMarkAllPresent}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            Mark All In-Room Present
          </button>
        </div>
      </div>

      {/* Roster & Headcount Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="font-semibold text-slate-600">
              Total Students to Verify: <strong className="text-slate-900">{filteredStudents.length}</strong>
            </span>
            <span className="text-emerald-700 font-semibold">
              Curfew Cutoff: <strong>10:00 PM Sharp</strong>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="py-3 px-4">Room & Bed</th>
                <th className="py-3 px-4">Hosteller Name & ID</th>
                <th className="py-3 px-4">Biometric Status</th>
                <th className="py-3 px-4">Parent Mobile</th>
                <th className="py-3 px-4 text-right">Warden Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 text-sm">{st.room}</span>
                    <span className="text-[10px] text-slate-400 block">{st.block}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{st.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{st.studentId} • {st.department}</span>
                  </td>
                  <td className="py-3 px-4">
                    {st.status === 'OUTSIDE' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" />
                        Outside Campus on Outpass
                      </span>
                    ) : st.status === 'ON_LEAVE' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                        Authorized Leave
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Gate Check-in Recorded
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-[11px]">
                    <div>{st.guardianPhone}</div>
                    <div className="text-[10px] text-slate-400">({st.guardianName})</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleMark(st.id, 'PRESENT')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs"
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleMark(st.id, 'LATE')}
                        className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px]"
                      >
                        Late
                      </button>
                      <button
                        onClick={() => handleMark(st.id, 'ABSENT')}
                        className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-[11px]"
                      >
                        Absent (Flag SMS)
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
