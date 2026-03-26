import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ProductImageSliderProps {
  images: string[];
}

const ProductImageSlider = ({ images }: ProductImageSliderProps) => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Perfect modulo wrap for positive and negative numbers guarantees exact index alignment
  const imageIndex = ((page % images.length) + images.length) % images.length;

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const openImage = (index: number) => {
    if (index === imageIndex) {
      setIsLightboxOpen(true);
      return;
    }
    const newDirection = index > imageIndex ? 1 : -1;
    // We adjust the absolute page counter by the exact difference to jump correctly
    setPage([page + (index - imageIndex), newDirection]);
    setIsLightboxOpen(true);
  };

  const setExactImage = (index: number) => {
    if (index === imageIndex) return;
    const newDirection = index > imageIndex ? 1 : -1;
    setPage([page + (index - imageIndex), newDirection]);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Main Image View */}
      <div 
        className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-sm bg-[#1A0B0B] shadow-[0_8px_30px_rgb(0,0,0,0.12)] touch-pan-y group cursor-zoom-in"
        onClick={() => openImage(imageIndex)}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={page}
            src={images[imageIndex]}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute inset-0 w-full h-full object-cover select-none"
            alt={`Product view ${imageIndex}`}
          />
        </AnimatePresence>

        <div className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-4 h-4" />
        </div>

        {images.length > 1 && (
          <>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-primary/80 hover:text-primary-foreground border border-white/10 transition-all duration-300 opacity-80 md:opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                paginate(-1);
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-primary/80 hover:text-primary-foreground border border-white/10 transition-all duration-300 opacity-80 md:opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                paginate(1);
              }}
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails row mapping exact indices */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide py-1">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setExactImage(index)}
              className={`relative flex-shrink-0 w-20 h-24 overflow-hidden rounded-sm border-2 transition-all duration-300 ${
                index === imageIndex ? "border-primary select-none shadow-md" : "border-transparent opacity-60 hover:opacity-100"
              }`}
              aria-label={`Select image ${index}`}
            >
              <img src={img} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
              {index === imageIndex && <div className="absolute inset-0 bg-primary/10" />}
            </button>
          ))}
        </div>
      )}

      {/* Exact Match Detail Modal / Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] bg-transparent border-none shadow-none flex p-0 justify-center items-center">
          <DialogTitle className="sr-only">Product Detail View</DialogTitle>
          <DialogDescription className="sr-only">High resolution product image</DialogDescription>
          
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={`modal-${page}`}
                src={images[imageIndex]}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="max-w-full max-h-full object-contain drop-shadow-2xl"
                alt={`Product detail ${imageIndex}`}
              />
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    paginate(-1);
                  }}
                >
                  <ChevronLeft className="w-8 h-8 -ml-1" />
                </button>
                <button
                  className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    paginate(1);
                  }}
                >
                  <ChevronRight className="w-8 h-8 ml-1" />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductImageSlider;
