import React from 'react';
import { TrendingUp, PieChart, BarChart3, ShieldCheck } from 'lucide-react';

export default function Analytics() {
  const monthlyRevenue = [
    { month: 'Oct', value: 4200 },
    { month: 'Nov', value: 6800 },
    { month: 'Dec', value: 9500 },
    { month: 'Jan', value: 7100 },
    { month: 'Feb', value: 8900 },
    { month: 'Mar', value: 12400 },
  ];

  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.value));

  const routePerformance = [
    { origin: 'Accra Port', shipments: 45, percentage: 85 },
    { origin: 'Tema Hub', shipments: 32, percentage: 60 },
    { origin: 'Kumasi Depot', shipments: 18, percentage: 35 },
    { origin: 'Takoradi Terminal', shipments: 12, percentage: 22 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Analytics & Insights</h2>
        <p className="text-gray-500">Performance metrics, revenue trends, and operational volume.</p>
      </div>

      {/* Top Metric Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase">Avg Delivery Time</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">1.8 Days</h3>
          <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">↓ 12% faster this month</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase">Fulfillment Rate</p>
          <h3 className="text-2xl font-bold text-emerald-600 mt-1">98.4%</h3>
          <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">↑ 2.1% higher</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase">Active Routes</p>
          <h3 className="text-2xl font-bold text-indigo-600 mt-1">14 Hubs</h3>
          <span className="text-xs text-gray-400 font-medium mt-1 inline-block">Across 4 regions</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase">Monthly Volume</p>
          <h3 className="text-2xl font-bold text-amber-500 mt-1">107 Items</h3>
          <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">↑ 18% increase</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart: Revenue Trend */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" /> Revenue Growth Trend
              </h3>
              <p className="text-xs text-gray-400">Monthly gross income ($)</p>
            </div>
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full">
              +38% vs last quarter
            </span>
          </div>

          <div className="h-60 flex items-end justify-between gap-3 pt-6 border-b border-gray-100 pb-2">
            {monthlyRevenue.map((item, index) => {
              const heightPercent = (item.value / maxRevenue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    ${item.value.toLocaleString()}
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 rounded-t-lg transition-all duration-300"
                  ></div>
                  <span className="text-xs font-medium text-gray-500">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Route Performance */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" /> Top Shipping Hubs
            </h3>
            <p className="text-xs text-gray-400">Distribution by departure volume</p>
          </div>

          <div className="space-y-4">
            {routePerformance.map((route, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-gray-700">{route.origin}</span>
                  <span className="text-gray-500">{route.shipments} shipments</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${route.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-indigo-50 rounded-lg flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-indigo-600 shrink-0" />
            <p className="text-xs text-indigo-900 leading-relaxed">
              <strong>Tip:</strong> Accra Port and Tema Hub account for over 70% of total cargo traffic. Consider allocating additional vehicle fleet to these hubs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}