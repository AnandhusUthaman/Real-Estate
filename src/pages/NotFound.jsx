import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, HelpCircle } from 'lucide-react';
import SEO from '../components/layout/SEO';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center text-center bg-bg-cream px-6 py-24 relative overflow-hidden">
      <SEO title="404 Page Not Found" noindex={true} />
      {/* Absolute decorative graphic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/5 filter blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6 max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-accent-gold/10 border-2 border-accent-gold flex items-center justify-center text-accent-gold mx-auto mb-6">
          <HelpCircle className="w-10 h-10 stroke-1" />
        </div>
        
        <h1 className="font-display text-7xl font-bold text-primary tracking-tight">404</h1>
        
        <h2 className="font-display text-2xl font-bold text-primary">Portfolio Not Found</h2>
        
        <p className="font-sans text-sm text-neutral-laurel leading-relaxed">
          The luxury property registry or page you are requesting is either off-market, private, or has changed locations.
        </p>

        <div className="pt-6">
          <Link
            to="/"
            className="btn-primary bg-primary hover:bg-secondary text-bg-cream font-bold tracking-widest text-xs uppercase px-8 py-3.5"
          >
            Return to Grand Entrance
          </Link>
        </div>
      </div>
    </div>
  );
}
