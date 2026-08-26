import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

export default function Analytics({ darkMode }) {
  // Sample data for charts
  const monthlyVolumeData = [
    { month: 'Jan', shipments: 45, revenue: 3200 },
    { month: 'Feb', shipments: 52, revenue: 4100 },
    { month: 'Mar', shipments: 61, revenue: 4800 },
    { month: 'Apr', shipments: 58, revenue: 4300 },
    { month: 'May', shipments: 75, revenue: 6200 },
    { month: 'Jun', shipments: 90, revenue: 7500 },
  ];

  const statusDistribution = [
    { name: 'Delivered', value: 42, color: '#10b981' },
    { name: 'Pending', value: 28, color: '#f59e0b' },
    { name: 'In Transit', value: 18, color: '#6366f1' },
    { name: 'Delayed', value: 5, color: '#ef4444' },
  ];

  const cardBg = darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-100 text-gray-800';
  const subText = darkMode ? 'text-slate-400' : 'text-gray-500';
  const axisColor = darkMode ? '#94a3b8' : '#64748b';
  const gridColor = darkMode ? '#334155' : '#f1f5f9';

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Analytics & Insights</h2>
        <p className={subText}>Performance metrics and operational breakdown.</p>
      </div>

      {/* Top Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Shipments & Revenue Trend */}
        <div className={`lg:col-span-2 p-5 rounded-xl border shadow-sm ${cardBg}`}>
          <h3 className="font-bold mb-1">Shipping Volume & Revenue Trend</h3>
          <p className={`text-xs ${subText} mb-4`}>Monthly volume over the past 6 months</p>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyVolumeData}>
                <defs>
                  <linearGradient id="colorShipments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" stroke={axisColor} fontSize={12} />
                <YAxis stroke={axisColor} fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff', 
                    borderColor: darkMode ? '#334155' : '#e2e8f0',
                    borderRadius: '8px',
                    color: darkMode ? '#ffffff' : '#000000'
                  }} 
                />
                <Area type="monotone" dataKey="shipments" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorShipments)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown Pie Chart */}
        <div className={`p-5 rounded-xl border shadow-sm ${cardBg}`}>
          <h3 className="font-bold mb-1">Status Breakdown</h3>
          <p className={`text-xs ${subText} mb-4`}>Current distribution of all packages</p>
          
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff', 
                    borderColor: darkMode ? '#334155' : '#e2e8f0',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            {statusDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className={subText}>{item.name}:</span>
                <span className="font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar Chart */}
      <div className={`p-5 rounded-xl border shadow-sm ${cardBg}`}>
        <h3 className="font-bold mb-1">Monthly Revenue ($)</h3>
        <p className={`text-xs ${subText} mb-4`}>Gross income generated per month</p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyVolumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" stroke={axisColor} fontSize={12} />
              <YAxis stroke={axisColor} fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#0f172a' : '#ffffff', 
                  borderColor: darkMode ? '#334155' : '#e2e8f0',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}