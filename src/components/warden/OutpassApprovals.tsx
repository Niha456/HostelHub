import React, { useState } from 'react';
import { store } from '../../services/store';
import { StatusBadge } from '../common/StatusBadge';
import { QRCodeModal } from '../common/QRCodeModal';
import {
  Ticket,
  CheckCircle,
  XCircle,
  Search,
  Phone,
  QrCode,
  Calendar,
  AlertTriangle,
  Clock,
} from 'lucide-react';

export const OutpassApprovals: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [qrModal, setQrModal] = useState<{ isOpen: boolean; outpass: any | null }>({
    isOpen: false,
    outpass: null,
  });

  const outpasses = store.outpasses;

  const filtered = outpasses.filter((op) => {
    if (filterStatus !== 'ALL' && op.status !== filterStatus) return false;
    if (searchTerm) {
      const matchStu = op.studentName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDest = op.destination.toLowerCase().includes(searchTerm.toLowerCase());
      const matchId = op.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchStu || matchDest || matchId;
    }
    return true;
  });

  const handleApprove = (id: string) => {
    store.approveOutpass(id);
  };

  const handleReject = (id: string) => {
    const reason = prompt('Reason for declining outpass:', 'Guardian permission not confirmed or study hours conflict');
    if (reason !== null) {
      store.rejectOutpass(id, reason);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Ticket className="w-5 h-5 text-purple-600" />
            Hosteller Outpass Approvals & Curfew Tracking
          </h2>
          <p className="text-xs text-slate-500">
            Warden authorization for campus gate exits, weekend leaves and emergency travel
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student, destination or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Outpass Requests</option>
            <option value="PENDING">Pending Warden Review</option>
            <option value="APPROVED">Approved Passes</option>
            <option value="ACTIVE_OUT">Currently Outside (Gate Scanned)</option>
            <option value="RETURNED">Returned Inside</option>
          </select>
        </div>
      </div>

      {/* Outpasses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="py-3 px-4">Pass ID & Student</th>
                <th className="py-3 px-4">Destination & Purpose</th>
                <th className="py-3 px-4">Departure & Curfew Return</th>
                <th className="py-3 px-4">Parent Verification</th>
                <th className="py-3 px-4">Pass Status</th>
                <th className="py-3 px-4">Gate Movements</th>
                <th className="py-3 px-4 text-right">Warden Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((op) => (
                <tr key={op.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{op.studentName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {op.id} • Room {op.studentRoom} ({op.studentBlock})
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800 block">{op.destination}</span>
                    <span className="text-[11px] text-slate-500 max-w-[180px] truncate block" title={op.reason}>
                      {op.reason}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div>Out: <span className="font-medium text-slate-800">{op.fromDateTime}</span></div>
                    <div>Back: <span className="font-medium text-slate-800">{op.toDateTime}</span></div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      Verified via SMS
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={op.status} />
                  </td>
                  <td className="py-3 px-4 text-[11px] text-slate-500">
                    {op.actualExitTime ? (
                      <div>
                        Exit: <strong className="text-amber-700">{op.actualExitTime}</strong>
                        {op.actualReturnTime && (
                          <div>Return: <strong className="text-emerald-700">{op.actualReturnTime}</strong></div>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400">Not yet scanned at gate</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {op.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleReject(op.id)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 font-bold text-[11px]"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleApprove(op.id)}
                          className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] shadow-xs"
                        >
                          Authorize Outpass
                        </button>
                      </div>
                    ) : op.status === 'APPROVED' || op.status === 'ACTIVE_OUT' ? (
                      <button
                        onClick={() => setQrModal({ isOpen: true, outpass: op })}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] inline-flex items-center gap-1"
                      >
                        <QrCode className="w-3.5 h-3.5 text-purple-600" />
                        <span>Inspect QR</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {qrModal.isOpen && qrModal.outpass && (
        <QRCodeModal
          isOpen={qrModal.isOpen}
          onClose={() => setQrModal({ isOpen: false, outpass: null })}
          title={`Gate Exit Pass: ${qrModal.outpass.destination}`}
          subtitle={`Student: ${qrModal.outpass.studentName} (Room ${qrModal.outpass.studentRoom})`}
          data={qrModal.outpass.qrCodeData || `HOSTELHUB:OUT:${qrModal.outpass.id}`}
          badgeLabel="APPROVED EXIT PASS"
          metadata={[
            { label: 'Outpass ID', value: qrModal.outpass.id },
            { label: 'Resident', value: `${qrModal.outpass.studentName} (${qrModal.outpass.studentRoom})` },
            { label: 'Destination', value: qrModal.outpass.destination },
            { label: 'Curfew Deadline', value: qrModal.outpass.toDateTime },
          ]}
        />
      )}
    </div>
  );
};
