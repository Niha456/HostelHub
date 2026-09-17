import React, { useState } from 'react';
import { store } from '../../services/store';
import { StatusBadge } from '../common/StatusBadge';
import { QRCodeModal } from '../common/QRCodeModal';
import { EvacuationMapModal } from '../student/EvacuationMapModal';
import { EmergencySOSModal } from '../student/EmergencySOSModal';
import {
  ShieldCheck,
  QrCode,
  ScanLine,
  UserCheck,
  Ticket,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRightLeft,
  Phone,
  Flame,
} from 'lucide-react';

interface SecurityDashboardProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const SecurityDashboard: React.FC<SecurityDashboardProps> = ({
  activeTab = 'gate-scanner',
}) => {
  const [qrInput, setQrInput] = useState('');
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEvacuationModal, setShowEvacuationModal] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);

  // Manual fast select passes for quick scanning in demo
  const pendingOutpasses = store.outpasses.filter(
    (o) => o.status === 'APPROVED' || o.status === 'ACTIVE_OUT'
  );
  const pendingVisitors = store.visitors.filter(
    (v) => v.status === 'APPROVED' || v.status === 'CHECKED_IN'
  );

  const handleSimulateScan = (codeString: string) => {
    setScanError(null);
    const result = store.scanQRCode(codeString);

    if (result.success) {
      setScanResult(result);
    } else {
      setScanError(result.message);
      setScanResult(null);
    }
  };

  const handleManualScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrInput.trim()) return;
    handleSimulateScan(qrInput);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Security Command Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-slate-900 to-slate-950 rounded-3xl p-6 lg:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              CAMPUS MAIN GATE 1 • ACTIVE GUARD STATION
            </span>
          </div>
          <h2 className="text-xl lg:text-2xl font-black">Gate Security Command & QR Scanner</h2>
          <p className="text-xs text-slate-300">
            Real-time biometric validation, digital pass verification, and parent departure notifications
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowEvacuationModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
          >
            <span>Campus Evacuation Plan</span>
          </button>
          <button
            onClick={() => setShowSOSModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md shadow-rose-600/30 transition-all"
          >
            <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>TRIGGER SOS</span>
          </button>
        </div>
      </div>

      {/* 2. Live QR Code Scanner Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Scanner Camera / Input Simulation */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ScanLine className="w-4 h-4 text-emerald-600" />
              Live Camera / Hardware Barcode Reader
            </h3>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Scanner Online
            </span>
          </div>

          {/* Scanner Viewfinder Box */}
          <div className="relative aspect-video max-h-56 bg-slate-950 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-6 border-2 border-dashed border-emerald-500/40 text-white">
            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse" />
            <QrCode className="w-16 h-16 text-emerald-400/40 mb-2" />
            <p className="text-xs font-semibold text-slate-300">
              Position Hosteller or Visitor QR Code in Front of Gate Lens
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              Supports Student Resident IDs, Approved Outpasses & Visitor Permits
            </p>
          </div>

          {/* Manual Input or Quick Barcode String Input */}
          <form onSubmit={handleManualScanSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Paste or type raw QR string (e.g. HOSTELHUB:OUT:OUT001)..."
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              Verify Pass
            </button>
          </form>

          {/* Scan Error Message */}
          {scanError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{scanError}</span>
            </div>
          )}

          {/* Successful Scan Card */}
          {scanResult && scanResult.success && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-2 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  GATE PASS VERIFIED & RECORDED
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">
                  {scanResult.type}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900">{scanResult.message}</p>
              {scanResult.data && (
                <div className="p-2.5 rounded-lg bg-white/80 border border-emerald-200 text-[11px] grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    Name: <strong className="text-slate-900">{scanResult.data.studentName || scanResult.data.visitorName}</strong>
                  </div>
                  <div>
                    Room: <strong className="text-slate-900">{scanResult.data.studentRoom || scanResult.data.room}</strong>
                  </div>
                  <div>
                    Status: <strong className="text-emerald-700">{scanResult.data.status}</strong>
                  </div>
                  <div>
                    Timestamp: <strong className="text-slate-900">{new Date().toLocaleTimeString()}</strong>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Quick One-Click Simulated Scans for Demo Convenience */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">One-Click Pass Simulator</h3>
            <span className="text-[10px] text-slate-400 font-semibold">Instant verification</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="font-bold text-slate-700 block mb-1">Approved Hosteller Outpasses</span>
              <div className="space-y-2">
                {pendingOutpasses.slice(0, 2).map((op) => (
                  <div
                    key={op.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <strong className="text-slate-900 block">{op.studentName} (Room {op.studentRoom})</strong>
                      <span className="text-[11px] text-slate-500">Destination: {op.destination}</span>
                    </div>
                    <button
                      onClick={() => handleSimulateScan(op.qrCodeData || `HOSTELHUB:OUT:${op.id}`)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors"
                    >
                      Scan Gate {op.status === 'APPROVED' ? 'EXIT' : 'RETURN'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-700 block mb-1">Approved Campus Visitors</span>
              <div className="space-y-2">
                {pendingVisitors.slice(0, 2).map((v) => (
                  <div
                    key={v.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <strong className="text-slate-900 block">{v.visitorName} ({v.relationship})</strong>
                      <span className="text-[11px] text-slate-500">Visiting: {v.studentName} (Room {v.studentRoom})</span>
                    </div>
                    <button
                      onClick={() => handleSimulateScan(v.qrCodeData || `HOSTELHUB:VIS:${v.id}`)}
                      className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-colors"
                    >
                      Scan Gate {v.status === 'APPROVED' ? 'CHECK-IN' : 'CHECK-OUT'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-700 block mb-1">Student Resident ID Card</span>
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 block">Divya Sharma (STU0001)</strong>
                  <span className="text-[11px] text-slate-500">Room A302 • Block A</span>
                </div>
                <button
                  onClick={() => handleSimulateScan('HOSTELHUB:STUDENT:STU0001:Divya Sharma:A302')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition-colors"
                >
                  Scan ID Card
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Live Gate Movements Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Gate Movements & Visitors Inside Campus</h3>
          </div>
          <span className="text-slate-400">Audited timestamp ledger</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="py-3 px-4">Visitor / Student Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Associated Room</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Entry Recorded</th>
                <th className="py-3 px-4">Exit Recorded</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {store.visitors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{v.visitorName}</span>
                    <span className="text-[10px] text-slate-400">{v.relationship} • Ph: {v.phoneNumber}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                      Visitor
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">Room {v.studentRoom}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={v.status} />
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{v.checkedInAt || '—'}</td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{v.checkedOutAt || '—'}</td>
                  <td className="py-3 px-4 text-right">
                    {v.status === 'CHECKED_IN' && (
                      <button
                        onClick={() => handleSimulateScan(v.qrCodeData || `HOSTELHUB:VIS:${v.id}`)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-bold text-[10px]"
                      >
                        Check Out
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EvacuationMapModal isOpen={showEvacuationModal} onClose={() => setShowEvacuationModal(false)} />
      <EmergencySOSModal
        isOpen={showSOSModal}
        onClose={() => setShowSOSModal(false)}
        onOpenEvacuationMap={() => setShowEvacuationModal(true)}
      />
    </div>
  );
};
