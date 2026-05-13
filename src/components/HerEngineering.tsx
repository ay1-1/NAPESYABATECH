import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GraduationCap, Heart, Users, ChevronRight } from 'lucide-react';

export const HerEngineering = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gold/5 blur-[120px] rounded-full" />
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div data-aos="fade-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 text-gold text-sm mb-6">
              <Heart size={14} fill="currentColor" />
              <span>Legacy Program</span>
            </div>
            <h2 className="text-5xl font-display font-bold mb-8">Her<span className="text-gold">Engineering</span></h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Empowering the next generation of female engineers through mentorship, specialized technical workshops, and direct industry placement.
            </p>
            
            <ul className="space-y-4 mb-10">
              {[
                "Strategic Career Mentorship",
                "Technical Skills Bootcamps",
                "Industry Networking Events",
                "Leadership Development"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>

            <button className="py-4 px-8 bg-gold hover:bg-gold/90 text-black font-bold rounded-xl transition-all flex items-center gap-2">
              Learn More About the Legacy <ChevronRight size={20} />
            </button>
          </div>

          <div className="relative" data-aos="fade-left">
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1573164067507-40e1d6a42741?auto=format&fit=crop&q=80&w=400" 
                className="rounded-3xl h-64 w-full object-cover mt-8" alt="Female Engineer" 
              />
              <img 
                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=400" 
                className="rounded-3xl h-80 w-full object-cover" alt="Mentorship Session" 
              />
            </div>
            {/* Overlay Float Card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass-card p-6 rounded-2xl border-gold/20 shadow-2xl shadow-gold/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                  <Users className="text-gold" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-display">850+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">Alumni Impacted</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
