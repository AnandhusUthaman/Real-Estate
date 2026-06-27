import React from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import PropertyCard from '../components/ui/PropertyCard';
import { Heart, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  const { properties, favorites } = useGlobalContext();

  const favoritedListings = properties.filter((p) => favorites.includes(p.id));

  return (
    <div className="pt-32 pb-24 bg-bg-cream min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header Title */}
        <div className="space-y-4 mb-16 max-w-xl">
          <span className="text-accent-gold font-sans font-semibold text-xs uppercase tracking-[0.2em] block">Saved Collection</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-primary">Your Wishlist</h1>
          <p className="font-sans text-neutral-laurel leading-relaxed">
            A private compilation of premium listings you are currently monitoring.
          </p>
        </div>

        {favoritedListings.length === 0 ? (
          <div className="text-center py-20 bg-white border border-neutral-laurel/20 rounded-[18px] p-8 space-y-4 max-w-lg mx-auto">
            <Heart className="w-12 h-12 text-accent-gold mx-auto stroke-1" />
            <h3 className="font-display text-2xl font-bold text-primary">Wishlist is Empty</h3>
            <p className="font-sans text-sm text-neutral-laurel max-w-xs mx-auto">
              Explore our exclusive portfolios and click the heart icon to save properties here.
            </p>
            <Link
              to="/properties"
              className="inline-flex btn-primary bg-primary text-bg-cream text-xs uppercase tracking-widest font-semibold py-3 px-6 rounded-[12px] hover:bg-secondary mt-4"
            >
              Browse Portfolios
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoritedListings.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
