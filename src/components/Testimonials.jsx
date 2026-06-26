import React from 'react';
import { testimonials } from '../data/mockData';

export default function Testimonials() {
  return (
    <section id="testimonials" class="section bg-white">
      <div class="container">
        <div class="text-center mb-12">
          <span class="badge bg-[var(--accent)] text-[var(--primary)] mb-3">Testimonials</span>
          <h2 class="section-title">What Our Clients Say</h2>
          <p class="section-subtitle">Real experiences from real homeowners and investors.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} class="testimonial-card flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, starIdx) => (
                    <span key={starIdx} class="star"><i class="fas fa-star"></i></span>
                  ))}
                </div>
                <p class="text-[var(--text-muted)] text-sm mb-4 leading-relaxed">"{t.text}"</p>
              </div>
              <div class="flex items-center gap-3 mt-4">
                <img src={t.avatar} alt={t.name} class="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p class="font-semibold text-sm">{t.name}</p>
                  <p class="text-xs text-[var(--text-muted)]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
