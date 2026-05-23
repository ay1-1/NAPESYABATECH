import React from 'react';
import { motion } from 'motion/react';
import { Eye, Share2, Calendar, ArrowRight } from 'lucide-react';

const publications = [
  {
    title: "FYB Week 2025: The Kings Maker",
    date: "17 July, 2025",
    desc: "The moment we've all been waiting for is almost here! Celebrating our final year engineers with grandeur and industrial excellence.",
    views: "5.8k",
    shares: 124,
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80",
    tag: "Faculty News"
  },
  {
    title: "Personality of the Day: Engr. Ojo Oluwatobi",
    date: "15 July, 2025",
    desc: "A man of exceptional character and unwavering integrity. Highlighting top engineering students who represent the future of Nigerian tech.",
    views: "3.2k",
    shares: 89,
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80",
    tag: "Recognition"
  },
  {
    title: "Digitalized Engineering Library v2.0",
    date: "10 July, 2025",
    desc: "Moving towards a completely digitalized portal for all engineering resources. Access everything from technical drawings to seminar papers.",
    views: "1.5k",
    shares: 245,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80",
    tag: "Tech Update"
  }
];

export const LatestPublications = () => {
  return (
    <section className="py-32 bg-white" id="articles">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div data-aos="fade-right">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black mb-6 tracking-tight text-secondary leading-tight">
              Latest <span className="text-primary italic">Articles</span>
            </h2>
            <p className="text-slate-500 max-w-xl text-base md:text-lg font-light leading-relaxed">
              Stay updated with official announcements, student spotlights, and technical breakthroughs within the Faculty of Engineering.
            </p>
          </div>
          <button data-aos="fade-left" className="group flex items-center gap-3 bg-secondary text-white px-10 py-5 rounded-2xl font-bold text-xs tracking-widest uppercase hover:bg-primary shadow-xl shadow-secondary/10 transition-all">
            Browse All News <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {publications.map((news, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative h-[450px] rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
                <img src={news.image} alt={news.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                <span className="absolute top-8 left-8 bg-white/20 backdrop-blur-md border border-white/20 px-5 py-2 rounded-full text-[10px] font-bold text-white uppercase tracking-widest">
                  {news.tag}
                </span>

                <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between text-white/80">
                   <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest uppercase">
                    <span className="flex items-center gap-2"><Eye size={14} className="text-primary" /> {news.views}</span>
                    <span className="flex items-center gap-2"><Share2 size={14} className="text-primary" /> {news.shares}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest">
                    <Calendar size={14} className="text-primary" />
                    {news.date}
                  </div>
                </div>
              </div>
              
              <div className="px-4">
                <h3 className="text-xl font-display font-black text-secondary mb-3 tracking-tighter leading-snug group-hover:text-primary transition-colors">
                  {news.title}
                </h3>
                <p className="text-slate-500 text-sm md:text-base mb-6 line-clamp-2 leading-relaxed font-light">
                  {news.desc}
                </p>
                <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary group-hover:gap-4 transition-all">
                  Read Full Article <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
