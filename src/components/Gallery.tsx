import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Maximize2, Sparkles, Trophy, Images, Award, Calendar, ArrowRight } from 'lucide-react';

/* LOCAL HERO IMAGES */
import one from '../assets/one.jpg';
import two from '../assets/two.jpg';
import three from '../assets/three.jpg';
import four from '../assets/four.jpg';
import five from '../assets/five.jpg';
import six from '../assets/six.jpg';
import seven from '../assets/seven.jpg';
import eight from '../assets/eight.jpg';
import nine from '../assets/nine.jpg';
import ten from '../assets/ten.jpg';

const categories = ['All', 'Community', 'Innovation', 'Research', 'Academic', 'Tech Talk'];

const galleryImages = [
  { url: one, title: 'NAPES Yabatech Leadership', tag: 'Community', gridClass: 'md:col-span-2 md:row-span-2' },
  { url: two, title: 'Future Female Engineers', tag: 'Innovation', gridClass: 'md:col-span-1 md:row-span-1' },
  { url: three, title: 'Professional Growth & Seminars', tag: 'Academic', gridClass: 'md:col-span-1 md:row-span-1' },
  { url: four, title: 'Advanced Research Lab', tag: 'Research', gridClass: 'md:col-span-1 md:row-span-2' },
  { url: five, title: 'Energy Ecosystem Solutions', tag: 'Tech Talk', gridClass: 'md:col-span-2 md:row-span-1' },
  { url: six, title: 'Faculty Honor Ceremonies', tag: 'Academic', gridClass: 'md:col-span-1 md:row-span-1' },
  { url: seven, title: 'Student Community Gatherings', tag: 'Community', gridClass: 'md:col-span-1 md:row-span-1' },
  { url: eight, title: 'Engineering Vision Congress', tag: 'Research', gridClass: 'md:col-span-1 md:row-span-1' },
  { url: nine, title: 'Creative Innovation Workshop', tag: 'Innovation', gridClass: 'md:col-span-2 md:row-span-1' },
  { url: ten, title: 'Official NAPES Portal Launch', tag: 'Tech Talk', gridClass: 'md:col-span-1 md:row-span-1' },
];

const pastExecutives = [
  {
    name: 'Comr. Olatunji Williams',
    role: 'President',
    session: '2024/2025 Academic Session',
    legacy: 'Established the Yabatech Engineering Innovation Hub and streamlined student payment status verification.',
    avatarColor: 'from-primary to-orange-500',
  },
  {
    name: 'Comr. Chioma Nwachukwu',
    role: 'Vice President',
    session: '2024/2025 Academic Session',
    legacy: 'Pioneered the HerEngineering Legacy Initiative, securing industrial bridging workshops for over 850 female engineers.',
    avatarColor: 'from-purple-500 to-primary',
  },
  {
    name: 'Comr. Abiodun Yusuf',
    role: 'General Secretary',
    session: '2024/2025 Academic Session',
    legacy: 'Renovated student common rooms and coordinated the 2024 Annual Engineering Symposium.',
    avatarColor: 'from-secondary to-blue-500',
  },
  {
    name: 'Engr. Babajide Arogundade',
    role: 'President',
    session: '2023/2024 Academic Session',
    legacy: 'Led the digital revolution of NAPES portal and spearheaded the Yabatech Faculty-Industry Alliance.',
    avatarColor: 'from-emerald-500 to-secondary',
  },
  {
    name: 'Engr. Sandra Nwosu',
    role: 'Technical Director',
    session: '2023/2024 Academic Session',
    legacy: 'Introduced project-based design labs and secured Flutterwave & Paystack mock dues API clearances.',
    avatarColor: 'from-pink-500 to-primary',
  },
  {
    name: 'Comr. Michael Okonkwo',
    role: 'Financial Secretary',
    session: '2023/2024 Academic Session',
    legacy: 'Initiated fully transparent online ledger disclosures and optimized executive council budget metrics.',
    avatarColor: 'from-yellow-500 to-orange-600',
  },
];

export const Gallery = () => {
  const [activeTab, setActiveTab] = useState<'events' | 'executives'>('events');
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isMobilePortalOpen, setIsMobilePortalOpen] = useState(false);

  const filteredImages = galleryImages.filter(
    (img) => activeFilter === 'All' || img.tag === activeFilter
  );

  const openLightbox = (imgUrl: string) => {
    const originalIndex = galleryImages.findIndex((img) => img.url === imgUrl);
    if (originalIndex !== -1) {
      setLightboxIndex(originalIndex);
    }
  };

  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : galleryImages.length - 1));
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev !== null && prev < galleryImages.length - 1 ? prev + 1 : 0));
    }
  };

  return (
    <section className="py-32 relative bg-surface overflow-hidden" id="gallery">
      {/* Background blurs */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-secondary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-16" data-aos="fade-up">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-primary/10 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-6">
            Institutional History
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black mb-6 tracking-tight text-secondary leading-tight">
            Our Legacy <span className="text-primary italic">& History</span>
          </h2>
          <p className="text-slate-500 text-base md:text-lg font-light leading-relaxed">
            Discover the visual milestones of our events or explore our Executive Hall of Fame to learn about the leaders who shaped the Faculty of Engineering.
          </p>
        </div>

        {/* MOBILE VIEW COMPACT PORTAL TRIGGER */}
        <div className="block md:hidden bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl border border-slate-100/80 text-center max-w-md mx-auto" data-aos="zoom-in">
          <div className="w-16 h-16 bg-primary/10 rounded-[1.25rem] flex items-center justify-center text-primary mx-auto mb-6">
            <Sparkles size={28} className="animate-pulse" />
          </div>
          <h3 className="text-xl font-display font-black text-secondary tracking-tight mb-3">Visual Legacy & Hall of Fame</h3>
          <p className="text-slate-400 text-xs font-light leading-relaxed mb-8">
            Experience our interactive photo collage and explore the complete past Executive Hall of Fame in a dedicated mobile overlay.
          </p>
          <button 
            onClick={() => setIsMobilePortalOpen(true)}
            className="w-full bg-secondary hover:bg-secondary/95 text-white font-bold py-4 rounded-xl text-xs tracking-widest uppercase shadow-md flex items-center justify-center gap-2"
          >
            Launch Visual Portal <ArrowRight size={14} />
          </button>
        </div>

        {/* DESKTOP VIEW FULL INTERACTION */}
        <div className="hidden md:block">
          {/* SUB-SECTION TOGGLE TABS */}
          <div className="flex justify-center mb-16" data-aos="fade-up">
            <div className="p-2 rounded-2xl bg-white border border-slate-100/80 shadow-md flex items-center gap-2">
              <button
                onClick={() => setActiveTab('events')}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'events'
                    ? 'bg-secondary text-white shadow-md'
                    : 'text-slate-500 hover:text-secondary'
                }`}
              >
                <Images size={14} />
                Events & Highlights
              </button>
              <button
                onClick={() => setActiveTab('executives')}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'executives'
                    ? 'bg-secondary text-white shadow-md'
                    : 'text-slate-500 hover:text-secondary'
                }`}
              >
                <Trophy size={14} />
                Executive Hall of Fame
              </button>
            </div>
          </div>

          {/* ANIMATED RENDER VIEW */}
          <AnimatePresence mode="wait">
            {activeTab === 'events' ? (
              <motion.div
                key="events-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                {/* FILTER TABS */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveFilter(cat)}
                      className={`relative px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                        activeFilter === cat
                          ? 'text-white shadow-lg shadow-primary/20'
                          : 'text-slate-500 hover:text-secondary bg-white hover:bg-slate-50 border border-slate-100'
                      }`}
                    >
                      {activeFilter === cat && (
                        <motion.div
                          layoutId="activeFilterBg"
                          className="absolute inset-0 bg-primary rounded-full z-0"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-2">
                        {cat === 'All' && <Sparkles size={12} />}
                        {cat}
                      </span>
                    </button>
                  ))}
                </div>

                {/* ASYMMETRICAL COLLAGE GRID LAYOUT */}
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[250px] min-h-[500px]"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredImages.map((img) => (
                      <motion.div
                        layout
                        key={img.title}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                        onClick={() => openLightbox(img.url)}
                        className={`group cursor-pointer relative overflow-hidden rounded-[2.5rem] bg-slate-100 border border-slate-200/50 shadow-md hover:shadow-2xl transition-all duration-500 ${img.gridClass}`}
                      >
                        {/* IMAGE */}
                        <img
                          src={img.url}
                          alt={img.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />

                        {/* OVERLAY GRADIENT */}
                        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/20 to-transparent opacity-0 group-hover:opacity-90 transition-all duration-500" />

                        {/* DETAILS (Visible on Hover) */}
                        <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <span className="self-start px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[9px] font-black uppercase text-primary border border-white/20 tracking-widest mb-3">
                            {img.tag}
                          </span>
                          <h3 className="text-base sm:text-lg font-display font-black text-white mb-2 leading-tight tracking-tight">
                            {img.title}
                          </h3>
                          <div className="flex items-center gap-2 text-[9px] font-bold text-white/60 uppercase tracking-widest">
                            <Maximize2 size={12} className="text-primary" />
                            Expand View
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="executives-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {pastExecutives.map((exec, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 35 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100/60 relative overflow-hidden group hover:shadow-2xl transition-all duration-500"
                  >
                    {/* Decorative background circle */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-50 rounded-full group-hover:scale-110 transition-transform duration-500 z-0" />

                    <div className="relative z-10 flex flex-col h-full justify-between">
                      <div className="space-y-6">
                        {/* Avatar Circle using dynamic gradients */}
                        <div className="flex items-center gap-5">
                          <div className={`w-16 h-16 rounded-[1.25rem] bg-gradient-to-tr ${exec.avatarColor} flex items-center justify-center text-white shadow-lg shadow-secondary/5 font-display font-black text-2xl uppercase tracking-tighter`}>
                            {exec.name.replace('Comr. ', '').replace('Engr. ', '').substring(0, 2)}
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-1">
                              <Award size={10} /> {exec.role}
                            </span>
                            <h3 className="text-lg font-display font-black text-secondary tracking-tight mt-1">{exec.name}</h3>
                          </div>
                        </div>

                        {/* Legacy Description */}
                        <p className="text-slate-500 text-sm leading-relaxed font-light mt-4">
                          "{exec.legacy}"
                        </p>
                      </div>

                      {/* Footer Session Tag */}
                      <div className="border-t border-slate-50 mt-6 pt-6 flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Calendar size={10} /> {exec.session}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FULLSCREEN MOBILE PORTAL OVERLAY */}
      <AnimatePresence>
        {isMobilePortalOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-surface overflow-y-auto px-6 py-24 block md:hidden"
          >
            {/* Header / Close button */}
            <div className="flex items-center justify-between mb-10 max-w-2xl mx-auto">
              <div>
                <span className="text-[9px] font-black uppercase text-primary tracking-[0.2em] block mb-1">Mobile Portal</span>
                <h3 className="text-xl font-display font-black text-secondary tracking-tight">History & Legacy</h3>
              </div>
              <button 
                onClick={() => setIsMobilePortalOpen(false)}
                className="p-3 rounded-full bg-white border border-slate-100 text-slate-500 hover:text-secondary shadow-sm"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-w-2xl mx-auto">
              {/* SUB-SECTION TOGGLE TABS */}
              <div className="flex justify-center mb-10">
                <div className="p-1.5 rounded-xl bg-white border border-slate-150 shadow-sm flex items-center gap-1">
                  <button
                    onClick={() => setActiveTab('events')}
                    className={`px-5 py-3 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                      activeTab === 'events'
                        ? 'bg-secondary text-white shadow-sm'
                        : 'text-slate-500 hover:text-secondary'
                    }`}
                  >
                    <Images size={12} />
                    Events
                  </button>
                  <button
                    onClick={() => setActiveTab('executives')}
                    className={`px-5 py-3 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                      activeTab === 'executives'
                        ? 'bg-secondary text-white shadow-sm'
                        : 'text-slate-500 hover:text-secondary'
                    }`}
                  >
                    <Trophy size={12} />
                    Hall of Fame
                  </button>
                </div>
              </div>

              {/* Render view inside modal */}
              {activeTab === 'events' ? (
                <div className="space-y-8">
                  {/* Compact list of categories */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveFilter(cat)}
                        className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                          activeFilter === cat
                            ? 'bg-primary text-white shadow-md'
                            : 'text-slate-500 bg-white border border-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Collage rendered as simpler grid for mobile */}
                  <div className="grid grid-cols-2 gap-4">
                    {filteredImages.map((img) => (
                      <div
                        key={img.title}
                        onClick={() => openLightbox(img.url)}
                        className="cursor-pointer relative overflow-hidden rounded-2xl aspect-square bg-slate-100 border border-slate-200/50 shadow-sm"
                      >
                        <img src={img.url} alt={img.title} loading="lazy" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                          <span className="text-[8px] font-bold text-primary uppercase tracking-widest block mb-0.5">{img.tag}</span>
                          <h4 className="text-[10px] font-black text-white line-clamp-1 leading-tight">{img.title}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {pastExecutives.map((exec, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${exec.avatarColor} flex items-center justify-center text-white font-display font-black text-lg uppercase`}>
                          {exec.name.replace('Comr. ', '').replace('Engr. ', '').substring(0, 2)}
                        </div>
                        <div>
                          <span className="text-[8px] font-black uppercase text-primary tracking-widest block leading-none">{exec.role}</span>
                          <h4 className="text-sm font-display font-black text-secondary tracking-tight mt-1">{exec.name}</h4>
                        </div>
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed font-light">"{exec.legacy}"</p>
                      <div className="border-t border-slate-50 mt-4 pt-4 flex items-center justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>{exec.session}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-primary transition-all hover:scale-110"
            >
              <X size={20} />
            </button>

            {/* PREV BUTTON */}
            <button
              onClick={prevImage}
              className="absolute left-4 sm:left-8 p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-primary transition-all hover:scale-110 z-10"
            >
              <ChevronLeft size={24} />
            </button>

            {/* LIGHTBOX SLIDE CONTAINER */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-[2.5rem] bg-slate-900 border border-white/10 shadow-2xl flex flex-col"
            >
              {/* IMAGE */}
              <div className="flex-1 w-full h-full relative overflow-hidden bg-slate-950">
                <img
                  src={galleryImages[lightboxIndex].url}
                  alt={galleryImages[lightboxIndex].title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* FOOTER BAR */}
              <div className="bg-slate-950/80 backdrop-blur-md border-t border-white/5 px-8 sm:px-10 py-6 sm:py-8 flex items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] font-black uppercase text-primary tracking-[0.2em] block mb-1">
                    {galleryImages[lightboxIndex].tag}
                  </span>
                  <h3 className="text-lg sm:text-xl font-display font-black text-white tracking-tight leading-none">
                    {galleryImages[lightboxIndex].title}
                  </h3>
                </div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest hidden sm:block">
                  Image {lightboxIndex + 1} of {galleryImages.length}
                </div>
              </div>
            </motion.div>

            {/* NEXT BUTTON */}
            <button
              onClick={nextImage}
              className="absolute right-4 sm:right-8 p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-primary transition-all hover:scale-110 z-10"
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
