import React, { useState } from 'react';
import { store } from '../../services/store';
import { Room, RoomTransferRequest } from '../../types';
import {
  DoorClosed,
  Users,
  Filter,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Bed,
  Sparkles,
} from 'lucide-react';

export const RoomMatrix: React.FC = () => {
  const [selectedBlock, setSelectedBlock] = useState('Block A');
  const [filterType, setFilterType] = useState('ALL');
  const [filterFloor, setFilterFloor] = useState('ALL');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const rooms = store.rooms;
  const transfers = store.roomTransfers;
  const pendingTransfers = transfers.filter((t) => t.status === 'PENDING');

  const filteredRooms = rooms.filter((r) => {
    if (r.block !== selectedBlock) return false;
    if (filterType !== 'ALL' && r.type !== filterType) return false;
    if (filterFloor !== 'ALL' && r.floor.toString() !== filterFloor) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Block Selector & Room Stats */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <DoorClosed className="w-5 h-5 text-purple-600" />
            Interactive Room Allocation Matrix
          </h2>
          <p className="text-xs text-slate-500">
            Real-time occupancy tracking, student slot assignment & room transfers
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['Block A', 'Block B', 'Block C'].map((blk) => (
            <button
              key={blk}
              onClick={() => setSelectedBlock(blk)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
                selectedBlock === blk
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {blk}
            </button>
          ))}
          <select
            value={filterFloor}
            onChange={(e) => setFilterFloor(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Floors</option>
            <option value="1">Floor 1</option>
            <option value="2">Floor 2</option>
            <option value="3">Floor 3</option>
            <option value="4">Floor 4</option>
          </select>
        </div>
      </div>

      {/* Pending Room Transfers Queue */}
      {pendingTransfers.length > 0 && (
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-purple-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Pending Room Transfer Requests ({pendingTransfers.length})
            </span>
            <span className="text-[11px] text-purple-700">Warden approval required for bed reallocation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingTransfers.map((trf) => (
              <div
                key={trf.id}
                className="p-3.5 rounded-xl bg-white border border-purple-200 shadow-xs space-y-2 text-xs"
              >
                <div className="flex justify-between items-center">
                  <strong className="text-slate-900">{trf.studentName}</strong>
                  <span className="font-mono text-slate-400 text-[10px]">{trf.id}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                    From: {trf.currentRoom} ({trf.currentBlock})
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">
                    To: {trf.requestedRoom} ({trf.requestedBlock})
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 italic">"{trf.reason}"</p>
                <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => store.rejectRoomTransfer(trf.id)}
                    className="px-3 py-1 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 font-bold text-[11px]"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => store.approveRoomTransfer(trf.id)}
                    className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px]"
                  >
                    Approve & Reallocate Bed
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Room Grid Matrix */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 text-xs">
          <div className="flex items-center gap-4">
            <span className="font-bold text-slate-700">Room Status Key:</span>
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Available / Partial
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900" /> Fully Occupied
            </span>
            <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Maintenance Reserved
            </span>
          </div>
          <span className="text-slate-400">{filteredRooms.length} rooms listed in {selectedBlock}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredRooms.map((rm) => {
            const isFull = rm.occupancy >= rm.capacity;
            const isAvailable = rm.occupancy < rm.capacity;
            return (
              <div
                key={rm.id}
                onClick={() => setSelectedRoom(rm)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                  isFull
                    ? 'border-slate-300 bg-slate-900 text-white shadow-xs'
                    : 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm tracking-tight">{rm.roomNumber}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${isFull ? 'bg-slate-800 text-slate-300' : 'bg-emerald-100 text-emerald-800'}`}>
                    F{rm.floor}
                  </span>
                </div>
                <div className="text-[11px] opacity-80 mt-1 flex items-center justify-between">
                  <span>{rm.type}</span>
                  <span className="font-bold font-mono">
                    {rm.occupancy}/{rm.capacity} beds
                  </span>
                </div>
                <div className="w-full h-1.5 bg-black/20 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full ${isFull ? 'bg-blue-400' : 'bg-emerald-500'}`}
                    style={{ width: `${(rm.occupancy / rm.capacity) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Room Details Drawer Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Room {selectedRoom.roomNumber} Overview</h3>
                <p className="text-xs text-slate-500">{selectedRoom.block} • Floor {selectedRoom.floor}</p>
              </div>
              <button
                onClick={() => setSelectedRoom(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Room Type</span>
                  <span className="text-sm font-bold text-slate-900">{selectedRoom.type} Occupancy</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Bed Occupancy</span>
                  <span className="text-sm font-bold text-slate-900">{selectedRoom.occupancy} / {selectedRoom.capacity} Beds</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-2">Allocated Residents</h4>
                {selectedRoom.studentIds.length === 0 ? (
                  <p className="text-slate-400 text-xs italic">No students currently allocated to this room.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedRoom.studentIds.map((sid) => {
                      const st = store.students.find((s) => s.id === sid);
                      return (
                        <div key={sid} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 flex justify-between items-center">
                          <div>
                            <span className="font-bold text-slate-900 block">{st?.name || 'Assigned Hosteller'}</span>
                            <span className="text-[10px] text-slate-500">{st?.studentId || sid} • {st?.department}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                            Occupant
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedRoom(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
