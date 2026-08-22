import React, { useState } from 'react';
import { Building2, Bell, Moon, Sun, ShieldCheck } from 'lucide-react';

export default function Settings({ darkMode, setDarkMode }) {
  const [companyName, setCompanyName] = useState('LogisticsHub Ltd.');
  const [currency, setCurrency] = useState('USD ($)');
  const [emailAlerts, setEmailAlerts] = useState(true);

  const cardBg = darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-100 text-gray-800';
  const subText = darkMode ? 'text-slate-400' : 'text-gray-500';
  const inputBg = darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-gray-200 text-gray-800';

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Settings</h2>
        <p className={subText}>Manage your platform preferences and system configuration.</p>
      </div>

      {/* Organization Info */}
      <div className={`p-6 rounded-xl border shadow-sm ${cardBg}`}>
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-indigo-500" />
          <h3 className="font-bold text-lg">Organization Info</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs font-semibold uppercase mb-1 ${subText}`}>Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className={`w-full p-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold uppercase mb-1 ${subText}`}>Default Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`w-full p-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
            >
              <option value="USD ($)">USD ($)</option>
              <option value="EUR (€)">EUR (€)</option>
              <option value="GBP (£)">GBP (£)</option>
              <option value="GHS (GH₵)">GHS (GH₵)</option>
              <option value="CAD (CA$)">CAD (CA$)</option>
              <option value="AUD (A$)">AUD (A$)</option>
              <option value="NGN (₦)">NGN (₦)</option>
              <option value="JPY (¥)">JPY (¥)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className={`p-6 rounded-xl border shadow-sm ${cardBg}`}>
        <div className="flex items-center gap-2 mb-4">
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-500" />}
          <h3 className="font-bold text-lg">Appearance</h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm">Dark Mode Theme</p>
            <p className={`text-xs ${subText}`}>Switch dashboard theme to dark background style</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
              darkMode ? 'bg-amber-500 text-slate-900 hover:bg-amber-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {darkMode ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className={`p-6 rounded-xl border shadow-sm ${cardBg}`}>
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-indigo-500" />
          <h3 className="font-bold text-lg">Notifications</h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm">Email Alerts</p>
            <p className={`text-xs ${subText}`}>Receive notifications when shipment status updates</p>
          </div>
          <input
            type="checkbox"
            checked={emailAlerts}
            onChange={(e) => setEmailAlerts(e.target.checked)}
            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 accent-indigo-600"
          />
        </div>
      </div>
    </div>
  );
}