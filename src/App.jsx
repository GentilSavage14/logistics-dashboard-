import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import KPICards from './components/KPICards';
import Invoices from './components/Invoices';
import Customers from './components/Customers';
import Vehicles from './components/Vehicles';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import { supabase } from './supabaseClient';

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('shipments').select('*');
    if (error) console.error(error);
    else setShipments(data || []);
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto p-6">
        {(activeTab === 'Dashboard' || activeTab === 'Shipments') && (
          <div>
            <h2 className="text-2xl font-bold mb-4">{activeTab}</h2>
            <KPICards />
            <div className="mt-6 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Shipments List</h3>
              {loading ? (
                <p className="text-gray-400 text-sm">Loading shipments...</p>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50 text-gray-500">
                      <th className="p-3">Tracking ID</th>
                      <th className="p-3">Item</th>
                      <th className="p-3">Origin</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipments.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="p-4 text-center text-gray-400">
                          No shipments found.
                        </td>
                      </tr>
                    ) : (
                      shipments.map((s) => (
                        <tr key={s.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-semibold text-gray-800">{s.id}</td>
                          <td className="p-3 text-gray-600">{s.item}</td>
                          <td className="p-3 text-gray-500">{s.origin}</td>
                          <td className="p-3">{s.status || 'Pending'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Invoices' && <Invoices />}
        {activeTab === 'Customers' && <Customers />}
        {activeTab === 'Vehicles' && <Vehicles />}
        {activeTab === 'Analytics' && <Analytics />}
        {activeTab === 'Settings' && <Settings />}
      </main>
    </div>
  );
}