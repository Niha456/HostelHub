import React, { useState } from 'react';
import { store } from '../../services/store';
import { Student } from '../../types';
import {
  Search,
  Filter,
  Users,
  Plus,
  Mail,
  Phone,
  DoorClosed,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  X,
} from 'lucide-react';

export const StudentsRoster: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [blockFilter, setBlockFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Student Form state
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentId, setNewStudentId] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('+91 ');
  const [newStudentBlock, setNewStudentBlock] = useState('Block A');
  const [newStudentRoom, setNewStudentRoom] = useState('A304');
  const [newStudentDept, setNewStudentDept] = useState('Computer Science');
  const [newStudentGuardian, setNewStudentGuardian] = useState('');
  const [newStudentGuardianPhone, setNewStudentGuardianPhone] = useState('+91 ');

  const students = store.students;

  const filtered = students.filter((s) => {
    if (blockFilter !== 'ALL' && s.block !== blockFilter) return false;
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    if (searchTerm) {
      const matchName = s.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchId = s.studentId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRoom = s.room.toLowerCase().includes(searchTerm.toLowerCase());
      return matchName || matchId || matchRoom;
    }
    return true;
  });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentId.trim()) {
      store.showToast('error', 'Please enter student name and ID');
      return;
    }

    store.addStudent({
      studentId: newStudentId,
      name: newStudentName,
      room: newStudentRoom,
      block: newStudentBlock,
      department: newStudentDept,
      year: '2nd Year',
      course: 'B.Tech ' + newStudentDept,
      gender: 'FEMALE',
      hostel: 'Nizamabad Residence Hall',
      floor: 2,
      admissionDate: '2024-08-01',
      email: newStudentEmail || `${newStudentId.toLowerCase()}@hostelhub.demo`,
      phone: newStudentPhone || '+91 98765 00000',
      guardianName: newStudentGuardian || 'Parent',
      guardianPhone: newStudentGuardianPhone || '+91 98765 11111',
      status: 'ACTIVE',
      attendanceRate: 95,
      attendancePercentage: 95,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Hostel Students Roster
          </h2>
          <p className="text-xs text-slate-500">
            Total {students.length} hostellers currently assigned across campus blocks
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, ID or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <select
            value={blockFilter}
            onChange={(e) => setBlockFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Blocks</option>
            <option value="Block A">Block A</option>
            <option value="Block B">Block B</option>
            <option value="Block C">Block C</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Inside (Active)</option>
            <option value="OUTSIDE">Outside Campus</option>
            <option value="ON_LEAVE">On Leave</option>
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Admit Student</span>
          </button>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="py-3 px-4">Student Name & ID</th>
                <th className="py-3 px-4">Room & Block</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                        alt={student.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{student.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{student.studentId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-800">{student.room}</span>
                    <span className="text-[11px] text-slate-400 block">{student.block}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <span>{student.department}</span>
                    <span className="text-[10px] text-slate-400 block">Year {student.year}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">
                        {student.attendancePercentage ?? student.attendanceRate ?? 92}%
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          (student.attendancePercentage ?? student.attendanceRate ?? 92) >= 90
                            ? 'bg-emerald-500'
                            : (student.attendancePercentage ?? student.attendanceRate ?? 92) >= 75
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        student.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : student.status === 'OUTSIDE'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {student.status === 'ACTIVE' ? 'Inside' : student.status === 'OUTSIDE' ? 'Outside' : 'On Leave'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    <div>{student.phone}</div>
                    <div className="text-[10px] text-slate-400">G: {student.guardianPhone}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="text-blue-600 hover:text-blue-800 font-bold text-xs"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filtered.length} students</span>
          <span>Click any row to review disciplinary and room allocation records</span>
        </div>
      </div>

      {/* View Student Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">Hosteller Dossier</h3>
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="flex items-center gap-4">
                <img
                  src={selectedStudent.avatarUrl}
                  alt={selectedStudent.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500"
                />
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">{selectedStudent.name}</h4>
                  <p className="text-xs text-blue-600 font-semibold">{selectedStudent.studentId}</p>
                  <p className="text-[11px] text-slate-500">{selectedStudent.department} • Year {selectedStudent.year}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Allocated Room</span>
                  <span className="text-sm font-bold text-slate-900">{selectedStudent.room} ({selectedStudent.block})</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Attendance</span>
                  <span className="text-sm font-bold text-emerald-600">{selectedStudent.attendancePercentage}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500">Student Mobile:</span>
                  <strong className="text-slate-900">{selectedStudent.phone}</strong>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500">Official Email:</span>
                  <strong className="text-slate-900">{selectedStudent.email}</strong>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500">Guardian Name & Contact:</span>
                  <strong className="text-slate-900">{selectedStudent.guardianName} ({selectedStudent.guardianPhone})</strong>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">Admit New Hosteller</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddStudent} className="p-6 overflow-y-auto space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hostel ID / Roll No</label>
                  <input
                    type="text"
                    required
                    value={newStudentId}
                    onChange={(e) => setNewStudentId(e.target.value)}
                    placeholder="e.g. STU0105"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hostel Block</label>
                  <select
                    value={newStudentBlock}
                    onChange={(e) => setNewStudentBlock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none"
                  >
                    <option value="Block A">Block A</option>
                    <option value="Block B">Block B</option>
                    <option value="Block C">Block C</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room Assignment</label>
                  <input
                    type="text"
                    required
                    value={newStudentRoom}
                    onChange={(e) => setNewStudentRoom(e.target.value)}
                    placeholder="e.g. A304"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student Mobile</label>
                  <input
                    type="text"
                    value={newStudentPhone}
                    onChange={(e) => setNewStudentPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={newStudentDept}
                    onChange={(e) => setNewStudentDept(e.target.value)}
                    placeholder="e.g. Mechanical Engg"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    value={newStudentGuardian}
                    onChange={(e) => setNewStudentGuardian(e.target.value)}
                    placeholder="e.g. Suresh Sharma"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Parent Phone</label>
                  <input
                    type="text"
                    value={newStudentGuardianPhone}
                    onChange={(e) => setNewStudentGuardianPhone(e.target.value)}
                    placeholder="+91 98480 00000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
                >
                  Confirm Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
