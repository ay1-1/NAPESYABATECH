import React from 'react';
import { motion } from 'motion/react';
import { Github, Twitter, Linkedin, Mail, MapPin, Phone, Instagram } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-secondary text-white pt-32 pb-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-20">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4 mb-8 group cursor-pointer">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2 shadow-2xl shadow-primary/20 group-hover:-rotate-3 transition-transform">
                <img 
                  src="/napeslogo.jpg" 
                  alt="NAPES Logo" 
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-3xl tracking-tighter leading-none">NAPES</span>
                <span className="text-[10px] text-primary tracking-[0.4em] font-bold uppercase">Yabatech Hub</span>
              </div>
            </div>
            
            <p className="text-white/60 max-w-sm mb-10 leading-relaxed font-light text-lg">
              Advancing engineering precision through a premium digital ecosystem. Empowering the next generation of Nigerian engineers at Yaba College of Technology.
            </p>

            <div className="flex gap-4">
              {[Twitter, Instagram, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/50 hover:bg-primary hover:text-white transition-all border border-white/10">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Ecosystem</h4>
              <ul className="space-y-4">
                {[
                  { name: 'Home', href: '#home' },
                  { name: 'Articles', href: '#articles' },
                  { name: 'Gallery', href: '#gallery' },
                  { name: 'Support Center', href: '#support' },
                ].map(item => (
                  <li key={item.name}>
                    <a href={item.href} className="text-white/50 hover:text-white transition-colors text-sm font-medium">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Governance</h4>
              <ul className="space-y-4">
                {['Executive Council', 'Electoral Body', 'Constitution', 'Financial Reports'].map(item => (
                  <li key={item}><a href="#" className="text-white/50 hover:text-white transition-colors text-sm font-medium">{item}</a></li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-white/50 text-sm">
                  <MapPin size={18} className="text-primary shrink-0" />
                  <span>Engineering Block, Yaba College of Technology, Lagos.</span>
                </li>
                <li className="flex items-center gap-3 text-white/50 text-sm">
                  <Phone size={18} className="text-primary shrink-0" />
                  <span>+234 812 345 6789</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/30 text-xs font-medium tracking-widest uppercase">
            &copy; 2026 NAPES Yabatech Council. Built for Precision.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-white/30 hover:text-white text-xs font-medium tracking-widest uppercase transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/30 hover:text-white text-xs font-medium tracking-widest uppercase transition-colors">Term of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
