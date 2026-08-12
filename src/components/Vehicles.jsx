import React, { useState } from 'react';
import { Truck, User, CheckCircle2, AlertTriangle, Wrench } from 'lucide-react';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([
    { id: 'TRK-01', model: 'Volvo FH16', driver: 'John Doe', status: 'Active', fuel: '85%' },
    { id: 'TRK-02', model: 'Freightliner Cascadia', driver: 'Sarah Smith', status: 'In Transit', fuel: '60%' },
    { id: 'TRK-03', model: 'Isuzu NPR', driver: 'Mike Johnson', status: 'Maintenance', fuel: '20%' },
    { id: 'TRK-04', model: 'Kenworth T680', driver: 'Alex Brown', status: 'Available', fuel: '100%' },
  ]);

  const [formData, setFormData] = useState({
    id: '',
    model: '',
    driver: '',
    status: 'Available'
  });

  const activeVehicles = vehicles.filter(v => v.status === 'Active' || v.status === 'In Transit').length;
  const inMaintenance = vehicles.filter(v => v.status === 'Maintenance').length;

  const handleAddVehicle = (e) => {
    e.preventDefault();
    if (!formData.id || !formData.model) return;

    const newVehicle = {
      ...formData,
      fuel: '100%'
    };

    setVehicles([newVehicle, ...vehicles]);
    setFormData({ id: '', model: '', driver: '', status: 'Available' });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
      case 'In Transit':
        return 'bg-emerald-100 text-emerald-700';
      case 'Available':
        return 'bg-blue-100 text-blue-700';
      case 'Maintenance':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Fleet & Vehicles</h2>
        <p className="text-gray-500">Monitor active trucks, drivers, and maintenance health.</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Total Fleet</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{vehicles.length} Units</h3>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">On the Road</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{activeVehicles} Active</h3>
          </div>
          <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">In Maintenance</p>
            <h3 className="text-2xl font-bold text-rose-600 mt-1">{inMaintenance} Units</h3>
          </div>
          <div className="p-3 bg-rose-100 rounded-lg text-rose-600">
            <Wrench className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicles Table */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Fleet Roster</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-500">
                  <th className="p-3">Vehicle ID</th>
                  <th className="p-3">Model</th>
                  <th className="p-3">Assigned Driver</th>
                  <th className="p-3">Fuel Level</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold text-gray-800">{v.id}</td>
                    <td className="p-3 text-gray-600">{v.model}</td>
                    <td className="p-3 text-gray-600 flex items-center gap-1.5 mt-1">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      {v.driver || 'Unassigned'}
                    </td>
                    <td className="p-3 font-medium text-gray-700">{v.fuel}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadge(v.status)}`}>
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Vehicle Form */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Add Fleet Unit</h3>
          <form onSubmit={handleAddVehicle} className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase">Vehicle ID</label>
              <input
                type="text"
                placeholder="e.g. TRK-05"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full p-2 border rounded-lg text-sm mt-1"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase">Model</label>
              <input
                type="text"
                placeholder="e.g. Volvo FH16"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full p-2 border rounded-lg text-sm mt-1"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase">Driver Name</label>
              <input
                type="text"
                placeholder="e.g. Sam Wilson"
                value={formData.driver}
                onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                className="w-full p-2 border rounded-lg text-sm mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2 border rounded-lg text-sm mt-1"
              >
                <option value="Available">Available</option>
                <option value="Active">Active</option>
                <option value="In Transit">In Transit</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition mt-2"
            >
              Add Vehicle
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}