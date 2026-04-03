import { useState, useEffect } from "react";
import { Search, Menu, X, ChevronDown, ShoppingBag, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MegaMenu from "./MegaMenu";
import CartDrawer from "./CartDrawer";
import AnnouncementBanner from "./AnnouncementBanner";



const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Attar", href: "/attar" },
  { name: "Gift Sets", href: "/gift-sets" },
  { name: "Prayer Mats", href: "/prayer-mats" },
  { name: "Books", href: "/books" },
  { name: "Contact", href: "/contact" }
];

import AccountDrawer from "./AccountDrawer";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [megaMenuTimer, setMegaMenuTimer] = useState<any>(null);

  const handleOpenMegaMenu = () => {
    if (megaMenuTimer) clearTimeout(megaMenuTimer);
    setMegaMenuOpen(true);
  };

  const handleCloseMegaMenu = () => {
    const timer = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 300); // 300ms delay to help mouse reach menu
    setMegaMenuTimer(timer);
  };

  const [isLiveEnabled, setIsLiveEnabled] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    
    // Check initial settings
    const stored = localStorage.getItem("kaleemiya_store_settings");
    if (stored) {
      const settings = JSON.parse(stored);
      setIsLiveEnabled(settings.publicLivePage ?? true);
    }

    // Real-time synchronization
    const handleSettingsUpdate = () => {
      const stored = localStorage.getItem("kaleemiya_store_settings");
      if (stored) {
        const settings = JSON.parse(stored);
        setIsLiveEnabled(settings.publicLivePage ?? true);
      }
    };
    
    window.addEventListener("storage", handleSettingsUpdate);
    window.addEventListener("kaleemiya_settings_updated", handleSettingsUpdate);
    
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("storage", handleSettingsUpdate);
      window.removeEventListener("kaleemiya_settings_updated", handleSettingsUpdate);
    };
  }, []);

  // Premium Ivory Background Color
  const headerBg = "#F9F6F2"; 

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-sm border-b border-gray-100 backdrop-blur-md`}
      style={{ backgroundColor: `${headerBg}F0` }} // Added transparency for blur effect
    >
      <AnnouncementBanner />

      <div className="w-full max-w-none px-6 md:px-12" style={{ backgroundColor: headerBg }}>
        <div className="flex items-center justify-between py-4 md:py-6 gap-6 lg:gap-10">
          
          {/* 1. Left: Logo */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="Kaleemiya Perfumes Logo" 
              className="h-[72px] my-[-16px] md:h-[96px] md:my-[-24px] lg:h-[104px] lg:my-[-24px] w-auto object-contain transition-all duration-700 hover:scale-105 drop-shadow-[0_0_15px_rgba(0,0,0,0.05)]" 
            />
          </Link>

          {/* 2. Center: Navigation Links (Bigger Font) */}
          <nav className="hidden xl:flex items-center justify-center flex-1">
            <ul className="flex items-center gap-2 lg:gap-5">
              {[
                { name: "Home", path: "/" },
                { name: "Shop", path: "/shop" },
                { name: "Attar", path: "/attar" },
                { name: "Gift Sets", path: "/gift-sets" },
                { name: "Prayer Mats", path: "/prayer-mats" },
                { name: "Books", path: "/books" },
                { name: "Contact", path: "/contact" },
                { name: "All Collections", path: "/shop" },
                { name: "Track Order", path: "/track-order" },
              ].map((link, idx, arr) => (
                <li key={link.name} className="flex items-center shrink-0">
                  {link.name === "All Collections" ? (
                    <div 
                      onMouseEnter={handleOpenMegaMenu}
                      onMouseLeave={handleCloseMegaMenu}
                      className="relative h-full flex items-center"
                    >
                      <Link
                        to={link.path}
                        className="text-[14px] lg:text-[14px] font-bold uppercase tracking-[0.15em] text-black hover:text-black/70 hover:bg-black/5 py-2.5 px-3 lg:px-4 rounded-md transition-all whitespace-nowrap"
                      >
                        {link.name}
                        <ChevronDown className={`inline-block ml-1 w-3 h-3 transition-transform ${megaMenuOpen ? "rotate-180" : ""}`} />
                      </Link>
                    </div>
                  ) : (
                    <Link
                      to={link.path}
                      className="text-[14px] lg:text-[14px] font-bold uppercase tracking-[0.15em] text-black hover:text-black/70 hover:bg-black/5 py-2.5 px-3 lg:px-4 rounded-md transition-all whitespace-nowrap"
                    >
                      {link.name}
                    </Link>
                  )}
                  {idx < arr.length - 1 && (
                    <span className="text-black/10 text-sm mx-1 font-medium select-none opacity-50">|</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* 3. Right: Search + Account + Cart */}
          <div className="flex items-center gap-3 lg:gap-8 shrink-0">
            {/* Desktop Search Bar */}
            <div className="hidden lg:flex relative w-48 xl:w-72">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
                  }
                }}
                placeholder="Search..."
                className="w-full bg-black/5 border border-transparent rounded-full py-2 px-5 pr-10 text-[15px] text-black placeholder:text-black/40 focus:outline-none focus:bg-white focus:border-black/10 transition-all font-sans"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/40" />
            </div>

            <button 
              onClick={() => setAccountOpen(true)}
              className="text-black hover:text-black/70 transition-colors hidden sm:flex items-center gap-2 group"
            >
              <User className="w-4 h-4 md:w-4.5 md:h-4.5" />
              <span className="text-[14px] lg:text-[15px] uppercase tracking-widest text-black group-hover:text-black/70 font-bold whitespace-nowrap">
                {user ? user.displayName?.split(" ")[0] : "Account"}
              </span>
            </button>
            <Search className="lg:hidden w-5 h-5 text-black" onClick={() => setSearchOpen(!searchOpen)} />
            <CartDrawer />
            
            {/* Mobile Menu Toggle */}
            <button 
              className="xl:hidden text-black"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <MegaMenu 
        isOpen={megaMenuOpen} 
        onMouseEnter={handleOpenMegaMenu}
        onMouseLeave={handleCloseMegaMenu}
        onClose={() => setMegaMenuOpen(false)}
      />

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-white/98 backdrop-blur-lg border-t border-gray-100 overflow-hidden"
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
                    className="text-black text-base font-sans tracking-[0.25em] uppercase py-3 hover:text-black/70 active:text-black transition-all"
                  >
                    {link.name}
                  </motion.div>
                </Link>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.05, duration: 0.5 }}
                className="mt-4 px-8 py-4 border border-black/30 text-[14px] tracking-[0.3em] uppercase text-black font-bold hover:bg-black/5 active:bg-black/10 transition-all"
                onClick={() => {
                  setMobileOpen(false);
                  setMegaMenuOpen(true);
                }}
              >
                All Collections
              </motion.button>
              
              <button 
                onClick={() => { setMobileOpen(false); setAccountOpen(true); }}
                className="flex items-center gap-2 text-black/60 font-bold uppercase tracking-widest text-[13px] border-t border-gray-100 w-full justify-center pt-8"
              >
                 <User size={14} /> {user ? "View My Profile" : "Sign In / Join"}
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>

    <AccountDrawer isOpen={accountOpen} onClose={() => setAccountOpen(false)} />
    </>
  );
};

export default Header;
