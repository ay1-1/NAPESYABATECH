import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, ShieldCheck } from 'lucide-react';

const associations = [
  { name: 'NACOMES', desc: 'Computer Engineering', icon: ShieldCheck },
  { name: 'NAEES', desc: 'Electrical Engineering', icon: ShieldCheck },
  { name: 'NAMES', desc: 'Mechanical Engineering', icon: ShieldCheck },
  { name: 'NICE', desc: 'Civil Engineering', icon: ShieldCheck },
  { name: 'NIESA', desc: 'Industrial Engineering', icon: ShieldCheck },
  { name: 'NSChE', desc: 'Chemical Engineering', icon: ShieldCheck },
];

export const Associations = () => {
  return (
    <section className="py-24 bg-white border-y border-slate-100 overflow-hidden">
      <div className="container mx-auto px-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="h-px w-12 bg-primary" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Departmental Affiliates</h2>
        </div>
      </div>
      
      <div className="flex relative">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-12 whitespace-nowrap px-6"
        >
          {[...associations, ...associations].map((assoc, i) => (
            <div 
              key={i}
              className="flex items-center gap-6 px-10 py-6 rounded-3xl bg-slate-50 border border-slate-100 group cursor-pointer hover:bg-white hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                <assoc.icon size={24} />
              </div>
              <div>
                <h3 className="font-display font-black text-xl text-secondary group-hover:text-primary transition-colors tracking-tighter">{assoc.name}</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{assoc.desc}</p>
              </div>
              <ExternalLink size={14} className="text-slate-300 group-hover:text-primary ml-4" />
            </div>
          ))}
        </motion.div>

        {/* Fades */}
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-white to-transparent z-10" />
      </div>
    </section>
  );
};
