import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const associations = [
  { name: 'NACOMES', icon: '💻', desc: 'Computer Engineering Students' },
  { name: 'NAEES', icon: '⚡', desc: 'Electrical/Elect Engineering' },
  { name: 'NAMES', icon: '⚙️', desc: 'Mechanical Engineering' },
  { name: 'NICE', icon: '🏗️', desc: 'Civil Engineering Students' },
];

export const Associations = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-display font-bold mb-16">Departmental <span className="text-accent">Associations</span></h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {associations.map((assoc, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.05 }}
              className="glass-card p-8 rounded-2xl border-white/5 flex flex-col items-center group cursor-pointer"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{assoc.icon}</div>
              <h3 className="font-bold text-xl mb-2 text-accent">{assoc.name}</h3>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-6">{assoc.desc}</p>
              <button className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                Visit Hive <ExternalLink size={12} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
