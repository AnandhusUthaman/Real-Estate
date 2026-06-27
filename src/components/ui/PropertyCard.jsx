import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, BedDouble, Bath, Maximize2, MapPin, ArrowRight } from 'lucide-react';
import { useGlobalContext } from '../../context/GlobalContext';

export default function PropertyCard({ property }) {
  const { favorites, toggleFavorite } = useGlobalContext();
  const isFavorite = favorites.includes(property.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-[22px] property-card-shadow aspect-[3/4.2] flex flex-col justify-end p-5 group cursor-pointer bg-primary"
    >
      {/* 1. Large Immersive Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={property.img}
          alt={property.title}
          className="w-full h-full object-cover scale-100 group-hover:scale-[1.05] transition-transform duration-[700ms] ease-out rounded-[22px]"
          loading="lazy"
        />
        {/* Dark Gradient Overlay for optimal contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/30 to-transparent rounded-[22px]" />
      </div>

      {/* 2. Top Bar Elements (Floating Badges & Heart) */}
      <div className="absolute top-5 left-5 right-5 z-10 flex justify-between items-center pointer-events-none">
        <div className="flex gap-2 pointer-events-auto">
          {property.type === 'sale' ? (
            <span className="bg-accent-gold text-primary font-sans font-bold text-[10px] tracking-widest uppercase py-1.5 px-3 rounded-[50px]">
              For Sale
            </span>
          ) : (
            <span className="bg-primary text-bg-cream font-sans font-bold text-[10px] tracking-widest uppercase py-1.5 px-3 rounded-[50px] border border-bg-cream/20">
              For Rent
            </span>
          )}
          <span className="bg-primary/40 backdrop-blur-md text-bg-cream font-sans font-semibold text-[10px] tracking-widest uppercase py-1.5 px-3 rounded-[50px] border border-bg-cream/10">
            {property.status}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(property.id);
          }}
          className="pointer-events-auto bg-primary/30 backdrop-blur-md border border-bg-cream/20 text-bg-cream hover:bg-accent-gold hover:text-primary p-2.5 rounded-full shadow-md transition-all duration-300 group-hover:scale-105 active:scale-95 flex items-center justify-center"
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-colors stroke-1 ${
              isFavorite ? 'fill-accent-gold text-accent-gold stroke-accent-gold hover:text-primary hover:stroke-primary' : 'text-bg-cream hover:text-primary'
            }`}
          />
        </button>
      </div>

      {/* 3. Floating Frosted Glass Information Panel */}
      <div className="relative z-10 luxury-glass p-5 flex flex-col justify-between w-full text-primary min-h-[190px]">
        {/* Top Details (Title, Location, Price) */}
        <div>
          <div className="flex justify-between items-baseline gap-2 mb-1.5">
            <h3 className="font-display text-lg font-bold text-primary tracking-wide line-clamp-1">
              {property.title}
            </h3>
            <span className="font-display text-lg font-bold text-primary shrink-0">
              {property.price}
            </span>
          </div>

          <p className="font-sans text-xs text-primary/75 flex items-center gap-1 leading-none mb-4">
            <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
            <span className="line-clamp-1">{property.location}</span>
          </p>
        </div>

        {/* Bottom Details (Specs & Navigation Action) */}
        <div className="space-y-4">
          {/* Specs: Beds, Baths, Area */}
          <div className="grid grid-cols-3 border-t border-primary/10 pt-3 text-[11px] font-sans font-medium text-primary/80">
            <div className="flex items-center gap-1.5 justify-center border-r border-primary/10">
              <BedDouble className="w-3.5 h-3.5 text-secondary stroke-1" />
              <span>{property.beds} Bed</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center border-r border-primary/10">
              <Bath className="w-3.5 h-3.5 text-secondary stroke-1" />
              <span>{property.baths} Bath</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center">
              <Maximize2 className="w-3.5 h-3.5 text-secondary stroke-1" />
              <span className="truncate">{property.area.split(' ')[0]} SF</span>
            </div>
          </div>

          {/* View Details Action */}
          <Link
            to={`/property/${property.id}`}
            className="w-full btn-primary bg-primary hover:bg-secondary text-bg-cream text-[10px] tracking-widest uppercase font-bold py-3.5 rounded-[12px] flex items-center justify-center gap-2 group/btn border-none"
          >
            <span>View Residence</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
