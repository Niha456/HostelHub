import React, { useState } from 'react';
import { store } from '../../services/store';
import { StatusBadge } from '../common/StatusBadge';
import { QRCodeModal } from '../common/QRCodeModal';
import {
  UserCheck,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Phone,
  QrCode,
  Calendar,
} from 'lucide-react';

export const VisitorApprovals: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [qrModal, setQrModal] = useState<{ isOpen: boolean; visitor: any | null }>({
    isOpen: false,
    visitor: null,
  });

  const visitors = store.visitors;

  const filtered = visitors.filter((v) => {
    if (filterStatus !== 'ALL' && v.status !== filterStatus) return false;
    if (searchTerm) {
      const matchVis = v.visitorName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStu = v.studentName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRoom = v.studentRoom.toLowerCase().includes(searchTerm.toLowerCase());
      return matchVis || matchStu || matchRoom;
    }
    return true;
  });

  const handleApprove = (id: string) => {
    store.approveVisitor(id);
  };

  const handleReject = (id: string) => {
    const reason = prompt('Reason for rejecting visitor pass:', 'Visiting hours conflict or invalid credentials');
    if (reason !== null) {
      store.rejectVisitor(id, reason);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            Hostel Visitor Access Authorization
          </h2>
          <p className="text-xs text-slate-500">
            Warden authorization queue for student guests, parents, and campus visitors
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search visitor, host or room..."
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
            <option value="ALL">All Requests</option>
            <option value="PENDING">Pending Review</option>
            <option value="APPROVED">Approved Passes</option>
            <option value="CHECKED_IN">Currently Inside (Gate Checked IN)</option>
            <option value="CHECKED_OUT">Completed Visits</option>
          </select>
        </div>
      </div>

      {/* Visitors Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="py-3 px-4">Visitor & Relationship</th>
                <th className="py-3 px-4">Host Resident</th>
                <th className="py-3 px-4">Visit Date & Slot</th>
                <th className="py-3 px-4">Purpose</th>
                <th className="py-3 px-4">Pass Status</th>
                <th className="py-3 px-4">Gate Movement</th>
                <th className="py-3 px-4 text-right">Warden Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{v.visitorName}</span>
                    <span className="text-[11px] text-slate-500">
                      {v.relationship} • Ph: {v.phoneNumber}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800 block">{v.studentName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Room {v.studentRoom}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div>{v.visitDate}</div>
                    <div className="text-[10px] text-slate-400 font-semibold">{v.visitTime}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-[180px] truncate" title={v.purpose}>
                    {v.purpose}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={v.status} />
                  </td>
                  <td className="py-3 px-4 text-[11px] text-slate-500">
                    {v.checkedInAt ? (
                      <div>
                        IN: <strong className="text-emerald-700">{v.checkedInAt}</strong>
                        {v.checkedOutAt && (
                          <span> • OUT: <strong className="text-slate-700">{v.checkedOutAt}</strong></span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400">Awaiting Gate Arrival</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {v.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleReject(v.id)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 font-bold text-[11px]"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleApprove(v.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs"
                        >
                          Authorize Pass
                        </button>
                      </div>
                    ) : v.status === 'APPROVED' ? (
                      <button
                        onClick={() => setQrModal({ isOpen: true, visitor: v })}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] inline-flex items-center gap-1"
                      >
                        <QrCode className="w-3.5 h-3.5 text-blue-600" />
                        <span>Inspect QR</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Closed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {qrModal.isOpen && qrModal.visitor && (
        <QRCodeModal
          isOpen={qrModal.isOpen}
          onClose={() => setQrModal({ isOpen: false, visitor: null })}
          title={`Visitor Pass: ${qrModal.visitor.visitorName}`}
          subtitle={`Visiting ${qrModal.visitor.studentName} (Room ${qrModal.visitor.studentRoom})`}
          data={qrModal.visitor.qrCodeData || `HOSTELHUB:VIS:${qrModal.visitor.id}`}
          badgeLabel="APPROVED VISITOR PASS"
          metadata={[
            { label: 'Pass ID', value: qrModal.visitor.id },
            { label: 'Visitor', value: `${qrModal.visitor.visitorName} (${qrModal.visitor.relationship})` },
            { label: 'Resident', value: `${qrModal.visitor.studentName} (${qrModal.visitor.studentRoom})` },
            { label: 'Slot', value: `${qrModal.visitor.visitDate} ${qrModal.visitor.visitTime}` },
          ]}
        />
      )}
    </div>
  );
};
