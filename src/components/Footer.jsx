import React from 'react';
import { footerLinks1, footerLinks2, contactInfo } from '../data/mockData';

export default function Footer({ onFooterLinkClick }) {
  const handleLinkClick = (e, label) => {
    e.preventDefault();
    onFooterLinkClick(label);
  };

  return (
    <footer id="footer" className="bg-[#0F172A] text-[#CBD5E1] pt-20 pb-10 border-t border-gray-800">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Altheia Realty Logo" className="h-12 w-auto brightness-0 invert" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed font-light">
              Elevating modern luxury living. We guide sophisticated buyers, sellers, and investors to premier real estate opportunities around the globe.
            </p>
            <div className="flex gap-4 pt-2">
              {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((platform) => {
                const iconMap = {
                  Facebook: 'fab fa-facebook-f',
                  Twitter: 'fab fa-twitter',
                  Instagram: 'fab fa-instagram',
                  LinkedIn: 'fab fa-linkedin-in',
                };
                return (
                  <a
                    key={platform}
                    href="#"
                    onClick={(e) => handleLinkClick(e, platform)}
                    className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-[var(--secondary)] hover:text-white hover:border-[var(--secondary)] hover:bg-[var(--secondary)] transition-all duration-300 cursor-pointer"
                    aria-label={platform}
                  >
                    <i className={iconMap[platform]}></i>
                  </a>
                );
              })}
            </div>
          </div>
          <div>
            <h3 className="font-serif text-lg font-medium tracking-wide mb-6 text-white">Quick Links</h3>
            <ul className="space-y-4 text-sm text-[#94A3B8] font-light">
              {footerLinks1.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.label)}
                    className="hover:text-[var(--secondary)] hover:pl-2 transition-all duration-300 cursor-pointer block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-serif text-lg font-medium tracking-wide mb-6 text-white">Property Types</h3>
            <ul className="space-y-4 text-sm text-[#94A3B8] font-light">
              {footerLinks2.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.label)}
                    className="hover:text-[var(--secondary)] hover:pl-2 transition-all duration-300 cursor-pointer block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-serif text-lg font-medium tracking-wide mb-6 text-white">Contact Info</h3>
            <ul className="space-y-4 text-sm text-[#94A3B8] font-light">
              {contactInfo.map((info, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <i className={`fas ${info.icon} mt-1 text-[var(--secondary)]`}></i>
                  <span className="leading-relaxed text-[#CBD5E1]">{info.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-light tracking-wider">
          <span>&copy; {new Date().getFullYear()} Altheia Realty. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" onClick={(e) => handleLinkClick(e, 'Privacy Policy')} className="hover:text-white transition cursor-pointer">Privacy Policy</a>
            <a href="#" onClick={(e) => handleLinkClick(e, 'Terms of Service')} className="hover:text-white transition cursor-pointer">Terms of Service</a>
            <a href="#" onClick={(e) => handleLinkClick(e, 'Cookie Policy')} className="hover:text-white transition cursor-pointer">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
