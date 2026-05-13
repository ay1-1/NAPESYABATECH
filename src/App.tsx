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
    <div className="min-h-screen selection:bg-accent selection:text-black">
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
        <section className="py-24 relative">
          <div className="container mx-auto px-6">
            <div className="glass-card p-12 md:p-20 rounded-[2rem] border-accent/20 bg-gradient-to-br from-primary/20 via-black to-accent/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">
                  Ready to Build the <span className="text-accent underline decoration-gold/30 underline-offset-8">Future?</span>
                </h2>
                <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                  Join the official NAPES Yabatech portal today. Pay your dues, access resources, and get connected with top industry partners.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <button className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-black font-bold px-10 py-5 rounded-2xl transition-all shadow-xl shadow-accent/20">
                    Create Student Profile
                  </button>
                  <button className="w-full sm:w-auto bg-white/5 hover:bg-white/10 px-10 py-5 rounded-2xl border border-white/10 transition-all">
                    Legacy Program Signup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

