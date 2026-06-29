import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin } from 'lucide-react';
import { useGlobalContext } from '../../context/GlobalContext';

export default function Footer() {
  const { showToast } = useGlobalContext();

  const handleSubscribe = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email) {
      showToast('Thank you for subscribing to our private catalog.', 'success');
      e.target.reset();
    }
  };

  return (
    <footer className="bg-primary text-bg-cream pt-20 pb-10 border-t border-accent-gold/20">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand & Narrative */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2">
            <Compass className="w-8 h-8 text-accent-gold" />
            <span className="font-display text-2xl font-bold tracking-widest text-bg-cream">
              TERRA<span className="text-accent-gold">NOVA</span>
            </span>
          </Link>
          <p className="font-sans text-sm text-neutral-laurel leading-relaxed">
            TerraNova Real Estate is a trusted real estate agency based in Thiruvananthapuram, Kerala, specializing in buying and selling land, residential properties, and commercial spaces. We are committed to helping clients find the right property with transparency, integrity, and personalized service.
          </p>
          {/* Social Icons */}
          <div className="flex gap-4">
            {[
              { icon: 'fa-instagram', label: 'Instagram' },
              { icon: 'fa-facebook-f', label: 'Facebook' },
              { icon: 'fa-linkedin-in', label: 'LinkedIn' },
              { icon: 'fa-x-twitter', label: 'Twitter' }
            ].map((social, idx) => (
              <a
                key={idx}
                href="#"
                onClick={(e) => { e.preventDefault(); showToast(`Redirecting to ${social.label}...`, 'info'); }}
                className="w-10 h-10 rounded-full border border-accent-gold/25 flex items-center justify-center text-bg-cream hover:text-accent-gold hover:border-accent-gold transition-all duration-300"
                aria-label={`Visit our ${social.label}`}
              >
                <i className={`fa-brands ${social.icon} text-sm`} />
              </a>
            ))}
          </div>
        </div>

        {/* Portfolio Quick Links */}
        <div>
          <h4 className="font-display text-lg font-bold text-accent-gold uppercase tracking-wider mb-6">Quick Links</h4>
          <ul className="space-y-3 font-sans text-sm text-neutral-laurel">
            <li>
              <Link to="/properties" className="hover:text-bg-cream transition-colors duration-300">Browse Properties</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-bg-cream transition-colors duration-300">About Our Brand</Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-bg-cream transition-colors duration-300">Real Estate Insights</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-bg-cream transition-colors duration-300">Book Private Viewing</Link>
            </li>
          </ul>
        </div>

        {/* Global Offices */}
        <div>
          <h4 className="font-display text-lg font-bold text-accent-gold uppercase tracking-wider mb-6">Contact Us</h4>
          <ul className="space-y-4 font-sans text-sm text-neutral-laurel">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
              <span>Thiruvananthapuram, Kerala</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-accent-gold shrink-0" />
              <span>8089729949</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-accent-gold shrink-0" />
              <span>terranovarealestateoffice@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4 className="font-display text-lg font-bold text-accent-gold uppercase tracking-wider mb-6">Private Access</h4>
          <p className="font-sans text-sm text-neutral-laurel mb-4 leading-relaxed">
            Subscribe to receive exclusive off-market listings, market briefs, and VIP launches.
          </p>
          <form onSubmit={handleSubscribe} className="space-y-3">
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                placeholder="Enter private email"
                className="bg-secondary/20 border border-accent-gold/20 text-bg-cream placeholder-neutral-laurel/60 w-full px-4 py-3 rounded-[12px] text-sm focus:outline-none focus:border-accent-gold transition-colors duration-300"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-accent-gold text-primary p-1.5 rounded-[8px] hover:bg-accent-gold/90 transition-colors"
                aria-label="Submit newsletter subscription"
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Gold Divider */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="border-t border-accent-gold/20 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-sans text-neutral-laurel/75 gap-4">
          <p>© {new Date().getFullYear()} TerraNova. All Rights Reserved. Private Concierge Brokerage.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-bg-cream transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-bg-cream transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-bg-cream transition-colors">Brokerage Disclosure</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
