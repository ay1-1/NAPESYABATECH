import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import { ArrowRight, ChevronLeft, ChevronRight, UserCheck } from 'lucide-react';

const carouselImages = [
  {
    url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80",
    title: "Precision Engineering",
    desc: "Advancing industrial standards through technical excellence."
  },
  {
    url: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80",
    title: "Digital Ecosystem",
    desc: "Resources, community, and governance—reimagined for modern students."
  },
  {
    url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80",
    title: "Future of Innovation",
    desc: "Empowering the next generation of Nigerian engineers."
  }
];

export const Hero = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const title = titleContainerRef.current;
      if (title) {
        const text = "NAPES YABATECH";
        title.innerHTML = text.split("").map(char => 
          `<span class="char inline-block">${char === " " ? "&nbsp;" : char}</span>`
        ).join("");

        gsap.from(".char", {
          opacity: 0,
          y: 40,
          filter: "blur(10px)",
          stagger: 0.04,
          duration: 0.8,
          ease: "expo.out",
          delay: 0.2
        });
      }
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img 
              src={carouselImages[activeSlide].url} 
              className="w-full h-full object-cover grayscale-[20%]" 
              alt="Engineering background" 
            />
            <div className="absolute inset-0 bg-secondary/70 backdrop-blur-[1px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-8"
            >
              <img src="/napes_logo.png" alt="NAPES" className="w-8 h-8 object-contain brightness-0 invert" />
              <div className="h-[1px] w-12 bg-primary/50" />
              <span className="text-white text-xs font-bold tracking-[0.4em] uppercase opacity-80">Premium Engineering Portal</span>
            </motion.div>

            <h1 
              ref={titleContainerRef}
              className="text-6xl md:text-[8rem] font-display font-black mb-10 tracking-tighter leading-none text-white drop-shadow-2xl"
            >
              NAPES YABATECH
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mb-12 leading-relaxed font-light">
              Advancing engineering precision through a premium digital ecosystem. Resources, community, and governance—reimagined for the modern student.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold px-12 py-5 rounded-2xl flex items-center justify-center gap-3 transition-all group shadow-2xl shadow-primary/40 uppercase tracking-widest text-sm">
                Student Portal
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-12 py-5 rounded-2xl transition-all font-semibold text-sm uppercase tracking-widest">
                Explore Vault
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100"
            >
              <div className="flex items-center gap-5 mb-10">
                <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                  <UserCheck size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-display font-bold text-secondary tracking-tight">Portal Access</h3>
                  <p className="text-slate-500 text-sm">Welcome back to the Vault</p>
                </div>
              </div>

              <div className="space-y-5 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-4">Matriculation Number</label>
                  <input 
                    type="text" 
                    placeholder="F/HD/21/..." 
                    className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all text-sm font-medium" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-4">Portal Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all text-sm font-medium" 
                  />
                </div>
              </div>

              <button className="w-full bg-primary text-white font-bold py-6 rounded-2xl hover:bg-primary/95 transition-all mb-6 text-sm tracking-widest uppercase shadow-xl shadow-primary/20">
                Enter Dashboard
              </button>
              
              <div className="text-center">
                <a href="#" className="text-xs text-slate-400 hover:text-primary transition-colors font-medium">Forgot portal credentials?</a>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-12 left-6 right-6 flex items-center justify-between">
          <div className="flex gap-4">
            {carouselImages.map((_, i) => (
              <button 
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`carousel-dot ${activeSlide === i ? 'carousel-dot-active' : ''}`}
              />
            ))}
          </div>
          <div className="flex gap-6">
            <button 
              onClick={() => setActiveSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)}
              className="p-4 rounded-full border border-white/20 text-white hover:bg-white/10 hover:border-white transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => setActiveSlide((prev) => (prev + 1) % carouselImages.length)}
              className="p-4 rounded-full border border-white/20 text-white hover:bg-white/10 hover:border-white transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
