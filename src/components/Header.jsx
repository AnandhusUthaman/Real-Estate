import React, { useState, useEffect } from 'react';
import { navItems } from '../data/mockData';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    } else if (href === "#hero" || href === "#") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      id="header"
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--bg-light)]/95 backdrop-blur-md shadow-md py-2 border-b border-gray-200/50'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container flex items-center justify-between py-1 transition-all duration-300">
        <a
          href="#"
          onClick={(e) => handleNavClick(e, "#hero")}
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight cursor-pointer group text-[var(--primary)]"
        >
          <img src="/logo.svg" alt="HomeVerse Logo" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
          <span>Home<span className="text-[var(--secondary)]">Verse</span></span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="nav-link text-sm font-semibold flex items-center gap-1 hover:text-[var(--primary)] relative py-1"
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
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-2xl p-2 text-[var(--primary)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
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
            <span className="text-xl font-bold text-[var(--primary)]">Home<span className="text-[var(--secondary)]">Verse</span></span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl p-2 text-[var(--primary)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
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
                  className="text-lg font-medium block py-2 border-b border-gray-100 hover:text-[var(--primary)] hover:pl-2 transition-all duration-300"
                >
                  {item.icon && <i className={`fas ${item.icon} mr-2`}></i>}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
