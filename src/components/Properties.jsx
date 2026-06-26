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
    <section id="properties" class="section bg-white">
      <div class="container">
        <div class="text-center mb-12">
          <span class="badge bg-[var(--accent)] text-[var(--primary)] mb-3">
            {searchActive ? 'Search Results' : 'Featured Listings'}
          </span>
          <h2 class="section-title">
            {searchActive ? 'Matching Properties' : 'Premium Properties'}
          </h2>
          <p class="section-subtitle">
            {searchActive
              ? `Found ${displayedProperties.length} properties matching your search.`
              : 'Hand-picked properties with exceptional value and prime locations.'}
          </p>
        </div>

        {displayedProperties.length === 0 ? (
          <div class="text-center py-12 text-[var(--text-muted)]">
            <i class="fas fa-search-minus text-4xl mb-4 block"></i>
            <p class="text-lg font-medium">No properties found matching your criteria.</p>
          </div>
        ) : (
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          <div class="text-center mt-12">
            <button
              onClick={handleViewAllClick}
              class="btn-secondary"
            >
              <i class="fas fa-arrow-right"></i> View All Properties
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
