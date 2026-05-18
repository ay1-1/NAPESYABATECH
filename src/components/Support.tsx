import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ArrowRight, UserCheck, HelpCircle, Mail, KeyRound, CreditCard, Send, Sparkles } from 'lucide-react';

export const Support = () => {
  /* Matric Checker State */
  const [matric, setMatric] = useState('');
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<{ status: 'cleared' | 'pending' | null; message: string }>({ status: null, message: '' });

  /* Contact Support Ticket State */
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('portal');
  const [message, setMessage] = useState('');
  const [ticketStatus, setTicketStatus] = useState<string | null>(null);

  /* Simulated Matric Dues Checking */
  const handleCheckDues = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matric.trim()) return;

    setChecking(true);
    setCheckResult({ status: null, message: '' });

    setTimeout(() => {
      setChecking(false);
      const isEven = matric.length % 2 === 0;
      if (isEven) {
        setCheckResult({
          status: 'cleared',
          message: 'Dues status verified successfully! Paystack transaction record reference #NP-739274 cleared.',
        });
      } else {
        setCheckResult({
          status: 'pending',
          message: 'Dues outstanding for Session 2025/2026. Clearance pending simulated Paystack payment.',
        });
      }
    }, 1500);
  };

  /* Simulated Support Ticket submission */
  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;

    setTicketStatus('sending');

    setTimeout(() => {
      setTicketStatus('sent');
      setEmail('');
      setMessage('');
      setTimeout(() => setTicketStatus(null), 4000);
    }, 1200);
  };

  return (
    <section className="py-32 relative bg-surface overflow-hidden" id="support">
      {/* Background blurs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-20" data-aos="fade-up">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-secondary/10 bg-secondary/5 text-secondary text-[10px] font-black uppercase tracking-[0.4em] mb-6">
            Support & Dues Center
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black mb-6 tracking-tight text-secondary leading-tight">
            Support <span className="text-primary italic">& Portal</span> Access
          </h2>
          <p className="text-slate-500 text-base md:text-lg font-light leading-relaxed">
            Verify your student dues clearance status, check simulated Paystack transaction records, access the dashboard, or file a portal support request.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT: MATRIC CHECKER & CONTACT FORMS */}
          <div className="lg:col-span-8 space-y-10">
            {/* 1. DUES AND VERIFICATION CARD */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-xl border border-slate-100/80"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-display font-black text-secondary tracking-tight">Dues Status Verification</h3>
                  <p className="text-slate-400 text-xs font-medium">Verify your payment status securely</p>
                </div>
              </div>

              <form onSubmit={handleCheckDues} className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Enter Matric Number (e.g. F/HD/22/...)"
                      value={matric}
                      onChange={(e) => setMatric(e.target.value)}
                      className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/15 transition-all text-sm font-medium pr-10"
                      required
                    />
                    <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  </div>
                  <button
                    type="submit"
                    disabled={checking}
                    className="bg-primary hover:bg-primary/95 text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md tracking-wider text-xs uppercase shrink-0"
                  >
                    {checking ? 'Checking Record...' : 'Verify Status'}
                  </button>
                </div>
              </form>

              {/* RESULT DISPLAY */}
              <AnimatePresence mode="wait">
                {checkResult.status !== null && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 overflow-hidden"
                  >
                    <div className={`p-6 rounded-2xl border flex items-start gap-4 ${
                      checkResult.status === 'cleared'
                        ? 'bg-green-50/50 border-green-200/60 text-green-800'
                        : 'bg-orange-50/50 border-orange-200/60 text-orange-800'
                    }`}>
                      <div className="mt-0.5">
                        <ShieldCheck size={20} className={checkResult.status === 'cleared' ? 'text-green-600' : 'text-orange-600'} />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-black uppercase tracking-wider leading-none">
                          {checkResult.status === 'cleared' ? 'Cleared & Approved' : 'Payment Required'}
                        </h4>
                        <p className="text-xs font-medium leading-relaxed opacity-90">{checkResult.message}</p>
                        {checkResult.status === 'pending' && (
                          <button className="inline-flex items-center gap-2 mt-2 bg-primary hover:bg-primary/90 text-white font-bold px-5 py-2.5 rounded-lg transition-all text-[10px] uppercase tracking-widest shadow-sm">
                            Clear Dues via Paystack <ArrowRight size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* 2. SUPPORT REQUEST CARD */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-xl border border-slate-100/80"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                  <HelpCircle size={24} />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-display font-black text-secondary tracking-tight">Open Support Request</h3>
                  <p className="text-slate-400 text-xs font-medium">Get swift assistance from the technical team</p>
                </div>
              </div>

              <form onSubmit={handleSubmitTicket} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 ml-1">Your Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all text-sm font-medium pr-10"
                        required
                      />
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 ml-1">Support Category</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all text-sm font-medium text-slate-600 appearance-none bg-no-repeat"
                      style={{
                        backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='%2364748b' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
                        backgroundPosition: 'right 16px center'
                      }}
                    >
                      <option value="portal">Student Portal Access</option>
                      <option value="dues">Dues clearance verification</option>
                      <option value="paystack">Paystack Transaction Issue</option>
                      <option value="other">General Technical Bug</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 ml-1">Detailed Message</label>
                  <textarea
                    rows={4}
                    placeholder="Describe the technical issue or outstanding clearance problem..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all text-sm font-medium resize-none leading-relaxed"
                    required
                  />
                </div>

                <div className="flex items-center justify-between gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={ticketStatus !== null}
                    className="bg-secondary hover:bg-secondary/95 text-white font-bold px-10 py-4.5 rounded-xl flex items-center justify-center gap-3 transition-all shadow-md tracking-wider text-xs uppercase"
                  >
                    {ticketStatus === 'sending' ? (
                      'Submitting Support Ticket...'
                    ) : (
                      <>
                        Submit Request <Send size={14} />
                      </>
                    )}
                  </button>

                  <AnimatePresence>
                    {ticketStatus === 'sent' && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-xs font-black text-green-600 uppercase tracking-widest"
                      >
                        <Sparkles size={16} /> Ticket Dispatched Successfully!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </motion.div>
          </div>

          {/* RIGHT: STUDENT PORTAL LOGIN CARD */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100/80"
            >
              <div className="flex items-center gap-5 mb-10">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <UserCheck size={30} />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-black text-secondary tracking-tight">Portal Access</h3>
                  <p className="text-slate-400 text-xs font-semibold">Welcome back, student engineer</p>
                </div>
              </div>

              {/* INPUTS */}
              <div className="space-y-6 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 ml-3">Matric Number</label>
                  <input
                    type="text"
                    placeholder="F/HD/21/..."
                    className="w-full px-6 py-4.5 rounded-xl bg-slate-50 border border-slate-150 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 ml-3">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-6 py-4.5 rounded-xl bg-slate-50 border border-slate-150 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {/* BUTTON */}
              <button className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-5 rounded-2xl transition-all mb-6 text-xs tracking-widest uppercase shadow-md flex items-center justify-center gap-2">
                Enter Dashboard <ArrowRight size={14} />
              </button>

              <div className="text-center">
                <a href="#" className="text-xs text-slate-400 hover:text-primary transition-colors font-medium">
                  Forgot credentials?
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
