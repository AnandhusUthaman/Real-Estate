import React from 'react';

export default function AdminSidebar({ activeTab, onTabChange, onLogout }) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'fa-chart-pie' },
    { id: 'listings', label: 'Listings', icon: 'fa-building' },
    { id: 'messages', label: 'Messages', icon: 'fa-envelope' },
    { id: 'settings', label: 'Settings', icon: 'fa-cog' }
  ];

  return (
    <div className="admin-sidebar" id="admin-sidebar">
      <div className="logo flex items-center justify-center">
        <img src="/logo.png" alt="Altheia Realty Logo" className="h-40 w-auto" />
      </div>
      <nav className="flex flex-col h-full justify-between pb-12">
        <div className="flex flex-col gap-1">
          {tabs.map((tab) => (
            <a
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={activeTab === tab.id ? 'active' : ''}
            >
              <i className={`fas ${tab.icon}`}></i>
              <span>{tab.label}</span>
            </a>
          ))}
        </div>
        <div>
          <a
            onClick={onLogout}
            className="border-t border-white/10 pt-4 hover:text-red-400"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
