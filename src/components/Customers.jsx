import React, { useState } from 'react';
import { Users, Plus, Mail, Phone, Building } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState([
    { id: 'CUST-01', name: 'Acme Corporation', contact: 'Alice Johnson', email: 'alice@acme.com', phone: '+1 555-0192', orders: 14 },
    { id: 'CUST-02', name: 'Global Freight Ltd', contact: 'Bob Smith', email: 'bob@globalfreight.com', phone: '+1 555-0143', orders: 8 },
    { id: 'CUST-03', name: 'Apex Logistics', contact: 'Charlie Brown', email: 'charlie@apex.com', phone: '+1 555-0188', orders: 22 },
  ]);

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');

  function handleAddCustomer(e) {
    e.preventDefault();
    if (!name || !email) return;

    const newCustomer = {
      id: `CUST-0${customers.length + 1}`,
      name,
      contact,
      email,
      phone: '+1 555-0000',
      orders: 0,
    };

    setCustomers([newCustomer, ...customers]);
    setName('');
    setContact('');
    setEmail('');
  }

  return (
    <div className="space-y-6">
      {/* Add Customer Form */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-slate-800">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" /> Add New Customer
        </h2>
        <form onSubmit={handleAddCustomer} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            type="text" 
            placeholder="Company Name" 
            value={name} 
            onChange={e => setName(e.target.value)}
            className="p-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required 
          />
          <input 
            type="text" 
            placeholder="Primary Contact Name" 
            value={contact} 
            onChange={e => setContact(e.target.value)}
            className="p-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            className="p-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required 
          />
          <button 
            type="submit" 
            className="bg-blue-600 text-white rounded-lg p-2.5 font-medium hover:bg-blue-700 flex items-center justify-center gap-2 text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Client
          </button>
        </form>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-lg font-bold">Client Directory</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase border-b">
              <th className="p-4">Customer ID</th>
              <th className="p-4">Company</th>
              <th className="p-4">Contact Person</th>
              <th className="p-4">Email</th>
              <th className="p-4">Total Orders</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="p-4 font-semibold text-slate-900">{c.id}</td>
                <td className="p-4 font-medium flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-400" /> {c.name}
                </td>
                <td className="p-4">{c.contact}</td>
                <td className="p-4 text-slate-500 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {c.email}
                </td>
                <td className="p-4 font-semibold text-blue-600">{c.orders} shipments</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}