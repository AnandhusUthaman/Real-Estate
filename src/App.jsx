import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Properties from './components/Properties';
import Features from './components/Features';
import Stats from './components/Stats';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import AdminLoginModal from './components/AdminLoginModal';

// Admin Components
import AdminSidebar from './components/admin/AdminSidebar';
import AdminHeader from './components/admin/AdminHeader';
import AdminOverview from './components/admin/AdminOverview';
import AdminListings from './components/admin/AdminListings';
import AdminUsers from './components/admin/AdminUsers';
import AdminMessages from './components/admin/AdminMessages';
import AdminSettings from './components/admin/AdminSettings';

// Mock Data
import {
  initialProperties,
  initialMessages,
  initialUsers
} from './data/mockData';

export default function App() {
  // Navigation & Modal State
  const [view, setView] = useState('public'); // 'public' | 'admin'
  const [adminTab, setAdminTab] = useState('overview'); // 'overview' | 'listings' | 'users' | 'messages' | 'settings'
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // App Data States (with localStorage recovery)
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('hv_properties');
    return saved ? JSON.parse(saved) : initialProperties;
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('hv_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('hv_messages');
    return saved ? JSON.parse(saved) : initialMessages;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('hv_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  // Toast State
  const [toast, setToast] = useState({ message: '', type: 'success', show: false });

  // Search Filter State
  const [searchFilters, setSearchFilters] = useState({ query: '', type: 'all' });
  const [searchActive, setSearchActive] = useState(false);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('hv_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('hv_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('hv_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('hv_users', JSON.stringify(users));
  }, [users]);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type, show: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // Search Logic
  const handleSearch = ({ query, type }) => {
    setSearchFilters({ query, type });
    setSearchActive(true);
    showToast(`Searching for "${query || 'all'}" (${type === 'all' ? 'all types' : type})`);

    // Smooth scroll to properties section
    setTimeout(() => {
      const el = document.getElementById('properties');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const clearSearch = () => {
    setSearchFilters({ query: '', type: 'all' });
    setSearchActive(false);
  };

  // Toggle Favorite Handler
  const handleToggleFavorite = (id) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        showToast('Removed from wishlist');
        return prev.filter((favId) => favId !== id);
      } else {
        showToast('Added to wishlist! ❤️');
        return [...prev, id];
      }
    });
  };

  // Property Detail Toast Handler
  const handleCardClick = (id) => {
    showToast(`Viewing property #${id} details — demo mode`);
  };

  // Admin Listing CRUD Operations
  const handleAddProperty = (newProperty) => {
    setProperties((prev) => {
      const nextId = prev.length > 0 ? Math.max(...prev.map((p) => p.id)) + 1 : 1;
      return [{ id: nextId, ...newProperty, featured: false }, ...prev];
    });
  };

  const handleUpdateProperty = (updatedProperty) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === updatedProperty.id ? updatedProperty : p))
    );
  };

  const handleDeleteProperty = (id) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    // Clean up favorites if deleted
    setFavorites((prev) => prev.filter((favId) => favId !== id));
  };

  // Admin Message Interactions
  const handleToggleMessageRead = (id) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: !m.read } : m))
    );
  };

  // Scroll to Properties section
  const handleBrowseListings = () => {
    const el = document.getElementById('properties');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Filtered Properties for Landing Page
  const filteredProperties = properties.filter((p) => {
    const matchesQuery =
      p.title.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
      p.location.toLowerCase().includes(searchFilters.query.toLowerCase());
    const matchesType = searchFilters.type === 'all' || p.type === searchFilters.type;
    return matchesQuery && matchesType;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Toast Notification */}
      <div className={`toast ${toast.show ? 'show' : ''}`} id="toast">
        <i className="fas fa-check-circle mr-2 text-green-400"></i>
        <span>{toast.message}</span>
      </div>

      {view === 'public' ? (
        <>
          {/* Public Navbar & Header */}
          <Header
            onAddListingClick={() => showToast('Add listing feature — demo mode. Sign in as admin for full access.')}
            onAdminClick={() => setIsLoginModalOpen(true)}
          />

          {/* Main Public Content */}
          <main>
            <Hero onSearch={handleSearch} />

            <Properties
              properties={searchActive ? filteredProperties : properties}
              searchActive={searchActive}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onCardClick={handleCardClick}
            />

            <Features />
            <Stats />
            <Testimonials />

            <CTA
              onContactClick={() => showToast('Contact form would open — demo mode')}
              onBrowseListings={handleBrowseListings}
            />
          </main>

          {/* Footer */}
          <Footer onFooterLinkClick={(label) => showToast(`Footer link "${label}" clicked — demo mode`)} />

          {/* Admin Login Modal */}
          <AdminLoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLoginSuccess={() => setView('admin')}
            showToast={showToast}
          />
        </>
      ) : (
        /* Admin Dashboard View */
        <div className="admin-dashboard-layout">
          <AdminSidebar
            activeTab={adminTab}
            onTabChange={(tab) => setAdminTab(tab)}
            onLogout={() => {
              setView('public');
              showToast('Logged out successfully');
            }}
          />

          <div className="admin-content">
            <AdminHeader
              activeTab={adminTab}
              onAddPropertyClick={() => {
                setAdminTab('listings');
                // The listings page modal form handles creation
              }}
              onNotificationClick={() => showToast('No new notifications')}
            />

            <div id="admin-dashboard-content">
              {adminTab === 'overview' && (
                <AdminOverview
                  properties={properties}
                  users={users}
                  messages={messages}
                  onTabChange={(tab) => setAdminTab(tab)}
                  onAddPropertyClick={() => setAdminTab('listings')}
                  showToast={showToast}
                />
              )}

              {adminTab === 'listings' && (
                <AdminListings
                  properties={properties}
                  onAddProperty={handleAddProperty}
                  onUpdateProperty={handleUpdateProperty}
                  onDeleteProperty={handleDeleteProperty}
                  showToast={showToast}
                />
              )}

              {adminTab === 'users' && <AdminUsers users={users} />}

              {adminTab === 'messages' && (
                <AdminMessages
                  messages={messages}
                  onToggleRead={handleToggleMessageRead}
                />
              )}

              {adminTab === 'settings' && <AdminSettings showToast={showToast} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
