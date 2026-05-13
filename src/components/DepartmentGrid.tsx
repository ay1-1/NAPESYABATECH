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
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-display font-bold mb-4">Academic <span className="text-accent">Vault</span></h2>
            <p className="text-gray-400 max-w-lg">Access a deep repository of technical papers, past projects, and department-specific tutorials.</p>
          </div>
          <button className="text-accent hover:text-white transition-colors flex items-center gap-2 font-medium">
            View All Departments <ArrowUpRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept, i) => (
            <div 
              key={i}
              data-aos="zoom-in-up"
              data-aos-delay={i * 50}
              className="glass-card p-8 rounded-2xl group hover:border-accent/40 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 group-hover:scale-125 transition-all">
                <dept.icon size={120} />
              </div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-accent/10 rounded-xl">
                  <dept.icon className="text-accent" size={24} />
                </div>
                <span className="text-xs font-mono text-gray-500 bg-white/5 py-1 px-3 rounded-full">{dept.count}</span>
              </div>
              
              <h3 className="text-2xl font-bold mb-3">{dept.name}</h3>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">{dept.desc}</p>
              
              <div className="flex items-center gap-2 text-accent font-medium text-sm group-hover:underline">
                Explore Library <ArrowUpRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
