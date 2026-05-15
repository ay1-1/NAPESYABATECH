import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

const departments = [
  { 
    name: 'Mechanical Engineering', 
    desc: 'The study of machines and systems that move the world. Access HND/ND technical papers.', 
    count: '1,200+ Projects', 
    image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80'
  },
  { 
    name: 'Electrical Engineering', 
    desc: 'Powering innovation through circuits and energy systems. Laboratory reports and archives.', 
    count: '950+ Projects', 
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80'
  },
  { 
    name: 'Civil Engineering', 
    desc: 'Designing the infrastructure and foundations of society. From structural analysis to urban planning.', 
    count: '800+ Projects', 
    image: 'https://images.unsplash.com/photo-1541888941259-792739460273?auto=format&fit=crop&q=80'
  },
  { 
    name: 'Computer Engineering', 
    desc: 'The intersection of hardware systems and software intelligence. Algorithms and hardware design.', 
    count: '1,500+ Projects', 
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80'
  },
  { 
    name: 'Mechatronics Engineering', 
    desc: 'Robotics and automation for the industrial 4.0 revolution. Intelligent control systems.', 
    count: '600+ Projects', 
    image: 'https://images.unsplash.com/photo-1565152345636-2396e952aa66?auto=format&fit=crop&q=80'
  },
];

export const DepartmentGrid = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-32 relative bg-surface overflow-hidden" id="vault">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div data-aos="fade-right">
            <h2 className="text-5xl font-display font-black mb-6 tracking-tight text-secondary leading-tight">
              Engineering <span className="text-primary italic">Archives</span>
            </h2>
            <p className="text-slate-500 max-w-xl text-lg font-light leading-relaxed">
              Advancing engineering precision through a premium digital ecosystem. Resources, community, and governance—reimagined for every student across the faculty.
            </p>
          </div>
          
          <div className="flex gap-4" data-aos="fade-left">
            <button 
              onClick={() => scroll('left')}
              className="p-5 rounded-[2rem] bg-white border border-slate-200 text-secondary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm group"
            >
              <ChevronLeft size={24} className="group-active:scale-95 transition-transform" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-5 rounded-[2rem] bg-white border border-slate-200 text-secondary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm group"
            >
              <ChevronRight size={24} className="group-active:scale-95 transition-transform" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-10 overflow-x-auto pb-12 snap-x snap-mandatory hide-scrollbar group -mx-4 px-4 pr-20"
        >
          {departments.map((dept, i) => (
            <motion.div 
              key={i}
              className="min-w-[340px] md:min-w-[500px] h-[650px] rounded-[3.5rem] overflow-hidden relative snap-start group/card cursor-pointer shadow-xl border border-slate-100"
            >
              <img 
                src={dept.image} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-105" 
                alt={dept.name} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/20 to-transparent opacity-85 group-hover/card:opacity-95 transition-opacity duration-500" />
              
              <div className="absolute bottom-0 left-0 right-0 p-14 translate-y-6 group-hover/card:translate-y-0 transition-transform duration-700">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold uppercase tracking-[0.2em]">
                    {dept.count}
                  </span>
                </div>
                <h3 className="text-4xl font-display font-black text-white mb-6 tracking-tighter leading-tight">{dept.name}</h3>
                <p className="text-white/80 mb-10 text-base leading-relaxed font-light opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 max-w-sm">
                  {dept.desc}
                </p>
                <div className="flex items-center gap-4 text-white font-bold text-[10px] tracking-[0.3em] uppercase group-hover/card:text-primary transition-colors">
                  ENTER REPOSITORY <ArrowUpRight size={18} className="text-primary" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
