import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import ProductCard from "./ProductCard";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product6 from "@/assets/product-6.jpg";

const tabs = ["Under ₹2,000", "₹2,000 – ₹5,000", "Premium"];

const products: Record<string, { id: string; image: string; name: string; price: string }[]> = {
  "Under ₹2,000": [
    { id: "u2k1", image: product4, name: "Bakhoor Classic", price: "₹1,299" },
    { id: "u2k2", image: product6, name: "Musk Lite", price: "₹1,599" },
    { id: "u2k3", image: product2, name: "Attar Breeze", price: "₹1,899" },
  ],
  "₹2,000 – ₹5,000": [
    { id: "mid1", image: product1, name: "Royal Amber", price: "₹3,499" },
    { id: "mid2", image: product2, name: "Sultan Attar", price: "₹2,799" },
    { id: "mid3", image: product6, name: "Noir Musk", price: "₹4,299" },
  ],
  Premium: [
    { id: "prm1", image: product3, name: "Oud Al Malikah", price: "₹8,999" },
    { id: "prm2", image: product1, name: "Amber Exclusive", price: "₹6,999" },
    { id: "prm3", image: product3, name: "Royal Oud Reserve", price: "₹12,999" },
  ],
};

const ShopByPrice = () => {
  const [active, setActive] = useState("Under ₹2,000");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <section className="section-padding">
      <SectionHeading title="Shop by Price" subtitle="Luxury at every price point" />

      <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-10 px-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-4 py-1.5 rounded-full text-[8.5px] md:text-[9px] font-sans font-bold tracking-[0.15em] uppercase transition-all duration-300 border ${
              active === tab
                ? "bg-[#310101] border-primary text-primary shadow-lg shadow-primary/20"
                : "bg-transparent border-white/10 text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {tab.replace("–", "-")}
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
              <div key={`${p.name}-${i}`} className="snap-center shrink-0 w-[280px] md:w-auto flex justify-center">
                <ProductCard {...p} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Scroll buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 md:left-0 top-[40%] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 md:bg-muted/80 backdrop-blur flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-muted transition-all duration-300 md:-translate-x-2"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 md:right-0 top-[40%] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 md:bg-muted/80 backdrop-blur flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-muted transition-all duration-300 md:translate-x-2"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default ShopByPrice;
