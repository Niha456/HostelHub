import React from 'react';
import { X, ShieldAlert, MapPin, Compass, ArrowUp, ArrowRight, CornerUpRight } from 'lucide-react';

interface EvacuationMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EvacuationMapModal: React.FC<EvacuationMapModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-base">Hostel Emergency Evacuation Plan</h3>
              <p className="text-xs text-slate-400">Block A (Floor 3) • Nearest Fire Staircases & Assembly Grounds</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Schematic SVG Map */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-white relative">
            <div className="flex justify-between items-center text-[11px] text-slate-400 mb-2 pb-2 border-b border-slate-800">
              <span className="font-bold text-slate-200">FLOOR 3 ARCHITECTURAL SAFETY BLUEPRINT</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Assembly Zone: North Football Ground
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2 my-3">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 block">Room 301</span>
                <span className="text-xs font-semibold text-slate-300">Vacant</span>
              </div>
              <div className="p-2.5 rounded-lg bg-blue-900/60 border-2 border-blue-500 text-center ring-2 ring-blue-500/40">
                <span className="text-[10px] text-blue-300 block font-bold">YOU ARE HERE</span>
                <span className="text-xs font-bold text-white">Room A302</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 block">Room 303</span>
                <span className="text-xs font-semibold text-slate-300">Occupied</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 block">Room 304</span>
                <span className="text-xs font-semibold text-slate-300">Occupied</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-950/70 border-2 border-emerald-500 text-center">
                <span className="text-[10px] text-emerald-400 block font-bold">FIRE EXIT A</span>
                <span className="text-xs font-bold text-emerald-300">Staircase 1</span>
              </div>
            </div>

            <div className="p-2 bg-slate-900/80 rounded-xl border border-dashed border-emerald-500/60 flex items-center justify-between text-emerald-400 text-xs font-bold my-3">
              <span className="flex items-center gap-2">
                <CornerUpRight className="w-4 h-4" />
                Primary Escape Corridor: Exit Room A302 → Turn Right → Proceed 18m to North Fire Staircase
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px]">FASTEST ROUTE</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <div>🧯 <strong>Fire Extinguisher:</strong> Pillar 3B (Opposite Room 303)</div>
              <div>🚨 <strong>Manual Call Point (Alarm):</strong> Beside Staircase A</div>
              <div>💧 <strong>Hose Reel:</strong> Central Corridor Landing</div>
              <div>⚡ <strong>Emergency Power Shutoff:</strong> Electrical Duct Room 300</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <h4 className="font-bold text-slate-900 text-xs">Emergency Instructions</h4>
              <ul className="list-disc pl-4 text-slate-600 space-y-1 text-[11px] leading-relaxed">
                <li>Never use the central elevators during a fire or earthquake alarm.</li>
                <li>Stay low if smoke is present to avoid carbon monoxide inhalation.</li>
                <li>Proceed down Staircase 1 directly to the open North Ground.</li>
                <li>Do not return to retrieve personal belongings.</li>
              </ul>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <h4 className="font-bold text-slate-900 text-xs">Wardens On Duty</h4>
              <div className="space-y-1 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span>Dr. Rajesh Kumar (Warden):</span>
                  <strong className="text-slate-900">+91 94401 55667</strong>
                </div>
                <div className="flex justify-between">
                  <span>Block A Caretaker (G. Mohan):</span>
                  <strong className="text-slate-900">+91 98480 12345</strong>
                </div>
                <div className="flex justify-between">
                  <span>Campus Control Room:</span>
                  <strong className="text-slate-900">08462 - 250100</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
          >
            Understood & Close
          </button>
        </div>
      </div>
    </div>
  );
};
