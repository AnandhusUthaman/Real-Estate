import React from 'react';
import { footerLinks1, footerLinks2, contactInfo } from '../data/mockData';

export default function Footer({ onFooterLinkClick }) {
  const handleLinkClick = (e, label) => {
    e.preventDefault();
    onFooterLinkClick(label);
  };

  return (
    <footer id="footer" class="bg-[var(--text-dark)] text-white pt-16 pb-8">
      <div class="container">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div class="flex items-center gap-2 text-2xl font-bold mb-4">
              <i class="fas fa-home text-[var(--primary)]"></i> Home<span class="text-[var(--primary)]">Verse</span>
            </div>
            <p class="text-gray-400 text-sm leading-relaxed">
              Your trusted real estate platform. We help families find their dream homes and investors discover prime opportunities.
            </p>
            <div class="flex gap-3 mt-4">
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
                    class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--primary)] transition cursor-pointer"
                    aria-label={platform}
                  >
                    <i class={iconMap[platform]}></i>
                  </a>
                );
              })}
            </div>
          </div>
          <div>
            <h3 class="font-bold text-lg mb-4">Quick Links</h3>
            <ul class="space-y-3 text-sm text-gray-400">
              {footerLinks1.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.label)}
                    class="hover:text-white transition cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 class="font-bold text-lg mb-4">Property Types</h3>
            <ul class="space-y-3 text-sm text-gray-400">
              {footerLinks2.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.label)}
                    class="hover:text-white transition cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 class="font-bold text-lg mb-4">Contact Info</h3>
            <ul class="space-y-3 text-sm text-gray-400">
              {contactInfo.map((info, idx) => (
                <li key={idx} class="flex items-start gap-2">
                  <i class={`fas ${info.icon} mt-1 text-[var(--primary)]`}></i>
                  <span>{info.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div class="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <span>&copy; {new Date().getFullYear()} HomeVerse. All rights reserved.</span>
          <div class="flex gap-6">
            <a href="#" onClick={(e) => handleLinkClick(e, 'Privacy Policy')} class="hover:text-white transition cursor-pointer">Privacy Policy</a>
            <a href="#" onClick={(e) => handleLinkClick(e, 'Terms of Service')} class="hover:text-white transition cursor-pointer">Terms of Service</a>
            <a href="#" onClick={(e) => handleLinkClick(e, 'Cookie Policy')} class="hover:text-white transition cursor-pointer">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
