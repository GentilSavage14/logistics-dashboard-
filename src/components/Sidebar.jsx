import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Users, 
  Truck, 
  BarChart3, 
  Settings 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'shipments', label: 'Shipments', icon: Package },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'vehicles', label: 'Vehicles', icon: Truck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-8 px-2">
          <Truck className="w-8 h-8 text-blue-500" />
          <span className="text-xl font-bold tracking-wide">LogisticsHub</span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-800 pt-4">
        <button 
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'settings' 
              ? 'bg-blue-600 text-white' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Settings className="w-5 h-5" />
          Settings
        </button>
      </div>
    </div>
  );
}