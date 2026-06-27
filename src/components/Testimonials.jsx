import React from 'react';
import { testimonials } from '../data/mockData';

export default function Testimonials() {
  return (
    <section id="testimonials" className="section bg-white">
      <div className="container">
        <div className="text-center mb-12 animate-fade-up">
          <span className="badge bg-[var(--accent)] text-[var(--primary)] mb-3">Testimonials</span>
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle">Real experiences from real homeowners and investors.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="testimonial-card flex flex-col justify-between animate-fade-up">
              <div>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, starIdx) => (
                    <span key={starIdx} className="star"><i className="fas fa-star"></i></span>
                  ))}
                </div>
                <p className="text-[var(--text-muted)] text-sm mb-4 leading-relaxed">"{t.text}"</p>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
