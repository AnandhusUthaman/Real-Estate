import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Building,
  Tags,
  Mail,
  Settings,
  User,
  LogOut,
  Compass,
  Menu,
  X
} from 'lucide-react';

export default function AdminSidebar({ activeTab, onTabChange, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'listings', label: 'Properties', icon: Building },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'messages', label: 'Property Inquiries', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden w-full bg-primary border-b border-accent-gold/20 px-6 py-4 flex justify-between items-center fixed top-0 left-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <Compass className="w-6 h-6 text-accent-gold" />
          <span className="font-display text-lg font-bold text-bg-cream tracking-widest">
            LUXE<span className="text-accent-gold">ESTATE</span>
          </span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-bg-cream hover:text-accent-gold focus:outline-none p-1"
          aria-label="Toggle admin sidebar"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-primary border-r border-accent-gold/15 text-bg-cream flex flex-col justify-between p-6 z-40 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0 pt-24' : '-translate-x-full lg:pt-8'
        }`}
      >
        <div>
          {/* Logo - Desktop only */}
          <div className="hidden lg:flex items-center gap-2 mb-10 px-2">
            <Compass className="w-8 h-8 text-accent-gold" />
            <span className="font-display text-xl font-bold tracking-widest text-bg-cream">
              LUXE<span className="text-accent-gold">ESTATE</span>
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-button text-xs uppercase tracking-widest font-sans font-semibold transition-all ${
                    isActive
                      ? 'bg-accent-gold text-primary shadow-md'
                      : 'text-neutral-laurel hover:text-bg-cream hover:bg-secondary/15'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary' : 'text-accent-gold'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Area with Logout */}
        <div className="border-t border-accent-gold/15 pt-4">
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-button text-xs uppercase tracking-widest font-sans font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0 text-red-400" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
    </>
  );
}
