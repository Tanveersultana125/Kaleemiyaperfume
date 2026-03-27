import { motion } from "framer-motion";
import store1 from "@/assets/store-1.jpg";
import store2 from "@/assets/store-2.jpg";
import store3 from "@/assets/store-3.jpg";
import store4 from "@/assets/store-4.jpg";
import store5 from "@/assets/store-5.jpg";
import store6 from "@/assets/store-6.jpg";
import store7 from "@/assets/store-7.jpg";
import extraGallery1 from "@/assets/extra-gallery-1.jpg";
import extraGallery2 from "@/assets/extra-gallery-2.jpg";

const galleryImages = [
  { src: store1, alt: "Kaleemiya Store Boutique" },
  { src: store2, alt: "Luxury Perfume Collection" },
  { src: store3, alt: "Artisan Fragrances" },
  { src: store4, alt: "Premium Boutique Experience" },
  { src: store5, alt: "Exquisite Fragrance Oils" },
  { src: store6, alt: "Traditional Islamic Decor" },
  { src: store7, alt: "Luxury Gifting Section" },
  { src: extraGallery1, alt: "Elegant Black & White Decor" },
  { src: extraGallery2, alt: "Our Boutique Interior" },
];

const StoreGallery = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-sans text-xs uppercase tracking-[0.3em] font-bold mb-4 block"
          >
            Our Boutique
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground"
          >
            Visit the World of Kaleemiya
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-[2px] bg-primary mx-auto mt-6"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[800px] md:h-[600px]">
          {/* Large Main Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-6 h-full relative group overflow-hidden rounded-sm"
          >
            <img 
              src={galleryImages[1].src} 
              alt={galleryImages[1].alt} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 group-hover:bg-black/5 transition-colors duration-500" />
          </motion.div>

          {/* Right Column Grid */}
          <div className="md:col-span-6 grid grid-cols-2 gap-6 h-full">
            {galleryImages.filter((_, i) => i !== 1).map((image, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group overflow-hidden rounded-sm h-full"
              >
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 group-hover:bg-black/5 transition-colors duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreGallery;
