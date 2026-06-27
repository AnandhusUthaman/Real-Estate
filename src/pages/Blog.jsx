import React, { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { luxuryBlogs } from '../data/mockData';
import { Calendar, Clock, Bookmark, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Blog() {
  const { showToast } = useGlobalContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Market Insights', 'Architecture & Design', 'Bespoke Lifestyle'];

  const filteredBlogs = luxuryBlogs.filter((post) => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.snippet.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-32 pb-24 bg-bg-cream min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header Title */}
        <div className="space-y-4 mb-16 max-w-xl">
          <span className="text-accent-gold font-sans font-semibold text-xs uppercase tracking-[0.2em] block">Journal</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-primary">Luxe Insights</h1>
          <p className="font-sans text-neutral-laurel leading-relaxed">
            Market briefs, architectural reviews, and high-end lifestyle profiles curated by our intelligence team.
          </p>
        </div>

        {/* Categories & Search Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6 mb-12 bg-primary text-bg-cream rounded-[18px] p-4 border border-accent-gold/20 shadow-luxury">
          {/* Category Badges */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-[12px] text-xs font-sans font-semibold tracking-wider uppercase transition-all ${
                  activeCategory === cat
                    ? 'bg-accent-gold text-primary shadow-sm'
                    : 'text-bg-cream/80 hover:text-bg-cream hover:bg-secondary/25'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative flex-grow max-w-xs md:max-w-sm">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-laurel" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-secondary/15 border-accent-gold/20 text-bg-cream placeholder:text-neutral-laurel/60 w-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent-gold"
            />
          </div>
        </div>

        {/* Blogs Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20 bg-bg-cream border border-neutral-laurel/20 rounded-[18px] p-8 space-y-4">
            <h3 className="font-display text-2xl font-bold text-primary">No Articles Found</h3>
            <p className="font-sans text-sm text-neutral-laurel max-w-xs mx-auto">
              We couldn't find any intelligence briefs matching your refined keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {filteredBlogs.map((post) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-bg-cream border border-neutral-laurel/20 rounded-[18px] overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between group h-full"
              >
                <div className="relative overflow-hidden aspect-[16/10]">
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-bg-cream font-sans font-bold text-[10px] tracking-widest uppercase py-1.5 px-3 rounded-[50px] border border-accent-gold/25">
                    {post.category}
                  </div>
                </div>

                <div className="p-8 flex flex-col justify-between flex-grow">
                  <div className="space-y-4">
                    <div className="flex gap-4 items-center text-xs font-sans text-neutral-laurel">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-accent-gold" /> {post.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-accent-gold" /> {post.readTime}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-primary leading-snug tracking-wide group-hover:text-secondary transition-colors duration-300">
                      {post.title}
                    </h3>

                    <p className="font-sans text-sm text-primary/75 leading-relaxed">
                      {post.snippet}
                    </p>
                  </div>

                  <div className="border-t border-neutral-laurel/20 pt-6 mt-8 flex justify-between items-center">
                    <button
                      onClick={() => showToast('Full article is loading - demo mode', 'info')}
                      className="text-accent-gold font-sans font-semibold text-xs uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1"
                    >
                      Read Brief <span>→</span>
                    </button>
                    <button
                      onClick={() => showToast('Article bookmarked!', 'success')}
                      className="text-neutral-laurel hover:text-primary transition-colors"
                      aria-label="Bookmark article"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
