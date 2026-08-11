import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Sidebar from './components/Sidebar';
import KPICards from './components/KPICards';
import Settings from './components/Settings';
import Invoices from './components/Invoices';
import Vehicles from './components/Vehicles';
import Customers from './components/Customers';
import Analytics from './components/Analytics';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Plus, Trash2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [shipments, setShipments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // App Preferences
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState('$');

  // Form inputs
  const [trackingNo, setTrackingNo] = useState('');
  const [item, setItem] = useState('');
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    fetchShipments();
  }, []);

  async function fetchShipments() {
    const { data, error } = await supabase.from('shipments').select('*');
    if (error) console.error('Error fetching shipments:', error);
    else setShipments(data || []);
  }

  async function handleAddShipment(e) {
    e.preventDefault();
    if (!trackingNo || !item) return;

    const newShipment = {
      id: trackingNo,
      item: item,
      origin: origin,
    };

    const { data, error } = await supabase.from('shipments').insert([newShipment]).select();
    if (error) {
      alert('Error adding shipment: ' + error.message);
    } else {
      setShipments([...shipments, ...data]);
      setTrackingNo('');
      setItem('');
      setOrigin('');
    }
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('shipments').delete().eq('id', id);
    if (error) alert('Error deleting: ' + error.message);
    else setShipments(shipments.filter(s => s.id !== id));
  }

  const filteredShipments = shipments.filter(s => 
    s.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.origin?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = [
    { month: 'Jan', shipments: 2 },
    { month: 'Feb', shipments: 5 },
    { month: 'Mar', shipments: 8 },
    { month: 'Apr', shipments: 6 },
    { month: 'May', shipments: 10 },
    { month: 'Jun', shipments: shipments.length },
  ];

  return (
    <div className={`flex min-h-screen font-sans ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'}`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
            <p className="text-sm text-slate-500">Manage your operations, preferences, and tracking tools.</p>
          </div>
        </header>

        {activeTab === 'invoices' ? (
          <Invoices currency={currency} />
        ) : activeTab === 'vehicles' ? (
          <Vehicles />
        ) : activeTab === 'customers' ? (
          <Customers />
        ) : activeTab === 'analytics' ? (
          <Analytics currency={currency} />
        ) : activeTab === 'settings' ? (
          <Settings 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
            currency={currency} 
            setCurrency={setCurrency} 
          />
        ) : (
          <>
            <KPICards shipments={shipments} />

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8 text-slate-800">
              <h2 className="text-lg font-bold mb-4">Shipment Overview & Trends</h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="shipments" stroke="#2563eb" fill="#93c5fd" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8 text-slate-800">
              <h2 className="text-lg font-bold mb-4">Add New Shipment</h2>
              <form onSubmit={handleAddShipment} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input 
                  type="text" 
                  placeholder="Tracking ID (e.g. SHP-106)" 
                  value={trackingNo} 
                  onChange={e => setTrackingNo(e.target.value)}
                  className="p-2 border rounded-lg text-sm"
                  required 
                />
                <input 
                  type="text" 
                  placeholder="Item" 
                  value={item} 
                  onChange={e => setItem(e.target.value)}
                  className="p-2 border rounded-lg text-sm"
                  required 
                />
                <input 
                  type="text" 
                  placeholder="Origin" 
                  value={origin} 
                  onChange={e => setOrigin(e.target.value)}
                  className="p-2 border rounded-lg text-sm" 
                />
                <button type="submit" className="bg-blue-600 text-white rounded-lg p-2 font-medium hover:bg-blue-700 flex items-center justify-center gap-2 text-sm">
                  <Plus className="w-4 h-4" /> Add Shipment
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-lg font-bold">Recent Shipments</h2>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-1.5 border rounded-lg text-sm w-64"
                  />
                </div>
              </div>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase border-b">
                    <th className="p-4">Tracking ID</th>
                    <th className="p-4">Item</th>
                    <th className="p-4">Origin</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredShipments.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-4 font-semibold text-slate-800">{s.id}</td>
                      <td className="p-4">{s.item}</td>
                      <td className="p-4">{s.origin || 'N/A'}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}