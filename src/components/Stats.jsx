import React from 'react';
import { stats } from '../data/mockData';

export default function Stats() {
  return (
    <section id="stats" className="py-16 bg-[#07111D] border-y border-gray-800 animate-fade-in">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-800">
          {stats.map((s, idx) => (
            <div key={idx} className="py-4 md:py-2 animate-fade-up">
              <div className="font-serif font-light text-4xl lg:text-5xl text-[var(--secondary)]">{s.number}</div>
              <p className="text-gray-400 mt-2 text-xs font-medium uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
