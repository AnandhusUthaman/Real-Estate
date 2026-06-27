import React from 'react';
import { stats } from '../data/mockData';

export default function Stats() {
  return (
    <section id="stats" className="section bg-[var(--primary)] text-white animate-fade-in">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, idx) => (
            <div key={idx} className="p-4 animate-fade-up">
              <div className="stats-number text-white font-extrabold text-4xl">{s.number}</div>
              <p className="text-white/70 mt-1 text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
