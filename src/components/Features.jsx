import React from 'react';
import { features } from '../data/mockData';

export default function Features() {
  return (
    <section id="features" className="section bg-[var(--bg-light)]">
      <div className="container">
        <div className="text-center mb-16 animate-fade-up">
          <span className="inline-block text-[var(--secondary)] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Our Core Philosophy</span>
          <h2 className="section-title">The Altheia Advantage</h2>
          <p className="section-subtitle">We curate experiences that exceed expectations, building generations of trust.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-gray-100/80 p-8 rounded text-center transition-all duration-500 hover:shadow-lg hover:-translate-y-1.5 hover:border-[var(--secondary)] animate-fade-up"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 text-lg transition-transform duration-500 hover:scale-110"
                style={{ backgroundColor: `${f.color}15`, color: f.color }}
              >
                <i className={`fas ${f.icon}`}></i>
              </div>
              <h3 className="font-serif font-medium text-lg text-[var(--primary)] mb-3">{f.title}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-light">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
