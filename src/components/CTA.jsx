import React from 'react';

export default function CTA({ onContactClick, onBrowseListings }) {
  return (
    <section id="cta" className="section bg-[#07111D] border-t border-gray-800 text-white animate-fade-in">
      <div className="container text-center animate-fade-up">
        <span className="inline-block text-[var(--secondary)] text-xs font-semibold tracking-[0.25em] uppercase mb-4">
          Begin Your Journey
        </span>
        <h2 className="text-3xl md:text-5xl font-serif text-white font-light leading-tight mb-4">
          Ready to Find Your <span className="italic text-[var(--secondary)]">Perfect Estate</span>?
        </h2>
        <p className="text-gray-400 max-w-lg mx-auto mb-10 font-light text-sm tracking-wide">
          Let our bespoke real estate advisors guide you to the property of your dreams.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <button
            onClick={onContactClick}
            className="btn-gold px-8 py-3.5 rounded hover:bg-white hover:text-[var(--primary)] hover:border-white transition-all duration-300 font-medium tracking-wider text-xs cursor-pointer shadow-lg"
          >
            <i className="fas fa-phone-alt mr-2 text-[10px]"></i> Contact Advisors
          </button>
          <button
            onClick={onBrowseListings}
            className="border border-white/30 text-white hover:bg-white hover:text-[var(--primary)] hover:border-white px-8 py-3.5 rounded transition-all duration-300 font-medium tracking-wider text-xs cursor-pointer shadow-lg"
          >
            <i className="fas fa-search mr-2 text-[10px]"></i> Browse Portfolio
          </button>
        </div>
      </div>
    </section>
  );
}
