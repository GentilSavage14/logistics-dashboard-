import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function App() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    id: '',
    item: '',
    origin: '',
    destination: '',
    handler: ''
  });

  useEffect(() => {
    fetchShipments();
  }, []);

  // 1. Fetch all shipments
  async function fetchShipments() {
    setLoading(true);
    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shipments:', error);
    } else {
      setShipments(data || []);
    }
    setLoading(false);
  }

  // 2. Add shipment with validation
  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.id.trim() || !form.item.trim()) {
      return alert('Validation Error: Shipment ID and Item Description are required!');
    }

    // Check for duplicate ID
    const exists = shipments.some(
      (s) => s.id.toLowerCase() === form.id.trim().toLowerCase()
    );
    if (exists) {
      return alert(`Validation Error: A shipment with ID "${form.id}" already exists.`);
    }

    const { error } = await supabase.from('shipments').insert([
      {
        id: form.id.trim(),
        item: form.item.trim(),
        origin: form.origin.trim(),
        destination: form.destination.trim(),
        handler: form.handler.trim(),
        status: 'Pending Pickup'
      }
    ]);

    if (error) {
      alert('Error saving shipment: ' + error.message);
    } else {
      setForm({ id: '', item: '', origin: '', destination: '', handler: '' });
      fetchShipments();
    }
  }

  // 3. Update status
  async function handleStatusChange(id, newStatus) {
    const { error } = await supabase
      .from('shipments')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('Error updating status: ' + error.message);
    } else {
      fetchShipments();
    }
  }

  // 4. Delete shipment
  async function handleDelete(id) {
    if (!window.confirm(`Are you sure you want to delete shipment ${id}?`)) return;

    const { error } = await supabase
      .from('shipments')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error deleting shipment: ' + error.message);
    } else {
      fetchShipments();
    }
  }

  // 5. Export to CSV
  function exportToCSV() {
    if (shipments.length === 0) return alert('No data available to export.');

    const headers = ['ID', 'Item', 'Origin', 'Destination', 'Handler', 'Status'];
    const rows = shipments.map((s) => [
      s.id,
      `"${s.item || ''}"`,
      `"${s.origin || ''}"`,
      `"${s.destination || ''}"`,
      `"${s.handler || ''}"`,
      s.status
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shipments_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Calculated Stats
  const totalCount = shipments.length;
  const pendingCount = shipments.filter((s) => s.status === 'Pending Pickup').length;
  const transitCount = shipments.filter((s) => s.status === 'In Transit' || s.status === 'Out for Delivery').length;
  const deliveredCount = shipments.filter((s) => s.status === 'Delivered').length;

  // Filtered shipments array
  const filteredShipments = shipments.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.id?.toLowerCase().includes(q) ||
      s.item?.toLowerCase().includes(q) ||
      s.origin?.toLowerCase().includes(q) ||
      s.destination?.toLowerCase().includes(q) ||
      s.handler?.toLowerCase().includes(q) ||
      s.status?.toLowerCase().includes(q)
    );
  });

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>📦 Logistics Management Dashboard</h1>
        <p style={styles.subtitle}>Real-time shipment control panel & tracking system</p>
      </header>

      {/* Summary KPI Metric Cards */}
      <div style={styles.metricsGrid}>
        <div style={styles.metricCard}>
          <span style={styles.metricLabel}>Total Shipments</span>
          <span style={{ ...styles.metricValue, color: '#6366f1' }}>{totalCount}</span>
        </div>
        <div style={styles.metricCard}>
          <span style={styles.metricLabel}>Pending Pickup</span>
          <span style={{ ...styles.metricValue, color: '#f59e0b' }}>{pendingCount}</span>
        </div>
        <div style={styles.metricCard}>
          <span style={styles.metricLabel}>In Transit / Active</span>
          <span style={{ ...styles.metricValue, color: '#38bdf8' }}>{transitCount}</span>
        </div>
        <div style={styles.metricCard}>
          <span style={styles.metricLabel}>Delivered</span>
          <span style={{ ...styles.metricValue, color: '#10b981' }}>{deliveredCount}</span>
        </div>
      </div>

      {/* Add Shipment Form */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Register New Shipment</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Shipment ID * (e.g. SHP-103)"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
          />
          <input
            style={styles.input}
            placeholder="Item Description *"
            value={form.item}
            onChange={(e) => setForm({ ...form, item: e.target.value })}
          />
          <input
            style={styles.input}
            placeholder="Origin"
            value={form.origin}
            onChange={(e) => setForm({ ...form, origin: e.target.value })}
          />
          <input
            style={styles.input}
            placeholder="Destination"
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
          />
          <input
            style={styles.input}
            placeholder="Handler Name"
            value={form.handler}
            onChange={(e) => setForm({ ...form, handler: e.target.value })}
          />
          <button type="submit" style={styles.submitBtn}>
            + Add Shipment
          </button>
        </form>
      </div>

      {/* Controls: Search & Export */}
      <div style={styles.controlsRow}>
        <input
          style={styles.searchInput}
          placeholder="🔍 Search shipments by ID, Item, Location, or Handler..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={exportToCSV} style={styles.exportBtn}>
          📥 Export CSV
        </button>
      </div>

      {/* Data Table */}
      <div style={styles.card}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading live database records...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Item</th>
                  <th style={styles.th}>Origin</th>
                  <th style={styles.th}>Destination</th>
                  <th style={styles.th}>Handler</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={styles.noData}>
                      {search ? 'No matching shipments found.' : 'No shipments found. Add one above!'}
                    </td>
                  </tr>
                ) : (
                  filteredShipments.map((s) => (
                    <tr key={s.id} style={styles.tableRow}>
                      <td style={{ ...styles.td, fontWeight: '700', color: '#818cf8' }}>{s.id}</td>
                      <td style={styles.td}>{s.item}</td>
                      <td style={styles.td}>{s.origin || '—'}</td>
                      <td style={styles.td}>{s.destination || '—'}</td>
                      <td style={styles.td}>{s.handler || '—'}</td>
                      <td style={styles.td}>
                        <select
                          value={s.status}
                          onChange={(e) => handleStatusChange(s.id, e.target.value)}
                          style={styles.statusSelect}
                        >
                          <option value="Pending Pickup">Pending Pickup</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                      <td style={styles.td}>
                        <button onClick={() => handleDelete(s.id)} style={styles.deleteBtn}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Inline Styles Object
const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '30px 20px',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    color: '#f3f4f6',
    backgroundColor: '#0f172a',
    minHeight: '100vh',
  },
  header: {
    marginBottom: '24px',
    textAlign: 'center',
  },
  title: {
    margin: '0 0 6px 0',
    fontSize: '2rem',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    margin: 0,
    color: '#94a3b8',
    fontSize: '0.95rem',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  metricCard: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '16px 20px',
    border: '1px solid #334155',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  metricLabel: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },
  metricValue: {
    fontSize: '1.8rem',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
    border: '1px solid #334155',
  },
  cardTitle: {
    margin: '0 0 16px 0',
    fontSize: '1.1rem',
    color: '#e2e8f0',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '10px',
  },
  input: {
    padding: '10px 14px',
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
  },
  submitBtn: {
    backgroundColor: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 16px',
    fontWeight: '600',
    cursor: 'pointer',
    gridColumn: '1 / -1',
  },
  controlsRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: '1',
    minWidth: '240px',
    padding: '12px 16px',
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
  },
  exportBtn: {
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  tableHeader: {
    borderBottom: '2px solid #334155',
  },
  th: {
    padding: '12px',
    color: '#94a3b8',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableRow: {
    borderBottom: '1px solid #334155',
  },
  td: {
    padding: '14px 12px',
    fontSize: '0.9rem',
  },
  statusSelect: {
    backgroundColor: '#0f172a',
    color: '#38bdf8',
    border: '1px solid #38bdf8',
    borderRadius: '6px',
    padding: '6px 10px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  deleteBtn: {
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  noData: {
    textAlign: 'center',
    padding: '24px',
    color: '#94a3b8',
  },
};