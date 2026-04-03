import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroPerfume from "@/assets/hero-perfume.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[100vh] overflow-hidden bg-background">
      {/* Background image - FULL PAGE COVER (No Shades) */}
      <div className="absolute inset-0">
        <motion.img
          src={heroPerfume}
          alt="Kaleemiya luxury perfume"
          className="w-full h-full object-cover object-top"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-full w-full mx-auto px-4 md:px-10 lg:px-16 pt-32 pb-20 min-h-[100vh] flex flex-col justify-center">
        <div className="max-w-xl">
          {/* Logo completely removed from Hero Section for true minimalist aesthetic. */}

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.7 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium leading-[1] mb-8 text-white"
          >
            Experience the
            <br />
            <span className="gold-gradient-text font-medium">Essence</span> of
            <br />
            Purity
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="text-white/90 text-lg md:text-xl font-medium font-sans max-w-md mb-12 leading-relaxed"
          >
            Inspired by tradition, crafted with elegance. Pure attars and oud fragrances for the discerning soul.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <Link to="/shop">
              <Button variant="gold" size="lg" className="px-10 py-6 text-sm tracking-[0.2em] uppercase rounded-sm shadow-xl">
                Explore Collection
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/60 text-sm tracking-[0.5em] uppercase font-sans font-medium">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-[1px] h-8 bg-gradient-to-b from-primary/50 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
