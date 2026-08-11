import React from 'react';
import { TrendingUp, BarChart2, DollarSign, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Analytics({ currency }) {
  const revenueData = [
    { month: 'Jan', revenue: 4200 },
    { month: 'Feb', revenue: 6800 },
    { month: 'Mar', revenue: 9500 },
    { month: 'Apr', revenue: 8100 },
    { month: 'May', revenue: 11400 },
    { month: 'Jun', revenue: 14200 },
  ];

  const statusData = [
    { name: 'Delivered', value: 65, color: '#10b981' },
    { name: 'In Transit', value: 25, color: '#3b82f6' },
    { name: 'Pending', value: 10, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg. Delivery Speed</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">2.4 Days</h3>
            <span className="text-xs text-emerald-600 font-medium">↑ 12% faster than last month</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">On-Time Rate</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">98.2%</h3>
            <span className="text-xs text-emerald-600 font-medium">↑ 1.5% improvement</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{currency}54,200</h3>
            <span className="text-xs text-emerald-600 font-medium">↑ 22% growth</span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Growth Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-slate-800">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-600" /> Revenue Growth ({currency})
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Delivery Status Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-slate-800">
          <h2 className="text-lg font-bold mb-4">Delivery Status Ratio</h2>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}