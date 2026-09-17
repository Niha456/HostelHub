import React from 'react';
import { store } from '../../services/store';
import { X, User, Phone, Mail, MapPin, Building2, ShieldCheck, QrCode } from 'lucide-react';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQR: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenQR,
}) => {
  if (!isOpen) return null;

  const user = store.currentUser || {
    name: 'Divya Sharma',
    email: 'divya@example.com',
    phone: '+91 98765 43210',
    room: 'A302',
    block: 'Block A',
    department: 'Computer Science & Engineering',
    role: 'STUDENT',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
            alt={user.name}
            className="w-20 h-20 rounded-full mx-auto object-cover ring-4 ring-white/30 shadow-lg"
          />
          <h3 className="font-extrabold text-lg mt-3">{user.name}</h3>
          <p className="text-xs text-blue-200">
            {user.department || 'B.Tech Computer Science'} • Batch of 2027
          </p>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-xs">
            Hostel Resident ID: STU0001
          </span>
        </div>

        {/* Profile info fields */}
        <div className="p-6 overflow-y-auto space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Hostel Block</span>
              <span className="text-xs font-bold text-slate-900">{user.block || 'Block A'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Room Number</span>
              <span className="text-xs font-bold text-slate-900">Room {user.room || 'A302'}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                Email
              </span>
              <span className="font-semibold text-slate-900">{user.email}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                Phone
              </span>
              <span className="font-semibold text-slate-900">{user.phone}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Parent / Guardian Contact
              </span>
              <span className="font-semibold text-slate-900">+91 98480 99887 (Ravi Kumar)</span>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenQR();
            }}
            className="w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 flex items-center justify-center gap-2 transition-colors"
          >
            <QrCode className="w-4 h-4 text-blue-600" />
            <span>Show Digital Resident QR ID</span>
          </button>
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
