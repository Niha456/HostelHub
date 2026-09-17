import React, { useState } from 'react';
import { store } from '../../services/store';
import { AttendanceRecord } from '../../types';
import { X, CalendarCheck, AlertTriangle, CheckCircle, Clock, ShieldCheck } from 'lucide-react';

interface StudentAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentAttendanceModal: React.FC<StudentAttendanceModalProps> = ({ isOpen, onClose }) => {
  const [selectedDisputeRecord, setSelectedDisputeRecord] = useState<AttendanceRecord | null>(null);
  const [disputeReason, setDisputeReason] = useState('');

  if (!isOpen) return null;

  const records = store.attendanceRecords;
  const presentCount = records.filter((r) => r.status === 'PRESENT').length;
  const totalCount = records.length || 1;
  const attendancePercentage = Math.round((presentCount / totalCount) * 100);

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDisputeRecord || !disputeReason.trim()) return;

    store.requestAttendanceRectification({
      recordId: selectedDisputeRecord.id,
      date: selectedDisputeRecord.date,
      reason: disputeReason,
    });
    setSelectedDisputeRecord(null);
    setDisputeReason('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Student Biometric & Night Roll Call Attendance</h3>
              <p className="text-xs text-slate-500">Official verified attendance record for Divya Sharma (STU0001)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Summary KPIs */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] text-emerald-600 font-bold uppercase block">Attendance Rate</span>
              <span className="text-lg font-black text-emerald-700">{attendancePercentage}%</span>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-[10px] text-blue-600 font-bold uppercase block">Present Days</span>
              <span className="text-lg font-black text-blue-700">{presentCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] text-amber-600 font-bold uppercase block">Authorized Leave</span>
              <span className="text-lg font-black text-amber-700">
                {records.filter((r) => r.status === 'ON_LEAVE').length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
              <span className="text-[10px] text-rose-600 font-bold uppercase block">Curfew Violations</span>
              <span className="text-lg font-black text-rose-700">
                {records.filter((r) => r.status === 'ABSENT' || r.status === 'LATE').length}
              </span>
            </div>
          </div>

          {/* Records Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Check-in Time</th>
                  <th className="py-2.5 px-3">Remarks / Verified By</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{r.date}</td>
                    <td className="py-2.5 px-3 text-slate-600">{r.type || 'Night Roll Call'}</td>
                    <td className="py-2.5 px-3">
                      {r.status === 'PRESENT' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Present
                        </span>
                      )}
                      {r.status === 'ON_LEAVE' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          On Leave
                        </span>
                      )}
                      {r.status === 'LATE' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Late Check-in
                        </span>
                      )}
                      {r.status === 'ABSENT' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          Absent
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">{r.markedTime || r.rollCallTime || '—'}</td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-[160px] truncate" title={r.remarks}>
                      {r.remarks || (r.verifiedBy ? `Verified by ${r.verifiedBy}` : 'Verified by Night Warden')}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {r.status !== 'PRESENT' && (
                        <button
                          onClick={() => setSelectedDisputeRecord(r)}
                          className="text-blue-600 hover:text-blue-800 font-bold text-[10px] underline"
                        >
                          Dispute Record
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Dispute Form */}
          {selectedDisputeRecord && (
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-amber-900 text-xs">
                  File Dispute for {selectedDisputeRecord.date} ({selectedDisputeRecord.status})
                </span>
                <button
                  onClick={() => setSelectedDisputeRecord(null)}
                  className="text-amber-800 hover:text-black text-xs"
                >
                  ✕ Cancel
                </button>
              </div>
              <form onSubmit={handleDisputeSubmit} className="space-y-2">
                <textarea
                  rows={2}
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="Explain why this status is incorrect (e.g. library study pass approved, biometric reader failed)..."
                  className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-white text-xs font-medium focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-700"
                >
                  Submit Dispute to Warden
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
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
