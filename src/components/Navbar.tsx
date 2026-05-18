import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, User } from 'lucide-react';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Articles', href: '#articles' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Support', href: '#support' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3 sm:py-4 glass-navbar shadow-lg shadow-secondary/5' : 'py-4 sm:py-6 lg:py-8 bg-transparent'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2 shadow-xl shadow-primary/10 group-hover:rotate-6 transition-transform">
            <img 
              src="/napeslogo.jpg" 
              alt="NAPES Logo" 
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <div className="flex flex-col">
            <span className={`font-display font-black text-2xl tracking-tighter leading-none transition-colors ${scrolled ? 'text-secondary' : 'text-white'}`}>NAPES</span>
            <span className="text-[10px] text-primary tracking-[0.4em] font-bold uppercase">Yabatech Hub</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-12">
          {navLinks.map(link => (
            <a 
              key={link.name} 
              href={link.href} 
              className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-all relative group flex items-center gap-1 ${scrolled ? 'text-slate-600 hover:text-primary' : 'text-white/80 hover:text-white'}`}
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button className={`hidden sm:flex items-center gap-3 px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${
            scrolled 
              ? 'bg-secondary text-white hover:bg-primary shadow-lg shadow-secondary/10' 
              : 'bg-white/10 text-white hover:bg-white border border-white/20 hover:text-secondary'
          }`}>
            <User size={14} />
            Student Login
          </button>
          
          <button 
            className={`lg:hidden p-3 rounded-xl transition-all ${scrolled ? 'bg-primary/5 text-primary' : 'bg-white/10 text-white'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 glass-navbar overflow-hidden lg:hidden border-t border-slate-100"
          >
            <div className="p-10 flex flex-col gap-10 text-center bg-white">
              {navLinks.map(link => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-3xl font-display font-black tracking-tighter text-secondary hover:text-primary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px bg-slate-100" />
              <button className="bg-primary text-white font-black py-6 rounded-3xl text-xl tracking-widest uppercase shadow-xl shadow-primary/20">
                PORTAL ACCESS
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
