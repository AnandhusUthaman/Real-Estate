import React from 'react';

export default function PropertyCard({ property, isFavorite, onToggleFavorite, onCardClick }) {
  const { id, title, location, price, type, status, beds, baths, area, img } = property;
  const badgeClass = type === 'sale' ? 'badge-sale' : type === 'rent' ? 'badge-rent' : 'badge-sold';

  return (
    <article
      onClick={() => onCardClick(id)}
      class="card group cursor-pointer"
    >
      <div class="relative overflow-hidden">
        <img
          src={img}
          alt={title}
          class="w-full h-52 object-cover group-hover:scale-105 transition duration-500"
          loading="lazy"
        />
        <span class={`badge ${badgeClass} absolute top-3 left-3 shadow-sm`}>{status}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(id);
          }}
          class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition shadow"
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
        >
          <i class={`${isFavorite ? 'fas fa-heart text-red-500' : 'far fa-heart text-[var(--text-dark)]'}`}></i>
        </button>
      </div>
      <div class="p-5">
        <h3 class="font-bold text-lg mb-1">{title}</h3>
        <p class="text-sm text-[var(--text-muted)] mb-3">
          <i class="fas fa-map-marker-alt mr-1 text-[var(--primary)]"></i> {location}
        </p>
        <p class="text-xl font-bold text-[var(--primary)] mb-3">{price}</p>
        <div class="flex items-center justify-between text-sm text-[var(--text-muted)] border-t border-gray-100 pt-3">
          <span><i class="fas fa-bed mr-1"></i> {beds} Beds</span>
          <span><i class="fas fa-bath mr-1"></i> {baths} Baths</span>
          <span><i class="fas fa-vector-square mr-1"></i> {area}</span>
        </div>
      </div>
    </article>
  );
}
