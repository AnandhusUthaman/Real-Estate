import React from 'react';

export default function AdminOverview({ properties, users, messages, onTabChange, onAddPropertyClick, showToast }) {
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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="admin-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[var(--text-muted)] text-sm">Total Listings</p>
              <p class="text-3xl font-bold mt-1">{totalListings}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-[#2b7a78]/10 flex items-center justify-center text-[var(--primary)] text-xl">
              <i class="fas fa-building"></i>
            </div>
          </div>
        </div>
        <div class="admin-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[var(--text-muted)] text-sm">Active Listings</p>
              <p class="text-3xl font-bold mt-1">{activeListings}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 text-xl">
              <i class="fas fa-check-circle"></i>
            </div>
          </div>
        </div>
        <div class="admin-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[var(--text-muted)] text-sm">Total Users</p>
              <p class="text-3xl font-bold mt-1">{users.length.toLocaleString()}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-xl">
              <i class="fas fa-users"></i>
            </div>
          </div>
        </div>
        <div class="admin-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[var(--text-muted)] text-sm">Unread Messages</p>
              <p class="text-3xl font-bold mt-1">{unreadMessages}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 text-xl">
              <i class="fas fa-envelope"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Listings Table */}
      <div class="admin-card mb-8 overflow-x-auto">
        <div class="flex items-center justify-between mb-4 min-w-[600px]">
          <h3 class="font-bold text-lg">Recent Listings</h3>
          <button
            onClick={() => onTabChange('listings')}
            class="text-sm text-[var(--primary)] font-medium hover:underline cursor-pointer"
          >
            View All →
          </button>
        </div>
        <table class="admin-table min-w-[600px]">
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
                <td class="font-medium text-[var(--text-dark)]">{p.title}</td>
                <td class="text-gray-600">{p.location}</td>
                <td class="text-gray-700 font-semibold">{p.price}</td>
                <td>
                  <span class={`status-badge ${p.type === 'sale' ? 'status-active' : 'status-pending'}`}>
                    {p.status}
                  </span>
                </td>
                <td class="text-gray-500 uppercase text-xs font-semibold">{p.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div class="admin-card">
        <h3 class="font-bold text-lg mb-4">Quick Actions</h3>
        <div class="flex flex-wrap gap-3">
          <button onClick={onAddPropertyClick} class="btn-primary text-sm py-2 px-5">
            <i class="fas fa-plus"></i> Add Property
          </button>
          <button onClick={() => onTabChange('users')} class="btn-secondary text-sm py-2 px-5">
            <i class="fas fa-users"></i> Manage Users
          </button>
          <button onClick={handleExport} class="btn-secondary text-sm py-2 px-5">
            <i class="fas fa-download"></i> Export Report
          </button>
        </div>
      </div>
    </div>
  );
}
