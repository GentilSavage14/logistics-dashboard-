import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download, Plus, Trash2, DollarSign } from 'lucide-react';

export default function Invoices({ darkMode, isAdmin }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: '',
    client: '',
    amount: '',
    status: 'Unpaid',
    due_date: new Date().toISOString().slice(0, 10)
  });

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
      setFormData({ id: '', client: '', amount: '', status: 'Unpaid', due_date: new Date().toISOString().slice(0, 10) });
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin || !window.confirm(`Delete invoice ${id}?`)) return;
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (!error) fetchInvoices();
  };

  const handleDownloadPDF = (inv) => {
    const doc = new jsPDF();

    // Title / Header
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229); // Indigo
    doc.text('LOGISTISHUB INVOICE', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Invoice Reference: ${inv.id}`, 14, 30);
    doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 14, 35);
    doc.text(`Due Date: ${inv.due_date || 'N/A'}`, 14, 40);

    // Bill To
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Billed To:', 14, 52);
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(inv.client || 'Valued Customer', 14, 58);

    // Table Data
    doc.autoTable({
      startY: 65,
      head: [['Invoice ID', 'Client', 'Payment Status', 'Total Amount']],
      body: [
        [inv.id, inv.client, inv.status, `$${Number(inv.amount || 0).toLocaleString()}`]
      ],
      headStyles: { fillColor: [79, 70, 229] },
      theme: 'grid',
    });

    // Total Amount Summary
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total Amount Due: $${Number(inv.amount || 0).toLocaleString()}`, 14, finalY);

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text('Thank you for choosing LogisticsHub!', 14, finalY + 15);

    doc.save(`Invoice_${inv.id}.pdf`);
  };

  const cardBg = darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-100 text-gray-800';
  const subText = darkMode ? 'text-slate-400' : 'text-gray-500';
  const inputBg = darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-gray-200 text-gray-800';

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Invoices & Billing</h2>
        <p className={subText}>Manage client billing records, payment statuses, and PDF generation.</p>
      </div>

      <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-3' : ''} gap-6`}>
        <div className={`${isAdmin ? 'lg:col-span-2' : 'w-full'} p-5 rounded-xl border shadow-sm ${cardBg}`}>
          <h3 className="font-bold mb-4">Invoice Directory</h3>
          {loading ? (
            <p className={subText}>Loading invoices...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className={`border-b ${darkMode ? 'bg-slate-700/50 text-slate-300 border-slate-700' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                    <th className="p-3">Invoice ID</th>
                    <th className="p-3">Client</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">PDF</th>
                    {isAdmin && <th className="p-3 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {invoices.length === 0 ? (
                    <tr><td colSpan={isAdmin ? 6 : 5} className={`p-4 text-center ${subText}`}>No invoices found.</td></tr>
                  ) : (
                    invoices.map((inv) => (
                      <tr key={inv.id} className={`border-b ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                        <td className="p-3 font-semibold">{inv.id}</td>
                        <td className="p-3 font-medium">{inv.client}</td>
                        <td className="p-3">${Number(inv.amount || 0).toLocaleString()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDownloadPDF(inv)}
                            className="bg-indigo-50 dark:bg-slate-700 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition inline-flex items-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" /> PDF
                          </button>
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
            <h3 className="font-bold mb-4">Create New Invoice</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <input type="text" placeholder="Invoice ID (e.g. INV-2024)" value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} className={`w-full p-2 border rounded-lg text-sm ${inputBg}`} required />
              <input type="text" placeholder="Client Name" value={formData.client} onChange={(e) => setFormData({ ...formData, client: e.target.value })} className={`w-full p-2 border rounded-lg text-sm ${inputBg}`} required />
              <input type="number" placeholder="Amount ($)" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className={`w-full p-2 border rounded-lg text-sm ${inputBg}`} required />
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={`w-full p-2 border rounded-lg text-sm ${inputBg}`}>
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
              </select>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-1">
                <Plus className="w-4 h-4" /> Create Invoice
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}