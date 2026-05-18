import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

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

/* HERO SLIDES */
const carouselImages = [
  {
    url: one,
    title: 'NAPES Leadership',
    desc: 'Engineering excellence and student innovation.',
  },
  {
    url: two,
    title: 'Future Engineers',
    desc: 'Building technical leaders for tomorrow.',
  },
  {
    url: three,
    title: 'Professional Growth',
    desc: 'Advancing petroleum engineering education.',
  },
  {
    url: four,
    title: 'Innovation Hub',
    desc: 'Creating solutions through collaboration.',
  },
  {
    url: five,
    title: 'Energy Ecosystem',
    desc: 'Empowering the next generation.',
  },
  {
    url: six,
    title: 'Technical Excellence',
    desc: 'Precision, discipline, and leadership.',
  },
  {
    url: seven,
    title: 'Student Community',
    desc: 'Strong academic and professional culture.',
  },
  {
    url: eight,
    title: 'Engineering Vision',
    desc: 'Shaping the future of energy.',
  },
  {
    url: nine,
    title: 'Research & Development',
    desc: 'Innovation through technical advancement.',
  },
  {
    url: ten,
    title: 'NAPES YABATECH',
    desc: 'Premium digital ecosystem for engineers.',
  },
];

export const Hero = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const heroRef = useRef<HTMLDivElement>(null);

  const titleContainerRef = useRef<HTMLHeadingElement>(null);

  /* AUTO SLIDESHOW */
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  /* GSAP TITLE ANIMATION */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const title = titleContainerRef.current;

      if (title) {
        const text = 'NAPES YABATECH';

        title.innerHTML = text
          .split('')
          .map(
            (char) =>
              `<span class="char inline-block">${
                char === ' ' ? '&nbsp;' : char
              }</span>`
          )
          .join('');

        gsap.from('.char', {
          opacity: 0,
          y: 40,
          filter: 'blur(10px)',
          stagger: 0.04,
          duration: 0.8,
          ease: 'expo.out',
          delay: 0.2,
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950"
    >
      {/* BACKGROUND IMAGES */}
      <div className="absolute inset-0 z-0 bg-slate-950">
        <AnimatePresence initial={false}>
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <img
              src={carouselImages[activeSlide].url}
              alt="hero"
              className="w-full h-full object-cover"
            />

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-black/70" />

            {/* GRADIENT */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* HERO CONTENT */}
      <div className="container mx-auto px-6 relative z-10 pt-36 sm:pt-40 md:pt-48 pb-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* LEFT SIDE */}
          <div className="lg:col-span-8 text-left">

            {/* MAIN TITLE */}
            <h1
              ref={titleContainerRef}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-[6.5rem] font-black mb-8 md:mb-10 tracking-tighter leading-none text-white drop-shadow-2xl"
            >
              NAPES YABATECH
            </h1>

            {/* DESCRIPTION */}
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-10 md:mb-12 leading-relaxed font-light">
              Advancing engineering precision through a premium digital
              ecosystem. Resources, leadership, innovation, and community
              reimagined for the modern student engineer.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold px-12 py-5 rounded-2xl flex items-center justify-center gap-3 transition-all group shadow-2xl uppercase tracking-widest text-sm">
                Student Portal

                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-12 py-5 rounded-2xl transition-all font-semibold text-sm uppercase tracking-widest">
                Explore More
              </button>
            </div>
          </div>

          {/* RIGHT LOGIN CARD */}
          <div className="lg:col-span-4 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100"
            >
              <div className="flex items-center gap-5 mb-10">
                <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
                  <UserCheck size={32} />
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-black tracking-tight">
                    Portal Access
                  </h3>

                  <p className="text-slate-500 text-sm">
                    Welcome back to the dashboard
                  </p>
                </div>
              </div>

              {/* INPUTS */}
              <div className="space-y-5 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-4">
                    Matric Number
                  </label>

                  <input
                    type="text"
                    placeholder="F/HD/21/..."
                    className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-red-200 transition-all text-sm font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-4">
                    Password
                  </label>

                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-red-200 transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {/* BUTTON */}
              <button className="w-full bg-red-600 text-white font-bold py-6 rounded-2xl hover:bg-red-700 transition-all mb-6 text-sm tracking-widest uppercase shadow-xl">
                Enter Dashboard
              </button>

              <div className="text-center">
                <a
                  href="#"
                  className="text-xs text-slate-400 hover:text-red-600 transition-colors font-medium"
                >
                  Forgot credentials?
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* BOTTOM CONTROLS */}
        <div className="absolute bottom-12 left-6 right-6 flex items-center justify-between">
          
          {/* DOTS */}
          <div className="flex gap-4">
            {carouselImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeSlide === i
                    ? 'bg-white scale-125'
                    : 'bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* ARROWS */}
          <div className="flex gap-6">
            <button
              onClick={() =>
                setActiveSlide(
                  (prev) =>
                    (prev - 1 + carouselImages.length) %
                    carouselImages.length
                )
              }
              className="p-4 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() =>
                setActiveSlide(
                  (prev) => (prev + 1) % carouselImages.length
                )
              }
              className="p-4 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};