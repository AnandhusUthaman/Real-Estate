import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
import PropertyCard from '../components/ui/PropertyCard';
import { Search, MapPin, Grid, List, SlidersHorizontal, ArrowUpDown, ChevronDown, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PropertyListing() {
  const { properties } = useGlobalContext();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || 'all',
    roadAccess: 'all',
    priceRange: 'all', // 'all', 'under-150l', '150l-400l', 'over-400l'
    searchQuery: ''
  });

  const [layout, setLayout] = useState('grid'); // 'grid' | 'list'
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'price-asc' | 'price-desc'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Parse price helper
  const parsePrice = (priceStr) => {
    return parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
  };

  // Sync with search params changes (from hero search)
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      location: searchParams.get('location') || '',
      type: searchParams.get('type') || 'all'
    }));
  }, [searchParams]);

  // Filtered Properties
  const filteredProperties = properties.filter((p) => {
    const matchesLoc = filters.location
      ? p.location.toLowerCase().includes(filters.location.toLowerCase())
      : true;

    const matchesType = filters.type === 'all' ? true : p.type === filters.type;

    const matchesRoad = filters.roadAccess === 'all'
      ? true
      : filters.roadAccess === 'nh'
      ? p.roadAccess?.toLowerCase().includes('highway')
      : filters.roadAccess === 'tar'
      ? p.roadAccess?.toLowerCase().includes('tar') || p.roadAccess?.toLowerCase().includes('paved')
      : filters.roadAccess === 'private'
      ? p.roadAccess?.toLowerCase().includes('private')
      : true;

    const matchesSearch = filters.searchQuery
      ? p.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(filters.searchQuery.toLowerCase())
      : true;

    const price = parsePrice(p.price);
    let matchesPrice = true;
    if (filters.priceRange === 'under-150l') {
      matchesPrice = price < 15000000;
    } else if (filters.priceRange === '150l-400l') {
      matchesPrice = price >= 15000000 && price <= 40000000;
    } else if (filters.priceRange === 'over-400l') {
      matchesPrice = price > 40000000;
    }

    return matchesLoc && matchesType && matchesRoad && matchesSearch && matchesPrice;
  });

  // Sorted Properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortOrder === 'price-asc') {
      return parsePrice(a.price) - parsePrice(b.price);
    }
    if (sortOrder === 'price-desc') {
      return parsePrice(b.price) - parsePrice(a.price);
    }
    return b.id - a.id;
  });

  const clearAllFilters = () => {
    setFilters({
      location: '',
      type: 'all',
      roadAccess: 'all',
      priceRange: 'all',
      searchQuery: ''
    });
    setSearchParams({});
  };

  return (
    <div className="pt-24 sm:pt-36 pb-20 sm:pb-32 bg-bg-cream min-h-screen relative overflow-hidden">
      {/* Decorative large low-opacity blurred background spheres */}
      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/3 filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent-gold/4 filter blur-[120px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header Section */}
        <div className="space-y-4 mb-10 sm:mb-20 text-center max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-accent-gold font-sans font-bold text-xs uppercase tracking-[0.3em] block"
          >
            Curated Collectibles
          </motion.span>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-primary leading-none"
          >
            The Global Portfolio
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="font-sans text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed font-light pt-2"
          >
            A master list of iconic private properties, modern beachfront masterpieces, and high-floor penthouses.
          </motion.p>
        </div>

        {/* Apple Vision Pro-style Floating Glass Search & Control Widget */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="luxury-glass p-3 flex flex-col md:flex-row items-center gap-4 max-w-5xl mx-auto shadow-2xl border border-white/30 mb-10 sm:mb-20"
        >
          {/* Main search key input */}
          <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-primary/60 stroke-1" />
            <input
              type="text"
              placeholder="Search estates, locations, keywords..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              className="bg-transparent border-none text-primary placeholder:text-neutral-laurel w-full pl-12 pr-4 py-2.5 text-base focus:outline-none focus:ring-0"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-primary/10 pt-3 md:pt-0 md:pl-4">
            {/* Quick Location Badge Indicator */}
            {filters.location && (
              <span className="bg-primary/5 border border-primary/10 text-primary text-[11px] font-sans font-bold px-3 py-1.5 rounded-[50px] flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-secondary" />
                <span className="max-w-[100px] truncate">{filters.location}</span>
                <button onClick={() => setFilters({ ...filters, location: '' })} className="hover:text-red-500 font-bold">✕</button>
              </span>
            )}

            {/* Filter Toggle Pill */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center gap-2 px-5 py-2.5 border border-primary/15 rounded-[12px] text-xs font-sans font-bold uppercase tracking-wider text-primary hover:border-primary/40 hover:bg-white/30 transition-all duration-300"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-secondary stroke-1" />
              <span>Filters</span>
            </button>

            {/* Layout Toggles */}
            <div className="flex border border-primary/15 rounded-[12px] overflow-hidden bg-white/20 p-0.5">
              <button
                onClick={() => setLayout('grid')}
                className={`p-2 rounded-[10px] transition-all duration-300 ${layout === 'grid' ? 'bg-primary text-bg-cream shadow-sm' : 'text-primary/75 hover:text-primary hover:bg-white/25'}`}
                aria-label="Grid layout"
              >
                <Grid className="w-4 h-4 stroke-1" />
              </button>
              <button
                onClick={() => setLayout('list')}
                className={`p-2 rounded-[10px] transition-all duration-300 ${layout === 'list' ? 'bg-primary text-bg-cream shadow-sm' : 'text-primary/75 hover:text-primary hover:bg-white/25'}`}
                aria-label="List layout"
              >
                <List className="w-4 h-4 stroke-1" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 border border-primary/15 rounded-[12px] bg-white/20 px-3 py-2.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-secondary stroke-1 shrink-0" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-transparent border-none text-primary text-[10px] uppercase tracking-widest font-bold focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price Asc</option>
                <option value="price-desc">Price Desc</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Main Grid View */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          
          {/* 1. Frosted Glass Filters Sidebar */}
          <aside className={`lg:block ${isSidebarOpen ? 'block' : 'hidden'} luxury-glass p-8 space-y-8 sticky top-36 z-20 border border-white/20 shadow-xl`}>
            <div className="flex justify-between items-center pb-5 border-b border-primary/10">
              <h2 className="font-display text-lg font-bold text-primary tracking-wide">Refine Search</h2>
              <button
                onClick={clearAllFilters}
                className="text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-laurel hover:text-primary transition-colors"
              >
                Reset All
              </button>
            </div>

            {/* Location Input */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-laurel font-bold block">Desired Location</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-primary/45 stroke-1" />
                <input
                  type="text"
                  placeholder="e.g. Petta, Thiruvananthapuram"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="bg-white/40 border border-primary/15 text-primary text-sm placeholder:text-neutral-laurel rounded-[12px] pl-10 pr-4 py-2.5 w-full focus:outline-none focus:border-accent-gold focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Property Type Pills */}
            <div className="space-y-2.5">
              <label className="text-[10px] uppercase tracking-widest text-neutral-laurel font-bold block">Land & Property Type</label>
              <div className="flex flex-col gap-2 font-sans text-sm text-primary/80">
                {[
                  { value: 'all', label: 'All Categories' },
                  { value: 'Residential Plot', label: 'Residential Plots' },
                  { value: 'Commercial Plot', label: 'Commercial Plots' },
                  { value: 'Agricultural Land', label: 'Agricultural Land' },
                  { value: 'Industrial Land', label: 'Industrial Land' },
                  { value: 'Villa/House', label: 'Villas & Houses' }
                ].map((typeItem) => (
                  <label
                    key={typeItem.value}
                    className="flex items-center gap-3 cursor-pointer select-none hover:text-primary transition-colors py-1 group"
                  >
                    <input
                      type="radio"
                      name="type"
                      checked={filters.type === typeItem.value}
                      onChange={() => setFilters({ ...filters, type: typeItem.value })}
                      className="accent-primary w-4 h-4 cursor-pointer"
                    />
                    <span className={`font-medium ${filters.type === typeItem.value ? 'text-primary font-bold' : 'text-primary/70'}`}>
                      {typeItem.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Tier Dropdown Selector */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-laurel font-bold block">Price Classification</label>
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                className="bg-white/40 border border-primary/15 text-primary text-xs rounded-[12px] px-4 py-3 w-full focus:outline-none focus:border-accent-gold transition-all cursor-pointer font-sans font-semibold"
              >
                <option value="all">All Portfolios</option>
                <option value="under-150l">Under ₹ 1.5 Crores</option>
                <option value="150l-400l">₹ 1.5 - ₹ 4 Crores</option>
                <option value="over-400l">Over ₹ 4 Crores</option>
              </select>
            </div>

            {/* Road Access Filters */}
            <div className="space-y-2.5">
              <label className="text-[10px] uppercase tracking-widest text-neutral-laurel font-bold block">Road Access</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { val: 'all', label: 'All Roads' },
                  { val: 'nh', label: 'Highway' },
                  { val: 'tar', label: 'Tar/Paved' },
                  { val: 'private', label: 'Private' }
                ].map((roadOption) => (
                  <button
                    key={roadOption.val}
                    onClick={() => setFilters({ ...filters, roadAccess: roadOption.val })}
                    className={`py-2 rounded-[10px] text-xs font-sans font-bold uppercase transition-all duration-300 ${
                      filters.roadAccess === roadOption.val
                        ? 'bg-primary text-bg-cream shadow-sm'
                        : 'bg-white/30 border border-primary/10 text-primary/80 hover:bg-white/60 hover:text-primary'
                    }`}
                  >
                    {roadOption.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* 2. Listings Area */}
          <main className="lg:col-span-3">
            {sortedProperties.length === 0 ? (
              <div className="text-center py-24 luxury-glass border border-white/20 p-8 space-y-4">
                <X className="w-10 h-10 text-accent-gold mx-auto stroke-1 mb-2" />
                <h3 className="font-display text-2xl font-bold text-primary">No Matching Portfolios</h3>
                <p className="font-sans text-sm text-neutral-laurel max-w-sm mx-auto">
                  We currently have no private listings matching your refined search details. Try adjusting your parameters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="btn-primary mt-4 py-3.5 px-8 text-xs font-bold uppercase tracking-widest bg-primary text-bg-cream hover:bg-secondary rounded-[12px]"
                >
                  Reset Filters
                </button>
              </div>
            ) : layout === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <AnimatePresence>
                  {sortedProperties.map((property) => (
                    <motion.div
                      key={property.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <PropertyCard property={property} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                <AnimatePresence>
                  {sortedProperties.map((property) => (
                    <motion.div
                      key={property.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="relative overflow-hidden rounded-[22px] property-card-shadow flex flex-col md:flex-row group cursor-pointer bg-primary min-h-[300px]"
                    >
                      {/* Image - Left */}
                      <div className="relative overflow-hidden md:w-[45%] aspect-[16/10] md:aspect-auto">
                        <img
                          src={property.img}
                          alt={property.title}
                          className="w-full h-full object-cover scale-100 group-hover:scale-[1.04] transition-transform duration-[800ms] ease-out rounded-t-[22px] md:rounded-t-none md:rounded-l-[22px]"
                          loading="lazy"
                        />
                        {/* Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/20 to-transparent pointer-events-none" />
                        
                        <div className="absolute top-5 left-5 flex gap-2">
                          {property.type === 'sale' ? (
                            <span className="bg-accent-gold text-primary font-sans font-bold text-[10px] tracking-widest uppercase py-1.5 px-3 rounded-[50px]">
                              For Sale
                            </span>
                          ) : (
                            <span className="bg-primary text-bg-cream font-sans font-bold text-[10px] tracking-widest uppercase py-1.5 px-3 rounded-[50px] border border-bg-cream/20">
                              For Rent
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content - Right */}
                      <div className="p-8 md:w-[55%] flex flex-col justify-between relative z-10 bg-transparent">
                        <div className="space-y-4">
                          <div className="flex justify-between items-baseline gap-2">
                            <h3 className="font-display text-2xl font-bold text-bg-cream group-hover:text-accent-gold transition-colors duration-300 line-clamp-1">
                              {property.title}
                            </h3>
                            <span className="font-display text-2xl font-bold text-accent-gold shrink-0">
                              {property.price}
                            </span>
                          </div>
                          
                          <p className="font-sans text-xs text-neutral-laurel flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-accent-gold shrink-0" />
                            <span>{property.location}</span>
                          </p>

                          <p className="font-sans text-sm text-neutral-laurel/80 leading-relaxed line-clamp-3 pt-2">
                            {property.description}
                          </p>
                        </div>

                        {/* Specs and Details button */}
                        <div className="border-t border-white/10 pt-5 mt-8 flex justify-between items-center font-sans text-xs text-neutral-laurel/90">
                          <div className="flex gap-6 font-semibold">
                            <span>{property.beds} Beds</span>
                            <span>{property.baths} Baths</span>
                            <span>{property.area}</span>
                          </div>
                          
                          <a
                            href={`/property/${property.id}`}
                            className="btn-accent px-5 py-3 text-[10px] tracking-widest uppercase font-bold border-accent-gold text-bg-cream hover:bg-accent-gold hover:text-primary transition-all duration-300 rounded-[12px] flex items-center gap-1.5"
                          >
                            <span>Details</span>
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
