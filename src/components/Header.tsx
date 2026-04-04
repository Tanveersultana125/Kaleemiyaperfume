import { useState, useEffect } from "react";
import { Search, Menu, X, ChevronDown, ShoppingBag, User, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
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

      <div className="w-full max-w-none px-4 sm:px-8 md:px-12" style={{ backgroundColor: headerBg }}>
        <div className="flex items-center justify-between h-20 sm:h-24 md:h-28 gap-4">
          
          {/* 1. Left: Logo */}
          <Link to="/" className="flex-shrink-0 z-10">
            <img 
              src="/logo.png" 
              alt="Kaleemiya Perfumes Logo" 
              className="h-12 sm:h-16 md:h-18 lg:h-22 w-auto object-contain transition-all duration-700 hover:scale-105 drop-shadow-[0_0_15px_rgba(0,0,0,0.05)]" 
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
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 shrink-0">
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
               <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
            </div>

            <button 
              onClick={() => setAccountOpen(true)}
              className="text-black hover:text-black/70 transition-colors hidden md:flex items-center gap-2 group"
            >
              <User className="w-5 h-5 text-black/80" />
              <span className="text-[13px] lg:text-[14px] uppercase tracking-[0.2em] text-black group-hover:text-black/70 font-bold whitespace-nowrap">
                {user ? user.displayName : "Account"}
              </span>
            </button>
            <Search className="lg:hidden w-6 h-6 text-black cursor-pointer active:scale-95 transition-transform" onClick={() => setSearchOpen(!searchOpen)} />
            <div className="scale-110 sm:scale-125 origin-right">
              <CartDrawer />
            </div>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="xl:hidden text-black p-1 active:scale-90 transition-transform"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
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

      {/* Mobile Drawer Overlay & Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998] xl:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              className="fixed top-0 right-0 h-[100dvh] w-[85vw] max-w-[400px] bg-[#FDFCFB] z-[999] shadow-[-20px_0_40px_rgba(0,0,0,0.2)] flex flex-col xl:hidden overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 pt-10 border-b border-black/5 bg-white">
                <span className="font-serif text-2xl text-black">Menu</span>
                <button 
                  onClick={() => setMobileOpen(false)}
                  className="p-2 -mr-2 text-black/60 hover:text-black transition-colors rounded-full hover:bg-black/5"
                >
                  <X className="w-7 h-7" />
                </button>
              </div>

              {/* Drawer Content */}
              <nav className="flex-1 px-8 py-10 flex flex-col gap-5 bg-[#FDFCFB]">
                {navLinks.map((link, i) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="group"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05, duration: 0.4, ease: "easeOut" }}
                      className="text-[#310101] text-[13px] font-black tracking-[0.25em] uppercase py-4 border-b border-black/5 flex items-center justify-between group-hover:text-[#B0843D] transition-colors"
                    >
                      {link.name}
                      <span className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#B0843D] text-[10px]">→</span>
                    </motion.div>
                  </Link>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + navLinks.length * 0.05, duration: 0.4 }}
                  className="pt-6"
                >
                  <button
                    className="w-full py-4 bg-black text-white text-[11px] tracking-[0.3em] uppercase font-black hover:bg-[#310101] active:scale-[0.98] transition-all shadow-lg shadow-black/10 rounded-full"
                    onClick={() => {
                      setMobileOpen(false);
                      setMegaMenuOpen(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    All Collections
                  </button>
                </motion.div>
              </nav>

              {/* Drawer Footer */}
              <div className="p-8 bg-[#F9F6F2] mt-auto border-t border-[#E5D5C5]/40">
                <button 
                  onClick={() => { setMobileOpen(false); setAccountOpen(true); }}
                  className="flex items-center justify-center gap-3 w-full py-4 text-[#310101] text-[11px] font-black uppercase tracking-[0.25em] hover:text-[#B0843D] transition-colors bg-white rounded-full shadow-sm border border-[#E5D5C5]/30"
                >
                  <User size={15} className="text-[#B0843D]" /> 
                  {user ? "View Profile" : "Identity Sign-In"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>

    <AccountDrawer isOpen={accountOpen} onClose={() => setAccountOpen(false)} />
    </>
  );
};

export default Header;
