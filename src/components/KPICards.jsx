import React from 'react';
import { Package, Clock, CheckCircle, DollarSign } from 'lucide-react';

export default function KPICards({ shipments = [], darkMode = false }) {
  const totalShipments = shipments.length;
  const pendingDeliveries = shipments.filter(
    (s) => (s.status || '').toLowerCase().includes('pending')
  ).length;
  const delivered = shipments.filter(
    (s) => (s.status || '').toLowerCase() === 'delivered'
  ).length;

  // Estimated revenue based on delivered items
  const totalRevenue = delivered * 250;

  const cardStyle = darkMode
    ? 'bg-slate-800 border-slate-700 text-white'
    : 'bg-white border-gray-100 text-gray-800';

  const labelStyle = darkMode ? 'text-slate-400' : 'text-gray-500';

  const kpis = [
    {
      title: 'Total Shipments',
      value: totalShipments,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Pending Deliveries',
      value: pendingDeliveries,
      icon: Clock,
      color: 'bg-amber-500',
    },
    {
      title: 'Delivered',
      value: delivered,
      icon: CheckCircle,
      color: 'bg-emerald-500',
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-indigo-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div
            key={idx}
            className={`p-5 rounded-xl border shadow-sm flex items-center justify-between transition-colors duration-300 ${cardStyle}`}
          >
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider ${labelStyle}`}>
                {kpi.title}
              </p>
              <h3 className="text-2xl font-bold mt-1">{kpi.value}</h3>
            </div>
            <div className={`p-3 rounded-xl text-white ${kpi.color} shadow-md`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}