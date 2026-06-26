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
import ContactModal from './components/ContactModal';


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

// Local server API integration



export default function App() {
  // Routing & Modal States
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [adminTab, setAdminTab] = useState('overview'); // 'overview' | 'listings' | 'users' | 'messages' | 'settings'
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

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

  // Toast State & Helper (declared first so useEffects can use it)
  const [toast, setToast] = useState({ message: '', type: 'success', show: false });

  const showToast = (message, type = 'success') => {
    setToast({ message, type, show: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // Sync state with URL pathname changes (e.g. Back/Forward browser navigation)
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Custom navigate handler
  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Protect /admin route and redirect appropriately
  useEffect(() => {
    const session = localStorage.getItem('hv_session');
    if (currentPath === '/admin' && !session) {
      navigate('/login');
      showToast('Please login to access the admin panel.', 'error');
    } else if (currentPath === '/login' && session) {
      navigate('/admin');
    }
  }, [currentPath]);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch properties
        const resProperties = await fetch('http://localhost:5000/api/properties');
        if (resProperties.ok) {
          const dbProperties = await resProperties.json();
          setProperties(dbProperties);
        }

        // Fetch messages
        const resMessages = await fetch('http://localhost:5000/api/messages');
        if (resMessages.ok) {
          const dbMessages = await resMessages.json();
          setMessages(dbMessages);
        }

        // Fetch users
        const resUsers = await fetch('http://localhost:5000/api/users');
        if (resUsers.ok) {
          const dbUsers = await resUsers.json();
          setUsers(dbUsers);
        }
      } catch (err) {
        console.error('Error fetching data from backend:', err.message);
      }
    };

    fetchData();
  }, []);

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

  // Search Logic
  const handleSearch = async ({ query, type }) => {
    setSearchFilters({ query, type });
    setSearchActive(true);
    showToast(`Searching for "${query || 'all'}" (${type === 'all' ? 'all types' : type})`);

    try {
      const url = new URL('http://localhost:5000/api/properties');
      if (query) url.searchParams.append('query', query);
      if (type && type !== 'all') url.searchParams.append('type', type);

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
      }
    } catch (err) {
      showToast(`Search failed: ${err.message}`, 'error');
    }

    // Smooth scroll to properties section
    setTimeout(() => {
      const el = document.getElementById('properties');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const clearSearch = async () => {
    setSearchFilters({ query: '', type: 'all' });
    setSearchActive(false);

    try {
      const res = await fetch('http://localhost:5000/api/properties');
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
      }
    } catch (err) {
      console.error('Failed to reload properties:', err.message);
    }
  };

  // Message sent callback
  const handleMessageSent = (newMessage) => {
    setMessages((prev) => [newMessage, ...prev]);
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
  const handleAddProperty = async (newProperty) => {
    try {
      const res = await fetch('http://localhost:5000/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProperty)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add property');
      }
      const data = await res.json();
      setProperties((prev) => [data, ...prev]);
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    }
  };

  const handleUpdateProperty = async (updatedProperty) => {
    try {
      const res = await fetch(`http://localhost:5000/api/properties/${updatedProperty.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProperty)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update property');
      }
      const data = await res.json();
      setProperties((prev) =>
        prev.map((p) => (p.id === data.id ? data : p))
      );
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    }
  };

  const handleDeleteProperty = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/properties/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete property');
      }
      setProperties((prev) => prev.filter((p) => p.id !== id));
      setFavorites((prev) => prev.filter((favId) => favId !== id));
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    }
  };

  // Admin Message Interactions
  const handleToggleMessageRead = async (id) => {
    const targetMessage = messages.find((m) => m.id === id);
    if (!targetMessage) return;

    try {
      const res = await fetch(`http://localhost:5000/api/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !targetMessage.read })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update message');
      }
      const data = await res.json();
      setMessages((prev) =>
        prev.map((m) => (m.id === data.id ? data : m))
      );
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    }
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

      {currentPath === '/login' ? (
        <AdminLoginModal
          onLoginSuccess={() => navigate('/admin')}
          showToast={showToast}
          onNavigate={navigate}
        />
      ) : currentPath === '/admin' ? (
        /* Admin Dashboard View */
        <div className="admin-dashboard-layout animate-fade-in visible">
          <AdminSidebar
            activeTab={adminTab}
            onTabChange={(tab) => setAdminTab(tab)}
            onLogout={async () => {
              try {
                await fetch('http://localhost:5000/api/auth/logout', { method: 'POST' });
              } catch (e) {
                console.error(e);
              }
              localStorage.removeItem('hv_session');
              navigate('/login');
              showToast('Logged out successfully');
            }}
          />

          <div className="admin-content animate-fade-up visible">
            <AdminHeader
              activeTab={adminTab}
              onAddPropertyClick={() => {
                setAdminTab('listings');
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
      ) : (
        /* Public Landing Page View */
        <>
          {/* Public Navbar & Header */}
          <Header
            onAddListingClick={() => {
              navigate('/login');
              showToast('Please sign in as admin to add listings.');
            }}
            onAdminClick={() => navigate('/login')}
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
              onContactClick={() => setIsContactModalOpen(true)}
              onBrowseListings={handleBrowseListings}
            />
          </main>

          {/* Footer */}
          <Footer onFooterLinkClick={(label) => showToast(`Footer link "${label}" clicked — demo mode`)} />

          {/* Contact Modal */}
          <ContactModal
            isOpen={isContactModalOpen}
            onClose={() => setIsContactModalOpen(false)}
            showToast={showToast}
            onMessageSent={handleMessageSent}
          />
        </>
      )}
    </div>
  );
}
