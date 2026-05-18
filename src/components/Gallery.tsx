import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Maximize2, Sparkles } from 'lucide-react';

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

export const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
            Visual Highlights
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black mb-6 tracking-tight text-secondary leading-tight">
            Our Engineering <span className="text-primary italic">Gallery</span>
          </h2>
          <p className="text-slate-500 text-base md:text-lg font-light leading-relaxed">
            Capturing the spirit of innovation, research milestones, leadership events, and student growth inside the NAPES Yabatech community.
          </p>
        </div>

        {/* FILTER TABS */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16" data-aos="fade-up" data-aos-delay="100">
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
      </div>

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
