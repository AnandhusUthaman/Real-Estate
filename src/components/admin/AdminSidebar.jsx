import React from 'react';

export default function AdminSidebar({ activeTab, onTabChange, onLogout }) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'fa-chart-pie' },
    { id: 'listings', label: 'Listings', icon: 'fa-building' },
    { id: 'users', label: 'Users', icon: 'fa-users' },
    { id: 'messages', label: 'Messages', icon: 'fa-envelope' },
    { id: 'settings', label: 'Settings', icon: 'fa-cog' }
  ];

  return (
    <div class="admin-sidebar" id="admin-sidebar">
      <div class="logo flex items-center gap-2 text-xl font-bold">
        <i class="fas fa-home text-[var(--primary)]"></i>
        <span>Home<span class="text-[var(--primary)]">Verse</span></span>
      </div>
      <nav class="flex flex-col h-full justify-between pb-12">
        <div class="flex flex-col gap-1">
          {tabs.map((tab) => (
            <a
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              class={activeTab === tab.id ? 'active' : ''}
            >
              <i class={`fas ${tab.icon}`}></i>
              <span>{tab.label}</span>
            </a>
          ))}
        </div>
        <div>
          <a
            onClick={onLogout}
            class="border-t border-white/10 pt-4 hover:text-red-400"
          >
            <i class="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
