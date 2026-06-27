import React from 'react';

export default function PropertyCard({ property, isFavorite, onToggleFavorite, onCardClick }) {
  const { id, title, location, price, type, status, beds, baths, area, img } = property;
  const badgeClass = type === 'sale' ? 'badge-sale' : type === 'rent' ? 'badge-rent' : 'badge-sold';

  return (
    <article
      onClick={() => onCardClick(id)}
      className="card group cursor-pointer animate-fade-up"
    >
      <div className="relative overflow-hidden">
        <img
          src={img}
          alt={title}
          className="w-full h-60 object-cover group-hover:scale-105 transition-all duration-700 ease-out"
          loading="lazy"
        />
        <span className={`badge ${badgeClass} absolute top-4 left-4 shadow-sm`}>{status}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(id);
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-red-50 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md cursor-pointer"
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
        >
          <i className={`${isFavorite ? 'fas fa-heart text-red-500 scale-110 animate-pulse' : 'far fa-heart text-[var(--text-dark)] hover:text-red-500'}`}></i>
        </button>
      </div>
      <div className="p-6">
        <h3 className="font-serif font-medium text-lg text-[var(--primary)] mb-2 group-hover:text-[var(--secondary)] transition-colors duration-300 line-clamp-1">{title}</h3>
        <p className="text-xs text-[var(--text-muted)] mb-3 flex items-center gap-1 font-light">
          <i className="fas fa-map-marker-alt text-[var(--secondary)] text-[10px]"></i> {location}
        </p>
        <p className="text-lg font-semibold text-[var(--secondary)] mb-4">{price}</p>
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)] border-t border-gray-100 pt-4 font-light tracking-wide">
          <span><i className="fas fa-bed mr-1 text-[var(--secondary)]"></i> {beds} Beds</span>
          <span><i className="fas fa-bath mr-1 text-[var(--secondary)]"></i> {baths} Baths</span>
          <span><i className="fas fa-vector-square mr-1 text-[var(--secondary)]"></i> {area}</span>
        </div>
      </div>
    </article>
  );
}
