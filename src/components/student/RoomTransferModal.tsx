import React, { useState } from 'react';
import { store } from '../../services/store';
import { X, ArrowRight, DoorClosed, AlertCircle } from 'lucide-react';

interface RoomTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoomTransferModal: React.FC<RoomTransferModalProps> = ({ isOpen, onClose }) => {
  const currentUser = store.currentUser || { room: 'A302', block: 'Block A' };
  const [requestedBlock, setRequestedBlock] = useState('Block A');
  const [requestedRoom, setRequestedRoom] = useState('A304');
  const [reason, setReason] = useState('Medical / Study compatibility preference with batchmates');
  const [additionalNote, setAdditionalNote] = useState('My lab work requires late night study; room A304 has quieter environment.');

  if (!isOpen) return null;

  // Available rooms with free slots
  const eligibleRooms = store.rooms.filter(
    (r) => r.roomNumber !== currentUser.room && r.occupancy < r.capacity
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestedRoom || !reason.trim()) {
      store.showToast('error', 'Please select room and specify reason');
      return;
    }

    store.requestRoomTransfer({
      requestedRoom,
      requestedBlock,
      reason,
      additionalNote,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Request Room Transfer</h3>
            <p className="text-xs text-slate-500">Apply to switch room or wing</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Current vs Target */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Current Allocation</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{currentUser.room || 'A302'}</p>
              <span className="text-[11px] text-slate-500">{currentUser.block || 'Block A'}</span>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-500" />
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Target Room</span>
              <p className="text-sm font-bold text-blue-600 mt-0.5">{requestedRoom}</p>
              <span className="text-[11px] text-blue-500 font-medium">{requestedBlock}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Desired Available Room</label>
            <select
              value={requestedRoom}
              onChange={(e) => {
                const roomNum = e.target.value;
                setRequestedRoom(roomNum);
                const found = store.rooms.find((r) => r.roomNumber === roomNum);
                if (found) setRequestedBlock(found.block);
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              {eligibleRooms.map((r) => (
                <option key={r.id} value={r.roomNumber}>
                  {r.roomNumber} ({r.block}) • Type: {r.type} • Vacant: {r.capacity - r.occupancy}/{r.capacity} beds
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Primary Reason for Transfer</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              <option value="Medical grounds (Ground floor or quiet area required)">Medical grounds (Ground floor or quiet area required)</option>
              <option value="Academic project collaboration with department peers">Academic project collaboration with department peers</option>
              <option value="Incompatible sleep or study schedule with existing roommates">Incompatible sleep or study schedule with existing roommates</option>
              <option value="Infrastructure or ventilation preference">Infrastructure or ventilation preference</option>
              <option value="Upgrading to Single/Deluxe occupancy">Upgrading to Single/Deluxe occupancy</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Justification & Notes</label>
            <textarea
              rows={3}
              value={additionalNote}
              onChange={(e) => setAdditionalNote(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              placeholder="Explain why this transfer is needed..."
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
            >
              Submit Transfer Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
