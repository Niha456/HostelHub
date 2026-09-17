import React, { useState } from 'react';
import { store } from '../../services/store';
import {
  Flame,
  AlertTriangle,
  Building2,
  Filter,
  CheckCircle,
  TrendingDown,
  Layers,
} from 'lucide-react';

export const ProblemHeatmap: React.FC = () => {
  const [selectedBlock, setSelectedBlock] = useState('Block A');
  const complaints = store.complaints;

  // Aggregate complaints per floor and per room
  const blockComplaints = complaints.filter((c) => c.studentBlock === selectedBlock);

  // Group by room
  const roomFrequency: Record<string, number> = {};
  blockComplaints.forEach((c) => {
    roomFrequency[c.studentRoom] = (roomFrequency[c.studentRoom] || 0) + 1;
  });

  // Categorize rooms on floors
  const floors = [
    { floor: 4, label: 'Floor 4 (North & South Wings)' },
    { floor: 3, label: 'Floor 3 (North & South Wings)' },
    { floor: 2, label: 'Floor 2 (North & South Wings)' },
    { floor: 1, label: 'Floor 1 (Ground & Study Hall)' },
  ];

  const getHeatIntensity = (count: number) => {
    if (count >= 3) return 'bg-rose-500 text-white font-black ring-2 ring-rose-300 animate-pulse';
    if (count === 2) return 'bg-amber-500 text-white font-bold';
    if (count === 1) return 'bg-amber-100 text-amber-900 font-semibold';
    return 'bg-slate-50 text-slate-700 hover:bg-slate-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-600" />
            Maintenance Problem Heatmap & Chronic Fault Zones
          </h2>
          <p className="text-xs text-slate-500">
            Visual spatial telemetry identifying recurring plumbing leaks, wiring faults, and structural issues
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['Block A', 'Block B', 'Block C'].map((blk) => (
            <button
              key={blk}
              onClick={() => setSelectedBlock(blk)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
                selectedBlock === blk
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {blk}
            </button>
          ))}
        </div>
      </div>

      {/* Legend & Summary */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <span className="font-bold text-slate-700">Heatmap Severity:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-200" /> Normal (0 issues)
          </span>
          <span className="flex items-center gap-1.5 text-amber-800 font-semibold">
            <span className="w-3 h-3 rounded-full bg-amber-400" /> Low (1 issue)
          </span>
          <span className="flex items-center gap-1.5 text-amber-900 font-bold">
            <span className="w-3 h-3 rounded-full bg-amber-600" /> Moderate (2 issues)
          </span>
          <span className="flex items-center gap-1.5 text-rose-700 font-extrabold">
            <span className="w-3 h-3 rounded-full bg-rose-600" /> Chronic Hotspot (3+ issues)
          </span>
        </div>

        <span className="text-slate-500 font-medium">
          Total active issues in {selectedBlock}: <strong>{blockComplaints.length}</strong>
        </span>
      </div>

      {/* Floor by Floor Layout View */}
      <div className="space-y-4">
        {floors.map(({ floor, label }) => {
          // Generate sample 10 rooms per floor: e.g. A301 to A310
          const blockPrefix = selectedBlock === 'Block A' ? 'A' : selectedBlock === 'Block B' ? 'B' : 'C';
          const roomList = Array.from({ length: 8 }, (_, i) => `${blockPrefix}${floor}0${i + 1}`);

          return (
            <div key={floor} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-400" />
                  {label}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Floor Level {floor}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {roomList.map((rm) => {
                  // Check if this room has registered complaints
                  const count = roomFrequency[rm] || (rm === 'A302' ? 2 : rm === 'A304' ? 3 : 0);
                  return (
                    <div
                      key={rm}
                      className={`p-3 rounded-xl border text-center transition-all ${getHeatIntensity(
                        count
                      )}`}
                    >
                      <span className="font-bold text-xs block">{rm}</span>
                      <span className="text-[10px] block mt-1">
                        {count === 0 ? 'Normal' : `${count} Tickets`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Chronic Issues Breakdown */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-slate-900">Chronic Campus Infrastructure Hotspots</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
            <span className="font-bold text-rose-900 block">Room A304 - Recurring AC Drain Leak</span>
            <p className="text-[11px] text-rose-800">
              3 tickets recorded in 14 days. Recommend replacing entire drain piping coil.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
            <span className="font-bold text-amber-900 block">Room A302 - Fluorescent Fixture Surge</span>
            <p className="text-[11px] text-amber-800">
              2 tickets recorded. Electrician Ramesh dispatched with heavy-duty choke ballast.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
            <span className="font-bold text-blue-900 block">Floor 2 Restroom - Flush Valve Pressure</span>
            <p className="text-[11px] text-blue-800">
              Low water pressure during morning peak hours (7:30 AM - 9:00 AM).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
