import React from 'react';

export default function AdminOverview({ properties, messages, onTabChange, onAddPropertyClick, showToast }) {
  const totalListings = properties.length;
  const activeListings = properties.filter(p => p.status.toLowerCase() !== 'sold').length;
  const unreadMessages = messages.filter(m => !m.read).length;

  const recentListings = properties.slice(0, 5);

  const handleExport = () => {
    showToast('Exporting report — demo mode');
  };

  return (
    <div>
      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="admin-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--text-muted)] text-sm">Total Listings</p>
              <p className="text-3xl font-bold mt-1">{totalListings}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] text-xl">
              <i className="fas fa-building"></i>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--text-muted)] text-sm">Active Listings</p>
              <p className="text-3xl font-bold mt-1">{activeListings}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 text-xl">
              <i className="fas fa-check-circle"></i>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--text-muted)] text-sm">Unread Messages</p>
              <p className="text-3xl font-bold mt-1">{unreadMessages}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 text-xl">
              <i className="fas fa-envelope"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Listings Table */}
      <div className="admin-card mb-8 overflow-x-auto">
        <div className="flex items-center justify-between mb-4 min-w-[600px]">
          <h3 className="font-bold text-lg">Recent Listings</h3>
          <button
            onClick={() => onTabChange('listings')}
            className="text-sm text-[var(--primary)] font-medium hover:underline cursor-pointer"
          >
            View All →
          </button>
        </div>
        <table className="admin-table min-w-[600px]">
          <thead>
            <tr>
              <th>Property</th>
              <th>Location</th>
              <th>Price</th>
              <th>Status</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {recentListings.map((p) => (
              <tr key={p.id}>
                <td className="font-medium text-[var(--text-dark)]">{p.title}</td>
                <td className="text-gray-600">{p.location}</td>
                <td className="text-gray-700 font-semibold">{p.price}</td>
                <td>
                  <span className={`status-badge ${p.type === 'sale' ? 'status-active' : 'status-pending'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="text-gray-500 uppercase text-xs font-semibold">{p.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="admin-card">
        <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={onAddPropertyClick} className="btn-primary text-sm py-2 px-5">
            <i className="fas fa-plus"></i> Add Property
          </button>
          <button onClick={handleExport} className="btn-secondary text-sm py-2 px-5">
            <i className="fas fa-download"></i> Export Report
          </button>
        </div>
      </div>
    </div>
  );
}
