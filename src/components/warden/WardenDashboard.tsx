import React, { useState } from 'react';
import { WardenOverview } from './WardenOverview';
import { StudentsRoster } from './StudentsRoster';
import { RoomMatrix } from './RoomMatrix';
import { VisitorApprovals } from './VisitorApprovals';
import { OutpassApprovals } from './OutpassApprovals';
import { ComplaintsQueue } from './ComplaintsQueue';
import { ProblemHeatmap } from './ProblemHeatmap';
import { NightRollCall } from './NightRollCall';
import { NoticeCirculars } from './NoticeCirculars';
import { ReportsAnalytics } from './ReportsAnalytics';
import { HostelSettings } from './HostelSettings';
import { EvacuationMapModal } from '../student/EvacuationMapModal';
import { EmergencySOSModal } from '../student/EmergencySOSModal';

interface WardenDashboardProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const WardenDashboard: React.FC<WardenDashboardProps> = ({
  activeTab = 'dashboard',
  onSelectTab,
}) => {
  const [internalTab, setInternalTab] = useState(activeTab);
  const [showEvacuationModal, setShowEvacuationModal] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);

  // Keep synced if parent controls it
  const currentTab = onSelectTab ? activeTab : internalTab;
  const setTab = onSelectTab || setInternalTab;

  return (
    <div className="space-y-6 pb-12">
      {/* Dynamic Content based on active tab */}
      {currentTab === 'dashboard' && <WardenOverview onNavigateTab={setTab} />}
      {currentTab === 'students' && <StudentsRoster />}
      {currentTab === 'rooms' && <RoomMatrix />}
      {currentTab === 'visitors' && <VisitorApprovals />}
      {currentTab === 'outpasses' && <OutpassApprovals />}
      {currentTab === 'complaints' && <ComplaintsQueue />}
      {currentTab === 'problem-map' && <ProblemHeatmap />}
      {currentTab === 'attendance' && <NightRollCall />}
      {currentTab === 'notices' && <NoticeCirculars />}
      {currentTab === 'reports' && <ReportsAnalytics />}
      {currentTab === 'settings' && <HostelSettings />}
      {currentTab === 'emergency' && (
        <div className="space-y-6">
          <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl space-y-4">
            <h3 className="text-base font-extrabold text-rose-900">Hostel Safety & Emergency Incident Command</h3>
            <p className="text-xs text-rose-800 leading-relaxed">
              Real-time campus SOS triggers, active emergency response protocols, and building evacuation guides.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowEvacuationModal(true)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm"
              >
                Inspect Campus Evacuation Blueprint →
              </button>
              <button
                onClick={() => setShowSOSModal(true)}
                className="px-4 py-2 rounded-xl bg-white border border-rose-300 text-rose-800 font-bold text-xs hover:bg-rose-100"
              >
                Simulate SOS Drill
              </button>
            </div>
          </div>
        </div>
      )}

      <EvacuationMapModal isOpen={showEvacuationModal} onClose={() => setShowEvacuationModal(false)} />
      <EmergencySOSModal
        isOpen={showSOSModal}
        onClose={() => setShowSOSModal(false)}
        onOpenEvacuationMap={() => setShowEvacuationModal(true)}
      />
    </div>
  );
};
