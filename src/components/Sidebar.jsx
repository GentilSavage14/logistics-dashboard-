import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Receipt, 
  Users, 
  Truck, 
  BarChart3, 
  Settings, 
  Sun, 
  Moon,
  X 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, darkMode, setDarkMode, mobileOpen, setMobileOpen }) {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Shipments', icon: Package },
    { name: 'Invoices', icon: Receipt },
    { name: 'Customers', icon: Users },
    { name: 'Vehicles', icon: Truck },
    { name: 'Analytics', icon: BarChart3 },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)} 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 flex flex-col justify-between p-4 transition-transform duration-300 border-r
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-900 border-slate-800 text-white'}
      `}>
        <div>
          <div className="flex items-center justify-between px-3 py-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg">
                <Truck className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">LogisticsHub</h1>
            </div>
            {/* Close button for mobile */}
            <button 
              onClick={() => setMobileOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    setMobileOpen(false); // Close sidebar when an item is selected on mobile
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dark Mode Switcher */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <div className="flex items-center gap-3">
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
            <span className="text-[10px] uppercase font-bold bg-slate-800 px-2 py-0.5 rounded-md text-slate-300">
              {darkMode ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}