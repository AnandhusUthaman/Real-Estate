import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
import { luxuryAgents } from '../data/mockData';
import {
  Heart,
  ChevronLeft,
  Calendar,
  DollarSign,
  Percent,
  Calculator,
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

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, favorites, toggleFavorite, sendMessage, showToast } = useGlobalContext();

  const property = properties.find((p) => p.id === parseInt(id, 10));

  // Gallery Active Image State
  const [activeImage, setActiveImage] = useState(property?.img || '');

  // Update active image when property changes
  useEffect(() => {
    if (property?.img) {
      setActiveImage(property.img);
    }
  }, [property]);

  // Mortgage Calculator State
  const [calculator, setCalculator] = useState({
    price: property ? (parseInt(property.price.replace(/[^0-9]/g, ''), 10) || 10000000) : 10000000,
    downPaymentPercent: 20,
    interestRate: 4.5,
    loanTerm: 30
  });

  // Update calculator when property price is resolved
  useEffect(() => {
    if (property?.price) {
      setCalculator(prev => ({
        ...prev,
        price: parseInt(property.price.replace(/[^0-9]/g, ''), 10) || 10000000
      }));
    }
  }, [property]);

  const [mortgageResult, setMortgageResult] = useState({
    monthlyPayment: 0,
    loanAmount: 0,
    totalInterest: 0
  });

  // Schedule / Enquiry Form State
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    message: property ? `I would like to request a private viewing for ${property.title}.` : ''
  });

  // Update inquiry message when property resolves
  useEffect(() => {
    if (property?.title) {
      setInquiryForm(prev => ({
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

  // Calculate mortgage whenever input changes
  useEffect(() => {
    if (!property) return;
    const loanAmount = calculator.price * (1 - calculator.downPaymentPercent / 100);
    const monthlyRate = (calculator.interestRate / 100) / 12;
    const numberOfPayments = calculator.loanTerm * 12;

    let monthlyPayment = 0;
    if (monthlyRate === 0) {
      monthlyPayment = loanAmount / numberOfPayments;
    } else {
      monthlyPayment =
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }

    const totalCost = monthlyPayment * numberOfPayments;
    const totalInterest = totalCost - loanAmount;

    setMortgageResult({
      monthlyPayment: Math.round(monthlyPayment),
      loanAmount: Math.round(loanAmount),
      totalInterest: Math.round(totalInterest)
    });
  }, [calculator, property]);

  if (!property) return null;

  const isFavorite = favorites.includes(property.id);

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.email || !inquiryForm.phone) {
      showToast('Please fill out all contact fields.', 'error');
      return;
    }
    
    sendMessage({
      from: inquiryForm.name,
      email: inquiryForm.email,
      subject: `Inquiry: ${property.title}`,
      message: `${inquiryForm.message} | Phone: ${inquiryForm.phone} | Date: ${inquiryForm.date || 'Flexible'}`
    });

    setInquiryForm({
      name: '',
      email: '',
      phone: '',
      date: '',
      message: `I would like to request a private viewing for ${property.title}.`
    });
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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

  return (
    <div className="pt-32 pb-24 bg-bg-cream min-h-screen">
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
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-primary leading-tight">
              {property.title}
            </h1>
            <span className="font-display text-3xl md:text-4xl font-bold text-primary shrink-0">
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
              <h2 className="font-display text-2xl font-bold text-primary">The Architecture & Concept</h2>
              <p className="font-sans text-primary/80 leading-relaxed text-base">{property.description}</p>
              <p className="font-sans text-secondary font-medium italic text-base">"{property.tagline}"</p>
            </div>

            {/* Core Specs */}
            <div className="grid grid-cols-3 bg-primary text-bg-cream rounded-[18px] p-6 text-center border border-accent-gold/25 shadow-luxury">
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
            </div>

            {/* Amenities */}
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold text-primary">Private Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2 font-sans text-sm text-primary font-medium">
                    <Compass className="w-4 h-4 text-accent-gold shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floor Plan */}
            <div className="space-y-6 border-t border-neutral-laurel/20 pt-10">
              <h2 className="font-display text-2xl font-bold text-primary">Floor Plans & Layouts</h2>
              <div className="bg-primary/5 border border-neutral-laurel/20 rounded-[18px] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <span className="font-sans font-bold text-sm text-primary uppercase tracking-wider">{property.floorPlan}</span>
                  <p className="font-sans text-xs text-neutral-laurel">
                    Double story layout detailing high-end kitchen integration, family salons, and terrace elevations.
                  </p>
                </div>
                <button
                  onClick={() => showToast('Downloading floor plans - demo mode', 'info')}
                  className="btn-accent px-5 py-3 text-xs tracking-wider uppercase font-semibold flex items-center gap-2 border-accent-gold/45 shrink-0"
                >
                  <FileText className="w-4 h-4" /> Download PDF Blueprint
                </button>
              </div>
            </div>

            {/* Mortgage Calculator */}
            <div className="space-y-8 border-t border-neutral-laurel/20 pt-10 bg-primary/5 rounded-[18px] p-8 border border-neutral-laurel/10">
              <div className="flex items-center gap-2">
                <Calculator className="w-6 h-6 text-accent-gold" />
                <h2 className="font-display text-2xl font-bold text-primary">Mortgage Estimation</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Property Price */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-laurel font-bold">Property Price ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-neutral-laurel" />
                    <input
                      type="number"
                      value={calculator.price}
                      onChange={(e) => setCalculator({ ...calculator, price: parseFloat(e.target.value) || 0 })}
                      className="bg-bg-cream border-neutral-laurel/30 text-primary text-sm font-semibold pl-8 pr-3 py-2 w-full focus:border-primary"
                    />
                  </div>
                </div>

                {/* Down Payment % */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-laurel font-bold">Down Payment (%)</label>
                  <div className="relative">
                    <Percent className="absolute right-3 top-2.5 w-3.5 h-3.5 text-neutral-laurel" />
                    <input
                      type="number"
                      value={calculator.downPaymentPercent}
                      onChange={(e) => setCalculator({ ...calculator, downPaymentPercent: parseFloat(e.target.value) || 0 })}
                      className="bg-bg-cream border-neutral-laurel/30 text-primary text-sm font-semibold px-3 py-2 w-full focus:border-primary"
                    />
                  </div>
                </div>

                {/* Interest Rate */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-laurel font-bold">Interest Rate (%)</label>
                  <div className="relative">
                    <Percent className="absolute right-3 top-2.5 w-3.5 h-3.5 text-neutral-laurel" />
                    <input
                      type="number"
                      step="0.1"
                      value={calculator.interestRate}
                      onChange={(e) => setCalculator({ ...calculator, interestRate: parseFloat(e.target.value) || 0 })}
                      className="bg-bg-cream border-neutral-laurel/30 text-primary text-sm font-semibold px-3 py-2 w-full focus:border-primary"
                    />
                  </div>
                </div>

                {/* Loan Term */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-laurel font-bold">Loan Term (Years)</label>
                  <select
                    value={calculator.loanTerm}
                    onChange={(e) => setCalculator({ ...calculator, loanTerm: parseInt(e.target.value, 10) || 30 })}
                    className="bg-bg-cream border-neutral-laurel/30 text-primary text-sm font-semibold px-3 py-2 w-full focus:border-primary rounded-[12px] cursor-pointer"
                  >
                    <option value={15}>15 Years</option>
                    <option value={20}>20 Years</option>
                    <option value={30}>30 Years</option>
                  </select>
                </div>
              </div>

              {/* Outputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-primary text-bg-cream rounded-[12px] p-6 text-center shadow-md">
                <div className="border-r border-accent-gold/15">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-laurel block mb-1">Monthly Payment</span>
                  <span className="font-display text-2xl font-bold text-accent-gold">{formatCurrency(mortgageResult.monthlyPayment)}/mo</span>
                </div>
                <div className="border-r border-accent-gold/15">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-laurel block mb-1">Total Loan Amount</span>
                  <span className="font-display text-lg font-bold text-bg-cream">{formatCurrency(mortgageResult.loanAmount)}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-laurel block mb-1">Total Interest Paid</span>
                  <span className="font-display text-lg font-bold text-bg-cream">{formatCurrency(mortgageResult.totalInterest)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Enquiry & Booking Card (Right, 1 column) */}
          <aside className="space-y-8 sticky top-32">
            {/* Contact Inquiry Card */}
            <div className="bg-primary text-bg-cream rounded-[18px] border border-accent-gold/25 p-6 shadow-luxury">
              <h3 className="font-display text-xl font-bold text-accent-gold uppercase tracking-wider mb-6">Book Private Viewing</h3>
              
              <form onSubmit={handleInquirySubmit} className="space-y-4 font-sans text-primary">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    className="bg-bg-cream border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    className="bg-bg-cream border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Telephone Number"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    className="bg-bg-cream border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                    required
                  />
                </div>

                {/* Date Picker */}
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-neutral-laurel pointer-events-none" />
                  <input
                    type="date"
                    value={inquiryForm.date}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, date: e.target.value })}
                    className="bg-bg-cream border-neutral-laurel/20 rounded-[12px] text-xs px-4 py-2.5 pl-10 w-full focus:outline-none text-primary/80"
                  />
                </div>

                <div>
                  <textarea
                    rows="3"
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
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

            {/* Dedicated Agent Card */}
            <div className="bg-bg-cream rounded-[18px] border border-neutral-laurel/20 p-6 shadow-sm flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border border-accent-gold p-0.5">
                <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <h4 className="font-display text-lg font-bold text-primary">{agent.name}</h4>
                <span className="font-sans text-[10px] uppercase tracking-widest text-neutral-laurel font-bold block mb-2">{agent.role}</span>
                <p className="font-sans text-xs text-primary/75 max-w-xs leading-relaxed">{agent.bio}</p>
              </div>

              <div className="w-full border-t border-neutral-laurel/20 pt-4 flex flex-col gap-2 font-sans text-xs text-primary/80">
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-accent-gold shrink-0" />
                  <span>{agent.phone}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-accent-gold shrink-0" />
                  <span>{agent.email}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
