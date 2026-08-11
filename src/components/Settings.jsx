import React, { useState } from 'react';
import { Moon, Sun, DollarSign, Building, Bell, Shield } from 'lucide-react';

export default function Settings({ darkMode, setDarkMode, currency, setCurrency }) {
  const [companyName, setCompanyName] = useState('LogisticsHub Ltd.');
  const [emailAlerts, setEmailAlerts] = useState(true);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Profile & Organization */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Building className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-800">Organization Info</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Company Name</label>
            <input 
              type="text" 
              value={companyName} 
              onChange={e => setCompanyName(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Default Currency</label>
           <select 
  value={currency} 
  onChange={e => setCurrency(e.target.value)}
  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <option value="$">USD ($)</option>
  <option value="€">EUR (€)</option>
  <option value="£">GBP (£)</option>
  <option value="GH₵">GHS (GH₵)</option>
  <option value="CA$">CAD (CA$)</option>
  <option value="A$">AUD (A$)</option>
  <option value="₦">NGN (₦)</option>
  <option value="¥">JPY (¥)</option>
</select>
          </div>
        </div>
      </div>

      {/* Appearance & Preferences */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          {darkMode ? <Moon className="w-5 h-5 text-blue-600" /> : <Sun className="w-5 h-5 text-blue-600" />}
          <h2 className="text-lg font-bold text-slate-800">Appearance</h2>
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-semibold text-slate-800">Dark Mode Theme</p>
            <p className="text-xs text-slate-500">Switch dashboard theme to dark background style</p>
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              darkMode ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {darkMode ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>

      {/* Notifications & System Alerts */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-800">Notifications</h2>
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-semibold text-slate-800">Email Alerts</p>
            <p className="text-xs text-slate-500">Receive notifications when shipment status updates</p>
          </div>
          <input 
            type="checkbox" 
            checked={emailAlerts} 
            onChange={() => setEmailAlerts(!emailAlerts)}
            className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}