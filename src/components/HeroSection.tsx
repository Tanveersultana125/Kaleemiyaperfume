import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroPerfume from "@/assets/hero-perfume.jpg";

const HeroSection = () => {
  const [slides, setSlides] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "hero_slides"), orderBy("order", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSlides(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Permanent First Slide (Brand Identity)
  const fixedLeadSlide = {
    id: "essence-of-purity-lead",
    image: heroPerfume,
    titleFirstLine: "Experience the",
    titleHighlight: "Essence",
    titleLastLine: "of Purity",
    subtitle: "Inspired by tradition, crafted with elegance. Pure attars and oud fragrances for the discerning soul.",
    buttonText: "Explore Collection",
    link: "/shop"
  };

  // Admin slides follow the fixed brand slide
  const activeSlides = [fixedLeadSlide, ...slides];

  useEffect(() => {
    if (activeSlides.length > 1) {
      const timer = setInterval(() => {
        setCurrent((prev) => (prev + 1) % activeSlides.length);
      }, 7000);
      return () => clearInterval(timer);
    }
  }, [activeSlides.length]);

  if (loading) {
    return (
      <section className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-t-2 border-[#B0843D] rounded-full animate-spin" />
      </section>
    );
  }

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % activeSlides.length);
  };

  const currentSlide = activeSlides[current] || activeSlides[0];

  return (
    <section className="relative min-h-[80vh] overflow-hidden bg-[#0a0a0a]">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-black/40 z-1" />
          <motion.img
            src={currentSlide.image}
            alt="Hero Slide"
            className="w-full h-full object-cover object-top scale-100"
            animate={{ scale: 1.05 }}
            transition={{ duration: 10, ease: "linear" }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 max-w-full w-full mx-auto px-6 md:px-12 lg:px-24 pt-32 pb-20 min-h-[80vh] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl lg:max-w-5xl"
          >
            <motion.h2
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-medium leading-[0.95] md:leading-[0.9] mb-8 text-white tracking-tight"
            >
              {currentSlide.titleFirstLine}
              <br />
              <span className="gold-gradient-text font-medium">{currentSlide.titleHighlight}</span> {currentSlide.titleLastLine}
            </motion.h2>

            <motion.p
              className="text-white/80 text-lg md:text-2xl font-sans max-w-xl mb-12 leading-relaxed"
            >
              {currentSlide.subtitle}
            </motion.p>

            <Link to={currentSlide.link || "/shop"}>
              <Button 
                variant="gold" 
                size="lg" 
                className="px-12 py-8 text-md font-bold tracking-[0.2em] uppercase rounded-none shadow-2xl hover:scale-105 transition-transform"
              >
                {currentSlide.buttonText}
              </Button>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Manual Navigation Arrows */}
      {activeSlides.length > 1 && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 px-4 md:px-10 flex justify-between pointer-events-none">
          <button 
            onClick={handlePrev}
            className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-[#B0843D] hover:border-[#B0843D] transition-all duration-500 pointer-events-auto group"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:-translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={handleNext}
            className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-[#B0843D] hover:border-[#B0843D] transition-all duration-500 pointer-events-auto group"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Manual Navigation Arrows */}
      {activeSlides.length > 1 && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 px-4 md:px-10 flex justify-between pointer-events-none">
          <button 
            onClick={handlePrev}
            className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-[#B0843D] hover:border-[#B0843D] transition-all duration-500 pointer-events-auto group"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:-translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={handleNext}
            className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-[#B0843D] hover:border-[#B0843D] transition-all duration-500 pointer-events-auto group"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-12 z-20 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-white/40 text-[10px] tracking-[0.5em] uppercase font-sans font-black vertical-text mb-4">Explore Sanctuary</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-[#B0843D] to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
