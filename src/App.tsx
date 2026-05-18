import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LatestPublications } from './components/LatestPublications';
import { Gallery } from './components/Gallery';
import { Support } from './components/Support';
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
        
        <LatestPublications />
        
        <Gallery />
        
        <Support />
      </main>

      <Footer />
    </div>
  );
}

