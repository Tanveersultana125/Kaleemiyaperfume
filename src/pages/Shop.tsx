import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SlidersHorizontal, ChevronDown, Package, LayoutGrid, Layers, Search as SearchIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

const categoriesArr = ["ALL", "MEN", "WOMEN", "UNISEX"] as const;
type Category = typeof categoriesArr[number];

const sortOptionsArr = ["Best selling", "Price: Low to High", "Price: High to Low", "Newest"] as const;
type SortOption = typeof sortOptionsArr[number];

interface ShopProps {
  title?: string;
  subtitle?: string;
  initialProductCategory?: "perfumes" | "attar" | "oud" | "giftsets" | "prayer mats" | "books" | "all";
  extraCategories?: string[];
  hideGenderFilters?: boolean;
}

const Shop = ({ 
  title = "Kaleemiya Boutique", 
  subtitle = "Browse our complete catalog — from rare Attars and premium Ouds to curated Gift Sets and Prayer Mats.",
  initialProductCategory = "all",
  extraCategories = [],
  hideGenderFilters = false
}: ShopProps) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("search");
  const urlCategory = searchParams.get("category")?.toLowerCase() || "";
  const urlSubCategory = searchParams.get("subcategory")?.toLowerCase() || "";
  
  const [activeGender, setActiveGender] = useState<Category>("ALL");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSubCategory, setActiveSubCategory] = useState<string>("all");
  const [activeSort, setActiveSort] = useState<SortOption>("Best selling");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const navigate = useNavigate();
  const { products: allProducts, loading: productsLoading } = useProducts();
  const [globalCategories, setGlobalCategories] = useState<string[]>([]);
  const [globalSubCategories, setGlobalSubCategories] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "metadata", "categories"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setGlobalCategories(data.list || []);
        setGlobalSubCategories(data.subs || {});
      }
    });
    return () => unsub();
  }, []);

  // Scroll to top when categories change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeCategory, activeGender, query]);

  // Sync initial category from props or URL - More Aggressive Sync
  useEffect(() => {
    if (urlCategory) {
      setActiveCategory(urlCategory);
    } else if (initialProductCategory && initialProductCategory !== "all") {
      setActiveCategory(initialProductCategory);
    } else {
      setActiveCategory("all");
    }
  }, [initialProductCategory, urlCategory]);

  // Sync sub-category from URL
  useEffect(() => {
    if (urlSubCategory) {
      const sub = urlSubCategory.toLowerCase();
      // If the subcategory is actually a gender term, set activeGender instead
      if (sub === "men") {
        setActiveGender("MEN");
        setActiveSubCategory("all");
      } else if (sub === "women") {
        setActiveGender("WOMEN");
        setActiveSubCategory("all");
      } else if (sub === "unisex") {
        setActiveGender("UNISEX");
        setActiveSubCategory("all");
      } else {
        setActiveSubCategory(urlSubCategory);
      }
    } else {
      setActiveSubCategory("all");
    }
  }, [urlSubCategory]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...allProducts].filter(p => p.isLive !== false);

    // Filter by search query if present
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(p => 
        (p.name || "").toLowerCase().includes(lowerQuery) || 
        (p.category || "").toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by type category or special tags
    if (activeCategory !== "all") {
      const lowerCat = activeCategory.toLowerCase();
      const normalizedTarget = lowerCat.replace(/\s+/g, "");
      
      if (lowerCat === "our bestseller") {
        filtered = filtered.filter(p => p.isBestseller === true);
      } else if (lowerCat === "new arrival") {
        filtered = filtered.filter(p => p.isNew === true);
      } else if (normalizedTarget === "tasbhi" || normalizedTarget === "tasbeeh") {
        filtered = filtered.filter(p => {
           const pCat = (p.category || "").toLowerCase().replace(/\s+/g, "");
           return pCat === "tasbhi" || pCat === "tasbeeh";
        });
      } else if (normalizedTarget === "giftsets") {
        filtered = filtered.filter(p => (p.category || "").toLowerCase().replace(/\s+/g, "") === "giftsets");
      } else if (normalizedTarget === "prayermats") {
         filtered = filtered.filter(p => (p.category || "").toLowerCase().replace(/\s+/g, "") === "prayermats");
      } else {
        filtered = filtered.filter(p => {
           const pCat = (p.category || "").toLowerCase().replace(/\s+/g, "");
           return pCat === normalizedTarget || (p.category || "").toLowerCase() === lowerCat;
        });
      }

      // Filter by Sub-category nested inside main category
      if (activeSubCategory !== "all") {
         const targetSub = activeSubCategory.toLowerCase().replace(/\s+/g, "");
         filtered = filtered.filter(p => {
            const pSub = (p.subCategory || "").toLowerCase().replace(/\s+/g, "");
            return pSub === targetSub || (p.subCategory || "").toLowerCase() === activeSubCategory.toLowerCase();
         });
      }
    }

    // Filter by gender
    if (activeGender !== "ALL") {
      filtered = filtered.filter((p) => (p.gender || "").toUpperCase() === activeGender);
    }

    // Sort products
    switch (activeSort) {
      case "Price: Low to High":
        filtered.sort((a, b) => a.numericPrice - b.numericPrice);
        break;
      case "Price: High to Low":
        filtered.sort((a, b) => b.numericPrice - a.numericPrice);
        break;
      case "Newest":
        filtered.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
        break;
      case "Best selling":
      default:
        filtered.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        break;
    }

    return filtered;
  }, [allProducts, activeGender, activeSort, activeCategory, activeSubCategory, query]);

  const activeCategorySubs = useMemo(() => {
    if (activeCategory === "all") return [];
    // Normalize by stripping spaces and lowercasing both sides for comparison
    const normalizedActive = activeCategory.toLowerCase().replace(/\s+/g, "");
    const match = Object.entries(globalSubCategories).find(
      ([cat]) => cat.toLowerCase().replace(/\s+/g, "") === normalizedActive
    );
    return match ? match[1] : [];
  }, [activeCategory, globalSubCategories]);

  if (productsLoading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-[#B0843D]/20 border-t-[#310101] rounded-full animate-spin" />
          <p className="text-[15px] font-black uppercase tracking-[0.4em] text-[#310101]/90 animate-pulse">Curation of Elegance...</p>
        </div>
      </div>
    );
  }

  let displayTitle = title;
  let displaySubtitle = subtitle;

  if (title === "Kaleemiya Boutique" && activeCategory && activeCategory !== "all") {
    // Default — capitalize
    displayTitle = activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);
    displaySubtitle = `Explore our curated selection of ${displayTitle}.`;

    const cat = activeCategory.toLowerCase().replace(/\s+/g, "");

    if (cat === "perfumes") {
      displayTitle = "Luxury Perfumes";
      displaySubtitle = "Discover our exquisite range of Men's, Women's, and Unisex fragrances — from French to Arabic concentrations.";
    } else if (cat === "attar") {
      displayTitle = "Exquisite Attars";
      displaySubtitle = "Discover our premium selection of concentrated perfume oils, crafted with traditional Middle Eastern artistry.";
    } else if (cat === "oud") {
      displayTitle = "Majestic Oud";
      displaySubtitle = "Experience the rich, woody, and luxurious essence of pure Oud — Cambodi, Assami, Indian and Malaysian.";
    } else if (cat === "bakhoor") {
      displayTitle = "Premium Bakhoor";
      displaySubtitle = "Fill your home with the enchanting and traditional aroma of Arabian Bakhoor — incense sticks, tablets, and loose wood.";
    } else if (cat === "giftsets" || cat === "gift sets") {
      displayTitle = "Curated Gift Sets";
      displaySubtitle = "Perfectly packaged luxury gift sets — from Bukhur Dans and Quran Books to Tasbeeh and premium Luxury Boxes.";
    } else if (cat === "tasbhi" || cat === "tasbeeh") {
      displayTitle = "Tasbhi & Prayer Beads";
      displaySubtitle = "Handcrafted Tasbeeh in Crystal, Wooden, Digital, and Stone — a meaningful gift for every occasion.";
    } else if (cat === "prayermats" || cat === "prayer mats") {
      displayTitle = "Premium Prayer Mats";
      displaySubtitle = "Exquisitely crafted Janimaaz and prayer mats — Velvet, Children's, and Travel sizes available.";
    } else if (cat === "books") {
      displayTitle = "Islamic Literature";
      displaySubtitle = "A curated collection of Quran, Hadith, and essential Islamic literature — in English, Urdu, Roman, and more.";
    } else if (cat === "ourbestseller") {
      displayTitle = "Our Bestsellers";
      displaySubtitle = "The most loved fragrances and products at Kaleemiya — handpicked by our customers.";
    } else if (cat === "newarrival") {
      displayTitle = "New Arrivals";
      displaySubtitle = "Fresh additions to our boutique — be the first to discover the newest scents and collections.";
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#310101] overflow-x-hidden flex flex-col">
      <Header />
      <div className="h-24 md:h-32"></div>

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 mb-32">
        {/* Page Header */}
        <div className="flex flex-col items-center text-center py-16 space-y-4">
          <motion.h1 
            key={displayTitle}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-serif text-[#310101]"
          >
            {displayTitle}
          </motion.h1>
          <p className="text-[#310101] font-sans text-sm md:text-base max-w-2xl">
            {displaySubtitle}
          </p>
        </div>

        {/* Subcategory and Category Filters Ribbon */}
        {((activeCategory === "all" && globalCategories.length > 0) || (activeCategory !== "all" && activeCategorySubs.length > 0)) && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-4 py-8 border-y border-[#310101]/5"
          >
            {activeCategory === "all" ? (
              // When browsing entire shop, show main categories as pills
              <>
                <button 
                  onClick={() => setActiveCategory("all")}
                  className={`px-6 py-2.5 rounded-full text-[13px] font-black uppercase tracking-widest transition-all ${
                    activeCategory === "all" ? "bg-[#B0843D] text-[#E5D5C5] shadow-lg" : "bg-[#F9F6F2] border border-[#310101]/10 text-[#310101]/80 hover:bg-[#310101] hover:text-[#E5D5C5]"
                  }`}
                >
                  All Collections
                </button>
                {globalCategories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set("category", cat.toLowerCase());
                        params.delete("subcategory");
                        navigate(`/shop?${params.toString()}`);
                    }}
                    className="px-6 py-2.5 rounded-full text-[13px] font-black uppercase tracking-widest transition-all bg-[#F9F6F2] border border-[#310101]/10 text-[#310101]/80 hover:bg-[#310101] hover:text-[#E5D5C5]"
                  >
                    {cat}
                  </button>
                ))}
              </>
            ) : (
              // When browsing a specific category, show its subcategories
              <>
                <button 
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.delete("subcategory");
                    navigate(`/shop?${params.toString()}`);
                  }}
                  className={`px-6 py-2.5 rounded-full text-[13px] font-black uppercase tracking-widest transition-all ${
                    activeSubCategory === "all" ? "bg-[#B0843D] text-[#E5D5C5] shadow-lg" : "bg-[#F9F6F2] border border-[#310101]/10 text-[#310101]/80 hover:bg-[#310101] hover:text-[#E5D5C5]"
                  }`}
                >
                  All
                </button>
                {activeCategorySubs.map(sub => (
                  <button 
                    key={sub}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set("subcategory", sub.toLowerCase());
                      navigate(`/shop?${params.toString()}`);
                    }}
                    className={`px-6 py-2.5 rounded-full text-[13px] font-black uppercase tracking-widest transition-all ${
                      activeSubCategory === sub.toLowerCase() ? "bg-[#B0843D] text-[#E5D5C5] shadow-lg" : "bg-[#F9F6F2] border border-[#310101]/10 text-[#310101]/80 hover:bg-[#310101] hover:text-[#E5D5C5]"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </>
            )}
          </motion.div>
        )}

        {/* Filters and Sorting Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 py-12 border-b border-[#310101]/5">
           <div className="flex flex-wrap items-center gap-10">
              <button 
                onClick={() => {
                  setActiveCategory("all");
                  setActiveSubCategory("all");
                  setActiveGender("ALL");
                  navigate("/shop", { replace: true });
                }}
                className={`text-[15px] font-black uppercase tracking-[0.2em] transition-all px-6 py-2.5 rounded-full ${
                  activeCategory === "all" ? "bg-[#310101] text-white shadow-xl" : "bg-transparent text-[#310101]/90 hover:text-[#310101]"
                }`}
              >
                VIEW ENTIRE CATALOG
              </button>
              
              {/* Gender filters — hidden for Books, Prayer Mats, Tasbhi, Gift Sets (not gender-specific) */}
              {!["books", "prayermats", "prayer mats", "tasbhi", "tasbeeh", "giftsets", "gift sets"].includes(
                activeCategory.toLowerCase().replace(/\s+/g, "")
              ) && (
                <>
                  <div className="h-6 w-[1px] bg-[#310101]/10 hidden md:block" />
                  <div className="flex gap-8">
                    {categoriesArr.map((g) => (
                      <button 
                        key={g} 
                        onClick={() => setActiveGender(g)}
                        className={`text-[15px] font-black uppercase tracking-[0.2em] transition-all ${
                          activeGender === g ? "text-[#B0843D]" : "text-[#310101]/80 hover:text-[#310101]"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </>
              )}
           </div>

           <div className="flex items-center gap-8 self-end lg:self-center">
              <span className="text-[14px] font-black uppercase tracking-[0.15em] text-[#310101]/80 hidden sm:block">
                 Found {filteredAndSortedProducts.length} Artisan Creations
              </span>
              <div className="relative group/sort">
                 <button 
                   onClick={() => setIsSortOpen(!isSortOpen)}
                   className="flex items-center gap-4 border border-[#310101]/10 px-8 py-4 rounded-full text-[15px] font-black uppercase tracking-[0.1em] text-[#310101] hover:border-[#310101]/30 transition-all bg-white"
                 >
                    {activeSort}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-500 ${isSortOpen ? 'rotate-180' : ''}`} />
                 </button>
                 <AnimatePresence>
                   {isSortOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-64 bg-white border border-[#310101]/10 rounded-2xl shadow-2xl z-50 overflow-hidden py-3"
                      >
                         {sortOptionsArr.map(opt => (
                            <button 
                              key={opt}
                              onClick={() => { setActiveSort(opt); setIsSortOpen(false); }}
                              className={`w-full text-left px-8 py-3 text-[14px] font-black uppercase tracking-widest transition-all ${
                                activeSort === opt ? "text-[#B0843D] bg-gray-50" : "text-[#310101] hover:text-[#310101] hover:bg-gray-100"
                              }`}
                            >
                               {opt}
                            </button>
                         ))}
                      </motion.div>
                   )}
                 </AnimatePresence>
              </div>
           </div>
        </div>

        {/* Status Area */}
        {(activeCategory !== "all" || activeSubCategory !== "all" || activeGender !== "ALL") && (
          <div className="py-10 flex flex-wrap items-center gap-4">
             <div className="flex items-center gap-2 text-[#310101]/70 font-black uppercase tracking-[0.2em] text-[14px]">Active Exploration:</div>
             <div className="flex flex-wrap gap-4">
                {activeCategory !== "all" && (
                   <span className="bg-[#310101] text-white px-5 py-2 rounded-full text-[14px] font-black uppercase tracking-[0.15em] flex items-center gap-3">
                      {activeCategory}
                      <button onClick={() => { setActiveCategory("all"); setActiveSubCategory("all"); }} className="hover:scale-125 transition-transform opacity-60">×</button>
                   </span>
                )}
                {activeSubCategory !== "all" && (
                   <span className="bg-[#B0843D] text-white px-5 py-2 rounded-full text-[14px] font-black uppercase tracking-[0.15em] flex items-center gap-3">
                      {activeSubCategory}
                      <button onClick={() => setActiveSubCategory("all")} className="hover:scale-125 transition-transform opacity-60">×</button>
                   </span>
                )}
                {activeGender !== "ALL" && (
                   <span className="bg-[#F9F6F2] border border-[#310101]/10 text-[#310101] px-5 py-2 rounded-full text-[14px] font-black uppercase tracking-[0.15em] flex items-center gap-3">
                      {activeGender}
                      <button onClick={() => setActiveGender("ALL")} className="hover:scale-125 transition-transform opacity-40">×</button>
                   </span>
                )}
             </div>
          </div>
        )}

        {/* Product Grid Area */}
        <div className="pt-8">
           {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-20">
                 {filteredAndSortedProducts.map((product) => (
                    <div key={product.id} className="w-full">
                       <ProductCard {...product} />
                    </div>
                 ))}
              </div>
           ) : (
              <div className="py-40 text-center bg-[#F9F6F2] rounded-[60px] border-2 border-dashed border-[#310101]/5 flex flex-col items-center justify-center">
                 <div className="w-24 h-24 bg-white/50 rounded-full flex items-center justify-center mb-8">
                   <SlidersHorizontal className="w-10 h-10 text-[#310101]/60" />
                 </div>
                 <h2 className="text-3xl font-serif text-[#310101] mb-2">No matching artisan items</h2>
                 <p className="text-[#310101]/90 font-sans text-sm italic">Extend your search criteria to explore more of Kaleemiya's heritage.</p>
                 <button 
                   onClick={() => {
                     setActiveCategory("all");
                     setActiveGender("ALL");
                     setActiveSubCategory("all");
                     navigate("/shop", { replace: true });
                   }}
                   className="mt-12 bg-[#310101] text-[#E5D5C5] px-12 py-5 rounded-full text-[14px] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
                 >
                   Reset My Exploration
                 </button>
              </div>
           )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
