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

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Properties", path: "/properties" },
    { label: "Agents", path: "/agents" },
    { label: "About", path: "/about" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" }
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      isScrolled || !isHome
        ? 'bg-primary py-4 shadow-luxury'
        : 'bg-gradient-to-b from-primary/80 to-transparent py-6'
    }`}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <Compass className="w-8 h-8 text-accent-gold group-hover:rotate-45 transition-transform duration-500" />
          <span className="font-display text-2xl font-bold tracking-widest text-bg-cream">
            LUXE<span className="text-accent-gold">ESTATE</span>
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

          {currentUser ? (
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
          ) : (
            <Link
              to="/login"
              className="text-bg-cream hover:text-accent-gold font-sans text-sm tracking-wider flex items-center gap-1 transition-colors duration-300"
            >
              <User className="w-4 h-4" /> Sign In
            </Link>
          )}

          <Link
            to="/contact"
            className="btn-accent px-6 py-2.5 text-xs tracking-widest uppercase font-medium"
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
        <div className="fixed inset-0 top-[70px] bg-primary z-40 lg:hidden flex flex-col px-6 py-10 transition-all duration-300">
          <div className="flex flex-col gap-6 mb-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`font-display text-2xl tracking-wider ${
                    isActive ? 'text-accent-gold' : 'text-bg-cream'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/wishlist"
              onClick={() => setIsOpen(false)}
              className="font-display text-2xl text-bg-cream flex items-center gap-3"
            >
              Wishlist ({favorites.length})
            </Link>
          </div>

          <div className="border-t border-accent-gold/20 pt-8 flex flex-col gap-4 mt-auto">
            {currentUser ? (
              <div className="flex flex-col gap-4">
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-bg-cream"
                >
                  <User className="w-5 h-5 text-accent-gold" />
                  <span className="font-sans text-lg">{currentUser.name} (Dashboard)</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                    navigate('/');
                  }}
                  className="btn-secondary w-full py-3"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="btn-secondary w-full py-3 text-center"
              >
                Sign In
              </Link>
            )}

            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="btn-primary w-full py-3 text-center bg-accent-gold text-primary font-bold tracking-wider hover:bg-accent-gold/90"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
