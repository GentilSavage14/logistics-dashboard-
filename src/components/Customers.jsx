import React, { useState } from 'react';
import { Users, Mail, Phone, Building2, UserPlus, Package } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState([
    { id: 'CUST-101', name: 'Acme Logistics', contact: 'Sarah Jenkins', email: 'sarah@acme.com', phone: '+1 555-0192', totalOrders: 14, status: 'Active' },
    { id: 'CUST-102', name: 'Global Freight Co', contact: 'David Miller', email: 'dmiller@globalfreight.com', phone: '+1 555-0148', totalOrders: 8, status: 'Active' },
    { id: 'CUST-103', name: 'Apex Imports', contact: 'Elena Rostova', email: 'elena@apeximports.com', phone: '+1 555-0173', totalOrders: 22, status: 'Active' },
    { id: 'CUST-104', name: 'Nexus Trade', contact: 'Tom Holland', email: 'tom@nexustrade.io', phone: '+1 555-0122', totalOrders: 3, status: 'Inactive' },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    status: 'Active'
  });

  const activeCustomers = customers.filter(c => c.status === 'Active').length;
  const totalOrdersSum = customers.reduce((sum, c) => sum + c.totalOrders, 0);

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const newCustomer = {
      id: `CUST-${100 + customers.length + 1}`,
      name: formData.name,
      contact: formData.contact || 'N/A',
      email: formData.email,
      phone: formData.phone || 'N/A',
      totalOrders: 0,
      status: formData.status
    };

    setCustomers([newCustomer, ...customers]);
    setFormData({ name: '', contact: '', email: '', phone: '', status: 'Active' });
  };

  const toggleCustomerStatus = (id) => {
    setCustomers(customers.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' };
      }
      return c;
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Customers Directory</h2>
        <p className="text-gray-500">Manage client accounts, contact details, and order volumes.</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Total Clients</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{customers.length} Accounts</h3>
          </div>
          <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Active Clients</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{activeCustomers} Active</h3>
          </div>
          <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Total Lifetime Orders</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">{totalOrdersSum} Orders</h3>
          </div>
          <div className="p-3 bg-amber-100 rounded-lg text-amber-600">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Roster Table */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Client List</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-500">
                  <th className="p-3">Client</th>
                  <th className="p-3">Contact Person</th>
                  <th className="p-3">Email & Phone</th>
                  <th className="p-3">Orders</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold text-gray-800">
                      {c.name}
                      <span className="block text-xs text-gray-400 font-normal">{c.id}</span>
                    </td>
                    <td className="p-3 text-gray-600">{c.contact}</td>
                    <td className="p-3 text-gray-600">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Mail className="w-3 h-3 text-gray-400" /> {c.email}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <Phone className="w-3 h-3 text-gray-400" /> {c.phone}
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-indigo-600">{c.totalOrders}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        c.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => toggleCustomerStatus(c.id)}
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded transition"
                      >
                        Set {c.status === 'Active' ? 'Inactive' : 'Active'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Customer Form */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-600" /> Add New Client
          </h3>
          <form onSubmit={handleAddCustomer} className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase">Company / Client Name *</label>
              <input
                type="text"
                placeholder="e.g. Acme Corp"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded-lg text-sm mt-1"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase">Contact Person</label>
              <input
                type="text"
                placeholder="e.g. John Smith"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="w-full p-2 border rounded-lg text-sm mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase">Email Address *</label>
              <input
                type="email"
                placeholder="john@acme.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border rounded-lg text-sm mt-1"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase">Phone Number</label>
              <input
                type="text"
                placeholder="+1 555-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 border rounded-lg text-sm mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2 border rounded-lg text-sm mt-1"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition mt-2"
            >
              Add Client
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}