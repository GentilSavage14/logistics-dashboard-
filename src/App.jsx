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
  const [formData, setFormData] = useState({
    id: '',
    item: '',
    origin: '',
    destination: '',
    status: 'Pending'
  });

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching shipments:', error);
    else setShipments(data || []);
    setLoading(false);
  };

  const handleAddShipment = async (e) => {
    e.preventDefault();
    if (!formData.id || !formData.item) return;

    const { error } = await supabase.from('shipments').insert([formData]);

    if (error) {
      alert('Error adding shipment: ' + error.message);
    } else {
      fetchShipments();
      setFormData({ id: '', item: '', origin: '', destination: '', status: 'Pending' });
    }
  };

  // CSV Export Handler
  const downloadCSV = () => {
    if (shipments.length === 0) {
      alert('No shipment data available to export.');
      return;
    }

    // CSV Headers
    const headers = ['Tracking ID', 'Item', 'Origin', 'Status'];

    // Map rows
    const rows = shipments.map((s) => [
      `"${s.id || ''}"`,
      `"${s.item || ''}"`,
      `"${s.origin || ''}"`,
      `"${s.status || 'Pending'}"`
    ]);

    // Build CSV string
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    // Create hidden link and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shipments_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderTabContent = () => {
    const tab = activeTab.toLowerCase();

    if (tab === 'dashboard' || tab === 'shipments') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{activeTab}</h2>
            <p className="text-gray-500">Manage your operations and tracking tools.</p>
          </div>

          <KPICards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Shipments Table */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Shipments List</h3>
                <button
                  onClick={downloadCSV}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition shadow-sm flex items-center gap-1"
                >
                  📥 Export CSV
                </button>
              </div>

              {loading ? (
                <p className="text-gray-400 text-sm">Loading shipments...</p>
              ) : (
                <div className="overflow-x-auto">
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
                            <td className="p-3">
                              <span
                                className={`px-2 py-1 text-xs rounded-full font-medium ${
                                  s.status === 'Delivered'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}
                              >
                                {s.status || 'Pending'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Add Shipment Form */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Add New Shipment</h3>
              <form onSubmit={handleAddShipment} className="space-y-3">
                <input
                  type="text"
                  placeholder="Tracking ID (e.g. SHP-106)*"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full p-2 border rounded-lg text-sm"
                  required
                />
                <input
                  type="text"
                  placeholder="Item Name*"
                  value={formData.item}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                  className="w-full p-2 border rounded-lg text-sm"
                  required
                />
                <input
                  type="text"
                  placeholder="Origin"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  className="w-full p-2 border rounded-lg text-sm"
                />
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                >
                  Add Shipment
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    }

    if (tab === 'invoices') return <Invoices />;
    if (tab === 'customers') return <Customers />;
    if (tab === 'vehicles') return <Vehicles />;
    if (tab === 'analytics') return <Analytics />;
    if (tab === 'settings') return <Settings />;

    return null;
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto p-6">{renderTabContent()}</main>
    </div>
  );
}