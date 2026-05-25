import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LatestPublications } from './components/LatestPublications';
import { Gallery } from './components/Gallery';
import { Footer } from './components/Footer';
import { StudentPortal } from './components/StudentPortal';
import { AdminPortal } from './components/AdminPortal';
import { initLocalStorage } from './lib/mockData';

export default function App() {
  const [view, setView] = useState<'home' | 'portal' | 'admin'>('home');
  const [matricParam, setMatricParam] = useState('');

  useEffect(() => {
    // Initialize LocalStorage database
    initLocalStorage();

    // AOS initialization
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
    });

    // Simple routing based on URL search query parameters
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const matric = params.get('matric') || '';

    if (viewParam === 'portal') {
      setView('portal');
      setMatricParam(matric);
    } else if (viewParam === 'admin') {
      setView('admin');
    } else {
      setView('home');
    }
  }, []);

  const handleLogout = () => {
    // Clear URL parameters and return to home view
    window.location.href = window.location.origin + window.location.pathname;
  };

  // Render Portal Views
  if (view === 'portal') {
    return <StudentPortal onLogout={handleLogout} initialMatric={matricParam} />;
  }

  if (view === 'admin') {
    return <AdminPortal onLogout={handleLogout} />;
  }

  // Default Public Hub landing page
  return (
    <div className="min-h-screen selection:bg-primary selection:text-white bg-surface">
      <Navbar />
      
      <main>
        <Hero />
        
        <LatestPublications />
        
        <Gallery />
      </main>

      <Footer />
    </div>
  );
}
