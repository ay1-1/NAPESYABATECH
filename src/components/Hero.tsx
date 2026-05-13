import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ArrowRight, Cpu, ShieldCheck } from 'lucide-react';

export const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.5
      });
      gsap.from(ctaRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 1.2
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 text-accent text-sm mb-8"
        >
          <Cpu size={14} />
          <span>Innovating Engineering Excellence</span>
        </motion.div>

        <h1 
          ref={titleRef}
          className="text-6xl md:text-8xl font-display font-bold mb-6 tracking-tight"
        >
          NAPES <span className="text-accent underline decoration-gold/50 decoration-4 underline-offset-8">YABATECH</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          The Hub for Nigeria's brightest engineering minds. Moving beyond basics to a premium digital resource and community ecosystem.
        </p>

        <div 
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="bg-accent hover:bg-accent/90 text-black font-bold px-8 py-4 rounded-xl flex items-center gap-2 transition-all group">
            Student Portal
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-xl transition-all">
            Browse Resources
          </button>
        </div>

        <div className="mt-20 flex justify-center gap-12 text-sm text-gray-500 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-accent" />
            SECURE ACCESS
          </div>
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-accent" />
            ALUMNI NETWORK
          </div>
        </div>
      </div>
    </section>
  );
};
