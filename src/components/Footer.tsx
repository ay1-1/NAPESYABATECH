import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="pt-24 pb-12 bg-[#050505] border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1">
                <img 
                  src="/napes_logo.png" 
                  alt="NAPES Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<div class="text-primary font-black text-xl">N</div>';
                    e.currentTarget.parentElement!.classList.add('bg-accent');
                  }}
                />
              </div>
              <div className="font-display font-bold text-xl tracking-tight">NAPES <span className="text-accent uppercase">Yabatech</span></div>
            </div>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Leading the innovation wave in Polytechnic engineering education. Building systems that matter.
            </p>
            <div className="flex gap-4">
              {[Twitter, Instagram, Linkedin, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-accent hover:text-black transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold mb-6 text-lg">The Hub</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">Resources Library</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Student Portal</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Career Hub</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Payment Gateway</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold mb-6 text-lg">Community</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">HerEngineering</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Alumni Network</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Technical Clubs</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Election Portal</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold mb-6 text-lg">Contact Us</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-accent shrink-0" />
                <span>School of Engineering, Yaba College of Technology, Lagos State.</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-accent shrink-0" />
                <span>info@napesyabatech.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-600 text-xs font-mono">© 2026 NAPES YABATECH. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8 text-gray-600 text-xs font-mono">
            <a href="#" className="hover:text-white">PRIVACY POLICY</a>
            <a href="#" className="hover:text-white">TERMS OF SERVICE</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
