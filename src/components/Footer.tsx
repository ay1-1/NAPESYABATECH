import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Twitter, Linkedin, Mail, MapPin, Phone, Instagram, Send, Sparkles, Loader2, ShieldAlert } from 'lucide-react';
import { getTickets, saveTickets, SupportTicket } from '../lib/mockData';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('portal');
  const [message, setMessage] = useState('');
  const [ticketStatus, setTicketStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;

    setTicketStatus('sending');

    setTimeout(() => {
      const newTicket: SupportTicket = {
        id: `ticket-${Date.now()}`,
        email: email.trim(),
        subject,
        message: message.trim(),
        date: new Date().toISOString(),
        status: 'open'
      };

      const allTickets = [newTicket, ...getTickets()];
      saveTickets(allTickets);

      setTicketStatus('sent');
      setEmail('');
      setMessage('');

      setTimeout(() => setTicketStatus('idle'), 4000);
    }, 1200);
  };

  return (
    <footer className="bg-secondary text-white pt-24 pb-16 relative overflow-hidden" id="support">
      {/* Top thin line gradient divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Background blurs */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-16 items-start">
          {/* Column 1: Info & Brand */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2 shadow-2xl shadow-primary/20 group-hover:-rotate-3 transition-transform">
                <img 
                  src="/napeslogo.jpg" 
                  alt="NAPES Logo" 
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-2xl tracking-tighter leading-none">NAPES</span>
                <span className="text-[10px] text-primary tracking-[0.4em] font-bold uppercase">Yabatech Hub</span>
              </div>
            </div>
            
            <p className="text-white/60 leading-relaxed font-light text-sm max-w-sm">
              Advancing engineering precision through a premium digital ecosystem. Empowering the next generation of polytechnic engineers at Yaba College of Technology.
            </p>

            <div className="flex gap-3">
              {[Twitter, Instagram, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50 hover:bg-primary hover:text-white transition-all border border-white/10">
                  <Icon size={16} />
                </a>
              ))}
            </div>

            <div className="pt-4">
              <a 
                href="/?view=admin" 
                target="_blank" 
                className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-primary transition-all bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/5 hover:border-primary/20"
              >
                <ShieldAlert size={12} /> Admin Dashboard Access
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-8">
            <div className="space-y-5">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Ecosystem</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Home', href: '#home' },
                  { name: 'Articles', href: '#articles' },
                  { name: 'Gallery', href: '#gallery' },
                ].map(item => (
                  <li key={item.name}>
                    <a href={item.href} className="text-white/50 hover:text-white transition-colors text-xs font-semibold">
                      {item.name}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="/?view=portal" target="_blank" className="text-white/50 hover:text-white transition-colors text-xs font-semibold">
                    Student Portal
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="space-y-5">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-white/50 text-xs leading-relaxed font-semibold">
                  <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                  <span>Engineering Block, Yabatech, Lagos.</span>
                </li>
                <li className="flex items-center gap-2.5 text-white/50 text-xs font-semibold">
                  <Phone size={14} className="text-primary shrink-0" />
                  <span>+234 812 345 6789</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Integrated Support Ticket Form */}
          <div className="lg:col-span-5 bg-white/5 border border-white/10 p-8 rounded-[2.25rem] shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Mail size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">Public Support Desk</h4>
                <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Submit portal tickets & ideas</span>
              </div>
            </div>

            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] uppercase tracking-wider font-bold text-slate-400 ml-1">Your Email</label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-primary/45 transition-all text-xs font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] uppercase tracking-wider font-bold text-slate-400 ml-1">Category</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/45 transition-all text-xs font-semibold appearance-none bg-no-repeat bg-right"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='%2394a3b8' height='18' viewBox='0 0 24 24' width='18' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
                      backgroundPosition: 'right 12px center'
                    }}
                  >
                    <option value="portal" className="bg-slate-900 text-white">Portal Access</option>
                    <option value="dues" className="bg-slate-900 text-white">Dues Status</option>
                    <option value="paystack" className="bg-slate-900 text-white">Payment Issue</option>
                    <option value="ideas" className="bg-slate-900 text-white">Napes Ideas</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[8px] uppercase tracking-wider font-bold text-slate-400 ml-1">Detailed Message</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your issue or suggestion..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-primary/45 transition-all text-xs font-medium resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between gap-4 pt-1">
                <button
                  type="submit"
                  disabled={ticketStatus !== 'idle'}
                  className="bg-primary hover:bg-primary/95 text-white font-bold px-6 py-4.5 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-md tracking-wider text-[10px] uppercase"
                >
                  {ticketStatus === 'sending' ? (
                    <>
                      <Loader2 size={12} className="animate-spin" /> Dispatching...
                    </>
                  ) : (
                    <>
                      Submit Ticket <Send size={12} />
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {ticketStatus === 'sent' && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5 text-[9px] font-black text-green-400 uppercase tracking-widest"
                    >
                      <Sparkles size={12} /> Dispatched!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/30 text-[10px] font-medium tracking-widest uppercase">
            &copy; 2026 NAPES Yabatech Council. Built for Precision.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/30 hover:text-white text-[10px] font-medium tracking-widest uppercase transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/30 hover:text-white text-[10px] font-medium tracking-widest uppercase transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
