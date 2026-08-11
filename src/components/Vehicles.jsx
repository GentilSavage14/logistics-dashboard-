import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    model: '',
    driver: '',
    type: 'Semi-Truck',
    status: 'Active'
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error fetching vehicles:', error);
    else setVehicles(data || []);
    setLoading(false);
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    if (!formData.id || !formData.model || !formData.driver) return;

    const { error } = await supabase.from('vehicles').insert([formData]);

    if (error) {
      alert('Error adding vehicle: ' + error.message);
    } else {
      fetchVehicles();
      setShowModal(false);
      setFormData({
        id: '',
        model: '',
        driver: '',
        type: 'Semi-Truck',
        status: 'Active'
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Fleet Vehicles</h2>
          <p className="text-gray-500">Manage operational trucks and delivery vans</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          + Add Vehicle
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500 text-center py-8">Loading fleet...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <div key={v.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{v.model}</h3>
                  <p className="text-xs text-gray-400">ID: {v.id}</p>
                </div>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                  v.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {v.status}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium text-gray-500">Driver:</span> {v.driver}</p>
                <p><span className="font-medium text-gray-500">Type:</span> {v.type}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add Fleet Vehicle</h3>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <input
                type="text"
                placeholder="Vehicle ID (e.g. TRK-04)"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Vehicle Model (e.g. Volvo FH16)"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Assigned Driver"
                value={formData.driver}
                onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-2 border rounded-lg"
              >
                <option value="Semi-Truck">Semi-Truck</option>
                <option value="Delivery Van">Delivery Van</option>
                <option value="Cargo Truck">Cargo Truck</option>
              </select>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2 border rounded-lg"
              >
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
              </select>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}