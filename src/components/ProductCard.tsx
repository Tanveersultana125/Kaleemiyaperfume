import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Star, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  price: string;
  isNew?: boolean;
  category?: string;
  subCategory?: string;
  discountPrice?: string;
}

const ProductCard = ({ id, image, name, price, isNew, category, subCategory, discountPrice }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Simple Manual Discount Logic
  let activeDiscountPrice = discountPrice;
  let activeDiscountPercent = 0;

  if (discountPrice) {
    const rawPrice = parseInt(price?.replace(/[^\d]/g, "") || "0");
    const rawDiscount = parseInt(discountPrice?.replace(/[^\d]/g, "") || "0");
    if (rawPrice > 0 && rawDiscount > 0) {
      activeDiscountPercent = Math.round(((rawPrice - rawDiscount) / rawPrice) * 100);
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use the correctly discounted price for the cart
    const finalCartPrice = activeDiscountPrice 
      ? (activeDiscountPrice.startsWith('\u20B9') ? activeDiscountPrice : `\u20B9${parseInt(activeDiscountPrice).toLocaleString()}`) 
      : price;
    addToCart({ id, image, name, price: finalCartPrice });
  };

  return (
    <motion.div
      className="group w-full h-full cursor-pointer bg-[#FDFCFB] border border-black/5 hover:border-[#B0843D]/30 transition-all duration-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl flex flex-col relative"
      onClick={() => navigate(`/product/${id}`)}
    >
      <div className="relative aspect-square sm:aspect-[4/5] overflow-hidden bg-white rounded-t-xl">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {isNew && (
          <span className="absolute top-3 left-3 z-10 bg-black text-white text-[14px] font-medium tracking-wider uppercase px-2 py-1 rounded-sm shadow-sm">
            New
          </span>
        )}
      </div>

      <div className="px-3 pb-3 md:px-4 md:pb-4 flex flex-col flex-1 text-left bg-[#FDFCFB] relative">
        
        {/* Rating Right Below Image aligned to Right */}
        <div className="flex justify-end mb-1 mt-1.5 md:mt-2">
          {/* Rating placeholder removed for a cleaner look */}
        </div>

        {/* Product Title */}
        <h3 className="font-sans text-[12px] sm:text-[13px] md:text-[18px] text-[#C29D59] mb-1 md:mb-2 leading-snug line-clamp-2">
          {name}
        </h3>

        {/* Price Row */}
        <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-2 md:mb-4 mt-auto">
          {activeDiscountPrice ? (
            <>
               <span className="text-[14px] sm:text-[16px] md:text-[24px] font-bold text-[#111] leading-none">
                 {"\u20B9"}{parseInt(activeDiscountPrice.replace(/[^\d]/g, "")).toLocaleString()}
               </span>
               <span className="text-[#747e8e] line-through text-[11px] md:text-[15px] font-medium">
                 {"\u20B9"}{parseInt(price.replace(/[^\d]/g, "")).toLocaleString()}
               </span>
               {activeDiscountPercent > 0 && (
                 <span className="bg-[#489b6f] text-white text-[9px] md:text-[13px] font-bold px-1.5 py-[2px] rounded tracking-wide">
                   {activeDiscountPercent}% off
                 </span>
               )}
            </>
          ) : (
             <span className="text-[14px] sm:text-[16px] md:text-[24px] font-bold text-[#111] leading-none">
               {"\u20B9"}{parseInt(price.replace(/[^\d]/g, "")).toLocaleString()}
             </span>
          )}
        </div>

        {/* ADD TO CART Button */}
        <button 
          onClick={handleAddToCart}
          className="w-full py-1.5 md:py-[10px] bg-[#DEB87A] hover:bg-[#D0A96B] text-black font-sans font-bold uppercase tracking-wider text-[10px] sm:text-[11px] md:text-[15px] rounded-full transition-all flex items-center justify-center gap-1 md:gap-2"
        >
          <span className="whitespace-nowrap">ADD TO CART</span>
          <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 text-black fill-black shrink-0" />
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
