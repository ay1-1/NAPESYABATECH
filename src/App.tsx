import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { DepartmentGrid } from './components/DepartmentGrid';
import { LatestPublications } from './components/LatestPublications';
import { Associations } from './components/Associations';
import { HerEngineering } from './components/HerEngineering';
import { Footer } from './components/Footer';

export default function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  return (
    <div className="min-h-screen selection:bg-primary selection:text-white bg-surface">
      <Navbar />
      
      <main>
        <Hero />
        
        <Stats />
        
        <div id="vault">
          <DepartmentGrid />
        </div>
        
        <div id="news">
          <LatestPublications />
        </div>

        <Associations />
        
        <div id="her">
          <HerEngineering />
        </div>

        {/* Industrial CTA Section */}
        <section className="py-40 relative bg-surface">
          <div className="container mx-auto px-6">
            <div 
              data-aos="zoom-in"
              className="p-16 md:p-32 rounded-[4rem] bg-secondary border border-white/5 relative overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
            >
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[120px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 blur-[100px] translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10 text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-white/5 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-12">
                   Institutional Hub Access
                </div>
                <h2 className="text-5xl md:text-8xl font-display font-black mb-10 text-white tracking-tighter leading-[0.9]">
                  Ready to Build the <span className="text-primary italic">Future?</span>
                </h2>
                <p className="text-xl md:text-2xl text-white/50 mb-16 leading-relaxed font-light">
                  Join the official NAPES Yabatech portal today. Pay your dues, access resources, and get connected with top industry partners across the globe.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                  <button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-black px-12 py-6 rounded-[2rem] transition-all shadow-2xl shadow-primary/20 uppercase tracking-widest text-xs">
                    Create Student Profile
                  </button>
                  <button className="w-full sm:w-auto bg-white/5 hover:bg-primary transition-all px-12 py-6 rounded-[2rem] border border-white/10 text-white font-black uppercase tracking-widest text-xs">
                    Legacy Program Signup
                  </button>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-12 left-12 w-24 h-px bg-white/10" />
              <div className="absolute top-12 left-12 h-24 w-px bg-white/10" />
              <div className="absolute bottom-12 right-12 w-24 h-px bg-white/10" />
              <div className="absolute bottom-12 right-12 h-24 w-px bg-white/10" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

