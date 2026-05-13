import React from 'react';
import { ArrowUpRight, Hammer, Lightbulb, Zap, HardHat, Pickaxe } from 'lucide-react';

const departments = [
  { name: 'Civil Engineering', icon: HardHat, desc: 'Structural precision and urban development.', count: '142 Files' },
  { name: 'Mechanical Engineering', icon: Hammer, desc: 'Fluid dynamics and robotic automation.', count: '210 Files' },
  { name: 'Electrical/Elect Engineering', icon: Zap, desc: 'Circuit designs and power systems.', count: '185 Files' },
  { name: 'Computer Engineering', icon: Lightbulb, desc: 'Algorithms, IoT and hardware architecture.', count: '320 Files' },
  { name: 'Chemical Engineering', icon: Pickaxe, desc: 'Process engineering and material sciences.', count: '98 Files' },
];

export const DepartmentGrid = () => {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div data-aos="fade-right">
            <h2 className="text-5xl font-display font-bold mb-6 tracking-tight">The Engineering <span className="text-accent">Vault</span></h2>
            <p className="text-slate-400 max-w-xl text-lg font-light leading-relaxed">
              Standard polytechnic curricula meeting industrial reality. Browse technical papers, projects, and department-specific archives.
            </p>
          </div>
          <button data-aos="fade-left" className="group text-accent hover:text-white transition-all flex items-center gap-3 font-medium uppercase text-xs tracking-widest border border-accent/20 px-8 py-4 rounded-xl hover:bg-accent/10">
            Access Full Library <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept, i) => (
            <div 
              key={i}
              data-aos="fade-up"
              data-aos-delay={i * 100}
              className="glass-card p-10 rounded-[2rem] group cursor-pointer relative overflow-hidden flex flex-col h-full"
            >
              <div className="absolute -top-12 -right-12 p-4 opacity-[0.03] group-hover:opacity-[0.1] group-hover:scale-110 transition-all duration-700">
                <dept.icon size={200} />
              </div>
              
              <div className="flex justify-between items-start mb-10">
                <div className="w-16 h-16 bg-accent/5 rounded-2xl flex items-center justify-center border border-accent/10 group-hover:border-accent/40 group-hover:bg-accent/10 transition-all">
                  <dept.icon className="text-accent" size={32} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-1">Archive</span>
                  <span className="text-xs font-bold text-accent">{dept.count}</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 tracking-tight group-hover:text-accent transition-colors">{dept.name}</h3>
              <p className="text-slate-400 mb-8 text-sm leading-relaxed font-light">{dept.desc}</p>
              
              <div className="mt-auto flex items-center gap-3 text-white font-semibold text-xs tracking-widest group-hover:text-accent transition-all">
                EXPLORE REPOSITORY <ArrowUpRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
