import React, { useState, useEffect } from 'react';
import { Cpu, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Hub', href: '#' },
    { name: 'The Vault', href: '#vault' },
    { name: 'Publications', href: '#news' },
    { name: 'HerEngineering', href: '#her' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-4 glass-navbar' : 'py-8 bg-transparent'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-11 h-11 bg-accent rounded-2xl flex items-center justify-center text-primary font-black text-2xl group-hover:rotate-6 transition-transform glow-accent">
            N
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-xl tracking-tighter leading-none text-white">NAPES</span>
            <span className="text-[9px] text-accent/60 tracking-[0.4em] font-mono font-bold">YABATECH HUB</span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map(link => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-accent transition-all relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button className="hidden sm:flex items-center gap-2 bg-white/5 hover:bg-accent hover:text-primary border border-white/10 px-6 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all">
            <User size={14} />
            Student Login
          </button>
          
          <button 
            className="lg:hidden text-white p-2 glass-card rounded-xl"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 glass-navbar overflow-hidden lg:hidden"
          >
            <div className="p-8 flex flex-col gap-8 text-center bg-black/90">
              {navLinks.map(link => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-2xl font-display font-bold tracking-tight text-white hover:text-accent"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px bg-white/10" />
              <button className="bg-accent text-primary font-black py-5 rounded-[2rem] text-lg glow-accent">
                STUDENT PORTAL
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
