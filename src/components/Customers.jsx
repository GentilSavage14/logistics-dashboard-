import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Plus, Trash2 } from 'lucide-react';

export default function Customers({ darkMode, isAdmin }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ id: '', name: '', email: '', company: '' });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (!error) setCustomers(data || []);
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    const { error } = await supabase.from('customers').insert([formData]);
    if (!error) {
      fetchCustomers();
      setFormData({ id: '', name: '', email: '', company: '' });
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin || !window.confirm(`Delete customer ${id}?`)) return;
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (!error) fetchCustomers();
  };

  const cardBg = darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-100 text-gray-800';
  const subText = darkMode ? 'text-slate-400' : 'text-gray-500';
  const inputBg = darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-gray-200 text-gray-800';

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Customers</h2>
        <p className={subText}>Manage client profiles and corporate directory.</p>
      </div>

      <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-3' : ''} gap-6`}>
        <div className={`${isAdmin ? 'lg:col-span-2' : 'w-full'} p-5 rounded-xl border shadow-sm ${cardBg}`}>
          <h3 className="font-bold mb-4">Customer Directory</h3>
          {loading ? (
            <p className={subText}>Loading customers...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className={`border-b ${darkMode ? 'bg-slate-700/50 text-slate-300 border-slate-700' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                    <th className="p-3">ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Company</th>
                    {isAdmin && <th className="p-3 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {customers.length === 0 ? (
                    <tr><td colSpan={isAdmin ? 5 : 4} className={`p-4 text-center ${subText}`}>No customers found.</td></tr>
                  ) : (
                    customers.map((c) => (
                      <tr key={c.id} className={`border-b ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                        <td className="p-3 font-semibold">{c.id}</td>
                        <td className="p-3 font-medium">{c.name}</td>
                        <td className={`p-3 ${subText}`}>{c.email}</td>
                        <td className="p-3">{c.company}</td>
                        {isAdmin && (
                          <td className="p-3 text-right">
                            <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-700 text-xs">
                              <Trash2 className="w-4 h-4 inline" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {isAdmin && (
          <div className={`p-5 rounded-xl border shadow-sm ${cardBg}`}>
            <h3 className="font-bold mb-4">Add Customer</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <input type="text" placeholder="Customer ID (e.g. CUST-101)" value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} className={`w-full p-2 border rounded-lg text-sm ${inputBg}`} required />
              <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={`w-full p-2 border rounded-lg text-sm ${inputBg}`} required />
              <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={`w-full p-2 border rounded-lg text-sm ${inputBg}`} required />
              <input type="text" placeholder="Company Name" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className={`w-full p-2 border rounded-lg text-sm ${inputBg}`} />
              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-1">
                <Plus className="w-4 h-4" /> Add Customer
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}