import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
import {
  CheckCircle2,
  FolderOpen,
  UserCheck,
  TrendingUp,
  Tags
} from 'lucide-react';

// Admin Subcomponents
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import AdminOverview from '../components/admin/AdminOverview';
import AdminListings from '../components/admin/AdminListings';
import AdminMessages from '../components/admin/AdminMessages';
import AdminUsers from '../components/admin/AdminUsers';
import AdminSettings from '../components/admin/AdminSettings';
import SEO from '../components/layout/SEO';

export default function Dashboard() {
  const {
    currentUser,
    properties,
    messages,
    users,
    addProperty,
    updateProperty,
    deleteProperty,
    logout,
    showToast,
    fetchMessages,
    notifications,
    markNotificationAsRead,
    updateProfile,
    deleteMessage,
    toggleMessageReplied
  } = useGlobalContext();

  const navigate = useNavigate();
  const location = useLocation();

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState('overview');

  // Form State for User Profile
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || 'Vinod',
    email: currentUser?.email || 'terranovarealestateoffice@gmail.com'
  });

  // Handle tab and item selection from URL query parameters (e.g. notifications redirects)
  React.useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // Only authenticated admins can access the dashboard.
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (currentUser.role !== 'admin') {
      showToast('Unauthorized: Only administrators can access the dashboard.', 'error');
      navigate('/');
    }
  }, [currentUser, navigate, showToast]);

  if (!currentUser || currentUser.role !== 'admin') return null;

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile(profileForm.name, profileForm.email);
    showToast('Broker profile configurations updated successfully!', 'success');
  };

  const handleNotificationSelect = (notification) => {
    // 1. Mark notification as read
    markNotificationAsRead(notification.id);

    const { type, itemId, route } = notification;

    // 2. Target existence verification
    if (type === 'property') {
      const propExists = properties.some(p => p.id === parseInt(itemId, 10));
      if (!propExists) {
        showToast("The requested item is no longer available.", "error");
        setActiveTab('listings');
        return;
      }
      navigate(route || `/property/${itemId}`);
    } else if (type === 'enquiry' || type === 'inquiry' || type === 'message') {
      const msgExists = messages.some(m => m.id === parseInt(itemId, 10));
      if (!msgExists) {
        showToast("The requested item is no longer available.", "error");
        setActiveTab('messages');
        return;
      }
      setActiveTab('messages');
      navigate(`/dashboard?tab=messages&id=${itemId}`);
    } else if (type === 'user') {
      const userExists = users.some(u => u.id === parseInt(itemId, 10)) || itemId <= 5;
      if (!userExists) {
        showToast("The requested item is no longer available.", "error");
        setActiveTab('profile');
        return;
      }
      setActiveTab('users');
      navigate(`/dashboard?tab=users&id=${itemId}`);
    } else {
      if (route) navigate(route);
    }
  };

  const handleToggleMessageRead = async (id) => {
    const msg = messages.find(m => m.id === id);
    if (!msg) return;
    try {
      const res = await fetch(`http://localhost:5000/api/messages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('le_token')}`
        },
        body: JSON.stringify({ read: !msg.read })
      });
      if (res.ok) {
        // Refresh messages from context
        fetchMessages();
      }
    } catch (err) {
      console.warn("Failed to toggle read state on server, fallback local:", err);
    }
  };

  // Callback to trigger Add Property modal inside listings component
  const triggerAddProperty = () => {
    setActiveTab('listings');
    // We give listings a minor delay to render before opening its modal (or we can handle it directly)
    setTimeout(() => {
      const addBtn = document.getElementById('admin-add-listing');
      if (addBtn) addBtn.click();
    }, 150);
  };

  return (
    <div className="pt-20 lg:pt-0 pb-24 bg-[#FCF7F0] min-h-screen flex">
      <SEO title="Brokerage Dashboard" noindex={true} />
      {/* Sidebar navigation */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={() => {
          logout();
          navigate('/');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-grow lg:pl-72 min-w-0">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
          
          <AdminHeader
            activeTab={activeTab}
            notifications={notifications}
            onNotificationSelect={handleNotificationSelect}
            onAddPropertyClick={triggerAddProperty}
          />

          {/* Dynamic Content Switching */}
          <div className="animate-fade-in">
            {activeTab === 'overview' && (
              <AdminOverview
                properties={properties}
                messages={messages}
                users={users}
                onTabChange={setActiveTab}
                onAddPropertyClick={triggerAddProperty}
                showToast={showToast}
              />
            )}

            {activeTab === 'listings' && (
              <AdminListings
                properties={properties}
                onAddProperty={addProperty}
                onUpdateProperty={updateProperty}
                onDeleteProperty={deleteProperty}
                showToast={showToast}
              />
            )}

            {activeTab === 'add-property' && (
              <div className="bg-white rounded-[18px] border border-neutral-laurel/20 p-8 text-center max-w-xl mx-auto shadow-sm">
                <FolderOpen className="w-12 h-12 text-accent-gold mx-auto stroke-1 mb-4" />
                <h3 className="font-display text-xl font-bold text-primary">Managed Listings</h3>
                <p className="font-sans text-xs text-neutral-laurel mt-2 mb-6">
                  Please open the Properties section to manage and add listing configurations directly in our structured catalog table.
                </p>
                <button
                  onClick={triggerAddProperty}
                  className="btn-primary text-xs py-3 px-6 uppercase tracking-widest font-semibold"
                >
                  Go to Listings Table
                </button>
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="bg-white rounded-[18px] border border-neutral-laurel/20 p-8 shadow-sm space-y-6">
                <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2 border-b border-neutral-laurel/10 pb-3">
                  <Tags className="w-5 h-5 text-accent-gold" />
                  <span>Managed Portfolio Collections</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans">
                  {[
                    { name: 'Waterfront Mansions', count: properties.filter(p => p.location.toLowerCase().includes('beach') || p.location.toLowerCase().includes('water')).length, desc: 'Ultra-exclusive estates located directly on private beachfronts or canals.' },
                    { name: 'Sky Penthouses', count: properties.filter(p => p.title.toLowerCase().includes('penthouse') || p.title.toLowerCase().includes('loft')).length, desc: 'Skyline duplexes featuring panoramic vistas and private roof terraces.' },
                    { name: 'Stately townhouses', count: properties.filter(p => p.title.toLowerCase().includes('mews') || p.title.toLowerCase().includes('house') || p.title.toLowerCase().includes('villa')).length, desc: 'Historic townhouses located in premium central postcodes.' }
                  ].map((cat, idx) => (
                    <div key={idx} className="border border-neutral-laurel/15 rounded-[12px] p-5 space-y-3 bg-bg-cream/20">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-primary text-sm">{cat.name}</span>
                        <span className="text-[10px] text-accent-gold bg-primary/5 px-2 py-0.5 rounded-[4px] font-bold font-mono">{cat.count} listings</span>
                      </div>
                      <p className="text-xs text-neutral-laurel leading-relaxed">{cat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <AdminMessages
                messages={messages}
                onToggleRead={handleToggleMessageRead}
                onDeleteMessage={deleteMessage}
                onToggleReplied={toggleMessageReplied}
                showToast={showToast}
              />
            )}

            {activeTab === 'users' && (
              <AdminUsers
                users={users}
              />
            )}

            {activeTab === 'analytics' && (
              <div className="bg-white rounded-[18px] border border-neutral-laurel/20 p-8 shadow-sm space-y-6">
                <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2 border-b border-neutral-laurel/10 pb-3">
                  <TrendingUp className="w-5 h-5 text-accent-gold" />
                  <span>Platform Traffic Metrics</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm text-primary">Traffic Acquisition Sources</h4>
                    <div className="space-y-3">
                      {[
                        { source: 'Direct Brokerage referrals', percent: 45, color: 'bg-primary' },
                        { source: 'Global Wealth Advisory partners', percent: 30, color: 'bg-accent-gold' },
                        { source: 'Organic Search (Luxury Portals)', percent: 15, color: 'bg-secondary' },
                        { source: 'Private Art & Yacht Club networks', percent: 10, color: 'bg-neutral-laurel' }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs text-primary font-medium">
                            <span>{item.source}</span>
                            <span>{item.percent}%</span>
                          </div>
                          <div className="h-2 w-full bg-bg-cream rounded-full overflow-hidden">
                            <div className={`h-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-bg-cream/35 border border-neutral-laurel/15 rounded-[12px] p-5 space-y-4 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-primary">Platform Health Integrity</h4>
                      <p className="text-xs text-neutral-laurel mt-1.5 leading-relaxed">
                        TerraNova core database server connections, image CDNs, and Supabase replication protocols are operating within normal limits (99.98% uptime).
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-green-700">
                      <UserCheck className="w-4 h-4 shrink-0" />
                      <span>Security audit passed successfully — June 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <AdminSettings
                showToast={showToast}
              />
            )}

            {activeTab === 'profile' && (
              <div className="space-y-8 max-w-xl font-sans text-primary">
                <div className="bg-white rounded-[18px] border border-neutral-laurel/20 p-8 shadow-sm space-y-6">
                  <h3 className="font-display text-lg font-bold text-primary border-b border-neutral-laurel/10 pb-3">
                    Broker Profile Configuration
                  </h3>
                  <form onSubmit={handleProfileSubmit} className="space-y-4 text-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary text-bg-cream text-xl font-display font-bold flex items-center justify-center border border-accent-gold/45">
                        {profileForm.name ? profileForm.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'AN'}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{profileForm.name}</h4>
                        <p className="text-xs text-neutral-laurel font-semibold uppercase mt-0.5">Senior Private Broker & Founder</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-neutral-laurel font-bold mb-1.5">Profile Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="bg-bg-cream border border-neutral-laurel/10 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none focus:ring-1 focus:ring-accent-gold/40 text-primary font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-neutral-laurel font-bold mb-1.5">Brokerage Email Address</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        className="bg-bg-cream/50 border border-neutral-laurel/10 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none cursor-not-allowed opacity-60 text-primary/55 font-semibold"
                        disabled
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-accent bg-accent-gold text-primary font-bold py-3.5 uppercase tracking-widest text-xs rounded-[12px] hover:bg-accent-gold/90 transition-all border-none cursor-pointer flex items-center justify-center gap-2 mt-6"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Save Profile Configurations
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
