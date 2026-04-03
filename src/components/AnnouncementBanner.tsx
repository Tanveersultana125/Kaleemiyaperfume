import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AnnouncementBanner = () => {
  const [latestAnnouncement, setLatestAnnouncement] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, "news"), 
      orderBy("timestamp", "desc"), 
      limit(1)
    );
    
    const unsub = onSnapshot(q, (snap) => {
      const allNews = snap.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const active = allNews.find(item => {
        const start = item.startDate ? new Date(item.startDate) : null;
        const end = item.endDate ? new Date(item.endDate) : null;
        
        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        const isStarted = !start || now >= start;
        const isNotExpired = !end || now <= end;
        
        return isStarted && isNotExpired;
      });

      setLatestAnnouncement(active || null);
    });

    return () => unsub();
  }, []);

  const handleBannerClick = () => {
    if (!latestAnnouncement) return;
    
    let path = "/shop";
    const params = new URLSearchParams();
    
    if (latestAnnouncement.targetCategory && latestAnnouncement.targetCategory !== "All") {
      params.append("category", latestAnnouncement.targetCategory);
    }
    if (latestAnnouncement.targetSubCategory && latestAnnouncement.targetSubCategory !== "All") {
      params.append("subcategory", latestAnnouncement.targetSubCategory);
    }
    if (latestAnnouncement.discountPercent) {
      params.append("discount", latestAnnouncement.discountPercent);
    }
    
    const queryString = params.toString();
    if (queryString) {
      navigate(`${path}?${queryString}`);
    } else {
      navigate(path);
    }
  };

  if (!latestAnnouncement || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        onClick={handleBannerClick}
        className="bg-[#310101] text-[#E5D5C5] relative z-[60] py-2.5 px-4 overflow-hidden border-b border-white/5 cursor-pointer hover:bg-[#3d0202] transition-colors group"
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B0843D] animate-pulse group-hover:scale-125 transition-transform" />
            <span className="text-[14px] md:text-[15px] font-black uppercase tracking-[0.25em] whitespace-nowrap">
              {latestAnnouncement.title}
            </span>
          </div>
          
          <div className="hidden md:block w-px h-3 bg-white/10" />
          
          <p className="hidden md:block text-[14px] font-medium tracking-wider opacity-60 truncate max-w-xl italic">
            {latestAnnouncement.content}
          </p>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors z-[70]"
          >
            <X className="w-4 h-4 opacity-40 hover:opacity-100" />
          </button>
        </div>
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-[#B0843D]/5 blur-3xl pointer-events-none" />
      </motion.div>
    </AnimatePresence>
  );
};

export default AnnouncementBanner;
