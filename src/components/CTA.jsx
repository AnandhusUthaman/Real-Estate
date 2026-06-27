import React from 'react';

export default function CTA({ onContactClick, onBrowseListings }) {
  return (
    <section id="cta" className="section bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white animate-fade-in">
      <div className="container text-center animate-fade-up">
        <h2 className="section-title text-white">Ready to Find Your Perfect Home?</h2>
        <p className="text-lg text-white/80 max-w-lg mx-auto mb-8">Let our experts guide you to the property of your dreams.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={onContactClick}
            className="bg-white text-[var(--primary)] font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition cursor-pointer"
          >
            <i className="fas fa-phone-alt mr-2"></i> Contact Us
          </button>
          <button
            onClick={onBrowseListings}
            className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white hover:text-[var(--primary)] transition cursor-pointer"
          >
            <i className="fas fa-search mr-2"></i> Browse Listings
          </button>
        </div>
      </div>
    </section>
  );
}
