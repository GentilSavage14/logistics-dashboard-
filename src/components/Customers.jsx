import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    contact: '',
    email: '',
    phone: '',
    orders: 0
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error fetching customers:', error);
    else setCustomers(data || []);
    setLoading(false);
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!formData.id || !formData.name || !formData.email) return;

    const { error } = await supabase.from('customers').insert([
      { ...formData, orders: parseInt(formData.orders) || 0 }
    ]);

    if (error) {
      alert('Error adding customer: ' + error.message);
    } else {
      fetchCustomers();
      setShowModal(false);
      setFormData({
        id: '',
        name: '',
        contact: '',
        email: '',
        phone: '',
        orders: 0
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Customers</h2>
          <p className="text-gray-500">Manage clients and shipping contacts</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          + Add Customer
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500 text-center py-8">Loading customers...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm">
                <th className="p-4 border-b">ID</th>
                <th className="p-4 border-b">Company Name</th>
                <th className="p-4 border-b">Contact Person</th>
                <th className="p-4 border-b">Email</th>
                <th className="p-4 border-b">Phone</th>
                <th className="p-4 border-b">Total Orders</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-semibold text-gray-800">{c.id}</td>
                  <td className="p-4 text-gray-800 font-medium">{c.name}</td>
                  <td className="p-4 text-gray-600">{c.contact || '-'}</td>
                  <td className="p-4 text-gray-600">{c.email}</td>
                  <td className="p-4 text-gray-500">{c.phone || '-'}</td>
                  <td className="p-4 font-semibold text-indigo-600">{c.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add New Customer</h3>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <input
                type="text"
                placeholder="Customer ID (e.g. CUST-04)"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Company Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Contact Person Name"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Initial Order Count"
                value={formData.orders}
                onChange={(e) => setFormData({ ...formData, orders: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
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
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}