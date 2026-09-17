import React, { useState } from 'react';
import { store } from '../../services/store';
import { EmergencyType } from '../../types';
import { X, AlertOctagon, HeartHandshake, Flame, ShieldAlert, PhoneCall, CheckCircle } from 'lucide-react';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEvacuationMap?: () => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  isOpen,
  onClose,
  onOpenEvacuationMap,
}) => {
  const currentUser = store.currentUser || { room: 'A302', block: 'Block A' };
  const [selectedType, setSelectedType] = useState<EmergencyType>('MEDICAL');
  const [customNotes, setCustomNotes] = useState('');
  const [hasTriggered, setHasTriggered] = useState(false);

  if (!isOpen) return null;

  const emergencyOptions: { type: EmergencyType; label: string; desc: string; icon: any; color: string }[] = [
    {
      type: 'MEDICAL',
      label: 'Medical Emergency',
      desc: 'Severe illness, fainting, injury, allergy attack',
      icon: HeartHandshake,
      color: 'border-red-500 bg-red-50 text-red-700',
    },
    {
      type: 'FIRE',
      label: 'Fire Hazard / Smoke',
      desc: 'Open flame, dense smoke, short-circuit fire',
      icon: Flame,
      color: 'border-orange-500 bg-orange-50 text-orange-700',
    },
    {
      type: 'SECURITY_THREAT',
      label: 'Security / Intruder',
      desc: 'Physical harassment, trespasser, theft in progress',
      icon: ShieldAlert,
      color: 'border-purple-500 bg-purple-50 text-purple-700',
    },
    {
      type: 'INFRASTRUCTURE',
      label: 'Structural / Gas / Water Burst',
      desc: 'Major ceiling leak, gas smell, glass shatter',
      icon: AlertOctagon,
      color: 'border-amber-500 bg-amber-50 text-amber-700',
    },
  ];

  const handleBroadcastSOS = () => {
    store.triggerEmergencySOS({
      emergencyType: selectedType,
      message: customNotes || `${selectedType} emergency reported from Room ${currentUser.room || 'A302'} (${currentUser.block || 'Block A'}). Immediate assistance required.`,
    });
    setHasTriggered(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-rose-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-100 bg-rose-600 text-white">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-white" />
            <div>
              <h3 className="font-bold text-base">Emergency SOS Broadcast</h3>
              <p className="text-xs text-rose-100">Direct alert to Warden, Campus Security & Health Post</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-rose-200 hover:text-white hover:bg-rose-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {!hasTriggered ? (
            <>
              {/* Location Banner */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Your Reported Location:</span>
                <span className="font-bold text-slate-900">
                  {currentUser.block || 'Block A'} • Floor 3 • Room {currentUser.room || 'A302'}
                </span>
              </div>

              {/* Type Grid */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Select Emergency Nature</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {emergencyOptions.map(({ type, label, desc, icon: Icon, color }) => {
                    const isSelected = selectedType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSelectedType(type)}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          isSelected ? `${color} ring-2 ring-rose-500 font-bold shadow-xs` : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-4 h-4" />
                          <span className="text-xs font-bold">{label}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-normal leading-tight">{desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message Note */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Specific Details (Optional)</label>
                <input
                  type="text"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="e.g. Student unconscious / severe bleeding / sparking switchboard"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              {/* Campus Helplines */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-700 block">Direct Emergency Speed Dial</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                    <span>Campus Ambulance: <strong>102 / +91 94401 23456</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                    <span>Hostel Main Gate: <strong>Ext. 108</strong></span>
                  </div>
                </div>
              </div>

              {/* Evacuation Map Link */}
              {onOpenEvacuationMap && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenEvacuationMap();
                  }}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 flex items-center justify-center gap-2"
                >
                  <span>View Building Evacuation Blueprint & Assembly Points</span>
                </button>
              )}

              {/* Broadcast Button */}
              <button
                type="button"
                onClick={handleBroadcastSOS}
                className="w-full py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
              >
                <AlertOctagon className="w-5 h-5" />
                <span>CONFIRM & BROADCAST SOS TO AUTHORITIES</span>
              </button>
            </>
          ) : (
            <div className="py-8 text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Emergency Alert Broadcasted!</h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  Alert sent to Chief Warden, Gate Security, and Resident Medical Officer.
                  A response team is moving to <strong>Room {currentUser.room || 'A302'}</strong>.
                </p>
              </div>
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl max-w-xs mx-auto text-left text-xs text-rose-800 space-y-1 font-medium">
                <div>• Stay calm and remain on the call</div>
                <div>• Do not crowd the corridor</div>
                <div>• Keep room door unlocked for first responders</div>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
