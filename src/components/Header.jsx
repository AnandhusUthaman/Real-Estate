import React, { useState } from 'react';
import { navItems } from '../data/mockData';

export default function Header({ onAddListingClick, onAdminClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (href === "#admin") {
      onAdminClick();
      return;
    }

    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    } else if (href === "#hero" || href === "#") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header id="header" className="fixed top-0 left-0 w-full z-30 glass border-b border-gray-100">
      <div className="container flex items-center justify-between h-18 py-3">
        <a href="#" onClick={(e) => handleNavClick(e, "#hero")} className="flex items-center gap-2 text-2xl font-extrabold tracking-tight cursor-pointer">
          <i className="fas fa-home text-[var(--primary)] text-2xl"></i>
          Home<span className="text-[var(--primary)]">Verse</span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="nav-link text-sm font-semibold flex items-center gap-1"
                >
                  {item.icon && <i className={`fas ${item.icon} text-xs`}></i>}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <button
            onClick={onAddListingClick}
            className="btn-primary text-sm py-2.5 px-6 hidden sm:flex"
          >
            <i className="fas fa-plus"></i> Add Listing
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-2xl p-2"
            aria-label="Open menu"
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-inner">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-bold">HomeVerse</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl p-2"
              aria-label="Close menu"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <ul className="flex flex-col gap-4">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-lg font-medium block py-2 border-b border-gray-100 hover:text-[var(--primary)]"
                >
                  {item.icon && <i className={`fas ${item.icon} mr-2`}></i>}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onAddListingClick();
            }}
            className="btn-primary w-full mt-6 text-center"
          >
            <i className="fas fa-plus"></i> Add Listing
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onAdminClick();
            }}
            className="btn-secondary w-full mt-3 text-center"
          >
            <i className="fas fa-shield-alt"></i> Admin Panel
          </button>
        </div>
      </div>
    </header>
  );
}
