import React, { useState } from 'react';
import { DollarSign, FileText, CheckCircle, Clock } from 'lucide-react';

export default function Invoices() {
  const [invoices, setInvoices] = useState([
    { id: 'INV-1001', customer: 'Acme Logistics', amount: 1250.00, date: '2026-03-01', status: 'Paid' },
    { id: 'INV-1002', customer: 'Global Freight Co', amount: 850.50, date: '2026-03-03', status: 'Pending' },
    { id: 'INV-1003', customer: 'Apex Imports', amount: 2100.00, date: '2026-03-05', status: 'Paid' },
  ]);

  const [formData, setFormData] = useState({
    customer: '',
    amount: '',
    status: 'Pending'
  });

  const totalRevenue = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + Number(inv.amount), 0);

  const pendingAmount = invoices
    .filter(inv => inv.status === 'Pending')
    .reduce((sum, inv) => sum + Number(inv.amount), 0);

  const handleAddInvoice = (e) => {
    e.preventDefault();
    if (!formData.customer || !formData.amount) return;

    const newInvoice = {
      id: `INV-${1000 + invoices.length + 1}`,
      customer: formData.customer,
      amount: parseFloat(formData.amount),
      date: new Date().toISOString().slice(0, 10),
      status: formData.status
    };

    setInvoices([newInvoice, ...invoices]);
    setFormData({ customer: '', amount: '', status: 'Pending' });
  };

  const toggleStatus = (id) => {
    setInvoices(invoices.map(inv => {
      if (inv.id === id) {
        return { ...inv, status: inv.status === 'Paid' ? 'Pending' : 'Paid' };
      }
      return inv;
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Invoices</h2>
        <p className="text-gray-500">Track and manage client billings & payouts.</p>
      </div>

      {/* KPI Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Paid Revenue</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">${totalRevenue.toLocaleString()}</h3>
          </div>
          <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Pending Payments</p>
            <h3 className="text-2xl font-bold text-amber-500 mt-1">${pendingAmount.toLocaleString()}</h3>
          </div>
          <div className="p-3 bg-amber-100 rounded-lg text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Total Invoices</p>
            <h3 className="text-2xl font-bold text-indigo-600 mt-1">{invoices.length}</h3>
          </div>
          <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
            <FileText className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice List */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Invoice History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-500">
                  <th className="p-3">Invoice ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold text-gray-800">{inv.id}</td>
                    <td className="p-3 text-gray-600">{inv.customer}</td>
                    <td className="p-3 font-medium text-gray-800">${Number(inv.amount).toFixed(2)}</td>
                    <td className="p-3 text-gray-500">{inv.date}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => toggleStatus(inv.id)}
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded transition"
                      >
                        Mark as {inv.status === 'Paid' ? 'Pending' : 'Paid'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Invoice Form */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Create New Invoice</h3>
          <form onSubmit={handleAddInvoice} className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase">Customer Name</label>
              <input
                type="text"
                placeholder="e.g. Acme Corp"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                className="w-full p-2 border rounded-lg text-sm mt-1"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase">Amount ($)</label>
              <input
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full p-2 border rounded-lg text-sm mt-1"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2 border rounded-lg text-sm mt-1"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition mt-2"
            >
              Generate Invoice
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}