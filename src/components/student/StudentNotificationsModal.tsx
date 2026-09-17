import React from 'react';
import { store } from '../../services/store';
import { X, Bell, CheckCircle2, Ticket, AlertCircle, Calendar } from 'lucide-react';

interface StudentNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentNotificationsModal: React.FC<StudentNotificationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const notifs = store.notifications;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Hostel Notifications & Bulletins</h3>
              <p className="text-xs text-slate-500">Live operational alerts, circulars and pass approvals</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-3 text-xs">
          {notifs.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-xl border transition-all ${
                n.read ? 'bg-white border-slate-200 text-slate-600' : 'bg-blue-50/50 border-blue-200 text-slate-900 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                  <h4 className="font-bold text-xs text-slate-900">{n.title}</h4>
                </div>
                <span className="text-[10px] text-slate-400">{n.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 pl-4 leading-relaxed">{n.message}</p>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => {
              store.markAllNotificationsAsRead();
            }}
            className="text-xs text-blue-600 hover:text-blue-800 font-bold"
          >
            Mark all as read
          </button>
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
