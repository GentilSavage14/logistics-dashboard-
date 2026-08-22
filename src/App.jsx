import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import KPICards from './components/KPICards';
import Invoices from './components/Invoices';
import Customers from './components/Customers';
import Vehicles from './components/Vehicles';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import Login from './components/Login';
import { supabase } from './supabaseClient';
import { LogOut, Menu } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [formData, setFormData] = useState({
    id: '',
    item: '',
    origin: '',
    destination: '',
    status: 'Pending'
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCheckingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchShipments();
    }
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

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

  const handleUpdateStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Delivered' ? 'Pending' : 'Delivered';

    const { error } = await supabase
      .from('shipments')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('Error updating status: ' + error.message);
    } else {
      fetchShipments();
    }
  };

  const handleDeleteShipment = async (id) => {
    if (!window.confirm(`Are you sure you want to delete shipment ${id}?`)) return;

    const { error } = await supabase
      .from('shipments')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error deleting shipment: ' + error.message);
    } else {
      fetchShipments();
    }
  };

  const filteredShipments = shipments.filter((s) => {
    const matchesSearch =
      (s.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.item || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.origin || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Pending' && (s.status || '').toLowerCase().includes('pending')) ||
      (statusFilter === 'Delivered' && (s.status || '').toLowerCase() === 'delivered');

    return matchesSearch && matchesStatus;
  });

  const downloadCSV = () => {
    if (filteredShipments.length === 0) {
      alert('No shipment data available to export.');
      return;
    }

    const headers = ['Tracking ID', 'Item', 'Origin', 'Status'];

    const rows = filteredShipments.map((s) => [
      `"${s.id || ''}"`,
      `"${s.item || ''}"`,
      `"${s.origin || ''}"`,
      `"${s.status || 'Pending'}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shipments_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        Loading system auth...
      </div>
    );
  }

  if (!session) {
    return <Login onLoginSuccess={(sess) => setSession(sess)} />;
  }

  const cardBg = darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-100 text-gray-800';
  const subText = darkMode ? 'text-slate-400' : 'text-gray-500';
  const inputBg = darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-gray-200 text-gray-800';

  const renderTabContent = () => {
    const tab = activeTab.toLowerCase();

    if (tab === 'dashboard' || tab === 'shipments') {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{activeTab}</h2>
              <p className={subText}>Manage your operations and tracking tools.</p>
            </div>
            <button
              onClick={handleLogout}
              className={`${darkMode ? 'bg-slate-800 hover:bg-red-900/40 text-slate-300 hover:text-red-400' : 'bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600'} text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5`}
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>

          <KPICards shipments={shipments} darkMode={darkMode} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`lg:col-span-2 p-5 rounded-xl border shadow-sm ${cardBg}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h3 className="font-bold">Shipments List</h3>
                <button
                  onClick={downloadCSV}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition shadow-sm flex items-center justify-center gap-1"
                >
                  📥 Export CSV
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <input
                  type="text"
                  placeholder="🔍 Search ID, item, or origin..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`flex-1 p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`p-2 text-sm border rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending Only</option>
                  <option value="Delivered">Delivered Only</option>
                </select>
              </div>

              {loading ? (
                <p className={`${subText} text-sm`}>Loading shipments...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className={`border-b ${darkMode ? 'bg-slate-700/50 text-slate-300 border-slate-700' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                        <th className="p-3">Tracking ID</th>
                        <th className="p-3">Item</th>
                        <th className="p-3">Origin</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredShipments.length === 0 ? (
                        <tr>
                          <td colSpan="5" className={`p-4 text-center ${subText}`}>
                            No matching shipments found.
                          </td>
                        </tr>
                      ) : (
                        filteredShipments.map((s) => (
                          <tr key={s.id} className={`border-b ${darkMode ? 'border-slate-700 hover:bg-slate-700/30' : 'border-gray-100 hover:bg-gray-50'}`}>
                            <td className="p-3 font-semibold">{s.id}</td>
                            <td className="p-3">{s.item}</td>
                            <td className={`p-3 ${subText}`}>{s.origin}</td>
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
                            <td className="p-3 text-right space-x-2">
                              <button
                                onClick={() => handleUpdateStatus(s.id, s.status)}
                                className={`text-xs px-2 py-1 rounded transition ${darkMode ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                              >
                                {s.status === 'Delivered' ? 'Mark Pending' : 'Mark Delivered'}
                              </button>
                              <button
                                onClick={() => handleDeleteShipment(s.id)}
                                className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-2 py-1 rounded transition"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className={`p-5 rounded-xl border shadow-sm ${cardBg}`}>
              <h3 className="font-bold mb-4">Add New Shipment</h3>
              <form onSubmit={handleAddShipment} className="space-y-3">
                <input
                  type="text"
                  placeholder="Tracking ID (e.g. SHP-106)*"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className={`w-full p-2 border rounded-lg text-sm ${inputBg}`}
                  required
                />
                <input
                  type="text"
                  placeholder="Item Name*"
                  value={formData.item}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                  className={`w-full p-2 border rounded-lg text-sm ${inputBg}`}
                  required
                />
                <input
                  type="text"
                  placeholder="Origin"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  className={`w-full p-2 border rounded-lg text-sm ${inputBg}`}
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

    if (tab === 'invoices') return <Invoices darkMode={darkMode} />;
    if (tab === 'customers') return <Customers darkMode={darkMode} />;
    if (tab === 'vehicles') return <Vehicles darkMode={darkMode} />;
    if (tab === 'analytics') return <Analytics darkMode={darkMode} />;
    if (tab === 'settings') return <Settings darkMode={darkMode} setDarkMode={setDarkMode} />;

    return null;
  };

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        darkMode={darkMode} 
        setDarkMode={setDarkMode}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 w-full">
        {/* Mobile Header Bar with Menu Button */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200 dark:border-slate-800 md:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg bg-indigo-600 text-white shadow-sm flex items-center gap-2 text-xs font-semibold"
          >
            <Menu className="w-5 h-5" /> Menu
          </button>
          <span className="font-bold text-sm tracking-tight">LogisticsHub</span>
        </div>

        {renderTabContent()}
      </main>
    </div>
  );
}