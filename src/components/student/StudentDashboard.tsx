import React, { useState } from 'react';
import { store } from '../../services/store';
import { StatusBadge } from '../common/StatusBadge';
import { QRCodeModal } from '../common/QRCodeModal';
import { RaiseComplaintModal } from './RaiseComplaintModal';
import { VisitorRequestModal } from './VisitorRequestModal';
import { OutpassRequestModal } from './OutpassRequestModal';
import { RoomTransferModal } from './RoomTransferModal';
import { EmergencySOSModal } from './EmergencySOSModal';
import { EvacuationMapModal } from './EvacuationMapModal';
import { MessViewModal } from './MessViewModal';
import { StudentAttendanceModal } from './StudentAttendanceModal';
import { StudentComplaintsModal } from './StudentComplaintsModal';
import { StudentNotificationsModal } from './StudentNotificationsModal';
import { StudentProfileModal } from './StudentProfileModal';

import {
  QrCode,
  AlertCircle,
  Ticket,
  UserCheck,
  DoorClosed,
  Utensils,
  Shield,
  CalendarCheck,
  Bell,
  Clock,
  ChevronRight,
  Plus,
  Sparkles,
  MapPin,
  Flame,
  CheckCircle2,
} from 'lucide-react';

interface StudentDashboardProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  activeTab = 'dashboard',
  onSelectTab,
}) => {
  const [showRaiseComplaint, setShowRaiseComplaint] = useState(false);
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [showOutpassModal, setShowOutpassModal] = useState(false);
  const [showRoomTransferModal, setShowRoomTransferModal] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [showEvacuationModal, setShowEvacuationModal] = useState(false);
  const [showMessModal, setShowMessModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showComplaintsModal, setShowComplaintsModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // QR Modal
  const [qrModalData, setQrModalData] = useState<{
    isOpen: boolean;
    title: string;
    subtitle?: string;
    data: string;
    badgeLabel?: string;
    metadata?: { label: string; value: string }[];
  }>({
    isOpen: false,
    title: '',
    data: '',
  });

  const currentUser = store.currentUser || {
    name: 'Divya Sharma',
    room: 'A302',
    block: 'Block A',
    email: 'divya@example.com',
    studentId: 'STU0001',
    id: 'uid_student_stu0001',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    role: 'STUDENT' as const,
  };

  const studentId = currentUser.studentId || currentUser.id;

  // Filter complaints raised by this student (or demo fallback)
  const myComplaints = store.complaints.filter(
    (c) => c.studentId === studentId || c.studentRoom === currentUser.room
  );
  const activeComplaints = myComplaints.filter((c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED');

  // Filter outpasses for this student
  const myOutpasses = store.outpasses.filter(
    (o) => o.studentId === studentId || o.studentRoom === currentUser.room
  );

  // Filter visitors for this student
  const myVisitors = store.visitors.filter(
    (v) => v.studentId === studentId || v.studentRoom === currentUser.room
  );

  const activeApprovedOutpass = myOutpasses.find((o) => o.status === 'APPROVED');
  const activeApprovedVisitor = myVisitors.find((v) => v.status === 'APPROVED');

  const handleOpenStudentIdQR = () => {
    setQrModalData({
      isOpen: true,
      title: `${currentUser.name} - Resident ID`,
      subtitle: `Official Hostel Gate Pass • ${currentUser.block} Room ${currentUser.room}`,
      data: `HOSTELHUB:STUDENT:${studentId}:${currentUser.name}:${currentUser.room}`,
      badgeLabel: 'VERIFIED RESIDENT',
      metadata: [
        { label: 'Student ID', value: studentId },
        { label: 'Resident Name', value: currentUser.name },
        { label: 'Room & Wing', value: `${currentUser.block} • Room ${currentUser.room}` },
        { label: 'Current Status', value: 'INSIDE CAMPUS' },
      ],
    });
  };

  const handleOpenOutpassQR = (outpass: any) => {
    setQrModalData({
      isOpen: true,
      title: `Gate Exit Pass: ${outpass.destination}`,
      subtitle: `Valid for exit until ${outpass.toDateTime}`,
      data: outpass.qrCodeData || `HOSTELHUB:OUT:${outpass.id}:${currentUser.name}:${currentUser.room}`,
      badgeLabel: 'WARDEN APPROVED',
      metadata: [
        { label: 'Pass ID', value: outpass.id },
        { label: 'Destination', value: outpass.destination },
        { label: 'Valid Until', value: outpass.toDateTime },
        { label: 'Approved By', value: outpass.approvedBy || 'Hostel Warden' },
      ],
    });
  };

  const handleOpenVisitorQR = (vis: any) => {
    setQrModalData({
      isOpen: true,
      title: `Visitor Gate Entry: ${vis.visitorName}`,
      subtitle: `Visiting ${currentUser.name} in Room ${currentUser.room}`,
      data: vis.qrCodeData || `HOSTELHUB:VIS:${vis.id}:${vis.visitorName}:${currentUser.room}`,
      badgeLabel: 'ENTRY APPROVED',
      metadata: [
        { label: 'Visitor Pass ID', value: vis.id },
        { label: 'Visitor Name', value: `${vis.visitorName} (${vis.relationship})` },
        { label: 'Host Resident', value: `${currentUser.name} (Room ${currentUser.room})` },
        { label: 'Visit Slot', value: `${vis.visitDate} @ ${vis.visitTime}` },
      ],
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Student Identity Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-white to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="relative">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                alt={currentUser.name}
                className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">
                ✓
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl lg:text-2xl font-black tracking-tight">{currentUser.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-xs">
                  STU0001
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  Status: Resident Inside
                </span>
              </div>
              <p className="text-xs lg:text-sm text-blue-100 font-medium">
                {currentUser.block || 'Block A'} • Floor 3 • Room {currentUser.room || 'A302'} • Bed 2 (Double Occupancy)
              </p>
              <p className="text-[11px] text-blue-200/70 mt-0.5">
                B.Tech Computer Science & Engineering • NN Hyderabad / Nizamabad Campus
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleOpenStudentIdQR}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-900 font-bold text-xs hover:bg-blue-50 shadow-md transition-all active:scale-95"
            >
              <QrCode className="w-4 h-4 text-blue-600" />
              <span>Show Digital ID QR</span>
            </button>
            <button
              onClick={() => setShowSOSModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md shadow-rose-600/30 transition-all active:scale-95"
            >
              <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>EMERGENCY SOS</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Card */}
        <div
          onClick={() => setShowAttendanceModal(true)}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold">Hostel Attendance</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">92%</span>
            <span className="text-xs text-emerald-600 font-bold">Good Standing</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Night roll calls & curfew compliance</p>
        </div>

        {/* Room Details Card */}
        <div
          onClick={() => setShowRoomTransferModal(true)}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold">Room & Wing</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DoorClosed className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{currentUser.room || 'A302'}</span>
            <span className="text-xs text-blue-600 font-bold">{currentUser.block || 'Block A'}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Click to apply for Room Transfer →</p>
        </div>

        {/* Active Complaints */}
        <div
          onClick={() => setShowComplaintsModal(true)}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold">Active Complaints</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{activeComplaints.length}</span>
            <span className="text-xs text-amber-600 font-bold">In Resolution</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Live technician SLA dispatch</p>
        </div>

        {/* Dining Mess Card */}
        <div
          onClick={() => setShowMessModal(true)}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold">Today's Dining</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-extrabold text-slate-900 truncate">Dinner: Phulka & Dal</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">7:30 PM - 9:45 PM • View Menu →</p>
        </div>
      </div>

      {/* 3. Quick Service Actions Row */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
          Instant Resident Actions
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setShowRaiseComplaint(true)}
            className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm text-slate-800 text-xs font-bold transition-all"
          >
            <AlertCircle className="w-4 h-4 text-blue-600" />
            <span>Raise Complaint</span>
          </button>
          <button
            onClick={() => setShowOutpassModal(true)}
            className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm text-slate-800 text-xs font-bold transition-all"
          >
            <Ticket className="w-4 h-4 text-purple-600" />
            <span>Request Outpass</span>
          </button>
          <button
            onClick={() => setShowVisitorModal(true)}
            className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm text-slate-800 text-xs font-bold transition-all"
          >
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Visitor Pass</span>
          </button>
          <button
            onClick={() => setShowEvacuationModal(true)}
            className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm text-slate-800 text-xs font-bold transition-all"
          >
            <MapPin className="w-4 h-4 text-rose-600" />
            <span>Evacuation Map</span>
          </button>
        </div>
      </div>

      {/* 4. Active Outpass & Visitor QR Pass Banner if available */}
      {(activeApprovedOutpass || activeApprovedVisitor) && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Active Approved Passes Ready for Security Scan
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold">Instant QR Verification</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeApprovedOutpass && (
              <button
                onClick={() => handleOpenOutpassQR(activeApprovedOutpass)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-bold text-xs shadow-xs hover:bg-emerald-100 transition-colors"
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>Show Outpass QR ({activeApprovedOutpass.destination})</span>
              </button>
            )}
            {activeApprovedVisitor && (
              <button
                onClick={() => handleOpenVisitorQR(activeApprovedVisitor)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-bold text-xs shadow-xs hover:bg-emerald-100 transition-colors"
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>Show Visitor QR ({activeApprovedVisitor.visitorName})</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 5. Two-Column Layout: Complaints Queue & Outpass / Visitor Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: My Complaints */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">My Maintenance Complaints</h3>
              </div>
              <button
                onClick={() => setShowRaiseComplaint(true)}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Ticket</span>
              </button>
            </div>

            <div className="space-y-3">
              {myComplaints.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No complaints filed yet. Everything running smoothly in your room!
                </div>
              ) : (
                myComplaints.slice(0, 3).map((comp) => {
                  const deadline = new Date(comp.slaDeadline);
                  return (
                    <div
                      key={comp.id}
                      className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">{comp.title}</span>
                        <StatusBadge status={comp.status} />
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{comp.description}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                        <span>Category: <strong>{comp.category}</strong></span>
                        <span>SLA: {deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4 flex justify-end">
            <button
              onClick={() => setShowComplaintsModal(true)}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
            >
              <span>View All Complaints ({myComplaints.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Outpass & Visitor Requests History */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-sm">Outpass & Visitor Passes</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowOutpassModal(true)}
                  className="text-xs text-purple-600 hover:text-purple-800 font-bold"
                >
                  + Outpass
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={() => setShowVisitorModal(true)}
                  className="text-xs text-emerald-600 hover:text-emerald-800 font-bold"
                >
                  + Visitor
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {myOutpasses.slice(0, 2).map((op) => (
                <div
                  key={op.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">{op.destination}</span>
                      <StatusBadge status={op.status} />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{op.reason}</p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{op.fromDateTime} → {op.toDateTime}</span>
                  </div>
                  {op.status === 'APPROVED' && (
                    <button
                      onClick={() => handleOpenOutpassQR(op)}
                      className="p-2 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
                      title="View QR Pass"
                    >
                      <QrCode className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}

              {myVisitors.slice(0, 2).map((vis) => (
                <div
                  key={vis.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">{vis.visitorName} ({vis.relationship})</span>
                      <StatusBadge status={vis.status} />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{vis.purpose}</p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{vis.visitDate} @ {vis.visitTime}</span>
                  </div>
                  {vis.status === 'APPROVED' && (
                    <button
                      onClick={() => handleOpenVisitorQR(vis)}
                      className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                      title="View QR Pass"
                    >
                      <QrCode className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4 flex justify-between items-center text-xs text-slate-500">
            <span>Gate security scans are recorded live in hostel ledger</span>
            <button
              onClick={() => setShowOutpassModal(true)}
              className="text-blue-600 hover:underline font-semibold"
            >
              Request New →
            </button>
          </div>
        </div>
      </div>

      {/* 6. Modals */}
      <RaiseComplaintModal isOpen={showRaiseComplaint} onClose={() => setShowRaiseComplaint(false)} />
      <VisitorRequestModal isOpen={showVisitorModal} onClose={() => setShowVisitorModal(false)} />
      <OutpassRequestModal isOpen={showOutpassModal} onClose={() => setShowOutpassModal(false)} />
      <RoomTransferModal isOpen={showRoomTransferModal} onClose={() => setShowRoomTransferModal(false)} />
      <EmergencySOSModal
        isOpen={showSOSModal}
        onClose={() => setShowSOSModal(false)}
        onOpenEvacuationMap={() => setShowEvacuationModal(true)}
      />
      <EvacuationMapModal isOpen={showEvacuationModal} onClose={() => setShowEvacuationModal(false)} />
      <MessViewModal isOpen={showMessModal} onClose={() => setShowMessModal(false)} />
      <StudentAttendanceModal isOpen={showAttendanceModal} onClose={() => setShowAttendanceModal(false)} />
      <StudentComplaintsModal
        isOpen={showComplaintsModal}
        onClose={() => setShowComplaintsModal(false)}
        onOpenRaiseModal={() => setShowRaiseComplaint(true)}
      />
      <StudentNotificationsModal isOpen={showNotificationsModal} onClose={() => setShowNotificationsModal(false)} />
      <StudentProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onOpenQR={handleOpenStudentIdQR}
      />

      <QRCodeModal
        isOpen={qrModalData.isOpen}
        onClose={() => setQrModalData({ ...qrModalData, isOpen: false })}
        title={qrModalData.title}
        subtitle={qrModalData.subtitle}
        data={qrModalData.data}
        badgeLabel={qrModalData.badgeLabel}
        metadata={qrModalData.metadata}
      />
    </div>
  );
};
