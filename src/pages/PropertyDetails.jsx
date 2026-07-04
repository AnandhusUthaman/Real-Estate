import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
import { luxuryAgents } from '../data/mockData';
import {
  Heart,
  ChevronLeft,
  Calendar,
  Compass,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Mail,
  Phone,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/layout/SEO';
import { getPropertySchema } from '../utils/seo';

export default function PropertyDetails() {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const { properties, favorites, toggleFavorite, sendMessage, showToast } = useGlobalContext();

  const getPropertySlug = (p) => {
    const firstLocationPart = p.location ? p.location.split(',')[0] : '';
    const slugify = (text) => {
      if (!text) return '';
      return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
    };
    return slugify(`${p.title}-${firstLocationPart}`);
  };

  const property = properties.find((p) => {
    const identifier = id || slug;
    if (!identifier) return false;
    if (p.id.toString() === identifier) return true;
    return getPropertySlug(p) === identifier;
  });

  // Redirect old ID-based routes to SEO-friendly slug routes
  useEffect(() => {
    if (property && id) {
      const propSlug = getPropertySlug(property);
      navigate(`/properties/${propSlug}`, { replace: true });
    }
  }, [property, id, navigate]);

  // Gallery Active Image State
  const [activeImage, setActiveImage] = useState(property?.img || '');

  // Update active image when property changes
  useEffect(() => {
    if (property?.img) {
      setActiveImage(property.img);
    }
  }, [property]);

  // Schedule / Enquiry Form State
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    message: property ? `I would like to request a private viewing for ${property.title}.` : ''
  });

  // Update enquiry message when property resolves
  useEffect(() => {
    if (property?.title) {
      setEnquiryForm(prev => ({
        ...prev,
        message: `I would like to request a private viewing for ${property.title}.`
      }));
    }
  }, [property]);

  // If property not found, redirect to 404
  useEffect(() => {
    if (!property) {
      navigate('/404');
    }
  }, [property, navigate]);

  if (!property) return null;

  const isFavorite = favorites.includes(property.id);

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.email || !enquiryForm.phone) {
      showToast('Please fill out all contact fields.', 'error');
      return;
    }
    
    sendMessage({
      from: enquiryForm.name,
      email: enquiryForm.email,
      subject: `Enquiry: ${property.title}`,
      message: `${enquiryForm.message} | Phone: ${enquiryForm.phone} | Date: ${enquiryForm.date || 'Flexible'}`
    });

    setEnquiryForm({
      name: '',
      email: '',
      phone: '',
      date: '',
      message: `I would like to request a private viewing for ${property.title}.`
    });
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Associated private agent
  const agent = luxuryAgents[property.id % luxuryAgents.length];

  // Gallery items (mock additional images based on base image)
  const galleryImages = [
    property.img,
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
  ];

  const propertySlug = property ? getPropertySlug(property) : '';
  const propertySchema = property ? getPropertySchema(property) : null;
  const propertyKeywords = property 
    ? `${property.title}, ${property.type} for sale, ${property.location} real estate, buy property ${property.location.split(',')[0]}, TerraNova`
    : '';

  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-24 bg-bg-cream min-h-screen">
      {property && (
        <SEO 
          title={`${property.title} in ${property.location}`} 
          description={property.description || property.tagline} 
          canonicalPath={`/properties/${propertySlug}`}
          image={property.img}
          keywords={propertyKeywords}
          schema={propertySchema}
        />
      )}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Back Link & Title Area */}
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/properties"
            className="flex items-center gap-1 text-primary hover:text-secondary font-sans text-xs uppercase tracking-widest font-semibold"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Catalog
          </Link>
          <button
            onClick={() => toggleFavorite(property.id)}
            className="flex items-center gap-2 border border-accent-gold/40 hover:border-accent-gold rounded-[12px] px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-accent-gold/10 transition-all text-primary"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-primary' : ''}`} />
            <span>{isFavorite ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
          </button>
        </div>

        {/* Title Header */}
        <div className="space-y-3 mb-10">
          <div className="flex gap-2">
            <span className="bg-primary text-bg-cream text-[10px] tracking-widest uppercase font-bold px-3 py-1 rounded-[50px]">
              {property.status}
            </span>
            <span className="bg-accent-gold text-primary text-[10px] tracking-widest uppercase font-bold px-3 py-1 rounded-[50px]">
              For {property.type}
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-4">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-primary leading-tight">
              {property.title}
            </h1>
            <span className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-primary shrink-0">
              {property.price}
            </span>
          </div>
          <p className="font-sans text-sm text-neutral-laurel flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-accent-gold" /> {property.location}
          </p>
        </div>

        {/* Dynamic Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-16">
          <div className="lg:col-span-3 aspect-[16/9] rounded-[18px] overflow-hidden shadow-luxury">
            <img src={activeImage} alt={property.title} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 lg:grid-cols-1 gap-3">
            {galleryImages.map((imgUrl, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(imgUrl)}
                className={`rounded-[12px] overflow-hidden aspect-[4/3] lg:aspect-[16/10] border-2 shadow-sm transition-all duration-300 ${
                  activeImage === imgUrl ? 'border-accent-gold scale-[1.03]' : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Layout - Main Content vs Sticky Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Main Content (Left, 2 columns) */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-primary">
                {property.beds > 0 ? "The Architecture & Concept" : "Land Features & Concept"}
              </h2>
              <p className="font-sans text-primary/80 leading-relaxed text-base">{property.description}</p>
              <p className="font-sans text-secondary font-medium italic text-base">"{property.tagline}"</p>
            </div>

            {/* Core Specs */}
            <div className="grid grid-cols-3 bg-primary text-bg-cream rounded-[18px] p-6 text-center border border-accent-gold/25 shadow-luxury">
              {property.beds > 0 || property.baths > 0 ? (
                <>
                  <div className="border-r border-accent-gold/15">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-laurel mb-1 block">Bedrooms</span>
                    <span className="font-display text-2xl font-bold text-accent-gold flex items-center justify-center gap-1.5">
                      <BedDouble className="w-5 h-5 stroke-1" /> {property.beds}
                    </span>
                  </div>
                  <div className="border-r border-accent-gold/15">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-laurel mb-1 block">Bathrooms</span>
                    <span className="font-display text-2xl font-bold text-accent-gold flex items-center justify-center gap-1.5">
                      <Bath className="w-5 h-5 stroke-1" /> {property.baths}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-laurel mb-1 block">Living Space</span>
                    <span className="font-display text-2xl font-bold text-accent-gold flex items-center justify-center gap-1.5">
                      <Maximize2 className="w-5 h-5 stroke-1" /> {property.area}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="border-r border-accent-gold/15">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-laurel mb-1 block">Total Area</span>
                    <span className="font-display text-2xl font-bold text-accent-gold flex items-center justify-center gap-1.5">
                      <Maximize2 className="w-5 h-5 stroke-1" /> {property.area}
                    </span>
                  </div>
                  <div className="border-r border-accent-gold/15">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-laurel mb-1 block">Road Frontage</span>
                    <span className="font-display text-xl font-bold text-accent-gold flex items-center justify-center gap-1.5">
                      <MapPin className="w-5 h-5 stroke-1 shrink-0" />
                      <span className="truncate text-sm md:text-base" title={property.roadAccess}>{property.roadAccess || "Paved Road"}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-laurel mb-1 block">Property Type</span>
                    <span className="font-display text-base md:text-lg font-bold text-accent-gold flex items-center justify-center gap-1">
                      <Compass className="w-5 h-5 stroke-1 shrink-0" />
                      <span className="truncate">{property.type}</span>
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Amenities */}
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold text-primary">
                {property.beds > 0 ? "Private Amenities" : "Site Specifications & Highlights"}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2 font-sans text-sm text-primary font-medium">
                    <Compass className="w-4 h-4 text-accent-gold shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>



          </div>

          {/* Sticky Enquiry & Booking Card (Right, 1 column) */}
          <aside className="space-y-8 sticky top-32">
            {/* Contact Enquiry Card */}
            <div className="bg-primary text-bg-cream rounded-[18px] border border-accent-gold/25 p-6 shadow-luxury">
              <h3 className="font-display text-xl font-bold text-accent-gold uppercase tracking-wider mb-6">Book Private Viewing</h3>
              
              <form onSubmit={handleEnquirySubmit} className="space-y-4 font-sans text-primary">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={enquiryForm.name}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                    className="bg-bg-cream border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={enquiryForm.email}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                    className="bg-bg-cream border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Telephone Number"
                    value={enquiryForm.phone}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                    className="bg-bg-cream border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                    required
                  />
                </div>

                {/* Date Picker */}
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-neutral-laurel pointer-events-none" />
                  <input
                    type="date"
                    value={enquiryForm.date}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, date: e.target.value })}
                    className="bg-bg-cream border-neutral-laurel/20 rounded-[12px] text-xs px-4 py-2.5 pl-10 w-full focus:outline-none text-primary/80"
                  />
                </div>

                <div>
                  <textarea
                    rows="3"
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    className="bg-bg-cream border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-accent w-full bg-accent-gold text-primary font-bold py-3 uppercase tracking-widest text-xs rounded-[12px] hover:bg-accent-gold/90 transition-all border-none cursor-pointer"
                >
                  Request Private Tour
                </button>
              </form>
            </div>

            {/* Broker Contact Information */}
            <div className="bg-bg-cream rounded-[18px] border border-neutral-laurel/20 p-6 shadow-sm flex flex-col gap-4">
              <h4 className="font-display text-base font-bold text-primary uppercase tracking-wider text-center border-b border-neutral-laurel/10 pb-3">Contact Private Broker</h4>
              
              <a
                href={`tel:${agent.phone}`}
                className="w-full bg-primary hover:bg-accent-gold hover:text-primary text-bg-cream font-bold py-3.5 uppercase tracking-widest text-xs rounded-[12px] flex items-center justify-center gap-2 border-none transition-all duration-300 cursor-pointer text-center"
              >
                <Phone className="w-4 h-4 shrink-0 text-accent-gold" />
                <span>Call +91 {agent.phone}</span>
              </a>
              
              <a
                href={`mailto:${agent.email}`}
                className="w-full border border-primary/20 hover:border-accent-gold text-primary hover:text-accent-gold font-bold py-3.5 uppercase tracking-widest text-xs rounded-[12px] flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer text-center"
              >
                <Mail className="w-4 h-4 shrink-0 text-accent-gold" />
                <span>Email Broker</span>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
