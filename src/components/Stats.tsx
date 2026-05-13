import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, Users, Rocket, Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { label: 'Total Members', value: 5000, suffix: '+', icon: Users, color: 'text-blue-400' },
  { label: 'Resources Ready', value: 1200, suffix: '', icon: BookOpen, color: 'text-accent' },
  { label: 'Completed Projects', value: 450, suffix: '+', icon: Rocket, color: 'text-orange-400' },
  { label: 'Active Alumni', value: 2500, suffix: '', icon: Award, color: 'text-gold' },
];

export const Stats = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      stats.forEach((_, i) => {
        const target = { val: 0 };
        gsap.to(target, {
          val: stats[i].value,
          duration: 2,
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
    <section className="py-32 bg-primary relative border-y border-white/5" ref={containerRef}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-24">
          {stats.map((stat, i) => (
            <div 
              key={i}
              className="text-center group"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:border-accent/30 transition-all duration-500">
                  <stat.icon className={`w-8 h-8 ${stat.color} group-hover:scale-110 transition-transform`} />
                </div>
              </div>
              <h3 
                id={`stat-val-${i}`}
                className="text-4xl md:text-5xl font-display font-bold mb-3 tracking-tighter"
              >
                0
              </h3>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-[0.2em]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
