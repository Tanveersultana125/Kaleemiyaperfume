import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { allProducts } from "@/data/products";

const categories = ["ALL", "MEN", "WOMEN", "UNISEX"] as const;
type Category = typeof categories[number];

const sortOptions = ["Best selling", "Price: Low to High", "Price: High to Low", "Newest"] as const;
type SortOption = typeof sortOptions[number];

interface ShopProps {
  title?: string;
  subtitle?: string;
  initialProductCategory?: "perfumes" | "attar" | "oud" | "giftsets" | "prayer mats" | "books" | "all";
  extraCategories?: string[];
  hideGenderFilters?: boolean;
}

const Shop = ({ 
  title = "Our Collection", 
  subtitle = "Discover our entire range of exquisite fragrances, meticulously crafted to leave a lasting impression.",
  initialProductCategory = "all",
  extraCategories = [],
  hideGenderFilters = false
}: ShopProps) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("search");
  
  const [activeGender, setActiveGender] = useState<Category>("ALL");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSort, setActiveSort] = useState<SortOption>("Best selling");
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Scroll to top when this page loads or when filters/categories change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeCategory, activeGender, query]);

  // Sync initial category from props
  useEffect(() => {
    if (initialProductCategory) {
      setActiveCategory(initialProductCategory);
    }
  }, [initialProductCategory]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Filter by search query if present
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.category.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by type category (Perfumes / Attar / etc)
    if (activeCategory !== "all") {
      filtered = filtered.filter(p => p.category === activeCategory || p.subCategory === activeCategory);
    }

    // Filter by gender
    if (activeGender !== "ALL") {
      filtered = filtered.filter((p) => p.gender.toUpperCase() === activeGender);
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
        filtered.sort((a, b) => (a.bestsellerRank || 99) - (b.bestsellerRank || 99));
        break;
    }

    return filtered;
  }, [activeGender, activeSort, activeCategory, query]);

  const productCategories = ["all", "perfumes", "attar", "oud", "giftsets", "prayer mats", "books"];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col">
      <Header />
      
      <div className="h-24 md:h-32"></div>

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 mb-20 space-y-12">
        <div className="text-center pt-8">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">{title}</h1>
          <p className="text-muted-foreground font-sans tracking-wide max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-y border-border/40 py-6">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <div className="flex items-center gap-2 text-foreground mr-4">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              <span className="font-serif text-lg tracking-wide capitalize">Filters</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {[...(hideGenderFilters ? ["ALL"] : categories), ...(extraCategories.length > 0 ? extraCategories : productCategories.filter(c => c !== "all"))].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    if (categories.includes(cat as any)) {
                      setActiveGender(cat as any);
                    } else {
                      setActiveCategory(cat);
                    }
                  }}
                  className={`text-sm font-serif tracking-widest uppercase transition-all relative py-1 ${
                    (activeGender === cat || activeCategory === cat)
                      ? "text-primary border-b-2 border-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat === "giftsets" ? "Gift Sets" : cat === "prayer mats" ? "Prayer Mats" : cat === "spray" ? "Spray Bottle" : cat === "bukhurdan" ? "Bukhurdan" : cat === "quran box" ? "Quran Box" : cat === "tasbeeh" ? "Tasbeeh" : cat === "english" ? "English" : cat === "roman" ? "Roman" : cat === "urdu" ? "Urdu" : cat === "janimaaz" ? "Janimaaz" : cat}
                </button>
              ))}
              
              {(activeGender !== "ALL" || activeCategory !== "all") && (
                <button 
                  onClick={() => {
                    setActiveGender("ALL");
                    setActiveCategory("all");
                  }}
                  className="text-[10px] text-primary hover:underline font-bold uppercase tracking-widest ml-4"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between lg:justify-end gap-8">
            <span className="text-xs text-muted-foreground font-sans tracking-wide hidden md:block">
              Showing - {filteredAndSortedProducts.length} premium products
            </span>

            <div className="relative w-full lg:w-auto">
              <button 
                className="flex items-center gap-4 border border-border/60 py-2.5 px-6 rounded-full hover:border-primary/50 transition-all text-foreground min-w-[200px] justify-between text-sm bg-muted/20 backdrop-blur-sm"
                onClick={() => setIsSortOpen(!isSortOpen)}
              >
                <span className="font-serif tracking-wide">{activeSort}</span>
                <ChevronDown className={`w-4 h-4 text-primary transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isSortOpen && (
                <div className="absolute top-full right-0 mt-1 w-full bg-background border border-border/50 rounded-sm shadow-xl z-10 py-1">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      className={`w-full text-left px-4 py-2 hover:bg-muted/50 transition-colors ${
                        activeSort === option ? "text-primary gold-gradient-text" : "text-foreground"
                      }`}
                      onClick={() => {
                        setActiveSort(option);
                        setIsSortOpen(false);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {filteredAndSortedProducts.map((p) => (
            <div key={p.id} className="w-full max-w-[300px]">
              <ProductCard {...p} />
            </div>
          ))}
          {filteredAndSortedProducts.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              <p>No products match the selected filter.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
