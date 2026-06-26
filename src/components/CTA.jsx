import React from 'react';

export default function CTA({ onContactClick, onBrowseClick }) {
  return (
    <section id="cta" class="section bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white">
      <div class="container text-center">
        <h2 class="section-title text-white">Ready to Find Your Perfect Home?</h2>
        <p class="text-lg text-white/80 max-w-lg mx-auto mb-8">Let our experts guide you to the property of your dreams.</p>
        <div class="flex flex-wrap justify-center gap-4">
          <button
            onClick={onContactClick}
            class="bg-white text-[var(--primary)] font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition cursor-pointer"
          >
            <i class="fas fa-phone-alt mr-2"></i> Contact Us
          </button>
          <button
            onClick={onBrowseClick}
            class="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white hover:text-[var(--primary)] transition cursor-pointer"
          >
            <i class="fas fa-search mr-2"></i> Browse Listings
          </button>
        </div>
      </div>
    </section>
  );
}
