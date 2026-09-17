import React, { useState } from 'react';
import { store } from '../../services/store';
import {
  Bell,
  Plus,
  Send,
  Calendar,
  AlertTriangle,
  Megaphone,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

export const NoticeCirculars: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetRole, setTargetRole] = useState<'ALL' | 'STUDENT' | 'WARDEN' | 'SECURITY' | 'MAINTENANCE'>('ALL');
  const [urgent, setUrgent] = useState(false);

  const notifications = store.notifications;

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      store.showToast('error', 'Please enter both title and message.');
      return;
    }

    store.addNotification({
      title: urgent ? `⚠️ URGENT: ${title}` : title,
      message,
      targetRole,
      urgent,
    });

    setTitle('');
    setMessage('');
    setUrgent(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-blue-600" />
            Hostel Circulars & Emergency Broadcasts
          </h2>
          <p className="text-xs text-slate-500">
            Publish official warden notices, curfew updates, mess schedule revisions & maintenance shutdowns
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Create New Circular */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-600" />
            Publish New Circular
          </h3>

          <form onSubmit={handleBroadcast} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Notice Heading</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mandatory Hostel Maintenance & Power Backup Check"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Notice Content</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write the full circular announcement here..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Broadcast Audience</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none text-xs"
              >
                <option value="ALL">Entire Campus (All 500 Hostellers & Staff)</option>
                <option value="STUDENT">Students Only</option>
                <option value="MAINTENANCE">Maintenance & Engineering Crew</option>
                <option value="SECURITY">Security Gate Guards Only</option>
              </select>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
              <input
                type="checkbox"
                id="urgentCheck"
                checked={urgent}
                onChange={(e) => setUrgent(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <label htmlFor="urgentCheck" className="text-xs font-bold cursor-pointer select-none">
                Mark as High Priority / Emergency Bulletin
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Circular Instantly</span>
            </button>
          </form>
        </div>

        {/* Right Column: Published Bulletins Feed */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Active Hostel Bulletins</h3>
              <span className="text-xs text-slate-400">{notifications.length} announcements</span>
            </div>

            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <h4 className="font-bold text-slate-900 text-xs">{n.title}</h4>
                    </div>
                    <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed pl-4">{n.message}</p>
                  <div className="flex items-center gap-3 pt-2 text-[10px] text-slate-400 pl-4 border-t border-slate-100/60">
                    <span>Audience: <strong>{n.targetRole || 'ALL'}</strong></span>
                    <span>Status: <strong className="text-emerald-600">Broadcasted</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4 text-xs text-slate-400 flex items-center justify-between">
            <span>Bulletins are synced live across student mobile dashboards</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
