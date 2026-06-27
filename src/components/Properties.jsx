import React, { useState } from 'react';
import PropertyCard from './PropertyCard';

export default function Properties({ properties, searchActive, favorites, onToggleFavorite, onCardClick }) {
  const [showAll, setShowAll] = useState(false);

  // If search is active, show all matching properties.
  // Otherwise, if showAll is true, show all properties.
  // Otherwise, show only featured properties.
  const displayedProperties = searchActive
    ? properties
    : (showAll ? properties : properties.filter(p => p.featured));

  const handleViewAllClick = () => {
    setShowAll(true);
  };

  return (
    <section id="properties" className="section bg-white">
      <div className="container">
        <div className="text-center mb-12 animate-fade-up">
          <span className="badge bg-[var(--accent)] text-[var(--primary)] mb-3">
            {searchActive ? 'Search Results' : 'Featured Listings'}
          </span>
          <h2 className="section-title">
            {searchActive ? 'Matching Properties' : 'Premium Properties'}
          </h2>
          <p className="section-subtitle">
            {searchActive
              ? `Found ${displayedProperties.length} properties matching your search.`
              : 'Hand-picked properties with exceptional value and prime locations.'}
          </p>
        </div>

        {displayedProperties.length === 0 ? (
          <div className="text-center py-12 text-[var(--text-muted)] animate-fade-up">
            <i className="fas fa-search-minus text-4xl mb-4 block"></i>
            <p className="text-lg font-medium">No properties found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isFavorite={favorites.includes(property.id)}
                onToggleFavorite={onToggleFavorite}
                onCardClick={onCardClick}
              />
            ))}
          </div>
        )}

        {!searchActive && !showAll && properties.length > displayedProperties.length && (
          <div className="text-center mt-12 animate-fade-up">
            <button
              onClick={handleViewAllClick}
              className="btn-secondary"
            >
              <i className="fas fa-arrow-right"></i> View All Properties
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
