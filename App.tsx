
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudentManagement from './components/StudentManagement';
import TeacherManagement from './components/TeacherManagement';
import ExamManagement from './components/ExamManagement';
import { UserRole } from './types';
import { Bell, Search, User, ChevronDown } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.ADMIN);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <StudentManagement />;
      case 'teachers':
        return <TeacherManagement />;
      case 'exams':
        return <ExamManagement />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
            <div className="bg-slate-100 p-8 rounded-full mb-4">
              <Search size={48} />
            </div>
            <h2 className="text-xl font-bold text-slate-600">Module Under Development</h2>
            <p className="max-w-xs text-center mt-2">The {activeTab} module is currently being finalized for production.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar currentRole={currentRole} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8">
        {/* Top Header */}
        <header className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 capitalize">{activeTab.replace('-', ' ')}</h2>
            <p className="text-slate-500 text-sm">Welcome back, Academy Administrator</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <button className="p-2 text-slate-400 hover:bg-white hover:text-indigo-600 rounded-xl transition-all shadow-sm">
                <Bell size={22} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-50"></span>
              </button>
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-3 bg-white p-2 pr-4 rounded-xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                  {currentRole.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 leading-tight">Admin Demo</p>
                  <p className="text-xs text-indigo-600 font-medium">{currentRole}</p>
                </div>
                <ChevronDown size={16} className="text-slate-400" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                  <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch Perspective</p>
                  {Object.values(UserRole).map((role) => (
                    <button
                      key={role}
                      onClick={() => { setCurrentRole(role); setShowRoleMenu(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-between ${
                        currentRole === role ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {role.charAt(0) + role.slice(1).toLowerCase()}
                      {currentRole === role && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
