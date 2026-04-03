import React from 'react';
import { motion } from 'framer-motion';

const RevenueVelocity = () => {
  const data = [
    { day: "MON", h: 40, v: "2.1k", g: "from-[#310101]/90 to-[#B0843D]/50" },
    { day: "TUE", h: 70, v: "4.5k", g: "from-[#4a0101]/90 to-[#D4AF37]/50" },
    { day: "WED", h: 45, v: "2.8k", g: "from-[#2b0000]/90 to-[#E5D5C5]/50" },
    { day: "THU", h: 90, v: "6.2k", g: "from-[#B0843D] to-[#FDFCFB]" },
    { day: "FRI", h: 65, v: "4.1k", g: "from-[#310101]/90 to-[#B0843D]/50" },
    { day: "SAT", h: 80, v: "5.5k", g: "from-[#6a0d0d]/90 to-[#B0843D]/50" },
    { day: "SUN", h: 100, v: "8.0k", g: "from-[#310101] to-[#D4AF37]" },
  ];

  return (
    <div className="bg-[#FDFCFB] rounded-[70px] p-16 shadow-2xl border border-[#310101]/5 relative overflow-hidden group/card min-h-[550px] flex flex-col transition-all duration-700 hover:shadow-gold-glow w-full">
      {/* Elite Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-16 relative z-10 w-full">
        <div className="space-y-4">
          <h4 className="text-6xl font-serif font-black italic text-[#310101] tracking-tight leading-[1.1]">Revenue Velocity</h4>
          <div className="flex items-center gap-4">
             <div className="w-12 h-[2px] bg-[#B0843D]" />
             <p className="text-[13px] font-black text-[#B0843D] uppercase tracking-[0.6em] opacity-80">Graphed Boutique Analytics</p>
          </div>
        </div>
        
        <div className="bg-[#310101] text-[#E5D5C5] px-10 py-5 rounded-full text-[13px] font-black uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 shrink-0 hover:scale-105 transition-all">
           <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse" />
           7 Days • Live Data
        </div>
      </div>

      {/* Grand Artisan Graph Container */}
      <div className="flex-1 flex items-end justify-between gap-8 pt-10 px-4 w-full">
        {data.map((bar, i) => (
          <div key={i} className="flex-1 h-full flex flex-col justify-end gap-10 group/bar-container relative">
            <div className="flex-1 relative flex items-end">
               {/* Peak Glow Effect */}
               <div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] blur-[40px] opacity-0 group-hover/bar-container:opacity-20 transition-opacity duration-1000 bg-[#B0843D]" 
                  style={{ height: `${bar.h}%` }}
               />
               
               <motion.div 
                  initial={{ height: 0 }} 
                  animate={{ height: `${bar.h}%` }} 
                  transition={{ duration: 1.5, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className={`w-full bg-gradient-to-t ${bar.g} rounded-t-[40px] relative group/bar hover:brightness-110 transition-all duration-700 shadow-xl border-x border-t border-white/10 cursor-pointer overflow-hidden`}
               >
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                  <div className="absolute top-0 inset-x-0 h-4 bg-white/20 blur-[10px]" />
               </motion.div>
               
               {/* Data Tooltip */}
               <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-[#310101] text-[#E5D5C5] px-6 py-3 rounded-2xl text-[14px] font-serif italic font-black tracking-widest opacity-0 group-hover/bar-container:opacity-100 -translate-y-4 group-hover/bar-container:translate-y-0 transition-all duration-500 shadow-[0_15px_40px_rgba(49,1,1,0.3)] z-50 pointer-events-none">
                  ₹{bar.v}
               </div>
            </div>
            <div className="text-[14px] font-black text-[#310101]/20 text-center uppercase tracking-[0.4em] leading-none shrink-0 group-hover/bar-container:text-[#B0843D] group-hover/bar-container:opacity-100 transition-all">{bar.day}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueVelocity;
