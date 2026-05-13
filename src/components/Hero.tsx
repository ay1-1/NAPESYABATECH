import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ArrowRight, Cpu, ShieldCheck } from 'lucide-react';

export const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Split text animation logic (simple version for the component)
      const title = titleContainerRef.current;
      if (title) {
        const text = title.innerText;
        title.innerHTML = text.split("").map(char => 
          `<span class="char inline-block">${char === " " ? "&nbsp;" : char}</span>`
        ).join("");

        gsap.from(".char", {
          opacity: 0,
          y: 60,
          filter: "blur(10px)",
          stagger: 0.03,
          duration: 1,
          ease: "back.out(1.7)",
          delay: 0.5
        });
      }

      gsap.from(subtitleRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 1.5
      });

      gsap.from(ctaRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        delay: 1.8,
        ease: "power2.out"
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 mesh-gradient"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-bold mb-12 tracking-widest uppercase"
        >
          <img src="/napes_logo.png" alt="NAPES" className="w-5 h-5 object-contain" />
          <span>NATIONAL ASSOCIATION OF POLYTECHNIC ENGINEERING STUDENTS</span>
        </motion.div>

        <h1 
          ref={titleContainerRef}
          className="text-6xl md:text-9xl font-display font-bold mb-8 tracking-tighter leading-[0.9] text-white text-glow"
        >
          NAPES YABATECH
        </h1>
        
        <p 
          ref={subtitleRef}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
        >
          Advancing engineering precision through a premium digital ecosystem. Resources, community, and governance—reimagined for the modern student.
        </p>

        <div 
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <button className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-primary font-bold px-10 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all group glow-accent">
            Portal Access
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="w-full sm:w-auto glass-card px-10 py-4 rounded-2xl transition-all font-semibold hover:bg-white/5">
            Engineering Vault
          </button>
        </div>

        <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-4 opacity-40">
          {[
            { label: "Research", icon: ShieldCheck },
            { label: "Community", icon: Cpu },
            { label: "Industry", icon: ArrowRight },
            { label: "Alumni", icon: ShieldCheck }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.3em]">
              <item.icon size={12} className="text-accent" />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
