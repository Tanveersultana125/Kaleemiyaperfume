import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import brandStory from "@/assets/brand-story.jpg";

const BrandStory = () => {
  return (
    <section className="section-padding overflow-hidden bg-background">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -30, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-primary/60 text-xs font-sans tracking-[0.4em] uppercase mb-4 block">
            Our Heritage
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-light leading-tight mb-8">
            A Journey Rooted in
            <br />
            <span className="gold-gradient-text font-medium">Tradition & Purity</span>
          </h2>
          <div className="space-y-5 text-muted-foreground font-sans text-[15px] leading-relaxed text-justify">
            <p>
              Kaleemiya Perfumes was born from a deep reverence for the ancient art of
              Arabian perfumery. Our master perfumers carry forward centuries of knowledge,
              blending the finest oud, musk, amber, and rare botanicals into fragrances
              that transcend time.
            </p>
            <p>
              Every bottle is a testament to purity — crafted without alcohol, rooted in
              the Sunnah tradition, and designed for those who seek authenticity in a world
              of imitation. From the souks of Arabia to your collection, each fragrance
              tells a story of heritage and devotion.
            </p>
          </div>
          <div className="mt-10">
            <Button variant="gold-outline" size="lg" className="px-8 text-xs tracking-[0.2em] uppercase rounded-sm">
              Read Our Story
            </Button>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 30, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-lg mx-auto w-full mt-4 lg:mt-0"
        >
          <div className="overflow-hidden rounded-sm relative z-10">
            <img
              src={brandStory}
              alt="Kaleemiya master perfumer at work"
              className="w-full h-[350px] sm:h-[400px] lg:h-[600px] object-cover"
              loading="lazy"
            />
          </div>
          <div className="hidden md:block absolute -bottom-4 -left-4 w-24 h-24 border border-primary/20 rounded-sm z-0" />
          <div className="hidden md:block absolute -top-4 -right-4 w-24 h-24 border border-primary/10 rounded-sm z-0" />
        </motion.div>
      </div>
    </section>
  );
};

export default BrandStory;
