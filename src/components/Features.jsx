import React from 'react';
import { features } from '../data/mockData';

export default function Features() {
  return (
    <section id="features" class="section bg-[var(--bg-light)]">
      <div class="container">
        <div class="text-center mb-12">
          <span class="badge bg-white text-[var(--primary)] border border-[var(--primary)] mb-3">Why Choose Us</span>
          <h2 class="section-title">The HomeVerse Advantage</h2>
          <p class="section-subtitle">We go beyond listing properties — we build lasting relationships.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, idx) => (
            <div key={idx} class="text-center p-6 bg-white rounded-[var(--radius)] shadow-sm hover:shadow-md transition duration-300">
              <div
                class="feature-icon mx-auto mb-4"
                style={{ backgroundColor: `${f.color}20`, color: f.color }}
              >
                <i class={`fas ${f.icon}`}></i>
              </div>
              <h3 class="font-bold text-lg mb-2">{f.title}</h3>
              <p class="text-sm text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
