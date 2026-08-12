import React from 'react';
import { Plus, Bell, Search, Home, UserCheck, Mail } from 'lucide-react';
import { useGlobalContext } from '../../context/GlobalContext';

export default function AdminHeader({ activeTab, notifications = [], onNotificationSelect, onAddPropertyClick }) {
  const { currentUser } = useGlobalContext();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const dropdownRef = React.useRef(null);

  const titles = {
    overview: { title: "Dashboard Overview", subtitle: "Welcome back to the TerraNova Command Center" },
    listings: { title: "Properties Portfolio", subtitle: "Create, edit, duplicate and publish luxury property listings" },
    categories: { title: "Property Categories", subtitle: "Organize luxury listings into collections" },
    messages: { title: "Client Enquiries", subtitle: "Private brokerage enquiries and consultation requests" },
    settings: { title: "System Settings", subtitle: "Configure currency, phone lines, and security passwords" },
    profile: { title: "Broker Profile Settings", subtitle: "Configure your personal session details and avatar" },
    users: { title: "Registered Users", subtitle: "Manage registered user accounts and portal access" }
  };

  const headerInfo = titles[activeTab] || titles.overview;
  const unreadCount = notifications.filter(n => !n.read).length;

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Just now';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleItemClick = (notif) => {
    setShowDropdown(false);
    if (onNotificationSelect) {
      onNotificationSelect(notif);
    }
  };

  return (
    <div className="space-y-6 mb-8 font-sans">
      {/* Pro Horizontal Top Admin Navbar */}
      <div className="bg-white border-b border-accent-gold/15 h-20 px-6 md:px-8 flex justify-between items-center rounded-b-[18px] shadow-sm -mt-10 -mx-6 lg:-mx-12">
        {/* Left Side: Search Bar & Toggle */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative w-full hidden md:block">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-laurel" />
            <input
              type="text"
              placeholder="Search global dashboard..."
              className="bg-bg-cream/50 border border-neutral-laurel/10 rounded-[12px] text-xs pl-10 pr-4 py-2.5 w-full focus:outline-none focus:ring-1 focus:ring-accent-gold/40 text-primary"
            />
          </div>
        </div>

        {/* Right Side: Quick Action, Notifications, Profile */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Quick Action Button */}
          {(activeTab === 'overview' || activeTab === 'listings') && (
            <button
              onClick={onAddPropertyClick}
              className="btn-primary text-[10px] md:text-xs py-2 px-3 md:py-2.5 md:px-5 tracking-widest uppercase font-semibold flex items-center gap-1 cursor-pointer"
              id="admin-add-listing"
            >
              <Plus className="w-3.5 h-3.5 text-accent-gold" /> 
              <span className="hidden sm:inline">Add Property</span>
            </button>
          )}

          {/* Notification Icon & Dropdown Container */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-bg-cream/45 hover:bg-bg-cream border border-neutral-laurel/10 p-2.5 rounded-full hover:border-accent-gold/30 transition cursor-pointer flex items-center justify-center text-primary relative"
              id="admin-notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-gold text-primary text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {showDropdown && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-accent-gold/20 rounded-[18px] shadow-luxury z-50 overflow-hidden font-sans">
                <div className="p-4 border-b border-accent-gold/10 flex justify-between items-center bg-bg-cream/40">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-widest">Notifications</h3>
                  <span className="text-[10px] bg-accent-gold/20 text-primary px-2 py-0.5 rounded-full font-bold">
                    {unreadCount} New
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-neutral-laurel/10">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-neutral-laurel">
                      No notifications available
                    </div>
                  ) : (
                    notifications.map((n) => {
                      const Icon = n.type === 'property' ? Home : n.type === 'user' ? UserCheck : Mail;
                      return (
                        <div
                          key={n.id}
                          onClick={() => handleItemClick(n)}
                          className={`p-4 flex gap-3 cursor-pointer hover:bg-bg-cream/40 transition-colors text-left items-start ${
                            !n.read ? 'bg-accent-gold/5' : ''
                          }`}
                        >
                          <div className={`p-1.5 rounded-full shrink-0 mt-0.5 ${!n.read ? 'bg-accent-gold/25' : 'bg-bg-cream'}`}>
                            <Icon className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <p className="text-xs font-bold text-primary truncate mr-2">{n.title}</p>
                              {!n.read && (
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-gold shrink-0 animate-pulse" />
                              )}
                            </div>
                            <p className="text-[11px] text-neutral-laurel leading-normal mt-0.5 line-clamp-2">
                              {n.message}
                            </p>
                            <p className="text-[9px] text-neutral-laurel/75 font-semibold mt-1">
                              {formatTimeAgo(n.created_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Area */}
          <div className="flex items-center gap-3 border-l border-neutral-laurel/20 pl-4 md:pl-6">
            <div className="w-9 h-9 rounded-full bg-primary text-bg-cream font-display font-bold text-xs flex items-center justify-center border border-accent-gold/30 shadow-sm">
              {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase() : (currentUser?.email ? currentUser.email[0].toUpperCase() : 'U')}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-primary leading-none">{currentUser?.name || currentUser?.email || 'User'}</p>
              <p className="text-[9px] uppercase tracking-wider text-neutral-laurel font-bold mt-0.5">Admin Broker</p>
            </div>
          </div>
        </div>
      </div>

      {/* Page Title & Subtitle Section */}
      <div className="pt-2 animate-fade-in">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary" id="admin-page-title">
          {headerInfo.title}
        </h1>
        <p className="text-neutral-laurel text-xs tracking-wider mt-1" id="admin-page-subtitle">
          {headerInfo.subtitle}
        </p>
      </div>
    </div>
  );
}
