import React from 'react';
import { stats } from '../data/mockData';

export default function Stats() {
  return (
    <section id="stats" class="section bg-[var(--primary)] text-white">
      <div class="container">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, idx) => (
            <div key={idx} class="p-4">
              <div class="stats-number text-white font-extrabold text-4xl">{s.number}</div>
              <p class="text-white/70 mt-1 text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
