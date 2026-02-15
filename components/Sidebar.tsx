
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { UserRole } from '../types';
import { GraduationCap, LogOut } from 'lucide-react';

interface SidebarProps {
  currentRole: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentRole, activeTab, setActiveTab }) => {
  const filteredItems = NAV_ITEMS.filter(item => item.roles.includes(currentRole));

  return (
    <aside className="w-64 h-screen bg-indigo-900 text-white flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3 border-b border-indigo-800">
        <div className="bg-indigo-500 p-2 rounded-lg">
          <GraduationCap size={24} className="text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">Smart School</h1>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
              activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-indigo-800">
        <div className="flex items-center gap-3 px-4 py-3 text-indigo-200 hover:text-white cursor-pointer transition-colors">
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
