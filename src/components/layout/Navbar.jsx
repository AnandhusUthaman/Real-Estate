import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../context/GlobalContext';
import { Menu, X, Compass, User, Heart } from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout, favorites } = useGlobalContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  // Toggle navigation transparency on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Block body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key press to close menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Properties", path: "/properties" },
    { label: "About", path: "/about" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" }
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled || !isHome
        ? 'bg-primary/80 backdrop-blur-lg border-b border-accent-gold/15 py-4 shadow-luxury'
        : 'bg-white/5 backdrop-blur-[8px] border-b border-white/10 py-6'
    }`}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <Compass className="w-8 h-8 text-accent-gold group-hover:rotate-45 transition-transform duration-500" />
          <span className="font-display text-2xl font-bold tracking-widest text-bg-cream">
            TERRA<span className="text-accent-gold">NOVA</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`font-sans text-sm tracking-widest uppercase transition-colors duration-300 relative nav-underline-anim ${
                  isActive ? 'text-accent-gold' : 'text-bg-cream/80 hover:text-bg-cream'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Wishlist Link */}
          <Link to="/wishlist" className="relative text-bg-cream hover:text-accent-gold transition-colors duration-300">
            <Heart className="w-5 h-5" />
            {favorites.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent-gold text-primary font-bold text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </Link>

          {currentUser && (
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-bg-cream hover:text-accent-gold transition-colors duration-300"
              >
                <User className="w-5 h-5 text-accent-gold" />
                <span className="text-sm font-sans tracking-wider max-w-[100px] truncate">{currentUser.name}</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="text-xs tracking-wider uppercase font-sans border border-accent-gold/40 text-bg-cream/80 hover:text-bg-cream hover:border-accent-gold px-3 py-1.5 rounded-button transition-all duration-300"
              >
                Logout
              </button>
            </div>
          )}

          <Link
            to="/contact"
            className="bg-primary text-bg-cream hover:bg-accent-gold hover:text-primary font-bold px-6 py-2.5 rounded-[12px] text-xs tracking-widest uppercase transition-all shadow-sm inline-flex items-center justify-center cursor-pointer border border-accent-gold/25"
          >
            Book Consultation
          </Link>
        </div>

        {/* Mobile Hamburger Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-bg-cream hover:text-accent-gold focus:outline-none transition-colors duration-300"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-primary z-[9999] lg:hidden flex flex-col p-6 overflow-y-auto">
          {/* Header inside Mobile Menu */}
          <div className="flex justify-between items-center pb-6 border-b border-accent-gold/15 mb-8 shrink-0">
            {/* Logo */}
            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
              <Compass className="w-8 h-8 text-accent-gold" />
              <span className="font-display text-2xl font-bold tracking-widest text-bg-cream">
                TERRA<span className="text-accent-gold">NOVA</span>
              </span>
            </Link>
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-bg-cream hover:text-accent-gold focus:outline-none transition-colors duration-300 p-2"
              aria-label="Close navigation menu"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`font-display text-2xl tracking-wider py-4 px-2 border-b border-white/5 flex justify-between items-center transition-all ${
                    isActive ? 'text-accent-gold font-bold bg-white/5' : 'text-bg-cream/90 hover:text-bg-cream hover:bg-white/5'
                  }`}
                  style={{ minHeight: '48px' }}
                >
                  <span>{link.label}</span>
                  {isActive && <div className="w-2 h-2 rounded-full bg-accent-gold" />}
                </Link>
              );
            })}
            <Link
              to="/wishlist"
              onClick={() => setIsOpen(false)}
              className="font-display text-2xl text-bg-cream/90 hover:text-bg-cream py-4 px-2 border-b border-white/5 flex justify-between items-center hover:bg-white/5"
              style={{ minHeight: '48px' }}
            >
              <span>Wishlist ({favorites.length})</span>
              {favorites.length > 0 && (
                <span className="bg-accent-gold text-primary font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
          </div>

          {/* Bottom Actions */}
          <div className="border-t border-accent-gold/15 pt-8 flex flex-col gap-4 mt-auto shrink-0">
            {currentUser ? (
              <div className="flex flex-col gap-4">
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-bg-cream py-3 px-2 rounded-[10px] hover:bg-white/5"
                >
                  <User className="w-6 h-6 text-accent-gold" />
                  <span className="font-sans text-lg">{currentUser.name} (Dashboard)</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                    navigate('/');
                  }}
                  className="btn-secondary w-full py-3.5 text-sm uppercase tracking-wider font-bold"
                  style={{ minHeight: '48px' }}
                >
                  Logout
                </button>
              </div>
            ) : null}

            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="w-full py-4 text-center bg-primary text-bg-cream hover:bg-accent-gold hover:text-primary font-bold text-sm tracking-widest uppercase rounded-[12px] transition-all border border-accent-gold/25 shadow-luxury flex items-center justify-center"
              style={{ minHeight: '48px' }}
            >
              Book Consultation
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
