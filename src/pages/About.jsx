import React from 'react';
import { Compass, ShieldCheck, MapPin, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="pt-32 pb-24 bg-bg-cream">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Brand Narrative Title */}
        <div className="space-y-4 mb-20 max-w-xl">
          <span className="text-accent-gold font-sans font-semibold text-xs uppercase tracking-[0.2em] block">Our Heritage</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-primary">Uncompromising Legacy</h1>
          <p className="font-sans text-neutral-laurel leading-relaxed">
            Founded with a vision of offering boutique curation instead of transactional volume, we represent the peak of high-end real estate brokerage.
          </p>
        </div>

        {/* Brand Story Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="space-y-6">
            <h2 className="font-display text-3xl font-bold text-primary">The Vision of TerraNova</h2>
            <p className="font-sans text-primary/80 leading-relaxed">
              TerraNova Real Estate is a trusted real estate agency based in Thiruvananthapuram, Kerala, specializing in buying and selling land, residential properties, and commercial spaces. We are committed to helping clients find the right property with transparency, integrity, and personalized service.
            </p>
            <p className="font-sans text-primary/80 leading-relaxed">
              Our agents operate with complete discretion and possess deep local knowledge of structural dynamics, development potential, and zoning laws in Thiruvananthapuram and across Kerala.
            </p>
          </div>
          <div className="aspect-[4/3] rounded-[18px] overflow-hidden shadow-luxury">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
              alt="Luxury Dining Room"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Global Directors Statement */}
        <div className="bg-primary text-bg-cream rounded-[18px] p-8 md:p-16 border border-accent-gold/25 shadow-luxury text-center space-y-6 mb-24">
          <Compass className="w-12 h-12 text-accent-gold mx-auto stroke-1" />
          <h2 className="font-display text-3xl md:text-4xl italic max-w-3xl mx-auto leading-relaxed">
            "We do not collect transactions; we build relationships. Every penthouse, private cove estate, and luxury plot is vetted as if it were our own."
          </h2>
          <div>
            <h4 className="font-sans font-bold text-accent-gold tracking-widest uppercase text-sm">Andhu</h4>
            <p className="font-sans text-xs text-neutral-laurel tracking-wider uppercase mt-1">Founder & Executive Director</p>
          </div>
        </div>

        {/* Brand Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: ShieldCheck,
              title: "Absolute Discretion",
              desc: "All client data, off-market details, and personal identities are handled with absolute confidentiality and top-tier security."
            },
            {
              icon: Eye,
              title: "Curated Selection",
              desc: "We screen thousands of properties, selecting only the finest 1% that exhibit perfect architectural balance and premium build quality."
            },
            {
              icon: MapPin,
              title: "Local Expertise",
              desc: "With deep roots in Thiruvananthapuram and Kerala, we guide you seamlessly through agricultural, commercial, and residential acquisitions."
            }
          ].map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="bg-bg-cream rounded-[18px] border border-neutral-laurel/20 p-8 space-y-4 hover:border-accent-gold transition-colors duration-500"
              >
                <div className="w-10 h-10 rounded-[12px] bg-primary/5 flex items-center justify-center text-accent-gold">
                  <Icon className="w-5 h-5 stroke-1" />
                </div>
                <h3 className="font-display text-xl font-bold text-primary">{val.title}</h3>
                <p className="font-sans text-sm text-primary/75 leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
