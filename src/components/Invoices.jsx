import React, { useState } from 'react';
import { Plus, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Invoices({ currency }) {
  const [invoices, setInvoices] = useState([
    { id: 'INV-1001', customer: 'Acme Corp', amount: 450, status: 'Paid', date: '2026-08-01' },
    { id: 'INV-1002', customer: 'Global Freight Ltd', amount: 1200, status: 'Pending', date: '2026-08-05' },
    { id: 'INV-1003', customer: 'Express Logistics', amount: 310, status: 'Overdue', date: '2026-07-28' },
  ]);

  const [customer, setCustomer] = useState('');
  const [amount, setAmount] = useState('');

  function handleAddInvoice(e) {
    e.preventDefault();
    if (!customer || !amount) return;

    const newInvoice = {
      id: `INV-${1000 + invoices.length + 1}`,
      customer,
      amount: parseFloat(amount),
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
    };

    setInvoices([newInvoice, ...invoices]);
    setCustomer('');
    setAmount('');
  }

  function getStatusBadge(status) {
    switch (status) {
      case 'Paid':
        return <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold"><CheckCircle className="w-3 h-3" /> Paid</span>;
      case 'Pending':
        return <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold"><Clock className="w-3 h-3" /> Pending</span>;
      case 'Overdue':
        return <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 font-semibold"><AlertCircle className="w-3 h-3" /> Overdue</span>;
      default:
        return null;
    }
  }

  return (
    <div className="space-y-6">
      {/* Create Invoice Form */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-slate-800">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" /> Create New Invoice
        </h2>
        <form onSubmit={handleAddInvoice} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text" 
            placeholder="Customer / Company Name" 
            value={customer} 
            onChange={e => setCustomer(e.target.value)}
            className="p-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required 
          />
          <input 
            type="number" 
            placeholder={`Amount (${currency})`} 
            value={amount} 
            onChange={e => setAmount(e.target.value)}
            className="p-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required 
          />
          <button 
            type="submit" 
            className="bg-blue-600 text-white rounded-lg p-2.5 font-medium hover:bg-blue-700 flex items-center justify-center gap-2 text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Generate Invoice
          </button>
        </form>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-lg font-bold">Billing & Invoices</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase border-b">
              <th className="p-4">Invoice ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50">
                <td className="p-4 font-semibold text-slate-900">{inv.id}</td>
                <td className="p-4">{inv.customer}</td>
                <td className="p-4 font-medium">{currency}{inv.amount.toFixed(2)}</td>
                <td className="p-4 text-slate-500">{inv.date}</td>
                <td className="p-4">{getStatusBadge(inv.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}