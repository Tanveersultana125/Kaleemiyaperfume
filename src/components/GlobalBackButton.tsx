import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const GlobalBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Do not show on Home page or Admin pages (admin has its own nav)
  if (location.pathname === "/" || location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        onClick={() => navigate(-1)}
        className="fixed bottom-24 left-6 md:bottom-24 md:left-12 z-[9990] w-12 h-12 md:w-14 md:h-14 bg-white/90 backdrop-blur-md border border-black/5 rounded-full flex items-center justify-center text-[#310101] shadow-2xl hover:bg-white transition-all active:scale-95 group"
        aria-label="Go Back"
      >
        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        
        {/* Tooltip for Desktop */}
        <div className="absolute left-full ml-3 bg-[#310101] text-white py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
          <p className="text-[11px] uppercase font-black tracking-[0.25em]">Go Back</p>
        </div>
      </motion.button>
    </AnimatePresence>
  );
};

export default GlobalBackButton;
