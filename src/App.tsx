import React, { useState, useEffect } from 'react';
import { store } from './services/store';
import { authService } from './services/authService';
import { LoginPage } from './components/auth/LoginPage';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { DemoSwitcher } from './components/common/DemoSwitcher';
import { ToastContainer } from './components/common/ToastContainer';

// Dashboards
import { StudentDashboard } from './components/student/StudentDashboard';
import { WardenDashboard } from './components/warden/WardenDashboard';
import { SecurityDashboard } from './components/security/SecurityDashboard';
import { MaintenanceDashboard } from './components/maintenance/MaintenanceDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

// Modals
import { StudentNotificationsModal } from './components/student/StudentNotificationsModal';
import { StudentProfileModal } from './components/student/StudentProfileModal';
import { QRCodeModal } from './components/common/QRCodeModal';

export default function App() {
  const [, setTick] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  const currentUser = store.currentUser;

  const handleLogout = () => {
    authService.logout();
    store.logout();
    setActiveTab('dashboard');
  };

  const handleRoleSwitched = () => {
    setActiveTab('dashboard');
  };

  const handleOpenResidentQR = () => {
    setShowQRModal(true);
  };

  // If user is not logged in, display the role-selector Login Page
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
        <ToastContainer />
        <LoginPage onLoginSuccess={() => setActiveTab('dashboard')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      <ToastContainer />

      {/* Main app flex shell */}
      <div className="flex flex-1 min-h-screen">
        {/* Persistent left sidebar */}
        <Sidebar
          currentTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          onLogout={handleLogout}
        />

        {/* Right content column */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top sticky header */}
          <Header
            onOpenNotifications={() => setShowNotificationsModal(true)}
            onOpenProfile={() => setShowProfileModal(true)}
            onLogout={handleLogout}
          />

          {/* Main scrollable body */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {currentUser.role === 'STUDENT' && (
              <StudentDashboard activeTab={activeTab} onSelectTab={setActiveTab} />
            )}

            {currentUser.role === 'WARDEN' && (
              <WardenDashboard activeTab={activeTab} onSelectTab={setActiveTab} />
            )}

            {currentUser.role === 'SECURITY' && (
              <SecurityDashboard activeTab={activeTab} onSelectTab={setActiveTab} />
            )}

            {currentUser.role === 'MAINTENANCE' && (
              <MaintenanceDashboard activeTab={activeTab} />
            )}

            {currentUser.role === 'ADMIN' && (
              <AdminDashboard activeTab={activeTab} onSelectTab={setActiveTab} />
            )}
          </main>
        </div>
      </div>

      {/* Floating Demo Role Switcher at bottom-right */}
      <DemoSwitcher onRoleSwitched={handleRoleSwitched} />

      {/* Global Modals */}
      <StudentNotificationsModal
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
      />

      <StudentProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onOpenQR={handleOpenResidentQR}
      />

      {currentUser && (
        <QRCodeModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          title={`${currentUser.name} - Resident ID`}
          subtitle={`Official Campus Gate ID • Room ${currentUser.room || 'A302'}`}
          data={`HOSTELHUB:STUDENT:${currentUser.id}:${currentUser.name}:${currentUser.room || 'A302'}`}
          badgeLabel="VERIFIED RESIDENT"
          metadata={[
            { label: 'Name', value: currentUser.name },
            { label: 'Role', value: currentUser.role },
            { label: 'Room', value: currentUser.room || 'Campus General' },
            { label: 'Block', value: currentUser.block || 'Block A' },
          ]}
        />
      )}
    </div>
  );
}
