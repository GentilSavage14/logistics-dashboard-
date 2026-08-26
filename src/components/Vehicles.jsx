import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Plus, Trash2, MapPin } from 'lucide-react';

// Fix Leaflet default marker icons issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Sample map coordinates for fleet vehicles
const DEFAULT_LOCATIONS = [
  { id: 'TRK-01', lat: 40.7128, lng: -74.0060, locationName: 'New York Hub' },
  { id: 'TRK-02', lat: 34.0522, lng: -118.2437, locationName: 'Los Angeles Terminal' },
  { id: 'TRK-03', lat: 41.8781, lng: -87.6298, locationName: 'Chicago Depot' },
  { id: 'TRK-04', lat: 29.7604, lng: -95.3698, locationName: 'Houston Transit' }
];

export default function Vehicles({ darkMode, isAdmin }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ id: '', driver: '', type: 'Semi Truck', status: 'Available' });
  const [selectedMapCenter, setSelectedMapCenter] = useState([39.8283, -98.5795]); // Center USA

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false });
    if (!error) setVehicles(data || []);
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    const { error } = await supabase.from('vehicles').insert([formData]);
    if (!error) {
      fetchVehicles();
      setFormData({ id: '', driver: '', type: 'Semi Truck', status: 'Available' });
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin || !window.confirm(`Delete vehicle ${id}?`)) return;
    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    if (!error) fetchVehicles();
  };

  const cardBg = darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-100 text-gray-800';
  const subText = darkMode ? 'text-slate-400' : 'text-gray-500';
  const inputBg = darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-gray-200 text-gray-800';

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Fleet Vehicles & Live GPS</h2>
        <p className={subText}>Track transport fleet, driver assignments, and live map positioning.</p>
      </div>

      {/* Interactive Fleet Map */}
      <div className={`p-5 rounded-xl border shadow-sm ${cardBg}`}>
        <h3 className="font-bold mb-2 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-indigo-500" /> Live Fleet Tracking Map
        </h3>
        <p className={`text-xs ${subText} mb-4`}>Real-time location coordinates for active transport units.</p>

        <div className="h-80 w-full rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 z-0 relative">
          <MapContainer center={selectedMapCenter} zoom={4} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={darkMode ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
            />
            {DEFAULT_LOCATIONS.map((loc) => (
              <Marker key={loc.id} position={[loc.lat, loc.lng]}>
                <Popup>
                  <div className="p-1">
                    <strong className="block text-sm">{loc.id}</strong>
                    <span className="text-xs text-gray-600">{loc.locationName}</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Fleet Table and Add Vehicle Form */}
      <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-3' : ''} gap-6`}>
        <div className={`${isAdmin ? 'lg:col-span-2' : 'w-full'} p-5 rounded-xl border shadow-sm ${cardBg}`}>
          <h3 className="font-bold mb-4">Fleet Directory</h3>
          {loading ? (
            <p className={subText}>Loading vehicles...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className={`border-b ${darkMode ? 'bg-slate-700/50 text-slate-300 border-slate-700' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                    <th className="p-3">Vehicle ID</th>
                    <th className="p-3">Driver</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Status</th>
                    {isAdmin && <th className="p-3 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {vehicles.length === 0 ? (
                    <tr><td colSpan={isAdmin ? 5 : 4} className={`p-4 text-center ${subText}`}>No vehicles found.</td></tr>
                  ) : (
                    vehicles.map((v) => (
                      <tr key={v.id} className={`border-b ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                        <td className="p-3 font-semibold">{v.id}</td>
                        <td className="p-3 font-medium">{v.driver}</td>
                        <td className={`p-3 ${subText}`}>{v.type}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${v.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {v.status}
                          </span>
                        </td>
                        {isAdmin && (
                          <td className="p-3 text-right">
                            <button onClick={() => handleDelete(v.id)} className="text-red-600 hover:text-red-700 text-xs">
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
            <h3 className="font-bold mb-4">Add Vehicle</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <input type="text" placeholder="Vehicle ID (e.g. TRK-01)" value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} className={`w-full p-2 border rounded-lg text-sm ${inputBg}`} required />
              <input type="text" placeholder="Assigned Driver" value={formData.driver} onChange={(e) => setFormData({ ...formData, driver: e.target.value })} className={`w-full p-2 border rounded-lg text-sm ${inputBg}`} required />
              <input type="text" placeholder="Vehicle Type (e.g. Cargo Van)" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className={`w-full p-2 border rounded-lg text-sm ${inputBg}`} required />
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={`w-full p-2 border rounded-lg text-sm ${inputBg}`}>
                <option value="Available">Available</option>
                <option value="In Transit">In Transit</option>
                <option value="Maintenance">Maintenance</option>
              </select>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-1">
                <Plus className="w-4 h-4" /> Add Vehicle
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}