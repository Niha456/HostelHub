import React, { useState } from 'react';
import { store } from '../../services/store';
import {
  Settings,
  Clock,
  Shield,
  Save,
  Bell,
  RefreshCw,
  Building,
  CheckCircle2,
} from 'lucide-react';

export const HostelSettings: React.FC = () => {
  const [curfewHour, setCurfewHour] = useState('22:00');
  const [visitorCutoff, setVisitorCutoff] = useState('19:00');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [autoSlaEscalation, setAutoSlaEscalation] = useState(true);
  const [hostelName, setHostelName] = useState('HostelHub Central Residency');
  const [campusZone, setCampusZone] = useState('North Hyderabad Tech Campus');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    store.showToast('success', 'Hostel operational policies updated successfully.');
  };

  const handleResetData = () => {
    if (confirm('Reset application state to initial seed data?')) {
      store.resetToSeedData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-700" />
            Hostel Operational Policies & Gate Parameters
          </h2>
          <p className="text-xs text-slate-500">
            Configure campus curfew timings, visiting hour windows, automated parent alerts & escalation SLAs
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* Curfew & Timing Controls */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            Curfew & Timings
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Night Curfew Gate Lockout Time</label>
              <input
                type="time"
                value={curfewHour}
                onChange={(e) => setCurfewHour(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Biometric scanner will flag students entering past this hour as late arrival.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Visitor Entry Cutoff Window</label>
              <input
                type="time"
                value={visitorCutoff}
                onChange={(e) => setVisitorCutoff(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Visiting hours terminate at this hour; security will prompt checkouts.
              </p>
            </div>
          </div>
        </div>

        {/* Automated Notifications & SLAs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-600" />
            Automated Parent Alerts & SLAs
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
              <div>
                <strong className="text-slate-900 block">Instant Parent SMS for Gate Exits</strong>
                <span className="text-[11px] text-slate-500">Dispatch SMS upon security scanning approved outpasses</span>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
              <div>
                <strong className="text-slate-900 block">Auto-Escalate Breached Maintenance SLAs</strong>
                <span className="text-[11px] text-slate-500">
                  Notify Chief Warden if high-priority tickets are unassigned after 2 hours
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoSlaEscalation}
                onChange={(e) => setAutoSlaEscalation(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </div>
          </div>
        </div>

        {/* Database State Controls */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Demo Data & Cache Management</h4>
            <p className="text-xs text-slate-500">
              Reset database store to fresh 500-student seed records or save configuration
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetData}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Demo State</span>
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Policy Settings</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
