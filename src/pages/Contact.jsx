import React, { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { Mail, Phone, MapPin, Clock, Compass, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
  const { sendMessage, showToast } = useGlobalContext();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    interest: 'Buy Luxury Property', // 'Buy', 'Sell', 'Partner', 'Press'
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    sendMessage({
      from: form.name,
      email: form.email,
      subject: `Contact Form: ${form.interest}`,
      message: `${form.message} | Phone: ${form.phone}`
    });

    setForm({
      name: '',
      email: '',
      phone: '',
      interest: 'Buy Luxury Property',
      message: ''
    });
  };

  return (
    <div className="pt-32 pb-24 bg-bg-cream min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header Title */}
        <div className="space-y-4 mb-20 max-w-xl">
          <span className="text-accent-gold font-sans font-semibold text-xs uppercase tracking-[0.2em] block">Get In Touch</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-primary">Private Viewing</h1>
          <p className="font-sans text-neutral-laurel leading-relaxed">
            Inquire about bespoke properties, schedule a private tour, or contact our private wealth broker team.
          </p>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Form & General Details */}
          <div className="space-y-12">
            <div className="bg-primary text-bg-cream rounded-[18px] border border-accent-gold/25 p-8 shadow-luxury">
              <h2 className="font-display text-2xl font-bold text-accent-gold uppercase tracking-wider mb-6">Inquiry Form</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5 font-sans text-primary">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Elizabeth Vance"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="bg-bg-cream border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1.5">Telephone *</label>
                    <input
                      type="tel"
                      placeholder="e.g. +1 (310) 909-8800"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="bg-bg-cream border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    placeholder="e.g. elizabeth@vance.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="bg-bg-cream border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1.5">Nature of Inquiry</label>
                  <select
                    value={form.interest}
                    onChange={(e) => setForm({ ...form, interest: e.target.value })}
                    className="bg-bg-cream border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none text-primary cursor-pointer"
                  >
                    <option value="Buy Luxury Property">Buy Luxury Property</option>
                    <option value="Lease Luxury Residence">Lease Luxury Residence</option>
                    <option value="List My Property">List My Property</option>
                    <option value="Partnership & Development">Partnership & Development</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1.5">Message / Requirements *</label>
                  <textarea
                    rows="4"
                    placeholder="Provide details regarding budget scale, bedroom counts, or specific beachfront desires..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="bg-bg-cream border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-accent bg-accent-gold text-primary font-bold py-3.5 uppercase tracking-widest text-xs rounded-[12px] hover:bg-accent-gold/90 transition-all border-none cursor-pointer flex items-center justify-center gap-2 mt-6"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Private Request
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Map & General Contact Info */}
          <div className="space-y-10">
            {/* Contact cards */}
            <div className="bg-white rounded-[18px] border border-neutral-laurel/20 p-8 space-y-6 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-primary">Global Contact Registry</h2>
              
              <div className="space-y-4 font-sans text-sm text-primary/80">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-primary">Dubai Marina HQ</h4>
                    <p className="text-xs text-neutral-laurel">One Canal Pavilion, Palm Jumeirah, Dubai Marina, UAE</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-primary">Beverly Hills Salon</h4>
                    <p className="text-xs text-neutral-laurel">9560 Bel Air Road, Beverly Hills, CA 90210, USA</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-accent-gold shrink-0" />
                  <div>
                    <h4 className="font-bold text-primary">Brokerage Direct</h4>
                    <p className="text-xs text-neutral-laurel">+1 (800) LUXE-ESTATE</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Clock className="w-5 h-5 text-accent-gold shrink-0" />
                  <div>
                    <h4 className="font-bold text-primary">Operating Hours</h4>
                    <p className="text-xs text-neutral-laurel">Mon-Fri: 9AM - 7PM, Sat: 10AM - 4PM (GMT/PST)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Google Map Placeholder */}
            <div className="bg-primary border border-accent-gold/20 rounded-[18px] aspect-[4/3] relative overflow-hidden flex flex-col justify-center items-center text-center p-8 shadow-luxury">
              {/* Map vector grid background placeholder */}
              <div className="absolute inset-0 opacity-15 mix-blend-overlay">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
                  alt="Abstract Grid Map"
                  className="w-full h-full object-cover filter grayscale"
                />
              </div>

              {/* Strict Palette Graphic Pin */}
              <div className="relative z-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-accent-gold/15 border-2 border-accent-gold flex items-center justify-center text-accent-gold mx-auto animate-bounce">
                  <Compass className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="font-display text-xl font-bold text-bg-cream">Bespoke Location Registry</h3>
                <p className="font-sans text-xs text-neutral-laurel max-w-xs leading-relaxed mx-auto">
                  Map integration loaded privately for sovereign clients. Local navigation routes unlocked upon viewing reservation.
                </p>
                <div className="inline-block border border-accent-gold text-accent-gold text-[10px] tracking-widest font-sans uppercase font-bold py-2 px-4 rounded-[50px] bg-primary/20">
                  Secure Map Mode
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
