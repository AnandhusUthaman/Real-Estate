import React from 'react';
import { testimonials } from '../data/mockData';

export default function Testimonials() {
  return (
    <section id="testimonials" className="section bg-white">
      <div className="container">
        <div className="text-center mb-16 animate-fade-up">
          <span className="inline-block text-[var(--secondary)] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Client Stories</span>
          <h2 className="section-title">Testimonials of Excellence</h2>
          <p className="section-subtitle">Real experiences from discerning homeowners and property investors.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div 
              key={idx} 
              className="bg-[var(--bg-light)] border border-gray-100/50 p-8 rounded flex flex-col justify-between transition-all duration-500 hover:shadow-lg animate-fade-up"
            >
              <div>
                <div className="flex items-center gap-1 mb-4 text-[10px] text-[var(--secondary)]">
                  {Array.from({ length: t.rating }).map((_, starIdx) => (
                    <i key={starIdx} className="fas fa-star text-[var(--secondary)]"></i>
                  ))}
                </div>
                <p className="text-[var(--text-dark)] text-sm mb-6 leading-relaxed font-light italic">"{t.text}"</p>
              </div>
              <div className="flex items-center gap-4 border-t border-gray-200/40 pt-4">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-[var(--secondary)]" />
                <div>
                  <p className="font-serif font-medium text-sm text-[var(--primary)]">{t.name}</p>
                  <p className="text-xs text-[var(--text-muted)] font-light">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
