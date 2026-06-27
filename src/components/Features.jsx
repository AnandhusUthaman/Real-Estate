import React from 'react';
import { features } from '../data/mockData';

export default function Features() {
  return (
    <section id="features" className="section bg-[var(--bg-light)]">
      <div className="container">
        <div className="text-center mb-12 animate-fade-up">
          <span className="badge bg-white text-[var(--primary)] border border-[var(--primary)] mb-3">Why Choose Us</span>
          <h2 className="section-title">The HomeVerse Advantage</h2>
          <p className="section-subtitle">We go beyond listing properties — we build lasting relationships.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, idx) => (
            <div key={idx} className="feature-card text-center p-6 bg-white rounded-[var(--radius)] shadow-sm transition duration-300 animate-fade-up">
              <div
                className="feature-icon mx-auto mb-4"
                style={{ backgroundColor: `${f.color}20`, color: f.color }}
              >
                <i className={`fas ${f.icon}`}></i>
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
