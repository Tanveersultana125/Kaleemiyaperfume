import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import ProductCard from "./ProductCard";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product7 from "@/assets/spiritual_incense_meditation_setup_1774601396464.png";
import product8 from "@/assets/luxury_gift_set_perfume_packaging_1774601431898.png";
import product9 from "@/assets/daily_wear_perfume_lifestyle_shot_1774601465207.png";

const tabs = ["Daily Wear", "Spiritual", "Office", "Hajj & Umrah", "Special Giftings"];

import { Product } from "@/hooks/useProducts";

const products: Record<string, { id: string; image: string; name: string; price: string }[]> = {};

const ShopByOccasion = () => {
  const [active, setActive] = useState("Daily Wear");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  if (Object.keys(products).length === 0) return null;

  return (
    <section className="section-padding overflow-hidden" style={{ background: "#310101" }}>
      <SectionHeading title="Shop by Occasion" subtitle="Find the perfect fragrance for every moment" light={true} />

      <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-10 px-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-4 py-1.5 rounded-full text-[8.5px] md:text-[9px] font-sans font-bold tracking-[0.15em] uppercase transition-all duration-300 border ${
              active === tab
                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                : "bg-transparent border-white/20 text-white/60 hover:border-primary/40 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            ref={scrollRef}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory px-8 md:px-0 md:justify-center scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products[active].map((p, i) => (
              <div key={p.name} className="snap-center shrink-0 w-[280px] md:w-auto flex justify-center">
                <ProductCard {...p} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Scroll buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 md:left-0 top-[40%] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 md:bg-muted/80 backdrop-blur flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-muted transition-all duration-300 md:-translate-x-2 md:hidden"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 md:right-0 top-[40%] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 md:bg-muted/80 backdrop-blur flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-muted transition-all duration-300 md:translate-x-2 md:hidden"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-12 text-center">
        <Link 
          to="/shop" 
          className="text-primary font-sans font-bold uppercase tracking-[0.2em] text-xs border-b border-primary/30 pb-1 hover:border-primary transition-colors"
        >
          View All Collections
        </Link>
      </div>
    </section>
  );
};

export default ShopByOccasion;
