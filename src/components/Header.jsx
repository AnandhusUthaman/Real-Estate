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
          ? 'bg-white/80 backdrop-blur-md shadow-sm py-2 border-b border-gray-200/50'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container flex items-center justify-between py-1 transition-all duration-300">
        <a
          href="#"
          onClick={(e) => handleNavClick(e, "#hero")}
          className="flex items-center cursor-pointer group"
        >
          <img
            src="/logo.png"
            alt="Altheia Realty Logo"
            className={`w-auto transition-all duration-300 group-hover:scale-105 ${
              isScrolled ? 'h-20' : 'h-20'
            }`}
          />
        </a>
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`nav-link text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 relative py-2 transition-colors duration-300 ${
                    isScrolled
                      ? 'text-[#334155] hover:text-[var(--primary)]'
                      : 'text-white/90 hover:text-[var(--secondary)]'
                  }`}
                >
                  {item.icon && <i className={`fas ${item.icon} text-[10px] text-[var(--secondary)]`}></i>}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden text-2xl p-2 hover:scale-105 active:scale-95 transition-transform cursor-pointer ${
              isScrolled ? 'text-[var(--primary)]' : 'text-white'
            }`}
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
            <img src="/logo.svg" alt="Altheia Realty Logo" className="h-5 w-auto" />
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
