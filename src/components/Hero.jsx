import React, { useState } from 'react';

export default function Hero({ onSearch }) {
  const [query, setQuery] = useState('');
  const [propertyType, setPropertyType] = useState('all');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch({ query, type: propertyType });
  };

  return (
    <section id="hero" className="section pt-36 pb-16 md:pt-44 md:pb-24 bg-gradient-to-br from-white via-[var(--accent)] to-white">
      <div className="container text-center">
        <div className="animate-fade-up visible">
          <span className="badge bg-[var(--primary)] text-white mb-4 px-5 py-1.5 text-xs tracking-wider">
            🏡 Trusted by 10,000+ families
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
            Find Your <span className="gradient-text">Dream Home</span><br />With Ease
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mx-auto mb-8">
            Discover premium properties in the best neighborhoods. Expert guidance every step of the way.
          </p>

          <form onSubmit={handleSearchSubmit} className="hero-search flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
            <div className="flex-1 flex items-center gap-2 px-4 w-full sm:w-auto">
              <i className="fas fa-search text-[var(--text-muted)]"></i>
              <input
                type="text"
                placeholder="Search by city, neighborhood, or address..."
                className="bg-transparent w-full focus:outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 px-2 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-gray-200">
              <select
                className="bg-transparent border-0 w-full text-sm text-[var(--text-dark)] focus:outline-none py-2"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="condo">Condo</option>
              </select>
            </div>
            <button type="submit" className="btn-primary w-full sm:w-auto text-center shrink-0">
              <i className="fas fa-search"></i> Search
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-[var(--text-muted)]">
            <span><i className="fas fa-check-circle text-[var(--primary)] mr-1"></i> 1,200+ listings</span>
            <span><i class="fas fa-check-circle text-[var(--primary)] mr-1"></i> 98% satisfaction</span>
            <span><i class="fas fa-check-circle text-[var(--primary)] mr-1"></i> 24/7 support</span>
          </div>
        </div>
      </div>
    </section>
  );
}
