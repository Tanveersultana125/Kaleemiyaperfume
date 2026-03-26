import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import SectionHeading from "./SectionHeading";
import product3 from "@/assets/product-3.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product1 from "@/assets/product-1.jpg";

const newArrivals = [
  { id: "5", image: product5, name: "Velvet Rose Oud", price: "₹6,499", isNew: true },
  { id: "6", image: product6, name: "White Musk Noir", price: "₹3,199", isNew: true },
  { id: "3", image: product3, name: "Oud Ishq", price: "₹7,999", isNew: true },
  { id: "1", image: product1, name: "Amber Noir", price: "₹4,599", isNew: true },
  { id: "9", image: product3, name: "Musk Al Madinah", price: "₹2,199", isNew: true },
  { id: "13", image: product1, name: "Noorique Essence", price: "₹4,999", isNew: true },
  { id: "20", image: product5, name: "Royal Oudh", price: "₹9,999", isNew: true },
  { id: "22", image: product6, name: "Car Diffuser Luxe", price: "₹3,999", isNew: true },
];

const NewArrivalsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <section className="section-padding overflow-hidden bg-background">
      <SectionHeading title="New Arrivals" subtitle="The latest additions to our collection" />

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto pb-4 px-8 md:px-0 scrollbar-hide snap-x snap-mandatory md:snap-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {newArrivals.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="snap-center shrink-0 w-[280px] md:w-auto"
            >
              <ProductCard {...p} />
            </motion.div>
          ))}
        </div>

        <button onClick={() => scroll("left")} className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 md:bg-muted/80 backdrop-blur flex items-center justify-center text-foreground/60 hover:text-primary transition-all md:-translate-x-2" aria-label="Scroll left">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={() => scroll("right")} className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 md:bg-muted/80 backdrop-blur flex items-center justify-center text-foreground/60 hover:text-primary transition-all md:translate-x-2" aria-label="Scroll right">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default NewArrivalsSection;
