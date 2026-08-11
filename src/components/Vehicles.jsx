import React, { useState } from 'react';
import { Truck, Plus, CheckCircle, Wrench, AlertTriangle } from 'lucide-react';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([
    { id: 'TRK-01', model: 'Volvo FH16', driver: 'John Doe', status: 'Active', type: 'Semi-Truck' },
    { id: 'VAN-02', model: 'Mercedes Sprinter', driver: 'Sarah Smith', status: 'Maintenance', type: 'Delivery Van' },
    { id: 'TRK-03', model: 'Scania R500', driver: 'Mike Johnson', status: 'Active', type: 'Semi-Truck' },
  ]);

  const [model, setModel] = useState('');
  const [driver, setDriver] = useState('');
  const [type, setType] = useState('Delivery Van');

  function handleAddVehicle(e) {
    e.preventDefault();
    if (!model || !driver) return;

    const newVehicle = {
      id: `${type === 'Semi-Truck' ? 'TRK' : 'VAN'}-0${vehicles.length + 1}`,
      model,
      driver,
      type,
      status: 'Active',
    };

    setVehicles([newVehicle, ...vehicles]);
    setModel('');
    setDriver('');
  }

  function getStatusBadge(status) {
    switch (status) {
      case 'Active':
        return <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold"><CheckCircle className="w-3 h-3" /> Active</span>;
      case 'Maintenance':
        return <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold"><Wrench className="w-3 h-3" /> Maintenance</span>;
      case 'Out of Service':
        return <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 font-semibold"><AlertTriangle className="w-3 h-3" /> Out of Service</span>;
      default:
        return null;
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Vehicle Form */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-slate-800">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-blue-600" /> Register New Vehicle
        </h2>
        <form onSubmit={handleAddVehicle} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            type="text" 
            placeholder="Vehicle Model (e.g. Ford Transit)" 
            value={model} 
            onChange={e => setModel(e.target.value)}
            className="p-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required 
          />
          <input 
            type="text" 
            placeholder="Assigned Driver Name" 
            value={driver} 
            onChange={e => setDriver(e.target.value)}
            className="p-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required 
          />
          <select 
            value={type} 
            onChange={e => setType(e.target.value)}
            className="p-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Delivery Van">Delivery Van</option>
            <option value="Semi-Truck">Semi-Truck</option>
            <option value="Cargo Truck">Cargo Truck</option>
          </select>
          <button 
            type="submit" 
            className="bg-blue-600 text-white rounded-lg p-2.5 font-medium hover:bg-blue-700 flex items-center justify-center gap-2 text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Vehicle
          </button>
        </form>
      </div>

      {/* Fleet Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-lg font-bold">Fleet Registry</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase border-b">
              <th className="p-4">Vehicle ID</th>
              <th className="p-4">Model</th>
              <th className="p-4">Type</th>
              <th className="p-4">Assigned Driver</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {vehicles.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50">
                <td className="p-4 font-semibold text-slate-900">{v.id}</td>
                <td className="p-4">{v.model}</td>
                <td className="p-4 text-slate-500">{v.type}</td>
                <td className="p-4 font-medium">{v.driver}</td>
                <td className="p-4">{getStatusBadge(v.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}