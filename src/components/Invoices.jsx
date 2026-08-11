import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    client: '',
    amount: '',
    status: 'Pending',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error fetching invoices:', error);
    else setInvoices(data || []);
    setLoading(false);
  };

  const handleAddInvoice = async (e) => {
    e.preventDefault();
    if (!formData.id || !formData.client || !formData.amount) return;

    const { error } = await supabase.from('invoices').insert([
      { ...formData, amount: parseFloat(formData.amount) }
    ]);

    if (error) {
      alert('Error adding invoice: ' + error.message);
    } else {
      fetchInvoices();
      setShowModal(false);
      setFormData({
        id: '',
        client: '',
        amount: '',
        status: 'Pending',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Invoices</h2>
          <p className="text-gray-500">Track and manage billing records</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          + Create Invoice
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500 text-center py-8">Loading invoices...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm">
                <th className="p-4 border-b">Invoice ID</th>
                <th className="p-4 border-b">Client</th>
                <th className="p-4 border-b">Amount</th>
                <th className="p-4 border-b">Date</th>
                <th className="p-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-semibold text-gray-800">{inv.id}</td>
                  <td className="p-4 text-gray-600">{inv.client}</td>
                  <td className="p-4 text-gray-800 font-medium">${parseFloat(inv.amount).toLocaleString()}</td>
                  <td className="p-4 text-gray-500">{inv.date}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Create New Invoice</h3>
            <form onSubmit={handleAddInvoice} className="space-y-4">
              <input
                type="text"
                placeholder="Invoice ID (e.g. INV-104)"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Client Name"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="number"
                placeholder="Amount ($)"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2 border rounded-lg"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}