import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Plus, Trash2 } from 'lucide-react';

export default function Invoices({ darkMode, isAdmin }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ id: '', customer: '', amount: '', status: 'Unpaid' });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
    if (!error) setInvoices(data || []);
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    const { error } = await supabase.from('invoices').insert([formData]);
    if (!error) {
      fetchInvoices();
      setFormData({ id: '', customer: '', amount: '', status: 'Unpaid' });
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin || !window.confirm(`Delete invoice ${id}?`)) return;
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (!error) fetchInvoices();
  };

  const cardBg = darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-100 text-gray-800';
  const subText = darkMode ? 'text-slate-400' : 'text-gray-500';
  const inputBg = darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-gray-200 text-gray-800';

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Invoices</h2>
        <p className={subText}>Manage billing records and payment statuses.</p>
      </div>

      <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-3' : ''} gap-6`}>
        <div className={`${isAdmin ? 'lg:col-span-2' : 'w-full'} p-5 rounded-xl border shadow-sm ${cardBg}`}>
          <h3 className="font-bold mb-4">Invoice Records</h3>
          {loading ? (
            <p className={subText}>Loading invoices...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className={`border-b ${darkMode ? 'bg-slate-700/50 text-slate-300 border-slate-700' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                    <th className="p-3">Invoice ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    {isAdmin && <th className="p-3 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {invoices.length === 0 ? (
                    <tr><td colSpan={isAdmin ? 5 : 4} className={`p-4 text-center ${subText}`}>No invoices found.</td></tr>
                  ) : (
                    invoices.map((inv) => (
                      <tr key={inv.id} className={`border-b ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                        <td className="p-3 font-semibold">{inv.id}</td>
                        <td className="p-3">{inv.customer}</td>
                        <td className="p-3 font-medium">${inv.amount}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {inv.status}
                          </span>
                        </td>
                        {isAdmin && (
                          <td className="p-3 text-right">
                            <button onClick={() => handleDelete(inv.id)} className="text-red-600 hover:text-red-700 text-xs">
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
            <h3 className="font-bold mb-4">Create Invoice</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <input type="text" placeholder="Invoice ID (e.g. INV-101)" value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} className={`w-full p-2 border rounded-lg text-sm ${inputBg}`} required />
              <input type="text" placeholder="Customer Name" value={formData.customer} onChange={(e) => setFormData({ ...formData, customer: e.target.value })} className={`w-full p-2 border rounded-lg text-sm ${inputBg}`} required />
              <input type="number" placeholder="Amount ($)" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className={`w-full p-2 border rounded-lg text-sm ${inputBg}`} required />
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={`w-full p-2 border rounded-lg text-sm ${inputBg}`}>
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
              </select>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-1">
                <Plus className="w-4 h-4" /> Add Invoice
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}