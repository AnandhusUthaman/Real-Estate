import React, { useState } from 'react';

export default function Hero({ onSearch }) {
  const [query, setQuery] = useState('');
  const [propertyType, setPropertyType] = useState('all');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch({ query, type: propertyType });
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80')` }}
    >
      {/* Luxury Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/95 via-[#0B1F3A]/75 to-[#0B1F3A]/40 z-0"></div>

      <div className="container relative z-10 text-center md:text-left">
        <div className="max-w-4xl mx-auto md:mx-0 animate-fade-up">
          <span className="inline-block text-[var(--secondary)] text-xs font-semibold tracking-[0.25em] uppercase mb-4">
            Altheia Luxury Estates
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white font-light leading-[1.15] mb-6 tracking-wide">
            The Art of <span className="italic text-[var(--secondary)]">Luxury</span> Living
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-xl mb-10 font-light leading-relaxed">
            Discover a curated collection of signature properties in the most prestigious postcodes. Signature homes, tailored for distinction.
          </p>

          {/* Premium Glassmorphic Search Form */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded flex flex-col md:flex-row gap-2 max-w-3xl shadow-2xl"
          >
            <div className="flex-1 flex items-center gap-3 px-4 py-3">
              <i className="fas fa-search text-[var(--secondary)] text-sm"></i>
              <input
                type="text"
                placeholder="Search by city, neighborhood, or address..."
                className="bg-transparent w-full focus:outline-none text-white placeholder-gray-400 text-sm font-light"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 px-4 py-3 border-t md:border-t-0 md:border-l border-white/10">
              <i className="fas fa-building text-[var(--secondary)] text-sm"></i>
              <select
                className="bg-transparent border-0 w-full text-sm text-white focus:outline-none cursor-pointer font-light"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                style={{ colorScheme: 'dark' }}
              >
                <option value="all">All Property Types</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="condo">Condo</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="btn-gold px-8 py-3 rounded hover:bg-white hover:text-[var(--primary)] hover:border-white transition-all duration-300 font-medium tracking-wider text-xs shrink-0 cursor-pointer"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 mt-12 text-xs tracking-wider text-gray-400 font-light">
            <span><i className="fas fa-circle text-[var(--secondary)] mr-2 text-[6px]"></i> 1,200+ Signature listings</span>
            <span><i className="fas fa-circle text-[var(--secondary)] mr-2 text-[6px]"></i> 98% Client Satisfaction</span>
            <span><i className="fas fa-circle text-[var(--secondary)] mr-2 text-[6px]"></i> Bespoke Advisory Support</span>
          </div>
        </div>
      </div>
    </section>
  );
}
