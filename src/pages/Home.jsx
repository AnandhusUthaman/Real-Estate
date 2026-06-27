import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalContext } from '../context/GlobalContext';
import { luxuryAgents, luxuryProjects, luxuryBlogs } from '../data/mockData';
import PropertyCard from '../components/ui/PropertyCard';
import {
  Search,
  MapPin,
  Home as HomeIcon,
  DollarSign,
  ShieldCheck,
  Award,
  FileText,
  UserCheck,
  Quote,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';

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
      quote: "LuxeEstate has set a new benchmark for discretion and white-glove service. Securing our penthouse in One Canal was completely seamless.",
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

  return (
    <div className="pt-20">
      {/* 1. HERO SECTION */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Deep Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
            alt="Luxury Waterfront Villa"
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
          className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 w-full text-center text-bg-cream"
        >
          <motion.h1
            variants={itemVariants}
            className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-tight"
          >
            Find Luxury Living <br />
            <span className="text-accent-gold">Without Compromise</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="font-sans text-lg md:text-xl text-neutral-laurel/90 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Securing elite residential masterpieces, private penthouses, and waterfront estates for the most discerning global client.
          </motion.p>

          {/* Primary & Secondary CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16">
            <Link to="/properties" className="btn-primary bg-accent-gold text-primary font-bold px-8 py-4 tracking-wider uppercase text-sm hover:bg-accent-gold/90 w-full sm:w-auto">
              Explore Properties
            </Link>
            <Link to="/contact" className="btn-secondary border-bg-cream text-bg-cream hover:bg-bg-cream hover:text-primary font-bold px-8 py-4 tracking-wider uppercase text-sm w-full sm:w-auto">
              Schedule Visit
            </Link>
          </motion.div>

          {/* Search Bar Widget */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSearchSubmit}
            className="glass-panel rounded-[18px] p-4 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 items-center shadow-luxury"
          >
            <div className="flex items-center gap-3 px-3 py-2 border-b md:border-b-0 md:border-r border-neutral-laurel/30">
              <MapPin className="w-5 h-5 text-accent-gold shrink-0" />
              <div className="text-left w-full">
                <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-semibold">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Dubai, Bel Air"
                  value={searchFilters.location}
                  onChange={(e) => setSearchFilters({ ...searchFilters, location: e.target.value })}
                  className="bg-transparent border-none p-0 text-primary text-sm font-semibold focus:outline-none w-full placeholder:text-primary/45"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 px-3 py-2 border-b md:border-b-0 md:border-r border-neutral-laurel/30">
              <HomeIcon className="w-5 h-5 text-accent-gold shrink-0" />
              <div className="text-left w-full">
                <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-semibold">Property Type</label>
                <select
                  value={searchFilters.type}
                  onChange={(e) => setSearchFilters({ ...searchFilters, type: e.target.value })}
                  className="bg-transparent border-none p-0 text-primary text-sm font-semibold focus:outline-none w-full cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Lease</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 px-3 py-2">
              <DollarSign className="w-5 h-5 text-accent-gold shrink-0" />
              <div className="text-left w-full">
                <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-semibold">Budget (Max)</label>
                <input
                  type="text"
                  placeholder="e.g. $25,000,000"
                  value={searchFilters.budget}
                  onChange={(e) => setSearchFilters({ ...searchFilters, budget: e.target.value })}
                  className="bg-transparent border-none p-0 text-primary text-sm font-semibold focus:outline-none w-full placeholder:text-primary/45"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-4 text-xs font-bold uppercase tracking-widest bg-primary text-bg-cream flex items-center justify-center gap-2"
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
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-bg-cream">The LuxeEstate Standard</h2>
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

      {/* 4. LATEST PROJECTS */}
      <section className="py-24 max-w-[1440px] mx-auto px-6 lg:px-12 bg-bg-cream">
        <div className="space-y-3 mb-16 text-center">
          <span className="text-accent-gold font-sans font-semibold text-xs uppercase tracking-[0.2em] block">Upcoming Landmarks</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Luxury Private Launches</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {luxuryProjects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-[18px] overflow-hidden aspect-[16/9] group shadow-luxury cursor-pointer"
            >
              <img
                src={project.img}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
              
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="bg-accent-gold text-primary font-sans font-bold text-[10px] tracking-widest uppercase py-1 px-3 rounded-[50px]">
                  {project.status}
                </span>
                <span className="bg-bg-cream text-primary font-sans font-semibold text-[10px] tracking-widest uppercase py-1 px-3 rounded-[50px]">
                  Est. {project.completionYear}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-bg-cream">
                <span className="text-accent-gold font-sans text-xs tracking-wider uppercase mb-1 block">{project.developer}</span>
                <h3 className="font-display text-2xl font-bold mb-2">{project.title}</h3>
                <p className="font-sans text-sm text-neutral-laurel/90 line-clamp-2 max-w-md">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. ELITE AGENTS */}
      <section className="py-24 bg-primary text-bg-cream">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-center">
          <span className="text-accent-gold font-sans font-semibold text-xs uppercase tracking-[0.2em] block mb-3">Expert Brokers</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-16">Meet Our Advisors</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {luxuryAgents.map((agent) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-accent-gold p-1 shadow-luxury">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-full h-full object-cover rounded-full filter grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <h3 className="font-display text-xl font-bold text-accent-gold">{agent.name}</h3>
                <p className="font-sans text-xs uppercase tracking-widest text-neutral-laurel">{agent.role}</p>
                <p className="font-sans text-sm text-neutral-laurel/80 max-w-xs">{agent.specialization}</p>
                <Link
                  to="/agents"
                  className="btn-accent border-accent-gold/45 text-bg-cream hover:bg-accent-gold hover:text-primary px-5 py-2 text-xs tracking-wider uppercase font-semibold"
                >
                  Contact Broker
                </Link>
              </motion.div>
            ))}
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
                <div>
                  <h4 className="font-sans font-bold text-primary tracking-widest uppercase text-sm">
                    {testimonials[activeTestimonial].name}
                  </h4>
                  <p className="font-sans text-xs text-neutral-laurel tracking-wider uppercase mt-1">
                    {testimonials[activeTestimonial].role} — {testimonials[activeTestimonial].firm}
                  </p>
                </div>
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
      <section className="py-24 max-w-[1440px] mx-auto px-6 lg:px-12 bg-bg-cream">
        <div className="flex justify-between items-baseline mb-16">
          <div className="space-y-3">
            <span className="text-accent-gold font-sans font-semibold text-xs uppercase tracking-[0.2em] block">Journal & Insights</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Luxury Market Reports</h2>
          </div>
          <Link to="/blog" className="text-primary hover:text-secondary font-sans font-semibold text-sm tracking-widest uppercase flex items-center gap-1 group">
            Read Journal <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {luxuryBlogs.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-bg-cream border border-neutral-laurel/20 rounded-[18px] overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-luxury transition-all duration-300"
            >
              <div className="md:w-1/2 overflow-hidden aspect-[4/3] md:aspect-auto">
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="p-6 md:w-1/2 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-xs font-sans text-neutral-laurel">
                    <span className="text-accent-gold font-bold uppercase tracking-wider">{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-primary tracking-wide leading-snug">
                    {post.title}
                  </h3>
                  <p className="font-sans text-sm text-primary/75 leading-relaxed line-clamp-3">
                    {post.snippet}
                  </p>
                </div>
                <Link
                  to="/blog"
                  className="text-accent-gold font-sans font-semibold text-xs uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1.5 mt-6"
                >
                  Read Article <span>→</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
