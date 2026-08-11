import React from 'react';
import { Package, Clock, CheckCircle2, DollarSign } from 'lucide-react';

export default function KPICards({ shipments = [] }) {
  const totalShipments = shipments.length;
  const pending = shipments.filter(s => s.status?.toLowerCase() === 'pending').length;
  const delivered = shipments.filter(s => s.status?.toLowerCase() === 'delivered').length;
  const totalRevenue = shipments.reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);

  const stats = [
    {
      title: 'Total Shipments',
      value: totalShipments,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Pending Deliveries',
      value: pending,
      icon: Clock,
      color: 'bg-amber-500',
    },
    {
      title: 'Delivered',
      value: delivered,
      icon: CheckCircle2,
      color: 'bg-emerald-500',
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-indigo-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-lg text-white ${stat.color}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}