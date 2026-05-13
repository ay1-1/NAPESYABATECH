import React from 'react';
import { motion } from 'framer-motion';
import { Eye, MessageCircle, Share2, Calendar } from 'lucide-react';

const publications = [
  {
    title: "FYB Week 2025: The Kings Maker",
    date: "Thursday, 17 July, 2025",
    desc: "The moment we've all been waiting for is almost here! Celebrating our final year engineers with grandeur.",
    views: 580,
    shares: 1,
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800",
    tag: "News"
  },
  {
    title: "FYB Personality of the Day: Ojo Oluwatobi",
    date: "Thursday, 17 July, 2025",
    desc: "A man of exceptional character and unwavering integrity. Highlighting top engineering students.",
    views: 349,
    shares: 1,
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
    tag: "Recognition"
  },
  {
    title: "NAPES YABATECH Launches Hub",
    date: "Thursday, 17 July, 2025",
    desc: "Moving towards a completely digitalized portal for all engineering resources and fees management.",
    views: 182,
    shares: 5,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    tag: "Update"
  }
];

export const LatestPublications = () => {
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-display font-bold mb-16">Latest <span className="text-blue-400">Publications</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {publications.map((news, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="bg-[#1a1a1a] rounded-3xl overflow-hidden text-left flex flex-col h-full border border-white/5"
            >
              <div className="relative h-56 overflow-hidden">
                <img src={news.image} alt={news.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                <span className="absolute top-4 right-4 bg-red-600 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-tighter">
                  {news.tag}
                </span>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 uppercase font-mono">
                  <Calendar size={12} />
                  {news.date}
                </div>
                <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-accent transition-colors">{news.title}</h3>
                <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">{news.desc}</p>
                
                <div className="mt-auto flex items-center justify-between">
                  <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                    Read more
                  </button>
                  <div className="flex items-center gap-4 text-gray-500 text-xs">
                    <span className="flex items-center gap-1"><Eye size={14} /> {news.views}</span>
                    <span className="flex items-center gap-1"><Share2 size={14} /> {news.shares}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
