import React from 'react';

export default function AdminHeader({ activeTab, onAddPropertyClick, onNotificationClick }) {
  const titles = {
    overview: { title: "Dashboard Overview", subtitle: "Welcome back, Admin!" },
    listings: { title: "Manage Listings", subtitle: "All properties at a glance" },
    users: { title: "User Management", subtitle: "Registered platform users" },
    messages: { title: "Messages", subtitle: "Incoming inquiries and support" },
    settings: { title: "Settings", subtitle: "Configure your platform" }
  };

  const headerInfo = titles[activeTab] || titles.overview;

  return (
    <div class="admin-header flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-[var(--text-dark)]" id="admin-page-title">
          {headerInfo.title}
        </h1>
        <p class="text-[var(--text-muted)] text-sm" id="admin-page-subtitle">
          {headerInfo.subtitle}
        </p>
      </div>
      <div class="flex items-center gap-3">
        {(activeTab === 'overview' || activeTab === 'listings') && (
          <button
            onClick={onAddPropertyClick}
            class="btn-primary text-sm py-2 px-5"
            id="admin-add-listing"
          >
            <i class="fas fa-plus"></i> Add Property
          </button>
        )}
        <button
          onClick={onNotificationClick}
          class="bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition cursor-pointer flex items-center justify-center text-gray-700"
          id="admin-notifications"
          aria-label="Notifications"
        >
          <i class="fas fa-bell"></i>
        </button>
      </div>
    </div>
  );
}
