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
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    item: '',
    origin: '',
    destination: '',
    status: 'Pending'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: shipData, error: shipError } = await supabase
      .from('shipments')
      .select('*')
      .order('created_at', { ascending: false });
    
    const { data: invData } = await supabase.from('invoices').select('*');

    if (shipError) {
      console.error('Error fetching shipments:', shipError);
    } else {
      setShipments(shipData || []);
    }

    if (invData) setInvoices(invData);
    setLoading(false);
  };

  const handleAddShipment = async (e) => {
    e.preventDefault();
    if (!formData.id || !formData.item) return;

    const { error } = await supabase.from('shipments').insert([formData]);

    if (error) {
      alert('Error adding shipment: ' + error.message);
    } else {
      fetchData();
      setFormData({
        id: '',
        item: '',
        origin: '',
        destination: '',
        status: 'Pending'
      });
    }
  };

  const filteredShipments = shipments.filter(s =>
    (s.id && s.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.item && s.item.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.origin && s.origin.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalRevenue = invoices.reduce((sum, inv) => sum + (parseFloat(inv.amount) || 0), 0);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto">
        {activeTab === 'Dashboard' && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
              <p className="text-gray-500">Manage your operations, preferences, and tracking tools.</p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase">Total Shipments</p>
                <h3 className="text-3xl font-extrabold text-gray-800 mt-1">{shipments.length}</h3>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase">Pending Deliveries</p>
                <h3 className="text-3xl font-extrabold text-amber-500 mt-1">
                  {shipments.filter(s => s.status === 'Pending').length}
                </h3>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase">Delivered</p>
                <h3 className="text-3xl font-extrabold text-emerald-500 mt-1">
                  {shipments.filter(s => s.status === 'Delivered').length}
                </h3>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase">Total Revenue</p>
                <h3 className="text-3xl font-extrabold text-indigo-600 mt-1">${totalRevenue.toLocaleString()}</h3>
              </div>
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Shipments Table */}
              <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">Recent Shipments</h3>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-1.5 border rounded-lg text-sm"
                  />
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
                        {filteredShipments.map((s) => (
                          <tr key={s.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-semibold text-gray-800">{s.id}</td>
                            <td className="p-3 text-gray-600">{s.item}</td>
                            <td className="p-3 text-gray-500">{s.origin}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                s.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {s.status || 'In Transit'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Quick Add Form */}
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
        )}

        {activeTab === 'Shipments' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Shipments Overview</h2>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
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
                  {shipments.map((s) => (
                    <tr key={s.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-semibold text-gray-800">{s.id}</td>
                      <td className="p-3 text-gray-600">{s.item}</td>
                      <td className="p-3 text-gray-500">{s.origin}</td>
                      <td className="p-3">{s.status || 'Pending'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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