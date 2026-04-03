import { motion } from "framer-motion";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1, delay: 3, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#310101] overflow-hidden"
    >
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 px-6">
        {/* Logo Side */}
        <motion.div
          initial={{ x: -50, opacity: 0, scale: 0.9 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Subtle Pulse Glow */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute inset-0 bg-primary/20 blur-[20px] rounded-[10%]"
          />
          
          <img 
            src="/logo.png" 
            alt="Kaleemiya Logo" 
            className="h-32 md:h-40 xl:h-48 w-auto object-contain relative z-10 drop-shadow-2xl brightness-110" 
          />
        </motion.div>

        {/* Divider - Vertical on desktop, Horizontal on mobile */}
        <motion.div
          initial={{ scaleY: 0, scaleX: 0 }}
          animate={{ scaleY: 1, scaleX: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
          className="w-24 md:w-px h-px md:h-32 bg-gradient-to-r md:bg-gradient-to-b from-transparent via-primary/50 to-transparent"
        />

        {/* Text Side */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center md:text-left"
        >
          <motion.h1 
            className="font-serif text-4xl md:text-6xl text-primary tracking-[0.3em] uppercase font-medium leading-none"
          >
            Kaleemiya
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-[14px] md:text-sm tracking-[0.4em] uppercase text-white/40 font-sans mt-8 bg-clip-text text-transparent bg-gradient-to-r from-white/20 via-white/50 to-white/20"
          >
            Since 2010 • Pure Arabic Feel
          </motion.p>
        </motion.div>
      </div>

      {/* Luxury Background Shimmer */}
      <motion.div
        animate={{ 
          x: [-500, 1500],
          opacity: [0, 0.1, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 4, 
          delay: 1,
          ease: "linear" 
        }}
        className="absolute top-0 bottom-0 w-[300px] bg-gradient-to-r from-transparent via-primary/20 to-transparent skew-x-[30deg]"
      />
    </motion.div>
  );
};

export default SplashScreen;
