import React from 'react';
import { motion } from 'motion/react';
import { Heart, Users, ChevronRight, Award, Zap } from 'lucide-react';

export const HerEngineering = () => {
  return (
    <section className="py-32 relative overflow-hidden bg-surface" id="her">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full translate-x-1/2" />
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          <div className="lg:col-span-6" data-aos="fade-right">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-xl shadow-primary/5">
                <Heart size={24} fill="currentColor" />
              </div>
              <div>
                <span className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-400 block mb-1">Empowerment Initiative</span>
                <div className="h-px w-24 bg-primary/20" />
              </div>
            </div>

            <h2 className="text-5xl md:text-7xl font-display font-black mb-10 tracking-tighter leading-[1.1] text-secondary">
              Her<span className="text-primary italic">Engineering</span> Legacy
            </h2>
            
            <p className="text-xl text-slate-500 mb-12 leading-relaxed font-light">
              Empowering the next generation of female engineers through specialized technical workshops, career bridging, and a global alumni network.
            </p>
            
            <div className="grid grid-cols-2 gap-8 mb-12">
              {[
                { title: "Strategic Mentorship", icon: Users },
                { title: "Technical Bootcamps", icon: Zap },
                { title: "Industry Placement", icon: Award },
                { title: "Network Access", icon: Users },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-lg bg-primary/5 flex items-center justify-center text-primary mt-1">
                    <item.icon size={14} />
                  </div>
                  <span className="text-sm font-bold text-secondary uppercase tracking-widest leading-snug">{item.title}</span>
                </div>
              ))}
            </div>

            <button className="group py-6 px-12 bg-secondary hover:bg-primary text-white font-bold rounded-2xl transition-all flex items-center gap-4 shadow-2xl shadow-secondary/20 uppercase tracking-widest text-xs">
              Explore the Program <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="lg:col-span-6 relative" data-aos="fade-left">
            <div className="relative z-10 grid grid-cols-12 gap-4">
              <div className="col-span-6 space-y-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="rounded-[3rem] overflow-hidden aspect-[3/4] shadow-2xl"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1573164067507-40e1d6a42741?auto=format&fit=crop&q=80" 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" alt="Female Engineer" 
                  />
                </motion.div>
              </div>
              <div className="col-span-6 pt-12 space-y-4">
                <motion.div 
                   initial={{ opacity: 0, y: 40 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2 }}
                  className="rounded-[3rem] overflow-hidden aspect-[3/4] shadow-2xl border-8 border-white"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80" 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" alt="Mentorship Session" 
                  />
                </motion.div>
              </div>
            </div>

            {/* Overlapping Impact Card */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white p-10 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-50 min-w-[280px]"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-primary/10 rounded-[1.25rem] flex items-center justify-center text-primary">
                  <Users size={32} />
                </div>
                <div>
                  <div className="text-4xl font-display font-black text-secondary tracking-tighter">850+</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Initiative Alumni</div>
                </div>
              </div>
            </motion.div>
            
            {/* Background geometric element */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 border-[20px] border-primary/5 rounded-full z-0" />
          </div>
        </div>
      </div>
    </section>
  );
};
