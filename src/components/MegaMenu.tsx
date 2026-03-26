import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, Crown, Zap, Moon, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface MegaMenuProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const megaMenuData = [
  {
    title: "Pure Arabic Feel",
    icon: <Sparkles className="w-4 h-4 text-primary" />,
    items: [
      "Noor Al Attar", "Jannat Fragrances", "Musk Al Madinah", "Oud Al Noor", 
      "Al Rehan Attar", "Attar Al Barakah", "Al Firdous Perfumes", "Sabeel Fragrance", 
      "Rihlat Al Oud", "Al Abeer Attar"
    ]
  },
  {
    title: "Spiritual Names",
    icon: <Heart className="w-4 h-4 text-primary" />,
    items: [
      "Noor Essence", "Jannah Scents", "Barakah Oud", "Rahma Fragrance", 
      "Tayyib Attar", "Imaan Scents", "Sakinah Perfumes", "Hidayah Fragrance", 
      "Rizwaan Attar", "Ikhlas Oud"
    ]
  },
  {
    title: "Royal Islamic Vibe",
    icon: <Crown className="w-4 h-4 text-primary" />,
    items: [
      "Sultan Al Oud", "Royal Madinah Musk", "Khalifa Fragrance", "Qasr Al Oud", 
      "Diwan Perfumes", "Zafran Attar", "Misk Royale", "Al Zahra Perfumes", 
      "Shaheen Oud", "Aswad Luxury Attar"
    ]
  },
  {
    title: "Modern & Brandable",
    icon: <Zap className="w-4 h-4 text-primary" />,
    items: [
      "Noorique", "Oudify", "Attarza", "Muskify", "Rehanique", 
      "Oudora", "Scentara", "Zayra Oud", "Abeerly", "Noorza"
    ]
  },
  {
    title: "Traditional Arabic",
    icon: <Moon className="w-4 h-4 text-primary" />,
    items: [
      "Al Khaas Oud", "Dahn Al Oud", "Al Qamar Attar", "Layl Fragrance", 
      "Al Misbah", "Al Anbar Attar", "Al Waha Perfumes", "Bait Al Oud", 
      "Al Rawdah Scents", "Dar Al Attar"
    ]
  }
];

const MegaMenu = ({ isOpen, onMouseEnter, onMouseLeave }: MegaMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="absolute top-20 left-0 right-0 bg-[#4A0101] border-b border-primary/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-40 overflow-hidden"
        >
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
              {megaMenuData.map((category) => (
                <div key={category.title} className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-border/50 pb-3">
                    {category.icon}
                    <h3 className="font-serif text-sm uppercase tracking-[0.2em] font-bold text-foreground/90">
                      {category.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {category.items.map((item) => (
                      <li key={item} className="group flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-primary/30 group-hover:text-primary transition-colors" />
                        <Link 
                          to={`/shop?search=${encodeURIComponent(item)}`}
                          className="text-muted-foreground font-sans text-xs tracking-wide hover:text-primary transition-colors inline-block"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="mt-12 pt-8 border-t border-border/20 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <p className="text-muted-foreground font-sans text-xs uppercase tracking-[0.1em]">Explore by Mood:</p>
                <div className="flex gap-4">
                  {["Morning Scent", "Evening Oud", "Wedding Musk", "Daily Fresh"].map(mood => (
                    <span key={mood} className="px-3 py-1 rounded-full bg-muted/30 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                      {mood}
                    </span>
                  ))}
                </div>
              </div>
              <Link to="/shop" className="text-primary font-sans text-xs uppercase tracking-[0.2em] font-bold hover:underline">
                View All Collections
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MegaMenu;
