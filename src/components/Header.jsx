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
    <header id="header" class="fixed top-0 left-0 w-full z-30 glass border-b border-gray-100">
      <div class="container flex items-center justify-between h-18 py-3">
        <a href="#" onClick={(e) => handleNavClick(e, "#hero")} class="flex items-center gap-2 text-2xl font-extrabold tracking-tight cursor-pointer">
          <i class="fas fa-home text-[var(--primary)] text-2xl"></i>
          Home<span class="text-[var(--primary)]">Verse</span>
        </a>
        <nav class="hidden md:flex items-center gap-8">
          <ul class="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  class="nav-link text-sm font-semibold flex items-center gap-1"
                >
                  {item.icon && <i class={`fas ${item.icon} text-xs`}></i>}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div class="flex items-center gap-4">
          <button
            onClick={onAddListingClick}
            class="btn-primary text-sm py-2.5 px-6 hidden sm:flex"
          >
            <i class="fas fa-plus"></i> Add Listing
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            class="md:hidden text-2xl p-2"
            aria-label="Open menu"
          >
            <i class="fas fa-bars"></i>
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div class={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div class="mobile-menu-inner">
          <div class="flex items-center justify-between mb-8">
            <span class="text-xl font-bold">HomeVerse</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              class="text-2xl p-2"
              aria-label="Close menu"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <ul class="flex flex-col gap-4">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  class="text-lg font-medium block py-2 border-b border-gray-100 hover:text-[var(--primary)]"
                >
                  {item.icon && <i class={`fas ${item.icon} mr-2`}></i>}
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
            class="btn-primary w-full mt-6 text-center"
          >
            <i class="fas fa-plus"></i> Add Listing
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onAdminClick();
            }}
            class="btn-secondary w-full mt-3 text-center"
          >
            <i class="fas fa-shield-alt"></i> Admin Panel
          </button>
        </div>
      </div>
    </header>
  );
}
