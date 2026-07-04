import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalContext } from '../context/GlobalContext';
import { luxuryProjects, luxuryBlogs } from '../data/mockData';
import PropertyCard from '../components/ui/PropertyCard';
import {
  Search,
  MapPin,
  Home as HomeIcon,
  IndianRupee,
  ShieldCheck,
  Award,
  FileText,
  UserCheck,
  Quote,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import SEO from '../components/layout/SEO';
import { getWebsiteSchema, getOrganizationSchema, getLocalBusinessSchema } from '../utils/seo';

export default function Home() {
  const { properties, showToast } = useGlobalContext();
  const navigate = useNavigate();

  // Search filter states
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    type: 'all',
    budget: ''
  });

  // Testimonials Carousel State
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Countess Alexandra",
      role: "Estate Investor",
      quote: "TerraNova has set a new benchmark for discretion and personalized service. Securing our properties in Kerala was completely seamless.",
      firm: "Sterling Holdings"
    },
    {
      name: "Maximilian Kael",
      role: "Tech Founder",
      quote: "The off-market catalog is extraordinary. The architectural advice and legal support provided during our Bel Air purchase was stellar.",
      firm: "Kael Capital"
    },
    {
      name: "Serena Al-Maktoum",
      role: "Art Consultant",
      quote: "I highly recommend Victoria and her brokerage. Their deep understanding of high-end aesthetics made finding our waterfront mansion an art in itself.",
      firm: "Al-Maktoum Fine Arts"
    }
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Navigate to properties page with query parameters
    const params = new URLSearchParams();
    if (searchFilters.location) params.append('location', searchFilters.location);
    if (searchFilters.type !== 'all') params.append('type', searchFilters.type);
    if (searchFilters.budget) params.append('budget', searchFilters.budget);
    
    navigate(`/properties?${params.toString()}`);
  };

  // Hero Section Parallax Background Animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [
      getWebsiteSchema(),
      getOrganizationSchema(),
      getLocalBusinessSchema()
    ]
  };

  return (
    <div className="pt-0">
      <SEO 
        title="TERRANOVA | Premium Plots & Luxury Real Estate in Kerala"
        description="Discover luxury living with TerraNova. Explore premium residential plots, commercial properties, and agricultural lands in Thiruvananthapuram and across Kerala."
        canonicalPath="/"
        schema={combinedSchema}
      />
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] sm:h-[95vh] py-24 sm:py-0 flex items-center justify-center overflow-hidden">
        {/* Background Image with Deep Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80"
            alt="Premium Land & Plots"
            className="w-full h-full object-cover scale-105"
          />
          {/* Strict Palette Overlay: #0A3B25 (Deep Bluish Green) with 80% opacity */}
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-cream via-transparent to-primary/30" />
        </div>

        {/* Hero Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          <motion.span
            variants={itemVariants}
            className="text-accent-gold font-sans font-bold text-xs uppercase tracking-[0.3em] block mb-4"
          >
            Exclusive Plotted Developments
          </motion.span>
          
          <motion.h1
            variants={itemVariants}
            className="font-display text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-tight text-bg-cream"
          >
            From Land to <span className="text-accent-gold">Legacy</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="font-sans text-sm sm:text-lg md:text-xl text-neutral-laurel/90 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed font-light"
          >
            TerraNova Real Estate: Trusted real estate partner in Thiruvananthapuram, Kerala. For land, residential, and commercial properties.
          </motion.p>

          {/* Primary & Secondary CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16">
            <Link to="/properties" className="bg-primary text-bg-cream hover:bg-accent-gold hover:text-primary font-bold px-8 py-4 tracking-widest uppercase text-xs rounded-[12px] transition-all w-full sm:w-auto shadow-md border border-accent-gold/25">
              Explore Properties
            </Link>
            <Link to="/contact" className="border-2 border-bg-cream/80 text-bg-cream hover:bg-accent-gold hover:text-primary hover:border-accent-gold font-bold px-8 py-4 tracking-widest uppercase text-xs rounded-[12px] transition-all w-full sm:w-auto">
              Schedule Visit
            </Link>
          </motion.div>

          {/* Search Bar Widget */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSearchSubmit}
            className="glass-panel-dark rounded-[18px] p-4 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 items-center shadow-luxury border border-accent-gold/20"
          >
            <div className="flex items-center gap-3 px-3 py-2 border-b md:border-b-0 md:border-r border-neutral-laurel/20">
              <MapPin className="w-5 h-5 text-accent-gold shrink-0" />
              <div className="text-left w-full">
                <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Petta, Thiruvananthapuram"
                  value={searchFilters.location}
                  onChange={(e) => setSearchFilters({ ...searchFilters, location: e.target.value })}
                  className="bg-transparent border-none p-0 text-bg-cream text-sm font-semibold focus:outline-none w-full placeholder:text-bg-cream/40 mt-1"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 px-3 py-2 border-b md:border-b-0 md:border-r border-neutral-laurel/20">
              <HomeIcon className="w-5 h-5 text-accent-gold shrink-0" />
              <div className="text-left w-full text-bg-cream">
                <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold">Property Type</label>
                <select
                  value={searchFilters.type}
                  onChange={(e) => setSearchFilters({ ...searchFilters, type: e.target.value })}
                  className="bg-transparent border-none p-0 text-bg-cream text-sm font-semibold focus:outline-none w-full cursor-pointer mt-1"
                >
                  <option value="all" className="text-primary bg-bg-cream">All Types</option>
                  <option value="Residential Plot" className="text-primary bg-bg-cream">Residential Plot</option>
                  <option value="Commercial Plot" className="text-primary bg-bg-cream">Commercial Plot</option>
                  <option value="Agricultural Land" className="text-primary bg-bg-cream">Agricultural Land</option>
                  <option value="Industrial Land" className="text-primary bg-bg-cream">Industrial Land</option>
                  <option value="Villa/House" className="text-primary bg-bg-cream">Villa/House</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 px-3 py-2 border-b md:border-b-0 md:w-full">
              <IndianRupee className="w-5 h-5 text-accent-gold shrink-0" />
              <div className="text-left w-full">
                <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold">Budget (Max)</label>
                <input
                  type="text"
                  placeholder="e.g. ₹ 50 Lakhs"
                  value={searchFilters.budget}
                  onChange={(e) => setSearchFilters({ ...searchFilters, budget: e.target.value })}
                  className="bg-transparent border-none p-0 text-bg-cream text-sm font-semibold focus:outline-none w-full placeholder:text-bg-cream/40 mt-1"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-primary text-bg-cream hover:bg-accent-gold hover:text-primary font-bold py-4 rounded-[12px] text-xs uppercase tracking-widest transition-all w-full flex items-center justify-center gap-2 border border-accent-gold/20 cursor-pointer"
            >
              <Search className="w-4 h-4" /> Search
            </button>
          </motion.form>
        </motion.div>
      </section>

      {/* 2. FEATURED PROPERTIES */}
      <section className="py-24 max-w-[1440px] mx-auto px-6 lg:px-12 bg-bg-cream">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-16">
          <div className="space-y-3">
            <span className="text-accent-gold font-sans font-semibold text-xs uppercase tracking-[0.2em] block">Our Collection</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Featured Masterpieces</h2>
          </div>
          <Link to="/properties" className="text-primary hover:text-secondary font-sans font-semibold text-sm tracking-widest uppercase flex items-center gap-1 group mt-4 md:mt-0">
            View All Portfolios <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.slice(0, 3).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* 3. WHY CHOOSE US */}
      <section className="py-24 bg-primary text-bg-cream">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mb-20 space-y-4">
            <span className="text-accent-gold font-sans font-semibold text-xs uppercase tracking-[0.2em] block">Discerning Service</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-bg-cream">The TerraNova Standard</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: "Trusted Developers",
                desc: "Direct private channels to leading legacy architects and premium construction houses globally."
              },
              {
                icon: MapPin,
                title: "Prime Locations",
                desc: "Unmatched off-market inventory in the most prestigious residential postcodes worldwide."
              },
              {
                icon: UserCheck,
                title: "Verified Listings",
                desc: "Stringent background inspection and structural validation on every asset in our private registry."
              },
              {
                icon: FileText,
                title: "Legal Assistance",
                desc: "Dedicated global wealth advisory and legal experts managing cross-border transactions seamlessly."
              }
            ].map((card, idx) => {
              const IconComp = card.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="border border-accent-gold/20 rounded-[18px] p-8 space-y-6 hover:border-accent-gold transition-colors duration-500"
                >
                  <div className="w-12 h-12 rounded-[12px] bg-secondary/15 flex items-center justify-center text-accent-gold">
                    <IconComp className="w-6 h-6 stroke-1" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-bg-cream">{card.title}</h3>
                  <p className="font-sans text-sm text-neutral-laurel leading-relaxed">{card.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>





      {/* 6. TESTIMONIALS (Luxury Carousel) */}
      <section className="py-24 bg-bg-cream relative">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col items-center">
          <Quote className="w-12 h-12 text-accent-gold mb-8 stroke-1" />
          
          <div className="max-w-3xl text-center min-h-[220px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <p className="font-display text-2xl md:text-3xl italic text-primary leading-relaxed font-medium">
                  "{testimonials[activeTestimonial].quote}"
                </p>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex gap-4 mt-12">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:border-primary hover:bg-primary/5 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:border-primary hover:bg-primary/5 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. BLOG SECTION */}

    </div>
  );
}
