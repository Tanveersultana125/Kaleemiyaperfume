import { useState, useEffect } from "react";
import { Search, Menu, X, ChevronDown, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import MegaMenu from "./MegaMenu";
import CartDrawer from "./CartDrawer";


const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Attar", href: "/attar" },
  { name: "Gift Sets", href: "/gift-sets" },
  { name: "Prayer Mats", href: "/prayer-mats" },
  { name: "Books", href: "/books" },
  { name: "Contact", href: "/contact" }
];

const Header = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-full mx-auto flex items-center justify-between px-4 md:px-10 lg:px-16 h-20">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img 
            src="/logo.png" 
            alt="Kaleemiya Perfumes Logo" 
            className="h-12 md:h-16 lg:h-20 w-auto object-contain transition-all duration-300"
          />
        </Link>

        {/* Search Bar - Full screen overlay when open */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/98 backdrop-blur-xl flex items-center justify-center px-6 z-[60]"
            >
              <div className="w-full max-w-2xl relative z-[70]">
                <div className="relative">
                  <input 
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
                        setSearchOpen(false);
                      }
                      if (e.key === 'Escape') setSearchOpen(false);
                    }}
                    placeholder="Search our collection..."
                    className="w-full bg-transparent border-b-2 border-primary/30 py-6 px-16 text-2xl md:text-3xl font-serif focus:outline-none focus:border-primary transition-all text-foreground placeholder:text-muted-foreground/40"
                  />
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 text-primary/60" />
                  <button 
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-muted/50 rounded-full transition-colors group"
                  >
                    <X className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                </div>
                
                <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-8">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-[0.25em] order-2 md:order-1 opacity-70">
                    Press Enter to search or Escape to close
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Nav */}
        <nav 
          className="hidden lg:flex items-center gap-10"
          onMouseLeave={() => setMegaMenuOpen(false)}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-foreground/90 text-[10px] font-sans tracking-[0.25em] uppercase hover:text-accent transition-all duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-accent after:transition-all after:duration-500 hover:after:w-full"
            >
              {link.name}
            </Link>
          ))}
          
          <button
            onMouseEnter={() => setMegaMenuOpen(true)}
            className={`text-sm font-sans tracking-[0.15em] uppercase transition-colors duration-300 flex items-center gap-2 ${megaMenuOpen ? 'text-primary' : 'text-foreground/80 hover:text-primary'}`}
          >
            All Collections
          </button>
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-5">
          <button 
            className={`transition-colors duration-300 ${searchOpen ? 'text-primary' : 'text-foreground/70 hover:text-primary'}`} 
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          
          <CartDrawer />

          <button
            className="lg:hidden text-foreground/80 hover:text-primary p-2 -mr-2 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <MegaMenu 
        isOpen={megaMenuOpen} 
        onMouseEnter={() => setMegaMenuOpen(true)}
        onMouseLeave={() => setMegaMenuOpen(false)}
      />

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-background/98 backdrop-blur-lg border-t border-border/30 overflow-hidden"
          >
            <nav className="flex flex-col items-center py-10 gap-8">
              {navLinks.map((link, i) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
                    className="text-foreground/90 text-sm md:text-base font-sans tracking-[0.25em] uppercase py-3 hover:text-primary active:text-primary transition-all"
                  >
                    {link.name}
                  </motion.div>
                </Link>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.05, duration: 0.5 }}
                className="mt-4 px-8 py-4 border border-primary/30 text-[10px] tracking-[0.3em] uppercase text-primary font-bold hover:bg-primary/5 active:bg-primary/10 transition-all"
                onClick={() => {
                  setMobileOpen(false);
                  setMegaMenuOpen(true);
                }}
              >
                All Collections
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
