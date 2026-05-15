import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, Users, Rocket, Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { label: 'Portal Members', value: 5000, suffix: '+', icon: Users },
  { label: 'Technical Archives', value: 1200, suffix: '', icon: BookOpen },
  { label: 'Innovation Projects', value: 450, suffix: '+', icon: Rocket },
  { label: 'Verified Alumni', value: 2500, suffix: '', icon: Award },
];

export const Stats = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      stats.forEach((_, i) => {
        const target = { val: 0 };
        gsap.to(target, {
          val: stats[i].value,
          duration: 2.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
          onUpdate: () => {
            const el = document.getElementById(`stat-val-${i}`);
            if (el) el.innerText = Math.floor(target.val).toLocaleString() + stats[i].suffix;
          }
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-40 bg-secondary relative overflow-hidden" ref={containerRef}>
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 border-[40px] border-primary rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 border-[40px] border-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
          {stats.map((stat, i) => (
            <div 
              key={i}
              className="text-center group relative z-10"
            >
              <div className="flex justify-center mb-10">
                <div className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-2xl">
                  <stat.icon size={32} />
                </div>
              </div>
              <h3 
                id={`stat-val-${i}`}
                className="text-5xl md:text-7xl font-display font-black mb-4 tracking-tighter text-white drop-shadow-2xl"
              >
                0
              </h3>
              <div className="flex flex-col items-center gap-2">
                <div className="h-0.5 w-12 bg-primary/30 group-hover:w-20 group-hover:bg-primary transition-all duration-700" />
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
